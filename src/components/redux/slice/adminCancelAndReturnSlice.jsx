import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminapi from "../../adminapi";

// -----------------------------------------------------
// Fetch Cancelled / Returned / Return Pending Orders
// -----------------------------------------------------
export const fetchReturnedCancelledOrders = createAsyncThunk(
  "adminCancelAndReturn/fetchReturnedCancelled",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { type } = params; // e.g., "CANCELLED", "RETURN_PENDING", "RETURNED"
      const res = await adminapi.get(
        `/returned-cancelled-orders/${type ? `?type=${type}` : ""}`
      );
      console.log(res.data.results)
      return res.data.results;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// -----------------------------------------------------
// Approve or Reject Return Request
// -----------------------------------------------------
export const approveOrRejectReturn = createAsyncThunk(
  "adminCancelAndReturn/approveOrRejectReturn",
  async ({ orderId, action }, { rejectWithValue }) => {
    try {
      const res = await adminapi.post(`/orders/${orderId}/return/`, { action });
      toast.success(res.data.message);
      return { orderId, action, message: res.data.message };
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// -----------------------------------------------------
// Slice
// -----------------------------------------------------
const adminCancelAndReturnSlice = createSlice({
  name: "adminCancelAndReturn",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Returned/Cancelled Orders
      .addCase(fetchReturnedCancelledOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReturnedCancelledOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReturnedCancelledOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve / Reject Return
      .addCase(approveOrRejectReturn.fulfilled, (state, action) => {
        const { orderId, action: act } = action.payload;
        const index = state.data.findIndex((o) => o.id === orderId);
        if (index !== -1) {
          if (act === "approve") {
            state.data[index].order_status = "RETURNED";
          } else if (act === "reject") {
            state.data[index].order_status = "DELIVERED";
          }
        }
      })
      .addCase(approveOrRejectReturn.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminCancelAndReturnSlice.reducer;
