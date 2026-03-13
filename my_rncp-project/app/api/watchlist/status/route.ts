import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ status: null }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.id;

    const { searchParams } = new URL(req.url);
    const mediaId = Number(searchParams.get('mediaId'));
    const mediaType = searchParams.get('mediaType') as 'movie' | 'tv';

    // watchlist
    const item = await prisma.watchlist.findUnique({
      where: {
        userId_mediaId_mediaType: { 
          userId, 
          mediaId, 
          mediaType 
        }
      }
    });

    // Retourne status ou null
    return NextResponse.json({ 
      status: item?.status === 'wishlist' ? 'wishlist' : null 
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ status: null });
  }
}
