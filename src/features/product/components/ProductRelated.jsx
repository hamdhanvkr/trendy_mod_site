import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductImage } from './ProductImage';
import { Stars } from './Stars';
import { getDiscountedPrice } from '../data/products';

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
                    const relatedDiscounted = getDiscountedPrice(related.price, related.discount);
                    const isRelatedInWishlist = wishlist.includes(related.id);

                    return (
                        <motion.div
                            key={related.id}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                            onClick={(e) => onProductClick(related.id, e)}
                        >
                            <div className="aspect-square bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden relative">
                                <ProductImage
                                    src={related.image}
                                    alt={related.name}
                                    className="transition-transform duration-500 group-hover:scale-110"
                                />
                                {related.discount > 0 && (
                                    <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                                        {related.discount}% OFF
                                    </span>
                                )}
                                <button
                                    onClick={(e) => onWishlistToggle(related.id, e)}
                                    className="relative top-2 left-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all z-10"
                                    aria-label={isRelatedInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart
                                        size={14}
                                        className={`${isRelatedInWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
                                    />
                                </button>
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                    {related.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-sm font-black text-slate-900">₹{relatedDiscounted}</span>
                                    {related.discount > 0 && (
                                        <span className="text-xs text-slate-400 line-through">₹{related.price}</span>
                                    )}
                                </div>
                                <Stars rating={related.rating} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
});

ProductRelated.displayName = 'ProductRelated';