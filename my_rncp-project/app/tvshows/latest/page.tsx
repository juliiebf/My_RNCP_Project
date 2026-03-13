'use client';

import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import SortSelect from '@/components/SortSelect';
import Pagination from '@/components/Pagination';

export default function LatestTVShowsPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('first_air_date.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchShows(currentPage, sortBy);
  }, [currentPage, sortBy]);

  const fetchShows = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=fr-FR&sort_by=${sort}&page=${page}&vote_count.gte=10`
      );
      const data = await res.json();
      // Filtre les séries sans poster
      setShows(data.results?.filter((s: any) => s.poster_path) || []);
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (e) {
      console.error('Erreur:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              Dernières séries
            </h1>
            <p className="text-gray-400 text-lg">
              Les séries les plus récentes
            </p>
          </div>
          <SortSelect
            value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'first_air_date.desc', label: 'Plus récentes' },
              { value: 'popularity.desc', label: 'Les plus populaires' },
              { value: 'vote_average.desc', label: 'Mieux notées' },
            ]}
          />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            <p className="text-gray-400 mt-4">Chargement...</p>
          </div>
        ) : (
          <>
            <div className="cards-grid mb-8">
              {shows.map((show: any) => (
                <MovieCard
                  key={show.id}
                  movie={{
                    id: show.id,
                    name: show.name,
                    poster_path: show.poster_path,
                    media_type: 'tv'
                  }}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}