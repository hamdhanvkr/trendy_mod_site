// src/components/OrderForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';

const OrderForm = ({ isOpen, onClose, cart, total, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  })
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppMessage = () => {
    let message = "🧸 *NEW TOY ORDER* 🧸\n\n";
    message += `*Customer:* ${formData.name}\n`;
    message += `*Phone:* ${formData.phone}\n`;
    message += `*Address:* ${formData.address}\n\n`;
    message += "*Order Details:*\n";
    
    cart.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} x${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    
    message += `\n*Total:* ₹${total}\n`;
    message += `*Total Items:* ${cart.reduce((sum, i) => sum + i.quantity, 0)}\n\n`;
    message += `_Order placed via Toy Shop App_ 🎁`;
    
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Please fill all fields");
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    
    setStatus('sending');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const message = generateWhatsAppMessage();
    const whatsappNumber = "919629601141";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    setStatus('sent');
    
    setTimeout(() => {
      setFormData({ name: '', address: '', phone: '' });
      setStatus('idle');
      onOrderComplete();
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-5 border-b flex justify-between items-center bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <h2 className="text-xl font-bold">Complete Your Order</h2>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
                <X size={22} />
              </button>
            </div>
            
            {status === 'sent' ? (
              <div className="p-8 text-center">
                <CheckCircle size={60} className="text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800">Order Sent!</h3>
                <p className="text-gray-500 mt-2">WhatsApp chat opened. Complete payment discussion there.</p>
              </div>
            ) : status === 'sending' ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-3"></div>
                <p className="text-gray-600">Opening WhatsApp...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition"
                    placeholder="9876543210"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition"
                    placeholder="House No., Street, City, Pincode"
                    required
                  />
                </div>
                
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Order Summary:</p>
                  <p className="font-bold text-lg text-orange-600">Total: ₹{total}</p>
                  <p className="text-xs text-gray-500">{cart.reduce((sum, i) => sum + i.quantity, 0)} items</p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Send size={18} /> Send Order on WhatsApp
                </button>
                
                <p className="text-xs text-gray-400 text-center">
                  Clicking will open WhatsApp. Your order details will be shared with the seller.
                </p>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderForm;