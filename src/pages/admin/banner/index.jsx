import { Button, Form, Input, message, Modal, Space, Spin, Table, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBanners, deleteBanners, fetchAllBanners } from '../../../redux/slices/bannerSlice';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';

export default function BannerAdmin() {
  const dispatch = useDispatch();
  const banners = useSelector(state => state.banners.banners || []);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        await dispatch(fetchAllBanners());
      } catch (error) {
        console.error('Lỗi khi lấy danh sách banner:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, [dispatch]);

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await addForm.validateFields();
      const formData = new FormData();
      formData.append('bannerName', values.bannerName);
      formData.append('description', values.description);
      if (file) {
        formData.append('image', file);
      }

      dispatch(addBanners(formData)).then(() => {dispatch(fetchAllBanners());setIsModalVisible(false);}).catch(err);
      addForm.resetFields();
      setFile(null);
      setIsModalVisible(false);
      
      message.success('Thêm banner thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm banner:', error);
      message.error('Thêm banner thất bại!');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteBanner = async (id) => {
    try {
      await dispatch(deleteBanners(id));
    } catch (error) {
      console.error('Lỗi khi xóa banner:', error);
    }
  };

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
    <>
    <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm mới
      </Button>
      {isLoading ? ( <Spin />) : (
        <div className="banner-table">
          <Table 
            columns={columns} 
            dataSource={banners} 
            pagination={false} 
            rowKey="id"
            className="custom-banner-header"
          />
        </div>
      )}
     <Modal
        title="Thêm mới Banner"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={addForm} layout="vertical" name="addBanner">
          <Form.Item
            name="bannerName"
            label="Tên Banner"
            rules={[{ required: true, message: 'Vui lòng nhập tên banner!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {file && <p>{file.name}</p>}
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea />
          </Form.Item>
          {/* <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Input />
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
}
