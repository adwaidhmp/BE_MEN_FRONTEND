// redux/slice/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// --------------------- Thunks ---------------------

// Fetch all user orders
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/my-orders/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single order detail
export const fetchOrderDetail = createAsyncThunk(
  "order/fetchOrderDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/my-orders/${orderId}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Place order (single or multiple)
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ items, shipping_address, phone, payment_method }, { rejectWithValue }) => {
    try {
      const payload = {
        orders: items.map((i) => ({
          product: i.product?.id || i.id,
          quantity: i.quantity,
          shipping_address,
          phone,
          payment_method,
        })),
      };

      const res = await api.post("/checkout/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/my-orders/${orderId}/`);
      return { orderId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --------------------- Slice ---------------------

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    currentOrder: null,   // store currently viewed order detail
    lastOrder: null,
    razorpayInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.lastOrder = null;
      state.razorpayInfo = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- fetchOrders ----------
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- fetchOrderDetail ----------
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        
        // Update in orders array if it exists
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- placeOrder ----------
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        state.lastOrder = data;

        if (data.razorpay_order_id) {
          state.razorpayInfo = {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_key: data.razorpay_key,
            amount: data.amount,
            currency: data.currency,
          };
        } else {
          state.razorpayInfo = null;
        }

        state.orders.push(...(data.orders || []));
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- cancelOrder ----------
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId } = action.payload;
        
        // Update in orders array
        state.orders = state.orders.map((o) =>
          o.id === orderId ? { ...o, order_status: "CANCELLED", payment_status: "REFUNDED" } : o
        );
        
        // Update currentOrder if it's the same order
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = { ...state.currentOrder, order_status: "CANCELLED", payment_status: "REFUNDED" };
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;