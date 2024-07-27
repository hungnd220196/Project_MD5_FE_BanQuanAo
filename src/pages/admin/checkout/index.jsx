import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Input, InputNumber, Layout, Radio, Row, Select } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../../../redux/slices/shoppingCartSlice';

export default function CheckOut() {
    const dispatch = useDispatch();
    const [cart, setCart] = useState([]);
    const { data } = useSelector((state) => state.shoppingCarts.shoppingCarts);
    useEffect(() => {
        dispatch(fetchCart());
      }, [dispatch]);
    
      useEffect(() => {
        if (data) {
          setCart(data);
        }
      }, [data]);
  return (
    <> <Layout>
    <Header className="header">Header</Header>
    <Content style={{ padding: '0 50px', marginTop: 64 }}>
      <Row gutter={16}>
        <Col span={16}>
          {data && data.map(product => (
            <Card
              key={product.productId}
              style={{ marginBottom: 16 }}
              cover={<img mg
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                }} alt={product.productName} src={product.productImage} />}
              actions={[
                <InputNumber min={1} defaultValue={1} />,
                <Button type="danger">X</Button>
              ]}
            >
              <Card.Meta
                title={product.name}
                description={`MÀU ${product.color} , SIZE ${product.size}`}
              />
              <div>
                {/* <span>{product.price.toLocaleString()} ₫ </span> */}
                <span style={{ textDecoration: 'line-through', marginLeft: 8 }}>
                  {/* {product.originalPrice.toLocaleString()} ₫ */}
                </span>
              </div>
            </Card>
          ))}
        </Col>
        <Col span={8}>
          <Card title="Tạm tính">
            <p>Số lượng: 2</p>
            <p>Tạm tính: 307.000 ₫</p>
            <p>Phí vận chuyển: 35.000 ₫</p>
            <p><strong>Tổng cộng: 342.000 ₫</strong></p>
          </Card>
          <Card title="Thông tin giao hàng" style={{ marginTop: 16 }}>
            <Form layout="vertical">
              <Form.Item label="Loại khách hàng">
                <Select defaultValue="gold">
                  <Select.Option value="gold">Gold</Select.Option>
                  <Select.Option value="vip">Vip</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Tỉnh/Thành phố">
                <Select>
                  {/* Add your options here */}
                </Select>
              </Form.Item>
              <Form.Item label="Quận/Huyện">
                <Select>
                  {/* Add your options here */}
                </Select>
              </Form.Item>
              <Form.Item label="Phường/Xã">
                <Select>
                  {/* Add your options here */}
                </Select>
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input />
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
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2024 Created by Ant UED</Footer>
  </Layout></>
  )
}
