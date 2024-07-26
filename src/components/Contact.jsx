// Contact.js
import React from 'react';
import { Form, Input, Button, Row, Col, Card } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './Contact.css';

const { TextArea } = Input;

// const containerStyle = {
//   width: '100%',
//   height: '300px',
// };

// const center = {
//     lat: 21.0285, 
//     lng: 105.8542,
//   };

const Contact = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">Contact Us</h2>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card className="contact-card">
            <Form
              name="contact"
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input placeholder="Your Name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input placeholder="Your Email" />
              </Form.Item>
              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please input your message!' }]}
              >
                <TextArea rows={4} placeholder="Your Message" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="contact-submit-button">
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="contact-info-card">
            <div className="contact-info">
              <div className="contact-info-item">
                <EnvironmentOutlined className="contact-info-icon" />
                <span>18 Đ. Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội, Việt Nam</span>
              </div>
              <div className="contact-info-item">
                <PhoneOutlined className="contact-info-icon" />
                <span>(+123) 456 7890</span>
              </div>
              <div className="contact-info-item">
                <MailOutlined className="contact-info-icon" />
                <span>contact@gmail.com</span>
              </div>
            </div>
            {/* <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript> */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
