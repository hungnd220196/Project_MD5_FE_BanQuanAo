import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Input, Button, Divider, Typography, Select, message } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { addComment, fetchCommentsByProduct } from '../redux/slices/commentsUserSlice';

const { Title } = Typography;
const { Option } = Select;

const Comments = ({ productId }) => {
  const [rating, setRating] = useState(1);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments);
  
  useEffect(() => {
    dispatch(fetchCommentsByProduct(productId));
  }, [dispatch, productId]);

  const handleChange = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (!newComment.trim()) {
      message.error('Vui lòng nhập bình luận.');
      return;
    }

    const commentData = {
      comment: newComment,
      productId,
      rating
    };

    dispatch(addComment(commentData))
      .then(() => {
        message.success('Đánh giá và bình luận đã được gửi thành công!');
        setNewComment('');
        setRating(1);
      })
      .catch(() => {
        message.error('Gửi đánh giá và bình luận thất bại. Vui lòng thử lại sau.');
      });
  };

  const renderStars = (rating) => {
    const normalizedRating = Math.max(0, Math.min(5, rating));
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, index) => (
          <StarOutlined
            key={index}
            style={{
              color: index < normalizedRating ? 'gold' : 'lightgray',
              fontSize: '15px', 
              marginRight: '2px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Title level={3}>Đánh giá và Bình luận</Title>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Select
          value={rating}
          onChange={handleChange}
          style={{ width: 120 }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Option key={star} value={star}>
              {renderStars(star)}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ marginLeft: '16px' }}
        >
          Gửi Đánh Giá và Bình Luận
        </Button>
      </div>
      <div>
        <Input.TextArea
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
        />
      </div>
      <Divider />
      <List
        header={<div>Bình luận</div>}
        bordered
        dataSource={comments}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.user.fullName}
              description={
                <>
                  {renderStars(item.rating)}
                  <div>{item.comment}</div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default Comments;
