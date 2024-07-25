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
     
    </Layout>
  );
};

export default HomeIndex;
