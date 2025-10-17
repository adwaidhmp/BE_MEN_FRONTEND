import { Link } from "react-router-dom";
import { Shield, Crown, ArrowRight } from "lucide-react";

export default function NoAccess() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-stone-200 p-8 max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center border border-red-200">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="font-serif text-3xl text-stone-900 mb-4">Access Restricted</h1>
        <p className="text-stone-600 text-lg mb-6 font-light leading-relaxed">
          This area is reserved for authorized members only.
        </p>

        {/* Action Button */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 bg-stone-900 text-amber-50 px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-all border border-stone-900 group"
        >
          <span>Return to Collection</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-stone-200">
          <p className="text-sm text-stone-500 font-light">
            If you believe this is an error, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}