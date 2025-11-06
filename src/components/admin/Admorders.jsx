import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOrders,
  updateAdminOrder,
} from "../redux/slice/adminOrderSlice";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Plus,
  Minus,
  AlertCircle,
  RefreshCw,
  RotateCcw
} from "lucide-react";

function AdmOrders() {
  const dispatch = useDispatch();
  const { data: ordersData, loading, error } = useSelector(
    (state) => state.adminOrders
  );

  const [expandedOrders, setExpandedOrders] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shippingData, setShippingData] = useState({});
  const [showShippingForm, setShowShippingForm] = useState({});
  const [showCancelForm, setShowCancelForm] = useState({});
  const [cancelReasons, setCancelReasons] = useState({});

  // Extract orders and pagination info from response
  const orders = ordersData?.results || [];
  const pagination = ordersData || {};

  useEffect(() => {
    const params = {
      page: currentPage,
      ...(filter !== "all" && { order_status: filter }),
      ...(searchTerm && { search: searchTerm })
    };
    dispatch(fetchAdminOrders(params));
  }, [dispatch, currentPage, filter, searchTerm]);

  const handleToggle = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === "SHIPPED") {
      // Show shipping form instead of immediately updating
      setShowShippingForm((prev) => ({
        ...prev,
        [orderId]: true,
      }));
      setShippingData((prev) => ({
        ...prev,
        [orderId]: {
          tracking_id: "",
          delivery_date: "",
        },
      }));
    } else if (newStatus === "CANCELLED") {
      // Show cancellation form instead of immediately updating
      setShowCancelForm((prev) => ({
        ...prev,
        [orderId]: true,
      }));
      setCancelReasons((prev) => ({
        ...prev,
        [orderId]: "",
      }));
    } else {
      dispatch(updateAdminOrder({ orderId, updateData: { order_status: newStatus } }));
    }
  };

  const handleShippingSubmit = (orderId) => {
    const data = shippingData[orderId];
    if (data.tracking_id && data.delivery_date) {
      dispatch(updateAdminOrder({
        orderId,
        updateData: {
          order_status: "SHIPPED",
          tracking_id: data.tracking_id,
          delivery_date: data.delivery_date
        }
      }));
      setShowShippingForm((prev) => ({
        ...prev,
        [orderId]: false,
      }));
    }
  };

  const handleCancelSubmit = (orderId) => {
    const reason = cancelReasons[orderId];
    if (reason && reason.trim()) {
      dispatch(updateAdminOrder({
        orderId,
        updateData: {
          order_status: "CANCELLED",
          cancellation_reason: reason.trim()
        }
      }));
      setShowCancelForm((prev) => ({
        ...prev,
        [orderId]: false,
      }));
      setCancelReasons((prev) => ({
        ...prev,
        [orderId]: "",
      }));
    }
  };

  const handleShippingDataChange = (orderId, field, value) => {
    setShippingData((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleCancelReasonChange = (orderId, reason) => {
    setCancelReasons((prev) => ({
      ...prev,
      [orderId]: reason,
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
      OUT_FOR_DELIVERY: "bg-yellow-100 text-yellow-700 border-yellow-200",
      DELIVERED: "bg-green-100 text-green-700 border-green-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
      RETURNED: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[status] || "bg-stone-100 text-stone-700 border-stone-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <Clock className="w-4 h-4" />,
      PROCESSING: <Package className="w-4 h-4" />,
      SHIPPED: <Truck className="w-4 h-4" />,
      OUT_FOR_DELIVERY: <Truck className="w-4 h-4" />,
      DELIVERED: <CheckCircle className="w-4 h-4" />,
      CANCELLED: <XCircle className="w-4 h-4" />,
      RETURNED: <RotateCcw className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  // Predefined cancellation reasons
  const cancellationReasons = [
    "Out of stock",
    "Customer request",
    "Payment issue",
    "Invalid address",
    "Suspicious activity",
    "Price mismatch",
    "Technical error",
    "Other"
  ];

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!pagination.count) return [];

    const totalPages = Math.ceil(pagination.count / (pagination.page_size || 10));
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-stone-900">Manage Orders</h2>
          <p className="text-stone-600 font-light">View and update order status</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-[30%] -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {["all", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${filter === status
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
                  }`}
              >
                <Filter className="w-3 h-3" />
                {status === "all" ? "All Orders" : status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-stone-600 font-serif">Loading orders...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Orders List */}
      {orders?.length === 0 && !loading && (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-stone-900 mb-2">No Orders Found</h3>
          <p className="text-stone-600 font-light">
            {searchTerm ? "Try adjusting your search criteria" : "No orders match the selected filter"}
          </p>
        </div>
      )}

      {/* Orders Grid */}
      <div className="space-y-4 mb-6">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Order Header */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                    <Package className="w-6 h-6 text-stone-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-stone-900">Order #{order.id}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <User className="w-4 h-4" />
                        <span>{order.user?.name || order.user?.email || "Unknown User"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.order_status)}`}>
                    {getStatusIcon(order.order_status)}
                    {order.order_status.replace(/_/g, ' ')}
                  </span>

                  <button
                    onClick={() => handleToggle(order.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-stone-900 text-amber-50 hover:bg-stone-800 transition-all border border-stone-900"
                  >
                    {expandedOrders[order.id] ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        View Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Section */}
            {expandedOrders[order.id] && (
              <div className="border-t border-stone-200 p-6 bg-stone-50">
                {/* Order Products */}
                <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
                  <h4 className="font-medium text-stone-900 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-600" />
                    Order Items
                  </h4>
                  <div className="space-y-4">
                    {/* Product Card */}
                    <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <img
                        src={order.product?.product_image}
                        alt={order.product?.name}
                        className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-stone-900">{order.product?.name}</h5>
                        <p className="text-sm text-stone-600">{order.product?.category}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-stone-700">
                          <span>Quantity: {order.quantity}</span>
                          <span>Price: ${order.product?.price}</span>
                          <span>Total: ${order.total_amount}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${order.product?.active
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                        }`}>
                        {order.product?.active ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Shipping Information */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <h4 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Shipping Information
                    </h4>
                    {order.shipping_address ? (
                      <p className="text-stone-700">{order.shipping_address}</p>
                    ) : (
                      <p className="text-stone-500 text-sm">No shipping address provided</p>
                    )}

                    {order.tracking_id && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">Tracking: </span>
                        <span className="font-medium">{order.tracking_id}</span>
                      </div>
                    )}

                    {order.delivery_date && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">Delivery: </span>
                        <span className="font-medium">
                          {new Date(order.delivery_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <h4 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-600">Total Amount:</span>
                        <span className="font-medium text-stone-900">${order.total_amount || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Payment Method:</span>
                        <span className="font-medium text-stone-900">{order.payment_method || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Payment Status:</span>
                        <span className={`font-medium ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-amber-600'
                          }`}>
                          {order.payment_status || "PENDING"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancellation Reason Display */}
                {order.order_status === "CANCELLED" && order.cancellation_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Cancellation Reason
                    </h4>
                    <p className="text-red-700">{order.cancellation_reason}</p>
                    <div className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Cancelled on: </span>
                      {new Date(order.cancelled_at).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Return Reason Display */}
                {order.order_status === "RETURNED" && order.return_reason && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Return Reason
                    </h4>
                    <p className="text-orange-700">{order.return_reason}</p>
                    <div className="mt-2 text-sm text-orange-600">
                      <span className="font-medium">Returned on: </span>
                      {new Date(order.returned_at).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Order Actions */}
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                  <h4 className="font-medium text-stone-900 mb-4">Update Order Status</h4>

                  {/* Shipping Form */}
                  {showShippingForm[order.id] && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-amber-900 mb-3">Shipping Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            Tracking ID *
                          </label>
                          <input
                            type="text"
                            value={shippingData[order.id]?.tracking_id || ""}
                            onChange={(e) => handleShippingDataChange(order.id, "tracking_id", e.target.value)}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Enter tracking number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            Delivery Date *
                          </label>
                          <input
                            type="date"
                            value={shippingData[order.id]?.delivery_date || ""}
                            onChange={(e) => handleShippingDataChange(order.id, "delivery_date", e.target.value)}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleShippingSubmit(order.id)}
                          disabled={!shippingData[order.id]?.tracking_id || !shippingData[order.id]?.delivery_date}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Truck className="w-4 h-4" />
                          Confirm Shipping
                        </button>
                        <button
                          onClick={() => setShowShippingForm(prev => ({ ...prev, [order.id]: false }))}
                          className="flex items-center gap-2 px-4 py-2 bg-stone-600 text-white rounded-lg font-medium hover:bg-stone-700 transition-all border border-stone-600"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cancellation Form */}
                  {showCancelForm[order.id] && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-red-900 mb-3">Cancellation Details</h5>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Cancellation Reason *
                        </label>

                        {/* Quick reason buttons */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {cancellationReasons.map((reason) => (
                            <button
                              key={reason}
                              type="button"
                              onClick={() => handleCancelReasonChange(order.id, reason)}
                              className="px-3 py-1 text-sm bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              {reason}
                            </button>
                          ))}
                        </div>

                        {/* Custom reason textarea */}
                        <textarea
                          value={cancelReasons[order.id] || ""}
                          onChange={(e) => handleCancelReasonChange(order.id, e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter cancellation reason or select from quick options above"
                          rows="3"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCancelSubmit(order.id)}
                          disabled={!cancelReasons[order.id] || !cancelReasons[order.id].trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all border border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4" />
                          Confirm Cancellation
                        </button>
                        <button
                          onClick={() => {
                            setShowCancelForm(prev => ({ ...prev, [order.id]: false }));
                            setCancelReasons(prev => ({ ...prev, [order.id]: "" }));
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-stone-600 text-white rounded-lg font-medium hover:bg-stone-700 transition-all border border-stone-600"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Update Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {order.order_status === "PENDING" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "PROCESSING")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all border border-blue-600"
                      >
                        <Package className="w-4 h-4" />
                        Mark as Processing
                      </button>
                    )}
                    {order.order_status === "PROCESSING" && !showShippingForm[order.id] && (
                      <button
                        onClick={() => handleStatusChange(order.id, "SHIPPED")}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all border border-purple-600"
                      >
                        <Truck className="w-4 h-4" />
                        Mark as Shipped
                      </button>
                    )}
                    {order.order_status === "SHIPPED" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "OUT_FOR_DELIVERY")}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all border border-yellow-600"
                      >
                        <Truck className="w-4 h-4" />
                        Mark as Out for Delivery
                      </button>
                    )}
                    {order.order_status === "OUT_FOR_DELIVERY" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "DELIVERED")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all border border-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Delivered
                      </button>
                    )}

                    {/* Cancellation Button - Only show for PENDING and PROCESSING orders */}
                    {(order.order_status === "PENDING" || order.order_status === "PROCESSING") &&
                      !showShippingForm[order.id] && !showCancelForm[order.id] && (
                        <button
                          onClick={() => handleStatusChange(order.id, "CANCELLED")}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all border border-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.count > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-stone-600">
              Showing {((currentPage - 1) * (pagination.page_size || 10)) + 1} to{" "}
              {Math.min(currentPage * (pagination.page_size || 10), pagination.count)} of{" "}
              {pagination.count} orders
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={!pagination.previous}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronUp className="w-4 h-4 rotate-90" />
                Previous
              </button>

              {/* Page Numbers */}
              {generatePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${currentPage === page
                      ? "bg-amber-600 text-white border-amber-600"
                      : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={!pagination.next}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdmOrders;