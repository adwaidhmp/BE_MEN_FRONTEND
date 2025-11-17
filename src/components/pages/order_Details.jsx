import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetail, cancelOrder, updateOrderAddress, requestReturn } from "../redux/slice/orderSlice";
import { toast } from "react-toastify";
import {
  Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone,
  Calendar, DollarSign, ArrowLeft, AlertCircle, Hash, CreditCard, Crown,
  Edit, Save, X, RotateCcw
} from "lucide-react";

function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.order);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
  }, [dispatch, orderId]);

  // Initialize edited address when order loads
  useEffect(() => {
    if (order?.shipping_address) {
      setEditedAddress(order.shipping_address);
    }
  }, [order?.shipping_address]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    if (!order?.id) {
      toast.error("Order ID is not available");
      return;
    }

    try {
      const resultAction = await dispatch(cancelOrder({ 
        orderId: order.id, 
        reason: cancelReason 
      }));

      if (cancelOrder.fulfilled.match(resultAction)) {
        toast.success("Order cancelled successfully");
        setShowCancelModal(false);
      } else {
        toast.error(resultAction.payload || "Failed to cancel order");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to cancel order");
    }
  };

  const handleReturnOrder = async () => {
    if (!returnReason.trim()) {
      toast.error("Please provide a reason for return");
      return;
    }

    if (!order?.id) {
      toast.error("Order ID is not available");
      return;
    }

    try {
      const resultAction = await dispatch(requestReturn({ 
        orderId: order.id, 
        reason: returnReason 
      }));

      if (requestReturn.fulfilled.match(resultAction)) {
        toast.success("Return request submitted successfully");
        setShowReturnModal(false);
        setReturnReason("");
        // Refresh order details to get updated status
        dispatch(fetchOrderDetail(orderId));
      } else {
        toast.error(resultAction.payload || "Failed to submit return request");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit return request");
    }
  };

  const handleUpdateAddress = async () => {
    if (!editedAddress.trim()) {
      toast.error("Please enter a valid shipping address");
      return;
    }

    try {
      const resultAction = await dispatch(updateOrderAddress({
        orderId: order.id,
        shippingAddress: editedAddress
      }));
      
      if (updateOrderAddress.fulfilled.match(resultAction)) {
        toast.success("Shipping address updated successfully");
        setIsEditingAddress(false);
        // Refresh order details to get updated data
        dispatch(fetchOrderDetail(orderId));
      } else {
        toast.error(resultAction.payload || "Failed to update address");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update address");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
      DELIVERED: "bg-green-100 text-green-700 border-green-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
      RETURN_PENDING: "bg-orange-100 text-orange-700 border-orange-200",
      RETURN_APPROVED: "bg-blue-100 text-blue-700 border-blue-200",
      RETURN_REJECTED: "bg-red-100 text-red-700 border-red-200",
      RETURN_COMPLETED: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || "bg-stone-100 text-stone-700 border-stone-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <Clock className="w-5 h-5" />,
      PROCESSING: <Package className="w-5 h-5" />,
      SHIPPED: <Truck className="w-5 h-5" />,
      DELIVERED: <CheckCircle className="w-5 h-5" />,
      CANCELLED: <XCircle className="w-5 h-5" />,
      RETURN_PENDING: <RotateCcw className="w-5 h-5" />,
      RETURN_APPROVED: <RotateCcw className="w-5 h-5" />,
      RETURN_REJECTED: <XCircle className="w-5 h-5" />,
      RETURN_COMPLETED: <CheckCircle className="w-5 h-5" />,
    };
    return icons[status] || <Clock className="w-5 h-5" />;
  };

  const canCancelOrder = (status) => {
    return status === "PENDING" || status === "PROCESSING";
  };

  const canReturnOrder = (status) => {
    // Allow returns only for delivered orders that haven't been returned already
    const returnEligibleStatuses = ["DELIVERED"];
    const alreadyReturnedStatuses = ["RETURN_PENDING", "RETURN_APPROVED", "RETURN_REJECTED", "RETURN_COMPLETED"];
    
    return returnEligibleStatuses.includes(status) && !alreadyReturnedStatuses.includes(status);
  };

  const canEditAddress = (status) => {
    // Allow address editing only for pending and processing orders
    return status === "PENDING" || status === "PROCESSING";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600 font-serif">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center py-10">
        <div className="bg-white rounded-xl border border-stone-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-stone-900 mb-2">Order Not Found</h2>
          <p className="text-stone-600 mb-6 font-light">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 bg-stone-900 text-amber-50 rounded-lg font-medium hover:bg-stone-800 transition-all border border-stone-900"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-12 relative">
      <div className="w-full px-4 max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-6 h-6 text-amber-600" />
                <h1 className="font-serif text-3xl text-stone-900">Order #{order.id}</h1>
              </div>
              <p className="text-stone-600 flex items-center gap-2 font-light">
                <Calendar className="w-4 h-4" />
                Ordered on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2">
              <span className={`px-4 py-2 rounded-lg font-medium text-base border flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                {getStatusIcon(order.order_status)}
                {order.order_status}
              </span>
              <span className="font-serif text-2xl text-stone-900">
                ${parseFloat(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Product & Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-serif text-xl text-stone-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                Product Details
              </h2>

              <div className="flex gap-4 cursor-pointer"
                onClick={() => navigate(`/product/${order.product.id}`)}>
                <div className="w-24 h-24 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-stone-200">
                  {order.product?.product_image ? (
                    <img
                      src={`https://bemen.duckdns.org${order.product.product_image}`}
                      alt={order.product?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-stone-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-stone-900 mb-2">
                    {order.product?.name || "Product"}
                  </h3>
                  {order.product?.description && (
                    <p className="text-stone-600 text-sm mb-3 font-light">{order.product.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-stone-500 font-light">Price per unit</p>
                      <p className="font-medium text-stone-900">${parseFloat(order.price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500 font-light">Quantity</p>
                      <p className="font-medium text-stone-900">{order.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  Shipping Information
                </h2>
                {canEditAddress(order.order_status) && (
                  !isEditingAddress ? (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Address
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateAddress}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingAddress(false);
                          setEditedAddress(order.shipping_address);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500 mb-1 font-light">Delivery Address</p>
                  {isEditingAddress ? (
                    <textarea
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                      rows={3}
                      placeholder="Enter complete shipping address"
                    />
                  ) : (
                    <p className="text-stone-900 font-medium">{order.shipping_address}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-stone-500 mb-1 font-light">Contact Number</p>
                    <p className="text-stone-900 font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-stone-400" />
                      {order.phone}
                    </p>
                  </div>

                  {order.tracking_id && (
                    <div>
                      <p className="text-sm text-stone-500 mb-1 font-light">Tracking ID</p>
                      <p className="text-stone-900 font-medium flex items-center gap-2">
                        <Hash className="w-4 h-4 text-stone-400" />
                        {order.tracking_id}
                      </p>
                    </div>
                  )}
                </div>

                {order.delivery_date && (
                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-sm text-stone-500 mb-1 font-light">Expected Delivery</p>
                    <p className="text-stone-900 font-medium flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-600" />
                      {new Date(order.delivery_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Order Actions</h2>
              <div className="flex gap-3 flex-wrap">
                {canCancelOrder(order.order_status) && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2 border border-red-600"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel Order
                  </button>
                )}
                {canReturnOrder(order.order_status) && (
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all flex items-center gap-2 border border-orange-600"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Return Product
                  </button>
                )}
                <button className="px-6 py-3 bg-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-300 transition-all border border-stone-300">
                  Need Help?
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-4">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>${parseFloat(order.price * order.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-serif text-xl text-stone-900 pt-4 border-t border-stone-200">
                  <span>Total</span>
                  <span className="text-amber-600">${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-stone-200">
                <h3 className="font-medium text-stone-900 mb-3">Payment Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600 font-light">Payment Method</span>
                    <span className="font-medium text-stone-900 flex items-center gap-2">
                      {order.payment_method}
                      <CreditCard className="w-4 h-4 text-stone-400" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600 font-light">Payment Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.payment_status === 'PAID'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : order.payment_status === 'REFUNDED'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="mt-6 pt-6 border-t border-stone-200">
                <h3 className="font-medium text-stone-900 mb-4">Order Status</h3>
                <div className="space-y-3">
                  {/* Order Placed */}
                  <div className={`flex items-center gap-3 ${['PENDING', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.order_status) ? 'text-green-600' : 'text-stone-400'}`}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Order Placed</span>
                  </div>

                  {/* Processing */}
                  <div className={`flex items-center gap-3 ${['PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.order_status) ? 'text-green-600' : 'text-stone-400'}`}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Processing</span>
                  </div>

                  {/* Shipped */}
                  <div className={`flex items-center gap-3 ${['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.order_status) ? 'text-green-600' : 'text-stone-400'}`}>
                    <Truck className="w-5 h-5" />
                    <span className="text-sm font-medium">Shipped</span>
                  </div>

                  {/* Out for Delivery */}
                  <div className={`flex items-center gap-3 ${['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.order_status) ? 'text-green-600' : 'text-stone-400'}`}>
                    <Truck className="w-5 h-5" />
                    <span className="text-sm font-medium">Out for Delivery</span>
                  </div>

                  {/* Delivered */}
                  <div className={`flex items-center gap-3 ${['DELIVERED', 'RETURN_PENDING', 'RETURN_APPROVED', 'RETURN_REJECTED', 'RETURN_COMPLETED'].includes(order.order_status) ? 'text-green-600' : 'text-stone-400'}`}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Delivered</span>
                  </div>

                  {/* Return Status (if applicable) */}
                  {['RETURN_PENDING', 'RETURN_APPROVED', 'RETURN_REJECTED', 'RETURN_COMPLETED'].includes(order.order_status) && (
                    <div className={`flex items-center gap-3 ${order.order_status === 'RETURN_COMPLETED' ? 'text-green-600' : order.order_status === 'RETURN_REJECTED' ? 'text-red-600' : 'text-orange-600'}`}>
                      <RotateCcw className="w-5 h-5" />
                      <span className="text-sm font-medium capitalize">{order.order_status.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-serif text-stone-900 mb-4">Cancel Order #{order.id}</h2>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason for cancellation"
              className="w-full border border-stone-300 rounded-lg p-3 mb-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-300 transition-all border border-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all border border-red-600"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-serif text-stone-900 mb-4">Return Order #{order.id}</h2>
            <p className="text-stone-600 mb-4 font-light">
              Please provide the reason for returning this product. Our team will review your request.
            </p>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="Enter reason for return (e.g., wrong size, damaged product, not as described, etc.)"
              className="w-full border border-stone-300 rounded-lg p-3 mb-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                }}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-300 transition-all border border-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnOrder}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all border border-orange-600"
              >
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetailPage;