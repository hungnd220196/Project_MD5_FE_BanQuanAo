import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { DELETE, GET } from "../../constants/httpMethod";
import BASE_URL from "../../api";



// Define the async thunk for fetching the cart
export const fetchCart = createAsyncThunk(
  "shoppingCarts/fetchCart",
  async () => {
    const response = await BASE_URL[GET](`user/cart/list`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  }
);

export const clearAllCart = createAsyncThunk(
  "shoppingCarts/clearAllCart",
  async () => {
    const response = await BASE_URL[DELETE](`user/cart/clear`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  }
);

// Create the slice for the shopping cart
const shoppingCartSlice = createSlice({
  name: "shoppingCarts",
  initialState: {
    shoppingCarts: [],
    status: 'idle',  
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shoppingCarts = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default shoppingCartSlice.reducer;
