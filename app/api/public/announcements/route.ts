import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()

    const announcements = await db.collection('announcements').aggregate([
      // Only recent announcements (last 30 days)
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },

      // Join operator for companyName
      {
        $addFields: {
          operatorObjectId: {
            $cond: {
              if: { $and: [
                { $ne: ['$operatorId', null] },
                { $ne: ['$operatorId', ''] },
              ]},
              then: { $toObjectId: '$operatorId' },
              else: null,
            }
          }
        }
      },
      {
        $lookup: {
          from: 'operators',
          localField: 'operatorObjectId',
          foreignField: '_id',
          as: 'operator',
        },
      },
      { $unwind: { path: '$operator', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          title: 1,
          message: 1,
          type: 1,
          affectedRoutes: 1,
          createdAt: 1,
          companyName: '$operator.companyName',
        },
      },
    ]).toArray()

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('[GET /api/public/announcements]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}