import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import BASE_URL from '../../api';
import { DELETE, GET, POST } from '../../constants/httpMethod';
import { Button, Col, Divider, Input, InputNumber, Layout, message, Row, Typography, List } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HeaderHomePage from '../../layouts/header';
import { HeartOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import { addWishList, fetchWishList } from '../../redux/slices/wishlistSlice';
import { useDispatch } from 'react-redux';
import Comments from '../../components/Comment';
import { fetchAllComments } from '../../redux/slices/commentSlice';

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
        // dispatch(fetchAllComments(id))
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

    // useEffect(() => {
    //     const fetchComments = async (id) => {
    //         try {
    //             const response = await axios.get(`http://localhost:8080/api/v1/user/comments/product/${id}`);
    //             setComments(response.data);
    //         } catch (error) {
    //             console.error('Error fetching comments:', error);
    //         }
    //     };

    //     fetchComments();
    // }, [id]);



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

    // const handleCommentSubmit = async () => {
    //     try {
    //         await axios.post(`http://localhost:8080/api/v1/user/products/${id}/comments`, { content: newComment }, {
    //             headers: {
    //                 Authorization: `Bearer ${Cookies.get('token')}`,
    //             },
    //         });
    //         message.success('Đã thêm bình luận');
    //         setNewComment('');
    //         // Refresh comments
    //         const response = await axios.get(`http://localhost:8080/api/v1/user/products/${id}/comments`);
    //         setComments(response.data);
    //     } catch (error) {
    //         console.error('Error adding comment:', error);
    //         message.error('Có lỗi xảy ra khi thêm bình luận');
    //     }
    // };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!productDel) {
        return <div>Product not found</div>;
    }
    console.log("aaa",productDel);

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
                            {/* {product.colors.map((color) => (
                                <Button style={{ margin: '4px' }} key={color}>{color}</Button>
                            ))} */}
                        </div>
                        <Divider />
                        <Text strong>Chọn size:</Text>
                        <div>
                            {/* {product.sizes.map((size) => (
                                <Button 
                                    style={{ margin: '4px' }} 
                                    key={size}
                                    disabled={size === 'XL'}
                                >
                                    {size}
                                </Button>
                            ))} */}
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
                        {/* <Title level={3}>Đánh giá và Bình luận</Title>
                        <div className='flex'>
                        <StarOutlined/><StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined />
                        </div>
                        <div>
                            <Input.TextArea
                                rows={4}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Nhập bình luận của bạn..."
                            />
                            <Button
                                type="primary"
                                onClick={handleCommentSubmit}
                                style={{ marginTop: '16px' }}
                            >
                                Gửi bình luận
                            </Button>
                        </div>
                        <Divider />
                        <List
                            header={<div>Bình luận</div>}
                            bordered
                            dataSource={comments}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        /> */}
                    </Col>
                </Row>
                <Divider />
                <Title level={3}>Mô Tả Sản Phẩm</Title>
                <Text>
                    Áo thun tay ngắn là một trong những item cơ bản phổ biến trong thời trang thường ngày...
                </Text>
            </Content>
        </Layout>
    );
}
