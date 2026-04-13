
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import { extractTokenFromHeader, verifyToken, verifyPassword, hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Both current and new password are required' },
        { status: 400 }
      )
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const operator = await db.collection('operators').findOne({
      _id: new ObjectId(payload.operatorId),
    })

    if (!operator) return NextResponse.json({ error: 'Operator not found' }, { status: 404 })

    const isMatch = await verifyPassword(currentPassword, operator.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const hashed = await hashPassword(newPassword)

    await db.collection('operators').updateOne(
      { _id: new ObjectId(payload.operatorId) },
      { $set: { password: hashed, updatedAt: new Date() } }
    )

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('[POST /api/operator/change-password]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}