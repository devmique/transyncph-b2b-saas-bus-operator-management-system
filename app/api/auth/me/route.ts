import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { Operator } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDatabase();
    const operator = await db.collection<Operator>('operators').findOne({
      _id: new ObjectId(payload.operatorId),
    });

    if (!operator) {
      return NextResponse.json({ error: 'Operator not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: operator._id,
      name: operator.name,
      email: operator.email,
      companyName: operator.companyName,
      tier: operator.tier,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch operator' }, { status: 500 });
  }
}