import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  X, Edit2, Lock, ShoppingBag, Heart, ShoppingCart, LogOut,
  Eye, EyeOff, Save, XCircle, Crown
} from "lucide-react";
import { logoutUser, fetchUserProfile, updateUserProfile, changePassword } from "../redux/slice/authSlice"


function Profile({ onClose, profileRef }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [changePwd, setChangePwd] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await api.post("logout/");
      dispatch(logoutUser());
      navigate("/home");
      onClose();
    } catch (err) {
      console.error("Failed to logout:", err);
      toast.error("Logout failed");
    }
  };

  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || "",
      phone_number: user?.phone_number || "",
      profile_picture: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Name must be at least 2 characters").required("Name required"),
      phone_number: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required("Phone required"),
      profile_picture: Yup.mixed().nullable(),
    }),
    // inside Profile component profileFormik.onSubmit
    onSubmit: async (values) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone_number", values.phone_number);
    if (values.profile_picture) formData.append("profile_picture", values.profile_picture);

    // send via thunk and unwrap to get thrown payload on failure
    await dispatch(updateUserProfile(formData)).unwrap();

    // single success toast (component level)
    toast.success("Profile updated!");
    setIsEditing(false);
  } catch (errorPayloadOrErr) {
    // unwrap() usually throws the value passed to rejectWithValue
    // but if someone else throws a full error, handle both
    const serverData =
      // if unwrap threw payload directly
      errorPayloadOrErr ??
      // if a full axios/error object
      errorPayloadOrErr?.response?.data ??
      null;

    // Build messages array (same approach you used in signup)
    const messages = [];

    if (serverData && typeof serverData === "object") {
      Object.keys(serverData).forEach((key) => {
        const val = serverData[key];
        if (Array.isArray(val)) {
          val.forEach((v) => messages.push(`${key}: ${v}`));
        } else if (typeof val === "object" && val !== null) {
          messages.push(`${key}: ${JSON.stringify(val)}`);
        } else {
          messages.push(`${key}: ${val}`);
        }
      });
    } else if (typeof serverData === "string") {
      messages.push(serverData);
    } else {
      // fallback: if we got an Error object with message
      messages.push(errorPayloadOrErr?.message ?? "Failed to update profile");
    }

    // Toast each message (or join them into one string if you prefer single toast)
    messages.forEach((m) => toast.error(m));

    // Optionally set Formik field errors so the message appears inline
    if (serverData && typeof serverData === "object") {
      const fieldErrs = {};
      for (const key of Object.keys(serverData)) {
        const val = serverData[key];
        fieldErrs[key] = Array.isArray(val) ? val.join(" ") : String(val);
      }
      profileFormik.setErrors(fieldErrs);
    }

    console.error("Update profile failed:", errorPayloadOrErr);
  }
}

  });

  const passwordFormik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required("Current password is required"),
      new_password: Yup.string()
        .min(6, "New password must be at least 6 characters")
        .required("New password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("new_password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(
          changePassword({
            old_password: values.current_password,
            new_password: values.new_password,
          })
        ).unwrap();
        toast.success("Password changed successfully!");
        resetForm();
        setChangePwd(false);
      } catch (err) {
        console.error("Password change failed:", err);
        toast.error("Failed to change password");
      }
    },
  });

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>

      <div
        ref={profileRef}
        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-amber-50 border-l border-stone-200 shadow-2xl z-50 overflow-y-auto animate-slide-in-right"
      >
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 text-amber-50 px-6 py-4 flex items-center justify-between border-b border-stone-700 z-10 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-serif text-xl">Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-full animate-fade-in">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
          </div>
        ) : (
          user && (
            <div className="p-6">
              {/* Profile Header */}
              <div className="text-center mb-8 animate-scale-in">
                <div className="relative inline-block mb-4">
                  <img
                    src={
                      user.profile_picture ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s"
                    }
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-1">{user.name}</h3>
                <p className="text-sm text-stone-600 font-light">{user.email}</p>
              </div>

              {/* Edit / Change Password / Actions */}
              {isEditing ? (
                <div className="mb-6 animate-scale-in">
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h4 className="font-serif text-lg text-stone-900 mb-4 flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-amber-600" /> Edit Profile
                    </h4>
                    <form onSubmit={profileFormik.handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
                        <input
                          name="name"
                          value={profileFormik.values.name}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
                        />
                        {profileFormik.touched.name && profileFormik.errors.name && (
                          <p className="text-red-600 text-sm mt-1">{profileFormik.errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
                        <input
                          name="phone_number"
                          value={profileFormik.values.phone_number}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
                        />
                        {profileFormik.touched.phone_number && profileFormik.errors.phone_number && (
                          <p className="text-red-600 text-sm mt-1">{profileFormik.errors.phone_number}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Profile Picture</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            profileFormik.setFieldValue("profile_picture", e.currentTarget.files[0])
                          }
                          className="w-full text-sm text-stone-600"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 flex items-center justify-center gap-2 transition-all"
                        >
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-lg font-medium hover:bg-stone-300 flex items-center justify-center gap-2 transition-all"
                        >
                          <XCircle className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 animate-fade-in">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-stone-900 text-amber-50 py-3 rounded-lg font-medium hover:bg-stone-800 flex items-center justify-center gap-2 transition-all border border-stone-900"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={() => setChangePwd(!changePwd)}
                      className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 flex items-center justify-center gap-2 transition-all border border-amber-600"
                    >
                      <Lock className="w-4 h-4" /> {changePwd ? "Cancel" : "Change Password"}
                    </button>
                  </div>

                  {changePwd && (
                    <div className="mb-6 animate-scale-in">
                      <div className="bg-white rounded-xl border border-stone-200 p-6">
                        <h4 className="font-serif text-lg text-stone-900 mb-4 flex items-center gap-2">
                          <Lock className="w-5 h-5 text-amber-600" /> Change Password
                        </h4>
                        <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                          {["current", "new", "confirm"].map((field, i) => {
                            const show =
                              field === "current"
                                ? showCurrent
                                : field === "new"
                                  ? showNew
                                  : showConfirm;
                            const toggle =
                              field === "current"
                                ? setShowCurrent
                                : field === "new"
                                  ? setShowNew
                                  : setShowConfirm;

                            return (
                              <div key={i}>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                  {field === "current"
                                    ? "Current Password"
                                    : field === "new"
                                      ? "New Password"
                                      : "Confirm New Password"}
                                </label>
                                <div className="relative">
                                  <input
                                    name={`${field}_password`}
                                    type={show ? "text" : "password"}
                                    value={passwordFormik.values[`${field}_password`]}
                                    onChange={passwordFormik.handleChange}
                                    onBlur={passwordFormik.handleBlur}
                                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-12 bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => toggle(!show)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                                  >
                                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          <button
                            type="submit"
                            className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-all"
                          >
                            Update Password
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-6 animate-fade-in">
                    <Link
                      to="/orders"
                      onClick={onClose}
                      className="w-full bg-white border border-stone-300 text-stone-700 py-3 rounded-lg font-medium hover:bg-stone-50 flex items-center justify-center gap-2 transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" /> My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={onClose}
                      className="w-full bg-white border border-stone-300 text-stone-700 py-3 rounded-lg font-medium hover:bg-stone-50 flex items-center justify-center gap-2 transition-all"
                    >
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    <Link
                      to="/cart"
                      onClick={onClose}
                      className="w-full bg-white border border-stone-300 text-stone-700 py-3 rounded-lg font-medium hover:bg-stone-50 flex items-center justify-center gap-2 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Shopping Cart
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-stone-900 text-amber-50 py-3 rounded-lg font-medium hover:bg-stone-800 flex items-center justify-center gap-2 transition-all border border-stone-900 animate-fade-in"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Profile;