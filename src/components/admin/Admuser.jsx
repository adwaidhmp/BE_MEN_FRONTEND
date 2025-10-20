import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Ban, CheckCircle, Users as UsersIcon, Eye, X, Crown, User, Mail, Phone, Shield } from "lucide-react";
import {
  fetchAdminUsers,
  banUnbanUser,
  fetchAdminUserDetail,
  clearSelectedUser,
  clearAdminUsersError,
} from "../redux/slice/adminSlice";

export default function Users() {
  const dispatch = useDispatch();

  const { data: users, loading, error, selectedUser } = useSelector(
    (state) => state.admin.users
  );

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  // Clear any errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearAdminUsersError());
      dispatch(clearSelectedUser());
    };
  }, [dispatch]);

  // Toggle Ban/Unban
  const handleBanToggle = (userId) => {
    dispatch(banUnbanUser(userId));
  };

  // Fetch user details (optional, for modal)
  const handleViewDetails = (userId) => {
    dispatch(fetchAdminUserDetail(userId));
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
          <UsersIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-stone-900">Manage Users</h2>
          <p className="text-stone-600 font-light">View and manage user accounts</p>
        </div>
      </div>

      {/* Status Messages - Only show error, no ban status */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-stone-600 font-serif">Loading users...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className={`bg-white rounded-xl border border-stone-200 overflow-hidden ${selectedUser ? 'blur-sm' : ''}`}>
        <table className="w-full">
          <thead className="bg-stone-900 text-amber-50">
            <tr>
              <th className="px-6 py-4 text-left font-medium">User</th>
              <th className="px-6 py-4 text-left font-medium">Contact</th>
              <th className="px-6 py-4 text-left font-medium">Status</th>
              <th className="px-6 py-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                      <User className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{user.name}</p>
                      <p className="text-sm text-stone-500 font-light">ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-stone-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-stone-400" />
                      {user.email}
                    </p>
                    {user.phone_number && (
                      <p className="text-sm text-stone-500 flex items-center gap-2">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {user.phone_number}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    user.is_banned 
                      ? "bg-red-100 text-red-700 border border-red-200" 
                      : "bg-green-100 text-green-700 border border-green-200"
                  }`}>
                    <Shield className="w-3 h-3" />
                    {user.is_banned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBanToggle(user.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all border ${
                        user.is_banned 
                          ? "bg-green-600 text-white border-green-600 hover:bg-green-700" 
                          : "bg-red-600 text-white border-red-600 hover:bg-red-700"
                      }`}
                    >
                      {user.is_banned ? (
                        <>
                          <CheckCircle size={14} />
                          Unban
                        </>
                      ) : (
                        <>
                          <Ban size={14} />
                          Ban
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleViewDetails(user.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm bg-stone-900 text-amber-50 hover:bg-stone-800 transition-all border border-stone-900"
                    >
                      <Eye size={14} />
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal - Layered on top */}
      {selectedUser && (
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xl w-full max-w-2xl mx-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-stone-900">User Details</h3>
                  <p className="text-sm text-stone-500 font-light">Complete user information</p>
                </div>
              </div>
              <button
                onClick={() => dispatch(clearSelectedUser())}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors hover:bg-stone-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                  <User className="w-8 h-8 text-stone-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900 text-lg">{selectedUser.name}</p>
                  <p className="text-sm text-stone-500">User ID: {selectedUser.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone-200">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-stone-500 font-light">Email</p>
                    <p className="text-stone-900 font-medium">{selectedUser.email}</p>
                  </div>
                </div>

                {selectedUser.phone_number && (
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone-200">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-stone-500 font-light">Phone</p>
                      <p className="text-stone-900 font-medium">{selectedUser.phone_number}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone-200">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-stone-500 font-light">Status</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium ${
                      selectedUser.is_banned 
                        ? "bg-red-100 text-red-700 border border-red-200" 
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}>
                      {selectedUser.is_banned ? "Banned" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-stone-200">
              <button
                onClick={() => handleBanToggle(selectedUser.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all border ${
                  selectedUser.is_banned 
                    ? "bg-green-600 text-white border-green-600 hover:bg-green-700" 
                    : "bg-red-600 text-white border-red-600 hover:bg-red-700"
                }`}
              >
                {selectedUser.is_banned ? (
                  <>
                    <CheckCircle size={16} />
                    Unban User
                  </>
                ) : (
                  <>
                    <Ban size={16} />
                    Ban User
                  </>
                )}
              </button>
              <button
                onClick={() => dispatch(clearSelectedUser())}
                className="flex-1 py-3 rounded-lg font-medium bg-stone-200 text-stone-700 hover:bg-stone-300 transition-all border border-stone-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}