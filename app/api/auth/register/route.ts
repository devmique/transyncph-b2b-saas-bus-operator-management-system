import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { hashPassword, generateToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { Operator } from '@/lib/types';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  companyName: z.string().min(2),
  city: z.string().min(2),
  region: z.string().min(2),
});

const REGISTER_RATE_LIMIT_MAX_REQUESTS = 6;
const REGISTER_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit(`register:${clientIp}`, {
      maxRequests: REGISTER_RATE_LIMIT_MAX_REQUESTS,
      windowMs: REGISTER_RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimitResult.allowed) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
      );
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': retryAfterSeconds.toString() },
        }
      );
    }

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const db = await getDatabase();
    const operatorsCollection = db.collection<Operator>('operators');

    // Check if email already exists (better UX)
    const existingUser = await operatorsCollection.findOne({
      email: validatedData.email,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    const hashedPassword = await hashPassword(validatedData.password);

    const operator: Operator = {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      phone: validatedData.phone,
      companyName: validatedData.companyName,
      city: validatedData.city,
      region: validatedData.region,
      tier: 'basic',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await operatorsCollection.insertOne(operator);

    const token = generateToken({
      operatorId: result.insertedId.toString(),
      email: operator.email,
      tier: operator.tier,
    });

    const response = NextResponse.json(
      {
        message: 'Registration successful',
        operator: {
          id: result.insertedId,
          name: operator.name,
          email: operator.email,
          companyName: operator.companyName,
          tier: operator.tier,
        },
      },
      { status: 201 }
    );
    
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    //  MongoDB duplicate key — race condition safe
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}