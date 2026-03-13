import { NextRequest, NextResponse } from 'next/server';
import { getTVShowRecommendations } from '../../../../../../lib/tmdbService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: movieId } = await params; // ✅ Await params

  if (!movieId || isNaN(Number(movieId))) {
    return NextResponse.json(
      { message: 'Invalid movie ID' },
      { status: 400 }
    );
  }

  try {
    const recommendations = await getTVShowRecommendations(movieId);

    if (!recommendations || recommendations.length === 0) {
      return NextResponse.json(
        { message: 'No recommendations found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
