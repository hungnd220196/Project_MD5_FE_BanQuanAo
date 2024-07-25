import React from 'react';
import { Layout, Menu, Carousel, Button, Space, Input } from 'antd';
import './index.css';
import HeaderHomePage from '../../layouts/header';
import YourCarouselComponent from '../../components/CarouselComponent';
import ProductList from '../../components/ListProduct';
import NewProduct from '../../components/NewProductComponent';

const { Header, Content, Footer } = Layout;

const HomeIndex = () => {
  return (
    <Layout 
    className="layout"
    >
      <HeaderHomePage/>
      <YourCarouselComponent />
      <ProductList/>
      <NewProduct/>
    </Layout>
  );
};

export default HomeIndex;
