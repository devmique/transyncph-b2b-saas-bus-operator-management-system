import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyPassword, generateToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { Operator } from '@/lib/types';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const LOGIN_RATE_LIMIT_MAX_REQUESTS = 5;
const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit(`login:${clientIp}`, {
      maxRequests: LOGIN_RATE_LIMIT_MAX_REQUESTS,
      windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimitResult.allowed) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
      );
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': retryAfterSeconds.toString() } }
      );
    }

    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const db = await getDatabase();
    const operator = await db.collection<Operator>('operators').findOne({
      email: validatedData.email,
    });

    // Constant-time: always verify even if operator not found
    // it will make the response time consistent whether the user exists or not
    const dummyHash = '$2a$10$dummyhashfortimingnormalization000000000000000000000';
    const passwordMatch = await verifyPassword(
      validatedData.password,
      operator?.password ?? dummyHash
    );

    if (!operator || !passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (operator.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 403 }
      );
    }

    const token = generateToken({
      operatorId: operator._id!.toString(),
      email: operator.email,
      tier: operator.tier,
    });

    const response = NextResponse.json(
      {
        message: 'Login successful',
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

    // Set HttpOnly cookie — JS cannot read this, eliminating XSS token theft
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
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}