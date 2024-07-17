import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Button } from "antd";
import { logout } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = Cookies.get("userInfo");
  if (!data) {
    navigate("/login");
    return false;
  }
  const dataParse = JSON.parse(data);
  
  const handleLogut = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div>
      <span>Họ tên: {dataParse.fullName}</span>
      <span>Email: {dataParse.email}</span>
      <Button onClick={handleLogut}>Đăng xuất</Button>
    </div>
  );
}
