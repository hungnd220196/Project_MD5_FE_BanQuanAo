import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCoupons, deleteCoupons, getAllCoupons } from '../../../redux/slices/couponsSlice';
import { Button, Modal, Form, Input, Table, Space, Spin, message } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';

export default function Coupons() {
  const dispatch = useDispatch();
  const {coupons } = useSelector((state) => state.coupons || []);
  console.log(coupons);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addForm] = Form.useForm();

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        await dispatch(getAllCoupons());
      } catch (error) {
        console.error('Lỗi khi lấy danh sách coupons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, [dispatch]);

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleAddCoupons = async () => {
    try {
      const values = await addForm.validateFields();
      console.log(values);
      await dispatch(addCoupons(values)).unwrap();
      dispatch(getAllCoupons());
      setIsModalVisible(false);
      addForm.resetFields();
      message.success('Thêm coupons thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm coupons:', error);
      message.error('Thêm coupons thất bại!');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    // Thêm logic chỉnh sửa ở đây
  };

  const handleDeleteCoupons = async (id) => {
    try {
      await dispatch(deleteCoupons(id))
      dispatch(getAllCoupons());
      message.success('Xóa Coupons thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa banner:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'couponsId',
      key: 'couponsId',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'EndDate',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate) => moment(endDate).format('DD-MM-YYYY'),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'StartDate',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate) => moment(startDate).format('DD-MM-YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? 'Hoạt động' : 'Ngừng hoạt động'),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDeleteCoupons(record.couponsId)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm mới
      </Button>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="coupons-table">
          <Table
            columns={columns}
            dataSource={coupons}
            pagination={false}
            rowKey="id"
            className="custom-coupons-header"
          />
        </div>
      )}
      <Modal
        title="Thêm mới Coupons"
        visible={isModalVisible}
        onOk={handleAddCoupons}
        onCancel={handleCancel}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddCoupons}>
          <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="discount" label="Giảm giá" rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu!' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc!' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
