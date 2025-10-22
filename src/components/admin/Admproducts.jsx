import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  clearAdminProductError,
  fetchAdminProductDetail,
  clearSelectedProduct,
} from "../redux/slice/adminProductSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Eye, 
  ChevronUp, 
  ChevronDown, 
  Search,
  Filter,
  Package,
  DollarSign,
  Layers,
  Tag
} from "lucide-react";

export default function Products() {
  const dispatch = useDispatch();
  const {
    data: productsData,
    loading,
    error,
    selectedProduct,
  } = useSelector((state) => state.adminProducts);

  // ----- Filters / Sort -----
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, product: null });
  const [detailModal, setDetailModal] = useState({ show: false, product: null });
  
  // Add state for all categories
  const [allCategories, setAllCategories] = useState([]);
  // Add state for form submission
  const [formError, setFormError] = useState("");

  // Params exactly like old code
  const params = { search, category: categoryFilter, sort, page: currentPage };

  // Extract products and pagination info from response
  const products = productsData?.results || [];
  const pagination = productsData || {};

  // ----- Fetch products -----
  const fetchProducts = () => dispatch(fetchAdminProducts(params));

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, sort, currentPage]);

  // Fetch all categories separately to populate dropdown
  useEffect(() => {
    // Fetch all products without filters to get all categories
    dispatch(fetchAdminProducts({}))
      .unwrap()
      .then((response) => {
        const allProducts = response.results || [];
        const uniqueCategories = {};
        
        allProducts.forEach((product) => {
          if (product.category && product.category.id) {
            uniqueCategories[product.category.id] = product.category.category;
          }
        });
        
        // Convert to array format for dropdown
        const categoriesArray = Object.entries(uniqueCategories).map(([id, name]) => ({
          id,
          name
        }));
        
        setAllCategories(categoriesArray);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
      });
  }, [dispatch]);

  // ----- Handlers -----
  const handleEdit = (productId) => {
    dispatch(fetchAdminProductDetail(productId));
    setShowForm(true);
    setFormError(""); // Clear form errors when editing
  };

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteAdminProduct({ productId, params })).unwrap();
      setDeleteConfirm({ show: false, product: null });
      // Products will refresh automatically due to the useEffect
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
    dispatch(clearSelectedProduct());
    setFormError(""); // Clear form errors when creating
  };

  const handleCancel = () => {
    setShowForm(false);
    dispatch(clearSelectedProduct());
    dispatch(clearAdminProductError());
    setFormError(""); // Clear form errors when canceling
  };

  const showDeleteConfirmation = (product) => {
    setDeleteConfirm({ show: true, product });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirm({ show: false, product: null });
  };

  const showProductDetail = async (product) => {
    setDetailModal({ show: true, product });
    dispatch(fetchAdminProductDetail(product.id));
  };

  const closeProductDetail = () => {
    setDetailModal({ show: false, product: null });
    dispatch(clearSelectedProduct());
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!pagination.count) return [];

    const totalPages = Math.ceil(
      pagination.count / (pagination.page_size || 10)
    );
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-stone-900">Manage Products</h2>
          <p className="text-stone-600 font-light">Add, edit, and manage your products</p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900">Delete Product</h3>
                <p className="text-stone-600 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-stone-700 mb-6">
              Are you sure you want to delete <strong>"{deleteConfirm.product?.name}"</strong>? 
              This product will be permanently removed from the system.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteConfirmation}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.product.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {detailModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-stone-900">Product Details</h2>
              <button
                onClick={closeProductDetail}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-stone-600 font-serif">Loading product details...</p>
                </div>
              </div>
            ) : selectedProduct ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                    <img
                      src={selectedProduct.product_image}
                      alt={selectedProduct.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex gap-3">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      selectedProduct.active 
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                      {selectedProduct.active ? "Active" : "Inactive"}
                    </span>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      selectedProduct.product_stock > 10 
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : selectedProduct.product_stock > 0 
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                      {selectedProduct.product_stock > 0 ? `${selectedProduct.product_stock} in stock` : "Out of stock"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        closeProductDetail();
                        handleEdit(selectedProduct.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
                    >
                      <Pencil size={20} /> Edit Product
                    </button>
                    <button
                      onClick={() => {
                        closeProductDetail();
                        showDeleteConfirmation(selectedProduct);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-all"
                    >
                      <Trash2 size={20} /> Delete Product
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl text-stone-900 mb-2">{selectedProduct.name}</h3>
                    <p className="text-stone-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <span className="font-medium text-stone-700">Category</span>
                      </div>
                      <p className="text-stone-900 capitalize">{selectedProduct.category?.category || "N/A"}</p>
                    </div>

                    <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-amber-600" />
                        <span className="font-medium text-stone-700">Pricing</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-stone-900">${selectedProduct.price}</p>
                        {selectedProduct.old_price && selectedProduct.old_price > selectedProduct.price && (
                          <p className="text-sm text-stone-500 line-through">${selectedProduct.old_price}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-4 h-4 text-amber-600" />
                        <span className="font-medium text-stone-700">Product Information</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-stone-600">Product ID:</span>
                          <span className="font-medium text-stone-900">#{selectedProduct.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Created:</span>
                          <span className="font-medium text-stone-900">{new Date(selectedProduct.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Updated:</span>
                          <span className="font-medium text-stone-900">{new Date(selectedProduct.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl text-stone-900 mb-2">Product Not Found</h3>
                <p className="text-stone-600">The requested product could not be loaded.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white"
            />
          </div>

          {/* Category Filter */}
          <select
            className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {allCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="stock_low_high">Stock: Low to High</option>
            <option value="stock_high_low">Stock: High to Low</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
          </select>

          {/* Add Product Button */}
          <button
            className="bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-700 transition-all font-medium"
            onClick={handleCreate}
          >
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Form Error Display */}
      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{formError}</p>
        </div>
      )}

      {/* Product Form */}
      {showForm && (
        <Formik
          enableReinitialize
          initialValues={{
            name: selectedProduct?.name || "",
            description: selectedProduct?.description || "",
            price: selectedProduct?.price || "",
            old_price: selectedProduct?.old_price || "",
            product_stock: selectedProduct?.product_stock || "",
            category: selectedProduct?.category?.id || "",
            image: null,
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Product name is required"),
            description: Yup.string().required("Description is required"),
            price: Yup.number()
              .required("Price is required")
              .positive("Price must be positive"),
            old_price: Yup.number().positive("Old price must be positive"),
            product_stock: Yup.number()
              .required("Stock is required")
              .integer("Stock must be a whole number")
              .min(0, "Stock cannot be negative"),
            category: Yup.string().required("Category is required"),
            image: selectedProduct
              ? Yup.mixed().nullable()
              : Yup.mixed().required("Product image is required"),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setFormError(""); // Clear previous form errors
            
            const formData = new FormData();
            
            // Append all form data correctly
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("product_stock", values.product_stock);
            formData.append("active", "true"); // Always set as active
            
            if (values.old_price) {
              formData.append("old_price", values.old_price);
            }
            
            if (values.category) {
              formData.append("category_id", values.category);
            }
            
            if (values.image && values.image instanceof File) {
              formData.append("product_image", values.image);
            }

            try {
              let result;
              if (selectedProduct) {
                result = await dispatch(
                  updateAdminProduct({
                    productId: selectedProduct.id,
                    updateData: formData,
                    params,
                  })
                ).unwrap();
              } else {
                result = await dispatch(createAdminProduct(formData)).unwrap();
              }
              console.log(result)
              // If successful, close form and refresh products
              setShowForm(false);
              fetchProducts();
              
            } catch (error) {
              console.error("Submission error:", error);
              
              // Handle API validation errors
              if (error && typeof error === 'object') {
                if (error.detail) {
                  setFormError(error.detail);
                } else if (error.message) {
                  setFormError(error.message);
                } else {
                  const fieldErrors = {};
                  Object.keys(error).forEach(key => {
                    if (Array.isArray(error[key])) {
                      fieldErrors[key] = error[key][0];
                    }
                  });
                  setErrors(fieldErrors);
                  
                  if (Object.keys(fieldErrors).length === 0) {
                    setFormError("Failed to save product. Please check your input.");
                  }
                }
              } else {
                setFormError("An unexpected error occurred. Please try again.");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-stone-900">
                  {selectedProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Product Name *
                    </label>
                    <Field 
                      name="name" 
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
                      placeholder="Enter product name" 
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Category *
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select Category</option>
                      {allCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Current Price *
                      </label>
                      <Field
                        name="price"
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="0.00"
                      />
                      <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Original Price
                      </label>
                      <Field
                        name="old_price"
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="0.00"
                      />
                      <ErrorMessage name="old_price" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Stock Quantity *
                    </label>
                    <Field
                      name="product_stock"
                      type="number"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="0"
                    />
                    <ErrorMessage name="product_stock" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Description *
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={4}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                      placeholder="Enter product description"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Product Image {!selectedProduct && "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        setFieldValue("image", file);
                      }}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />

                    {selectedProduct && selectedProduct.product_image && (
                      <div className="mt-3">
                        <p className="text-sm text-stone-600 mb-2">Current Image:</p>
                        <img
                          src={selectedProduct.product_image}
                          alt="Current product"
                          className="w-32 h-32 object-cover rounded-lg border border-stone-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-4 pt-6 border-t border-stone-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {selectedProduct ? "Updating..." : "Creating..."}
                      </>
                    ) : selectedProduct ? (
                      "Update Product"
                    ) : (
                      "Create Product"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-stone-200 text-stone-700 px-8 py-3 rounded-lg font-medium hover:bg-stone-300 transition-all flex items-center gap-2"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-stone-600 font-serif">Loading products...</p>
          </div>
        </div>
      )}

      {/* Products Table */}
      {!loading && products.length > 0 && (
        <>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.product_image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                          />
                          <div>
                            <div className="font-medium text-stone-900">{product.name}</div>
                            <div className="text-sm text-stone-500 line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-700 capitalize">
                        {product.category?.category || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-900">${product.price}</span>
                          {product.old_price && product.old_price > product.price && (
                            <span className="text-sm text-stone-500 line-through">${product.old_price}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          product.product_stock > 10 
                            ? "bg-green-100 text-green-700" 
                            : product.product_stock > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {product.product_stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          product.active 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => showProductDetail(product)}
                          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-all"
                        >
                          <Eye size={16} /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.count > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-6 mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-stone-600">
                  Showing {(currentPage - 1) * (pagination.page_size || 10) + 1} to{" "}
                  {Math.min(
                    currentPage * (pagination.page_size || 10),
                    pagination.count
                  )}{" "}
                  of {pagination.count} products
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={!pagination.previous}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronUp className="w-4 h-4 rotate-90" />
                    Previous
                  </button>

                  {generatePageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        currentPage === page
                          ? "bg-amber-600 text-white border-amber-600"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.next}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-stone-900 mb-2">No Products Found</h3>
          <p className="text-stone-600 font-light mb-6">
            {search || categoryFilter
              ? "Try adjusting your search criteria"
              : "Get started by adding your first product"}
          </p>
          {!showForm && (
            <button
              onClick={handleCreate}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition-all font-medium mx-auto"
            >
              <Plus size={20} /> Add Your First Product
            </button>
          )}
        </div>
      )}
    </div>
  );
}