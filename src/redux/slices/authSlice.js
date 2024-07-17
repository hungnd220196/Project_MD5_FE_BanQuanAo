import { createSlice } from "@reduxjs/toolkit";
import { getDataFormCookie, login } from "../../services/authService";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: "idle",
    data: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      // Xóa cookie
      Cookies.remove("token");
      Cookies.remove("userInfo");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = "pending";
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "successed";
    });

    builder.addCase(getDataFormCookie.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = "Failed";
      state.error = action.error;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
