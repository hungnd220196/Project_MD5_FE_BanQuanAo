import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Spin, Pagination, Select } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 5; // Số lượng sản phẩm trên mỗi trang

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/user/categories');
        console.log(response);
        setCategories(response.data.data.content);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async (page, categoryId) => {
      console.log(categoryId);
      setLoading(true);
      try {
        const url = categoryId
          ? `http://localhost:8080/api/v1/user/products/categories/${categoryId}`
          : 'http://localhost:8080/api/v1/user/products';
        const response = await axios.get(url, {
          params: {
            page: page - 1,
            size: pageSize,
          },
        });
        console.log(response);
        setProducts(categoryId? response.data.data : response.data.content); // Ensure products is always an array
        setTotalProducts(response.data.totalElements || 0); // Handle totalElements
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when category changes
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
        <Select
          placeholder="Chọn danh mục"
          onChange={handleCategoryChange}
          style={{ width: 200 }}
          allowClear
        >
          {categories.map((category) => (
            <Option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </Option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {products.map((product) => (
          <Card
            key={product.productId}
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
              <Button type="primary">
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
