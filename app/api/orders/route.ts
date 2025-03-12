import { connectDB } from '@/lib/db'
import Order from '@/app/api/models/order'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  await connectDB()
  const orders = await Order.find()
  // const orders = await Order.find().populate('assignedTo')
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  await connectDB()
  const data = await req.json()
  const order = await Order.create(data)
  return NextResponse.json({ message: 'Order Place Successfully', order })
}
