
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import { getPayload } from '@/lib/auth'

export async function DELETE(req: NextRequest) {
  try {
    const payload = getPayload(req)
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    if (!ObjectId.isValid(payload.operatorId)) {
      return NextResponse.json({ error: 'Invalid operator ID' }, { status: 400 })
    }

    const db = await getDatabase()

    const operator = await db.collection('operators').findOne({
      _id: new ObjectId(payload.operatorId),
    })
    if (!operator) return NextResponse.json({ error: 'Operator not found' }, { status: 404 })

    // ── Cascade deletes ──────────────────────────────────────────────────────
    // Uncomment as you add more collections:
    //
    // await db.collection('routes').deleteMany({ operatorId: payload.operatorId })
    // await db.collection('schedules').deleteMany({ operatorId: payload.operatorId })
    // await db.collection('announcements').deleteMany({ operatorId: payload.operatorId })
    // await db.collection('team_members').deleteMany({ operatorId: payload.operatorId })
    // ────────────────────────────────────────────────────────────────────────

    await db.collection('operators').deleteOne({ _id: new ObjectId(payload.operatorId) })

    return NextResponse.json({ message: 'Account deleted successfully' })
    // Note: the client calls logout() after this succeeds, which clears
    // localStorage + the authToken cookie — no cookie-clearing needed here.
  } catch (err) {
    console.error('[DELETE /api/operator/delete-account]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}