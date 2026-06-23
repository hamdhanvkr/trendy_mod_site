import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductImage } from './ProductImage';
import { Stars } from './Stars';
import { getDiscountedPrice, getOriginalPrice, getDiscountAmount } from '../data/products';

export const ProductRelated = React.memo(({
    products,
    wishlist,
    onWishlistToggle,
    onProductClick
}) => {

    const navigate = useNavigate();

    if (!products || products.length === 0) return null;

    return (
        <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    You May Also Like
                </h2>
                <button
                    onClick={() => navigate('/products')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    View All →
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((related) => {
                    const discountedPrice = getDiscountedPrice(related.price);
                    const originalPrice = getOriginalPrice(related.price, related.discount);
                    const savings = getDiscountAmount(related.price, related.discount);
                    const isRelatedInWishlist = wishlist.includes(related.id);

                    return (
                        <motion.div
                            key={related.id}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                            onClick={(e) => onProductClick(related.id, e)}
                        >
                            <div className="relative aspect-square bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden">
                                <ProductImage
                                    src={related.image}
                                    alt={related.name}
                                    className="transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Semi-transparent bottom bar overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-3 pt-6">

                                    {/* Product Name */}
                                    <h3 className="text-sm lg:text-base font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                                        {related.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="mt-1.5">
                                        <Stars rating={related.rating} variant="dark" />
                                    </div>

                                    {/* Price Section */}
                                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                        <span className="text-sm lg:text-lg font-black text-white">
                                            ₹{discountedPrice}
                                        </span>
                                        {related.discount > 0 && (
                                            <>
                                                <span className="text-xs lg:text-sm text-white/60 line-through">
                                                    ₹{originalPrice}
                                                </span>
                                                <span className="text-[10px] lg:text-xs font-bold text-emerald-300 bg-emerald-500/30 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                                    Save ₹{savings}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Discount Badge - Top Left */}
                                {related.discount > 0 && (
                                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold bg-rose-500 text-white rounded-full shadow-lg shadow-rose-500/20 z-10">
                                        {related.discount}% OFF
                                    </span>
                                )}

                                {/* Wishlist Button - Top Right */}
                                <button
                                    onClick={(e) => onWishlistToggle(related.id, e)}
                                    className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all z-10"
                                    aria-label={isRelatedInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart
                                        size={14}
                                        className={`${isRelatedInWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
                                    />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
});

ProductRelated.displayName = 'ProductRelated';