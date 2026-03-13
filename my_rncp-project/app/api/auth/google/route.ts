import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '../../../../lib/googleAuthService';

export async function GET() {
  try {
    const url = getGoogleAuthUrl();
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { message: 'Error generating Google auth URL' },
      { status: 500 }
    );
  }
}
