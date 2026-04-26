import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const schedule = await db.collection('schedules').findOne(
      { _id: new ObjectId(params.id) },
      { projection: { vehicleNumber: 1, departureTime: 1, arrivalTime: 1, routeNumber: 1 } }
    )
    if (!schedule) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...schedule, _id: schedule._id.toString() })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}