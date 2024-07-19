import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import axios from "axios";

const initialState = {
  content: [],
  total: 0,
  number: 0,
  size: 5,
  isLoading: false,
};
export const fetchAllCategory = createAsyncThunk(
  "category/fetchAllCategory",
  async ({ page }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/categories?page=${page}`
      );

      return response.data;
    } catch (error) {
      notification.error({ message: error.message, duration: 3 });
    }
  }
);

const categorySlice = createSlice({
  name: " category",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.number = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        state.content = action.payload.data.content;
        state.total = action.payload.totalElements;
      })
      .addCase(fetchAllCategory.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { changePage } = categorySlice.actions;
export default categorySlice.reducer;
