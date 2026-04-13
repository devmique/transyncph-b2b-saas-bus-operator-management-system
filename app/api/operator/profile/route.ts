
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

// ── GET /api/operator/profile ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

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
    const token = extractTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

    const { name, email, companyName, phone, city, region } = await req.json()

    if (!name?.trim() || !email?.trim() || !companyName?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and company name are required' },
        { status: 400 }
      )
    }

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