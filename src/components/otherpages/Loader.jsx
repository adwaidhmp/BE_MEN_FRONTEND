import { Crown } from "lucide-react";

function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-amber-50 z-50 flex items-center justify-center animate-fadeOut">
      <div className="text-center">
        {/* Animated Crown Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center animate-pulse">
              <Crown className="w-8 h-8 text-white" />
            </div>
            {/* Pulsing Ring Effect */}
            <div className="absolute inset-0 rounded-full border-2 border-amber-600 animate-ping opacity-20"></div>
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-stone-900 tracking-wide animate-pulse">BE MEN</h1>
          <div className="text-xs text-stone-600 tracking-widest font-light">LOADING COLLECTION</div>
        </div>

        {/* Progress Bar - Using gradient animation */}
        <div className="mt-8 w-32 h-0.5 bg-stone-200 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-amber-600 to-transparent animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;