import React, { useState, useEffect } from 'react';
// import { fetchNewProducts } from './services/productService';

import axios from 'axios';
import { Button, Card } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const NewProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNewProducts = async () => {
      try {
        const newProducts = await axios.get("http://localhost:8080/api/v1/user/products/new-products",
        );
        console.log(newProducts);
        setProducts(newProducts.data.data);
      } catch (error) {
        setError("Failed to load new products");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadNewProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      await axios.post('http://localhost:8080/api/v1/user/cart/add', { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{marginTop:"30px"}}>
    <h2 className='text-center font-semibold'>Danh sách sản phẩm mới</h2>
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
              <p className="text-lg font-medium">{(product.price)}</p>
              <Button type="primary" onClick={() => addToCart(product)}>
                <ShoppingCartOutlined />
                Thêm vào giỏ hàng
              </Button>
            </div>
          </Card>
        ))}
      </div>
      </div>
  );
};

export default NewProduct;
