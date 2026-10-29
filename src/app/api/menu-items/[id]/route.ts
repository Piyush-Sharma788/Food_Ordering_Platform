import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser(request);
    if (!session || (session.role !== 'canteen_owner' && session.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Canteen staff permission required.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    await connectToDatabase();
    const updated = await MenuItem.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Menu item not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Update menu item error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update menu item.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser(request);
    if (!session || (session.role !== 'canteen_owner' && session.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Canteen staff permission required.' },
        { status: 403 }
      );
    }

    const { id } = params;
    await connectToDatabase();

    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Menu item not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully.',
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete menu item.' },
      { status: 500 }
    );
  }
}

