import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, updateReviewStatus } from '../../../redux/slices/reviewSlice';
import { Table, Button, message, Space, Dropdown, Menu, Spin } from 'antd';

const reviewStatusOptions = {
  false: 'Approved',
  true: 'Pending'
};

export default function ReviewManagement() {
  const reviews = useSelector(state => state.review.reviews);
  const isLoading = useSelector(state => state.review.isLoading);
  const dispatch = useDispatch();
  
  const [ignoredReviews, setIgnoredReviews] = useState(() => {
    const saved = localStorage.getItem('ignoredReviews');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('ignoredReviews', JSON.stringify(ignoredReviews));
  }, [ignoredReviews]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await dispatch(updateReviewStatus({ id, status })).unwrap();
      message.success('Review status updated successfully');
    } catch (error) {
      message.error('Failed to update review status');
      console.error('Update status error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteReview(id)).unwrap();
      message.success('Review deleted successfully');
    } catch (error) {
      message.error('Failed to delete review');
      console.error('Delete error:', error);
    }
  };

  const handleIgnore = (id) => {
    setIgnoredReviews([...ignoredReviews, id]);
    message.success('Review ignored successfully');
  };

  const renderStatusMenu = (id) => (
    <Menu>
      {Object.entries(reviewStatusOptions).map(([key, label]) => (
        <Menu.Item key={key} onClick={() => handleUpdateStatus(id, key === 'true')}>
          {label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: 'Review ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => reviewStatusOptions[status],
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Dropdown overlay={renderStatusMenu(record.id)} trigger={['click']}>
            <Button type="link">Change Status</Button>
          </Dropdown>
          <Button type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
          <Button type="link" onClick={() => handleIgnore(record.id)}>Ignore</Button>
        </Space>
      ),
    },
  ];

  const data = reviews
    ?.filter(review => !ignoredReviews.includes(review.id))
    .map(review => ({
      key: review.id,
      id: review.id,
      productName: review.productDetail.productDetailName,
      rating: review.rating,
      comments: review.comments,
      status: review.status,
    }));
    console.log(data);

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <Table columns={columns} dataSource={data} pagination={false} />
      )}
    </>
  );
}

