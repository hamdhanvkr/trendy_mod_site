import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck, ShieldCheck, Box } from 'lucide-react';
import OrderForm from '@/features/order/components/OrderForm';

const CartDrawer = ({ isOpen, onClose, cart, setCart }) => {

    const [showOrderForm, setShowOrderForm] = useState(false);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Delivery settings
    const deliveryCharge = 80;
    const freeDeliveryThreshold = 1000;
    const isFreeDelivery = subtotal >= freeDeliveryThreshold;
    const total = isFreeDelivery ? subtotal : subtotal + deliveryCharge;

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 99) return;
        setCart(prev =>
            prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
        );
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        if (window.confirm('Are you sure you want to clear all items from your cart?')) {
            setCart([]);
        }
    };

    const handleProceed = () => {
        if (cart.length === 0) return;
        setShowOrderForm(true);
    };

    const renderProductImage = (item) => {
        if (item.image) {
            return (
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                />
            );
        }

        return (
            <div className="w-full h-full bg-linear-to-br from-blue-50 to-indigo-50/50 flex items-center justify-center rounded-xl border border-blue-100/50">
                <Box size={20} className="text-blue-500/80" />
            </div>
        );
    };

    return (
        <>
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

                        {/* Responsive Drawer Container - Fully scrollable */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-100"
                        >
                            {/* Header - Part of scroll flow */}
                            <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between">
                                <div className="min-w-0 pr-2">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag size={18} className="text-blue-600 shrink-0" />
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">Shopping Cart</h2>
                                        <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                                            {totalItems}
                                        </span>
                                    </div>
                                    {cart.length > 0 && (
                                        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium truncate">
                                            {isFreeDelivery
                                                ? "✨ Premium tier: Free Delivery applied"
                                                : `Add ₹${freeDeliveryThreshold - subtotal} more for free delivery`}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                    {cart.length > 0 && (
                                        <button
                                            onClick={clearCart}
                                            className="text-xs text-slate-400 hover:text-red-600 font-semibold px-2 py-1.5 hover:bg-red-50/50 rounded-lg transition-all"
                                        >
                                            Clear
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                                        aria-label="Close panel"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Main Content - No fixed height, flows naturally */}
                            <div className="p-4 sm:p-5 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center px-4 py-12">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100/40 mb-4">
                                            <ShoppingBag size={22} className="text-blue-500" />
                                        </div>
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Your cart is empty</h3>
                                        <p className="text-xs text-slate-400 max-w-60 mt-1 mb-5">
                                            Explore our product lines to add curated items to your selection.
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="inline-flex items-center justify-center text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-4 py-2.5 rounded-lg transition-all"
                                        >
                                            Return to Shop
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Product Items List */}
                                        <div className="space-y-3">
                                            {cart.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    className="group relative bg-white border border-slate-100 rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center gap-3 transition-all duration-200 hover:border-blue-100 hover:shadow-[0_4px_16px_rgba(37,99,235,0.03)]"
                                                >
                                                    {/* Media Window Container */}
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0 relative overflow-hidden bg-slate-50 border border-slate-100 group-hover:border-blue-100 transition-colors duration-200">
                                                        {renderProductImage(item)}
                                                    </div>

                                                    {/* Typography Content Block */}
                                                    <div className="flex-1 min-w-30 sm:min-w-0">
                                                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate leading-snug group-hover:text-blue-900 transition-colors">
                                                            {item.name}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                                                            <span className="text-slate-900 font-extrabold text-xs sm:text-sm">₹{item.price}</span>
                                                            {item.discount > 0 && (
                                                                <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                                                    {item.discount}% OFF
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Responsive Controls Wrapper Group */}
                                                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 border-t border-slate-50 pt-2 mt-1 sm:border-0 sm:pt-0 sm:mt-0">
                                                        {/* Counter Box with explicit touch sizes */}
                                                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-7 h-7 sm:w-6 sm:h-6 rounded-md flex items-center justify-center hover:bg-white text-slate-500 hover:text-blue-600 transition-all disabled:opacity-30"
                                                                disabled={item.quantity <= 1}
                                                                aria-label="Reduce"
                                                            >
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className="w-6 text-center font-bold text-xs text-slate-800 select-none">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-7 h-7 sm:w-6 sm:h-6 rounded-md flex items-center justify-center hover:bg-white text-slate-500 hover:text-blue-600 transition-all"
                                                                aria-label="Increase"
                                                            >
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>

                                                        {/* Structural Pricing & Clean Elimination */}
                                                        <div className="text-right min-w-16">
                                                            <p className="font-black text-slate-900 text-xs sm:text-sm">
                                                                ₹{item.price * item.quantity}
                                                            </p>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-slate-400 hover:text-red-600 text-[10px] sm:text-[11px] font-semibold inline-flex items-center gap-1 mt-0.5 transition-colors"
                                                            >
                                                                <Trash2 size={10} /> Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Logistics Banner */}
                                        <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5">
                                            <Truck size={15} className="text-blue-600 mt-0.5 shrink-0" />
                                            <div className="text-[11px] sm:text-xs">
                                                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 font-bold text-slate-800">
                                                    <span>Delivery Fulfillment</span>
                                                    {isFreeDelivery ? (
                                                        <span className="text-blue-700 bg-blue-50 border border-blue-100/50 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]">Complimentary</span>
                                                    ) : (
                                                        <span className="text-slate-600 font-normal">Standard (₹{deliveryCharge})</span>
                                                    )}
                                                </div>
                                                {!isFreeDelivery && (
                                                    <p className="text-slate-500 mt-0.5 sm:mt-1 font-medium">
                                                        Add <span className="font-bold text-blue-600">₹{freeDeliveryThreshold - subtotal}</span> more for free delivery.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer - Part of scroll flow, not fixed */}
                                        <div className="border-t border-slate-100 pt-4 sm:pt-5 mt-2">
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-xs font-semibold text-slate-500">
                                                    <span>Subtotal ({totalItems} items)</span>
                                                    <span className="text-slate-900">₹{subtotal}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-semibold text-slate-500">
                                                    <span>Fulfillment fee</span>
                                                    <span className={isFreeDelivery ? "text-blue-600 font-bold" : "text-slate-900"}>
                                                        {isFreeDelivery ? "₹0" : `₹${deliveryCharge}`}
                                                    </span>
                                                </div>
                                                <div className="border-t border-slate-200/60 pt-2.5 mt-1">
                                                    <div className="flex justify-between items-baseline">
                                                        <span className="text-xs sm:text-sm font-bold text-slate-900">Total Bill</span>
                                                        <span className="text-lg sm:text-xl font-black text-blue-600">₹{total}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Submissions Buttons */}
                                            <button
                                                onClick={handleProceed}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-blue-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                Proceed to Order
                                                <ArrowRight size={15} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>

                                            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium text-center mt-3">
                                                <ShieldCheck size={12} className="text-blue-600 shrink-0" />
                                                <span className="truncate">Secure checkout • Finalize order via WhatsApp</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Order Form Modal Panel Context */}
            <OrderForm
                isOpen={showOrderForm}
                onClose={() => setShowOrderForm(false)}
                cart={cart}
                total={total}
                onOrderComplete={() => {
                    setShowOrderForm(false);
                    onClose();
                }}
            />
        </>
    );
};

export default CartDrawer;