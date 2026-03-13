'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import SortSelect from '@/components/SortSelect';
import Pagination from '@/components/Pagination';

type TVShow = {
  id: number;
  name: string;
  poster_path: string;
  media_type: "movie" | "tv";
  popularity: number;
  vote_average: number;
};

const genreNames: { [key: string]: string } = {
  '10759': 'Action & Adventure',
  '16': 'Animation',
  '35': 'Comédie',
  '80': 'Crime',
  '99': 'Documentaire',
  '18': 'Drame',
  '10751': 'Famille',
  '10762': 'Kids',
  '9648': 'Mystère',
  '10763': 'News',
  '10764': 'Reality',
  '10765': 'Sci-Fi & Fantasy',
  '10766': 'Soap',
  '10767': 'Talk',
  '10768': 'War & Politics',
  '37': 'Western',
};

export default function TVGenrePage() {
  const params = useParams();
  const genreId = (params.id as string).split('-')[0];
  const genreName = genreNames[genreId] || 'Genre';
  const genreLabels: { [key: string]: { title: string; description: string } } = {
  '10759': { title: 'Action & Aventure',        description: "Séries d'action et d'aventure" },
  '16':    { title: 'Animation',                description: "Séries animées" },
  '35':    { title: 'Comédie',                  description: "Séries comiques" },
  '80':    { title: 'Crime',                    description: "Séries criminelles" },
  '99':    { title: 'Documentaire',             description: "Documentaires" },
  '18':    { title: 'Drame',                    description: "Séries dramatiques" },
  '10751': { title: 'Famille',                  description: "Séries familiales" },
  '10762': { title: 'Jeunesse',                 description: "Séries pour enfants" },
  '9648':  { title: 'Mystère',                  description: "Séries mystérieuses" },
  '10763': { title: 'Actualités',               description: "Émissions d'actualités" },
  '10764': { title: 'Télé-réalité',             description: "Émissions de télé-réalité" },
  '10765': { title: 'Science-Fiction & Fantasy', description: "Séries de science-fiction et fantasy" },
  '10766': { title: 'Soap Opera',               description: "Soap operas" },
  '10767': { title: 'Talk-show',                description: "Talk-shows" },
  '10768': { title: 'Guerre & Politique',       description: "Séries de guerre et politiques" },
  '37':    { title: 'Western',                  description: "Séries western" },
};

const genreLabel = genreLabels[genreId] || { title: 'Genre', description: 'Exploration' };

  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    if (genreId) {
      fetchShowsByGenre(currentPage, sortBy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreId, currentPage, sortBy]);

  const fetchShowsByGenre = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      // Utilise le sortBy dans la requête
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=fr-FR&sort_by=${sort}&include_adult=false&page=${page}&with_genres=${genreId}`;

      const response = await fetch(url);
      const data = await response.json();

      setShows(data.results?.map((show: any) => ({ ...show, media_type: 'tv' })) || []);
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (error) {
      console.error('Erreur:', error);
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Remet à la page 1 quand on change le tri
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              {genreLabel.title}
              </h1>
              <p className="text-gray-400 text-lg">
                {genreLabel.description}
            </p>
          </div>
          <SortSelect
            value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'popularity.desc', label: 'Les plus populaires' },
              { value: 'vote_average.desc', label: 'Mieux notés' },
              { value: 'first_air_date.desc', label: 'Plus récentes' },
              { value: 'first_air_date.asc', label: 'Plus anciennes' },
              { value: 'name.asc', label: 'A-Z' },
            ]}
          />
        </div>

        {/* Résultats */}
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
            <p className="text-gray-400 text-xl">
              Aucune série trouvée dans ce genre
            </p>
          </div>
        )}

      </div>
    </div>
  );
}