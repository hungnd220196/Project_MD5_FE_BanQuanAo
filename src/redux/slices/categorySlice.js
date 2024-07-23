import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import Cookies from "js-cookie";
import axios from "axios";

const initialState = {
  content: [],
  total: 0,
  number: 0,
  size: 3,
  isLoading: false,
};

export const fetchAllCategory = createAsyncThunk(
  
  "category/fetchAllCategory",
  async ({ page, size }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/categories?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`

          }
        }
      );
      return response.data;
    } catch (error) {
      notification.error({ message: error.message, duration: 3 });
    }
  }
);


const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.number = action.payload.page;  
      state.size = action.payload.size;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.content = action.payload.data.content;
        state.total = action.payload.data.totalElements;
      })
      .addCase(fetchAllCategory.rejected, (state) => {
        state.isLoading = false;
      });
  },
});


export const { changePage } = categorySlice.actions;
export default categorySlice.reducer;
