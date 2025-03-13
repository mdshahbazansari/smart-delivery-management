import { connectDB } from '@/lib/db'
import Order from '@/app/api/models/order'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { params } = context // Explicitly extract `params`

  await connectDB()
  console.log(params) // Debugging purpose

  const data = await req.json()
  const order = await Order.findByIdAndUpdate(params.id, data, { new: true })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Order Updated Successfully', order })
}

export async function generateStaticParams() {
  return [] // No static params (forces runtime resolution)
}
