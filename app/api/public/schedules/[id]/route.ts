import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  _req: NextRequest,
   { params }: { params: Promise<{ id: string }> }  
) {
  try {
     const { id } = await params  
    const { db } = await connectToDatabase()
    const schedule = await db.collection('schedules').findOne(
       { _id: new ObjectId(id) },
      { projection: { vehicleNumber: 1, departureTime: 1, arrivalTime: 1, routeNumber: 1, routeId: 1 } }
    )
    if (!schedule) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    let companyName = undefined
    if (schedule?.routeId) {
      const route = await db.collection('routes').findOne(
        { _id: new ObjectId(schedule.routeId) },
        { projection: { companyName: 1 } }
      )
      companyName = route?.companyName
    }
    
    return NextResponse.json({ ...schedule, _id: schedule._id.toString(), companyName })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}