'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import SortSelect from '@/components/SortSelect';
import Pagination from '@/components/Pagination';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  media_type: "movie" | "tv";
  popularity: number;
  vote_average: number;
};

const genreNames: { [key: string]: string } = {
  '28': 'Action',
  '12': 'Aventure',
  '16': 'Animation',
  '35': 'Comédie',
  '80': 'Crime',
  '99': 'Documentaire',
  '18': 'Drame',
  '10751': 'Famille',
  '14': 'Fantasy',
  '36': 'Histoire',
  '27': 'Horreur',
  '10402': 'Musique',
  '9648': 'Mystère',
  '10749': 'Romance',
  '878': 'Science-Fiction',
  '10770': 'Téléfilm',
  '53': 'Thriller',
  '10752': 'Guerre',
  '37': 'Western',
};

export default function MovieGenrePage() {
  const params = useParams();
const rawId = params.id as string;
const genreId = rawId.split('-')[0]; // "28-action" → "28"

const genreLabels: { [key: string]: { title: string; description: string } } = {
  '28':    { title: 'Action',          description: "Films d'action" },
  '12':    { title: 'Aventure',        description: "Films d'aventure" },
  '16':    { title: 'Animation',       description: "Films animés" },
  '35':    { title: 'Comédie',         description: "Films comiques" },
  '80':    { title: 'Crime',           description: "Films criminels" },
  '99':    { title: 'Documentaire',    description: "Documentaires" },
  '18':    { title: 'Drame',           description: "Films dramatiques" },
  '10751': { title: 'Famille',         description: "Films familiaux" },
  '14':    { title: 'Fantasy',         description: "Films fantastiques" },
  '36':    { title: 'Histoire',        description: "Films historiques" },
  '27':    { title: 'Horreur',         description: "Films d'horreur" },
  '10402': { title: 'Musique',         description: "Films musicaux" },
  '9648':  { title: 'Mystère',         description: "Films mystérieux" },
  '10749': { title: 'Romance',         description: "Films romantiques" },
  '878':   { title: 'Science-Fiction', description: "Films de science-fiction" },
  '10770': { title: 'Téléfilm',        description: "Téléfilms" },
  '53':    { title: 'Thriller',        description: "Thrillers" },
  '10752': { title: 'Guerre',          description: "Films de guerre" },
  '37':    { title: 'Western',         description: "Films western" },
};

const genreLabel = genreLabels[genreId] || { title: 'Genre', description: 'Exploration' };
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    if (genreId) {
      fetchMoviesByGenre(currentPage, sortBy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreId, currentPage, sortBy]);

  const fetchMoviesByGenre = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      // Utilise le sortBy dans la requête
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=${sort}&include_adult=false&include_video=false&page=${page}&with_genres=${genreId}`;

      const response = await fetch(url);
      const data = await response.json();

      setMovies(data.results?.map((movie: any) => ({ ...movie, media_type: 'movie' })) || []);
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

  // Remet à la page 1 quand on change le tri
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="px-4">
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
              { value: 'release_date.desc', label: 'Plus récents' },
              { value: 'release_date.asc', label: 'Plus anciens' },
              { value: 'title.asc', label: 'A-Z' },
            ]}
          />
        </div>

        {/* Résultats */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            <p className="text-gray-400 mt-4">Chargement...</p>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="cards-grid mb-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              Aucun film trouvé dans ce genre
            </p>
          </div>
        )}

      </div>
    </div>
  );
}