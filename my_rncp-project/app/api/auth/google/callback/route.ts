import { NextRequest, NextResponse } from 'next/server';
import { getGoogleUser } from '../../../../../lib/googleAuthService';
import prisma from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { message: 'Authorization code is missing' },
        { status: 400 }
      );
    }

    // Récupère Google user
    const googleUser = await getGoogleUser(code);

    // Cherche/crée/met à jour user (ton code parfait)
    let user = await prisma.users.findUnique({
      where: { google_id: googleUser.googleId }
    });

    if (!user && googleUser.email) {
      user = await prisma.users.findUnique({
        where: { email: googleUser.email }
      });

      if (user) {
        user = await prisma.users.update({
          where: { id: user.id },
          data: {
            google_id: googleUser.googleId,
            picture: googleUser.picture,
            auth_provider: 'google'
          }
        });
      }
    }

    if (!user) {
      user = await prisma.users.create({
        data: {
          email: googleUser.email!,
          username: googleUser.email!.split('@')[0],
          first_name: googleUser.name?.split(' ')[0] || '',
          last_name: googleUser.name?.split(' ').slice(1).join(' ') || '',
          google_id: googleUser.googleId,
          picture: googleUser.picture,
          auth_provider: 'google'
        }
      });
    }

    // JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
