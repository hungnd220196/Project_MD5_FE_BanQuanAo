import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, message } from 'antd';
import axios from 'axios';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { fetchCart } from '../redux/slices/shoppingCartSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ShoppingCart({ onClose, open }) {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.shoppingCarts.shoppingCarts);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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

  const handleUpdateQuantity = async (id, delta) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/user/cart/${id}`,
        { quantity: delta },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      dispatch(fetchCart());
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Có lỗi xảy ra khi cập nhật số lượng");
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/cart/clear`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      message.success("Tất cả sản phẩm đã được xóa khỏi giỏ hàng");
      dispatch(fetchCart());
    } catch (error) {
      console.error("Error clearing cart:", error);
      message.error("Có lỗi xảy ra khi xóa tất cả sản phẩm");
    }
  };

  const totalPrice = data?.reduce((sum, item) => sum + item.productPrice * item.orderQuantity, 0);

  return (
    <>
      <Drawer title="Giỏ hàng" placement="right" onClose={onClose} open={open}>
        {data && data.map((cart) => (
          <div key={cart.productId} className="flex items-center gap-4 mb-4">
            <img
              className="w-20 h-20 object-contain"
              src={cart.productImage}
              alt={cart.productName}
            />
            <div className="flex flex-col flex-grow">
              <p className="font-semibold">{cart.productName}</p>
              <div className="flex items-center">
                <MinusSquareOutlined
                  onClick={() => handleUpdateQuantity(cart.id, cart.orderQuantity - 1)}
                  className="cursor-pointer"
                />
                <p className="mx-2">{cart.orderQuantity}</p>
                <PlusSquareOutlined
                  onClick={() => handleUpdateQuantity(cart.id, cart.orderQuantity + 1)}
                  className="cursor-pointer"
                />
                <p className="ml-auto">{cart.productPrice * cart.orderQuantity} VND</p>
                <DeleteOutlined
                  onClick={() => handleRemoveItem(cart.id)}
                  className="cursor-pointer text-red-500 ml-4"
                />
              </div>
            </div>
          </div>
        ))}
        <Divider />
        <Button
          onClick={handleClearCart}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-4"
        >
          Xóa tất cả
        </Button>
        <div className="flex items-center justify-between">
          <p className="font-semibold">
            Tổng: {totalPrice} VND
          </p>
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg">
            Thanh toán
          </button>
        </div>
      </Drawer>
    </>
  );
}
