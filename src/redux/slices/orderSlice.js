import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';


export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async ({ page, size }) => {
    const response = await axios.get(`http://localhost:8080/api/v1/admin/orders`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
    return response.data;
  }
);

export const approveOrder = createAsyncThunk(
  'orders/approveOrder',
  async ({ orderId, orderStatusName }, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/orders/${orderId}/status`,
        { orderStatusName },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    content: [],
    number: 0,
    total: 0,
    size: 3,
    isLoading: false,
    error: null,
  },
  reducers: {
    changePage: (state, action) => {
      state.number = action.payload.page;
      state.size = action.payload.size;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.content = action.payload.data;
        state.total = action.payload.totalElements;
        state.isLoading = false;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(approveOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveOrder.fulfilled, (state, action) => {
        const index = state.content.findIndex(
          (order) => order.orderId === action.payload.data.orderId
        );
        if (index !== -1) {
          state.content[index] = action.payload.data;
        }
        state.isLoading = false;
      })
      .addCase(approveOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { changePage } = orderSlice.actions;

export default orderSlice.reducer;
