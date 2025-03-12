import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Order from '@/app/api/models/order' // Import order model
import Partner from '@/app/api/models/partner' // Import partner model

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || ''

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI)
}

// TypeScript Interface for Dashboard Data
interface DashboardData {
  totalOrders: number
  activePartners: number
  successRate: number
  orders: {
    _id: string
    orderNumber: string
    customerName: string
    totalAmount: number
    status: string
  }[]
  partners: {
    available: number
    busy: number
    offline: number
  }
}

// GET API Handler
export async function GET() {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments()

    // Get latest orders with projection
    const orders = await Order.find(
      {},
      { orderNumber: 1, 'customer.name': 1, totalAmount: 1, status: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    // Get active partners count
    const activePartners = await Partner.countDocuments({ status: 'active' })

    // Get partner status distribution
    const available = await Partner.countDocuments({ status: 'available' })
    const busy = await Partner.countDocuments({ status: 'busy' })
    const offline = await Partner.countDocuments({ status: 'offline' })

    // Mock success rate (this can be computed based on actual business logic)
    const successRate = (
      totalOrders > 0 ? Math.random() * (99 - 85) + 85 : 0
    ).toFixed(2)

    // Format response
    const dashboardData: DashboardData = {
      totalOrders,
      activePartners,
      successRate: parseFloat(successRate),
      orders: orders.map((order: any) => ({
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customer?.name || 'Unknown',
        totalAmount: order.totalAmount,
        status: order.status,
      })),
      partners: { available, busy, offline },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
