// adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminapi from "../../adminapi";

// --- THUNKS ---

// 1️⃣ Fetch Admin Dashboard
export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminapi.get("dashboard/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// 2️⃣ Fetch all users
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminapi.get("users/");
      console.log("res.data :",res.data)
      return res.data.results;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// 3️⃣ Fetch single user details
export const fetchAdminUserDetail = createAsyncThunk(
  "admin/fetchUserDetail",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await adminapi.get(`user/${userId}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// 4️⃣ Ban / Unban a user
export const banUnbanUser = createAsyncThunk(
  "admin/banUnbanUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await adminapi.post(`user/${userId}/ban/`);
      return { userId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// --- SLICE ---
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboard: {
      loading: false,
      error: null,
      data: {
        total_revenue: 0,
        total_orders: 0,
        total_users: 0,
        total_products: 0,
        pending_orders: 0,
        delivered_orders: 0,
        revenue_today: 0,
        orders_today: 0,
        weekly_revenue: 0,
        monthly_revenue: 0,
        yearly_revenue: 0,
        category_sales: [],
      },
    },
    users: {
      loading: false,
      error: null,
      data: [],
      selectedUser: null,
      banStatus: null,
    },
    orders: {
      loading: false,
      error: null,
      data: [],
    },
    products: {
      loading: false,
      error: null,
      data: [],
    },
  },
  reducers: {
    clearAdminDashboardError: (state) => {
      state.dashboard.error = null;
    },
    clearAdminUsersError: (state) => {
      state.users.error = null;
    },
    clearSelectedUser: (state) => {
      state.users.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // --- Dashboard ---
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.data = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.payload;
      });

    // --- Users ---
    builder
      // Fetch all users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
      })
      // Fetch single user details
      .addCase(fetchAdminUserDetail.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchAdminUserDetail.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.selectedUser = action.payload;
      })
      .addCase(fetchAdminUserDetail.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
      })
      // Ban / Unban user
      .addCase(banUnbanUser.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
        state.users.banStatus = null;
      })
      .addCase(banUnbanUser.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.banStatus = action.payload.message;

        // Update the user in users list
        const idx = state.users.data.findIndex(u => u.id === action.payload.userId);
        if (idx !== -1) {
          const wasBanned = state.users.data[idx].is_banned;
          state.users.data[idx].is_banned = !wasBanned;
          
          // Show toast message for ban/unban
          if (wasBanned) {
            toast.success("User unbanned successfully!");
          } else {
            toast.success("User banned successfully!");
          }
        }

        // Update selectedUser if open
        if (state.users.selectedUser?.id === action.payload.userId) {
          state.users.selectedUser.is_banned = !state.users.selectedUser.is_banned;
        }
      })
      .addCase(banUnbanUser.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
        toast.error(action.payload || "Failed to update user status");
      });
  },
});

export const { clearAdminDashboardError, clearAdminUsersError, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;