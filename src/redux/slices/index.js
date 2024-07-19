import { combineReducers } from "redux";
import authSlice from "./authSlice";
import categorySlice from "./categorySlice";

const reducers = combineReducers({
  auth: authSlice,
  category: categorySlice

});

export default reducers;
