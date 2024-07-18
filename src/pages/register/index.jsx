import React, { useState } from 'react';
import './index.scss';
import { Button, Input, notification } from 'antd';
import { LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import BASE_URL from "../../api";
import { POST } from "../../constants/httpMethod";
import { BAD_REQUEST, CREATED, ERROR } from "../../constants/httpStatusCode";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formRegister, setFormRegister] = useState({
    username: '',
    fullName: '',
    password: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState({
    username: '',
    fullName: '',
    password: '',
    phone: '',
    email: '',
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormRegister({ ...formRegister, [name]: value });
    if (value !== '') {
      setError({ ...error, [name]: '' });
    } else {
      setError({ ...error, [name]: name + ' must be not empty' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formRegister.fullName !== '' && formRegister.username !== '' && formRegister.password !== '' && formRegister.phone !== '' && formRegister.email !== '') {
      try {
        const response = await BASE_URL[POST]("auth/register", formRegister);
        if (response.status === CREATED) {
          notification.success({
            message: "Thông báo",
            description: "Đăng ký tài khoản thành công",
          });
          navigate("/login");
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.data) {
          setError(err.response.data.data);
        } else {
          notification.error({
            message: "Error",
            description: "Đăng ký thất bại. Vui lòng thử lại sau.",
          });
        }
      }
    } else {
      if (!formRegister.fullName) {
        setError((prev) => ({ ...prev, fullName: 'Tên không được để trống' }));
      }
      if (!formRegister.email) {
        setError((prev) => ({ ...prev, email: 'email không được để trống' }));
      }
      if (!formRegister.password) {
        setError((prev) => ({ ...prev, password: 'Mật khẩu không được để trống' }));
      }
      if (!formRegister.phone) {
        setError((prev) => ({ ...prev, phone: 'Số điện thoại không được để trống' }));
      }
      if (!formRegister.username) {
        setError((prev) => ({ ...prev, username: 'Tên đăng nhập không được để trống' }));
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        <label>
          Username
          <Input
            onChange={handleChangeForm}
            name="username"
            className="form-input"
            placeholder="Nhập tên đăng nhập"
            prefix={<UserOutlined />}
            value={formRegister.username}
          />
          {error.username && <small className="error">{error.username}</small>}
        </label>
        <label>
          Full Name
          <Input
            onChange={handleChangeForm}
            name="fullName"
            className="form-input"
            placeholder="Nhập tên"
            prefix={<UserAddOutlined />}
            value={formRegister.fullName}
          />
          {error.fullName && <small className="error">{error.fullName}</small>}
        </label>
        <label>
          Password
          <Input
            onChange={handleChangeForm}
            name="password"
            className="form-input"
            type="password"
            placeholder="Nhập mật khẩu"
            prefix={<LockOutlined />}
            value={formRegister.password}
          />
          {error.password && <small className="error">{error.password}</small>}
        </label>
        <label>
          Phone
          <Input
            onChange={handleChangeForm}
            name="phone"
            className="form-input"
            type="text"
            placeholder="Nhập số điện thoại"
            prefix={<PhoneOutlined />}
            value={formRegister.phone}
          />
          {error.phone && <small className="error">{error.phone}</small>}
        </label>
        <label>
          Email
          <Input
            onChange={handleChangeForm}
            name="email"
            className="form-input"
            type="email"
            placeholder="Nhập Email"
            prefix={<MailOutlined />}
            value={formRegister.email}
          />
          {error.email && <small className="error">{error.email}</small>}
        </label>
        <button className="button" type="submit">
          SIGN UP
        </button>
      </form>
    </div>
  );
};

export default Register;
