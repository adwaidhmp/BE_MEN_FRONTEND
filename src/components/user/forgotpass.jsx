import { useState } from "react";
import { toast } from "react-toastify";
import { Mail, ArrowRight, Crown } from "lucide-react";
import api from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("forgot-password/", { email });
      toast.success(res.data.message || "Check your email for reset link!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-serif text-xl text-stone-900">BE MEN</div>
              <div className="text-xs text-stone-600 tracking-widest font-light">COLLECTION</div>
            </div>
          </div>
          <h1 className="font-serif text-3xl text-stone-900 mb-2">Reset Password</h1>
          <p className="text-stone-600 font-light">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-stone-200 p-6 space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white placeholder-stone-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all disabled:bg-stone-400 disabled:cursor-not-allowed border border-amber-600 disabled:border-stone-400 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-stone-500 font-light">
            We'll send you a link to reset your password. Check your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;