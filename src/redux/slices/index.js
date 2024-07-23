import { combineReducers } from "redux";
import authSlice from "./authSlice";
import categorySlice from "./categorySlice";

import productSice from "./productSlice";


const reducers = combineReducers({
  auth: authSlice,
  category: categorySlice,
  product:productSice

});

export default reducers;
