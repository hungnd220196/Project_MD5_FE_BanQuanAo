import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { DELETE, GET, POST } from "../../constants/httpMethod";
import BASE_URL from "../../api";
import { message } from "antd";




export const fetchWishList = createAsyncThunk(
  "wishList/fetchWishList",
  async () => {
    const response = await BASE_URL[GET](`user/wish-list`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  }
);

export const addWishList = createAsyncThunk(
    "wishlist/addWishList",
    async (bannerData) => {
        try {
             const response = await BASE_URL[POST](`user/wish-list`, bannerData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          
        },
      });
      message.success("Sản phẩm đã được thêm vào sản phẩm yêu thích");
      return response.data;
        } catch (error) {
            message.error("Sản Phẩm đã có trong danh sách yêu thích")
        }
     
    }
  );

  export const deleteWishList = createAsyncThunk(
    "wishlist/deleteWishList",
    async (wish_list_id) => {
      const response = await BASE_URL[DELETE](`user/wish-list/${wish_list_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return wish_list_id; 
    }
  );


const wishListSlice = createSlice({
  name: "wishList",
  initialState: {
    wishList: [],
    status: 'idle',  
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishList = action.payload;
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      }) 
      .addCase(deleteWishList.fulfilled, (state, action) => {
        state.wishList = state.wishList.filter(wishList => wishList.wish_list_id !== action.payload);
      });
  },
});

export default wishListSlice.reducer;
