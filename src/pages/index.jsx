import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import YourCarouselComponent from '../components/CarouselComponent'
import ListProduct from './users/ListProduct'
import "./index.scss"

export default function HomeIndex() {
  return (
    <>
      <div>
        <NavLink to="/login">Đăng Nhập</NavLink><br /><br />
        <Link to="/register">Đăng Ký</Link><br /><br />
      </div>
    </>
  )
}
