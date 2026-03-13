import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
import { authenticateToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tmdbId = parseInt(searchParams.get('tmdbId') || '0');
  const mediaType = searchParams.get('type') || 'movie';

  const reviews = await prisma.review.findMany({
    where: { tmdbId, mediaType },
    include: { 
      users: { select: { username: true, picture: true } },
      _count: { select: { replies: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const auth = authenticateToken(req);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  const userId = auth.user!.id;
  const { tmdbId, mediaType, rating, comment } = await req.json();

  const review = await prisma.review.upsert({
    where: { 
      userId_tmdbId_mediaType: { 
        userId, 
        tmdbId, 
        mediaType 
      } 
    },
    update: { rating, comment },
    create: { 
      userId, 
      tmdbId, 
      mediaType, 
      rating, 
      comment 
    }
  });

  return NextResponse.json(review);
}
