import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import { toast } from "react-toastify";
import { fetchCart,resetCart } from "./cartSlice";         
import { fetchWishlist,resetWishlist } from "./wishlistSlice"; 
import { fetchNotifications } from "./NotificationSlice";


//  LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password,  }, {dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("login/", { email, password });
      const user = res.data.user || res.data;
      console.log(user)
      dispatch(setUser(user));

      await dispatch(fetchCart());
      await dispatch(fetchWishlist());
      await dispatch(fetchNotifications())
      
      toast.success("Login successful!");
      console.log(user)
      return user;
    } catch (err) {
      const message = err.response?.data?.detail || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

//  LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await api.post("logout/");

      dispatch(setUser(null));
      dispatch(resetCart());
      dispatch(resetWishlist());
      

      sessionStorage.removeItem("user");

      toast.info("Logged out successfully");

      return null; 
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
      return null;
    }
  }
);

//  FETCH USER PROFILE
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("profile/");
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to fetch profile";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

//  UPDATE USER PROFILE
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.patch("profile/update/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to update profile";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

//  CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ old_password, new_password }, { rejectWithValue }) => {
    try {
      const res = await api.post("profile/passwordchange/", {
        old_password,
        new_password,
      });
      toast.success("Password changed successfully!");
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.detail || "Failed to change password";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const storedUser = sessionStorage.getItem("user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload)
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      else sessionStorage.removeItem("user");
    },
  },
  
  extraReducers: (builder) => {
    builder
      //  Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        sessionStorage.removeItem("user");
      })

      //  Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
      })

      //  Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.loading = false;
      })

      //  Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state) => {
        state.loading = false;
      });
  },
});


export const { setUser } = authSlice.actions;

export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
