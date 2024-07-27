import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchAllReviews = createAsyncThunk('reviews/fetchAll', async () => {
  const response = await axios.get('http://localhost:8080/api/v1/admin/review',
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }
  );
  console.log(response);
  return response.data;
});

export const updateReviewStatus = createAsyncThunk('reviews/updateStatus', async ({ id, status }) => {
  const response = await axios.put(`http://localhost:8080/api/v1/admin/review/${id}`, { status },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }
  );
 
  return response.data;
});


const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllReviews.rejected, (state) => {
        state.isLoading = false;
      })
      
  },
});

export default reviewSlice.reducer;
