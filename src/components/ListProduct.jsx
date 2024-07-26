import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Spin, Pagination, Input } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { handleFormatMoney } from '../utils/formatData';
import Cookies from "js-cookie";

export default function ProductList({ searchKeyword }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/user/categories');
        setCategories(response.data.data.content);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async (page, categoryId, keyword) => {
      setLoading(true);
      try {
        let url;
        const params = {
          page: page - 1,
          size: pageSize,
        };
        
        if (keyword) {
          url = 'http://localhost:8080/api/v1/user/products/search';
          params.search = keyword;
        } else {
          url = categoryId
            ? `http://localhost:8080/api/v1/user/products/categories/${categoryId}`
            : 'http://localhost:8080/api/v1/user/products';
        }

        const response = await axios.get(url, { params });
        console.log(response);
        setProducts(categoryId? response.data.data: response.data.content || []);
        setTotalProducts(response.data.totalElements || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(currentPage, selectedCategory, searchKeyword);
  }, [currentPage, selectedCategory, searchKeyword]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const addToCart = async (product) => {
    try {
      await axios.post('http://localhost:8080/api/v1/user/cart/add', { productId: product.id }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <main className="px-12">
      <h3 className="text-center uppercase font-semibold py-6">
        Danh sách sản phẩm
      </h3>
     
      <div className="flex justify-center mb-4">
        {categories.map((category) => (
          <Button
            key={category.categoryId}
            type={selectedCategory === category.categoryId ? 'primary' : 'default'}
            onClick={() => handleCategoryChange(category.categoryId)}
            className="mx-2"
          >
            {category.categoryName}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {Array.isArray(products) && products.map((product) => (
          <Card
            key={product.id}
            hoverable
            style={{
              width: '100%',
              height: '100%',
            }}
            cover={
              <img
                className="transform transition-transform duration-300 hover:scale-110"
                style={{ maxHeight: 200, objectFit: 'cover' }}
                alt={product.productName}
                src={product.imageUrl}
              />
            }
          >
            <div className="text-center flex flex-col gap-2">
              <h3 className="font-semibold">{product.productName}</h3>
              <p className="text-lg font-medium">{handleFormatMoney(product.price)}</p>
              <Button type="primary" onClick={() => addToCart(product)}>
                <ShoppingCartOutlined />
                Thêm vào giỏ hàng
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          total={totalProducts}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </main>
  );
}
