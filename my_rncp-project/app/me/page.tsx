import Link from 'next/link';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import MovieCard from '@/components/MovieCard';

export default async function MePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Mon profil</h1>
        <p>Connecte-toi pour accéder à tes listes</p>
        <Link href="/auth/login" className="mt-4 inline-block px-8 py-3 bg-yellow-500 text-black font-bold rounded-xl">
          Se connecter
        </Link>
      </div>
    );
  }

  let userId: number;
  let username: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    userId = decoded.id;
    username = decoded.username;
  } catch {
    return <div>Session expirée</div>;
  }

  // ✅ FIX : Pas de next tags sur Prisma (seulement fetch)
  const watchlistCountPromise = prisma.watchlist.count({
    where: { userId, status: 'wishlist' },
  });
  const watchedCountPromise = prisma.watchlist.count({
    where: { userId, status: 'watched' },
  });
  const [watchlistCount, watchedCount] = await Promise.all([
    watchlistCountPromise,
    watchedCountPromise,
  ]);

  const recentWatchlist = await prisma.watchlist.findMany({
    where: { userId, status: 'wishlist' },
    select: {
      id: true,
      mediaId: true,
      mediaType: true,
      title: true,
      posterPath: true,
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            👋 Bonjour {username} !
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {watchlistCount} à voir | {watchedCount} vues
          </p>
        </div>

        {/* Onglets */}
        <div className="flex flex-wrap justify-center gap-1 mb-12 bg-gray-800 rounded-xl p-1 max-w-2xl mx-auto shadow-2xl">
          <Link 
            href="/me/watchlist"
            className="flex-1 px-6 py-4 text-center font-bold rounded-lg transition-all bg-transparent hover:bg-yellow-500/20 text-gray-300 hover:text-white"
          >
            À voir ({watchlistCount})
          </Link>
          <Link 
            href="/me/views"
            className="flex-1 px-6 py-4 text-center font-bold rounded-lg transition-all bg-transparent hover:bg-yellow-500/20 text-gray-300 hover:text-white"
          >
            Vues ({watchedCount})
          </Link>
          <Link 
            href="/me/reviews"
            className="flex-1 px-6 py-4 text-center font-bold rounded-lg transition-all bg-transparent hover:bg-yellow-500/20 text-gray-300 hover:text-white"
          >
            Reviews
          </Link>
        </div>

        {/* Aperçu récent */}
        {recentWatchlist.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Derniers ajoutés à ma liste
            </h2>
            <div className="cards-grid">
              {recentWatchlist.map((item) => (
                <MovieCard 
                  key={item.id}
                  movie={{ 
                    id: item.mediaId, 
                    title: item.title, 
                    poster_path: item.posterPath || '', 
                    media_type: item.mediaType as 'movie' | 'tv' 
                  }}
                  initialStatus="wishlist"
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link 
                href="/me/watchlist"
                className="inline-block px-8 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-600 shadow-lg transition-all"
              >
                Voir toute ma liste →
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-4">Aucun film dans ta liste</p>
            <Link 
              href="/"
              className="inline-block px-8 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-600"
            >
              Découvrir des films
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
