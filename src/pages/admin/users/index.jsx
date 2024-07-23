import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spin, Space, Button, message, Upload, Modal, Form, Input, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import PaginationComponent from "../../../components/PaginationComponents";
import { changePage, fetchAllUser, searchUser, updateUserStatus } from "../../../redux/slices/userSlice";
// import Search from "antd/es/input/Search";
const { Search } = Input;

export default function User() {
  const user = useSelector((state) => state.user.content);
  const number = useSelector((state) => state.user.number);
  const total = useSelector((state) => state.user.total);
  const size = useSelector((state) => state.user.size);
  const isLoading = useSelector((state) => state.user.isLoading);
  const searchResults = useSelector((state) => state.user.searchResults);

  const dispatch = useDispatch();
  // const [editingCategory, setEditingCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  // const [form] = Form.useForm();
  // const [addForm] = Form.useForm();

  const handleChangePage = (page, pageSize) => {
    dispatch(changePage({ page: page - 1, size: pageSize }));
    dispatch(fetchAllUser({ page: page - 1, size: pageSize }));
  };

  useEffect(() => {
    dispatch(fetchAllUser({ page: number, size }));
  }, [number, size, dispatch]);
  const handleInfo = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleBlockUser = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus ? 0 : 1; 
      await dispatch(updateUserStatus({ userId, status: newStatus }));
      dispatch(fetchAllUser({ page: number, size }));
      message.success("User status updated successfully");
    } catch (error) {
      message.error("Failed to update user status");
      console.error("Status update error:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    dispatch(searchUser(value));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'id',
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'FullName',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),

    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => (avatar ? <img src={avatar} alt="user" style={{ width: 50, height: 50 }} /> : 'No Image'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Mail',
      dataIndex: 'mail',
      key: 'mail',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
   
     {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status - b.status,
      render: (status) => (status ? 'active' : 'inactive'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleInfo(record)}>Info</Button>
          <Button type="link" danger onClick={() => handleBlockUser(record.userId, record.status)}>
            {record.status ? 'Block' : 'UnBlock'}
          </Button>
        </Space>
      ),
    },
  ];

  const data = (searchText ? searchResults : user)?.map((item) => ({
    key: item.id,
    userId: item.userId,
    username: item.username,
    fullName: item.fullName,
    email: item.email,
    phone: item.phone,
    status: item.status,
    avatar: item.avatar,
    address: item.address,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isDeleted: item.isDeleted,
  }));

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="user-table">
           <Search
            placeholder="Search by username, full name, email or phone"
            onSearch={handleSearch}
            style={{ marginBottom: 16 }}
          />
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      )}
      <PaginationComponent
        current={number + 1}
        total={total}
        pageSize={size}
        onChange={handleChangePage}
      />
      <Modal
        title="User Info"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p><strong>ID:</strong> {selectedUser.userId}</p>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Status:</strong> {selectedUser.status ? 'active' : 'inactive'}</p>
            <p><strong>Avatar:</strong> <img src={selectedUser.avatar} alt="user" style={{ width: 100, height: 100 }} /></p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Address:</strong> {selectedUser.address}</p>
            <p><strong>Created At:</strong> {selectedUser.createdAt}</p>
            <p><strong>Updated At:</strong> {selectedUser.updatedAt}</p>
            {/* <p><strong>Is Deleted:</strong> {selectedUser.isDeleted ? 'Yes' : 'No'}</p> */}
          </div>
        )}
      </Modal>
    </>
  );
}
