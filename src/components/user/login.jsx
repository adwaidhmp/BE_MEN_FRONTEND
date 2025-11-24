import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff, Crown, ArrowRight, ArrowLeft } from "lucide-react"; // Added ArrowLeft
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice/authSlice";
import api from "../api";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await api.post("login/",
          { email: values.email, password: values.password },
          { withCredentials: true }
        );

        const user = res.data.user || res.data;
        dispatch(setUser(user));

        toast.success("Welcome back!");
        navigate(user?.is_staff ? "/admin" : "/home", { replace: true });
      } catch (error) {
        console.error(error.response?.data || error);
        toast.error(error.response?.data?.detail || "Login failed");
      }
    }
  });

  return (
    <>
      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-left { animation: fadeInLeft 0.8s ease-out forwards; }
        .animate-slide-right { animation: fadeInRight 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
      `}</style>

      <div className="min-h-screen w-full flex bg-amber-50 overflow-hidden">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-amber-50 animate-slide-left">
          <div className="max-w-md w-full">
            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6 transition-colors group animate-fade-in-up"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>

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
              <h2 className="font-serif text-3xl text-stone-900 mb-2">Welcome Back</h2>
              <p className="text-stone-600 font-light">
                New to our collection?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Create an account
                </button>
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6 animate-fade-in-up">
              {/* Email */}
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-lg bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-12"
                    placeholder="Enter your password"
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

              {/* Remember me / Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(),
                      navigate("/forgot-password")}}
                    className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all group"
              >
                <span>Enter Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-stone-900 items-center justify-center p-12 animate-slide-right">
          <div className="max-w-md text-center">
            {/* Back Button for larger screens */}
            <button
              onClick={() => navigate("/")}
              className="absolute top-8 left-8 flex items-center gap-2 text-amber-200/80 hover:text-amber-50 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
            
            <div className="mb-8">
              <div className="w-40 h-40 mx-auto bg-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-white mx-auto mb-2" />
                  <span className="text-2xl font-serif text-white tracking-wide">BE MEN</span>
                </div>
              </div>
            </div>
            <h1 className="font-serif text-4xl text-amber-50 mb-4">Welcome Back</h1>
            <p className="text-amber-200/80 text-lg font-light leading-relaxed">
              Continue your journey with timeless pieces crafted for the modern gentleman
            </p>
            <div className="mt-8 text-amber-200/60 text-sm font-light tracking-wide">
              WATCHES • SUNGLASSES • PERFUMES • ACCESSORIES
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;