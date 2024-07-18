import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function HomeIndex() {
  return (
    <div>
        <NavLink to="/login">Đăng Nhập</NavLink><br /><br />
        <Link to="/register">Đăng Ký</Link><br /><br />
    </div>
  )
}
