import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Wallet, MessageCircle, Check } from 'lucide-react';
import { MAX_QUANTITY, MIN_QUANTITY } from '../constants';

export const ProductActions = React.memo(({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    onBuyNow,
    onWhatsAppSupport,
    inStock,
    isAdded = false
}) => {

    if (!product) return null;

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
                <span className="text-sm font-bold text-slate-800 tracking-wide">Quantity :</span>
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/40 shadow-inner">
                    <button
                        onClick={() => onQuantityChange('decrease')}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
                        disabled={quantity <= MIN_QUANTITY}
                        aria-label="Decrease quantity"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-800 text-sm select-none">
                        {quantity}
                    </span>
                    <button
                        onClick={() => onQuantityChange('increase')}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
                        disabled={quantity >= MAX_QUANTITY}
                        aria-label="Increase quantity"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            {/* Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
                <motion.button
                    whileHover={inStock ? { scale: 1.02 } : {}}
                    whileTap={inStock ? { scale: 0.98 } : {}}
                    onClick={onAddToCart}
                    className={`w-full sm:flex-1 py-2 sm:py-2.5 ${isAdded ? 'bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'
                        } text-white rounded-md font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none`}
                    disabled={!inStock}
                >
                    {isAdded ? (
                        <>
                            <Check size={16} className="sm:w-4 sm:h-4" />
                            <span>Added!</span>
                        </>
                    ) : (
                        <>
                            <ShoppingBag size={16} className="transition-transform sm:w-4 sm:h-4" />
                            <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={inStock ? { scale: 1.02 } : {}}
                    whileTap={inStock ? { scale: 0.98 } : {}}
                    onClick={onBuyNow}
                    className="w-full sm:flex-1 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    disabled={!inStock}
                >
                    <Wallet size={16} className="sm:w-4 sm:h-4" />
                    <span>Buy Now</span>
                </motion.button>
            </div>

            {/* WhatsApp Support */}
            <button
                onClick={onWhatsAppSupport}
                className="w-full py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-green-200/50"
            >
                <MessageCircle size={16} />
                Need Help? Chat with us on WhatsApp
            </button>
        </div>
    );
});

ProductActions.displayName = 'ProductActions';