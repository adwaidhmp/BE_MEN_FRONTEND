import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Profile from "../user/profile";
import { Heart, ShoppingCart, User, ShoppingBag, Info, Crown, Bell } from "lucide-react";
import { selectNotifications } from "../redux/slice/NotificationSlice";

function Navbar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const notifications = useSelector(selectNotifications);

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const unreadCount = notifications?.filter(n => !n.read)?.length || 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    if (showProfile) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-stone-900/95 backdrop-blur-sm border-b border-stone-700 text-amber-50">
        <div className="w-full px-2 sm:px-4 py-2"> {/* smaller horizontal padding on tiny screens */}
          {/* Container allows wrap/scroll on tiny screens */}
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-1 sm:gap-3 overflow-x-auto">
            {/* Brand: don't let it shrink too much */}
            <div className="flex items-center flex-shrink-0 gap-2 min-w-0">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center group-hover:bg-amber-700 transition-colors">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-serif text-lg md:text-xl tracking-wide truncate">BE MEN</div>
                  <div className="text-xs text-amber-200/70 tracking-widest font-light hidden md:block">
                    COLLECTION
                  </div>
                </div>
              </Link>
            </div>

            {/* Icons group: will shrink as needed; each button is non-shrinking */}
            <div className="flex items-center gap-1 sm:gap-3 flex-1 justify-end min-w-0">
              {location.pathname !== "/home" && (
                <Link
                  to="/home"
                  className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
                  aria-label="Collection"
                >
                  <div className="p-2 sm:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium">Collection</span>
                </Link>
              )}

              <Link
                to="/notifications"
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
                aria-label="Notifications"
              >
                <div className="p-2 sm:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <Bell className="w-4 h-4" />
                  {user && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>

              <Link
                to={user ? "/wishlist" : "/login"}
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
                aria-label="Wishlist"
              >
                <div className="p-2 sm:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <Heart className="w-4 h-4" />
                  {user && wishlist?.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-sm font-medium">Wishlist</span>
              </Link>

              <Link
                to={user ? "/cart" : "/login"}
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
                aria-label="Cart"
              >
                <div className="p-2 sm:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <ShoppingCart className="w-4 h-4" />
                  {user && cart?.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-sm font-medium">Cart</span>
              </Link>

              <Link
                to="/about"
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
                aria-label="About"
              >
                <div className="p-2 sm:p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors">
                  <Info className="w-4 h-4" />
                </div>
                <span className="hidden md:inline text-sm font-medium">Story</span>
              </Link>

              <div className="hidden md:block w-px h-6 bg-stone-700 mx-2" />

              {user ? (
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 hover:text-amber-200 transition-colors group flex-shrink-0"
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center transition-all border border-stone-600">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">Profile</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all border border-amber-600 hover:border-amber-700 group flex-shrink-0"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm hidden md:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* bottom accent */}
        <div className="h-0.5 bg-gradient-to-r from-amber-600/50 via-amber-400/30 to-amber-600/50"></div>
      </nav>

      {showProfile && <Profile onClose={() => setShowProfile(false)} profileRef={profileRef} />}
    </>
  );
}

export default Navbar;
