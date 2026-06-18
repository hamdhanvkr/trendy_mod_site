import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Truck, PartyPopper, Coins } from 'lucide-react';

const AnnouncementBar = () => {

    const [isVisible, setIsVisible] = useState(true);

    const announcements = [
        {
            text: "FREE GIFT WRAPPING ON ALL TOYS!",
            icon: <Sparkles size={14} className="text-blue-100 fill-blue-100/20 animate-pulse" />
        },
        {
            text: "Fast Toy Delivery (2-3 Working Days)",
            icon: <Truck size={14} className="text-blue-100" />
        },
        {
            text: "Free Shipping on Orders Above ₹1000",
            icon: <PartyPopper size={14} className="text-blue-100" />
        },
        {
            text: "Prepaid Orders Only (Super Safe Checkout)",
            icon: <Coins size={14} className="text-blue-100" />
        }
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white text-xs sm:text-sm font-bold py-2.5 border-b border-blue-800 tracking-wide shadow-md"
                >
                    {/* Container aligned to the left with right padding for the close button */}
                    <div className="w-full pl-6 pr-12 relative flex items-center justify-start">

                        {/* Marquee Container with a subtle fade mask before it hits the close button */}
                        <div
                            className="flex w-full overflow-hidden"
                            style={{
                                maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                                WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)'
                            }}
                        >
                            <motion.div
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                    duration: 22,
                                    repeat: Infinity,
                                    ease: "linear",
                                    repeatType: "loop"
                                }}
                                whileHover={{ animationPlayState: "paused" }}
                                className="whitespace-nowrap flex items-center cursor-pointer select-none"
                            >
                                {[...Array(2)].map((_, copyIndex) => (
                                    <div key={copyIndex} className="inline-flex items-center gap-8 pr-8">
                                        {announcements.map((item, idx) => (
                                            <div key={idx} className="inline-flex items-center text-xs gap-2.5 transition-transform duration-200 hover:scale-102 text-blue-50">
                                                <span className="flex items-center justify-center">{item.icon}</span>
                                                <span className="tracking-wide font-semibold">{item.text}</span>
                                                <span className="text-blue-200/40 font-normal ml-2">★</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Dismiss Button - Fixed on the right with a seamless matching blue gradient background */}
                        <div
                            className="absolute right-0 top-0 bottom-0 flex items-center pl-6 pr-3 z-10"
                            style={{
                                background: 'linear-gradient(to right, rgba(29, 78, 216, 0) 0%, rgba(29, 78, 216, 1) 40%)'
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
    );
};

export default AnnouncementBar;