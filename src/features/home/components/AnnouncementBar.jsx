import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Truck, ShieldCheck, Zap } from 'lucide-react';

const AnnouncementBar = () => {

    const [isVisible, setIsVisible] = useState(true);

    const scrollingAnnouncements = [
        {
            text: "Free shipping on orders above ₹1,000",
            icon: <Truck size={15} className="text-blue-600" />,
        },
        {
            text: "100% Trusted Website",
            icon: <ShieldCheck size={15} className="text-green-600" />,
        },
        {
            text: "Fast & Secure Delivery in 2–3 Working Days",
            icon: <Zap size={15} className="text-amber-500" />,
        },
    ];

    const marqueeItems = [
        ...scrollingAnnouncements,
        ...scrollingAnnouncements,
        ...scrollingAnnouncements,
        ...scrollingAnnouncements,
    ];

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative overflow-hidden bg-linear-to-r from-blue-700 via-blue-600 to-blue-700 text-white text-xs sm:text-sm font-bold py-2.5 border-b border-blue-800 tracking-wide shadow-md"
                    >
                        <div className="w-full pl-16 pr-8 relative flex items-center justify-center">
                            {/* Static content - centered */}
                            <div
                                className="flex w-full overflow-hidden justify-center"
                                style={{
                                    maskImage: 'linear-linear(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                                    WebkitMaskImage: 'linear-linear(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)'
                                }}
                            >
                                <div className="whitespace-nowrap flex items-center select-none">
                                    <div className="inline-flex items-center gap-8 pr-8">
                                        <div className="inline-flex items-center text-xs gap-2.5 text-blue-50">
                                            <span className="flex items-center justify-center">
                                                <Coins size={14} className="text-blue-200" />
                                            </span>
                                            <span className="tracking-wide font-bold">NO COD | Prepaid Orders Only</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dismiss Button */}
                            <div
                                className="absolute right-0 top-0 bottom-0 flex items-center pl-6 pr-3 z-10"
                                style={{
                                    background: 'linear-linear(to right, rgba(29, 78, 216, 0) 0%, rgba(29, 78, 216, 1) 40%)'
                                }}
                            >
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="text-white hover:bg-white/20 p-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Dismiss announcement"
                                >
                                    <X size={15} className="stroke-[2.5]" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SECOND BAR - CONTINUOUS SCROLLING WITH NO GAPS */}
            <div className="relative overflow-hidden border-b border-gray-200 bg-linear-to-r from-slate-50 via-white to-slate-50 py-2.5">
                <div className="absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r from-slate-50 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l from-slate-50 to-transparent pointer-events-none" />
                <motion.div
                    className="flex w-max items-center"
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    style={{ willChange: 'transform' }}
                >
                    {marqueeItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex shrink-0 items-center gap-3 px-6"
                        >
                            <span className="flex items-center justify-center">
                                {item.icon}
                            </span>
                            <span className="text-xs font-medium tracking-wide text-gray-700 whitespace-nowrap">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </>
    );
};

export default AnnouncementBar;