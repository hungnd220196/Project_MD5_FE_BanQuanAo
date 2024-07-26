import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import BASE_URL from '../api';
import { DELETE, GET } from '../constants/httpMethod';
import { Divider, Drawer, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function WishList({onCloseWishList, openWishList}) {
  const [cart, setCart] = useState([]);
  const [wishList, setWishList] = useState([]);
console.log(openWishList);
  useEffect(() => {
    fetchWishList();
    fetchCart();
    console.log("a");
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/cart/list",
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log("get cart",response.data);
      setCart(response.data.data); 
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };


  const fetchWishList = async () => {
    try {
      const response = await BASE_URL[GET](
        "/user/wish-list",
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log("get WL",response.data);
      setWishList(response.data.data); 
    } catch (error) {
      console.error("Error fetching WishList:", error);
    }
  };

  const handleRemoveItem = async (wishListId) => {
    try {
      await BASE_URL[DELETE](
        `/user/wish-list/${wishListId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      message.success("Sản phẩm đã được xóa khỏi yêu thích");
      fetchWishList();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Có lỗi xảy ra khi xóa sản phẩm yêu thích");
    }
  };

  return (
    <>
    <Drawer title="WishList" placement="right" onClose={onCloseWishList} open={openWishList}>
    
        <Divider />

        {cart.map((cart, index) => (
          <>
            <div 
            key={cart.productId}
             className="flex items-center gap-2">
              <img
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                }}
                src={cart.productImage}
                alt={cart.productName}
              />
              <p>{cart.productName}</p>
              <DeleteOutlined
                onClick={() => handleRemoveItem(cart.productId)}
              />
            </div>
          </>
        ))}
        <>
          <div className="flex items-center justify-between">
            <p>
              {" "}
              Total:
              {cart.reduce(
                (pre, cur) => pre + cur.productPrice * cur.orderQuantity,
                0
              )}
            </p>
            <button className="bg-orange-500 px-4 py-2 rounded-lg text-white">
              Thanh toán
            </button>
          </div>
        </>
      </Drawer>
    </>
  )
}
