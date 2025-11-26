import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Zap, ArrowLeft, Clock, Shield, Truck } from "lucide-react";

import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../redux/slice/wishlistSlice";

import { addToCart, fetchCart } from "../redux/slice/cartSlice";
import { selectUser } from "../redux/slice/authSlice";

function ProductDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const user = useSelector(selectUser);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);

  const [product, setProduct] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeImage] = useState(0);

  // Fetch product + cart + wishlist
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://bemen.duckdns.org/api/v1/user/products/${id}/`);
        const data = await res.json();

        setProduct({
          id: data.id,
          name: data.name,
          category: data.category,
          description: data.description,
          price: parseFloat(data.price),
          brand: data.brand,
          rating: data.rating,
          image: data.product_image || "",
          product_stock: data.product_stock,
          old_price: data.old_price,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    }

    fetchProduct();
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [id, dispatch]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mb-4"></div>
          <p className="text-stone-600 text-lg font-serif">Discovering timeless piece...</p>
        </div>
      </div>
    );
  }

  // Works for both array of IDs or array of product objects
  const isInWishlist = wishlist.some(
    (item) => item.product?.id === product.id || item.id === product.id
  );
  const isInCart = cart.some((item) => item.product.id === product.id);

  // Toggle wishlist
  const handleWishlist = () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
        .unwrap()
        .then(() => toast.info("Removed from collection"))
        .catch(() => toast.error("Failed to remove from collection"));
    } else {
      dispatch(addToWishlist(product.id))
        .unwrap()
        .then(() => toast.success("Added to collection"))
        .catch(() => toast.error("Failed to add to collection"));
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    if (!isInCart) {
      dispatch(addToCart({ productId: product.id, quantity: buyNowQuantity }))
        .unwrap()
        .then(() => toast.success("Added to cart"))
        .catch(() => toast.error("Failed to add to cart"));
    }
  };

  // Mock additional images for gallery
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-amber-50 py-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Collection</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-6 relative">
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-3 border border-stone-200 hover:border-stone-300 transition-all hover:scale-110"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isInWishlist ? "fill-rose-600 text-rose-600" : "text-stone-400 hover:text-rose-400"
                  }`}
                />
              </button>

              <div className="relative aspect-[4/5] bg-stone-50 rounded-lg overflow-hidden">
                {product.image && (
                  <img
                    src={productImages[activeImage]}
                    alt={product.name}
                    onLoad={() => setIsImageLoading(false)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      isImageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                )}
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
                  </div>
                )}
                
                {/* Stock Badge */}
                {product.product_stock <= 5 && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 text-xs font-medium border rounded-full backdrop-blur-sm ${
                      product.product_stock === 0 
                        ? "text-red-700 border-red-200 bg-white/80" 
                        : "text-amber-700 border-amber-200 bg-white/80"
                    }`}>
                      {product.product_stock === 0 ? "Out of Stock" : `Only ${product.product_stock} Left`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                    activeImage === index 
                      ? "border-stone-900 scale-105" 
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div> */}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-stone-200 p-6 lg:p-8">
              {/* Brand & Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-stone-500 uppercase tracking-wider font-medium">
                  {product.brand}
                </span>
                <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="font-serif text-3xl lg:text-4xl text-stone-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating
              {product.rating && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-amber-500 fill-current"
                            : "text-stone-300"
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-stone-500">({product.rating})</span>
                </div>
              )} */}

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-serif font-normal text-stone-900">
                    ${product.price}
                  </span>
                  {product.old_price && (
                    <>
                      <span className="text-xl text-stone-400 line-through">
                        ${product.old_price}
                      </span>
                      <span className="text-sm font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded">
                        Save {Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-serif font-normal text-stone-900 mb-4">
                  Story & Details
                </h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 text-stone-600">
                  <Truck className="w-5 h-5 text-stone-400" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-stone-600">
                  <Shield className="w-5 h-5 text-stone-400" />
                  <span className="text-sm">2-Year Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-stone-600">
                  <Clock className="w-5 h-5 text-stone-400" />
                  <span className="text-sm">Lifetime Service</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium text-stone-700">Quantity:</span>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    {/* Decrease quantity */}
                    <button
                      onClick={() => setBuyNowQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200"
                    >
                      -
                    </button>

                    <span className="px-4 py-1">{buyNowQuantity}</span>

                    {/* Increase quantity (max 3) */}
                    <button
                      onClick={() =>
                        setBuyNowQuantity(prev => Math.min(prev + 1, 3))
                      }
                      disabled={buyNowQuantity >= 3}
                      className={`px-3 py-1 bg-stone-100 hover:bg-stone-200 ${
                        buyNowQuantity >= 3 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isInCart ? (
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 flex items-center justify-center gap-3 bg-stone-900 text-amber-50 py-4 px-6 rounded-lg font-medium hover:bg-stone-800 transition-all border border-stone-900"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    View in Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.product_stock === 0}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-medium transition-all border ${
                      product.product_stock === 0
                        ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                        : "bg-stone-900 text-amber-50 hover:bg-stone-800 border-stone-900"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {product.product_stock === 0 ? "Out of Stock" : "Add to Collection"}
                  </button>
                )}

                <button
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        items: [
                          {
                            product,
                            quantity: buyNowQuantity,
                            price: product.price,
                          },
                        ],
                      },
                    })
                  }
                  disabled={product.product_stock === 0}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-medium transition-all border ${
                    product.product_stock === 0
                      ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700 border-amber-600"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h3 className="font-serif text-lg text-stone-900 mb-4">Heritage & Care</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
                <div>
                  <h4 className="font-medium text-stone-900 mb-2">Materials</h4>
                  <p>Premium materials crafted for enduring quality and timeless appeal.</p>
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-2">Care Instructions</h4>
                  <p>Gently clean with soft cloth. Store in original packaging when not in use.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;