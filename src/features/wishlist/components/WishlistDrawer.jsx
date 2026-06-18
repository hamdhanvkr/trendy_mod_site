// src/features/wishlist/components/WishlistDrawer.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { products } from '@/features/product/data/products';

const WishlistDrawer = ({ isOpen, onClose, wishlist, onWishlistToggle, onAddToCart }) => {

    const [wishlistProducts, setWishlistProducts] = useState([]);

    useEffect(() => {
        const items = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
        setWishlistProducts(items);
    }, [wishlist]);

    const handleAddToCart = (product, e) => {
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    const handleRemoveFromWishlist = (productId, e) => {
        e.stopPropagation();
        if (onWishlistToggle) {
            onWishlistToggle(productId);
        }
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
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Drawer Container */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100"
                    >
                        {/* Drawer Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50/50">
                            <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                    <Heart size={18} className="text-rose-500 fill-rose-500 flex-shrink-0" />
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">Wishlist</h2>
                                    <span className="text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full flex-shrink-0">
                                        {wishlist.length}
                                    </span>
                                </div>
                                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium truncate">
                                    {wishlist.length > 0 ? 'Your favorite items' : 'Start adding items you love'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0"
                                aria-label="Close panel"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                            {wishlistProducts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-50/50 flex items-center justify-center border border-rose-100/40 mb-4">
                                        <Heart size={22} className="text-rose-400" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Your wishlist is empty</h3>
                                    <p className="text-xs text-slate-400 max-w-[240px] mt-1 mb-5">
                                        Explore our collection and save your favorite items here.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="inline-flex items-center justify-center text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-4 py-2.5 rounded-lg transition-all"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {wishlistProducts.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="group relative bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:border-rose-100 hover:shadow-[0_4px_16px_rgba(244,63,94,0.03)]"
                                        >
                                            {/* Product Image */}
                                            <div className="w-14 h-14 rounded-xl flex-shrink-0 relative overflow-hidden bg-slate-50 border border-slate-100">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                                        🧸
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-[120px]">
                                                <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate leading-snug">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                                                    <span className="text-slate-900 font-extrabold text-xs sm:text-sm">₹{product.price}</span>
                                                    {product.discount > 0 && (
                                                        <span className="text-[9px] sm:text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                                                            {product.discount}% OFF
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm shadow-blue-600/20 hover:shadow-md"
                                                    aria-label="Add to cart"
                                                >
                                                    <ShoppingBag size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleRemoveFromWishlist(product.id, e)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    aria-label="Remove from wishlist"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        {wishlistProducts.length > 0 && (
                            <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/50">
                                <button
                                    onClick={() => {
                                        onClose();
                                        // Navigate to products page
                                        window.location.href = '/products';
                                    }}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 sm:py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-rose-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    Browse More Items
                                    <ArrowRight size={15} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                                <p className="text-[10px] text-slate-400 text-center mt-2">
                                    {wishlistProducts.length} items in your wishlist
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WishlistDrawer;