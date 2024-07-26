import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import BASE_URL from '../api';
import { DELETE, GET } from '../constants/httpMethod';
import { Divider, Drawer, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { deleteWishList, fetchWishList } from '../redux/slices/wishlistSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function WishList({ onCloseWishList, openWishList }) {
  const dispatch = useDispatch();
  const { wishList } = useSelector((state) => state.wishList);
  
  useEffect(() => {
    dispatch(fetchWishList());
  }, [dispatch]);

  const handleRemoveItem = async (wish_list_id) => {
    try {
      await dispatch(deleteWishList(wish_list_id));
      dispatch(fetchWishList());
      message.success("Xóa thành công sản phẩm yêu thích")
    } catch (error) {
      console.error('Lỗi khi xóa WishList:', error);
    }}
  return (
    <Drawer title="WishList" placement="right" onClose={onCloseWishList} open={openWishList}>
      <Divider />
      {wishList && wishList.map((item) => (
        <div key={item.productId} className="flex items-center gap-2">
          <img
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
            src={item.product.image}
            alt={item.product.productName}
          />
          
          <p>{item.product.productName}</p>
          <DeleteOutlined onClick={() => handleRemoveItem(item.wishListId)} />
        </div>
      ))}
      <Divider />
    </Drawer>
  );
}
