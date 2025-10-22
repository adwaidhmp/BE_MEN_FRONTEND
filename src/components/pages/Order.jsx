import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../redux/slice/orderSlice";
import { Package, Truck, CheckCircle, XCircle, Clock, Calendar, DollarSign, AlertCircle, ChevronRight } from "lucide-react";

function OrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
      DELIVERED: "bg-green-100 text-green-700 border-green-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-stone-100 text-stone-700 border-stone-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <Clock className="w-4 h-4" />,
      PROCESSING: <Package className="w-4 h-4" />,
      SHIPPED: <Truck className="w-4 h-4" />,
      DELIVERED: <CheckCircle className="w-4 h-4" />,
      CANCELLED: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order_detail/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600 font-serif">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center py-10">
        <div className="bg-white rounded-xl border border-stone-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-stone-900 mb-2">Error Loading Orders</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchOrders())}
            className="px-6 py-3 bg-stone-900 text-amber-50 rounded-lg font-medium hover:bg-stone-800 transition-all border border-stone-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-12">
      <div className="w-full ">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Package className="w-8 h-8 text-amber-600" />
            <h1 className="font-serif text-3xl text-stone-900">Order History</h1>
          </div>
          <p className="text-stone-600 font-light">Your curated collection journey</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-2xl mx-auto">
            <Package className="w-20 h-20 text-stone-300 mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-stone-900 mb-2">No Orders Yet</h2>
            <p className="text-stone-600 mb-6 font-light">Begin your collection journey to see orders here</p>
            <a
              href="/home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all border border-amber-600"
            >
              Discover Collection
            </a>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-4">
            {console.log(orders)}
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-stone-200">
                        {order.product?.product_image ? (
                          <img
                            src={`http://127.0.0.1:8000${order.product.product_image}`}
                            alt={order.product?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-stone-800" />
                        )}
                      </div>
                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-serif text-lg text-stone-900 group-hover:text-amber-600 transition-colors">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-stone-600 font-medium">
                            {order.product?.name || "Product"}
                          </p>
                          <p className="text-sm text-stone-500 flex items-center gap-1 mt-1 font-light">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-2 rounded-lg font-medium text-sm border flex items-center gap-2 whitespace-nowrap ${getStatusColor(order.order_status)}`}>
                            {getStatusIcon(order.order_status)}
                            {order.order_status}
                          </span>
                          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <DollarSign className="w-4 h-4 text-stone-400" />
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-stone-900">${parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <Package className="w-4 h-4 text-stone-400" />
                          <span className="font-medium">Quantity:</span>
                          <span>{order.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <Truck className="w-4 h-4 text-stone-400" />
                          <span className="font-medium">Status:</span>
                          <span className="capitalize">{order.order_status.toLowerCase()}</span>
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
}

export default OrdersPage;