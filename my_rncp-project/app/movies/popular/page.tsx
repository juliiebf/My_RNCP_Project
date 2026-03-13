'use client';

import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import SortSelect from '@/components/SortSelect';
import Pagination from '@/components/Pagination';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  media_type: "movie" | "tv";
  vote_count: number;
  vote_average: number;
};

export default function PopularMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    fetchPopularMovies(currentPage, sortBy);
  }, [currentPage, sortBy]);

  const fetchPopularMovies = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      
      // Filtre minimum 1000 votes pour avoir que les films vraiment connus
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr-FR&page=${page}&sort_by=${sort}&include_adult=false&vote_count.gte=1000`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const validMovies = data.results?.filter((movie: any) => 
        movie.poster_path && movie.vote_average
      ).map((movie: any) => ({ 
        ...movie, 
        media_type: 'movie' 
      })) || [];
      
      setMovies(validMovies);
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (error) {
      console.error('Erreur:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  return (
  <div className="min-h-screen">
    <div className="px-4">
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              Films les plus populaires
            </h1>
            <p className="text-gray-400 text-lg">
              Les films les plus connus et reconnus de tous les temps
            </p>
          </div>
          <SortSelect value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'release_date.desc', label: 'Plus récents' },
              { value: 'popularity.desc', label: 'Les plus populaires' },
              { value: 'vote_average.desc', label: 'Mieux notés' },
              { value: 'title.asc', label: 'A-Z' },
          
            ]} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-gray-400 mt-4">Chargement...</p>
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="cards-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">Aucun film trouvé</p>
        </div>
      )}

    </div>
  </div>
);
}