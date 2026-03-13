'use client';

import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';

type TVShow = {
  id: number;
  name: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
  popularity: number;
  vote_average: number;
};

export default function AllTVShowsPage() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    fetchShows(currentPage, sortBy);
  }, [currentPage, sortBy]);

  const fetchShows = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

      const url =
        `https://api.themoviedb.org/3/discover/tv` +
        `?api_key=${apiKey}` +
        `&language=fr-FR` +
        `&include_adult=false` +
        `&page=${page}` +
        `&sort_by=${sort}`;

      const response = await fetch(url);
      const data = await response.json();

      const validShows =
        data.results?.filter((show: any) => show.poster_path) || [];

      setShows(
        validShows.map((show: any) => ({
          ...show,
          media_type: 'tv',
        }))
      );
      setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (error) {
      console.error('Erreur:', error);
      setShows([]);
      setTotalPages(1);
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                📺 Toutes les séries
              </h1>
              <p className="text-gray-400 text-lg">
                Les tendances du moment
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-gray-300 font-medium">Trier par :</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
              >
                <option value="popularity.desc">🔥 Tendances actuelles</option>
                <option value="vote_average.desc">⭐ Mieux notées</option>
                <option value="vote_count.desc">👥 Plus connues</option>
                <option value="first_air_date.desc">🆕 Plus récentes</option>
                <option value="first_air_date.asc">📅 Plus anciennes</option>
                <option value="name.asc">🔤 A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            <p className="text-gray-400 mt-4">Chargement...</p>
          </div>
        ) : shows.length > 0 ? (
          <>
            <div className="cards-grid mb-8">
              {shows.map((show) => (
                <MovieCard key={show.id} movie={show} />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Aucune série trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
