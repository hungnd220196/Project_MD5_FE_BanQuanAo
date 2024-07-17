import {
  DashboardOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./index.scss";

export default function Menu() {
  return (
    <>
      <menu className="ra-admin-menu">
        <Link to="/admin" className="logo">
          <img className="image" src="/logo.png" alt="" />
        </Link>
        <div className="navlinks">
          <NavLink end className="link" to="/admin">
            <DashboardOutlined />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink className="link" to="/admin/users">
            <UserOutlined />
            <span>Quản lý tài khoản</span>
          </NavLink>
          <NavLink className="link" to="/admin/category">
            <UserOutlined />
            <span>Quản lý danh mục</span>
          </NavLink>
          <NavLink className="link" to="/admin/product">
            <UserOutlined />
            <span>Quản lý sản phẩm</span>
          </NavLink>
          <NavLink className="link" to="/admin/orders">
            <PieChartOutlined />
            <span> Quản lý đơn hàng</span>
          </NavLink>
        </div>
      </menu>
    </>
  );
}
