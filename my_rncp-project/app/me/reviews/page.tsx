'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Review {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  rating: number;
  comment: string | null;
  createdAt: string;
  title?: string;
  poster_path?: string;
}

export default function MesReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
console.log('Review IDs:', reviews.map(r => r.id));  // ajoute ligne 20

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reviews/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Fetch TMDB pour chaque review
        const enrichedReviews = await Promise.all(
          data.map(async (review: Review) => {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/${review.mediaType === 'movie' ? 'movie' : 'tv'}/${review.tmdbId}?language=fr-FR&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            const tmdbData = await tmdbRes.json();
            
            return {
              ...review,
              title: tmdbData.title || tmdbData.name || `ID ${review.tmdbId}`,
              poster_path: tmdbData.poster_path
            };
          })
        );
        
        setReviews(enrichedReviews);
      }
    } catch (error) {
      console.error('Erreur reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string, title: string) => {
    if (confirm(`Supprimer "${title}" ?`)) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          window.location.reload();
        } else {
          alert('Erreur suppression');
        }
      } catch (error) {
        alert('Erreur réseau');
      }
    }
  };

  if (loading) return <div className="container mx-auto p-8 text-center">Chargement...</div>;

  return (
  <div className="min-h-screen py-8">
    <div className="px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">
          Mes Reviews
        </h1>
        <p className="text-gray-400 text-lg">
          {reviews.length} avis
        </p>
      </div>

      {/* Reviews grille */}
      <div className="cards-grid">
        {reviews.map((review) => (
  <div key={review.id} className="group relative">
    <Link href={review.mediaType === 'tv' ? `/tvshows/${review.tmdbId}` : `/movies/${review.tmdbId}`}>
      <div className="cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-all hover:scale-105 shadow-lg h-[350px] flex flex-col">
        <div className="relative flex-1">
          {review.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${review.poster_path}`}
              alt={review.title}
              fill
              className="object-cover group-hover:opacity-90"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <span className="text-gray-600 text-4xl">🎬</span>
            </div>
          )}
          {/* Badge note */}
          <div className="absolute top-2 left-2 bg-black/70 rounded-full text-yellow-400 text-md font-bold" style={{ padding: '2px 8px' }}>
            {review.rating}/10
          </div>
        </div>
        <div className="px-3 py-2 bg-gray-900">
          <h3 className="text-white text-sm font-medium line-clamp-1">{review.title}</h3>
          <span className={`text-xs font-medium mt-0.5 block ${review.mediaType === 'movie' ? 'text-yellow-400' : 'text-blue-400'}`}>
            {review.mediaType === 'movie' ? 'Film' : 'Série'}
          </span>
          {review.comment && (
            <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{review.comment}</p>
          )}
        </div>
      </div>
    </Link>
    {/* Bouton supprimer*/}
    <button
      onClick={() => deleteReview(review.id, review.title || '')}
      className="absolute top-2 right-2 p-1.5 bg-black/70 text-red-400 hover:text-red-300 hover:bg-black/90 rounded-full transition-all opacity-0 group-hover:opacity-100"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
))}
</div>

      {reviews.length === 0 && (
        <div className="text-center py-24">
          <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-8 flex items-center justify-center">
          </div>
          <h2 className="text-3xl font-bold text-gray-400 mb-4">Aucune review</h2>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Note tes premiers films et séries pour commencer ta collection personnelle.
          </p>
        </div>
      )}
    </div>
  </div>
);
}
