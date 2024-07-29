import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Layout, Radio, Row, Select, message } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import axios from 'axios';
import { clearAllCart, fetchCart } from '../../../redux/slices/shoppingCartSlice';
import { handleFormatMoney } from '../../../utils/formatData';
import { addOrders } from '../../../redux/slices/orderSlice';
import BASE_URL from '../../../api';
import { POST } from '../../../constants/httpMethod';
import { useNavigate } from 'react-router-dom';

export default function CheckOut() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [form] = Form.useForm();
    const { data } = useSelector((state) => state.shoppingCarts.shoppingCarts);
    const addresses = useSelector((state) => state.user.addresses);
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponId, setCouponId] = useState(null);
    console.log(coupons);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setCart(data);
        }
    }, [data]);

    const totalPrice = data?.reduce((sum, item) => sum + item.productPrice * item.orderQuantity, 0);
    const totalQuantity = data?.reduce((sum, item) => sum + item.orderQuantity, 0);
    const applyCoupons = (totalPrice*discount)/100
    const totalAllDiscount = totalPrice - applyCoupons + 35000


    const handleSubmit = async (values) => {
        const orderData = {
            district: values.district || addresses.find(addr => addr.addressId === values.addressId)?.district,
            note: values.note,
            phone: values.phone || addresses.find(addr => addr.addressId === values.addressId)?.phone,
            province: values.province || addresses.find(addr => addr.addressId === values.addressId)?.province,
            receiveName: values.receiveName || addresses.find(addr => addr.addressId === values.addressId)?.receiveName,
            streetAddress: values.streetAddress || addresses.find(addr => addr.addressId === values.addressId)?.streetAddress,
            totalDiscountedPrice: totalAllDiscount,
            totalPrice: totalPrice,
            totalPriceAfterCoupons: totalPrice - applyCoupons,
            ward: values.ward || addresses.find(addr => addr.addressId === values.addressId)?.ward,
            coupon: discount > 0 ? coupons : '',
            couponsId: couponId,
            orderDetails: cart.map(item => ({
                productDetailId: item.productDetailId,
                name: item.productName,
                unitPrice: item.productPrice,
                orderQuantity: item.orderQuantity
            }))
        };

        try {
            setLoading(true);
            dispatch(addOrders(orderData));
            dispatch(clearAllCart());
            navigate("/")
            message.success('Đã gửi thành công đơn hàng, vui lòng đợi xác nhận !');
        } catch (error) {
            message.error('Gửi đơn hàng không thành công');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyCoupon = async () => {
        try {
            const response = await BASE_URL[POST]('/user/coupons/validate', { code: coupons },
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
              }
            );
            console.log(response);
            if (response.data.valid) {
                setDiscount(response.data.discount);
                setCouponId(response.data.couponsId);
                // message.success('Coupon applied successfully!');
            } else {
                setDiscount(0);
                setCouponId(null); 
                message.error('Mã giảm giá không tồn tại. Vui lòng nhập mã khác !!!');
            }
        } catch (error) {
            setDiscount(0);
            message.error('Nhập sai mã giảm giá. Vui lòng nhập lại.');
        }
    };

    return (
        <Layout>
            <Header className="header">Header</Header>
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <Row gutter={16}>
                    <Col span={16}>
                        {data && data.map(product => (
                            <Card
                                key={product.productId}
                                style={{ marginBottom: 16 }}
                                cover={<img
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "contain",
                                    }}
                                    alt={product.productName}
                                    src={product.productImage}
                                />}
                                actions={[
                                    <div> Số lượng : {product.orderQuantity} </div>,
                                    <div>
                                        <strong>Tổng giá: {handleFormatMoney(product.orderQuantity * product.productPrice)}</strong>
                                    </div>,
                                    <Button type="danger">X</Button>
                                ]}
                            >
                                <Card.Meta
                                    title={product.productName}
                                    description={`MÀU ${product.color} , SIZE ${product.size}`}
                                />
                                <div>
                                    <span>{handleFormatMoney(product.productPrice)}</span>
                                    <span style={{ textDecoration: 'line-through', marginLeft: 8 }}>
                                        {/* {product.originalPrice.toLocaleString()} ₫ */}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </Col>
                    <Col span={8}>
                        <Card title="Tạm tính">
                            <p>Số lượng : {totalQuantity} </p>
                            <p>Tạm tính: {handleFormatMoney(totalPrice)}</p>
                            <p>Phí vận chuyển: 35.000 ₫</p>
                            <p>
                                Nhập mã giảm giá : 
                                <Input
                                    value={coupons}
                                    onChange={(e) => setCoupons(e.target.value)}
                                    style={{ width: '60%', marginRight: '8px' }}
                                />
                                <Button onClick={handleApplyCoupon}>Áp dụng</Button>
                            </p>
                            <p>Giảm giá: {discount}% = {handleFormatMoney(applyCoupons)}</p>
                            <p><strong>Tổng cộng: {handleFormatMoney(totalAllDiscount)}</strong></p>
                        </Card>
                        <Card title="Thông tin giao hàng" style={{ marginTop: 16 }}>
                            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                <Form.Item label="Địa chỉ của bạn :" name="addressId">
                                    <Select placeholder="Chọn địa chỉ">
                                        {addresses.map((addr, index) => (
                                            <Select.Option key={addr.addressId || index} value={addr.addressId}>
                                                {"Đc "}{index + 1}{": " + addr.streetAddress + ", " + addr.ward + ", " + addr.district + ", " + addr.province}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <p>Gửi về địa chỉ khác :</p><br />
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="streetAddress" label="Nhập số nhà / Số đường">
                                            <Input type="text" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="ward" label="Nhập xã/phường">
                                            <Input type="text" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="district" label="Nhập Quận/Huyện">
                                            <Input type="text" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="province" label="Nhập Tỉnh/Thành phố">
                                            <Input type="text" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                    <Form.Item name="receiveName" label="Nhập tên người nhận">
                                    <Input type="text" />
                                </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Form.Item name="phone" label="Nhập số điện thoại ">
                                    <Input type="text" />
                                </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>Đặt hàng</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                        <Card title="Phương thức vận chuyển" style={{ marginTop: 16 }}>
                            <Radio.Group defaultValue="fast">
                                <Radio value="fast">Giao Hàng Nhanh (35.000 ₫)</Radio>
                            </Radio.Group>
                        </Card>
                        <Card title="Phương thức thanh toán" style={{ marginTop: 16 }}>
                            <Radio.Group defaultValue="cod">
                                <Radio value="cod">Thanh toán khi nhận hàng</Radio>
                                <Radio value="payoo">Thẻ ATM/Visa/Master/JCB/QRCode qua Payoo</Radio>
                            </Radio.Group>
                        </Card>
                    </Col>
                </Row>
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}></Footer> */}
        </Layout>
    );
}
