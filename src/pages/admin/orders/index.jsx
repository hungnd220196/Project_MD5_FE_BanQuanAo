import { Table } from 'antd';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function Orders() {
  const dispatch = useDispatch();
  const banners = useSelector(state => state.banners.banners || []);


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'BannerName',
      dataIndex: 'bannerName',
      key: 'bannerName',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (image ? <img src={image} alt="banners" style={{ width: 50, height: 50 }} /> : 'No Image'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? 'Hoạt động' : 'Ngừng hoạt động'),
    },
    {
        title: 'CreatAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt) => moment(createdAt).format('DD-MM-YYYY'), 
      },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
         <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
         <Button type="link" danger onClick={() => handleDeleteBanner(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <> {isLoading ? ( <Spin />) : (
      <div className="order-table">
        <Table 
          columns={columns} 
          dataSource={banners} 
          pagination={false} 
          rowKey="id"
          className="custom-banner-header"
        />
      </div>
    )}</>
  )
}
