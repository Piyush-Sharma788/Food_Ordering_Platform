import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import User from '@/models/User';
import { getSessionUser } from '@/lib/auth';
import { createOrderSchema } from '@/lib/validation';
import { SEED_MENU_ITEMS, SEED_RESTAURANTS } from '@/data/seed-data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in to place an order.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { restaurantId, items: requestedItems, deliveryType, deliveryLocation, specialInstructions } =
      validated.data;

    await connectToDatabase();

    // 1. Fetch live restaurant
    let restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      restaurant = await Restaurant.findOne();
    }
    const restaurantName = restaurant?.name || SEED_RESTAURANTS[0].name;

    // 2. Fetch live menu items and verify prices on server
    const verifiedOrderItems = [];
    let subtotal = 0;
    let totalPrepTimeMinutes = 0;

    for (const reqItem of requestedItems) {
      let menuItem = await MenuItem.findById(reqItem.menuItemId);
      if (!menuItem) {
        // Check seed items if ID is simulated
        const seedMatch = SEED_MENU_ITEMS.find(
          (s, idx) => `seed-item-${idx + 1}` === reqItem.menuItemId || s.slug === reqItem.menuItemId
        );
        if (seedMatch) {
          menuItem = {
            _id: reqItem.menuItemId,
            name: seedMatch.name,
            price: seedMatch.price,
            prepTime: seedMatch.prepTime,
            isAvailable: true,
          } as unknown as typeof menuItem;
        }
      }

      if (!menuItem) {
        return NextResponse.json(
          { success: false, message: `Menu item ${reqItem.menuItemId} is not available.` },
          { status: 400 }
        );
      }

      const itemTotal = menuItem.price * reqItem.quantity;
      subtotal += itemTotal;

      // Legacy calculation algorithm:
      // If quantity == 1, time = baseTime
      // If quantity > 1, time = baseTime + baseTime * 0.35 * (qty - 1)
      const itemPrep =
        reqItem.quantity === 1
          ? menuItem.prepTime
          : menuItem.prepTime + menuItem.prepTime * 0.35 * (reqItem.quantity - 1);

      totalPrepTimeMinutes += itemPrep;

      verifiedOrderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: reqItem.quantity,
        prepTime: menuItem.prepTime,
      });
    }

    // 3. Server-side totals calculation
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% campus tax
    const deliveryFee = deliveryType === 'campus_delivery' ? 20 : 0;
    const totalPrice = Math.round((subtotal + tax + deliveryFee) * 100) / 100;
    const estimatedPrep = Math.max(5, Math.round(totalPrepTimeMinutes));

    // Unique order number: ZK-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ZK-${dateStr}-${randomSuffix}`;

    const newOrder = await Order.create({
      orderNumber,
      userId: session.userId,
      studentId: session.studentId,
      restaurantId: restaurant?._id || restaurantId,
      restaurantName,
      items: verifiedOrderItems,
      subtotal,
      tax,
      deliveryFee,
      totalPrice,
      estimatedPrepTimeMinutes: estimatedPrep,
      status: 'pending',
      deliveryType,
      deliveryLocation: deliveryLocation || 'Campus Canteen Counter',
      specialInstructions,
      paymentStatus: 'paid', // Simulated on-campus student billing / wallet
      paymentMethod: 'online_simulated',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Order placed by student.',
        },
      ],
    });

    // Increment user's orderCount atomically
    await User.findByIdAndUpdate(session.userId, { $inc: { orderCount: 1 } });

    return NextResponse.json(
      {
        success: true,
        order: newOrder,
        message: 'Order placed successfully!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while placing order.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const isCanteenStaff = session.role === 'canteen_owner' || session.role === 'admin';

    const query: Record<string, unknown> = {};

    if (!isCanteenStaff) {
      // Students can only see their own orders
      query.userId = session.userId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(50).lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
