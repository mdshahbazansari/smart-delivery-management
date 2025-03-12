import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/app/api/models/order'
import Assignment from '@/app/api/models/assignment' // ✅ Import Assignment model

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { orderId, partnerId, status } = body // ✅ Include area

    if (!orderId || !partnerId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // ✅ Update the order details
    order.assignedTo = partnerId
    order.status = status

    await order.save()

    // ✅ Create a new assignment entry
    const assignment = new Assignment({
      orderId,
      partnerId,
      status: 'assigned', // Default to assigned when created
    })
    await assignment.save()

    return NextResponse.json(
      { success: true, message: 'Order assigned successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error assigning order:', error.message)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
