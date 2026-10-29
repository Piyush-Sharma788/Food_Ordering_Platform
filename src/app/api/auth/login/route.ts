import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { loginId, password } = validatedData.data;

    await connectToDatabase();

    // Find by studentId or email (case-insensitive)
    const user = await User.findOne({
      $or: [{ studentId: loginId.toLowerCase() }, { email: loginId.toLowerCase() }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid Student ID/Email or password.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid Student ID/Email or password.' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      studentId: user.studentId,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
        year: user.year,
        branch: user.branch,
        orderCount: user.orderCount,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}

