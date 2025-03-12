"use client"
import React, { FC } from 'react';
import { App, Avatar, Breadcrumb, Layout, Menu, Tag, theme } from 'antd';
import { layoutInterface } from '@/util/Interface';
import { AppstoreOutlined, FileProtectOutlined, InboxOutlined, LogoutOutlined, UsergroupAddOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const { Header, Content, Sider } = Layout;

const menus = [
    {
        key: 'dashboard',
        label: <Link href='/admin/dashboard'>Dashboard</Link>,
        icon: <AppstoreOutlined className='!text-xl' />
    },
    {
        key: 'assignments',
        label: <Link href='/admin/assignments'>Assignments</Link>,
        icon: <FileProtectOutlined className='!text-xl' />
    },
    {
        key: 'orders',
        label: <Link href='/admin/orders'>Orders</Link>,
        icon: <InboxOutlined className='!text-xl' />
    },
    {
        key: 'partners',
        label: <Link href='/admin/partners'>Delivery Partners</Link>,
        icon: <UsergroupAddOutlined className='!text-xl' />
    },

    {
        key: 'logout',
        label: <a onClick={() => alert("Logout")}>Logout</a>,
        icon: <LogoutOutlined className='!text-xl !font-semibold' />
    }
]

const DashboardLayout: FC<layoutInterface> = ({ children }) => {
    const { message } = App.useApp()

    const pathname = usePathname()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className='!min-h-screen'>
            <Sider
                className='!bg-white'
                breakpoint="lg"
                width={250}
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical flex flex-col items-center my-6 gap-1" >
                    <Avatar size={70} className='!bg-orange-200' >
                        <UserOutlined className='text-2xl !text-black' />
                    </Avatar>
                    <h1 className='text-xl font-semibold'>User LogedIn</h1>
                    <h1 className='text-base text-gray-400'>Emailusers@gmail.com</h1>
                    <Tag color='green' className='!px-4'>User</Tag>
                </div>
                <Menu theme="light" className='!text-2md font-semibold' mode="inline" defaultSelectedKeys={['4']} items={menus} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <h1 className='text-2xl font-semibold capitalize w-full pl-6 mx-auto mt-4'>{pathname.split('/').pop()}</h1>

                </Header>
                <Content
                    className='space-y-2 mt-2 px-6 mx-auto w-full'
                >
                    <div >
                        <Breadcrumb
                            className='!'
                            separator=">"
                            items={pathname.split('/').map((item) => ({ title: item }))}
                        />
                        {/* <h1 className='text-2xl font-semibold capitalize px-2'>{pathname.split('/').pop()}</h1> */}
                    </div>
                    <div
                        style={{
                            padding: 16,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
export default DashboardLayout;