// src/components/SideMenu.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, HelpCircle, Mail, Phone, Clock, ChevronRight, Grid, ShoppingBag, Heart } from 'lucide-react';

const SideMenu = ({ isOpen, onClose, onSelectCategory }) => {
  const [showCategories, setShowCategories] = useState(false);

  const menuItems = [
    { id: 'categories', name: 'Categories', icon: <Grid size={20} />, hasSubmenu: true, color: 'text-purple-500' },
    { id: 'track', name: 'Track Order', icon: <Package size={20} />, link: 'https://stcourier.com/track/shipment', external: true, color: 'text-blue-500' },
    { id: 'support', name: 'Customer Support', icon: <HelpCircle size={20} />, link: '#', external: false, color: 'text-orange-500' }
  ];

  const categoriesList = [
    { id: 'panda', name: 'Panda Collection 🐼', icon: '🐼', description: '14 Cute panda toys', count: 14, path: '/category/panda' },
    { id: 'colorchangingpanda', name: 'Color Changing Panda 🎨', icon: '🎨', description: 'Magic color changing', count: 3, path: '/category/colorchangingpanda' },
    { id: 'sinchanmobilestand', name: 'Shinchan Mobile Stand 📱', icon: '📱', description: 'Funny Shinchan', count: 3, path: '/category/sinchanmobilestand' }
  ];

  const handleNavigation = (item) => {
    if (item.id === 'categories') { 
      setShowCategories(true); 
      return; 
    }
    if (item.external && item.link) { 
      window.open(item.link, '_blank'); 
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 text-white">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                    🎪
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Trendy Mod</h3>
                    <p className="text-xs text-orange-100">Your favorite toy store</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
                  <X size={22} />
                </button>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
              {!showCategories ? (
                <div className="py-4">
                  {menuItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 5, backgroundColor: '#f9fafb' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item)}
                      className="w-full text-left px-4 py-3 transition-all duration-200 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                          {item.icon}
                        </div>
                        <div className="font-medium text-gray-800">{item.name}</div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 transition" />
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="py-4">
                  <div className="px-4 mb-4">
                    <button 
                      onClick={() => setShowCategories(false)}
                      className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-sm font-medium"
                    >
                      ← Back to Menu
                    </button>
                  </div>
                  <div className="space-y-2 px-4">
                    {categoriesList.map((cat) => (
                      <motion.button
                        key={cat.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          onClose();
                        }}
                        className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{cat.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{cat.name}</div>
                            <div className="text-xs text-gray-500">{cat.description}</div>
                          </div>
                          <div className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full font-medium">
                            {cat.count} items
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quick Support */}
              <div className="mt-4 px-4 py-4 bg-gray-50 mx-4 rounded-xl mb-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Quick Support
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-orange-400" />
                    <span>support@trendymod.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-orange-400" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock size={16} className="text-orange-400" />
                    <span>Mon-Sat: 10AM - 7PM</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t p-4 bg-gray-50">
              <p className="text-xs text-center text-gray-400">
                © 2026 Trendy Mod | All Rights Reserved
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;