import { combineReducers } from "redux";
import authSlice from "./authSlice";
import categorySlice from "./categorySlice";
import productSice from "./productSice";
import userSlice from "./userSlice";


const reducers = combineReducers({
  auth: authSlice,
  category: categorySlice,
  product:productSice,
  user:userSlice
});

export default reducers;
