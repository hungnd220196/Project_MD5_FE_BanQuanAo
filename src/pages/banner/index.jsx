import { Button, Carousel } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React from 'react'

export default function Banner() {
  return (
    <>
        <Banner style={{ padding: '0 50px' }}>
        <Carousel autoplay>
          <div className="carousel-item">
            <div className="carousel-content">
              <h2>ƯU ĐÃI</h2>
              <h1>30-50%</h1>
              <p>HÀNG TRIỆU SẢN PHẨM</p>
              <Button type="primary">MUA NGAY</Button>
            </div>
            <div className="carousel-image">
              <img src="path_to_your_image.png" alt="Banner" />
            </div>
          </div>

        </Carousel>
      </Banner>
    </>
  )
}
