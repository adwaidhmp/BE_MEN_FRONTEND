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

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-stone-900/95 backdrop-blur-sm border-b border-stone-700 text-amber-50">
        <div className="w-full px-3 py-2"> {/* reduced horizontal padding on tiny screens */}
          {/* Use flex-wrap so items move to next line on very small widths.
              Use overflow-x-auto as graceful fallback if content is still wider. */}
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2 overflow-x-auto">
            {/* Brand - don't let it shrink too small */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center group-hover:bg-amber-700 transition-colors">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-serif text-xl tracking-wide">BE MEN</div>
                  <div className="text-xs text-amber-200/70 tracking-widest font-light">
                    COLLECTION
                  </div>
                </div>
              </Link>
            </div>

            {/* Icons / Links group - allow it to shrink and align to right */}
            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end min-w-0">
              {/* Left-side optional 'Collection' link hidden on tiniest screens if on /home */}
              {location.pathname !== "/home" && (
                <Link
                  to="/home"
                  className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
                >
                  <div className="p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors">
                    <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="hidden sm:inline font-medium text-sm">Collection</span>
                </Link>
              )}

              {/* Notifications */}
              <Link
                to="/notifications"
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
              >
                <div className="p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
              >
                <div className="p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {user && wishlist?.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-medium text-sm">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to={user ? "/cart" : "/login"}
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
              >
                <div className="p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors relative">
                  <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {user && cart?.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-medium text-sm">Cart</span>
              </Link>

              {/* About Us / Story */}
              <Link
                to="/about"
                className="flex items-center gap-2 hover:text-amber-200 transition-colors group relative flex-shrink-0"
              >
                <div className="p-2 rounded-lg group-hover:bg-stone-800/50 transition-colors">
                  <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <span className="hidden sm:inline font-medium text-sm">Story</span>
              </Link>

              {/* Divider (hide on very small screens) */}
              <div className="hidden md:block w-px h-6 bg-stone-700 mx-1" />

              {/* Profile / Login - keep these non-shrinking */}
              {user ? (
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 hover:text-amber-200 transition-colors group flex-shrink-0"
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center group-hover:from-stone-600 group-hover:to-stone-500 transition-all border border-stone-600">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:inline font-medium text-sm">Profile</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all border border-amber-600 hover:border-amber-700 group flex-shrink-0"
                >
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="h-0.5 bg-gradient-to-r from-amber-600/50 via-amber-400/30 to-amber-600/50"></div>
      </nav>

      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} profileRef={profileRef} />
      )}
    </>
  );
}

export default Navbar;
