import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '../../../../../lib/tmdbService';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');

  if (!query || query.trim() === '') {
    return NextResponse.json(
      { message: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const results = await searchMovies(query);

    if (!results || results.length === 0) {
      return NextResponse.json(
        { message: 'No results found' },
        { status: 404 }
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching movies:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
