import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Profile from "../user/profile";
import { Heart, ShoppingCart, User, Home , Info, Crown, Bell } from "lucide-react";
import { selectNotifications } from "../redux/slice/NotificationSlice";

function Navbar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const notifications = useSelector(selectNotifications);

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Calculate unread notifications count
  const unreadCount = notifications?.filter(n => !n.read)?.length || 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  return (
    <>
      {/* Navbar: mobile-first -> bottom on small, top on md+ */}
      <nav
        className={`
          fixed inset-x-0 bottom-0 z-50 bg-stone-900/95 backdrop-blur-sm border-t border-stone-700 text-amber-50
          md:top-0 md:bottom-auto md:border-t-0 md:border-b
        `}
      >
        {/* Container: use justify-around for mobile so icons are evenly spaced,
            and switch to a more regular space-between on md+ */}
        <div className="w-full px-4 py-2 md:py-3">
          <div className="flex items-center justify-between md:justify-between">
            {/* Brand - hidden on small screens to save space */}
            <div className="hidden md:flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center group-hover:bg-amber-700 transition-colors">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-serif text-l tracking-wide">BE MEN</div>
                  <div className="text-xs text-amber-200/70 tracking-widest font-light">
                    COLLECTION
                  </div>
                </div>
              </Link>
            </div>

            {/* Nav links container.
                On small screens: make it take full width and distribute icons evenly.
                On md+: keep spacing between items and show labels as before. */}
            <div className="flex items-center w-full justify-around md:justify-end md:space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6">
              {/* Products */}
              {location.pathname !== "/home" && (
                <Link
                  to="/home"
                  className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative"
                >
                  <div className="p-3 md:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors">
                    <Home className="w-5 h-5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="hidden sm:inline font-medium text-sm"></span>
                </Link>
              )}

              {/* Notifications */}
              <Link
                to="/notifications"
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative"
              >
                <div className="p-3 md:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <Bell className="w-5 h-5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                  {user && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Wishlist */}
              <Link
                to={user ? "/wishlist" : "/login"}
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative"
              >
                <div className="p-3 md:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <Heart className="w-5 h-5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                  {user && wishlist?.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-medium text-sm"></span>
              </Link>

              {/* Cart */}
              <Link
                to={user ? "/cart" : "/login"}
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative"
              >
                <div className="p-3 md:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <ShoppingCart className="w-5 h-5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                  {user && cart?.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-medium text-sm"></span>
              </Link>

              {/* About Us */}
              <Link
                to="/about"
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative"
              >
                <div className="p-3 md:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors">
                  <Info className="w-5 h-5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                </div>
                <span className="hidden sm:inline font-medium text-sm"></span>
              </Link>

              {/* Divider for md+ */}
              <div className="hidden md:block w-px h-6 bg-stone-700"></div>

              {/* Profile or Login */}
              {user ? (
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 hover:text-amber-200 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center group-hover:from-stone-600 group-hover:to-stone-500 transition-all border border-stone-600">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:inline font-medium text-sm"></span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all border border-amber-600 hover:border-amber-700 group"
                >
                  <span className="text-xs">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Accent: gradient bar for top layout (md+) and a subtle separator for mobile.
            We render two variants and control visibility with responsive utilities. */}
        {/* Mobile: thin separator (visible on small) */}
        <div className="block md:hidden h-px bg-stone-700/60" />

        {/* Desktop: fancier gradient bar under the top nav (visible on md+) */}
        <div className="hidden md:block h-0.5 bg-gradient-to-r from-amber-600/50 via-amber-400/30 to-amber-600/50" />
      </nav>

      {/* Profile Modal */}
      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} profileRef={profileRef} />
      )}
    </>
  );
}

export default Navbar;
