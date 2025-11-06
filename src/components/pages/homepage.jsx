import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, Clock, ArrowRight } from "lucide-react";
import Footer from "../otherpages/footer";
import { addToCart, fetchCart } from "../redux/slice/cartSlice";
import { toast } from "react-toastify";

function Homepage() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceSort, setPriceSort] = useState("normal");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { cart } = useSelector((state) => state.cart);

  const categories = [
    { value: "all", label: "All Products" },
    { value: "sunglass", label: "Sunglasses" },
    { value: "watch", label: "Watches" },
    { value: "perfume", label: "Perfumes" },
    { value: "cap", label: "Caps" },
    { value: "wallet", label: "Wallets" },
  ];

  const getStockDisplay = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-700 border-red-200" };
    if (stock === 1) return { text: "Last One", color: "text-amber-700 border-amber-200" };
    if (stock <= 5) return { text: `Few Left`, color: "text-amber-700 border-amber-200" };
    return { text: "In Stock", color: "text-green-700 border-green-200" };
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    const inCart = cart.find((item) => item.product.id === product.id);
    const quantity = inCart ? inCart.quantity + 1 : 1;
    dispatch(addToCart({ productId: product.id, quantity }));
    toast.success(`${product.name} added to cart`);
  };

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      setIsLoaded(false);
      try {
        let url = `https://bemen.duckdns.org/api/v1/user/products/?page=${currentPage}`;
        if (selectedCategory !== "all") url += `&category=${selectedCategory}`;
        if (searchQuery.trim()) url += `&search=${searchQuery}`;
        if (priceSort === "low-high") url += `&ordering=price`;
        else if (priceSort === "high-low") url += `&ordering=-price`;


        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.results);
        setTotalPages(data.total_pages);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
    dispatch(fetchCart());
  }, [currentPage, selectedCategory, priceSort, searchQuery, dispatch]);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="relative bg-stone-900 text-amber-50 py-24 px-4 mt-14 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511895426322-d516a7451c5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block border border-amber-200/30 px-6 py-2 rounded-full mb-6">
            <span className="text-amber-200 text-sm tracking-widest font-light">EST. 2024</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-normal mb-6 tracking-tight">BE MEN</h1>
          <p className="text-lg text-amber-200/80 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            Curated essentials with enduring character. Discover pieces that tell a story.
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Discover timeless pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-stone-800/50 backdrop-blur-sm border border-stone-600/30 rounded-lg text-amber-50 placeholder-stone-400 focus:outline-none focus:border-amber-400/50 transition-colors font-light"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-8xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:border-stone-400 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => { setSelectedCategory(cat.value); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.value
                      ? "bg-stone-900 text-amber-50"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <select
            onChange={(e) => { setPriceSort(e.target.value); setCurrentPage(1); }}
            value={priceSort}
            className="px-4 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-stone-500 text-sm font-medium"
          >
            <option value="normal">Sort</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {showFilters && (
          <div className="md:hidden bg-white rounded-lg border border-stone-200 p-4 mb-8">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => { setSelectedCategory(cat.value); setCurrentPage(1); }}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${selectedCategory === cat.value
                      ? "bg-stone-900 text-amber-50"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isLoaded && products.length === 0 ? (
          <div className="text-center py-24 ">
            <h3 className="text-xl font-serif font-normal text-stone-900 mb-2">No pieces found</h3>
            <p className="text-stone-600 max-w-md mx-auto">
              Try adjusting your search or filters to discover our collection
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {products.map((product) => {
              const stockInfo = getStockDisplay(product.product_stock);
              const isInCart = cart.find((item) => item.product.id === product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group relative bg-white rounded-lg border border-stone-200 hover:border-stone-300 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative overflow-hidden bg-stone-100">
                    <div className="aspect-[4/5] relative">
                      <img
                        src={product.product_image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium border rounded-full backdrop-blur-sm ${stockInfo.color}`}>
                          {stockInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                        {product.category}
                      </span>
                      {product.old_price && (
                        <span className="text-xs text-stone-400 line-through">${product.old_price}</span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg text-stone-900 mb-3 leading-tight line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-serif font-normal text-stone-900">
                        ${product.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isInCart) {
                            navigate("/cart"); // always go to cart if in cart
                          } else if (product.product_stock === 0) {
                            toast.info("This product is currently out of stock."); // optional
                          } else {
                            handleAddToCart(product);
                          }
                        }}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isInCart
                            ? "bg-stone-900 text-amber-50 hover:bg-stone-800"
                            : product.product_stock === 0
                              ? "bg-stone-100 text-stone-400"
                              : "bg-amber-600 text-white hover:bg-amber-700"
                          }`}
                      >
                        {isInCart ? (
                          <>
                            <Clock className="w-4 h-4" />
                            In Cart
                          </>
                        ) : product.product_stock === 0 ? (
                          "Out of Stock"
                        ) : (
                          <>
                            Add to Cart
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${currentPage === i + 1
                  ? "bg-stone-900 text-amber-50"
                  : "bg-white text-stone-900 hover:bg-stone-100"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Homepage;
