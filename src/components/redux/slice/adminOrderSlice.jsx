import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminapi from "../../adminapi";

// Fetch all orders (Admin)
export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await adminapi.get("orders/", { params });
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch orders");
    }
  }
);

// Fetch single order by ID
export const fetchAdminOrderDetail = createAsyncThunk(
  "adminOrders/fetchDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await adminapi.get(`orders/${orderId}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch order details");
    }
  }
);

// Update order (status, tracking_id, delivery_date)
export const updateAdminOrder = createAsyncThunk(
  "adminOrders/update",
  async ({ orderId, updateData }, { getState, dispatch, rejectWithValue }) => {
    try {
      const res = await adminapi.patch(`orders/${orderId}/`, updateData);
      toast.success("Order updated successfully!");
      const { currentPage, filter, searchTerm } = getState().adminOrders;
      dispatch(fetchAdminOrders({
        page: currentPage,
        ...(filter !== "all" && { order_status: filter }),
        ...(searchTerm && { search: searchTerm }),
      }));
      return res.data;
    } catch (err) {
      toast.error("Failed to update order!");
      return rejectWithValue(err.response?.data || "Failed to update order");
    }
  }
);

// Slice
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    loading: false,
    error: null,
    data: [],
    cancelled: [],
    selectedOrder: null,
    currentFilter: "all",
  },
  reducers: {
    clearAdminOrderError: (state) => { state.error = null; },
    clearSelectedOrder: (state) => { state.selectedOrder = null; },
    clearCancelledOrders: (state) => { state.cancelled = []; },
    setCurrentFilter: (state, action) => { state.currentFilter = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single order
      .addCase(fetchAdminOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchAdminOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order
      .addCase(updateAdminOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        // Update in main orders list
        if (state.data?.results && Array.isArray(state.data.results)) {
          const idx = state.data.results.findIndex((order) => order.id === updated.id);
          if (idx !== -1) state.data.results[idx] = { ...state.data.results[idx], ...updated };
        }

        // Update in cancelled list if exists
        const cancelIdx = state.cancelled.findIndex((o) => o.id === updated.id);
        if (cancelIdx !== -1) state.cancelled[cancelIdx] = { ...state.cancelled[cancelIdx], ...updated };

        // Update selected order if open
        if (state.selectedOrder?.id === updated.id) state.selectedOrder = { ...state.selectedOrder, ...updated };
        state.error = null;
      })
      .addCase(updateAdminOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAdminOrderError,
  clearSelectedOrder,
  clearCancelledOrders,
  setCurrentFilter
} = adminOrderSlice.actions;
export default adminOrderSlice.reducer;