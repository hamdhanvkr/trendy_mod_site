import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

const PromoBanner = ({
    onExploreCollection,
    onViewLatestDrops,
    onShopFreeShipping
}) => {

    const [currentBanner, setCurrentBanner] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const banners = [
        {
            id: 'collection',
            title: "The Big Summer Edit.",
            subtitle: "Up to 50% off on premium toys",
            description: "Curated selections for creative minds. Limited time architectural and developmental toy event.",
            color: "from-blue-700 via-indigo-800 to-slate-900",
            badge: "SEASONAL EVENT",
            badgeColor: "border-blue-400/30 bg-blue-500/20 text-blue-200",
            buttonText: "Explore Collection",
            icon: <ShoppingBag className="w-24 h-24 text-blue-300/10" />,
            accentGlow: "bg-blue-400/20",
            onClick: onExploreCollection
        },
        {
            id: 'new-arrivals',
            title: "New Arrivals Just Landed",
            subtitle: "Discover the latest drops",
            description: "Fresh, sustainable, and educational designs from world-class brands arriving weekly.",
            color: "from-purple-700 via-purple-900 to-slate-900",
            badge: "NEW RELEASES",
            badgeColor: "border-purple-400/30 bg-purple-500/20 text-purple-200",
            buttonText: "View Latest Drops",
            icon: <Sparkles className="w-24 h-24 text-purple-300/10" />,
            accentGlow: "bg-purple-400/20",
            onClick: onViewLatestDrops
        },
        {
            id: 'free-shipping',
            title: "Complimentary Delivery",
            subtitle: "On orders above ₹1,000",
            description: "Seamless door-to-door logistics. No minimum fee overheads. Shop stress-free.",
            color: "from-emerald-700 via-teal-900 to-slate-900",
            badge: "EXCLUSIVE SERVICE",
            badgeColor: "border-emerald-400/30 bg-emerald-500/20 text-emerald-200",
            buttonText: "Shop with Free Shipping",
            icon: <Truck className="w-24 h-24 text-emerald-300/10" />,
            accentGlow: "bg-emerald-400/20",
            onClick: onShopFreeShipping
        }
    ];

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                setCurrentBanner((prev) => (prev + 1) % banners.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [isHovered, banners.length]);

    const nextSlide = () => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const banner = banners[currentBanner];

    return (
        <section className='py-4 container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Discover Play Without Limits
                        </h2>
                    </div>
                    <p className="text-slate-500 text-sm sm:text-base max-w-xl">
                        Find the perfect companion for every adventure.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 lg:mt-10 sm:px-6 lg:px-8 pb-2 sm:pb-4 antialiased mt-4">
                <div
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentBanner}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`relative bg-linear-to-br ${banner.color} p-6 pt-2 md:pt-0 sm:p-8 md:p-12 lg:p-16 xl:p-20 min-h-70 sm:min-h-80 md:min-h-100 lg:min-h-115 flex items-center overflow-hidden`}
                        >
                            {/* Background Micro Pattern */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                <div className="absolute inset-0 opacity-[0.03]" style={{
                                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                    backgroundSize: '24px 24px'
                                }} />

                                {/* Ambient Subtle Glows */}
                                <div className={`absolute -right-20 -top-20 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000 ${banner.accentGlow}`} />
                                <div className={`absolute left-1/3 -bottom-20 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 ${banner.accentGlow} opacity-60`} />
                            </div>

                            {/* Content Layout */}
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full">
                                <div className="lg:col-span-8 space-y-3 sm:space-y-4 md:space-y-6 max-w-2xl">
                                    {/* Tag Badge */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg border text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md ${banner.badgeColor}`}
                                    >
                                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        {banner.badge}
                                    </motion.div>

                                    <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                                        <motion.h2
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, ease: "easeOut" }}
                                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.1]"
                                        >
                                            {banner.title}
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-white/90 text-base sm:text-lg md:text-xl font-medium tracking-wide"
                                        >
                                            {banner.subtitle}
                                        </motion.p>
                                    </div>

                                    <motion.p
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-light"
                                    >
                                        {banner.description}
                                    </motion.p>

                                    {/* Action CTAs */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2"
                                    >
                                        <motion.button
                                            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={banner.onClick} // Use the banner-specific handler
                                            className="bg-white text-slate-950 hover:bg-slate-50 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-md"
                                        >
                                            <span>{banner.buttonText}</span>
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </motion.button>
                                    </motion.div>
                                </div>

                                {/* Decorative Container */}
                                <div className="hidden lg:flex lg:col-span-4 justify-end items-center pr-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="w-48 h-48 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-md flex items-center justify-center shadow-2xl relative"
                                    >
                                        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
                                        {banner.icon}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <div className="absolute inset-x-2 sm:inset-x-4 md:inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(15, 23, 42, 0.6)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={prevSlide}
                                    className="p-1.5 sm:p-2 md:p-2.5 rounded-xl bg-slate-900/30 border border-white/10 text-white/70 hover:text-white transition-all pointer-events-auto backdrop-blur-sm opacity-0 group-hover:opacity-100 hidden sm:block"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(15, 23, 42, 0.6)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={nextSlide}
                                    className="p-1.5 sm:p-2 md:p-2.5 rounded-xl bg-slate-900/30 border border-white/10 text-white/70 hover:text-white transition-all pointer-events-auto backdrop-blur-sm opacity-0 group-hover:opacity-100 hidden sm:block"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Micro-indicators */}
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 z-20">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentBanner(idx)}
                                className="py-1 focus:outline-none"
                                aria-label={`Go to slide ${idx + 1}`}
                            >
                                <div className="h-1 rounded-full bg-white/20 transition-all overflow-hidden relative w-4 sm:w-6">
                                    {currentBanner === idx && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute inset-0 bg-white"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Progress bar line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                        <motion.div
                            key={currentBanner}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 6, ease: "linear" }}
                            className="h-full bg-linear-to-r from-transparent via-white/50 to-transparent"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;