import { Link } from "react-router-dom";
import { ArrowRight, Crown } from "lucide-react";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Landing() {
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

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>

      <Footer/>
    </div>
  );
}