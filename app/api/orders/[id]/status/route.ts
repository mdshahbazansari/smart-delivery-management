import { connectDB } from '@/lib/db'
import Order from '@/app/api/models/order'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB()
  const { status } = await req.json()
  const order = await Order.findByIdAndUpdate(params.id,{ status },{ new: true })
  return NextResponse.json(order)
}
