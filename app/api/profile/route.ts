import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return NextResponse.json({
    message: 'Access granted',
    userId: decoded.userId,
  })
}
