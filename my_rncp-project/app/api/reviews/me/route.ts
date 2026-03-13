import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  console.log('=== REVIEWS/ME DEBUG ===');
  console.log('HEADERS:', Object.fromEntries(req.headers.entries()));
  
  const auth = authenticateToken(req);
  console.log('AUTH:', auth);
  
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized', debug: auth.error }, { status: 401 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { userId: auth.user.id },
      include: { replies: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('PRISMA ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
