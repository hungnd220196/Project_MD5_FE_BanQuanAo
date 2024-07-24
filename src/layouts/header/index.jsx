import { DownOutlined, HeartOutlined, SearchOutlined, ShoppingCartOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, Image, Input, Menu, Modal, Space, Table, Upload } from 'antd'
import { Header } from 'antd/es/layout/layout'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slices/authSlice'
import Cookies from "js-cookie";
import './index.css';
import { PATCH } from '../../constants/httpMethod'
import BASE_URL from '../../api'
import { updateAvatarUser, updateInfoUser } from '../../redux/slices/userSlice'

export default function HeaderHomePage() {

    const navigate = useNavigate();
  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [editingKey, setEditingKey] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const dispatch = useDispatch();

  const handleModalCancel = () => {
    setIsModalVisible(false);
    // setSelectedUser(null);
  };
  
  const edit = (record) => {
    formAdd.setFieldsValue({ value: record.value });
    setEditingKey(record.data);
    setEditingValue(record.value);
    console.log(record);
};

  
const updateAvatar = async () => {
  if (!file) {
    message.error('Chưa chọn ảnh');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await dispatch(updateAvatarUser(formData)).unwrap();
    
    const newAvatarUrl = response.avatar;
      console.log(response);
    setUserData(prevData => ({ ...prevData, avatar: newAvatarUrl }));
    localStorage.setItem('user', JSON.stringify({ ...userData, avatar: newAvatarUrl }));
    
    setFile(null);
    form.resetFields();
    setIsModalVisible(false);
  } catch (error) {
    console.error('Lỗi khi cập nhật avatar:', error);
  }
};

  const updateIUser = async () => {
    try {
        const newData = { ...userData, [editingKey]: editingValue };
        const formData = new FormData();
        Object.keys(newData).forEach(key => formData.append(key, newData[key]));
        await dispatch(updateInfoUser(formData)).unwrap();
            setUserData(newData);
            localStorage.setItem('user', JSON.stringify(newData));
            setEditingKey('');
            setFile(null);
            // message.success('Thông tin đã được cập nhật');
    } catch (error) {
        // message.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
};

const handleMenuClick = ({ key }) => {
    switch (key) {
      case '1':
        setIsModalVisible(true);
        break;
      case '2':
        message.info('Click on Đổi mật khẩu');
        break;
      case '3':
        dispatch(logout());
        Cookies.remove("token");
        navigate("/");
        break;
      default:
        message.info(`Click on item ${key}`);
    }
  };

  const dropDownItem = [
    {
    key: '1',
    label: 'Thông tin cá nhân',
  },
  {
    key: '2',
    label: 'Đổi mật khẩu',
  },
    {
    key: '3',
    label: 'Đăng xuất',
  },
  
  ];

  const columns = [
    {
      title: 'Thông tin',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'value',
      key: 'value',
    },
    {
        title: 'Hành động',
        key: 'action',
        render: (record) => {
            if (record.key === '5') {
              return (
                <>
                  <Upload
                    beforeUpload={(file) => {
                      setFile(file); 
                      return false; 
                    }}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                  {file && (
                    <Button 
                      onClick={() => updateAvatar()} 
                      type="primary" 
                      style={{ marginLeft: 8 }}
                    >
                      Gửi
                    </Button>
                  )}
                </>
              );
            } else if (!['1', '4', '8', '9'].includes(record.key)) {
              return <Button  onClick={() => edit(record)} 
              type="primary" 
              style={{ marginLeft: 8,backgroundColor: "lightgreen" }} >Sửa</Button>;
            }
            return null;
          },
      }
  ];

  const data = userData ? [
    { key: '1', label: 'Tên đăng nhập :', value: userData.username },
    { key: '2', label: 'Email :',data : "email", value: userData.email },
    { key: '3', label: 'Họ và tên :',data : "fullName", value: userData.fullName },
    { key: '4', label: 'Trạng thái :', value: userData.status ? 'Đang hoạt động' : 'Block' },
    { key: '5', label: 'Avatar :', value: file ? (
        <>
          <img src={URL.createObjectURL(file)} alt="user" style={{ width: 60, height: 60 }} />
        </>
      ) : (
        <img src={userData.avatar} alt="user" style={{ width: 60, height: 60 }} />
      )},
    { key: '6', label: 'Số điện thoại :',data: "phone", value: userData.phone },
    { key: '7', label: 'Địa chỉ :',data :"address", value: userData.address },
    { key: '8', label: 'Ngày tạo :', value: userData.createdAt },
    { key: '9', label: 'Ngày cập nhật :', value: userData.updatedAt },
  ] : [];
  
  


  return (
    <>
     <Header style={{width : "100%", height : "75px"}}>
        <div className="header-content">
          <div className="logo">ROUTINE</div>
          <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1,fontSize:18,marginLeft : 80 }}>
            <Menu.Item key="1">Nam</Menu.Item>
            <Menu.Item key="2">Nữ</Menu.Item>
            <Menu.Item key="3">New</Menu.Item>
            <Menu.Item key="4">Best</Menu.Item>
            <Menu.Item key="5">Giá Tốt</Menu.Item>
          </Menu>
          {Cookies.get("token") ? (<>
          
            <div className="header-icons">
                <div className="search-container">
                    <SearchOutlined className="search-icon" />
                    <input type="text" placeholder="Tìm kiếm" className="search-input" />
                </div>
                    {/* <NavLink to="/login"><UserOutlined className="header-icon" /></NavLink> */}
                    <HeartOutlined className="header-icon"/>
                    <ShoppingCartOutlined className="header-icon" />
                <div>
                    <Space size={16} wrap style={{paddingLeft: "2vw"}}>
                    <Image
                    width={50}
                    style={{ borderRadius: '10%' }}
                    src={userData.avatar}
                    />
                    <Dropdown
                    menu={{
                    items : dropDownItem,
                    onClick: handleMenuClick,
                    }}
                        >
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                    {userData.fullName}
                    <DownOutlined />
                    </Space>
                </a>
                    </Dropdown>
                    </Space>
                </div>
            </div>
          </>):(<>

          <div className="header-icons">
             <div className="search-container">
                <SearchOutlined className="search-icon" />
                <input type="text" placeholder="Tìm kiếm" className="search-input" />
             </div>
            
            <HeartOutlined className="header-icon"/>
            <ShoppingCartOutlined className="header-icon" />
            <NavLink to="/login"><UserOutlined className="header-icon" /></NavLink>
          </div>
          </>)}
        </div>
      </Header>

      <Modal
        title="Thông tin cá nhân"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {editingKey && (
          <Form form={formAdd} layout="inline" onFinish={updateIUser}>
            <Form.Item
              name="value"
              label="Giá trị mới"
              rules={[{ required: true, message: 'Hãy nhập giá trị mới' }]}
            >
              <Input onChange={(e) => setEditingValue(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Form.Item>
          </Form>
        )}
        {userData && (

             <Table columns={columns} dataSource={data} pagination={false} />
        )}
         
      </Modal>
      
    </>
  )
}
