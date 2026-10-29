import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Restaurant from '@/models/Restaurant';
import MenuItem from '@/models/MenuItem';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { SEED_RESTAURANTS, SEED_MENU_ITEMS } from '@/data/seed-data';

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Seed Demo Users if not present
    const demoUsers = [
      {
        studentId: '12345',
        name: 'Aarav Sharma',
        email: 'student1@example.com',
        password: 'pass123',
        role: 'customer' as const,
        year: '3rd Year',
        branch: 'Computer Science',
      },
      {
        studentId: '67890',
        name: 'Priya Patel',
        email: 'student2@example.com',
        password: 'pass456',
        role: 'customer' as const,
        year: '2nd Year',
        branch: 'Electrical Engineering',
      },
      {
        studentId: 'admin',
        name: 'Canteen Manager',
        email: 'admin@canteen.com',
        password: 'adminpass',
        role: 'canteen_owner' as const,
        year: 'Staff',
        branch: 'Food Services',
      },
    ];

    for (const u of demoUsers) {
      const existing = await User.findOne({ studentId: u.studentId });
      if (!existing) {
        const passwordHash = await hashPassword(u.password);
        await User.create({
          studentId: u.studentId,
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
          year: u.year,
          branch: u.branch,
          orderCount: u.studentId === '12345' ? 15 : u.studentId === '67890' ? 8 : 0,
        });
      }
    }

    // 2. Seed Restaurants
    const createdRestaurants = [];
    for (const r of SEED_RESTAURANTS) {
      let doc = await Restaurant.findOne({ slug: r.slug });
      if (!doc) {
        doc = await Restaurant.create(r);
      }
      createdRestaurants.push(doc);
    }

    const defaultRestaurant = createdRestaurants[0] || (await Restaurant.findOne());

    // 3. Seed Menu Items
    let itemsAdded = 0;
    for (const item of SEED_MENU_ITEMS) {
      const existingItem = await MenuItem.findOne({ slug: item.slug });
      if (!existingItem) {
        await MenuItem.create({
          ...item,
          restaurantId: defaultRestaurant._id,
        });
        itemsAdded++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded! ${createdRestaurants.length} restaurants, ${itemsAdded} new menu items seeded.`,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

