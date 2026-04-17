import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthToken } from './types';
import { NextRequest} from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: AuthToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as AuthToken;
  } catch (error) {
    return null;
  }
}


export function getPayload(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  return token ? verifyToken(token) : null
}
