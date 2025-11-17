import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  selectNotifications,
} from "../redux/slice/NotificationSlice";
import { toast } from "react-toastify";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Info,
  ShoppingBag,
  Truck,
  Package,
  XCircle
} from "lucide-react";

export default function NotificationComponent() {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const loading = useSelector((state) => state.notifications.loading);
  const error = useSelector((state) => state.notifications.error);

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Show error as toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id))
      .unwrap()
      .then(() => toast.success("Marked as read"))
      .catch((err) => console.log(err));
  };

  // Get appropriate icon based on notification type
  const getNotificationIcon = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('order') && lowerMessage.includes('success')) {
      return <ShoppingBag className="w-5 h-5 text-green-600" />;
    } else if (lowerMessage.includes('shipped') || lowerMessage.includes('delivery')) {
      return <Truck className="w-5 h-5 text-blue-600" />;
    } else if (lowerMessage.includes('cancelled') || lowerMessage.includes('failed')) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    } else if (lowerMessage.includes('processing')) {
      return <Package className="w-5 h-5 text-amber-600" />;
    } else {
      return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  // Format time difference
  const getTimeDifference = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600 font-serif">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="min-h-64 flex flex-col items-center justify-center p-20 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="font-serif text-xl text-stone-900 mb-2">No Notifications</h3>
        <p className="text-stone-600 font-light max-w-sm">
          You're all caught up! We'll notify you when there's something new.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 p-4">
        <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-stone-900">Notifications</h2>
          <p className="text-stone-600 font-light">Stay updated with your account activity</p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
              notification.read 
                ? "border-stone-200 bg-stone-50" 
                : "border-amber-200 bg-amber-50/30"
            }`}
          >
            <div className="p-4">
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.read ? "bg-stone-100" : "bg-amber-100"
                  }`}>
                    {getNotificationIcon(notification.message)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium leading-relaxed ${
                    notification.read ? "text-stone-700" : "text-stone-900"
                  }`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span className="text-xs text-stone-500 font-light">
                      {getTimeDifference(notification.created_at)}
                    </span>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-all border border-stone-900"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Read
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="flex items-center justify-between text-sm text-stone-600">
          <span className="font-light">
            {notifications.filter(n => !n.read).length} unread notifications
          </span>
          <span className="font-light">
            Total: {notifications.length} notifications
          </span>
        </div>
      </div>
    </div>
  );
}