import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../api";
import { POST } from "../constants/httpMethod";
import Cookies from "js-cookie";

export const login = createAsyncThunk("auth/login", async (user) => {
  const response = await BASE_URL[POST]("auth/login", user);
  Cookies.set("token", JSON.stringify(response.data), { expires: 1 / 24 / 60 });
  return response.data;
});

export const loadUserFromCookie = createAsyncThunk(
  "auth/loadUserFromCookie",
  async (userData) => {
    return userData;
  }
);
