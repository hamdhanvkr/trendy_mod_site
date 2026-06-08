import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [showInput, setShowInput] = useState(false);

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val <= 99) {
      setQuantity(val);
    } else if (e.target.value === '') {
      setQuantity('');
    }
  };

  const handleAdd = () => {
    const finalQty = quantity === '' || quantity < 1 ? 1 : quantity;
    onAddToCart(product, finalQty);
    setQuantity(1);
    setShowInput(false);
  };

  const increment = () => {
    setQuantity(prev => Math.min(99, (prev === '' ? 1 : prev) + 1));
  };

  const decrement = () => {
    setQuantity(prev => Math.max(1, (prev === '' ? 1 : prev) - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="product-card group"
    >
      <div className="p-5">
        <div className="text-5xl mb-3">{product.emoji}</div>
        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
        <p className="text-orange-600 font-bold text-xl mt-1">₹{product.price}</p>
        
        <div className="mt-4">
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} /> Order Now
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-100 rounded-full p-1">
                <button
                  onClick={decrement}
                  className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-orange-100 transition"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center bg-transparent font-semibold text-lg focus:outline-none"
                  min="1"
                  max="99"
                />
                <button
                  onClick={increment}
                  className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-orange-100 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex-1 hover:bg-green-600 transition"
                >
                  Add (₹{product.price * (quantity === '' ? 1 : quantity)})
                </button>
                <button
                  onClick={() => { setShowInput(false); setQuantity(1); }}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;