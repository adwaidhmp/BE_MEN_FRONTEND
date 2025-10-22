// adminProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminapi from "../../adminapi";

// -----------------------------------------------------
// Fetch all products (Admin)
// -----------------------------------------------------
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await adminapi.get("products/", { params });
      console.log("Fetched Products:", res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

// -----------------------------------------------------
//  Fetch single product by ID
// -----------------------------------------------------
export const fetchAdminProductDetail = createAsyncThunk(
  "adminProducts/fetchDetail",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await adminapi.get(`products/${productId}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch product details");
    }
  }
);

// -----------------------------------------------------
//  Create a new product
// -----------------------------------------------------
export const createAdminProduct = createAsyncThunk(
  "adminProducts/create",
  async (productData, { dispatch, rejectWithValue }) => {
    try {
      const res = await adminapi.post("products/add/", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product created successfully!");
      dispatch(fetchAdminProducts());
      return res.data;
    } catch (err) {
      toast.error("Failed to create product!");
      return rejectWithValue(err.response?.data || "Failed to create product");
    }
  }
);

// -----------------------------------------------------
//  Update product
// -----------------------------------------------------
export const updateAdminProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ productId, updateData, params }, { dispatch, rejectWithValue }) => {
    try {
      const res = await adminapi.patch(`products/${productId}/update/`, updateData, {
        headers:
          updateData instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : {},
      });
      toast.success("Product updated successfully!");
      dispatch(fetchAdminProducts(params));
      return res.data;
    } catch (err) {
      toast.error("Failed to update product!");
      return rejectWithValue(err.response?.data || "Failed to update product");
    }
  }
);

// -----------------------------------------------------
//  Delete product
// -----------------------------------------------------
export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async ({ productId, params }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      await adminapi.delete(`products/${productId}/delete/`);
      toast.success("Product deleted successfully!");
      dispatch(fetchAdminProducts(params));
      return productId;
    } catch (err) {
      toast.error("Failed to delete product!");
      return rejectWithValue(err.response?.data || "Failed to delete product");
    }
  }
);

// -----------------------------------------------------
// Slice
// -----------------------------------------------------
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    loading: false,
    error: null,
    data: { results: [], count: 0 },
    selectedProduct: null,
  },
  reducers: {
    clearAdminProductError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------------------------------------------------
      // Fetch all products
      // -------------------------------------------------
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload)
          ? { results: action.payload, count: action.payload.length }
          : action.payload || { results: [], count: 0 };
        state.error = null;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------------------------------------------------
      // Fetch single product
      // -------------------------------------------------
      .addCase(fetchAdminProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchAdminProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------------------------------------------------
      // Create product
      // -------------------------------------------------
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data?.results) {
          state.data.results.unshift(action.payload);
          state.data.count += 1;
        } else {
          state.data = { results: [action.payload], count: 1 };
        }
        state.error = null;
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------------------------------------------------
      // Update product
      // -------------------------------------------------
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        if (state.data?.results && Array.isArray(state.data.results)) {
          const idx = state.data.results.findIndex((p) => p.id === updated.id);
          if (idx !== -1) {
            state.data.results[idx] = { ...state.data.results[idx], ...updated };
          }
        }

        if (state.selectedProduct?.id === updated.id) {
          state.selectedProduct = { ...state.selectedProduct, ...updated };
        }

        state.error = null;
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------------------------------------------------
      // Delete product
      // -------------------------------------------------
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data?.results && Array.isArray(state.data.results)) {
          state.data.results = state.data.results.filter(
            (p) => p.id !== action.payload
          );
          state.data.count = Math.max((state.data.count || 1) - 1, 0);
        }
        state.error = null;
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminProductError, clearSelectedProduct } =
  adminProductSlice.actions;
export default adminProductSlice.reducer;
