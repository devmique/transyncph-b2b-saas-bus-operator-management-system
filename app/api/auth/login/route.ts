import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyPassword, generateToken } from '@/lib/auth';
import { Operator } from '@/lib/types';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = loginSchema.parse(body);
    
    const db = await getDatabase();
    const operatorsCollection = db.collection<Operator>('operators');

    // Find operator by email
    const operator = await operatorsCollection.findOne({ email: validatedData.email });
    if (!operator) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await verifyPassword(validatedData.password, operator.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if operator is active
    if (operator.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 403 }
      );
    }

    // Generate token
    const token = generateToken({
      operatorId: operator._id!.toString(),
      email: operator.email,
      tier: operator.tier,
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        operator: {
          id: operator._id,
          name: operator.name,
          email: operator.email,
          companyName: operator.companyName,
          tier: operator.tier,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
