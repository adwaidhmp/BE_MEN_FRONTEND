import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Folder, 
  X,
  AlertTriangle
} from "lucide-react";
import {
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../redux/slice/adminCategorySlice";

export default function Categories() {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const { 
    categories: categoriesState, 
    operation 
  } = useSelector((state) => state.adminCategory);

  const categories = categoriesState?.data?.results || [];

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  // Handle form operations
  const handleCreateCategory = (e) => {
    e.preventDefault();
    dispatch(createAdminCategory({ category: categoryName }));
    resetForm();
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    dispatch(updateAdminCategory({ 
      categoryId: editingCategory.id, 
      categoryData: { category: categoryName } 
    }));
    resetForm();
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteAdminCategory(categoryToDelete.id));
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.category);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
          <Folder className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-stone-900">Manage Categories</h2>
          <p className="text-stone-600 font-light">View and manage product categories</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-6 mb-6">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
    <div className="text-xs sm:text-sm text-stone-600">
      {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
    </div>
    <button
      onClick={handleAddNew}
      className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all text-sm sm:text-base w-full sm:w-auto"
    >
      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="sm:hidden">Add</span>
      <span className="hidden sm:inline">Add Category</span>
    </button>
  </div>
</div>

      {/* Operation Status Messages */}
      {operation.loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-700 font-medium">Processing...</p>
        </div>
      )}
      
      {operation.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700 font-medium">{operation.success}</p>
        </div>
      )}

      {operation.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{operation.error}</p>
        </div>
      )}

      {/* Loading State */}
      {categoriesState.loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-stone-600 font-serif">Loading categories...</p>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {!categoriesState.loading && categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <Folder className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-stone-900 mb-2">No Categories Found</h3>
          <p className="text-stone-600 font-light">No categories in the system yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-900 text-amber-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Category Name</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                        <Folder className="w-4 h-4 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{category.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all"
                      >
                        <Edit size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-all"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xl w-full max-w-md mx-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-stone-900">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors hover:bg-stone-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              <div className="p-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter category name"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-stone-200">
                <button
                  type="submit"
                  disabled={operation.loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all disabled:opacity-50"
                >
                  {operation.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {editingCategory ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-lg font-medium bg-stone-200 text-stone-700 hover:bg-stone-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xl w-full max-w-md mx-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-stone-900">Delete Category</h3>
                  <p className="text-sm text-stone-500 font-light">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={handleCancelDelete}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors hover:bg-stone-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 font-medium">
                  Are you sure you want to delete the category{" "}
                  <span className="font-bold">"{categoryToDelete?.category}"</span>?
                </p>
                <p className="text-red-600 text-sm mt-2">
                  This will permanently remove the category and cannot be recovered.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-stone-200">
              <button
                onClick={handleConfirmDelete}
                disabled={operation.loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {operation.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Category
                  </>
                )}
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-3 rounded-lg font-medium bg-stone-200 text-stone-700 hover:bg-stone-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}