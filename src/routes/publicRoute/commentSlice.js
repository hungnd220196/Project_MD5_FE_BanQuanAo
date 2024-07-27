
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchAllComments = createAsyncThunk('comments/fetchAll', async () => {
  const response = await axios.get('http://localhost:8080/api/v1/admin/comment',
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }
  );
  console.log(response);
  return response.data;
});

export const updateCommentStatus = createAsyncThunk('comments/updateStatus', async ({ id, status }) => {
  const response = await axios.put(`http://localhost:8080/api/v1/admin/comment/${id}`, { status },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }
  );
 
  return response.data;
});

export const deleteComment = createAsyncThunk('comments/delete', async (id) => {
  await axios.delete(`http://localhost:8080/api/v1/admin/comment/${id}`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }
  );
  return id;
});

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
    
        state.comments = action.payload.data.content;
        state.isLoading = false;
      })
      .addCase(fetchAllComments.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCommentStatus.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      });
  },
});

export default commentSlice.reducer;
