import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { fetchCart, removeFromCart, updateQuantity, clearCart } from "../redux/slice/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch,]);

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-stone-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-stone-900 mb-3">Your Cart Awaits</h2>
          <p className="text-stone-600 mb-8 font-light">
            Timeless pieces you've selected will appear here. Begin your collection journey.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 bg-stone-900 text-amber-50 px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-all"
          >
            Discover Collection
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-12">
      <div className="w-full px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-stone-900 mb-2">Your Collection</h1>
          <p className="text-stone-600 font-light">
            {cart.length} curated piece{cart.length !== 1 ? 's' : ''} awaiting your decision
          </p>
        </div>
        {console.log('Cart items:', cart)}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cart.map((item) => {
                const product = item.product;
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

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs text-stone-600 rounded-full font-medium">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-4">
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

                      {/* Quantity Controls & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.quantity > 1) { // Prevent reducing below 1
                                dispatch(updateQuantity({ productId: product.id, quantity: -1 }));
                              }
                            }}
                            disabled={item.quantity === 1} // optional: disable at 1
                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${item.quantity === 1 ? "text-stone-300 cursor-not-allowed" : "hover:bg-stone-100"
                              }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium text-stone-900 min-w-8 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(updateQuantity({ productId: product.id, quantity: 1 }));
                            }}
                            className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(removeFromCart(product.id));
                              toast.error("Removed from collection");
                            }}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {product.product_stock === 0 ? (
                            <button
                              disabled
                              className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm font-medium cursor-not-allowed"
                            >
                              Out of Stock
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/checkout", {
                                  state: {
                                    items: [
                                      {
                                        product,
                                        quantity: item.quantity,
                                        price: product.price,
                                      },
                                    ],
                                  },
                                });
                              }}
                              className="px-4 py-2 bg-stone-900 text-amber-50 rounded-lg text-sm font-medium hover:bg-stone-800 transition-all"
                            >
                              Buy Now
                            </button>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-24">
              <h2 className="font-serif text-xl text-stone-900 mb-6 text-center">Collection Summary</h2>

              {/* Items List */}
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-900 font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-stone-500 text-xs">
                        Qty: {item.quantity} × ${item.product.price}
                      </p>
                    </div>
                    <span className="text-stone-900 font-medium whitespace-nowrap ml-4">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-stone-200 my-4"></div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-serif text-lg text-stone-900">Total:</span>
                <span className="font-serif text-xl text-stone-900">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        items: cart.map((c) => ({
                          product: c.product,
                          quantity: c.quantity,
                          price: c.product?.price || 0,
                        })),
                      },
                    })
                  }
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-all"
                >
                  Buy All Pieces
                </button>

                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full flex items-center justify-center gap-2 py-3 text-stone-600 hover:text-red-600 transition-colors border border-stone-300 rounded-lg hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;