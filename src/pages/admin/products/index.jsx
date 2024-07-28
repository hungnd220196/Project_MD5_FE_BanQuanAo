import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  changePage,
  deleteProduct,
  searchProducts,
  fetchProductsByCategory,
} from "../../../redux/slices/productSlice";
import {
  Table,
  Spin,
  Space,
  Button,
  message,
  Upload,
  Modal,
  Form,
  Input,
  Switch,
  Empty,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import PaginationComponent from "../../../components/PaginationComponents";
import Cookies from "js-cookie";

const { Option } = Select;

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/admin/categories", {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }),
          axios.get("http://localhost:8080/api/v1/admin/brands", {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }),
        ]);
        setCategories(Array.isArray(categoryRes.data.data.content) ? categoryRes.data.data.content : []);
        setBrands(Array.isArray(brandRes.data) ? brandRes.data : []);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  const handleChangePage = (page, pageSize) => {
    dispatch(changePage({ page: page - 1, size: pageSize }));
    if (searchTerm) {
      dispatch(searchProducts({ search: searchTerm, page: page - 1, size: pageSize }));
    } else if (selectedCategory) {
      dispatch(fetchProductsByCategory({ categoryId: selectedCategory, page: page - 1, size: pageSize }));
    } else {
      dispatch(fetchAllProducts({ page: page - 1, size: pageSize }));
    }
  };

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchProducts({ search: searchTerm, page: number, size }));
    } else if (selectedCategory) {
      dispatch(fetchProductsByCategory({ categoryId: selectedCategory, page: number, size }));
    } else {
      dispatch(fetchAllProducts({ page: number, size }));
    }
  }, [number, size, searchTerm, selectedCategory, dispatch]);

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (productId) => {
    try {
      if (!productId) {
        message.error("Product ID is required to delete a product");
        return;
      }
      
      await axios.delete(`http://localhost:8080/api/v1/admin/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      
      message.success("Product deleted successfully");
      dispatch(fetchAllProducts({ page: number, size }));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error("Cannot delete product due to foreign key constraints. Please remove associated records first.");
      } else {
        message.error("Failed to delete product");
      }
      console.error("Delete error:", error);
    }
  };
  

  const handleModalOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const formData = new FormData();
      formData.append("sku", values.sku);
      formData.append("productName", values.productName);
      formData.append("description", values.description);
      formData.append("status", values.status ? 'true' : 'false');
      formData.append("categoryId", values.categoryId);
      formData.append("brandId", values.brandId);
      formData.append("stock", values.stock); // Added field
      formData.append("price", values.price); // Added field
      if (file) {
        formData.append("image", file);
      }

      await axios.put(
        `http://localhost:8080/api/v1/admin/products/${editingProduct.productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      message.success("Product updated successfully");
      setIsModalVisible(false);
      setFile(null);

      dispatch(fetchAllProducts({ page: number, size }));
    } catch (error) {
      message.error("Failed to update product");
      console.error("Edit error:", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFile(null);
  };

  const handleAddNewProduct = async () => {
    try {
      await addForm.validateFields();
      const values = addForm.getFieldsValue();
      const formData = new FormData();
      formData.append("sku", values.sku);
      formData.append("productName", values.productName);
      formData.append("description", values.description);
      formData.append("status", values.status ? 'true' : 'false');
      formData.append("categoryId", values.categoryId);
      formData.append("brandId", values.brandId);
      formData.append("stock", values.stock);
      formData.append("price", values.price); 
      if (file) {
        formData.append("image", file);
      }

      await axios.post("http://localhost:8080/api/v1/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      message.success("Product added successfully");
      setIsAddModalVisible(false);
      setFile(null);

      dispatch(fetchAllProducts({ page: number, size }));
    } catch (error) {
      message.error("Failed to add product");
      console.error("Add error:", error);
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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    if (value) {
      dispatch(fetchProductsByCategory({ categoryId: value, page: number, size }));
    } else {
      dispatch(fetchAllProducts({ page: number, size }));
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "productId",
      key: "id",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Brand",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="product"
            style={{ width: 50, height: 50 }}
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === true ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.productId)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const data = products.map((item) => ({
    ...item,
    key: item.productId,
    productId:item.id,
    stock: item.stock,
    price:item.price,
    categoryName: categories.find((category) => category.categoryId === item.categoryId)?.categoryName || "N/A",
    brandName: brands.find((brand) => brand.id === item.brandId)?.brandName || "N/A",
  }));
  console.log(data);

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
          <Select
            placeholder="Filter by Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ width: 200, marginBottom: 16 }}
          >
            <Option value={null}>All Categories</Option>
            {categories.map((category) => (
              <Option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={() => setIsAddModalVisible(true)}
            style={{ marginBottom: 16 }}
          >
            Add New Product
          </Button>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      )}

      <PaginationComponent
        page={number + 1}
        pageSize={size}
        total={total}
        onChange={handleChangePage}
      />

      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="sku" label="SKU">
            <Input />
          </Form.Item>
          <Form.Item name="productName" label="Product Name">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <Form.Item name="categoryId" label="Category">
            <Select>
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="brandId" label="Brand">
            <Select>
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.id}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image">
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

      <Modal
        title="Add New Product"
        visible={isAddModalVisible}
        onOk={handleAddNewProduct}
        onCancel={handleAddModalCancel}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="sku" label="SKU">
            <Input />
          </Form.Item>
          <Form.Item name="productName" label="Product Name">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <Form.Item name="categoryId" label="Category">
            <Select>
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="brandId" label="Brand">
            <Select>
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.id}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image">
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
