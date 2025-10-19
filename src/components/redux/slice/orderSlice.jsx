import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";


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
// Only creates orders on COD. For Razorpay, backend just returns Razorpay order info.
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ items, shipping_address, phone, payment_method }, { rejectWithValue }) => {
    try {
      if (!items || items.length === 0) throw new Error("No items in cart");

      const orders = items.map((i) => ({
        product: i.product?.id || i.id,
        quantity: i.quantity,
        payment_method,
        shipping_address,
        phone,
      }));

      const payload = { orders };

      // Use different endpoints for COD and Razorpay
      const endpoint =
        payment_method === "COD"
          ? "/checkout/cod/"
          : "/checkout/razorpay/";

      const res = await api.post(endpoint, payload);
      return res.data;
    } catch (err) {
      console.error("PlaceOrder Error:", err);
      return rejectWithValue(err.response?.data || { error: err.message });
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


const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    currentOrder: null,  
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
      // fetchOrders 
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

      //  fetchOrderDetail
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

      //  placeOrder 
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

      //  cancelOrder
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