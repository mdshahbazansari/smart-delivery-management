'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import {
  Table,
  Tag,
  Spin,
  message,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  TimePicker,
} from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import fetcher from '@/lib/fetcher'

const Orders = () => {
  const {
    data: orders,
    error,
    isLoading,
    mutate,
  } = useSWR('/api/orders', fetcher)
  const { data: partners } = useSWR('/api/partners', fetcher)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [assignForm] = Form.useForm()
  const [totalAmount, setTotalAmount] = useState(0)

  if (error) {
    console.error('Error fetching orders')
  }

  // Generate a unique order number (ORD1001, ORD1002, etc.)
  const generateOrderNumber = () => {
    return `ORD${Math.floor(1000 + Math.random() * 9000)}` // Generates a number between ORD1000 - ORD9999
  }

  const handleItemsChange = () => {
    const items = form.getFieldValue('items') || []
    const calculatedTotal = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    )
    setTotalAmount(calculatedTotal)
  }

  // Create Order
  const handleCreateOrder = async (values) => {
    try {
      const orderData = {
        ...values,
        orderNumber: generateOrderNumber(),
        totalAmount, // Use calculated totalAmount
      }
      await axios.post('/api/orders', orderData)
      console.log('Order Created Successfully!')
      setIsModalOpen(false)
      mutate() // Refresh orders list
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to create order')
    }
  }

  // Assign Order
  const handleAssignOrder = async ({ orderId, partnerId }) => {
    try {
      await axios.post('/api/assignments', {
        orderId,
        partnerId,
      })

      setIsAssignModalOpen(false)
      mutate('/api/orders')
      console.log('Order assigned successfully!')
    } catch (error) {
      console.error(
        'Error assigning order:',
        error.response?.data || error.message
      )
    }
  }

  // Table Columns
  const columns = [
    { title: 'Order #', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'Customer', dataIndex: ['customer', 'name'], key: 'customer' },
    { title: 'Phone', dataIndex: ['customer', 'phone'], key: 'phone' },
    { title: 'Area', dataIndex: 'area', key: 'area' },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) =>
        items.map((item, index) => (
          <div key={index}>
            {item.name} - {item.quantity} × ₹{item.price}
          </div>
        )),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amt) => `₹${amt}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color =
          status === 'pending'
            ? 'orange'
            : status === 'assigned'
            ? 'blue'
            : 'green'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type='primary'
          onClick={() => {
            assignForm.setFieldsValue({ orderId: record._id })
            setIsAssignModalOpen(true)
          }}
          disabled={record.status !== 'pending'}
        >
          Assign Order
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Button type='primary' onClick={() => setIsModalOpen(true)}>
        Create Order
      </Button>
      {isLoading ? (
        <Spin size='large' />
      ) : (
        <Table
          dataSource={Array.isArray(orders) ? orders : []}
          columns={columns}
          rowKey='_id'
        />
      )}

      {/* Create Order Modal */}
      <Modal
        title='Create Order'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout='vertical' onFinish={handleCreateOrder}>
          <Form.Item
            name={['customer', 'name']}
            label='Customer Name'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['customer', 'phone']}
            label='Customer Phone'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['customer', 'address']}
            label='Customer Address'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='area' label='Area' rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {/* Items List */}
          <Form.List name='items'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align='baseline'>
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label='Item Name'
                      rules={[{ required: true }]}
                    >
                      <Input placeholder='Product Name' />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      label='Qty'
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} onChange={handleItemsChange} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      label='Price'
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} onChange={handleItemsChange} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button
                  type='dashed'
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Item
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item label='Total Amount'>
            <Input value={`₹${totalAmount}`} readOnly />
          </Form.Item>

          <Form.Item
            name='scheduledFor'
            label='Scheduled Time (HH:mm)'
            rules={[{ required: true }]}
          >
            <TimePicker use12Hours format='h:mm A' className='w-full' />
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Order Modal */}
      <Modal
        title='Assign Order'
        open={isAssignModalOpen}
        onCancel={() => setIsAssignModalOpen(false)}
        onOk={() => assignForm.submit()}
      >
        <Form form={assignForm} layout='vertical' onFinish={handleAssignOrder}>
          <Form.Item name='orderId' label='Order ID' hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name='partnerId'
            label='Select Partner'
            rules={[{ required: true, message: 'Please select a partner' }]}
          >
            <Select placeholder='Select Partner'>
              {Array.isArray(partners)
                ? partners.map((item) => (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Orders
