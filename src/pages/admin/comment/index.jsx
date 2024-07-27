import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllComments, updateCommentStatus, deleteComment } from '../../../redux/slices/commentSlice';
import { Table, Button, message, Space, Dropdown, Menu, Spin } from 'antd';

const commentStatusOptions = {
  false: 'Approved',
  true: 'Pending'
};

export default function CommentManagement() {
  const comments = useSelector(state => state.comment.comments);
  const isLoading = useSelector(state => state.comment.isLoading);
  const dispatch = useDispatch();
  
  // State để lưu trữ các bình luận bị bỏ qua
  const [ignoredComments, setIgnoredComments] = useState(() => {
    const saved = localStorage.getItem('ignoredComments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    dispatch(fetchAllComments());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('ignoredComments', JSON.stringify(ignoredComments));
  }, [ignoredComments]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await dispatch(updateCommentStatus({ id, status })).unwrap();
      message.success('Comment status updated successfully');
    } catch (error) {
      message.error('Failed to update comment status');
      console.error('Update status error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteComment(id)).unwrap();
      message.success('Comment deleted successfully');
    } catch (error) {
      message.error('Failed to delete comment');
      console.error('Delete error:', error);
    }
  };

  const handleIgnore = (id) => {
    setIgnoredComments([...ignoredComments, id]);
    message.success('Comment ignored successfully');
  };

  const renderStatusMenu = (id) => (
    <Menu>
      {Object.entries(commentStatusOptions).map(([key, label]) => (
        <Menu.Item key={key} onClick={() => handleUpdateStatus(id, key === 'true')}>
          {label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: 'Comment ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => commentStatusOptions[status],
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

  // Lọc ra các bình luận không bị bỏ qua
  const data = comments
    ?.filter(comment => !ignoredComments.includes(comment.id))
    .map(comment => ({
      key: comment.id,
      id: comment.id,
      productName: comment.product.productName,
      userName: comment.user.username,
      content: comment.comment,
      status: comment.status,
    }));

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
