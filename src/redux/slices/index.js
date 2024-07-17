import { combineReducers } from "redux";
import authSlice from "./authSlice";

const reducers = combineReducers({
  auth: authSlice,
});

export default reducers;
