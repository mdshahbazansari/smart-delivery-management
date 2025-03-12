import { connectDB } from '@/lib/db'
import Order from '@/app/api/models/order'
import Partner from '@/app/api/models/partner'
import Assignment from '@/app/api/models/assignment'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { orderId, partnerId } = await req.json()

    if (!orderId || !partnerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const partner = await Partner.findById(partnerId)
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const existingAssignment = await Assignment.findOne({ orderId })
    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Order already assigned' },
        { status: 409 }
      )
    }

    console.log('Creating assignment:', { orderId, partnerId })

    const assignment = await Assignment.create({
      orderId,
      partnerId,
      status: 'assigned',
      assignedAt: new Date(),
    })

    console.log('Assignment created:', assignment)

    // ✅ Check if order is correctly retrieved
    console.log('Order before update:', order)

    // ✅ Ensure order is correctly updated
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: 'assigned', assignedTo: partnerId } }
    )

    console.log('Updated order result:', updatedOrder)

    return NextResponse.json({ success: true, assignment })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()

    const assignments = await Assignment.find()
      .limit(5)
      .sort({ createdAt: -1 })
      .populate('orderId') // Keeping full order details
      .populate({
        path: 'partnerId',
        select: 'name', // Only fetching the 'name' field from Partner
      })

    return NextResponse.json(assignments, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
