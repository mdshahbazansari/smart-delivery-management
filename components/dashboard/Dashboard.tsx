"use client";

import React from "react";
import useSWR from "swr";
import { Card, Row, Col, Statistic, Spin, Table, Tag, message } from "antd";
import fetcher from "@/lib/fetcher";

// Define Types for Dashboard Data
interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
}

interface DashboardData {
  totalOrders: number;
  activePartners: number;
  successRate: number;
  orders: Order[];
  partners: {
    available: number;
    busy: number;
    offline: number;
  };
}



const Dashboard = () => {
  // Fetch data from API
  const { data, error, isLoading } = useSWR<DashboardData>("/api/dashboard", fetcher);

  if (error) {
    message.error("Error fetching dashboard data");
  }

  // Define table columns for orders
  const orderColumns = [
    { title: "Order #", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", render: (amt: number) => `₹${amt}` },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "pending" ? "orange" : status === "assigned" ? "blue" : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <Col span={8}>
              <Card hoverable style={{
                background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)'
              }}>
                <Statistic title="Total Orders" value={data?.totalOrders || 0} />
              </Card>
            </Col>
            <Col span={8}>
              <Card hoverable style={{
                background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)'
              }}>
                <Statistic title="Active Partners" value={data?.activePartners || 0} />
              </Card>
            </Col>
            <Col span={8}>
              <Card hoverable style={{
                background: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'
              }}>
                <Statistic title="Success Rate" value={data?.successRate || 0} suffix="%" />
              </Card>
            </Col>
          </>
        )}
      </Row>

      <h2 style={{ marginTop: 20 }}>Latest Orders</h2>
      {isLoading ? <Spin size="large" /> : <Table dataSource={data?.orders || []} columns={orderColumns} rowKey="_id" />}

      <h2 style={{ marginTop: 20 }}>Partner Status</h2>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic title="Available" value={data?.partners?.available || 0} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Busy" value={data?.partners?.busy || 0} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Offline" value={data?.partners?.offline || 0} />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
