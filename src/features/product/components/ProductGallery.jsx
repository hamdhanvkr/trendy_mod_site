import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Sparkles, TrendingUp } from 'lucide-react';
import { ProductImage } from './ProductImage';

export const ProductGallery = React.memo(({
    product,
    productImages,
    selectedImage,
    isInWishlist,
    onWishlistToggle,
    onShare
}) => {

    if (!product) return null;

    return (
        <div className="space-y-4">
            <motion.div
                className="relative aspect-square bg-linear-to-br from-slate-50 via-white to-slate-50 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xl"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
            >
                <ProductImage
                    src={productImages[selectedImage] || product.image}
                    alt={product.name}
                    className="cursor-zoom-in"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                        <motion.span
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg"
                        >
                            <Sparkles size={12} className="inline mr-1" />
                            New
                        </motion.span>
                    )}
                    {product.isPopular && (
                        <motion.span
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-linear-to-r from-amber-500 to-amber-400 text-white rounded-full shadow-lg"
                        >
                            <TrendingUp size={12} className="inline mr-1" />
                            Popular
                        </motion.span>
                    )}
                    {product.discount > 0 && (
                        <motion.span
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-linear-to-r from-rose-500 to-rose-400 text-white rounded-full shadow-lg animate-pulse"
                        >
                            {product.discount}% OFF
                        </motion.span>
                    )}
                </div>

                {/* Wishlist & Share */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => onWishlistToggle(e)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 relative z-10"
                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart
                            size={18}
                            className={`${isInWishlist
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-slate-600'
                                } transition-colors`}
                        />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onShare}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 relative z-10"
                        aria-label="Share product"
                    >
                        <Share2 size={18} className="text-slate-600" />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
});

ProductGallery.displayName = 'ProductGallery';