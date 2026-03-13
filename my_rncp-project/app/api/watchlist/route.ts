import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.id;

    const { mediaId, mediaType, title, posterPath, status = 'wishlist' } = await request.json();

    console.log('POST watchlist:', status);

    if (status === 'watched') {
  // Supprime de la wishlist si elle existe, puis crée en watched
  await prisma.watchlist.upsert({
    where: { userId_mediaId_mediaType: { userId, mediaId, mediaType } },
    update: { status: 'watched', title, posterPath },
    create: { userId, mediaId, mediaType, title, posterPath, status: 'watched' },
  });

  revalidatePath('/me/watchlist', 'page');
  revalidatePath('/me/views', 'page');
  return NextResponse.json({ success: true, action: 'watched' });
}

    const result = await prisma.watchlist.upsert({
      where: { userId_mediaId_mediaType: { userId, mediaId, mediaType } },
      update: { status: 'wishlist', title, posterPath },
      create: { userId, mediaId, mediaType, title, posterPath, status: 'wishlist' },
    });

    revalidatePath('/watchlist', 'page');
    revalidatePath('/me', 'page');
    revalidateTag('user-watchlist', 'max');
    
    return NextResponse.json({ success: true, item: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.id;

    const { mediaId, mediaType } = await request.json();

    await prisma.watchlist.delete({
      where: { userId_mediaId_mediaType: { userId, mediaId, mediaType } },
    });

    revalidatePath('/watchlist', 'page');
    revalidatePath('/me', 'page');
    revalidateTag('user-watchlist', 'max');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
