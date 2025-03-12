import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Assignment from '@/app/api/models/assignment'

export async function GET() {
  await connectDB()

  // Fetch assignments with timestamps
  const assignments = await Assignment.find()

  if (!assignments.length) {
    return NextResponse.json({}, { status: 200 })
  }

  // Calculate Metrics
  const totalAssigned = assignments.length
  const successCount = assignments.filter((a) => a.status === 'success').length
  const failureReasons: Record<string, number> = {}

  let totalTime = 0
  let completedAssignments = 0

  assignments.forEach((a) => {
    if (a.status === 'success' && a.createdAt && a.updatedAt) {
      const createdAt = new Date(a.createdAt) // ✅ Explicit conversion
      const updatedAt = new Date(a.updatedAt) // ✅ Explicit conversion

      if (!isNaN(createdAt.getTime()) && !isNaN(updatedAt.getTime())) {
        totalTime += (updatedAt.getTime() - createdAt.getTime()) / 60000 // Convert ms to minutes
        completedAssignments++
      }
    }

    if (a.status === 'failed' && a.reason) {
      failureReasons[a.reason] = (failureReasons[a.reason] || 0) + 1
    }
  })

  return NextResponse.json(
    {
      totalAssigned,
      totalSuccess: successCount,
      totalFails: totalAssigned - successCount,
      successRate: totalAssigned ? successCount / totalAssigned : 0,
      averageTime: completedAssignments
        ? totalTime / completedAssignments
        : null,
      failureReasons: Object.entries(failureReasons).map(([reason, count]) => ({
        reason,
        count,
      })),
    },
    { status: 200 }
  )
}
