import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Shift from '@/app/api/models/Shift'

// Fetch all shifts
export async function GET() {
  await connectDB()
  const shifts = await Shift.find({})
  return NextResponse.json(shifts)
}

// Add a new shift
export async function POST(req: Request) {
  await connectDB()
  const { partnerId, start, end, status } = await req.json()

  const newShift = new Shift({ partnerId, start, end, status })
  await newShift.save()

  return NextResponse.json({ message: 'Shift created successfully' })
}
