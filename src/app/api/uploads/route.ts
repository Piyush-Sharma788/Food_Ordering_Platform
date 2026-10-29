import { NextRequest, NextResponse } from 'next/server';
import s3Service from '@/lib/storage/s3-service';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUser(request);
    if (!session || (session.role !== 'canteen_owner' && session.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Staff role required for file uploads.' },
        { status: 403 }
      );
    }

    const contentType = request.headers.get('content-type') || '';

    // Case 1: JSON request for presigned URL
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { fileType, extension } = body;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(fileType)) {
        return NextResponse.json(
          { success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
          { status: 400 }
        );
      }

      const presigned = await s3Service.getPresignedUploadUrl(fileType, extension || 'jpg');
      return NextResponse.json({ success: true, ...presigned });
    }

    // Case 2: Direct multipart form data upload
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided in form data' },
        { status: 400 }
      );
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File exceeds 5MB size limit' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileUrl = await s3Service.uploadBuffer(buffer, file.type, 'menu');

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

