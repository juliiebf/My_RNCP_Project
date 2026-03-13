import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export default async function MesVuesPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const resolvedParams = await searchParams;
  const filterParam = resolvedParams.filter || 'all';
  const filter = filterParam as 'all' | 'movie' | 'tv';

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/auth/login" className="px-6 py-3 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-500 transition">
          🔐 Se connecter
        </Link>
      </div>
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/auth/login" className="px-6 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition">
          ❌ Reconnexion
        </Link>
      </div>
    );
  }

  const userId = parseInt(decoded.id);

  const counts = await prisma.$transaction([
    prisma.watchlist.count({ where: { userId, status: 'watched', mediaType: 'movie' } }),
    prisma.watchlist.count({ where: { userId, status: 'watched', mediaType: 'tv' } }),
    prisma.watchlist.count({ where: { userId, status: 'watched' } })
  ]);

  const [movieCount, tvCount, totalCount] = counts;

  const whereClause = {
    userId,
    status: 'watched',
    ...(filter === 'movie' && { mediaType: 'movie' }),
    ...(filter === 'tv' && { mediaType: 'tv' })
  };

  const watchedItems: any[] = await prisma.watchlist.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen py-8">
      <div className="px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              Mes vues
            </h1>
            <p className="text-gray-400 text-lg">
              {watchedItems.length} élément{watchedItems.length > 1 ? 's' : ''} vu{watchedItems.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            <a href="/me/views?filter=all" className={`rounded-full text-sm font-semibold transition-all ${filter === 'all' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}style={{ padding: '4px 8px' }}>
              Tout ({totalCount})
            </a>
            <a href="/me/views?filter=movie" className={`rounded-full text-sm font-semibold transition-all ${filter === 'movie' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}style={{ padding: '4px 8px' }}>
              Films ({movieCount})
            </a>
            <a href="/me/views?filter=tv" className={`rounded-full text-sm font-semibold transition-all ${filter === 'tv' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}style={{ padding: '4px 8px' }}>
              Séries ({tvCount})
            </a>
          </div>
        </div>

        {watchedItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-8 flex items-center justify-center">
              <span className="text-4xl">🎬</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-400 mb-4">Aucun élément vu</h2>
            <div className="flex gap-4 justify-center mt-8">
              <Link href="/movies/popular" className="px-6 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition">
                🎥 Explorer films
              </Link>
              <Link href="/tvshows/popular" className="px-6 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition">
                📺 Explorer séries
              </Link>
            </div>
          </div>
        ) : (
          <div className="cards-grid">
            {watchedItems.map((item: any) => (
              <a
                key={item.id}
                href={`/${item.mediaType === 'tv' ? 'tvshows' : 'movies'}/${item.mediaId}`}
                className="group cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-all hover:scale-105 shadow-lg h-[350px] flex flex-col"
              >
                <div className="relative flex-1">
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    loading="lazy"
                    className="object-cover group-hover:opacity-90"
                  />
                  <span
                    className={`absolute top-2 left-2 rounded-full font-bold ${
                      item.mediaType === 'tv' ? 'bg-blue-500/80 text-white' : 'bg-yellow-500/80 text-black'
                    }`}
                    style={{ padding: '4px 10px', fontSize: '13px' }}
                  >
                    {item.mediaType === 'tv' ? 'Série' : 'Film'}
                  </span>
                </div>
                <div className="px-3 py-2 bg-gray-900">
                  <h3 className="text-white text-sm font-medium line-clamp-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}