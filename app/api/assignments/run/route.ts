import { connectDB } from '@/lib/db'
import Order from '@/app/api/models/order'
import Partner from '@/app/api/models/partner'
import Assignment from '@/app/api/models/assignment'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  await connectDB()
  const { orderId } = await req.json()
  const order = await Order.findById(orderId)

  if (!order)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const partner = await Partner.findOne({
    status: 'active',
    currentLoad: { $lt: 3 },
    areas: order.area,
  })

  if (!partner) {
    await Assignment.create({
      orderId,
      status: 'failed',
      reason: 'No available partner',
    })
    return NextResponse.json({ error: 'No available partner' }, { status: 400 })
  }

  order.assignedTo = partner._id
  order.status = 'assigned'
  await order.save()

  partner.currentLoad += 1
  await partner.save()

  await Assignment.create({
    orderId,
    partnerId: partner._id,
    status: 'success',
  })

  return NextResponse.json({ message: 'Order assigned successfully', partner })
}
