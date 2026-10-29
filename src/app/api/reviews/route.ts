import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Review from '@/models/Review';
import Restaurant from '@/models/Restaurant';
import { getSessionUser } from '@/lib/auth';
import { reviewSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    await connectToDatabase();

    const query = restaurantId ? { restaurantId } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(30).lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in to leave a review.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = reviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { restaurantId, rating, comment } = validated.data;

    await connectToDatabase();

    const newReview = await Review.create({
      userId: session.userId,
      studentId: session.studentId,
      restaurantId,
      rating,
      comment,
    });

    // Update restaurant rating average
    const allReviews = await Review.find({ restaurantId }).select('rating');
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: Math.round(avgRating * 10) / 10,
      $inc: { reviewCount: 1 },
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error('Review submit error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

