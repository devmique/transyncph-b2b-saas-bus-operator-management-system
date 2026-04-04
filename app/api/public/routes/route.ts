import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    const db = await connectDB()
    
    if (query) {
      const routes = await db
        .collection('routes')
        .find({
          $or: [
            { routeNumber: { $regex: query, $options: 'i' } },
            { startPoint: { $regex: query, $options: 'i' } },
            { endPoint: { $regex: query, $options: 'i' } },
          ],
        })
        .toArray()
      return NextResponse.json(routes)
    }

    const routes = await db.collection('routes').find({}).toArray()
    return NextResponse.json(routes)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch routes' },
      { status: 500 }
    )
  }
}
