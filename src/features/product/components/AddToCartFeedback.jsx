import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export const AddToCartFeedback = React.memo(({ isOpen }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2"
                    >
                        <Check size={18} />
                        Added to Cart!
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
});

AddToCartFeedback.displayName = 'AddToCartFeedback';