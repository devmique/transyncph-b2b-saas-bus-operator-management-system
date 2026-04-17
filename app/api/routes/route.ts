import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { getPayload } from '@/lib/auth'

const routeSchema = z.object({
  routeNumber: z.string().min(1).max(50),
  startPoint: z.string().min(1).max(150),
  endPoint: z.string().min(1).max(150),
  distance: z.number().positive(),
  estimatedTime: z.string().min(1).max(100),
})

export async function GET(request: NextRequest) {
  try {
    const payload = getPayload(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()
    const routes = await db.collection('routes')
      .find({ operatorId: payload.operatorId })
      .toArray()

    return NextResponse.json(routes)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch routes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getPayload(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = routeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const db = await getDatabase()

    const result = await db.collection('routes').insertOne({
      ...parsed.data,
      operatorId: payload.operatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId, ...parsed.data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create route' },
      { status: 500 }
    )
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const payload = getPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

    const db = await getDatabase()
    await db.collection('routes').deleteOne({
      _id: new ObjectId(id),
      operatorId: payload.operatorId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete route' },
      { status: 500 }
    )
  }
}
