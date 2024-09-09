import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import productReducer from "../redux/features/product/productSlice";
import bankReducer from "../redux/features/Bank/bankSlice";
import filterReducer from "../redux/features/product/filterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    bank: bankReducer,
    filter: filterReducer,
  },
});
