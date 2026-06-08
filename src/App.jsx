import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Menu } from 'lucide-react';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import SideMenu from './components/SideMenu';
import { products } from './data/products';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, newQuantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-amber-600 text-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            {/* Left side - Menu Button & Logo */}
            <div className="flex items-center gap-4">
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={() => setIsMenuOpen(true)}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105"
              >
                <Menu size={24} />
              </motion.button>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
              >
                <span className="text-3xl animate-bounce-slow">🎁</span>
                <div>
                  <h1 className="text-2xl font-bold">Trendy</h1>
                  <p className="text-xs text-orange-100">Mod Site</p>
                </div>
              </motion.div>
            </div>
            
            {/* Right side - Cart Button */}
            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition"
            >
              <ShoppingBag size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </header>
      
      {/* Welcome Banner */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 text-center"
        >
          <Sparkles className="inline-block text-yellow-500 mb-2" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">🎁 Special Offer!</h2>
          <p className="text-gray-600">Buy any 2 toys & get 10% off + Free Shipping!</p>
        </motion.div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
      
      {/* Left Side Menu Drawer */}
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      
      {/* Right Side Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 Trendy Mod | Order via WhatsApp | Delivery across India</p>
        </div>
      </footer>
    </div>
  );
}

export default App;