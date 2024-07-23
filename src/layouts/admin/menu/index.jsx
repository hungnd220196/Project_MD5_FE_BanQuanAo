import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  PieChartOutlined,
  DownOutlined,
  BellOutlined,
  MessageOutlined,
  FileTextOutlined,
  ProductOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Image, Layout, Menu, Space, theme } from 'antd';
import { NavLink } from 'react-router-dom';

import LayoutIndex from '..';
const { Header, Sider, Content } = Layout;

export default function MenuAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  const items = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <NavLink to="/admin">Tổng quan</NavLink>,
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: <NavLink to="/admin/users">Quản lý tài khoản</NavLink>,
    },
    {
      key: '3',
      icon: <FileTextOutlined />,
      label: <NavLink to="/admin/category">Quản lý danh mục</NavLink>,
    },
    {
      key: '4',
      icon: <ProductOutlined />,
      label: <NavLink to="/admin/product">Quản lý sản phẩm</NavLink>,
    },
    {
      key: '5',
      icon: <PieChartOutlined />,
      label: <NavLink to="/admin/orders">Quản lý đơn hàng</NavLink>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>

        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items}
        />
      </Sider>
      <Layout>
        {/* <HeaderAmin/> */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor : 'lightskyblue',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
           <Space size={16} wrap style={{position: 'absolute', right : 50}}>
           <BellOutlined style={{ fontSize: '25px' }} />
           <MessageOutlined style={{ fontSize: '25px'}} />
              <Image
                
                width={50}
                style={{ borderRadius: '50%' }}
              src="https://kynguyenlamdep.com/wp-content/uploads/2022/08/anh-cute-meo-con-nguy-hiem.jpg"/>
                
                {/* <Avatar size={50} src={<img src={'https://kynguyenlamdep.com/wp-content/uploads/2022/08/anh-cute-meo-con-nguy-hiem.jpg'} alt="avatar" />} /> */}
            <Dropdown
                    menu={{
                    items,
                    onClick,
                    }}
            >
                <a onClick={(e) => e.preventDefault()}>
                <Space>
                    Hover me, Click menu item
                    <DownOutlined />
                </Space>
                </a>
            </Dropdown>
            </Space>
        </Header>
        <Content
          style={{
            margin: '0px',
            padding: 5,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
      
        >
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  );
}
