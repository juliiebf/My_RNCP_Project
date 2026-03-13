'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type TrendingItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  overview: string;
  release_date?: string;
  first_air_date?: string;
};

export default function HomePage() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [hero, setHero] = useState<TrendingItem | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=fr-FR`
        );
        const data = await res.json();
        const results = data.results?.filter((i: any) => i.backdrop_path && i.poster_path).slice(0, 10) || [];
        setTrending(results);
        setHero(results[0] || null);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => {
        const next = (prev + 1) % trending.length;
        setHero(trending[next]);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [trending]);

  const heroTitle = hero?.title || hero?.name || '';
  const heroYear = (hero?.release_date || hero?.first_air_date || '').split('-')[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: 'white' }}>

      {/* HERO */}
      <section style={{ position: 'relative', width: '100%', height: '65vh', minHeight: '600px', overflow: 'hidden' }}>
        {hero?.backdrop_path && (
          <Image
            key={hero.id}
            src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
            alt={heroTitle}
            fill
            className="object-cover"
            priority
          />
        )}

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #030712 0%, rgba(3,7,18,0.5) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(3,7,18,0.9) 0%, rgba(3,7,18,0.4) 50%, transparent 100%)' }} />

        {/* Hero content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '0 32px 40px 32px', maxWidth: '600px' }}>
          {hero && (
            <>
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: '999px',
                fontSize: '16px', fontWeight: 'bold', marginBottom: '16px',
                backgroundColor: hero.media_type === 'tv' ? 'rgba(59,130,246,0.8)' : 'rgba(234,179,8,0.8)',
                color: hero.media_type === 'tv' ? 'white' : 'black',
              }}>
                {hero.media_type === 'tv' ? 'Série' : 'Film'}
              </span>

              <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '12px', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                {heroTitle}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ color: '#facc15', fontWeight: 'bold' }}>⭐ {hero.vote_average.toFixed(1)}</span>
                {heroYear && <span style={{ color: '#9ca3af' }}>{heroYear}</span>}
              </div>

              <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {hero.overview || 'Pas de synopsis disponible'}
              </p>

              <Link
                href={`/${hero.media_type === 'tv' ? 'tvshows' : 'movies'}/${hero.id}`}
                style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#facc15', color: 'black', fontWeight: 'bold', borderRadius: '999px', textDecoration: 'none' }}
              >
                Voir plus →
              </Link>
            </>
          )}
        </div>

        {/* Miniatures */}
        <div style={{ position: 'absolute', bottom: '32px', right: '32px', display: 'flex', gap: '8px' }}>
          {trending.slice(0, 5).map((item, i) => (
            <button
              key={item.id}
              onClick={() => { setHero(item); setHeroIndex(i); }}
              style={{
                width: '48px', height: '64px', borderRadius: '8px', overflow: 'hidden', padding: 0,
                border: i === heroIndex ? '2px solid #facc15' : '2px solid transparent',
                opacity: i === heroIndex ? 1 : 0.5,
                transform: i === heroIndex ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                alt={item.title || item.name || ''}
                width={48}
                height={64}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* TENDANCES */}
      <section style={{ padding: '20px 32px' }}>
        <h2 style={{ fontSize: '38px', fontWeight: 'bold', color: 'white', marginBottom: '18px' }}>
          Tendances cette semaine
        </h2>
        <div className="cards-grid">
          {trending.map((item) => (
            <Link
              key={item.id}
              href={`/${item.media_type === 'tv' ? 'tvshows' : 'movies'}/${item.id}`}
              className="group relative rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-all shadow-lg"
              style={{ aspectRatio: '2/3', display: 'block' }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                alt={item.title || item.name || ''}
                fill
                className="object-cover group-hover:opacity-80 transition"
              />
              <span style={{
                position: 'absolute', top: '8px', left: '8px',
                padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold',
                backgroundColor: item.media_type === 'tv' ? 'rgba(59,130,246,0.8)' : 'rgba(234,179,8,0.8)',
                color: item.media_type === 'tv' ? 'white' : 'black',
              }}>
                {item.media_type === 'tv' ? 'Série' : 'Film'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* EXPLORER */}
      <section style={{ padding: '0 32px 48px 32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>Explorer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/movies/popular', label: 'Films populaires', color: '#eab308' },
            { href: '/movies/latest', label: 'Dernières sorties films', color: '#f97316' },
            { href: '/tvshows/popular', label: 'Séries populaires', color: '#3b82f6' },
            { href: '/tvshows/latest', label: 'Nouvelles séries', color: '#a855f7' },
          ].map(({ href, label, color }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block', padding: '24px', borderRadius: '12px',
                border: `1px solid ${color}40`,
                backgroundColor: `${color}15`,
                textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}></div>
              <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{label}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* GENRES FILMS */}
      <section style={{ padding: '0 32px 48px 32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>Genres Films</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { id: '28', name: 'Action' },
            { id: '35', name: 'Comédie' },
            { id: '18', name: 'Drame' },
            { id: '27', name: 'Horreur' },
            { id: '878', name: 'Science-Fiction' },
            { id: '10749', name: 'Romance' },
            { id: '53', name: 'Thriller' },
            { id: '16', name: 'Animation' },
            { id: '12', name: 'Aventure' },
            { id: '80', name: 'Crime' },
            { id: '14', name: 'Fantasy' },
            { id: '99', name: 'Documentaire' },
          ].map((genre) => (
            <Link
              key={genre.id}
              href={`/movies/genre/${genre.id}-${genre.name.toLowerCase()}`}
              style={{
                padding: '8px 16px', backgroundColor: '#1f2937', border: '1px solid #374151',
                color: '#d1d5db', borderRadius: '999px', fontSize: '14px',
                fontWeight: '500', textDecoration: 'none',
              }}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </section>

      {/* GENRES SERIES */}
      <section style={{ padding: '0 32px 64px 32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}> Genres Séries</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { id: '18', name: 'Drame' },
            { id: '35', name: 'Comédie' },
            { id: '80', name: 'Crime' },
            { id: '10765', name: 'Sci-Fi & Fantasy' },
            { id: '10759', name: 'Action' },
            { id: '9648', name: 'Mystère' },
            { id: '16', name: 'Animation' },
            { id: '99', name: 'Documentaire' },
            { id: '10751', name: 'Famille' },
            { id: '10768', name: 'Guerre & Politique' },
          ].map((genre) => (
            <Link
              key={genre.id}
              href={`/tvshows/genre/${genre.id}-${genre.name.toLowerCase().replace(/ /g, '-').replace(/&/g, '')}`}
              style={{
                padding: '8px 16px', backgroundColor: '#1f2937', border: '1px solid #374151',
                color: '#d1d5db', borderRadius: '999px', fontSize: '14px',
                fontWeight: '500', textDecoration: 'none',
              }}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}