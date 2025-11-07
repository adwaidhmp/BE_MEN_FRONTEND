// adminCategorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminapi from "../../adminapi";

// ---------------------------------------------------------------------
// 1️⃣ Fetch all categories
// ---------------------------------------------------------------------
export const fetchAdminCategories = createAsyncThunk(
  "adminCategory/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminapi.get("category/");
      return res.data; // expects an array of categories
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// ---------------------------------------------------------------------
// 2️⃣ Fetch single category details
// ---------------------------------------------------------------------
export const fetchAdminCategoryDetail = createAsyncThunk(
  "adminCategory/fetchCategoryDetail",
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await adminapi.get(`category/${categoryId}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// ---------------------------------------------------------------------
// 3️⃣ Create new category
// ---------------------------------------------------------------------
export const createAdminCategory = createAsyncThunk(
  "adminCategory/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await adminapi.post("category/", categoryData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// ---------------------------------------------------------------------
// 4️⃣ Update category
// ---------------------------------------------------------------------
export const updateAdminCategory = createAsyncThunk(
  "adminCategory/updateCategory",
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const res = await adminapi.put(`category/${categoryId}/`, categoryData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// ---------------------------------------------------------------------
// 5️⃣ Delete category
// ---------------------------------------------------------------------
export const deleteAdminCategory = createAsyncThunk(
  "adminCategory/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await adminapi.delete(`category/${categoryId}/`);
      return categoryId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// ---------------------------------------------------------------------
// SLICE
// ---------------------------------------------------------------------
const adminCategorySlice = createSlice({
  name: "adminCategory",
  initialState: {
    categories: {
      loading: false,
      error: null,
      data: [],
    },
    currentCategory: {
      loading: false,
      error: null,
      data: null,
    },
    operation: {
      loading: false,
      error: null,
      success: null,
    },
  },
  reducers: {
    clearAdminCategoryError: (state) => {
      state.categories.error = null;
      state.currentCategory.error = null;
      state.operation.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory.data = null;
      state.currentCategory.error = null;
    },
    clearOperationStatus: (state) => {
      state.operation.loading = false;
      state.operation.error = null;
      state.operation.success = null;
    },
    resetCategoryState: (state) => {
      state.categories = { loading: false, error: null, data: [] };
      state.currentCategory = { loading: false, error: null, data: null };
      state.operation = { loading: false, error: null, success: null };
    },
  },
  extraReducers: (builder) => {
    // --- Fetch All Categories ---
    builder
      .addCase(fetchAdminCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      });

    // --- Fetch Single Category ---
    builder
      .addCase(fetchAdminCategoryDetail.pending, (state) => {
        state.currentCategory.loading = true;
        state.currentCategory.error = null;
      })
      .addCase(fetchAdminCategoryDetail.fulfilled, (state, action) => {
        state.currentCategory.loading = false;
        state.currentCategory.data = action.payload;
      })
      .addCase(fetchAdminCategoryDetail.rejected, (state, action) => {
        state.currentCategory.loading = false;
        state.currentCategory.error = action.payload;
      });

    // --- Create Category ---
    builder
      .addCase(createAdminCategory.pending, (state) => {
        state.operation.loading = true;
        state.operation.error = null;
        state.operation.success = null;
      })
      .addCase(createAdminCategory.fulfilled, (state, action) => {
        state.operation.loading = false;
        state.operation.success = "Category created successfully!";
        state.categories.data.unshift(action.payload);
        toast.success("Category created successfully!");
      })
      .addCase(createAdminCategory.rejected, (state, action) => {
        state.operation.loading = false;
        state.operation.error = action.payload;
        toast.error(action.payload?.detail || "Failed to create category");
      });

    // --- Update Category ---
    builder
      .addCase(updateAdminCategory.pending, (state) => {
        state.operation.loading = true;
        state.operation.error = null;
        state.operation.success = null;
      })
      .addCase(updateAdminCategory.fulfilled, (state, action) => {
        state.operation.loading = false;
        state.operation.success = "Category updated successfully!";

        const index = state.categories.data.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories.data[index] = action.payload;
        }

        if (
          state.currentCategory.data &&
          state.currentCategory.data.id === action.payload.id
        ) {
          state.currentCategory.data = action.payload;
        }

        toast.success("Category updated successfully!");
      })
      .addCase(updateAdminCategory.rejected, (state, action) => {
        state.operation.loading = false;
        state.operation.error = action.payload;
        toast.error(action.payload?.detail || "Failed to update category");
      });

    // --- Delete Category ---
    builder
      .addCase(deleteAdminCategory.pending, (state) => {
        state.operation.loading = true;
        state.operation.error = null;
        state.operation.success = null;
      })
      .addCase(deleteAdminCategory.fulfilled, (state, action) => {
        state.operation.loading = false;
        state.operation.success = "Category deleted successfully!";
        state.categories.data = state.categories.data.filter(
          (cat) => cat.id !== action.payload
        );

        if (
          state.currentCategory.data &&
          state.currentCategory.data.id === action.payload
        ) {
          state.currentCategory.data = null;
        }

        toast.success("Category deleted successfully!");
      })
      .addCase(deleteAdminCategory.rejected, (state, action) => {
        state.operation.loading = false;
        state.operation.error = action.payload;
        toast.error(action.payload?.detail || "Failed to delete category");
      });
  },
});

export const {
  clearAdminCategoryError,
  clearCurrentCategory,
  clearOperationStatus,
  resetCategoryState,
} = adminCategorySlice.actions;

export default adminCategorySlice.reducer;
