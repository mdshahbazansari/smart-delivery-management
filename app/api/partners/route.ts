import { connectDB } from '@/lib/db'
import Partner from '@/app/api/models/partner'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()
  const partners = await Partner.find().sort({ createdAt: -1 })
  return NextResponse.json(partners)
}

export async function POST(req: Request) {
  await connectDB()
  const data = await req.json()
  const partner = await Partner.create(data)
  return NextResponse.json(partner)
}
