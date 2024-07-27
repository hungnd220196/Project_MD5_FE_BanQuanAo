import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Divider, Drawer, message } from 'antd';
import axios from 'axios';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { fetchCart } from '../redux/slices/shoppingCartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ShoppingCart({ onClose, open }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const { data } = useSelector((state) => state.shoppingCarts.shoppingCarts);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setCart(data);
    }
  }, [data]);

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
      dispatch(fetchCart());
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleUpdateQuantity = async (productId, delta) => {
    const item = cart.find((item) => item.productId === productId);
    if (!item) return;

    const newQuantity = Math.max(item.orderQuantity + delta, 1);
    try {
      await axios.put(
        `http://localhost:8080/api/v1/user/cart/items/${productId}`,
        { orderQuantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      dispatch(fetchCart());
    } catch (error) {
      console.error("Error updating item quantity:", error);
      message.error("Có lỗi xảy ra khi cập nhật số lượng sản phẩm");
    }
  };

  const handleCheckOut = () => {
    navigate("/checkout");
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.orderQuantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.productPrice * item.orderQuantity, 0);

  return (
    <>
      <Drawer title="Giỏ hàng" placement="right" onClose={onClose} open={open}>
        <Divider />
        {cart.map((cartItem) => (
          <div key={cartItem.productId} className="flex items-center gap-2">
            <img
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
              }}
              src={cartItem.productImage}
              alt={cartItem.productName}
            />
            <p>{cartItem.productName}</p>
            <MinusSquareOutlined
              onClick={() => handleUpdateQuantity(cartItem.productId, -1)}
            />
            <p>{cartItem.orderQuantity}</p>
            <PlusSquareOutlined
              onClick={() => handleUpdateQuantity(cartItem.productId, 1)}
            />
            <p>{(cartItem.productPrice * cartItem.orderQuantity).toLocaleString()} ₫</p>
            <DeleteOutlined
              onClick={() => handleRemoveItem(cartItem.productId)}
            />
          </div>
        ))}
        <Divider />
        <div className="flex items-center justify-between">
          <p>
            Tổng số lượng: {totalQuantity}
          </p>
          <p>
            Tổng cộng: {totalPrice.toLocaleString()} ₫
          </p>
        </div>
        <button onClick={handleCheckOut} className="bg-orange-500 px-4 py-2 rounded-lg text-white">
          Thanh toán
        </button>
      </Drawer>
    </>
  );
}
