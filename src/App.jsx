import './App.css'
import { Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense, } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from './components/otherpages/Loader';
import Navbar from './components/otherpages/navbar'
import Wishlist from './components/pages/wishlist';
import Cart from './components/pages/cart';

import Landing from './components/otherpages/Landing'
import NotificationComponent from './components/user/notification';

import LoginRoute from './components/Routes/Loginroute'
import ProtectedRoute from './components/Routes/protectedroutes'
import AdminRoute from './components/Routes/AdminRoute'

const Aboutus = lazy(() => import('./components/otherpages/aboutus'));
const ProductDetails = lazy(() => import('./components/pages/ProductDetails'));
const Login = lazy(() => import('./components/user/login'));
const Profile = lazy(() => import('./components/user/profile'));
const Signup = lazy(() => import('./components/user/signup'));
const NotFound = lazy(() => import('./components/Notfound'));
const ForgotPassword = lazy(() => import('./components/user/forgotpass'));
const ResetPassword = lazy(() => import('./components/user/resetpass'));
const CheckoutPage = lazy(() => import('./components/pages/Checkout'));
const OrderSuccess = lazy(() => import('./components/pages/Orders_placed'));
const OrdersPage = lazy(() => import('./components/pages/Order'));
const OrderDetailPage = lazy(() => import('./components/pages/order_Details'));
const Homepage = lazy(() => import('./components/pages/homepage'));

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const Users = lazy(() => import('./components/admin/Admuser'));
const AdmOrders = lazy(() => import('./components/admin/Admorders'));
const Products = lazy(() => import('./components/admin/Admproducts'));
const CancelledOrdersPage = lazy(()=>import('./components/admin/CancelledOrder')) 
// import { useEffect } from "react";
// import { useDispatch} from "react-redux";
// import { fetchCart} from "./components/redux/slice/cartSlice"
// import {fetchWishlist} from "./components/redux/slice/wishlistSlice"
// import {fetchNotifications } from "./components/redux/slice/NotificationSlice"
// import { selectUser } from "./components/redux/slice/authSlice";
// import { useSelector } from "react-redux";

function App() {
  // const dispatch = useDispatch();
  // const user = useSelector(selectUser);

  // useEffect(() => {
  //   if (user) {
  //     const fetchData = async () => {
  //       await dispatch(fetchCart());
  //       await dispatch(fetchWishlist());
  //       await dispatch(fetchNotifications());
  //     };
  //     fetchData();
  //   }
  // }, [dispatch, user]);

  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
          toastClassName={() =>
            "!bg-[#111] !text-white !rounded-xl !shadow-lg !border !border-amber-500/40 backdrop-blur-md p-4 flex items-center space-x-2 transition-all duration-300 hover:scale-[1.02]"
          }
          bodyClassName={() => "!text-sm tracking-wide font-medium"}
          progressClassName="!bg-amber-500"
          icon={false}
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
          <Route path="cancelled" element={<Suspense fallback={<Loader />}><CancelledOrdersPage /></Suspense>} />
        </Route>

        {/* USER ROUTES */}
        <Route path="/signup" element={<LoginRoute><Signup /></LoginRoute>} />
        <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        <Route path="/home" element={<Suspense fallback={<Loader />}><Homepage /></Suspense>} />
        <Route path="/product/:id" element={<ProductDetails />}/>
        <Route path="/notifications" element={<ProtectedRoute><NotificationComponent /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/order_detail/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

        {/* GENERAL ROUTES */}
        <Route path="/about" element={<Aboutus />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </>
  );
}

export default App;
