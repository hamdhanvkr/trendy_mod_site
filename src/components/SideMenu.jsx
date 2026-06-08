// src/components/SideMenu.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Truck, MapPin, Clock, HelpCircle, Mail, Phone } from 'lucide-react';

const SideMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      id: 'track',
      name: 'Track Order',
      icon: <Package size={20} />,
      link: 'https://stcourier.com/track/shipment',
      external: true,
      description: 'Track your shipment status'
    },
    {
      id: 'support',
      name: 'Customer Support',
      icon: <HelpCircle size={20} />,
      link: '#',
      external: false,
      description: '24/7 assistance'
    }
  ];

  const handleNavigation = (item) => {
    if (item.external && item.link) {
      window.open(item.link, '_blank');
    } else if (item.link && item.link !== '#') {
      // Handle internal navigation if needed
      console.log('Navigate to:', item.link);
    }
    onClose();
  };

  return (
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
          
          {/* Left Side Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎪</span>
                  <h2 className="text-xl font-bold">Menu</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X size={22} />
                </button>
              </div>
              <p className="text-sm text-orange-100">Welcome back! 👋</p>
            </div>
            
            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item)}
                    className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-orange-500 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-gray-400">{item.description}</div>
                        )}
                      </div>
                      <div className="text-gray-300 group-hover:text-orange-400 transition">
                        →
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {/* Divider */}
              <div className="h-px bg-gray-100 my-4 mx-4"></div>
              
              {/* Quick Info */}
              <div className="px-4 space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Quick Support
                </h3>
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