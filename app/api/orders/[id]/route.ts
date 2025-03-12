import { connectDB } from '@/lib/db'
import Order from '@/app/api/models/order'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB()
  const data = await req.json()
  const order = await Order.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json({ message: 'Order Update Successfully', order })
}
