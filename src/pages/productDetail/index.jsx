import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { Button, Col, Divider, InputNumber, Layout, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HeaderHomePage from '../../layouts/header';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { addWishList, fetchWishList } from '../../redux/slices/wishlistSlice';
import { useDispatch } from 'react-redux';
import Comments from '../../components/Comment';
import RelatedProducts from '../../components/RelatedProduct';


const { Title, Text } = Typography;

export default function ProductDetail() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [productDel, setProductDel] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { id } = useParams();

    useEffect(() => {
        dispatch(fetchWishList());
    }, [dispatch]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/user/products`);
                const products = response.data.content;
                const productDetail = products.find(item => item.id === parseInt(id));
                setProductDel(productDetail);
            } catch (error) {
                console.error('Error fetching product:', error);
                setProductDel(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCart = async (id) => {
        try {
            await axios.post('http://localhost:8080/api/v1/user/cart/add', { productId: id }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const addToWishList = async (productId) => {
        await dispatch(addWishList({ productId }));
        dispatch(fetchWishList());
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!productDel) {
        return <div>Product not found</div>;
    }

    return (
        <Layout>
            <HeaderHomePage />
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <Row gutter={16}>
                    <Col span={10}>
                        <img 
                            src={productDel.imageUrl} 
                            alt={productDel.productName} 
                            style={{ width: '100%', marginBottom: '16px' }}
                        />
                    </Col>
                    <Col span={14}>
                        <Title level={2}>{productDel.productName}</Title>
                        <Text strong style={{ fontSize: '24px' }}>
                            {productDel.price} 
                            <Text delete style={{ marginLeft: '8px', color: 'gray' }}>
                                {productDel.oldPrice} 
                            </Text>
                            <Text type="danger" style={{ marginLeft: '8px' }}>
                                {productDel.discount}
                            </Text>
                        </Text>
                        <Divider />
                        <Text strong>Chọn màu sắc:</Text>
                        <div>
                            {/* Add color buttons */}
                        </div>
                        <Divider />
                        <Text strong>Chọn size:</Text>
                        <div>
                            {/* Add size buttons */}
                        </div>
                        <Divider />
                        <Text strong>Chọn số lượng:</Text>
                        <InputNumber min={1} defaultValue={1} style={{ marginLeft: '8px' }} />
                        <Divider />
                        <Button type="primary" onClick={() => addToCart(productDel.id)} icon={<ShoppingCartOutlined />} style={{ marginRight: '8px' }}>
                            Thêm vào giỏ hàng
                        </Button>
                        <Button onClick={() => addToWishList(productDel.id)} icon={<HeartOutlined />}>Yêu thích</Button>
                        <Divider />
                        <Comments productId={productDel.id} />
                    </Col>
                </Row>
                <Divider />
                <Title level={3}>Mô Tả Sản Phẩm</Title>
                <Text>
                    Áo thun tay ngắn là một trong những item cơ bản phổ biến trong thời trang thường ngày...
                </Text>
                <Divider />
                <Title level={3}>Sản Phẩm Liên Quan</Title>
                <RelatedProducts categoryId={productDel.categoryId} /> {/* Add the RelatedProducts component */}
            </Content>
        </Layout>
    );
}
