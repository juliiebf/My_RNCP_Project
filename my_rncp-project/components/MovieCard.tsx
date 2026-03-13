"use client";
import Link from "next/link";
import Image from "next/image";
import WatchlistButton from "./WatchlistButton";

export type Movie = {  // EXPORTÉ
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  media_type?: 'movie' | 'tv';
};

export type MovieCardProps = {
  movie: Movie;
  initialStatus?: 'none' | 'wishlist';
};

export default function MovieCard({ movie, initialStatus = 'none' }: MovieCardProps) {
  const mediaType: 'movie' | 'tv' = (movie.media_type as 'movie' | 'tv') || 'movie';
  const href = mediaType === 'movie' ? `/movies/${movie.id}` : `/tvshows/${movie.id}`;
  const displayTitle = movie.title || movie.name || "Sans titre";

  return (
    <div className="group relative">
      <Link href={href}>
        <div className="cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-all hover:scale-105 shadow-lg h-[350px] flex flex-col">
          <div className="relative flex-1">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={displayTitle}
                fill
                className="object-cover group-hover:opacity-90"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <span className="text-gray-600 text-4xl"></span>
              </div>
            )}
          </div>
          <div className="px-3 py-2 bg-gray-900">
            <h3 className="text-white text-sm font-medium line-clamp-1">{displayTitle}</h3>
            <span className={`text-xs font-medium mt-0.5 block ${mediaType === 'movie' ? 'text-yellow-400' : 'text-blue-400'}`}>
              {mediaType === 'movie' ? 'Film' : 'Série'}
              </span>
              </div>
        </div>
      </Link>
      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto" style={{ transform: 'scale(0.90)', transformOrigin: 'bottom center' }}>
        <WatchlistButton 
          mediaId={movie.id}
          mediaType={mediaType}
          title={displayTitle}
          posterPath={movie.poster_path || null}
        />
      </div>
    </div>
  );
}
