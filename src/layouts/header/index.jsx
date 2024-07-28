import { logout } from "../../redux/slices/authSlice";
import "./index.css";
import {
  addNewAddress,
  changePassword,
  deleteAddress,
  showAddress,
  updateAvatarUser,
  updateInfoUser,
} from "../../redux/slices/userSlice";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Button,
  Dropdown,
  Form,
  Image,
  Input,
  Menu,
  Modal,
  Space,
  Table,
  Upload,
  Drawer,
  Checkbox,
  Divider,
  message,
} from "antd";
import {
  DownOutlined,
  HeartOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UploadOutlined,
  UserOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import ShoppingCart from "../../components/ShoppingCart";
import WishList from "../../components/WishList";

export default function HeaderHomePage({ setSearchKeyword }) {
  
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  //Header Scoll

  const [isHeader1Visible, setIsHeader1Visible] = useState(false);

  const handleScroll = () => {
    const header2Height = document.querySelector(".header-2").offsetHeight;
    if (window.scrollY > header2Height) {
      setIsHeader1Visible(true);
    } else {
      setIsHeader1Visible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = useNavigate();
  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [changePasswordModal, setchangePasswordModal] = useState(false);
  const [addAddressModal, setAddAddressModal] = useState(false);
  const [file, setFile] = useState(null);
  const [newdata, setNewData] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const { addresses } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [formChangePassword] = Form.useForm();
  const [formAddAddress] = Form.useForm();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    dispatch(showAddress());
  }, [dispatch]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const data = [
        { key: "1", label: "Tên đăng nhập", value: user.username },
        { key: "2", label: "Email", data: "email", value: user.email },
        {
          key: "3",
          label: "Họ và tên ",
          data: "fullName",
          value: user.fullName,
        },
        {
          key: "4",
          label: "Trạng thái",
          value: user.status ? "Đang hoạt động" : "Block",
        },
        {
          key: "5",
          label: "Avatar",
          value: file ? (
            <>
              <img
                src={URL.createObjectURL(file)}
                alt="users"
                style={{ width: 60, height: 60 }}
              />
            </>
          ) : (
            <img
              src={user.avatar}
              alt="user"
              style={{ width: 60, height: 60 }}
            />
          ),
        },
        { key: "6", label: "Số điện thoại", data: "phone", value: user.phone },
        {
          key: "7",
          label: "Địa chỉ",
          data: "address",
          value:
            addresses.length > 0 ? (
              addresses.map((addr, index) => (
                <div
                  key={addr.addressId || index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div>
                    {"Đc "} {index + 1}{" "}
                    {" : " +
                      addr.streetAddress +
                      ", " +
                      addr.ward +
                      ", " +
                      addr.district +
                      ", " +
                      addr.province}
                  </div>
                  <DeleteOutlined
                    onClick={() => handleDeleteAddress(addr.addressId)}
                    style={{ marginLeft: 10, cursor: "pointer", color: "red" }}
                  />
                </div>
              ))
            ) : (
              <p>Không có địa chỉ</p>
            ),
        },
        { key: "8", label: "Ngày tạo", value: user.createdAt },
        { key: "9", label: "Ngày cập nhật", value: user.updatedAt },
      ];
      setNewData(data);
    }
  }, [userData, reload, addresses, file]);

  //WIshList

  const [openWishList, setOpenWishList] = useState(false);

  const showDrawerWishList = () => {
    console.log(111, openWishList);
    setOpenWishList(true);
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/user/cart/items/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };


  const onCloseWishList = () => {
    setOpenWishList(false);
  };

  //Shopingcart

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setchangePasswordModal(false);
    setAddAddressModal(false);
  };

  const edit = (record) => {
    formAdd.setFieldsValue({ value: record.value });
    setEditingKey(record.data);
    setEditingValue(record.value);
  };

  const addAddress = (record) => {
    setAddAddressModal(true);
    formAddAddress.setFieldsValue({ value: record.value });
  };

  const updateAvatar = async () => {
    if (!file) {
      message.error("Chưa chọn ảnh");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await dispatch(updateAvatarUser(formData)).unwrap();

      const newAvatarUrl = response.avatar;
      setUserData((prevData) => ({ ...prevData, avatar: newAvatarUrl }));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userData, avatar: newAvatarUrl })
      );

      setFile(null);
      form.resetFields();
      setIsModalVisible(false);
      message.success("Cập nhật Avatar thành công");
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật avatar");
      console.error("Lỗi khi cập nhật avatar:", error);
    }
    f;
  };

  const updateIUser = async () => {
    try {
      const newData = { ...userData, [editingKey]: editingValue };
      const formData = new FormData();
      formData.append("email", newData.email);
      formData.append("fullName", newData.fullName);
      formData.append("phone", newData.phone);
      formData.append("address", newData.address);
      await dispatch(updateInfoUser(formData)).unwrap();
      localStorage.setItem("user", JSON.stringify(newData));
      setUserData(newData);
      formAdd.resetFields();
      setFile(null);
      setReload(!reload);
      message.success("Thông tin đã được cập nhật");
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
      console.log(record);
    }
  };

  const changePasswordUser = async (values) => {
    try {
      const formData = new FormData();
      formData.append("oldPass", values.oldPass);
      formData.append("newPass", values.newPass);
      formData.append("confirmNewPass", values.confirmNewPass);

      await dispatch(changePassword(formData)).unwrap();
      formChangePassword.resetFields();
      setchangePasswordModal(false);
      message.success("Mật khẩu đã được thay đổi");
      navigate("/login");
    } catch (error) {
      message.error("Có lỗi xảy ra khi thay đổi mật khẩu");
    }
  };
  const addAddressUser = async (values) => {
    try {
      const formData = new FormData();
      formData.append("district", values.district);
      formData.append("phone", values.phone);
      formData.append("province", values.province);
      formData.append("receiveName", values.receiveName);
      formData.append("streetAddress", values.streetAddress);
      formData.append("ward", values.ward);
      await dispatch(addNewAddress(formData)).unwrap();
      dispatch(showAddress());
      setAddAddressModal(false);
      setIsModalVisible(true);
      message.success("Thêm mới địa chỉ thành công");
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm mới địa chỉ");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId));
      dispatch(showAddress());
      message.success("Xóa địa chỉ thành công");
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa địa chỉ");
    }
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "1":
        setIsModalVisible(true);
        break;
      case "2":
        setchangePasswordModal(true);

        break;
      case "3":
        dispatch(logout());
        Cookies.remove("token");
        navigate("/");
        break;
      default:
        message.info(`Click on item ${key}`);
    }
  };

  const dropDownItem = [
    { key: "1", label: "Thông tin cá nhân" },
    { key: "2", label: "Đổi mật khẩu" },
    { key: "3", label: "Đăng xuất" },
  ];

  const columns = [
    {
      title: "Thông tin",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Chi tiết",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Hành động",
      key: "action",
      render: (record) => {
        if (record.key === "5") {
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
        } else if (record.key === "7") {
          return (
            <Button
              onClick={() => addAddress(record)}
              type="primary"
              style={{ marginLeft: 8, backgroundColor: "lightgreen" }}
            >
              Thêm
            </Button>
          );
        } else if (!["1", "4", "8", "9"].includes(record.key)) {
          return (
            <Button
              onClick={() => edit(record)}
              type="primary"
              style={{ marginLeft: 8, backgroundColor: "lightgreen" }}
            >
              Sửa
            </Button>
          );
        }

        return null;
      },
    },
  ];

  // const data = userData ? [
  //   { key: '1', label: 'Tên đăng nhập :', value: userData.username },
  //   { key: '2', label: 'Email :',data : "email", value: userData.email },
  //   { key: '3', label: 'Họ và tên :',data : "fullName", value: userData.fullName },
  //   { key: '4', label: 'Trạng thái :', value: userData.status ? 'Đang hoạt động' : 'Block' },
  //   { key: '5', label: 'Avatar :', value: file ? (
  //       <>
  //         <img src={URL.createObjectURL(file)} alt="user" style={{ width: 60, height: 60 }} />
  //       </>
  //     ) : (
  //       <img src={userData.avatar} alt="user" style={{ width: 60, height: 60 }} />
  //     )},
  //   { key: '6', label: 'Số điện thoại :',data: "phone", value: userData.phone },
  //   { key: '7', label: 'Địa chỉ :',data :"address", value: userData.address },
  //   { key: '8', label: 'Ngày tạo :', value: userData.createdAt },
  //   { key: '9', label: 'Ngày cập nhật :', value: userData.updatedAt },
  // ] : [];

  const data = userData
    ? [
        { key: "1", label: "Tên đăng nhập :", value: userData.username },
        { key: "2", label: "Email :", data: "email", value: userData.email },
        {
          key: "3",
          label: "Họ và tên :",
          data: "fullName",
          value: userData.fullName,
        },
        {
          key: "4",
          label: "Trạng thái :",
          value: userData.status ? "Đang hoạt động" : "Block",
        },
        {
          key: "5",
          label: "Avatar :",
          value: file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="user"
              style={{ width: 60, height: 60 }}
            />
          ) : (
            <img
              src={userData.avatar}
              alt="user"
              style={{ width: 60, height: 60 }}
            />
          ),
        },
        {
          key: "6",
          label: "Số điện thoại :",
          data: "phone",
          value: userData.phone,
        },
        {
          key: "7",
          label: "Địa chỉ :",
          data: "address",
          value: userData.address,
        },
        { key: "8", label: "Ngày tạo :", value: userData.createdAt },
        { key: "9", label: "Ngày cập nhật :", value: userData.updatedAt },
      ]
    : [];

  return (
    <>
      {/* Header 1 */}

      <Header className={`header-1 ${isHeader1Visible ? "show" : ""}`}>
        <div className="header-content">
          <div className="logo">ROUTINE</div>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ flex: 1, fontSize: 18, marginLeft: 80 }}
          >
            <Menu.Item key="1">Nam</Menu.Item>
            <Menu.Item key="2">Nữ</Menu.Item>
            <Menu.Item key="3">New</Menu.Item>
            <Menu.Item key="4">Best</Menu.Item>
            <Menu.Item key="5">Giá Tốt</Menu.Item>
          </Menu>
          {Cookies.get("token") ? (
            <>
              <div className="header-icons">
                <div className="search-container">
                  <SearchOutlined className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="search-input"
                    onChange={handleSearchChange}
                  />
                </div>

                <HeartOutlined
                  className="header-icon"
                  onClick={showDrawerWishList}
                />

                <ShoppingCartOutlined
                  className="header-icon"
                  onClick={showDrawer}
                />
                <p className="bg-red-500 px-2 text-[12px] absolute top-[-8px] right-[-15px] rounded-lg hover:text-[14px] transition-all duration-75 ease-linear"></p>
                <div>
                  <Space size={16} wrap style={{ paddingLeft: "2vw" }}>
                    <div style={{ marginTop: "12px" }}>
                      <Image
                        width={50}
                        style={{ borderRadius: "10%" }}
                        src={userData.avatar}
                      />
                    </div>
                    <Dropdown
                      menu={{
                        items: dropDownItem,
                        onClick: handleMenuClick,
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space className="avarta-icon">
                          {userData.fullName}
                          <DownOutlined />
                        </Space>
                      </a>
                    </Dropdown>
                  </Space>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="header-icons">
                <div className="search-container">
                  <SearchOutlined className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="search-input"
                  />
                </div>
                <HeartOutlined className="header-icon" />
                <ShoppingCartOutlined className="header-icon" />
                <NavLink to="/login">
                  <UserOutlined className="header-icon" />
                </NavLink>
              </div>
            </>
          )}
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
              rules={[{ required: true, message: "Hãy nhập giá trị mới" }]}
            >
              <Input onChange={(e) => setEditingValue(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        )}
        {newdata && (
          <Table columns={columns} dataSource={newdata} pagination={false} />
        )}
      </Modal>
      <Modal
        title="Đổi mật khẩu"
        visible={changePasswordModal}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={formChangePassword}
          layout="inline"
          onFinish={changePasswordUser}
        >
          <Form.Item
            name="oldPass"
            label="Nhập mật khẩu cũ"
            rules={[{ required: true, message: "Nhập mật khẩu cũ" }]}
          >
            <Input
              type={showOldPassword ? "text" : "password"}
              suffix={
                showOldPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  />
                ) : (
                  <EyeOutlined
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="newPass"
            label="Nhập mật khẩu mới"
            rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
          >
            <Input
              type={showNewPassword ? "text" : "password"}
              suffix={
                showNewPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                ) : (
                  <EyeOutlined
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="confirmNewPass"
            label="Nhập lại mật khẩu"
            rules={[{ required: true, message: "Nhập lại mật khẩu" }]}
          >
            <Input
              type={showConfirmNewPassword ? "text" : "password"}
              suffix={
                showConfirmNewPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  />
                ) : (
                  <EyeOutlined
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm địa chỉ"
        visible={addAddressModal}
        onCancel={handleModalCancel}
        onOk={() => formAddAddress.submit()}
        okText="Thêm"
        cancelText="Đóng"
      >
        <Form form={formAddAddress} layout="inline" onFinish={addAddressUser}>
          <Form.Item name="streetAddress" label="Nhập số nhà / Số đường">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="ward" label="Nhập xã/phường">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="district" label="Nhập Quận/Huyện">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="province" label="Nhập Tỉnh/Thành phố">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="receiveName" label="Nhập tên người nhận">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="phone" label="Nhập số điện thoại ">
            <Input type="text" />
          </Form.Item>
        </Form>
      </Modal>
      <ShoppingCart onClose={onClose} open={open} />

      {/* Header2 */}

      <Header className="header-2">
        <div className="header-content">
          <div className="logo" style={{ marginLeft: "45%" }}>
            ROUTINE
          </div>
          {Cookies.get("token") ? (
            <>
              <div className="header-icons">
                <div className="search-container">
                  <SearchOutlined className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="search-input"
                  />
                </div>

                <HeartOutlined
                  className="header-icon"
                  onClick={showDrawerWishList}
                />

                <ShoppingCartOutlined
                  className="header-icon"
                  onClick={showDrawer}
                />
                <p className="bg-red-500 px-2 text-[12px] absolute top-[-8px] right-[-15px] rounded-lg hover:text-[14px] transition-all duration-75 ease-linear"></p>
                <div>
                  <Space size={16} wrap style={{ paddingLeft: "2vw" }}>
                    <div style={{ marginTop: "12px" }}>
                      <Image
                        width={50}
                        style={{ borderRadius: "10%" }}
                        src={userData.avatar}
                      />
                    </div>
                    <Dropdown
                      menu={{
                        items: dropDownItem,
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
            </>
          ) : (
            <>
              <div className="header-icons">
                <div className="search-container">
                  <SearchOutlined className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="search-input"
                  />
                </div>
                <HeartOutlined className="header-icon" />
                <ShoppingCartOutlined className="header-icon" />
                <NavLink to="/login">
                  <UserOutlined className="header-icon" />
                </NavLink>
              </div>
            </>
          )}
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
              rules={[{ required: true, message: "Hãy nhập giá trị mới" }]}
            >
              <Input onChange={(e) => setEditingValue(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        )}
        {newdata && (
          <Table columns={columns} dataSource={newdata} pagination={false} />
        )}
      </Modal>

      <Modal
        title="Đổi mật khẩu"
        visible={changePasswordModal}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={formChangePassword}
          layout="inline"
          onFinish={changePasswordUser}
        >
          <Form.Item
            name="oldPass"
            label="Nhập mật khẩu cũ"
            rules={[{ required: true, message: "Nhập mật khẩu cũ" }]}
          >
            <Input
              type={showOldPassword ? "text" : "password"}
              suffix={
                showOldPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  />
                ) : (
                  <EyeOutlined
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="newPass"
            label="Nhập mật khẩu mới"
            rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
          >
            <Input
              type={showNewPassword ? "text" : "password"}
              suffix={
                showNewPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                ) : (
                  <EyeOutlined
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="confirmNewPass"
            label="Nhập lại mật khẩu"
            rules={[{ required: true, message: "Nhập lại mật khẩu" }]}
          >
            <Input
              type={showConfirmNewPassword ? "text" : "password"}
              suffix={
                showConfirmNewPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  />
                ) : (
                  <EyeOutlined
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm địa chỉ"
        visible={addAddressModal}
        onCancel={handleModalCancel}
        onOk={() => formAddAddress.submit()}
        okText="Thêm"
        cancelText="Đóng"
      >
        <Form form={formAddAddress} layout="inline" onFinish={addAddressUser}>
          <Form.Item name="streetAddress" label="Nhập số nhà / Số đường">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="ward" label="Nhập xã/phường">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="district" label="Nhập Quận/Huyện">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="province" label="Nhập Tỉnh/Thành phố">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="receiveName" label="Nhập tên người nhận">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="phone" label="Nhập số điện thoại ">
            <Input type="text" />
          </Form.Item>
        </Form>
      </Modal>
      <ShoppingCart onClose={onClose} open={open} />
      <WishList onCloseWishList={onCloseWishList} openWishList={openWishList} />
    </>
  );
}
