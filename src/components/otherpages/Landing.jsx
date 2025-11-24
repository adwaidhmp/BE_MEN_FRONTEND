import { Link } from "react-router-dom";
import { ArrowRight, Crown } from "lucide-react";
import Footer from "./footer";
import { useState, useEffect } from "react";

export default function Landing() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch('https://bemen.duckdns.org/api/v1/user/products/?ordering=-created_at&page_size=5');
      const data = await response.json();
      setNewArrivals(data.results || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 font-sans">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Vintage Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511895426322-d516a7451c5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800/95 to-stone-900"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Establishment Badge */}
          <div className="inline-block border border-amber-200/30 px-6 py-2 rounded-full mb-8">
            <span className="text-amber-200 text-sm tracking-widest font-light">EST. 2024</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-amber-50 mb-6 tracking-tight leading-tight">
            BE MEN
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-amber-200/80 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Timeless style for the modern gentleman. Discover pieces with character and heritage.
          </p>

          {/* CTA Button */}
          <Link
            to="/home"
            className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-all border border-amber-600 hover:border-amber-700 group"
          >
            <span>Discover Collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </div>

      {/* New Arrivals Section */}
      <div className="py-16 px-6 bg-amber-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Discover our latest additions, carefully curated for the modern gentleman
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-stone-600">Loading new arrivals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {newArrivals.map((product) => (
                <div key={product.id} className="group">
                  {/* Product Image */}
                  <div className="aspect-square bg-stone-100 rounded-lg mb-4 overflow-hidden relative">
                    {product.product_image ? (
                      <img 
                        src={product.product_image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        No Image
                      </div>
                    )}
                    {/* New Badge */}
                    <div className="absolute top-3 left-3 bg-amber-600 text-white px-2 py-1 rounded text-xs font-medium">
                      NEW
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-900 font-semibold">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 border border-stone-900 text-stone-900 px-6 py-3 rounded-lg font-medium hover:bg-stone-900 hover:text-amber-50 transition-all"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>

      <Footer/>
    </div>
  );
}