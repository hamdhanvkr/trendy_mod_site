import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { getDiscountedPrice } from '../data/products';
import { VIEW_MODES } from '../constants';
import { Stars } from './Stars';
import { ProductImage } from './ProductImage';

export const ProductCard = React.memo(({
    product,
    viewMode,
    isInWishlist,
    isAdded,
    onProductClick,
    onToggleWishlist,
    onAddToCart,
    index
}) => {

    const discountedPrice = getDiscountedPrice(product.price, product.discount);
    const isListMode = viewMode === VIEW_MODES.LIST;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 400 }}
            whileHover={{ y: isListMode ? 0 : -4 }}
            className={`group bg-white rounded-md md:rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${isListMode ? 'flex flex-row h-40 sm:h-44 lg:h-48' : ''
                }`}
            onClick={(e) => onProductClick(product.id, e)}
            role="article"
            aria-label={`Product: ${product.name}`}
        >
            {/* Product Image */}
            <div
                className={`relative bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden shrink-0 ${isListMode
                    ? 'w-32 sm:w-40 lg:w-48 h-full'
                    : 'aspect-square'
                    }`}
            >
                <ProductImage
                    src={product.image}
                    alt={product.name}
                    priority={index < 4}
                />

                {/* Badges */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5">
                    {product.isNew && (
                        <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white rounded-full shadow-lg animate-pulse">
                            New
                        </span>
                    )}
                    {product.isPopular && (
                        <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-lg">
                            Popular
                        </span>
                    )}
                    {product.discount > 0 && (
                        <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white rounded-full shadow-lg">
                            {product.discount}% OFF
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-1.5">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => onToggleWishlist(product.id, e)}
                        className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 relative z-10"
                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        aria-pressed={isInWishlist}
                        role="switch"
                    >
                        <Heart
                            size={14}
                            className={`${isInWishlist
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-slate-600'
                                } transition-colors duration-200 sm:w-4 sm:h-4`}
                        />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onProductClick(product.id);
                        }}
                        className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 relative z-10"
                        aria-label="Quick view product"
                    >
                        <Eye size={14} className="text-slate-600 sm:w-4 sm:h-4" />
                    </motion.button>
                </div>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* Product Info */}
            <div className={`p-2 sm:p-3 lg:p-4 flex flex-col justify-between flex-1 ${isListMode ? 'min-w-0' : ''}`}>
                <div>
                    <div className="mb-0.5 sm:mb-1.5">
                        <Stars rating={product.rating} />
                    </div>

                    <h3
                        className="text-xs sm:text-sm mt-2 font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onProductClick(product.id);
                        }}
                    >
                        {product.name}
                    </h3>

                    {isListMode && product.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 sm:line-clamp-3">
                            {product.description}
                        </p>
                    )}
                </div>

                <div>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                        <span className="text-sm sm:text-lg font-black text-slate-900">
                            ₹{discountedPrice}
                        </span>
                        {product.discount > 0 && (
                            <>
                                <span className="text-[10px] sm:text-sm text-slate-400 line-through">
                                    ₹{product.price}
                                </span>
                                <span className="text-[8px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded">
                                    Save ₹{product.price - discountedPrice}
                                </span>
                            </>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => onAddToCart(product, e)}
                        className={`w-full mt-2 sm:mt-3 py-1.5 sm:py-2 ${isAdded ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white rounded-md md:rounded-xl font-bold text-[10px] sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 relative z-10`}
                        aria-label={isAdded ? 'Added to cart' : 'Add to cart'}
                    >
                        {isAdded ? (
                            <>
                                <Check size={12} className="sm:w-4 sm:h-4" />
                                <span>Added!</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={12} className="transition-transform sm:w-4 sm:h-4" />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
});

ProductCard.displayName = 'ProductCard';