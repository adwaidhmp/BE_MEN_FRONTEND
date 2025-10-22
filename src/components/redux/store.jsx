import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice";
import orderReducer from "./slice/orderSlice";
import adminReducer from "./slice/adminSlice";
import adminOrderReducer from "./slice/adminOrderSlice";
import adminProductSlice from "./slice/adminProductSlice";
import notificationReducer from "./slice/NotificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    admin: adminReducer,
    adminOrders: adminOrderReducer,
    adminProducts: adminProductSlice,
    notifications: notificationReducer,
  },
});

