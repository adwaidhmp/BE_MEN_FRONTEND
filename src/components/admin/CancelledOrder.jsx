import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReturnedCancelledOrders,
  approveOrRejectReturn,
} from "../redux/slice/adminCancelAndReturnSlice";
import {
  Package,
  XCircle,
  Calendar,
  User,
  Phone,
  Mail,
  AlertCircle,
  Filter,
  RotateCcw,
  CheckCircle,
  X,
} from "lucide-react";

const CancelledOrdersPage = () => {
  const dispatch = useDispatch();
  const { data: orders, loading, error } = useSelector(
    (state) => state.adminCancelAndReturn
  );

  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    const params = {};
    if (currentFilter !== "all") {
      params.type = currentFilter.toUpperCase();
    }
    dispatch(fetchReturnedCancelledOrders(params));
  }, [dispatch, currentFilter]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleApproveReject = (order, action) => {
    setSelectedOrder(order);
    setActionType(action);
    setShowReturnModal(true);
  };

  const confirmAction = async () => {
    if (!selectedOrder) return;
    try {
      await dispatch(
        approveOrRejectReturn({
          orderId: selectedOrder.id,
          action: actionType,
        })
      ).unwrap();
      setShowReturnModal(false);
      setSelectedOrder(null);
    } catch (err) {
      // Error is handled by the slice
      console.log(err)
    }
  };

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

  // Determine order status based on the data
  const getOrderStatus = (order) => {
    if (order.order_status) {
      return order.order_status;
    }
    // Fallback logic if order_status is not available
    if (order.return_reason && !order.returned_at) {
      return "RETURN_PENDING";
    } else if (order.return_reason && order.returned_at) {
      return "RETURNED";
    } else if (order.cancellation_reason) {
      return "CANCELLED";
    } else {
      return "UNKNOWN";
    }
  };

  const getStatusColor = (order) => {
    const status = getOrderStatus(order);
    const colors = {
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
      RETURN_PENDING: "bg-orange-100 text-orange-700 border-orange-200",
      RETURNED: "bg-green-100 text-green-700 border-green-200",
      DELIVERED: "bg-blue-100 text-blue-700 border-blue-200",
      UNKNOWN: "bg-stone-100 text-stone-700 border-stone-200",
    };
    return colors[status] || "bg-stone-100 text-stone-700 border-stone-200";
  };

  const getStatusIcon = (order) => {
    const status = getOrderStatus(order);
    const icons = {
      CANCELLED: <XCircle className="w-4 h-4" />,
      RETURN_PENDING: <RotateCcw className="w-4 h-4" />,
      RETURNED: <CheckCircle className="w-4 h-4" />,
      DELIVERED: <CheckCircle className="w-4 h-4" />,
      UNKNOWN: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <XCircle className="w-4 h-4" />;
  };

  const getStatusText = (order) => {
    const status = getOrderStatus(order);
    return status.replace(/_/g, ' ');
  };

  // Filter orders based on current filter
  const filteredOrders = orders.filter((order) => {
    const status = getOrderStatus(order);
    if (currentFilter === "all") return true;
    if (currentFilter === "cancelled") return status === "CANCELLED";
    if (currentFilter === "return_pending") return status === "RETURN_PENDING";
    if (currentFilter === "returned") return status === "RETURNED";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600 font-serif">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-stone-900 mb-2">Error Loading Orders</h2>
          <p className="text-stone-600 mb-6 font-light">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </p>
          <button
            onClick={() => dispatch(fetchReturnedCancelledOrders())}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-6 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-stone-900">Cancelled & Returned Orders</h2>
              <p className="text-stone-600 font-light">Total: {filteredOrders.length} orders</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-stone-400" />
            <span className="text-stone-600 font-medium">Filter by:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "All" },
                { value: "cancelled", label: "Cancelled" },
                { value: "return_pending", label: "Return Pending" },
                { value: "returned", label: "Returned" },
              ].map((filterOption) => (
                <button
                  key={filterOption.value}
                  onClick={() => handleFilterChange(filterOption.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                    currentFilter === filterOption.value
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-stone-900 mb-2">No Orders Found</h3>
            <p className="text-stone-600 font-light">
              {currentFilter === "all" 
                ? "No cancelled or returned orders found"
                : `No ${currentFilter.replace('_', ' ')} orders found`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all">
                {/* Order Header */}
                <div className="p-6 border-b border-stone-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${getStatusColor(order).replace('text-', 'bg-').split(' ')[0]} border-${getStatusColor(order).split('border-')[1]?.split(' ')[0]}`}>
                        {getStatusIcon(order)}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-stone-900">Order #{order.id}</h3>
                        <p className="text-stone-600 text-sm">
                          {order.return_reason 
                            ? `Return Reason: ${order.return_reason}`
                            : order.cancellation_reason 
                            ? `Cancellation Reason: ${order.cancellation_reason}`
                            : "No reason provided"
                          }
                        </p>
                      </div>
                      {(order.cancelled_at || order.returned_at) && (
                        <div className="text-xs text-stone-500 bg-stone-50 px-2 py-1 rounded-full">
                          {getTimeAgo(order.cancelled_at || order.returned_at)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(order)}`}>
                        {getStatusIcon(order)}
                        {getStatusText(order)}
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
                          src={order.product?.product_image}
                          alt={order.product?.name}
                          className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-900 mb-2">{order.product?.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-stone-600 mb-3">
                            <span className="capitalize">{order.product?.category}</span>
                            <span>•</span>
                            <span>Quantity: {order.quantity}</span>
                            <span>•</span>
                            <span>Price: ${parseFloat(order.price).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Reason Section */}
                      <div className={`rounded-lg p-4 border ${getStatusColor(order).replace('text-', 'bg-').split(' ')[0]} border-${getStatusColor(order).split('border-')[1]?.split(' ')[0]}`}>
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {order.return_reason ? "Return Reason" : "Cancellation Reason"}
                        </h5>
                        {order.return_reason ? (
                          <p className="text-sm leading-relaxed">
                            {order.return_reason}
                          </p>
                        ) : order.cancellation_reason ? (
                          <p className="text-sm leading-relaxed">
                            {order.cancellation_reason}
                          </p>
                        ) : (
                          <p className="text-stone-500 text-sm italic">No reason provided</p>
                        )}
                      </div>
                    </div>

                    {/* Customer Info & Actions */}
                    <div className="space-y-4">
                      <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                        <h5 className="font-medium text-stone-900 mb-3 flex items-center gap-1">
                          <User className="w-4 h-4 text-amber-600" />
                          Customer Details
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-stone-400" />
                            <span className="text-stone-600">{order.user?.name || "Unknown User"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-stone-400" />
                            <span className="text-stone-600">{order.user?.email}</span>
                          </div>
                          {order.user?.phone_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-stone-400" />
                              <span className="text-stone-600">{order.user.phone_number}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span className="text-stone-600">
                              {formatDate(order.cancelled_at || order.returned_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Only show for return pending orders */}
                      {getOrderStatus(order) === "RETURN_PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveReject(order, "approve")}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve Return
                          </button>
                          <button
                            onClick={() => handleApproveReject(order, "reject")}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Reject Return
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Return Action Modal */}
      {showReturnModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-serif text-stone-900 mb-4">
              {actionType === "approve" ? "Approve Return" : "Reject Return"} - Order #{selectedOrder.id}
            </h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-stone-900 mb-2">Product:</h3>
              <p className="text-stone-600">{selectedOrder.product?.name}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-stone-900 mb-2">Return Reason:</h3>
              <p className="text-stone-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                {selectedOrder.return_reason || "No reason provided"}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-stone-900 mb-2">Customer:</h3>
              <p className="text-stone-600">{selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
            </div>

            <p className="text-stone-600 mb-6 font-light">
              Are you sure you want to {actionType} this return request?
              {actionType === "approve" && " This will process the refund and mark the order as returned."}
              {actionType === "reject" && " This will reject the return request and keep the order as delivered."}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelledOrdersPage;