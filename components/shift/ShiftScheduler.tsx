'use client'

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import axios from 'axios'
import { Table, Button, Modal, Form, Select, TimePicker, message, Tag } from 'antd'
import dayjs from 'dayjs'
import { ColumnsType } from 'antd/es/table'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const ShiftScheduler = () => {
    const { data: shifts, error: shiftErr } = useSWR('/api/shifts', fetcher)
    const {
        data: partners,
        error,
        isLoading,
    } = useSWR('/api/partners', fetcher)

    const [isShiftModelOpen, setShiftModelOpen] = useState(false)
    const [form] = Form.useForm()

    // Handle new shift creation
    const handleShift = async (values: { partnerId: string; start: dayjs.Dayjs; end: dayjs.Dayjs }) => {
        try {
            await axios.put(`/api/partners/`, {
                partnerId: values.partnerId,
                start: values.start.format('hh:mm A'),
                end: values.end.format('hh:mm A'),
                status: 'scheduled'
            })
            message.success('Shift scheduled successfully!')
            mutate('/api/shifts')
            setShiftModelOpen(false)
            form.resetFields()
        } catch (error) {
            message.error('Error scheduling shift')
        }
    }

    // Define table columns with sorting
    const columns: ColumnsType<any> = [
        {
            title: 'Partner ID',
            dataIndex: 'partnerId',
            key: 'partnerId',
            sorter: (a, b) => a.partnerId.localeCompare(b.partnerId),
        },
        {
            title: 'Shift Start',
            dataIndex: 'start',
            key: 'start',
            sorter: (a, b) => dayjs(a.start, 'hh:mm A').valueOf() - dayjs(b.start, 'hh:mm A').valueOf(),
        },
        {
            title: 'Shift End',
            dataIndex: 'end',
            key: 'end',
            sorter: (a, b) => dayjs(a.end, 'hh:mm A').valueOf() - dayjs(b.end, 'hh:mm A').valueOf(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Scheduled', value: 'scheduled' },
                { text: 'Completed', value: 'completed' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: string) => {
                const color = status === 'scheduled' ? 'blue' : status === 'completed' ? 'green' : 'red'
                return <Tag color={color}>{status.toUpperCase()}</Tag>
            }
        }
    ]

    return (
        <div>
            <h1>Shift Scheduling</h1>

            {/* Open Shift Form */}
            <Button type="primary" onClick={() => setShiftModelOpen(true)} style={{ marginBottom: 16 }}>
                Schedule New Shift
            </Button>

            {/* Shift Form */}
            <Modal title="Schedule Shift" open={isShiftModelOpen} onCancel={() => setShiftModelOpen(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleShift}>
                    <Form.Item name="partnerId" label="Delivery Partner" rules={[{ required: true }]}>
                        <Select placeholder="Select Partner">
                            {partners?.map((item: { _id: string; name: string }) => (
                                <Select.Option key={item._id} value={item._id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="start" label="Shift Start" rules={[{ required: true }]}>
                        <TimePicker use12Hours format="h:mm A" />
                    </Form.Item>
                    <Form.Item name="end" label="Shift End" rules={[{ required: true }]}>
                        <TimePicker use12Hours format="h:mm A" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form>
            </Modal>

            {/* Shift Table */}
            <Table dataSource={shifts || []} columns={columns} rowKey="_id" />
        </div>
    )
}

export default ShiftScheduler
