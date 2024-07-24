import { combineReducers } from "redux";
import authSlice from "./authSlice";
import categorySlice from "./categorySlice";
import productSice from "./productSlice";
import userSlice from "./userSlice";
import bannerSlice from "./bannerSlice";


const reducers = combineReducers({
  auth: authSlice,
  category: categorySlice,
  product:productSice,
  user:userSlice,
  banners : bannerSlice
});

export default reducers;
