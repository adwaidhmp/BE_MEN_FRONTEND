import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff, Crown, ArrowRight } from "lucide-react";
import api from "../api";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().min(2).required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string().min(6).required("Password is required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    profile_picture: Yup.mixed()
      .nullable() 
      .test(
        "fileSize",
        "File too large (max 5MB)",
        (value) => !value || (value && value.size <= 5 * 1024 * 1024)
      )
      .test(
        "fileType",
        "Unsupported format (only JPG, JPEG, PNG)",
        (value) =>
          !value ||
          (value &&
            ["image/jpg", "image/jpeg", "image/png"].includes(value.type))
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      password2: "",
      profile_picture: null,
    },
    validationSchema,
    onSubmit: async (values) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone_number", values.phone_number);
    formData.append("password", values.password);
    formData.append("password2", values.password2);

    // Only append profile_picture if a file was selected
    if (values.profile_picture) {
      formData.append("profile_picture", values.profile_picture);
    }

    // Debug: show what you are actually sending
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    await api.post("signup/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    toast.success("Signed up successfully");
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Signup error response:", error.response?.data ?? error);

    // If server responded with a validation object (e.g. { email: [...], password: [...], non_field_errors: [...] })
    const data = error.response?.data;
    if (data && typeof data === "object") {
      // Build a user-friendly combined message
      const messages = [];

      // If DRF returns field: [msg1, msg2], or field: "msg"
      Object.keys(data).forEach((key) => {
        const val = data[key];
        if (Array.isArray(val)) {
          val.forEach((v) => messages.push(`${key}: ${v}`));
        } else if (typeof val === "object" && val !== null) {
          // nested object (rare), stringify small messages
          messages.push(`${key}: ${JSON.stringify(val)}`);
        } else {
          messages.push(`${key}: ${val}`);
        }
      });

      // Show all messages as individual toasts (or join into one)
      messages.forEach((m) => toast.error(m));
    } else {
      // fallback
      toast.error("Signup failed");
    }
  }
},
  });

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
      
      <div className="min-h-screen flex bg-amber-50">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-stone-900 items-center justify-center p-12 animate-slide-in-left">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="w-40 h-40 mx-auto bg-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-white mx-auto mb-2" />
                  <span className="text-2xl font-serif text-white tracking-wide">BE MEN</span>
                </div>
              </div>
            </div>
            <h1 className="font-serif text-4xl text-amber-50 mb-4">Join the Collection</h1>
            <p className="text-amber-200/80 text-lg font-light leading-relaxed">
              Begin your journey with timeless pieces crafted for the modern gentleman
            </p>
            <div className="mt-8 text-amber-200/60 text-sm font-light tracking-wide">
              WATCHES • SUNGLASSES • PERFUMES • ACCESSORIES
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-amber-50 animate-slide-in-right">
          <div className="max-w-2xl w-full">
            <div className="mb-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4 lg:hidden">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-serif text-xl text-stone-900">BE MEN</div>
                  <div className="text-xs text-stone-600 tracking-widest font-light">COLLECTION</div>
                </div>
              </div>
              <h2 className="font-serif text-3xl text-stone-900 mb-2">
                Create Your Account
              </h2>
              <p className="text-stone-600 font-light">
                Already part of our collection?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6 animate-fade-in-up">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-lg bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="John Doe"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-lg bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="you@example.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone & Profile Picture */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-stone-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    autoComplete="tel"
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-lg bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="1234567890"
                  />
                  {formik.touched.phone_number && formik.errors.phone_number && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.phone_number}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="profile_picture" className="block text-sm font-medium text-stone-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    id="profile_picture"
                    name="profile_picture"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) =>
                      formik.setFieldValue("profile_picture", e.currentTarget.files[0])
                    }
                    className="block w-full px-4 py-3 text-sm text-stone-900 border border-stone-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                  {formik.touched.profile_picture && formik.errors.profile_picture && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.profile_picture}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-lg bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password2" className="block text-sm font-medium text-stone-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="password2"
                      name="password2"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={formik.values.password2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-lg bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password2 && formik.errors.password2 && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.password2}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all group"
                >
                  <span>Join the Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;