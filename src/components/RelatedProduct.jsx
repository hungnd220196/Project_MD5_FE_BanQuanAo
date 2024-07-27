import React, { useEffect, useState } from 'react';
import { Col, Row, Card } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { handleFormatMoney } from '../utils/formatData';

const { Meta } = Card;

const RelatedProducts = ({ categoryId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/user/products/categories/${categoryId}`);
              
                setRelatedProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching related products:', error);
                setRelatedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [categoryId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Row gutter={16}>
            {relatedProducts?.map(product => (
                <Col span={6} key={product.id}>
                    <Link to={`/product/${product.id}`}>
                        <Card
                            hoverable
                            cover={<img alt={product.productName} src={product.imageUrl} style={{objectFit:"cover"}} />}
                        >
                            <Meta title={product.productName} description={`Price: ${handleFormatMoney(product.price)}`} />
                        </Card>
                    </Link>
                </Col>
            ))}
        </Row>
    );
};

export default RelatedProducts;
