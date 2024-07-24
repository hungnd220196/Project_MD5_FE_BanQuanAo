// redux/slices/userSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { GET, PATCH, PUT } from "../../constants/httpMethod";
import BASE_URL from "../../api";
import Item from "antd/es/list/Item";

const initialState = {
  content: [],
  searchResults: [],
  total: 0,
  number: 0,
  size: 3,
  isLoading: false,
  roles: [],
};

export const updateAvatarUser = createAsyncThunk("user/updateAvatarUser", async (formData) => {
  try {
    const response = await BASE_URL[PATCH](`user/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Update user info
export const updateInfoUser = createAsyncThunk("user/updateInfoUser", async (formData) => {
  try {
    const response = await BASE_URL[PATCH](`user/account`, formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const fetchRoles = createAsyncThunk("user/fetchRoles", async () => {
  const response = await BASE_URL[GET](`admin/roles`,
    {
      headers: {

        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    }
  );
  return response.data;
});

export const updateUserRole = createAsyncThunk('user/updateUserRole', async ({ userId, role }) => {
  const response = await BASE_URL[PUT](`admin/${userId}/role`, { role }, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  return response.data;
});



export const fetchAllUser = createAsyncThunk(
  "user/fetchAllUser",
  async ({ page, size }) => {
    try {
      const response = await BASE_URL[GET](
        `admin/users?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // notification.error({ message: error.message, duration: 3 });
    }
  }
);

export const searchUser = createAsyncThunk(
  "user/searchUser",
  async ({ searchText }) => {
      try {
          const response = await BASE_URL[GET](
              `admin/users/search?query=${searchText}`,
              {
                  headers: {
                      Authorization: `Bearer ${Cookies.get("token")}`,
                  },
              }
          );
          return response.data;
      } catch (error) {
          throw error;
      }
  }
);

export const updateUserStatus = createAsyncThunk(
  "user/updateUserStatus",
  async ({ userId, status }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      console.log(state);
      const user = state.user.content.find(user => user.userId === userId);
      if (user && user.roles.some(item => item.roleName === "ROLE_ADMIN")) {
        notification.error({ message:"Không thể thay đổi trạng thái ADMIN", duration: 3 });
        return rejectWithValue("Không thể thay đổi trạng thái ADMIN");
      }

      const response = await BASE_URL[PATCH](
        `admin/users/${userId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      notification.success({ message: "Thay đổi trạng thái thành công", duration: 3 });
      return response.data;
    } catch (err) {
      console.log(err);
      notification.error({ message: err.message, duration: 3 });
      return rejectWithValue(err.message);
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
      .addCase(updateUserStatus.rejected, (state, action) => {
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
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.content.findIndex(user => user.userId === updatedUser.userId);
        if (userIndex !== -1) {
          state.content[userIndex] = updatedUser;
        }
      });
  },
});

export const { changePage } = userSlice.actions;
export default userSlice.reducer;
