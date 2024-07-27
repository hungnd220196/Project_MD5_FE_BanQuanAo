import { combineReducers } from "redux";
import authSlice from "./authSlice";
import categorySlice from "./categorySlice";
import productSice from "./productSlice";
import userSlice from "./userSlice";
import bannerSlice from "./bannerSlice";
import couponsSlice from "./couponsSlice";

import orderSlice from "./orderSlice";
import shoppingCartSlice from "./shoppingCartSlice";
import wishlistSlice from "./wishlistSlice";
import commentSlice from "./commentSlice";
import reviewSlice from "./reviewSlice";
import commentsUserSlice from "./commentsUserSlice";

const reducers = combineReducers({
  auth: authSlice,
  category: categorySlice,
  product: productSice,
  user: userSlice,
  banners: bannerSlice,
  coupons: couponsSlice,
  orders: orderSlice,
  shoppingCarts: shoppingCartSlice,
  wishList: wishlistSlice,
  comments: commentsUserSlice,
  comment : commentSlice,
  review: reviewSlice,
});

export default reducers;
