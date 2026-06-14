// src/components/OrderForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, IndianRupee, Truck, AlertCircle, CheckCircle, User, Phone, Home, Navigation, CreditCard, Shield, Gift } from 'lucide-react';

const OrderForm = ({ isOpen, onClose, cart, total, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    pincode: '',
    location: 'tamilnadu'
  });
  const [focusedField, setFocusedField] = useState(null);
  const [status, setStatus] = useState('idle');

  const deliveryCharge = formData.location === 'tamilnadu' ? 80 : 150;
  const subtotal = total;
  const isFreeDelivery = subtotal >= 1000;
  const grandTotal = isFreeDelivery ? subtotal : subtotal + deliveryCharge;

  const handleLocationChange = (e) => {
    setFormData({ ...formData, location: e.target.value });
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    setFormData({ ...formData, pincode });

    if (pincode.length === 6) {
      const firstDigit = pincode.charAt(0);
      if (firstDigit === '6') {
        setFormData(prev => ({ ...prev, location: 'tamilnadu' }));
      } else {
        setFormData(prev => ({ ...prev, location: 'outside' }));
      }
    }
  };

  const generateWhatsAppMessage = () => {
    // Fixed message format without special characters
    let message = "Hii TrendyMod\n\n";
    message += "NEW ORDER DETAILS\n\n";
    message += "Customer Name: " + formData.name + "\n";
    message += "Phone: " + formData.phone + "\n";
    message += "Address: " + formData.address + "\n";
    message += "Pincode: " + formData.pincode + "\n";
    message += "Location: " + (formData.location === 'tamilnadu' ? 'Tamil Nadu' : 'Outside Tamil Nadu') + "\n\n";

    message += "ORDER ITEMS:\n";
    message += "-----------------------------------\n";

    cart.forEach((item, idx) => {
      message += (idx + 1) + ". " + item.name + " x" + item.quantity + " = ₹" + (item.price * item.quantity) + "\n";
    });

    message += "-----------------------------------\n";
    message += "Subtotal: ₹" + subtotal + "\n";

    if (isFreeDelivery) {
      message += "Delivery: FREE (Above ₹1000)\n";
    } else {
      message += "Delivery Charge: ₹" + deliveryCharge + " (" + (formData.location === 'tamilnadu' ? 'Tamil Nadu' : 'Outside Tamil Nadu') + ")\n";
    }

    message += "Grand Total: ₹" + grandTotal + "\n";
    message += "Total Items: " + cart.reduce((sum, i) => sum + i.quantity, 0) + "\n\n";
    message += "Thank you for shopping with TrendyMod!";

    return encodeURIComponent(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.phone || !formData.pincode) {
      alert("Please fill all fields");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setStatus('sending');
    await new Promise(resolve => setTimeout(resolve, 500));

    const message = generateWhatsAppMessage();
    // Change this to your WhatsApp number
    const whatsappNumber = "919629601141";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
    setStatus('sent');

    setTimeout(() => {
      setFormData({ name: '', address: '', phone: '', pincode: '', location: 'tamilnadu' });
      setStatus('idle');
      onOrderComplete();
      onClose();
    }, 2000);
  };

  const inputFields = [
    { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe', required: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '9876543210', required: true, maxLength: 10 },
    { name: 'pincode', label: 'Pincode', icon: Navigation, type: 'text', placeholder: '600001', required: true, maxLength: 6 },
    { name: 'address', label: 'Delivery Address', icon: Home, type: 'textarea', placeholder: 'House No., Street, Landmark, City', required: true }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <div className="relative flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Gift size={24} className="text-yellow-300" />
                    <h2 className="text-2xl font-bold">Complete Order</h2>
                  </div>
                  <p className="text-orange-100 text-sm">Fill your details to place order</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {status === 'sent' ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Sent! 🎉</h3>
                <p className="text-gray-500">WhatsApp chat opened. Complete payment discussion there.</p>
                <button
                  onClick={onClose}
                  className="mt-6 text-orange-500 font-semibold hover:text-orange-600 transition"
                >
                  Continue Shopping →
                </button>
              </motion.div>
            ) : status === 'sending' ? (
              <div className="p-8 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">Opening WhatsApp...</p>
                <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scroll">
                {/* Delivery Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex items-start gap-3">
                  <Truck className="text-blue-500 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">Delivery Information</p>
                    <p className="text-xs text-gray-500 mt-1">Free delivery on orders above ₹1000</p>
                  </div>
                  {isFreeDelivery && (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={12} /> Free Delivery
                    </span>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {inputFields.map((field) => (
                    <div key={field.name} className="relative">
                      <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1">
                        {field.label} {field.required && <span className="text-orange-500">*</span>}
                      </label>
                      <div className={`relative transition-all duration-200 ${focusedField === field.name ? 'transform scale-[1.02]' : ''}`}>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <field.icon size={18} />
                        </div>
                        {field.type === 'textarea' ? (
                          <textarea
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            rows="3"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-400 focus:outline-none transition-all resize-none"
                            placeholder={field.placeholder}
                            required={field.required}
                          />
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(e) => field.name === 'pincode' ? handlePincodeChange(e) : setFormData({ ...formData, [field.name]: e.target.value })}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            maxLength={field.maxLength}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-400 focus:outline-none transition-all"
                            placeholder={field.placeholder}
                            required={field.required}
                          />
                        )}
                      </div>
                      {field.name === 'pincode' && formData.pincode && formData.pincode.length === 6 && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-green-500 mt-1 ml-1"
                        >
                          ✓ Pincode verified
                        </motion.p>
                      )}
                    </div>
                  ))}

                  {/* Location Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1">
                      Delivery Region <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.location}
                        onChange={handleLocationChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-400 focus:outline-none appearance-none bg-white cursor-pointer"
                      >
                        <option value="tamilnadu">Tamil Nadu - ₹80 delivery</option>
                        <option value="outside">Outside Tamil Nadu - ₹150 delivery</option>
                      </select>
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
                    <CreditCard size={16} className="text-orange-500" />
                    <p className="text-sm font-bold text-gray-700">Order Summary</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                      <span className="font-semibold">₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Truck size={14} /> Delivery Charge
                      </span>
                      {isFreeDelivery ? (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <Gift size={14} /> FREE
                        </span>
                      ) : (
                        <span className="font-semibold">₹{deliveryCharge}</span>
                      )}
                    </div>

                    {isFreeDelivery && (
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                          <CheckCircle size={12} /> You saved ₹{deliveryCharge} on delivery!
                        </p>
                      </div>
                    )}

                    <div className="border-t border-orange-100 pt-2 mt-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-800">Grand Total</span>
                        <span className="text-xl font-bold text-orange-600">₹{grandTotal}</span>
                      </div>
                    </div>
                  </div>

                  {!isFreeDelivery && (
                    <div className="bg-white/50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">
                        Add ₹{1000 - subtotal} more to get <span className="text-green-600 font-semibold">free delivery</span>
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Shield size={14} />
                  <span>Your information is secure and encrypted</span>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-300"
                >
                  <Send size={18} /> Send Order on WhatsApp
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  By placing order, you agree to our <a href="#" className="text-orange-500">Terms & Conditions</a>
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