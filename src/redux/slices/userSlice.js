// redux/slices/userSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  content: [],
  searchResults: [],
  total: 0,
  number: 0,
  size: 3,
  isLoading: false,
};

export const fetchAllUser = createAsyncThunk(
  "user/fetchAllUser",
  async ({ page, size }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/users?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      // notification.error({ message: error.message, duration: 3 });
    }
  }
);

export const searchUser = createAsyncThunk(
    "user/searchUser",
    async ({searchText}) => {
            const response = await axios.get(
                `http://localhost:8080/api/v1/admin/users/search?query=${searchText}`,
                {
                    headers: {
                      Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                  }
            );
            return response.data;
    }
);

export const updateUserStatus = createAsyncThunk(
  "user/updateUserStatus",
  async ({ userId, status }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/admin/users/${userId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
    //   notification.success({ message: "Status updated successfully", duration: 3 });
      return response.data;
    } catch (error) {
      notification.error({ message: error.message, duration: 3 });
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.number = action.payload.page;
      state.size = action.payload.size;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.content = action.payload.content;
        state.total = action.payload.totalElements;
      })
      .addCase(fetchAllUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        const index = state.content.findIndex(user => user.userId === updatedUser.userId);
        if (index !== -1) {
          state.content[index] = updatedUser;
        }
      })
      .addCase(updateUserStatus.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(searchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { changePage } = userSlice.actions;
export default userSlice.reducer;
