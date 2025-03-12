'use client' // Ensures it runs on the client side

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
  TimePicker,
} from 'antd'
import fetcher from '@/lib/fetcher'
import moment from 'moment'

const { Option } = Select

const Partners = () => {
  const {
    data: partners,
    error,
    isLoading,
    mutate,
  } = useSWR('/api/partners', fetcher)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShiftModelOpen, setShiftModelOpen] = useState(false)
  const [form] = Form.useForm()
  const [sortOrder, setSortOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)

  if (error) {
    console.error('Error fetching partners')
  }

  // Open Modal
  const showModal = () => {
    setIsModalOpen(true)
  }

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  // Submit Form
  const handleSubmit = async (values) => {
    try {
      await axios.post('/api/partners', values)
      console.log('Partner registered successfully!')
      mutate() // Refresh data
      handleCancel()
    } catch (err) {
      console.error('Error registering partner')
    }
  }

  const handleShift = async (values) => {
    try {
      await axios.put(`/api/partners/${values.partnerId}`, {
        shift: {
          start: values.start.format('hh:mm A'),
          end: values.end.format('hh:mm A'),
        },
        status: values.status,
      })
      console.log('Shift scheduled successfully!')
      setShiftModelOpen(false)
      form.resetFields()
      mutate('/api/partners')
    } catch (error) {
      console.error('Error scheduling shift')
    }
  }

  // Sorting function
  const sortedData = () => {
    if (!partners) return []
    let sortedPartners = [...partners]
    if (sortOrder) {
      sortedPartners.sort((a, b) => {
        return sortOrder === 'asc'
          ? a.metrics.completedOrders - b.metrics.completedOrders
          : b.metrics.completedOrders - a.metrics.completedOrders
      })
    }
    if (statusFilter) {
      sortedPartners = sortedPartners.filter(
        (partner) => partner.status === statusFilter
      )
    }
    return sortedPartners
  }

  // Define table columns
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Areas',
      dataIndex: 'areas',
      key: 'areas',
      render: (areas) => (areas ? areas.join(', ') : '-'),
    },
    { title: 'Current Load', dataIndex: 'currentLoad', key: 'currentLoad' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'active' ? 'green' : 'red'
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      render: (shift) =>
        shift
          ? `${moment(shift.start, 'HH:mm').format('hh:mm a')} - ${moment(
              shift.end,
              'HH:mm'
            ).format('hh:mm a')}`
          : '--',
    },
    {
      title: 'Rating',
      dataIndex: ['metrics', 'rating'],
      key: 'rating',
      sorter: (a, b) => a.metrics.rating - b.metrics.rating,
    },
    {
      title: 'Completed Orders',
      dataIndex: ['metrics', 'completedOrders'],
      key: 'completedOrders',
      sorter: (a, b) => a.metrics.completedOrders - b.metrics.completedOrders,
    },
  ]

  return (
    <div>
      {/* Sorting and Filtering Buttons */}
      <div
        style={{
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}
        className='flex items-center '
      >
        {/* Button to Open Form */}
        <Button type='primary' onClick={showModal}>
          Register Delivery Partner
        </Button>
        <Button type='primary' onClick={() => setShiftModelOpen(true)}>
          Schedule New Shift
        </Button>

        <Button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Sort by Completed{' '}
          {sortOrder === 'asc' ? '(Descending)' : '(Ascending)'}
        </Button>
        <Select
          placeholder='Filter by Status'
          onChange={setStatusFilter}
          allowClear
        >
          <Option value='active'>Active</Option>
          <Option value='inactive'>Inactive</Option>
        </Select>
      </div>

      {/* Registration Modal */}
      <Modal
        title='Register Partner'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item name='name' label='Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='phone' label='Phone' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='areas' label='Areas'>
            <Input placeholder='Enter comma-separated areas' />
          </Form.Item>
          <div className='flex items-center justify-between space-x-2'>
            <Form.Item
              className='w-full'
              name='status'
              label='Status'
              initialValue='active'
            >
              <Select>
                <Option value='active'>Active</Option>
                <Option value='inactive'>Inactive</Option>
              </Select>
            </Form.Item>
            <Form.Item
              className='w-full'
              name='currentLoad'
              label='Current Load'
            >
              <Input
                type='number'
                min={0}
                max={3}
                placeholder='Enter Current Load'
              />
            </Form.Item>
          </div>

          {/* New Fields */}
          <div className='flex items-center justify-between space-x-2'>
            <Form.Item
              className='w-6/12'
              name={['shift', 'start']}
              label='Shift Start'
              rules={[{ required: true }]}
            >
              <Input type='time' />
            </Form.Item>
            <Form.Item
              className='w-6/12'
              name={['shift', 'end']}
              label='Shift End'
              rules={[{ required: true }]}
            >
              <Input type='time' />
            </Form.Item>
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Form.Item
              className='w-6/12'
              name={['metrics', 'rating']}
              label='Rating'
              rules={[{ required: true }]}
            >
              <Input type='number' min={0} max={5} step={0.1} />
            </Form.Item>
            <Form.Item
              className='w-6/12'
              name={['metrics', 'completedOrders']}
              label='Completed Orders'
              rules={[{ required: true }]}
            >
              <Input type='number' min={0} />
            </Form.Item>
          </div>

          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal
        title='Schedule Shift'
        open={isShiftModelOpen}
        onCancel={() => setShiftModelOpen(false)}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleShift}>
          <Form.Item
            name='partnerId'
            label='Delivery Partner'
            rules={[{ required: true }]}
          >
            <Select placeholder='Select Partner'>
              {partners?.map((item, index) => (
                <Select.Option key={index} value={item._id}>
                  {item.name}
                </Select.Option>
              ))}
              {/* {partners?.length > 0 ? (
                partners.map((partner) => (
                  <div key={partner.id}>{partner.name}</div>
                ))
              ) : (
                <p>No partners available.</p>
              )} */}
            </Select>
          </Form.Item>
          <Form.Item
            className='w-full'
            name='status'
            label='Status'
            initialValue='active'
          >
            <Select>
              <Option value='active'>Active</Option>
              <Option value='inactive'>Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='start'
            label='Shift Start'
            rules={[{ required: true }]}
          >
            <TimePicker use12Hours format='h:mm A' />
          </Form.Item>
          <Form.Item name='end' label='Shift End' rules={[{ required: true }]}>
            <TimePicker use12Hours format='h:mm A' />
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form>
      </Modal>

      {/* Data Table */}
      {isLoading ? (
        <Spin size='large' />
      ) : (
        <Table dataSource={sortedData()} columns={columns} rowKey='_id' />
      )}
    </div>
  )
}

export default Partners
