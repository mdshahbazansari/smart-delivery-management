import { connectDB } from '@/lib/db';
import Order from '@/app/api/models/order';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const data = await req.json();

  if (!context.params.id) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  const order = await Order.findByIdAndUpdate(context.params.id, data, { new: true });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Order Updated Successfully', order });
}
