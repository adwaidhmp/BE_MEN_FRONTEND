import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "./contexts/Authcontext";
import { MessageCircle, Send, Crown, User } from "lucide-react";

function Contact() {
  const { user } = useContext(AuthContext); // logged-in user
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!user){
      toast.error("Please login to send a message");
      return;
    }
    
    if (!message.trim()) {
      return toast.error("Message cannot be empty!");
    }

    setLoading(true);

    try {
      // get current user data
      const res = await axios.get(`http://localhost:3001/users/${user.id}`);
      const currentReviews = res.data.reviews || [];

      // add new message
      const updatedReviews = [...currentReviews, message];

      // patch new review
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        reviews: updatedReviews,
      });

      toast.success("Thanks for your message!");
      setMessage(""); // clear message input
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6 pt-24">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-serif text-2xl text-stone-900">BE MEN</div>
              <div className="text-xs text-stone-600 tracking-widest font-light">COLLECTION</div>
            </div>
          </div>
          <h1 className="font-serif text-3xl text-stone-900 mb-2">Share Your Thoughts</h1>
          <p className="text-stone-600 font-light">
            We value your feedback and suggestions
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                <User className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <p className="font-medium text-stone-900">{user.name}</p>
                <p className="text-sm text-stone-500 font-light">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-3">
                <MessageCircle className="w-4 h-4 text-amber-600" />
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white placeholder-stone-400 resize-none"
                placeholder="Share your feedback, suggestions, or questions about our collection..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !user}
              className="w-full flex items-center justify-center gap-2 py-4 bg-stone-900 text-amber-50 rounded-lg font-medium hover:bg-stone-800 transition-all disabled:bg-stone-400 disabled:cursor-not-allowed border border-stone-900 disabled:border-stone-400 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-amber-50 border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-stone-500 font-light">
            We typically respond within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;