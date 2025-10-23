import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCancelledOrders } from "../redux/slice/adminOrderSlice";
import {
  Package,
  XCircle,
  Calendar,
  User,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";

const CancelledOrdersPage = () => {
  const dispatch = useDispatch();
  const { loading, cancelled, error } = useSelector(
    (state) => state.adminOrders
  );

  useEffect(() => {
    dispatch(fetchCancelledOrders());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600 font-serif">
            Loading cancelled orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-stone-900 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-stone-600 mb-6 font-light">{error}</p>
          <button
            onClick={() => dispatch(fetchCancelledOrders())}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-6  pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-stone-900">
              Cancelled Orders
            </h2>
            <p className="text-stone-600 font-light">
              Review and manage cancelled orders
            </p>
          </div>
        </div>

        {/* Orders List */}
        {cancelled.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-stone-900 mb-2">
              No Cancelled Orders
            </h3>
            <p className="text-stone-600 font-light">
              All orders are currently active and processing
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cancelled.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-stone-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-stone-900">
                          Order #{order.id}
                        </h3>
                      </div>
                      {order.cancelled_at && (
                        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full inline-block">
                          {getTimeAgo(order.cancelled_at)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium border border-red-200 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Cancelled
                      </span>
                      <span className="font-serif text-xl text-stone-900">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Information */}
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <img
                          src={`http://127.0.0.1:8000${
                            order.product?.product_image || ""
                          }`}
                          alt={order.product?.name}
                          className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-900 mb-2">
                            {order.product?.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-stone-600 mb-3">
                            <span className="capitalize">
                              {order.product?.category}
                            </span>
                            <span>•</span>
                            <span>Quantity: {order.quantity}</span>
                          </div>
                        </div>
                      </div>

                      {/* Cancellation Reason */}
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <h5 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          Cancellation Reason
                        </h5>
                        {order.cancellation_reason ? (
                          <p className="text-red-700 text-sm leading-relaxed">
                            {order.cancellation_reason}
                          </p>
                        ) : (
                          <p className="text-red-500 text-sm italic">
                            No reason provided
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                        <h5 className="font-medium text-stone-900 mb-3 flex items-center gap-1">
                          <User className="w-4 h-4 text-amber-600" />
                          Customer Details
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-stone-400" />
                            <span className="text-stone-600">
                              {order.user?.name || "Unknown User"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-stone-400" />
                            <span className="text-stone-600">
                              {order.user?.email}
                            </span>
                          </div>
                          {order.user?.phone_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-stone-400" />
                              <span className="text-stone-600">
                                {order.user.phone_number}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span className="text-stone-600">
                              {formatDate(order.cancelled_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelledOrdersPage;
