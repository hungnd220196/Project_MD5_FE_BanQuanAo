import React from 'react';
import { Layout, Menu, Carousel, Button, Space, Input } from 'antd';
import './index.css';
import { HeartOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import HeaderHomePage from '../../layouts/header';

const { Header, Content, Footer } = Layout;

const HomeIndex = () => {
  return (
    <Layout 
    className="layout"
    >
      <HeaderHomePage/>
       {/* <Header style={{width : "100%", height : "75px"}}>
        <div className="header-content">
          <div className="logo">ROUTINE</div>
          <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1,fontSize:18,marginLeft : 80 }}>
            <Menu.Item key="1">Nam</Menu.Item>
            <Menu.Item key="2">Nữ</Menu.Item>
            <Menu.Item key="3">New</Menu.Item>
            <Menu.Item key="4">Best</Menu.Item>
            <Menu.Item key="5">Giá Tốt</Menu.Item>
          </Menu>
          <div className="header-icons">
             <div className="search-container">
                <SearchOutlined className="search-icon" />
                <input type="text" placeholder="Tìm kiếm" className="search-input" />
             </div>
            <NavLink to="/login"><UserOutlined className="header-icon" /></NavLink>
            <HeartOutlined className="header-icon"/>
            <ShoppingCartOutlined className="header-icon" />
          </div>
        </div>
      </Header> */}
       {/* <Header>
        <div className="header-content">
          <div className="logo"><img src="" alt="" /></div>
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1 }}>
            <Menu.Item key="1">Nam</Menu.Item>
            <Menu.Item key="2">Nữ</Menu.Item>
            <Menu.Item key="3">Trẻ em</Menu.Item>
            <Menu.Item key="4">Bộ sưu tập</Menu.Item>
            <Menu.Item key="5">Đồng phục</Menu.Item>
          </Menu>
          <Space>
            <Button type="primary">Đăng nhập</Button>
            <Button>Đăng ký</Button>
          </Space>
        </div>
      </Header> */}
      {/* <Content style={{ padding: '0 50px' }}>
        <Carousel autoplay>
          <div className="carousel-item">
            <div className="carousel-content">
              <h2>ƯU ĐÃI</h2>
              <h1>30-50%</h1>
              <p>HÀNG TRIỆU SẢN PHẨM</p>
              <Button type="primary">MUA NGAY</Button>
            </div>
            <div className="carousel-image">
              <img src="path_to_your_image.png" alt="Banner" />
            </div>
          </div>

        </Carousel>
      </Content> */}
      {/* <Footer style={{ textAlign: 'center' }}></Footer> */}
    </Layout>
  );
};

export default HomeIndex;

//  <div>
//         <NavLink to="/login">Đăng Nhập</NavLink><br /><br />
//         <Link to="/register">Đăng Ký</Link><br /><br />
//     </div>