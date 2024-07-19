import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategory, changePage } from "../../../redux/slices/categorySlice"; 
import { Table, Pagination, Spin, Space, Button, message, Upload, Modal, Form, Input, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export default function Category() {
  const categories = useSelector((state) => state.category.content);
  const number = useSelector((state) => state.category.number);
  const total = useSelector((state) => state.category.total);
  const size = useSelector((state) => state.category.size);
  const isLoading = useSelector((state) => state.category.isLoading);

  const dispatch = useDispatch();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  const handleChangePage = (page, pageSize) => {
    dispatch(changePage(page - 1));
  };

  useEffect(() => {
    dispatch(fetchAllCategory({ page: number }));
  }, [number, size, dispatch]);

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = form.getFieldsValue();
      const formData = new FormData();
      formData.append('categoryName', values.categoryName);
      formData.append('description', values.description);
      formData.append('status', values.status);
      if (file) {
        formData.append('image', file);
      }

      await axios.put(`http://localhost:8080/api/v1/admin/categories/${editingCategory.categoryId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Category updated successfully');
      setIsModalVisible(false);
      setFile(null);
      
      dispatch(fetchAllCategory({ page: number }));
    } catch (error) {
      message.error('Failed to update category');
      console.error('Edit error:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFile(null);
  };

  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'categoryId',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'categoryName',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (image ? <img src={image} alt="category" style={{ width: 50, height: 50 }} /> : 'No Image'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? 'active' : 'inactive'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger >Block</Button>
        </Space>
      ),
    },
  ];

  const data = categories?.map((item) => ({
    key: item.id,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    description: item.description,
    status: item.status,
    image: item.image,
  }));

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="category-table">
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      )}
      <Pagination
        current={number + 1}
        total={total}
        pageSize={size}
        onChange={handleChangePage}
      />
      <Modal
        title="Edit Category"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Category Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
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
        </Form>
      </Modal>
    </>
  );
}
