import './App.css'
import { Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from './components/otherpages/Loader';
import Navbar from './components/otherpages/navbar'
import Aboutus from './components/otherpages/aboutus'
import ProductDetails from './components/pages/ProductDetails'
import Wishlist from './components/pages/wishlist';
import Cart from './components/pages/cart';
import Login from './components/user/login'
import Profile from './components/user/profile'
import Signup from './components/user/signup'
import LoginRoute from './components/Routes/Loginroute'
import ProtectedRoute from './components/Routes/protectedroutes'
import Contact from './components/contact'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from './components/Routes/AdminRoute'
import NotFound from './components/Notfound'
import Landing from './components/otherpages/Landing'
import ForgotPassword from './components/user/forgotpass';
import ResetPassword from './components/user/resetpass';
import CheckoutPage from './components/pages/Checkout';
import OrderSuccess from './components/pages/Orders_placed';
import OrdersPage from './components/pages/Order';
import OrderDetailPage from './components/pages/order_Details';
import { fetchCart } from "./components/redux/slice/cartSlice";
import { fetchWishlist } from "./components/redux/slice/wishlistSlice";

const Homepage = lazy(() => import('./components/pages/homepage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const Users = lazy(() => import('./components/admin/Admuser'));
const AdmOrders = lazy(() => import('./components/admin/Admorders'));
const Products = lazy(() => import('./components/admin/Admproducts'));
const Feedback = lazy(() => import('./components/admin/Feedback'));

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // 🟡 FIX: refetch wishlist & cart after login or page refresh
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]);

  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="!bg-black !text-white font-medium rounded-full shadow-md p-3"
        bodyClassName="text-white"
      />
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<Loader />}>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </Suspense>
          }
        >
          <Route index element={<Suspense fallback={<Loader />}><Dashboard /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<Loader />}><Users /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<Loader />}><AdmOrders /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<Loader />}><Products /></Suspense>} />
          <Route path="feedback" element={<Suspense fallback={<Loader />}><Feedback /></Suspense>} />
        </Route>

        {/* USER ROUTES */}
        <Route path="/signup" element={<LoginRoute><Signup /></LoginRoute>} />
        <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        <Route path="/home" element={<Suspense fallback={<Loader />}><Homepage /></Suspense>} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/order_detail/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

        {/* GENERAL ROUTES */}
        <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </>
  );
}

export default App;
