import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts, changePage, deleteProduct, searchProducts } from "../../../redux/slices/productSice";
import { Table, Spin, Space, Button, message, Upload, Modal, Form, Input, Switch, Empty } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import PaginationComponent from "../../../components/PaginationComponents";

export default function Product() {
  const products = useSelector((state) => state.product.products);
  const number = useSelector((state) => state.product.number);
  const total = useSelector((state) => state.product.total);
  const size = useSelector((state) => state.product.size);
  const isLoading = useSelector((state) => state.product.isLoading);

  const dispatch = useDispatch();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const handleChangePage = (page, pageSize) => {
    dispatch(changePage({ page: page - 1, size: pageSize }));
    if (searchTerm) {
      dispatch(searchProducts({ search: searchTerm, page: page - 1, size: pageSize }));
    } else {
      dispatch(fetchAllProducts({ page: page - 1, size: pageSize }));
    }
  };

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchProducts({ search: searchTerm, page: number, size }));
    } else {
      dispatch(fetchAllProducts({ page: number, size }));
    }
  }, [number, size, searchTerm, dispatch]);

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId));
      message.success('Product deleted successfully');
    } catch (error) {
      message.error('Failed to delete product');
      console.error('Delete error:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = form.getFieldsValue();
      const formData = new FormData();
      formData.append('sku', values.sku);
      formData.append('productName', values.productName);
      formData.append('description', values.description);
      formData.append('status', values.status);
      if (file) {
        formData.append('image', file);
      }

      await axios.put(`http://localhost:8080/api/v1/admin/products/${editingProduct.productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Product updated successfully');
      setIsModalVisible(false);
      setFile(null);
      
      dispatch(fetchAllProducts({ page: number, size }));
    } catch (error) {
      message.error('Failed to update product');
      console.error('Edit error:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFile(null);
  };

  const handleAddNewProduct = async () => {
    try {
      const values = addForm.getFieldsValue();
      const formData = new FormData();
      formData.append('sku', values.sku);
      formData.append('productName', values.productName);
      formData.append('description', values.description);
      formData.append('status', values.status);
      if (file) {
        formData.append('image', file);
      }

      await axios.post('http://localhost:8080/api/v1/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Product added successfully');
      setIsAddModalVisible(false);
      setFile(null);
      
      dispatch(fetchAllProducts({ page: number, size }));
    } catch (error) {
      message.error('Failed to add product');
      console.error('Add error:', error);
    }
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    setFile(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchProducts({ search: value, page: number, size }));
  };

  const columns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
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
      render: (image) => (image ? <img src={image} alt="product" style={{ width: 50, height: 50 }} /> : 'No Image'),
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
          <Button type="link" danger onClick={() => handleDelete(record.productId)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const data = products?.map((item) => ({
    key: item.productId,
    sku: item.sku,
    productName: item.productName,
    description: item.description,
    status: item.status,
    image: item.image,
  }));

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="product-table">
          <Input
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: 16 }}>
            Add New Product
          </Button>
          {data.length > 0 ? (
            <Table columns={columns} dataSource={data} pagination={false} />
          ) : (
            <Empty description="No products found" />
          )}
        </div>
      )}
      <PaginationComponent
        current={number + 1}
        total={total}
        pageSize={size}
        onChange={handleChangePage}
      />
      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'SKU is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Product Name is required' }]}
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
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add New Product"
        visible={isAddModalVisible}
        onOk={handleAddNewProduct}
        onCancel={handleAddModalCancel}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'SKU is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Product Name is required' }]}
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
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
