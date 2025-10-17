import React from 'react';
import { Shield, Award, Heart, TrendingUp, Crown, ArrowRight } from 'lucide-react';

function Aboutus() {
  return (
    <div className="bg-amber-50 text-stone-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-stone-900 text-amber-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511895426322-d516a7451c5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative w-full px-6 py-24 text-center">
          <div className="inline-block border border-amber-200/30 px-6 py-2 rounded-full mb-6">
            <span className="text-amber-200 text-sm tracking-widest font-light">EST. 2024</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl tracking-wide">BE MEN</h1>
          </div>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto leading-relaxed font-light">
            Curated essentials with enduring character for the modern gentleman
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="w-full px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="font-serif text-3xl text-stone-900 mb-6">Our Heritage</h2>
            <p className="text-stone-600 text-lg mb-4 leading-relaxed font-light">
              <span className="font-serif text-amber-600">BE MEN</span> emerged from a simple belief: that true style is timeless, not trend-driven. We curate pieces with character that age with grace and purpose.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed font-light">
              Each item in our collection is chosen for its craftsmanship, materials, and ability to tell a story. We believe accessories should be investments, not just purchases—companions for life's journey.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-600/10 p-3 rounded-lg border border-amber-600/20">
                  <Shield className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-stone-900 mb-1">Enduring Quality</h3>
                  <p className="text-stone-500 font-light">Crafted to last generations, not seasons</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-600/10 p-3 rounded-lg border border-amber-600/20">
                  <TrendingUp className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-stone-900 mb-1">Timeless Design</h3>
                  <p className="text-stone-500 font-light">Styles that transcend passing trends</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-600/10 p-3 rounded-lg border border-amber-600/20">
                  <Award className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-stone-900 mb-1">Artisan Craft</h3>
                  <p className="text-stone-500 font-light">Meticulous attention to every detail</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Showcase */}
      <div className="bg-stone-100 py-20">
        <div className="w-full px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl text-stone-900 mb-4 text-center">The Collection</h2>
            <p className="text-stone-600 text-center mb-12 font-light">Essential pieces for the discerning gentleman</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Sunglasses', 'Watches', 'Perfumes', 'Caps', 'Leather Goods', 'Timepieces', 'Eyewear', 'Accessories'].map((item, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg bg-white border border-stone-200 p-6 hover:border-amber-600/50 transition-all duration-300 cursor-pointer text-center">
                  <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="relative font-medium text-stone-900 group-hover:text-amber-600 transition-colors">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="w-full px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl border border-stone-200 p-10">
            <div className="bg-amber-600/10 w-12 h-12 rounded-full flex items-center justify-center mb-6 border border-amber-600/20">
              <Heart className="text-amber-600" size={24} />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-4">Our Philosophy</h3>
            <p className="text-stone-600 leading-relaxed font-light">
              We believe in quality over quantity, character over conformity. Every piece we offer is selected for its ability to age gracefully and tell your unique story through years of wear.
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-stone-200 p-10">
            <div className="bg-stone-900/10 w-12 h-12 rounded-full flex items-center justify-center mb-6 border border-stone-900/20">
              <TrendingUp className="text-stone-900" size={24} />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-4">Our Commitment</h3>
            <p className="text-stone-600 leading-relaxed font-light">
              To provide gentlemen with accessories that stand the test of time. We're building a legacy of quality and craftsmanship that honors traditional techniques while embracing modern elegance.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-stone-900 text-amber-50 py-20">
        <div className="w-full px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl mb-6">Begin Your Journey</h2>
            <p className="text-amber-200/80 text-lg mb-8 font-light max-w-2xl mx-auto">
              Discover pieces that will become part of your story
            </p>
            <button 
              onClick={() => window.location.href = '/home'}
              className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-all border border-amber-600 hover:border-amber-700 group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="bg-stone-900 border-t border-stone-700 py-8 text-center">
        <div className="text-amber-200/50 text-sm font-light tracking-wide">
          © 2024 BE MEN COLLECTION. CRAFTED WITH INTENTION.
        </div>
      </div>
    </div>
  );
}

export default Aboutus;