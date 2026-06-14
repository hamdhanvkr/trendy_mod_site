// src/components/CategoryModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, category, products, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 6;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const [imageErrors, setImageErrors] = useState({});
  
  if (!category) return null;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleImageError = (productId) => {
    console.log("Image failed to load for product ID:", productId);
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-sm text-orange-100">{category.description}</p>
                  <p className="text-xs text-orange-200 mt-1">{products.length} products available</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-3">🐼</div>
                  <p className="text-gray-500">No products found in this collection</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {currentProducts.map((product, idx) => {
                      const hasError = imageErrors[product.id];
                      const isHeic = product.image?.toUpperCase().includes('.HEIC');
                      
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
                        >
                          {/* Product Image */}
                          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                            {!hasError && product.image ? (
                              <img 
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                onError={() => handleImageError(product.id)}
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center">
                                <div className="text-8xl mb-2">{product.emoji || '🐼'}</div>
                                <p className="text-sm text-gray-500 font-medium text-center px-2">{product.name}</p>
                                {isHeic && (
                                  <p className="text-xs text-blue-400 mt-1">HEIC format</p>
                                )}
                                {hasError && !isHeic && (
                                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                    <ImageOff size={12} /> Image not available
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {/* Price Badge */}
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-orange-600 shadow-md">
                              ₹{product.price}
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">{product.description}</p>
                            <div className="mt-3">
                              <button
                                onClick={() => onAddToCart(product, 1)}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-105 text-sm font-semibold"
                              >
                                <ShoppingCart size={16} /> Add to Cart
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        onClick={prevPage}
                        className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <button
                        onClick={nextPage}
                        className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;