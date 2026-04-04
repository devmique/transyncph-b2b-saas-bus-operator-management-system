import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB()
    const terminals = await db
      .collection('terminals')
      .find({})
      .toArray()

    return NextResponse.json(terminals)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch terminals' },
      { status: 500 }
    )
  }
}
