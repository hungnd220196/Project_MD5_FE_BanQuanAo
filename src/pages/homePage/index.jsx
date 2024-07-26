import React, { useState } from 'react';
import { Layout, Menu, Carousel, Button, Space, Input } from 'antd';
import './index.css';
import HeaderHomePage from '../../layouts/header';
import YourCarouselComponent from '../../components/CarouselComponent';
import ProductList from '../../components/ListProduct';
import NewProduct from '../../components/NewProductComponent';
import Contact from '../../components/Contact';

const { Header, Content, Footer } = Layout;

const HomeIndex = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  return (
    <Layout 
    className="layout"
    >
      <HeaderHomePage setSearchKeyword={setSearchKeyword}/>
      <YourCarouselComponent />
      <ProductList searchKeyword={searchKeyword}/>
      <NewProduct/>
      <Contact/>
    </Layout>
  );
};

export default HomeIndex;
