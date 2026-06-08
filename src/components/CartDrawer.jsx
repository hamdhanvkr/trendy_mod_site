import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, Send } from 'lucide-react';
import OrderForm from './OrderForm';

const CartDrawer = ({ isOpen, onClose, cart, setCart }) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Update quantity function
  const updateQuantity = (id, newQuantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove from cart function
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };
  
  // Handle proceed to order
  const handleProceed = () => {
    if (cart.length === 0) return;
    setShowOrderForm(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Cart 🧸
                  <span className="text-sm text-orange-500 ml-2">({cart.length} items)</span>
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X size={24} />
                </button>
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-6xl mb-3">🛒</div>
                    <p>Your cart is empty</p>
                    <button onClick={onClose} className="text-orange-500 mt-3 underline">Continue Shopping</button>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="text-3xl">{item.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-orange-600 font-bold">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, Math.min(99, item.quantity + 1))}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right min-w-[70px]">
                        <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-600 text-xs flex items-center justify-end gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              
              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t p-5 space-y-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">₹{total}</span>
                  </div>
                  <button
                    onClick={handleProceed}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg"
                  >
                    <Send size={20} /> Proceed to Order
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Order Form Modal */}
      <OrderForm
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        cart={cart}
        total={total}
        onOrderComplete={() => {
          setShowOrderForm(false);
          onClose();
        }}
      />
    </>
  );
};

export default CartDrawer;