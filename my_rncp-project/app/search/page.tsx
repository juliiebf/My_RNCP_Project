'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import MovieCard, { Movie } from '@/components/MovieCard';
import Pagination from '@/components/Pagination';

type MediaItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [allResults, setAllResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 20;

  useEffect(() => {
  if (query) {
    setCurrentPage(1);
    searchContent(query);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [query]);

  const searchContent = async (searchQuery: string) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      
      // Récupère plusieurs pages de résultats directs
      const directPromises = [1, 2, 3].map(page => 
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&language=fr-FR&page=${page}`)
          .then(res => res.json())
      );
      
      const directPages = await Promise.all(directPromises);
      
      // Combine tous les résultats
      let directResults: MediaItem[] = [];
      directPages.forEach(data => {
        const filtered = data.results?.filter(
          (item: MediaItem) => item.media_type === 'movie' || item.media_type === 'tv'
        ) || [];
        directResults = [...directResults, ...filtered];
      });
      
   // Trie par pertinence
directResults = directResults.sort((a: any, b: any) => {
  // Calcul du score de pertinence
  const scoreA = (a.popularity || 0) * 0.5 + (a.vote_average || 0) * 2 + (a.vote_count || 0) * 0.01;
  const scoreB = (b.popularity || 0) * 0.5 + (b.vote_average || 0) * 2 + (b.vote_count || 0) * 0.01;
  
  return scoreB - scoreA;
});

      // Récupère les contenus similaires basés sur le premier résultat
      let similarResults: MediaItem[] = [];
      if (directResults.length > 0) {
        const firstResult = directResults[0];
        similarResults = await fetchSimilarContent(firstResult.id, firstResult.media_type || 'movie');
      }

      // Supprime les doublons
      const directIds = new Set(directResults.map((item: MediaItem) => item.id));
      const uniqueSimilar = similarResults.filter((item: MediaItem) => !directIds.has(item.id));

      // Combine : résultats directs + similaires
      const combined = [...directResults, ...uniqueSimilar];
      
      setAllResults(combined);
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarContent = async (id: number, mediaType: string): Promise<MediaItem[]> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const type = mediaType === 'movie' ? 'movie' : 'tv';
      
      // Récupère plusieurs pages de contenus similaires
      const similarPromises = [1, 2].map(page =>
        fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${apiKey}&language=fr-FR&page=${page}`)
          .then(res => res.json())
      );
      
      const similarPages = await Promise.all(similarPromises);
      
      let allSimilar: MediaItem[] = [];
      similarPages.forEach(data => {
        const withMediaType = (data.results || []).map((item: any) => ({
          ...item,
          media_type: type
        }));
        allSimilar = [...allSimilar, ...withMediaType];
      });
      
      return allSimilar;
    } catch (error) {
      console.error('❌ Erreur récupération similaires:', error);
      return [];
    }
  };

  const filteredResults = allResults.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'movie') return item.media_type === 'movie';
    if (filter === 'tv') return item.media_type === 'tv';
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8">
      <div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Résultats de recherche
          </h1>
          <p className="text-gray-400 text-lg">
            {query && `Recherche pour : "${query}"`}
          </p>
          {!loading && filteredResults.length > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filtres */}
<div className="flex gap-2 mb-8 bg-gray-900 p-1 rounded-xl w-fit">
  <button
    onClick={() => { setFilter('all'); setCurrentPage(1); }}
    className={`px-5 py-2 rounded-lg text-base font-semibold tracking-wide transition-all duration-200 ${
      filter === 'all'
        ? 'bg-yellow-400 text-black shadow-md'
        : 'text-gray-400 hover:text-white'
    }`}
  >
    Tout <span className="opacity-60 text-sm ml-1">{allResults.length}</span>
  </button>
  <button
    onClick={() => { setFilter('movie'); setCurrentPage(1); }}
    className={`px-5 py-2 rounded-lg text-base font-semibold tracking-wide transition-all duration-200 ${
      filter === 'movie'
        ? 'bg-yellow-400 text-black shadow-md'
        : 'text-gray-400 hover:text-white'
    }`}
  >
    Films <span className="opacity-60 text-sm ml-1">{allResults.filter(r => r.media_type === 'movie').length}</span>
  </button>
  <button
    onClick={() => { setFilter('tv'); setCurrentPage(1); }}
    className={`px-5 py-2 rounded-lg text-base font-semibold tracking-wide transition-all duration-200 ${
      filter === 'tv'
        ? 'bg-yellow-400 text-black shadow-md'
        : 'text-gray-400 hover:text-white'
    }`}
  >
    Séries <span className="opacity-60 text-ml ml-1">{allResults.filter(r => r.media_type === 'tv').length}</span>
  </button>
</div>

        {/* Résultats */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            <p className="text-gray-400 mt-4">Recherche en cours...</p>
          </div>
        ) : currentResults.length > 0 ? (
          <>
            <div className="cards-grid mb-8">
             {currentResults.map((item: MediaItem) => (
  <MovieCard 
    key={`result-${item.id}`} 
    movie={{
      id: item.id,
      title: item.title,
      name: item.name,
      poster_path: item.poster_path,
      media_type: (item.media_type as 'movie' | 'tv') || 'movie'
    } as Movie}
  />
))}

            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              😕 Aucun résultat trouvé pour &quot;{query}&quot;
            </p>
            <p className="text-gray-500 mt-2">
              Essayez avec d&apos;autres mots-clés
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
