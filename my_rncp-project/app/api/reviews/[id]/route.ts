import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;

  try {
    // Vérifier que l'utilisateur est connecté
    const auth = await authenticateToken(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Vérifier que l'ID est présent
    if (!resolvedParams.id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Vérifier que la review existe
    const review = await prisma.review.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    if (review.userId !== auth.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Supprimer la review
    await prisma.review.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}