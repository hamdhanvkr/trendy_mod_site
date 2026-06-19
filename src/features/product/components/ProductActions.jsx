import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Wallet, MessageCircle } from 'lucide-react';
import { MAX_QUANTITY, MIN_QUANTITY } from '../constants';

export const ProductActions = React.memo(({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    onBuyNow,
    onWhatsAppSupport,
    inStock
}) => {

    if (!product) return null;

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
                <span className="text-sm font-bold text-slate-800 tracking-wide">Quantity:</span>
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
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                    whileHover={inStock ? { scale: 1.01, y: -1 } : {}}
                    whileTap={inStock ? { scale: 0.99 } : {}}
                    onClick={onAddToCart}
                    className={`flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-sm`}
                    disabled={!inStock}
                >
                    <ShoppingBag size={18} />
                    <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
                <motion.button
                    whileHover={inStock ? { scale: 1.01, y: -1 } : {}}
                    whileTap={inStock ? { scale: 0.99 } : {}}
                    onClick={onBuyNow}
                    className="flex-1 py-3.5 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                    disabled={!inStock}
                >
                    <Wallet size={18} />
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