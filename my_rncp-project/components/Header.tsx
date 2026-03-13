'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // États dropdowns
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth - CLIENT ONLY + cookies sync
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Genres
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);

  // CLIENT ONLY - pas de localStorage serveur !
  const getStoredUser = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      if (typeof window !== 'undefined') localStorage.removeItem('user');
      return null;
    }
  }, []);

  // Load genres on demand
  const loadGenres = useCallback(async (type: 'movie' | 'tv') => {
    if (loadingGenres) return;
    setLoadingGenres(true);

    try {
      const endpoint = type === 'movie' ? 'genre/movie/list' : 'genre/tv/list';
      const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=fr`
      );
      const data = await res.json();
      
      if (type === 'movie') setMovieGenres(data.genres);
      else setTvGenres(data.genres);
    } catch (error) {
      console.error('Erreur genres:', error);
    } finally {
      setLoadingGenres(false);
    }
  }, [loadingGenres]);

  // Sync auth avec /api/auth/me (cookies)
useEffect(() => {
    const syncUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      }
    };

    syncUser();

    window.addEventListener('auth-change', syncUser);

    const interval = setInterval(syncUser, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('auth-change', syncUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // handleSearch
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // handleLogout
const handleLogout = async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');

  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });

  setIsAuthenticated(false);
  setUser(null);
  setProfileOpen(false);

  router.push('/');
};

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
      <div className="flex h-16 w-full items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="/" className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent hover:scale-105 transition-all m"style={{ marginRight: '26px' }}>
          MyShelf
        </Link>

        {/* Menu principal */}
        <div className="flex flex-1 items-center md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-8 text-lg">
              
             {/* Films - Genre > Sous-menu */}
<li className="relative group">
  <button className="text-gray-700 dark:text-gray-200 transition hover:text-yellow-500 font-semibold flex items-center gap-1 py-1 text-lg">
    Films
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Menu Films — visible au hover du li parent */}
  <ul className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 shadow-2xl rounded-xl border py-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-200">
    <li><Link href="/movies/latest" className="block px-6 py-4 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">Dernières sorties</Link></li>
    <li><Link href="/movies/popular" className="block px-6 py-4 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">Les plus populaires</Link></li>

    {/* Genres Films */}
    <li className="relative group/genres">
      <button
        onMouseEnter={() => { if (!movieGenres.length) loadGenres('movie'); }}
        className="w-full text-left px-6 py-4 hover:bg-yellow-100 dark:hover:bg-gray-800 text-lg font-bold border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        Genres
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {movieGenres.length > 0 && (
        <ul className="absolute top-0 left-full ml-2 w-72 bg-white dark:bg-gray-900 shadow-2xl rounded-xl border py-2 z-60 max-h-96 overflow-y-auto opacity-0 invisible group-hover/genres:opacity-100 group-hover/genres:visible transition-all duration-200 delay-200">
          {movieGenres.map(genre => (
            <li key={genre.id}>
              <Link
                href={`/movies/genre/${genre.id}-${genre.name.toLowerCase().replace(/&/g, '').replace(/ /g, '-').replace(/[^\w-]+/g, '')}`}
                className="block px-6 py-3 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg truncate hover:text-yellow-600"
              >
                {genre.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  </ul>
</li>

{/* Séries - Genre > Sous-menu */}
<li className="relative group">
  <button className="text-gray-700 dark:text-gray-200 transition hover:text-yellow-500 font-semibold flex items-center gap-1 py-1 text-lg">
    Séries
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Menu Séries — visible au hover du li parent */}
  <ul className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 shadow-2xl rounded-xl border py-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-200">
    <li><Link href="/tvshows/latest" className="block px-6 py-4 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg font-semibold border-b border-gray-200 dark:border-gray-700"> Dernières sorties</Link></li>
    <li><Link href="/tvshows/popular" className="block px-6 py-4 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg font-semibold border-b border-gray-200 dark:border-gray-700"> Les plus populaires</Link></li>

    {/* Genres Séries */}
    <li className="relative group/genresseries">
      <button
        onMouseEnter={() => { if (!tvGenres.length) loadGenres('tv'); }}
        className="w-full text-left px-6 py-4 hover:bg-yellow-100 dark:hover:bg-gray-800 text-lg font-bold border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        Genres
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {tvGenres.length > 0 && (
        <ul className="absolute top-0 left-full ml-2 w-72 bg-white dark:bg-gray-900 shadow-2xl rounded-xl border py-2 z-60 max-h-96 overflow-y-auto opacity-0 invisible group-hover/genresseries:opacity-100 group-hover/genresseries:visible transition-all duration-200 delay-200">
          {tvGenres.map(genre => (
            <li key={genre.id}>
              <Link
                href={`/tvshows/genre/${genre.id}-${genre.name.toLowerCase().replace(/&/g, '').replace(/ /g, '-').replace(/[^\w-]+/g, '')}`}
                className="block px-6 py-3 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg truncate hover:text-yellow-600"
              >
                {genre.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  </ul>
</li>
</ul>
</nav>
          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="hidden lg:flex relative mx-8 flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un film, série..."
              className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-yellow-500/20 rounded-lg transition">
              <svg className="w-6 h-6 text-gray-500 hover:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

         {/* Auth */}
          <div className="flex items-center gap-4 ml-4">
            {isAuthenticated && user ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                    color: '#facc15',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#eab308',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '13px',
                  }}>
                    {(user.username || user.name || user.email?.split('@')[0])?.[0]?.toUpperCase()}
                  </span>
                  {user.username || user.name || user.email?.split('@')[0]}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-900 shadow-2xl rounded-xl border py-3 z-50">
                    <Link href="/me/reviews" className="block px-6 py-4 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">Mes Reviews</Link>
                    <Link href="/me/watchlist" className="block px-6 py-4 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">Ma Watchlist</Link>
                    <Link href="/me/views" className="block px-6 py-4 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">Mes Vues</Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <Link href="/me/settings" className="block px-6 py-4 hover:bg-yellow-50 dark:hover:bg-gray-800 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">Paramètres</Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" style={{padding: '10px 24px'}} className="rounded-xl bg-yellow-500 text-base font-bold text-black transition hover:bg-yellow-400 shadow-lg">
                  Login
                </Link>
                <Link href="/auth/register" style={{padding: '10px 24px'}} className="rounded-xl bg-gray-800 text-base font-bold text-yellow-400 border border-yellow-500 transition hover:bg-gray-700 shadow-lg sm:block hidden">
                  Register
                </Link>
              </div>
            )}
          </div>

        </div> {/* fin flex-1 menu principal */}

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 -mr-1 rounded-lg text-gray-700 dark:text-gray-200 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-800"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div> {/* fin flex h-16 */}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-6">
          <nav className="grid gap-4 text-lg">
            <Link href="/movies/latest" className="block py-4 px-6 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-xl font-semibold" onClick={() => setMobileOpen(false)}>Films récents</Link>
            <Link href="/movies/popular" className="block py-4 px-6 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-xl font-semibold" onClick={() => setMobileOpen(false)}>Films populaires</Link>
            <Link href="/tvshows/latest" className="block py-4 px-6 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-xl font-semibold" onClick={() => setMobileOpen(false)}>Séries récentes</Link>
            <Link href="/tvshows/popular" className="block py-4 px-6 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-xl font-semibold" onClick={() => setMobileOpen(false)}>Séries populaires</Link>
          </nav>
        </div>
      )}

    </header>
  );
}