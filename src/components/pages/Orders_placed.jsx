import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Package, Truck, Home, ArrowRight, Crown } from "lucide-react";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, orderSummary } = location.state || {};
  const summary = orderSummary || order;
  const [countdown, setCountdown] = useState(10);

  const totalAmount =
  summary?.total_amount !== undefined
    ? summary.total_amount
    : summary?.amount
    ? summary.amount / 100
    : 0;


  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/home");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Success Animation & Heading - Centered */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-lg border border-amber-200">
                <CheckCircle
                  className="w-20 h-20 text-amber-600"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-amber-600" />
            <h1 className="font-serif text-4xl text-stone-900">
              Order Confirmed
            </h1>
          </div>
          <p className="text-lg text-stone-600 font-light">
            {summary?.message ||
              "Thank you for your purchase. Your collection is being prepared."}
          </p>
        </div>

        {/* Two Column Layout - Desktop, Stacked on Mobile */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Order Summary */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="bg-stone-50 rounded-lg p-6 border border-stone-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-amber-600" />
                  <h2 className="font-serif text-xl text-stone-900">
                    Order Summary
                  </h2>
                </div>
                <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                  CONFIRMED
                </span>
              </div>

              {summary && (
                <>
                  {/* Total Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-stone-200">
                      <p className="text-sm text-stone-500 mb-1 font-light">Total Amount</p>
                      <p className="text-2xl font-serif font-normal text-amber-600">
                        ₹{totalAmount}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-stone-200">
                      <p className="text-sm text-stone-500 mb-1 font-light">Total Orders</p>
                      <p className="text-2xl font-serif font-normal text-stone-900">
                        {summary.orders?.length || 1}
                      </p>
                    </div>
                  </div>

                  {/* Individual Orders */}
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {summary.orders?.map((o, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white border border-stone-200 rounded-lg hover:border-amber-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                            Order {index + 1}
                          </span>
                          <span className="text-lg font-serif font-normal text-stone-900">
                            ₹{o.amount}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-stone-500 mb-1 font-light">Product ID</p>
                            <p className="font-medium text-stone-900">#{o.product}</p>
                          </div>
                          <div>
                            <p className="text-xs text-stone-500 mb-1 font-light">Quantity</p>
                            <p className="font-medium text-stone-900">{o.quantity}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-stone-500 mb-1 font-light">Contact</p>
                            <p className="font-medium text-stone-900">{o.phone}</p>
                          </div>
                        </div>

                        {o.shipping_address && (
                          <div className="pt-3 border-t border-stone-200">
                            <p className="text-xs text-stone-500 mb-1 font-light">Shipping Address</p>
                            <p className="text-sm text-stone-900 font-light">{o.shipping_address}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - What's Next */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="bg-stone-50 rounded-lg p-6 h-full border border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6 text-amber-600" />
                What's Next?
              </h3>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-50 flex items-center justify-center text-lg font-medium flex-shrink-0 border border-stone-900">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">Email Confirmation</h4>
                    <p className="text-stone-600 font-light">
                      We'll send you a confirmation email with your order details
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-50 flex items-center justify-center text-lg font-medium flex-shrink-0 border border-stone-900">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">Order Processing</h4>
                    <p className="text-stone-600 font-light">
                      Your order will be processed and prepared for shipping
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-50 flex items-center justify-center text-lg font-medium flex-shrink-0 border border-stone-900">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">Track Your Order</h4>
                    <p className="text-stone-600 font-light">
                      Track your order status from your account dashboard
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full px-6 py-4 bg-stone-900 text-amber-50 rounded-lg font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group border border-stone-900"
                >
                  <Package className="w-5 h-5" />
                  View My Orders
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate("/home")}
                  className="w-full px-6 py-4 bg-white border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Redirect Notice - Bottom Center */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 border border-stone-200">
            <div className="w-3 h-3 bg-amber-600 rounded-full animate-pulse"></div>
            <p className="text-sm text-stone-600 font-light">
              Returning to collection in{" "}
              <span className="font-medium text-amber-600">{countdown}</span> seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;