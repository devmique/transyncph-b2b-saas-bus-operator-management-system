import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    const db = await getDatabase()

    const pipeline: object[] = [
      // 1. Filter by search query if provided
      ...(query ? [{
        $match: {
          $or: [
            { routeNumber: { $regex: query, $options: 'i' } },
            { startPoint:  { $regex: query, $options: 'i' } },
            { endPoint:    { $regex: query, $options: 'i' } },
          ],
        },
      }] : []),

      // 2. Join schedules
      {
        $lookup: {
          from: 'schedules',
          localField: '_id',
          foreignField: 'routeId',
          as: 'schedules',
        },
      },

      // 3. Keep only active schedules inside the array
      {
        $addFields: {
          schedules: {
            $filter: {
              input: '$schedules',
              as: 'sched',
              cond: { $eq: ['$$sched.status', 'active'] },
            },
          },
        },
      },

      // 4. Only show routes that have at least one active schedule
      {
        $match: { 'schedules.0': { $exists: true } },
      },

      // 5. Cast operatorId string → ObjectId for the join
      {
        $addFields: {
          operatorObjectId: { $toObjectId: '$operatorId' },
        },
      },

      // 6. Join operator to get companyName
      {
        $lookup: {
          from: 'operators',
          localField: 'operatorObjectId',
          foreignField: '_id',
          as: 'operator',
        },
      },
      {
        $unwind: { path: '$operator', preserveNullAndEmptyArrays: true },
      },

      // 7. Shape the final output
      {
        $project: {
          operatorObjectId: 0,  // hide temp field
          routeNumber: 1,
          startPoint: 1,
          endPoint: 1,
          distance: 1,
          estimatedTime: 1,
          companyName: '$operator.companyName',
          schedules: {
            $map: {
              input: '$schedules',
              as: 's',
              in: {
                _id:           '$$s._id',
                departureTime: '$$s.departureTime',
                arrivalTime:   '$$s.arrivalTime',
                fare:          '$$s.fare',
                vehicleNumber: '$$s.vehicleNumber',
                status:        '$$s.status',
              },
            },
          },
        },
      },
    ]

    const routes = await db.collection('routes').aggregate(pipeline).toArray()
    return NextResponse.json(routes)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch routes' },
      { status: 500 }
    )
  }
}