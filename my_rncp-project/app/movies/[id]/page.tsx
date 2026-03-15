'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import MovieCard from '@/components/MovieCard';
import WatchlistButton from '@/components/WatchlistButton';
import ReviewForm from '@/components/ReviewForm';

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string }[];
};

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string;
};

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovieDetails = async () => {
  setLoading(true);
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    const [movieRes, creditsRes, keywordsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${apiKey}`),
    ]);
    const [movieData, creditsData, keywordsData] = await Promise.all([
      movieRes.json(), creditsRes.json(), keywordsRes.json()
    ]);
    setMovie(movieData);
    setCast(creditsData.cast?.slice(0, 10) || []);

    const seen = new Set<number>([movieData.id]);
    const merged: any[] = [];

    // Même saga/collection (priorité max)
    if (movieData.belongs_to_collection?.id) {
      const r = await fetch(
        `https://api.themoviedb.org/3/collection/${movieData.belongs_to_collection.id}?api_key=${apiKey}&language=fr-FR`
      );
      const d = await r.json();
      for (const item of d.parts || []) {
        if (!seen.has(item.id) && item.poster_path) {
          seen.add(item.id);
          merged.push({ ...item, media_type: 'movie' });
        }
      }
    }

    // Keywords (même thème/univers)
    const keywordIds = keywordsData.keywords?.slice(0, 5).map((k: any) => k.id).join('|');
    if (keywordIds) {
      const r = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr-FR&with_keywords=${keywordIds}&sort_by=popularity.desc&vote_count.gte=20`
      );
      const d = await r.json();
      for (const item of d.results || []) {
        if (!seen.has(item.id) && item.poster_path) {
          seen.add(item.id);
          merged.push({ ...item, media_type: 'movie' });
        }
        if (merged.length >= 12) break;
      }
    }

    setSimilar(merged.slice(0, 12));

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (id) fetchMovieDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


useEffect(() => {
  if (id && movie) {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tmdbId: Number(id),
        mediaType: "movie",
      }),
    })
  }
}, [movie, id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl">Film non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Backdrop plein écran */}
      {movie.backdrop_path && (
        <div className="relative w-full h-[320px] -mx-4">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 to-transparent" />
        </div>
      )}

      {/* Contenu principal */}
      <div className="-mt-72 relative z-10 px-4">
        <div className="flex flex-col md:flex-row gap-10">

          {/* Poster */}
          {movie.poster_path && (
            <div className="flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={260}
                height={390}
                className="rounded-xl shadow-2xl"
              />
            </div>
          )}

          {/* Infos */}
          <div className="flex-1 pt-4">

            {/* Titre */}
            <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 items-center text-gray-300 text-base" style={{ marginTop: '12px', marginBottom: '12px' }}>
              {movie.vote_average > 0 && (
                <span
                  className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full font-semibold text-md"
                  style={{ padding: '2px 10px' }}
                >
                  {movie.vote_average.toFixed(1)}<span className="text-gray-500 font-normal">/10</span>
                </span>
              )}
              {movie.release_date && (
                <span className="bg-gray-800 rounded-full text-md" style={{ padding: '2px 10px' }}>
                  {movie.release_date.split('-')[0]}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="bg-gray-800 rounded-full text-md" style={{ padding: '2px 10px' }}>
                  {movie.runtime} min
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6 px-3 py-1">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 text-gray-300 rounded-full text-sm transition-colors px-3 py-1 cursor-pointer hover:bg-gray-700"
                  style={{ padding: '1px 4px' }}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-widest" style={{ marginTop: '20px', marginBottom: '10px' }}>Synopsis</h2>
              <p className="text-gray-300 leading-relaxed text-md max-w-2xl">
                {movie.overview || 'Pas de synopsis disponible'}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 flex-wrap" style={{ marginBottom: '20px' }}>
              <WatchlistButton
                mediaId={movie.id}
                mediaType="movie"
                title={movie.title}
                posterPath={movie.poster_path}
              />
            </div>
          </div>
        </div>

        {/* Casting */}
        {cast.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-widest" style={{ marginTop: '10px', marginBottom: '15px' }}>Casting</h2>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center group cursor-pointer">
                  {actor.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      width={100}
                      height={120}
                      className="rounded-lg mb-2 w-full max-w-[100px] mx-auto object-cover aspect-[2/3] group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-full max-w-[100px] mx-auto aspect-[2/3] bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-3xl">👤</span>
                    </div>
                  )}
                  <p className="text-white font-medium text-xs line-clamp-1">{actor.name}</p>
                  <p className="text-gray-500 text-xs line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review */}
        <div style={{ marginBottom: '40px', maxWidth: '672px', margin: '20px auto 40px auto' }}>
          <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-widest" style={{ marginTop: '20px', marginBottom: '5px' }}>Ta review</h2>
          <ReviewForm tmdbId={movie.id} mediaType="movie" title={movie.title} />
        </div>
      </div>

      {/* Films similaires */}
      {similar.length > 0 && (
        <div className="mt-20 px-4">
          <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-widest" style={{ marginTop: '20px', marginBottom: '5px' }}>Films similaires</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {similar.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}