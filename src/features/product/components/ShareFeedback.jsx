import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, CheckCheck } from 'lucide-react';

export const ShareFeedback = React.memo(({ isOpen, isCopied }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2"
                    >
                        {isCopied ? (
                            <>
                                <CheckCheck size={18} />
                                Link Copied!
                            </>
                        ) : (
                            <>
                                <Share2 size={18} />
                                Share dialog opened!
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
});

ShareFeedback.displayName = 'ShareFeedback';