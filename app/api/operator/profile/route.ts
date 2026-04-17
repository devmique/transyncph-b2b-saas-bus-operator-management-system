
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'
import { getPayload } from '@/lib/auth'

const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().min(1),
  phone: z.string().optional().default(''),
  city: z.string().optional().default(''),
  region: z.string().optional().default(''),
})

// ── GET /api/operator/profile ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const payload = getPayload(req)
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    if (!ObjectId.isValid(payload.operatorId)) {
      return NextResponse.json({ error: 'Invalid operator ID' }, { status: 400 })
    }

    const db = await getDatabase()
    const operator = await db.collection('operators').findOne(
      { _id: new ObjectId(payload.operatorId) },
      { projection: { password: 0 } } // never return the hash
    )

    if (!operator) return NextResponse.json({ error: 'Operator not found' }, { status: 404 })

    return NextResponse.json({ operator })
  } catch (err) {
    console.error('[GET /api/operator/profile]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH /api/operator/profile ──────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const payload = getPayload(req)
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    if (!ObjectId.isValid(payload.operatorId)) {
      return NextResponse.json({ error: 'Invalid operator ID' }, { status: 400 })
    }

    const body = await req.json()
    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const { name, email, companyName, phone, city, region } = parsed.data

    const db = await getDatabase()

    // Check email uniqueness — exclude current operator
    const existing = await db.collection('operators').findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: new ObjectId(payload.operatorId) },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Email is already in use by another account' },
        { status: 409 }
      )
    }

    const result = await db.collection('operators').findOneAndUpdate(
      { _id: new ObjectId(payload.operatorId) },
      {
        $set: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          companyName: companyName.trim(),
          phone: phone?.trim() ?? '',
          city: city?.trim() ?? '',
          region: region?.trim() ?? '',
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after', projection: { password: 0 } }
    )

    if (!result) return NextResponse.json({ error: 'Operator not found' }, { status: 404 })

    return NextResponse.json({ operator: result })
  } catch (err) {
    console.error('[PATCH /api/operator/profile]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}