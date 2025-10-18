import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api"; 

//  Fetch cart items from server
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await api.get("cart/");
  return res.data; 
});

//  Add a product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { dispatch }) => {
    await api.post("cart/", { product_id: productId, quantity });
    dispatch(fetchCart()); 
  }
);  

//  Remove a product from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { dispatch }) => {
    await api.delete(`cart/${productId}/`);
    dispatch(fetchCart());
  }
);

//  Update quantity of a product (+/-)
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { dispatch }) => {
    await api.post("/cart/", { product_id: productId, quantity });
    dispatch(fetchCart());
  }
);

//  Clear the entire cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/cart/");
      return []; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cart = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Remove from Cart

      .addCase(removeFromCart.pending, (state, action) => {
        state.cart = state.cart.filter((item) => item.product.id !== action.meta.arg);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Clear Cart
      
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
