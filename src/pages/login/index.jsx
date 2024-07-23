import { Button, Input, notification } from "antd";
import "./index.scss";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { loadUserFromCookie, login } from "../../services/authService";
import { NavLink, useNavigate } from "react-router-dom";
import { FacebookFilled, GoogleCircleFilled, LockOutlined, TwitterCircleFilled, UserOutlined } from "@ant-design/icons";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      dispatch(loadUserFromCookie(token));
    }
  }, [dispatch]);
  const handleChange = (e) => {
    const { value, name } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      login({
        username: user.username,
        password: user.password,
      })
    )
      .unwrap()
      .then((response) => {
        const userData = response?.data;
        const roles = userData?.roles;
        const token = userData?.accessToken;

        localStorage.setItem('user', JSON.stringify(userData));

        Cookies.set('token', token, { path: '/' });

        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else if (roles.includes("ROLE_USER")) {
          navigate("/");
        }

        notification.success({
          message: "Thành công",
          description: "Đăng nhập thành công",
        });
      })
      .catch(() => {
        notification.error({
          message: "Thất bại",
          description: "Đăng nhập thất bại.",
        });
      });
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h2 className="title">Login</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <Input
              onChange={handleChange}
              name="username"
              className="form-input"
              placeholder="Type your username"
              prefix={<UserOutlined />}
              value={user.username}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Input
              onChange={handleChange}
              name="password"
              className="form-input"
              type="password"
              placeholder="Type your password"
              prefix={<LockOutlined />}
              value={user.password}
            />
          </div>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
          <Button className="button" htmlType="submit" type="primary">
            LOGIN
          </Button>
        </form>
        <div className="social-login-text">Or Sign Up Using</div>
        <div className="social-login">
          <button className="social-button">
            <FacebookFilled style={{ color: "blue" }} />
          </button>
          <button className="social-button">
            <TwitterCircleFilled style={{ color: "#2DA7EE" }} />
          </button>
          <button className="social-button">
            <GoogleCircleFilled style={{ color: "#D64F44" }} />
          </button>
        </div>
        <div className="sign-up">
          Or Sign Up Using <NavLink to="/register">Register</NavLink><br /><br />
        </div>
      </div>
    </div>
  );
}
