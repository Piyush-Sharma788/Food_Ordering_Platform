import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Restaurant from '@/models/Restaurant';
import { SEED_RESTAURANTS } from '@/data/seed-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    await connectToDatabase();

    const query: Record<string, unknown> = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const restaurants = await Restaurant.find(query).sort({ rating: -1 }).lean();

    if (restaurants.length === 0 && !search && (!category || category === 'All')) {
      // Return seed fallback
      return NextResponse.json({
        success: true,
        restaurants: SEED_RESTAURANTS.map((r, i) => ({
          ...r,
          _id: `seed-rest-${i + 1}`,
          isActive: true,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      restaurants,
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    // Graceful fallback to static seed data
    return NextResponse.json({
      success: true,
      restaurants: SEED_RESTAURANTS.map((r, i) => ({
        ...r,
        _id: `seed-rest-${i + 1}`,
        isActive: true,
      })),
    });
  }
}
