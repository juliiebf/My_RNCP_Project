import { NextRequest, NextResponse } from 'next/server';
import { getMovieDetails } from '../../../../../lib/tmdbService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: movieId } = await params;

  if (!movieId || isNaN(Number(movieId))) {
    return NextResponse.json(
      { message: 'Invalid movie ID' },
      { status: 400 }
    );
  }

  try {
    const movieDetails = await getMovieDetails(movieId);

    if (!movieDetails) {
      return NextResponse.json(
        { message: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(movieDetails);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
