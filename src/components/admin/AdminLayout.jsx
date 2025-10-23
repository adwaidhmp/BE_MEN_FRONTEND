import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser, selectUser } from "../redux/slice/authSlice";
import { Crown, LogOut, Users, Package, ShoppingBag, MessageCircle, LayoutDashboard } from "lucide-react";

export default function AdminLayout() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      toast.error("Failed to logout");
      console.error(err);
    }
  };

  if (!user) return null;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/cancelled", label: "Cancelled", icon: MessageCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-amber-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-stone-900 text-amber-50 p-6 flex-shrink-0 lg:h-screen lg:sticky top-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-xl">Admin Panel</h1>
              <p className="text-xs text-amber-200/70 font-light">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-2">
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="flex flex-wrap gap-2 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? "bg-amber-600 text-white"
                        : "bg-stone-800 text-amber-100 hover:bg-stone-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all border border-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-amber-600 text-white shadow-lg"
                      : "text-amber-100 hover:bg-stone-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-amber-100 hover:bg-red-600 hover:text-white transition-all border border-stone-700 hover:border-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="hidden lg:block absolute bottom-6 left-6 right-6">
          <div className="text-center">
            <p className="text-xs text-amber-200/50 font-light tracking-wide">
              BE MEN ADMIN
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto lg:h-screen">
        <div className="bg-white rounded-xl border border-stone-200 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}