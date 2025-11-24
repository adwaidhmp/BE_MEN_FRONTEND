/* eslint-disable no-unused-vars */
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, fetchOrders } from "../redux/slice/orderSlice";
import { toast } from "react-toastify";
import { CreditCard, Banknote, Package, MapPin, Phone, Lock, Crown, ArrowRight } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../api";

function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.order);
    const { items } = location.state || { items: [] };

    const total = items.reduce((sum, i) => sum + (i.product?.price || i.price || 0) * i.quantity, 0);

    // ------------------ Razorpay Integration ------------------
    const openRazorpay = (razorpayData) => {
        const options = {
            key: razorpayData.razorpay_key,
            amount: razorpayData.amount,
            currency: razorpayData.currency,
            name: "BE MEN",
            description: "Order Payment",
            order_id: razorpayData.razorpay_order_id,
            handler: async function (response) {
                const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                try {
                    await api.post("/razorpay/verify/", {
                        razorpay_payment_id,
                        razorpay_order_id,
                        razorpay_signature,
                    });

                    toast.success("Payment successful!");
                    dispatch(fetchOrders());
                    navigate("/order-success", { state: { order: razorpayData } });
                } catch (err) {
                    console.error(err);
                    toast.error("Payment verification failed. Order was not completed.");
                }
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: "",
            },
            theme: { color: "#b45309" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleCheckout = async (values, { setSubmitting }) => {
        setSubmitting(true);

        try {
            if (!items || items.length === 0) {
                toast.error("No items in cart");
                setSubmitting(false);
                return;
            }

            const shipping_address = `${values.name}, ${values.street}, ${values.city}, ${values.state}, ${values.country} - ${values.pincode}`;

            const payload = {
                items,
                shipping_address,
                phone: values.phone,
                payment_method: values.payment_method,
            };

            const resultAction = await dispatch(placeOrder(payload));

            if (!placeOrder.fulfilled.match(resultAction)) {
                const errorMsg = resultAction.payload?.error || resultAction.error?.message || "Checkout failed";
                toast.error(errorMsg);
                setSubmitting(false);
                return;
            }

            const orderData = resultAction.payload;

            // ✅ COD flow
            if (values.payment_method === "COD") {
                toast.success("Order placed successfully!");
                dispatch(fetchOrders());
                navigate("/order-success", { state: { order: orderData } });
                return;
            }

            // ✅ Razorpay flow
            if (values.payment_method === "RAZORPAY") {
                // Load Razorpay SDK
                const loaded = await new Promise((resolve) => {
                    if (window.Razorpay) return resolve(true);
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });

                if (!loaded) {
                    toast.error("Razorpay SDK failed to load");
                    setSubmitting(false);
                    return;
                }

                const options = {
                    key: orderData.razorpay_key,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "BE MEN",
                    description: "Order Payment",
                    order_id: orderData.razorpay_order_id,
                    handler: async function (response) {
                        try {
                            await api.post("/checkout/razorpay/verify/", {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                orders_payload: orderData.orders_payload,
                            });

                            toast.success("Payment successful!");
                            dispatch(fetchOrders());
                            navigate("/order-success", { state: { order: orderData } });
                        } catch (err) {
                            console.error(err);
                            toast.error("Payment verification failed. Order not placed.");
                        }
                    },
                    prefill: {
                        name: values.name,
                        email: "user@example.com", // optional
                        contact: values.phone,
                    },
                    theme: { color: "#b45309" },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            console.error("Checkout Error:", err);
            toast.error("Checkout failed due to unexpected error");
        } finally {
            setSubmitting(false);
        }
    };





    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
        pincode: Yup.string()
            .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
            .required("Pincode is required"),
        phone: Yup.string()
            .matches(/^[0-9]{10,15}$/, "Invalid phone number")
            .required("Phone is required"),
        payment_method: Yup.string().oneOf(["COD", "RAZORPAY"]).required(),
    });

    return (
        <div className="min-h-screen bg-amber-50 pt-24 pb-12">
            <div className="w-full px-4">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Crown className="w-8 h-8 text-amber-600" />
                        <h1 className="font-serif text-3xl text-stone-900">Complete Your Order</h1>
                    </div>
                    <p className="text-stone-600 font-light">Finalize your curated collection</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <Formik
                            initialValues={{
                                name: "",
                                street: "",
                                city: "",
                                state: "",
                                country: "",
                                pincode: "",
                                phone: "",
                                payment_method: "COD",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleCheckout}
                        >

                            {({ values, handleChange, handleSubmit, isSubmitting }) => (
                                <Form className="space-y-6">
                                    {/* Shipping Information */}
                                    <div className="bg-white rounded-xl border border-stone-200 p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <MapPin className="w-5 h-5 text-amber-600" />
                                            <h2 className="font-serif text-xl text-stone-900">Shipping Information</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { label: "Name", name: "name" },
                                                { label: "Street Address", name: "street" },
                                                { label: "City", name: "city" },
                                                { label: "State", name: "state" },
                                                { label: "Country", name: "country" },
                                                { label: "Pincode", name: "pincode" },
                                                { label: "Phone", name: "phone" },
                                            ].map((field) => (
                                                <div key={field.name}>
                                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                                        {field.label}
                                                    </label>
                                                    <Field
                                                        type={field.name === "phone" || field.name === "pincode" ? "tel" : "text"}
                                                        name={field.name}
                                                        value={values[field.name]}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none bg-white"
                                                    />
                                                    <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="bg-white rounded-xl border border-stone-200 p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <CreditCard className="w-5 h-5 text-amber-600" />
                                            <h2 className="font-serif text-xl text-stone-900">Payment Method</h2>
                                        </div>

                                        <div className="space-y-3">
                                            {["COD", "RAZORPAY"].map((method) => (
                                                <label
                                                    key={method}
                                                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${values.payment_method === method
                                                        ? "border-amber-500 bg-amber-50"
                                                        : "border-stone-200 hover:border-stone-300"
                                                        }`}
                                                >
                                                    <Field
                                                        type="radio"
                                                        name="payment_method"
                                                        value={method}
                                                        checked={values.payment_method === method}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                                                    />
                                                    {method === "COD" ? <Banknote className="w-6 h-6 text-stone-600" /> : <CreditCard className="w-6 h-6 text-stone-600" />}
                                                    <div className="flex-1">
                                                        <div className="font-medium text-stone-900">
                                                            {method === "COD" ? "Cash on Delivery" : "Online Payment"}
                                                        </div>
                                                        <div className="text-sm text-stone-500 font-light">
                                                            {method === "COD" ? "Pay when you receive your order" : "UPI, Cards, Net Banking"}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2 mt-4 text-sm text-stone-500 font-light">
                                            <Lock className="w-4 h-4" />
                                            <span>Your payment information is secure and encrypted</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || loading || items.length === 0}
                                        className={`w-full mt-6 py-4 rounded-lg font-medium text-white transition-all transform flex items-center justify-center gap-2 ${isSubmitting || loading || items.length === 0
                                            ? "bg-stone-400 cursor-not-allowed"
                                            : "bg-amber-600 hover:bg-amber-700 hover:shadow-lg active:scale-95 border border-amber-600"
                                            }`}
                                    >
                                        {isSubmitting || loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span>Complete Order</span>
                                                <ArrowRight className="w-4 h-4 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-4">
                            <div className="flex items-center gap-2 mb-6">
                                <Package className="w-5 h-5 text-amber-600" />
                                <h2 className="font-serif text-xl text-stone-900">Order Summary</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                {items.map((i, idx) => (
                                    <div
                                        key={i.product?.id || i.id || idx}
                                        className="flex justify-between items-start pb-4 border-b border-stone-100"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            {(i.product?.image || i.product?.product_image || i.image) && (
                                                <img
                                                    src={
                                                        (() => {
                                                            let img =
                                                                Array.isArray(i.product?.image)
                                                                    ? i.product.image[0]
                                                                    : i.product?.image ||
                                                                    i.product?.product_image ||
                                                                    (Array.isArray(i.image) ? i.image[0] : i.image);

                                                            if (!img) return "/placeholder.png";
                                                            if (img.startsWith("http")) return img;
                                                            return `https://bemen.duckdns.org${img}`;
                                                        })()
                                                    }
                                                    alt={i.product?.name || i.name}
                                                    className="w-16 h-16 rounded-lg object-cover border border-stone-200"
                                                />

                                            )}
                                            <div>
                                                <p className="font-medium text-stone-900">{i.product?.name || i.name}</p>
                                                <p className="text-sm text-stone-500 font-light">{i.product?.brand}</p>
                                                <p className="text-sm text-stone-500 font-light">Qty: {i.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-stone-900">
                                            ₹{((i.product?.price || i.price || 0) * i.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t-2 border-stone-200">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-stone-900 pt-3 border-t border-stone-200">
                                    <span>Total</span>
                                    <span className="text-amber-600">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
