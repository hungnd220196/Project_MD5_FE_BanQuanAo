import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";

const initialState = {
  products: [],
  total: 0,
  number: 0,
  size: 3,
  isLoading: false,
};

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async ({ page, size }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/admin/products?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { dispatch, getState }) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/admin/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      message.success("Product deleted successfully");
      const { number, size } = getState().product;
      dispatch(fetchAllProducts({ page: number, size }));
    } catch (error) {
      message.error("Failed to delete product");
      throw error;
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async ({ search, page, size }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/admin/products/search?search=${search}&page=${page}&size=${size}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "product/fetchProductsByCategory",
  async ({ categoryId, page, size }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/admin/products/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        params: { page, size },
        
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.number = action.payload.page;
      state.size = action.payload.size;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.total = action.payload.totalElements;
        state.number = action.payload.number;
        state.size = action.payload.size;
        
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.total = action.payload.totalElements;
        state.number = action.payload.number;
        state.size = action.payload.size;
      })
      .addCase(searchProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.total = action.payload.data.totalElements;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { changePage } = productSlice.actions;
export default productSlice.reducer;
