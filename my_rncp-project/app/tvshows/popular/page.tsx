'use client';

import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import SortSelect from '@/components/SortSelect';
import Pagination from '@/components/Pagination';

type TVShow = {
  id: number;
  name: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
  vote_count: number;
  vote_average: number;
};

export default function PopularTVShowsPage() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    fetchPopularShows(currentPage, sortBy);
  }, [currentPage, sortBy]);

  const fetchPopularShows = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

      const url =
        `https://api.themoviedb.org/3/discover/tv` +
        `?api_key=${apiKey}` +
        `&language=fr-FR` +
        `&include_adult=false` +
        `&page=${page}` +
        `&sort_by=${sort}` +
        `&vote_count.gte=500`;

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
    <div className="min-h-screen">
      <div className="px-4">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                Séries les plus populaires
              </h1>
              <p className="text-gray-400 text-lg">
                Les séries les plus connues et regardées
              </p>
            </div>

            <SortSelect
              value={sortBy}
              onChange={handleSortChange}
              options={[
                { value: 'first_air_date.desc', label: 'Plus récents' },
                { value: 'popularity.desc', label: 'Les plus populaires' },
                { value: 'vote_average.desc', label: 'Mieux notés' },
                { value: 'name.asc', label: 'A-Z' },
              ]}
            />
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
