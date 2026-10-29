import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Restaurant from '@/models/Restaurant';
import MenuItem from '@/models/MenuItem';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    const restaurant = await Restaurant.findById(id).lean();
    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const menuItems = await MenuItem.find({
      restaurantId: id,
      isAvailable: true,
    }).lean();

    return NextResponse.json({
      success: true,
      restaurant,
      menuItems,
    });
  } catch (error) {
    console.error('Restaurant retrieval error:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving restaurant.' },
      { status: 500 }
    );
  }
}

