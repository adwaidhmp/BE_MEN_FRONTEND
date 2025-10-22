import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import { toast } from "react-toastify";

// --- Fetch notifications ---
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications/");
      console.log("Notifications fetched:", res.data);
      return res.data.results||[];
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to fetch notifications";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// --- Mark notification as read ---
export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/notifications/${id}/`, { read: true });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to mark notification as read";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetNotifications: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.items.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { resetNotifications } = notificationSlice.actions;
export const selectNotifications = (state) => state.notifications.items;
export default notificationSlice.reducer;
