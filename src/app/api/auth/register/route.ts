import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { studentId, email, password, name, year, branch, role } = validatedData.data;

    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ studentId: studentId.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      const field = existingUser.studentId === studentId.toLowerCase() ? 'Student ID' : 'Email';
      return NextResponse.json(
        { success: false, message: `${field} is already registered.` },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
      studentId: studentId.toLowerCase(),
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: role || 'customer',
      year: year || '1st Year',
      branch: branch || 'Engineering',
      orderCount: 0,
    });

    const token = signToken({
      userId: newUser._id.toString(),
      studentId: newUser.studentId,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: newUser._id,
          studentId: newUser.studentId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          year: newUser.year,
          branch: newUser.branch,
          orderCount: newUser.orderCount,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}

