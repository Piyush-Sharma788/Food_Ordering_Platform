import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import { getSessionUser } from '@/lib/auth';
import { menuItemSchema } from '@/lib/validation';
import { SEED_MENU_ITEMS } from '@/data/seed-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const restaurantId = searchParams.get('restaurantId');
    const all = searchParams.get('all') === 'true'; // if canteen owner wants unavailable items too

    await connectToDatabase();

    const query: Record<string, unknown> = {};

    if (!all) {
      query.isAvailable = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 }).lean();

    if (items.length === 0 && !search && (!category || category === 'All')) {
      // Fallback to static seed items
      return NextResponse.json({
        success: true,
        items: SEED_MENU_ITEMS.map((item, index) => ({
          ...item,
          _id: `seed-item-${index + 1}`,
          isAvailable: true,
          restaurantId: 'seed-rest-1',
        })),
      });
    }

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Graceful fallback
    return NextResponse.json({
      success: true,
      items: SEED_MENU_ITEMS.map((item, index) => ({
        ...item,
        _id: `seed-item-${index + 1}`,
        isAvailable: true,
        restaurantId: 'seed-rest-1',
      })),
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUser(request);
    if (!session || (session.role !== 'canteen_owner' && session.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Canteen staff permission required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = menuItemSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify restaurant exists or create fallback if using seed id
    let restaurantId = validated.data.restaurantId;
    const restExists = await Restaurant.findById(restaurantId);
    if (!restExists) {
      const anyRest = await Restaurant.findOne();
      if (anyRest) {
        restaurantId = anyRest._id.toString();
      }
    }

    const slug = validated.data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newItem = await MenuItem.create({
      ...validated.data,
      restaurantId,
      slug: `${slug}-${Date.now()}`,
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Create menu item error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create menu item.' },
      { status: 500 }
    );
  }
}
