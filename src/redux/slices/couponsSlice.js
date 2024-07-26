import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../api";
import { DELETE, GET, POST } from "../../constants/httpMethod"; 
import Cookies from "js-cookie";

const initialState = {
  coupons: [],
  status: 'idle', // Thêm trạng thái ban đầu
  error: null // Thêm error ban đầu
};

export const getAllCoupons = createAsyncThunk("coupons/getAllCoupons",
  async () => {
    try {
      const response = await BASE_URL[GET](`admin/coupons`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addCoupons = createAsyncThunk("coupons/addCoupons",
  async (formData) => {
    try {
      const response = await BASE_URL[POST](`admin/coupons`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteCoupons = createAsyncThunk("coupons/deleteCoupons",
  async (id) => {
    try {
      const response = await BASE_URL[DELETE](`admin/coupons/${id}`, 
        {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return id;
    } catch (error) {
      throw error;
    }
  }
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoupons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCoupons.fulfilled, (state, action) => {
        // state.coupons.push(action.payload);
      })
      .addCase(deleteCoupons.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(coupon => coupon.id !== action.payload);
      });
  },
});

export default couponsSlice.reducer;
