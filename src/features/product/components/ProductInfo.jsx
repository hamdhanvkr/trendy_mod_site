import React from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Stars } from './Stars';
import { getDiscountedPrice } from '../data/products';
import { PRODUCT_FEATURES } from '../constants';

export const ProductInfo = React.memo(({
    product,
    selectedColor,
    onColorSelect,
    showFullDescription,
    onToggleDescription,
}) => {
    if (!product) return null;

    const discountedPrice = getDiscountedPrice(product.price, product.discount);
    const savings = product.price - discountedPrice;

    return (
        <div className="space-y-5 lg:space-y-6">
            {/* Title & Rating */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2.5 tracking-tight leading-tight">
                    {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                    <Stars rating={product.rating} />
                    <span className="text-slate-300 text-sm" aria-hidden="true">|</span>
                    <span className="text-sm font-medium text-slate-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                        {product.reviews || 0} reviews
                    </span>
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3 bg-linear-to-r from-blue-50/70 to-indigo-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-100/40">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    ₹{discountedPrice}
                </span>
                {product.discount > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                            ₹{product.price}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-100/80 rounded-lg backdrop-blur-sm">
                            Save ₹{savings}
                        </span>
                    </div>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex flex-wrap items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                    {product.inStock && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </span>
                <span className={`text-xs sm:text-sm font-bold tracking-wide uppercase ${product.inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {product.inStock ? 'In Stock • Ready to Ship' : 'Out of Stock'}
                </span>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                    <span className="text-sm font-bold text-slate-800 tracking-wide">Color:</span>
                    <div className="flex flex-wrap gap-2.5">
                        {product.colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => onColorSelect(color)}
                                className={`group relative p-0.5 rounded-full border-2 transition-all duration-200 ${selectedColor === color
                                    ? 'border-blue-600 shadow-md shadow-blue-600/10 scale-105'
                                    : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                aria-label={`Select ${color} color`}
                            >
                                <span
                                    className="block w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/10 shadow-inner"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Description */}
            <div className="text-slate-600 text-sm leading-relaxed bg-slate-50 border border-slate-100 p-3.5 sm:p-4 rounded-xl shadow-sm">
                <p className={`transition-all duration-300 ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                    {product.description || 'Premium quality toy designed for endless fun and learning.'}
                </p>
                {product.description && product.description.length > 150 && (
                    <button
                        onClick={onToggleDescription}
                        className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 focus:outline-none"
                    >
                        {showFullDescription ? (
                            <>Show less <ChevronUp size={16} /></>
                        ) : (
                            <>Read more <ChevronDown size={16} /></>
                        )}
                    </button>
                )}
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCT_FEATURES.map(({ label, color }) => (
                    <div key={label} className={`flex items-center gap-2 text-sm bg-${color}-50 p-3 rounded-xl`}>
                        <Check size={16} className={`text-${color}-500 shrink-0`} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

ProductInfo.displayName = 'ProductInfo';