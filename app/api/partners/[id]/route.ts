import { connectDB } from '@/lib/db'
import Partner from '@/app/api/models/partner'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB()

  try {
    const body = await req.json() // Parse JSON data
    console.log('Received Data:', body) // Debugging

    const { shift, status } = body

    if (
      !shift ||
      !shift.start ||
      !shift.end ||
      status === undefined ||
      status === null
    ) {
      return NextResponse.json(
        { error: 'Shift start, end times, and status are required' },
        { status: 400 }
      )
    }

    const partner = await Partner.findByIdAndUpdate(
      params.id,
      { shift, status }, // Ensure both fields are updated
      { new: true, runValidators: true }
    )

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
