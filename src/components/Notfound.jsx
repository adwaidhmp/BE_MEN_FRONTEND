import { Link } from "react-router-dom";
import { Compass, Crown, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center border border-stone-200">
              <Compass className="w-12 h-12 text-stone-400" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Crown className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="font-serif text-4xl text-stone-900 mb-4">Page Not Found</h1>
        <p className="text-stone-600 text-lg mb-8 font-light leading-relaxed">
          The page you're looking for seems to have wandered off. Let's guide you back to timeless pieces.
        </p>

        {/* Action Button */}
        <Link
          to="/home"
          className="inline-flex items-center gap-3 bg-stone-900 text-amber-50 px-8 py-4 rounded-lg font-medium hover:bg-stone-800 transition-all border border-stone-900 group"
        >
          <span>Discover Collection</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          <p className="text-sm text-stone-500 font-light">
            Error 404 • The requested page could not be found
          </p>
        </div>
      </div>
    </div>
  );
}