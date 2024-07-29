import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import BASE_URL from "../../api";
import { DELETE, GET, POST } from "../../constants/httpMethod";
import { IDLE } from "../../constants/status";

export const fetchAllBanners = createAsyncThunk(
  "banners/fetchAllBanners",
  async () => {
    const response = await BASE_URL[GET](`admin/banners`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  }
);

export const fetchAllBannersUser = createAsyncThunk(
  "banners/fetchAllBannersUser",
  async () => {
    const response = await BASE_URL[GET](`user/banners`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  }
);

export const addBanners = createAsyncThunk(
    "banners/addBanners",
    async (bannerData) => {
      const response = await BASE_URL[POST](`admin/banners`, bannerData, {
        headers: {
            'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get("token")}`,
          
        },
      });
      return response.data;
    }
  );

  export const editBanners = createAsyncThunk(
    "banners/editBanners",
    async ({ id, bannerData }) => {
      const response = await BASE_URL[PUT](`admin/banners/${id}`, bannerData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    }
  );

  export const deleteBanners = createAsyncThunk(
    "banners/deleteBanners",
    async (id) => {
      const response = await BASE_URL[DELETE](`admin/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return id; 
    }
  );


const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    banners: [],
    status: IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllBanners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;
      })
      .addCase(fetchAllBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllBannersUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBannersUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;
      })
      .addCase(fetchAllBannersUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addBanners.fulfilled, (state, action) => {
        // state.banners.push(action.payload);
      })
      .addCase(editBanners.fulfilled, (state, action) => {
        const index = state.banners.findIndex(banner => banner.id === action.payload.id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(deleteBanners.fulfilled, (state, action) => {
        state.banners = state.banners.filter(banner => banner.id !== action.payload);
      });
  },
});

export default bannerSlice.reducer;
