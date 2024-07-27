import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import BASE_URL from "../../api";
import { GET, POST } from "../../constants/httpMethod";

export const fetchCommentsByProduct = createAsyncThunk(
  "comments/fetchByProduct",
  async (productId) => {
    const response = await BASE_URL[GET](`/user/comments/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data; 
  }
);

export const addComment = createAsyncThunk("comments/add", async (commentData) => {
  const response = await BASE_URL[POST]("/user/comments", commentData, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  console.log("post",response.data);

  return response.data; // Giả sử API trả về bình luận vừa thêm
});

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [], // Danh sách bình luận
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCommentsByProduct.fulfilled, (state, action) => {
        state.comments = action.payload; // Cập nhật danh sách bình luận
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload); // Thêm bình luận mới vào danh sách
      });
  },
});

export default commentsSlice.reducer;
