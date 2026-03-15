'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import MovieCard from '@/components/MovieCard';
import WatchlistButton from '@/components/WatchlistButton';
import ReviewForm from '@/components/ReviewForm';

type SeriesDetails = {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  episode_run_time?: number[];
};

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string;
};

export default function SeriesDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [series, setSeries] = useState<SeriesDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSeriesDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
  if (id && series) {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tmdbId: Number(id),
        mediaType: "series",
      }),
    })
  }
}, [series, id])

 const fetchSeriesDetails = async () => {
  setLoading(true);
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    const [seriesRes, creditsRes, keywordsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/tv/${id}/keywords?api_key=${apiKey}`),
    ]);
    const [seriesData, creditsData, keywordsData] = await Promise.all([
      seriesRes.json(), creditsRes.json(), keywordsRes.json()
    ]);
    setSeries(seriesData);
    setCast(creditsData.cast?.slice(0, 10) || []);

    const keywordIds = keywordsData.results?.slice(0, 5).map((k: any) => k.id).join('|');

    if (keywordIds) {
      const r = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=fr-FR&with_keywords=${keywordIds}&sort_by=popularity.desc&vote_count.gte=20`
      );
      const d = await r.json();
      const results = d.results
        ?.filter((i: any) => i.id !== seriesData.id && i.poster_path)
        .slice(0, 12)
        .map((i: any) => ({ ...i, media_type: 'tv' })) || [];
      setSimilar(results);
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl">Série non trouvée</p>
      </div>
    );
  }

  const runtime = series.episode_run_time?.[0];

  return (
    <div className="min-h-screen">

      {/* Backdrop plein écran */}
      {series.backdrop_path && (
        <div className="relative w-full h-[320px] -mx-4">
          <Image
            src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
            alt={series.name}
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
          {series.poster_path && (
            <div className="flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
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
              {series.name}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 items-center text-gray-300 text-base" style={{ marginTop: '12px', marginBottom: '12px' }}>
              {series.vote_average > 0 && (
                <span
                  className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full font-semibold text-md"
                  style={{ padding: '2px 10px' }}
                >
                  {series.vote_average.toFixed(1)}<span className="text-gray-500 font-normal">/10</span>
                </span>
              )}
              {series.first_air_date && (
                <span className="bg-gray-800 rounded-full text-md" style={{ padding: '2px 10px' }}>
                  {series.first_air_date.split('-')[0]}
                </span>
              )}
              {runtime && runtime > 0 && (
                <span className="bg-gray-800 rounded-full text-md" style={{ padding: '2px 10px' }}>
                  {runtime} min / épisode
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6 px-3 py-1">
              {series.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 text-gray-300 rounded-full text-sm transition-colors px-3 py-1 cursor-pointer hover:bg-gray-700"
                  style={{ padding: '1px 4px' }}>
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="mb-8 max-w-2xl" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-widest mb-3" style={{ marginTop: '20px', marginBottom: '10px' }}>Synopsis</h2>
              <p className="text-gray-300 leading-relaxed text-md">
                {series.overview || 'Pas de synopsis disponible'}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 flex-wrap" style={{ marginBottom: '20px' }}>
              <WatchlistButton
                mediaId={series.id}
                mediaType="tv"
                title={series.name}
                posterPath={series.poster_path}
              />
            </div>
          </div>
        </div>

        {/* Casting */}
        {cast.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-widest mb-6" style={{ marginTop: '10px', marginBottom: '15px' }}>Casting</h2>
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
          <ReviewForm tmdbId={series.id} mediaType="tv" title={series.name} />
        </div>
      </div>

      {/* Séries similaires */}
      {similar.length > 0 && (
        <div className="mt-20 px-4">
          <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-widest mb-6" style={{ marginTop: '20px', marginBottom: '5px' }}>Séries similaires</h2>
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