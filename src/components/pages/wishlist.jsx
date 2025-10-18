import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Zap, Trash2, ArrowRight } from "lucide-react";

import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../redux/slice/wishlistSlice";
import { addToCart } from "../redux/slice/cartSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist, loading, error } = useSelector((state) => state.wishlist);
  const cart = useSelector((state) => state.cart?.cart || []);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleClearWishlist = () => {
    if (wishlist.length === 0) {
      toast.info("Wishlist is already empty");
      return;
    }
    dispatch(clearWishlist());
    toast.info("Wishlist cleared");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600 font-serif">Loading your collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-red-700 font-serif">{error}</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-stone-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-stone-900 mb-3">Your Collection Awaits</h2>
          <p className="text-stone-600 mb-8 font-light">
            Pieces you love will appear here. Start building your timeless collection.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 bg-stone-900 text-amber-50 px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-all"
          >
            Discover Pieces
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-12 px-4">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="font-serif text-3xl text-stone-900 mb-2">Your Collection</h1>
            <p className="text-stone-600 font-light">
              {wishlist.length} curated piece{wishlist.length !== 1 ? 's' : ''} you adore
            </p>
          </div>
          
          <button
            onClick={handleClearWishlist}
            className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-red-600 transition-colors border border-stone-300 rounded-lg hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Clear All</span>
          </button>
        </div>
        {console.log('Wishlist items:', wishlist)}
        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item.product;
            const isInCart = cart.some((c) => c.product.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={`http://127.0.0.1:8000${product.product_image}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromWishlist(product.id));
                      toast.info("Removed from collection");
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white border border-stone-200"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs text-stone-600 rounded-full font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-serif text-lg text-stone-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-500 font-light">{product.brand}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-serif font-normal text-stone-900">
                      ${product.price}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isInCart ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/cart");
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-amber-50 py-2.5 rounded-lg font-medium hover:bg-stone-800 transition-all text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        In Cart
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(addToCart({ productId: product.id, quantity: 1 }));
                          toast.success("Added to cart");
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white py-2.5 rounded-lg font-medium hover:bg-amber-700 transition-all text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/checkout", {
                          state: {
                            items: [
                              {
                                product,
                                quantity: 1,
                                price: product.price,
                              },
                            ],
                          },
                        });
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-amber-50 py-2.5 rounded-lg font-medium hover:bg-stone-800 transition-all text-sm"
                    >
                      <Zap className="w-4 h-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;