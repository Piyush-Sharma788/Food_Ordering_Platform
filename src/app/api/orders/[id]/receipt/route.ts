import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { getSessionUser } from '@/lib/auth';
import receiptGenerator from '@/lib/pdf/receipt-generator';
import { IOrder } from '@/types';

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
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf'; // 'pdf' or 'html'

    await connectToDatabase();

    const orderDoc = await Order.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }],
    }).lean();

    if (!orderDoc) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const isOwner = orderDoc.userId.toString() === session.userId;
    const isStaff = session.role === 'canteen_owner' || session.role === 'admin';

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const typedOrder: IOrder = {
      _id: orderDoc._id.toString(),
      orderNumber: orderDoc.orderNumber,
      userId: orderDoc.userId.toString(),
      studentId: orderDoc.studentId,
      restaurantId: orderDoc.restaurantId.toString(),
      restaurantName: orderDoc.restaurantName,
      items: orderDoc.items.map((it) => ({
        menuItemId: it.menuItemId.toString(),
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        prepTime: it.prepTime,
      })),
      subtotal: orderDoc.subtotal,
      tax: orderDoc.tax,
      deliveryFee: orderDoc.deliveryFee,
      totalPrice: orderDoc.totalPrice,
      estimatedPrepTimeMinutes: orderDoc.estimatedPrepTimeMinutes,
      status: orderDoc.status,
      deliveryType: orderDoc.deliveryType,
      deliveryLocation: orderDoc.deliveryLocation,
      specialInstructions: orderDoc.specialInstructions,
      paymentStatus: orderDoc.paymentStatus,
      paymentMethod: orderDoc.paymentMethod,
      createdAt: orderDoc.createdAt.toISOString(),
      updatedAt: orderDoc.updatedAt.toISOString(),
    };

    if (format === 'html') {
      const html = receiptGenerator.generateReceiptHtml(typedOrder);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Generate PDF using Puppeteer
    const pdfBuffer = await receiptGenerator.generatePdfReceipt(typedOrder);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Receipt-${orderDoc.orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Receipt generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}
