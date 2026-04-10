import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDatabase } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json()

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const db = await getDatabase()

    // Find the reset record by email
    const resetRecord = await db.collection('password_reset_tokens').findOne({
      email: email.toLowerCase().trim(),
    })

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
    }

    // Check expiry
    if (new Date() > new Date(resetRecord.expiresAt)) {
      await db.collection('password_reset_tokens').deleteOne({ _id: resetRecord._id })
      return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
    }

    // Verify the raw token against the stored hash
    const isValid = await bcrypt.compare(token, resetRecord.tokenHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
    }

    // Hash the new password and update the user
    const newPasswordHash = await bcrypt.hash(password, 12)

    await db.collection('operators').updateOne(
      { _id: resetRecord.userId },
      { $set: { passwordHash: newPasswordHash, updatedAt: new Date() } }
    )

    // Delete the used token
    await db.collection('password_reset_tokens').deleteOne({ _id: resetRecord._id })

    return NextResponse.json({ message: 'Password updated successfully.' })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}