import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { getSessionUser } from '@/lib/auth';
import { updateOrderStatusSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    await connectToDatabase();

    // Query either by MongoDB _id or orderNumber
    const order = await Order.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }],
    }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const isOwner = order.userId.toString() === session.userId;
    const isStaff = session.role === 'canteen_owner' || session.role === 'admin';

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Access denied to this order.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const validated = updateOrderStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status: targetStatus, notes } = validated.data;

    await connectToDatabase();

    const order = await Order.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }],
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const isOwner = order.userId.toString() === session.userId;
    const isStaff = session.role === 'canteen_owner' || session.role === 'admin';

    // Business rule: Customers can only cancel their own order if it is still 'pending'
    if (!isStaff) {
      if (!isOwner) {
        return NextResponse.json(
          { success: false, message: 'Forbidden' },
          { status: 403 }
        );
      }
      if (targetStatus !== 'cancelled') {
        return NextResponse.json(
          { success: false, message: 'Customers may only cancel orders.' },
          { status: 403 }
        );
      }
      if (order.status !== 'pending') {
        return NextResponse.json(
          { success: false, message: 'Cannot cancel order once food preparation has started.' },
          { status: 400 }
        );
      }
    }

    order.status = targetStatus;
    order.statusHistory.push({
      status: targetStatus,
      timestamp: new Date(),
      note: notes || `Status updated to ${targetStatus} by ${session.role}`,
      updatedBy: session.userId as unknown as import('mongoose').Types.ObjectId,
    });

    await order.save();

    return NextResponse.json({
      success: true,
      order,
      message: `Order status updated to ${targetStatus}`,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
