import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

//  Fetch wishlist items from server
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("wishlist/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await api.post("wishlist/", { product_id: productId });
      dispatch(fetchWishlist()); 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add to wishlist");
    }
  }
);

//  Remove a single product
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`wishlist/${productId}/`);
      dispatch(fetchWishlist()); 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to remove from wishlist");
    }
  }
);

//  Clear entire wishlist
export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("wishlist/");
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to clear wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetWishlist: (state) => {
      state.wishlist = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Optimistic remove
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.wishlist = state.wishlist.filter(
          (item) => item.product.id !== action.meta.arg
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Clear wishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.wishlist = [];
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
