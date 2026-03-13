import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Supprimer l'utilisateur (cascade sur watchlist, reviews, userList)
    await prisma.users.delete({
      where: { id: decoded.id },
    });

    // Supprimer le cookie
    const response = NextResponse.json({ message: 'Compte supprimé' });
    response.cookies.set('token', '', { maxAge: 0, path: '/' });

    return response;
  } catch (error) {
    console.error('Erreur suppression compte:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
