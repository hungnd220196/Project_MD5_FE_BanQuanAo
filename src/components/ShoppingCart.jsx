import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Divider, Drawer } from 'antd'
import axios from 'axios';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react'


export default function ShoppingCart({onClose,open}) {
     // Thêm trạng thái cho giỏ hàng
  const [cart, setCart] = useState([]);
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    fetchCart();
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
      console.log(response.data);
      setCart(response.data.data); // Assuming response.data.data contains the cart array
      setCartLength(response.data.data.length);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
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

  const handleUpdateQuantity = (productId, delta) => {
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, orderQuantity: Math.max(item.orderQuantity + delta, 1) }
          : item
      )
    );
  };

  return (
    <>
    <Drawer title="Giỏ hàng" placement="right" onClose={onClose} open={open}>
        {/* <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Chọn tất cả ({cartLength})
        </Checkbox> */}
        <Divider />
        {/* <Checkbox.Group
          style={{
            width: '100%',
          }}
          value={checkedList}
          onChange={onChange}
        > */}

        {cart.map((cart, index) => (
          <>
            <div key={cart.productId} className="flex items-center gap-2">
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
              <MinusSquareOutlined
                onClick={() => handleUpdateQuantity(cart.productId, -1)}
              />
              <p>{cart.orderQuantity}</p>
              <PlusSquareOutlined
                onClick={() => handleUpdateQuantity(cart.productId, 1)}
              />
              <p>{cart.productPrice * cart.orderQuantity}</p>
              <DeleteOutlined
                onClick={() => handleRemoveItem(cart.productId)}
              />
            </div>
          </>
        ))}
        {/* </Checkbox.Group> */}
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
