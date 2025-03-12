'use client'

import useSWR from 'swr'
import React, { useState } from 'react'
import { Table, Button, Card, Statistic } from 'antd'
import fetcher from '@/lib/fetcher'

const Assignments = () => {
  // Fetch assignment metrics
  const {
    data: metrics,
    error,
    mutate,
  } = useSWR('/api/assignments/metrics', fetcher)

  // Fetch all assignments
  const {
    data: assignments,
    error: assignmentErr,
    isLoading: assignmentLoading,
  } = useSWR('/api/assignments', fetcher)

  const [loading, setLoading] = useState(false)

  // Handle assigning an order
  const assignOrder = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/assignments/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: 'ORDER_ID_HERE' }), // Replace with actual order ID
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Assignment failed')

      console.log('Order assigned successfully!')
      mutate() // Refresh the metrics after assignment
    } catch (error) {
      console.error(error.message || 'Failed to assign order')
    } finally {
      setLoading(false)
    }
  }

  if (error) return <p>Error loading assignments</p>
  if (!metrics) return <p>Loading...</p>

  // Calculate total success & failures
  const totalSuccess = Math.round(
    (metrics.successRate || 0) * metrics.totalAssigned
  )
  const totalFails = metrics.totalAssigned - totalSuccess

  return (
    <div>
      {/* Key Metrics Section */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'space-between', // Ensures even spacing
        }}
        className='mb-2 grid-cols-5'
      >
        {[
          { title: 'Total Assignments', value: metrics.totalAssigned || 0 },
          // { title: 'Total Success', value: totalSuccess },
          // { title: 'Total Fails', value: totalFails },
          {
            title: 'Success Rate',
            value: `${(metrics.successRate * 100).toFixed(2)}%`,
          },
          {
            title: 'Average Time (mins)',
            value: metrics.averageTime
              ? metrics.averageTime.toFixed(2)
              : 'No Data',
          },
        ].map((item, index) => (
          <Card
            key={index}
            hoverable
            style={{
              background: 'linear-gradient(45deg, #d3d3d3 0%, #f5f5f5 100%)',
              width: '300px', // Set fixed width
              height: '120px', // Set fixed height
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Statistic title={item.title} value={item.value} />
          </Card>
        ))}
      </div>

      {/* Assignment Table */}
      <h2>Assigned Orders</h2>
      <Table
        dataSource={
          assignments?.map((order, index) => ({
            key: index,
            orderId: order.orderId,
            partnerName: order.partnerId?.name || 'N/A', // Get the partner name
            status: order.status,
            assignedAt: new Date(order.assignedAt).toLocaleString(),
          })) || []
        }
        loading={assignmentLoading}
        columns={[
          {
            title: 'Delivery Partner Name',
            dataIndex: 'partnerName',
            key: 'partnerName',
          }, // Added Partner Name column
          { title: 'Status', dataIndex: 'status', key: 'status' },
          { title: 'Assigned At', dataIndex: 'assignedAt', key: 'assignedAt' },
        ]}
        pagination={true}
      />

      {/* Assign Order Button */}
      <Button
        type='primary'
        loading={loading}
        onClick={assignOrder}
        style={{ marginTop: '20px' }}
      >
        Assign New Order
      </Button>
    </div>
  )
}

export default Assignments
