import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Gift, Star, Target, ShoppingBag, Paintbrush, Rocket, Crown, Zap, Heart, Camera, Music, BookOpen, Palette } from 'lucide-react';

const HeroSection = ({ onShopNow, onViewCollection }) => {

    const [isHovering, setIsHovering] = useState(false);
    const mouseX = useSpring(0, { stiffness: 60, damping: 25 });
    const mouseY = useSpring(0, { stiffness: 60, damping: 25 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const floatingElements = [
        { icon: <Gift className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />, delay: 0, x: '6%', y: '15%', glow: 'shadow-indigo-400/20' },
        { icon: <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />, delay: 0.5, x: '90%', y: '10%', glow: 'shadow-amber-400/20' },
        { icon: <Paintbrush className="w-4 h-4 md:w-5 md:h-5 text-sky-400" />, delay: 1, x: '5%', y: '75%', glow: 'shadow-sky-400/20' },
        { icon: <Star className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />, delay: 1.5, x: '94%', y: '70%', glow: 'shadow-indigo-400/20' },
        { icon: <Target className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />, delay: 2, x: '50%', y: '6%', glow: 'shadow-emerald-400/20' },
        { icon: <Rocket className="w-4 h-4 md:w-5 md:h-5 text-rose-400" />, delay: 0.8, x: '15%', y: '45%', glow: 'shadow-rose-400/20' },
        { icon: <Crown className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />, delay: 1.2, x: '82%', y: '40%', glow: 'shadow-amber-500/20' },
        { icon: <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />, delay: 0.3, x: '75%', y: '55%', glow: 'shadow-yellow-400/20' },
        { icon: <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />, delay: 1.8, x: '25%', y: '88%', glow: 'shadow-pink-400/20' },
        { icon: <Camera className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />, delay: 0.6, x: '88%', y: '85%', glow: 'shadow-purple-400/20' },
        { icon: <Music className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />, delay: 1.4, x: '45%', y: '92%', glow: 'shadow-teal-400/20' },
        { icon: <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />, delay: 2.2, x: '60%', y: '45%', glow: 'shadow-blue-400/20' },
        { icon: <Palette className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />, delay: 0.9, x: '35%', y: '10%', glow: 'shadow-orange-400/20' },
    ];

    return (
        <div className="relative overflow-hidden bg-white min-h-162.5 flex items-center selection:bg-indigo-600 selection:text-white">

            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-size-[24px_24px] sm:bg-size-[32px_32px] hidden sm:block opacity-60 md:opacity-80 lg:opacity-100" />
            </div>

            {/* Floating Elements */}
            {floatingElements.map((item, index) => (
                <motion.div
                    key={index}
                    className={`absolute hidden sm:flex items-center justify-center p-2.5 md:p-3 rounded-2xl bg-white shadow-md ${item.glow} border border-slate-100 pointer-events-none z-10 hover:scale-110 transition-transform duration-300`}
                    style={{ left: item.x, top: item.y }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 0.85,
                        y: [10, -10, 10],
                        rotate: [0, 4, -4, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        delay: item.delay,
                        duration: 5 + (index % 3),
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                >
                    {item.icon}
                </motion.div>
            ))}

            <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10 py-12 sm:py-16 lg:py-0">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Left Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="text-slate-800 space-y-6 sm:space-y-8 text-center lg:text-left lg:col-span-7 order-2 lg:order-1"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-indigo-50/70 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-indigo-100 shadow-sm"
                        >
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase text-indigo-700">New Arrivals Every Week</span>
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.10] text-slate-900">
                            Bring Joy to <br />
                            <span className="bg-linear-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                                Every Child
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                            Explore educational, fun, and creative toys crafted to spark endless imagination and
                            create unforgettable milestones for your little ones.
                        </p>

                        {/* Features layout */}
                        <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center lg:justify-start">
                            {[
                                { icon: <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />, text: "Premium Quality" },
                                { icon: <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />, text: "5,000+ Happy Kids" },
                                { icon: <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />, text: "Educational & Fun" }
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white border border-slate-100 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm">
                                    {feat.icon}
                                    <span className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wide">{feat.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3.5 pt-2 justify-center lg:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onShopNow}
                                className="group w-full sm:w-auto bg-indigo-600 text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/10 hover:shadow-xl hover:shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center gap-2.5"
                            >
                                <ShoppingBag className="w-5 h-5 text-white" />
                                <span>Shop Now</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onViewCollection}
                                className="w-full sm:w-auto border border-slate-200 text-slate-700 bg-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold transition-all duration-300 shadow-sm"
                            >
                                View Collection
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Content Column */}
                    <motion.div
                        style={{ x: mouseX, y: mouseY }}
                        className="relative flex justify-center items-center lg:col-span-5 order-1 lg:order-2 will-change-transform"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <div className="relative w-full max-w-72.5 sm:max-w-90 md:max-w-100 aspect-square">
                            <div className="relative w-full h-full">
                                <motion.div
                                    className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 sm:border-[6px] border-white bg-linear-to-b from-slate-50 to-slate-100 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.08)] flex items-center justify-center backdrop-blur-sm"
                                    animate={{
                                        rotate: isHovering ? [0, 1, -1, 0.5, -0.5, 0] : 0,
                                        scale: isHovering ? 1.01 : 1
                                    }}
                                    transition={{
                                        duration: isHovering ? 5 : 0.4,
                                        repeat: isHovering ? Infinity : 0,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="w-full h-full bg-white flex items-center justify-center relative">
                                        <div className="text-center select-none p-4 z-10">
                                            <div className="text-[85px] sm:text-[105px] md:text-[120px] drop-shadow-xl animate-bounce [animation-duration:3s] tracking-normal">
                                                🐼
                                            </div>
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-sm border border-slate-200/60 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 hover:border-slate-300">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                                                <span className="text-[10px] tracking-widest font-black text-slate-600 uppercase">Featured Toy</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-6 sm:inset-8 rounded-full border-2 border-dashed border-slate-200/60 pointer-events-none mix-blend-multiply opacity-70 animate-[spin_120s_linear_infinite]" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute z-20 top-4 right-2 sm:top-8 sm:right-4 bg-sky-500 text-white font-extrabold text-[10px] sm:text-xs tracking-wider px-3.5 py-1.5 rounded-full shadow-lg shadow-sky-500/20 border-2 border-white flex items-center gap-1"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <span>🌟</span> New
                                </motion.div>

                                <motion.div
                                    className="absolute z-20 top-24 -right-4 sm:top-32 sm:-right-6 bg-indigo-600 text-white font-extrabold text-[10px] sm:text-xs tracking-wider px-3.5 py-1.5 rounded-full shadow-lg shadow-indigo-600/20 border-2 border-white flex items-center gap-1"
                                    animate={{ y: [0, 4, 0] }}
                                    transition={{ duration: 2.5, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <span>🔥</span> Top Pick
                                </motion.div>

                                <motion.div
                                    className="absolute z-30 -left-6 sm:-left-8 bg-linear-to-br from-rose-500 via-rose-600 to-rose-700 text-white shadow-[0_20px_40px_-8px_rgba(244,63,94,0.35)] rounded-2xl p-3 sm:p-4 border-2 border-white/30"
                                    style={{ top: '22%' }}
                                    animate={{
                                        scale: isHovering ? 1.06 : 1,
                                        rotate: isHovering ? [-1, 2, -2, 1, 0] : -3
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-[7px] sm:text-[9px] uppercase tracking-widest font-black text-rose-100 opacity-90">Special</span>
                                        <span className="text-[7px] sm:text-[9px] uppercase tracking-widest font-black text-rose-100 opacity-90 -mt-0.5">Offer</span>
                                        <span className="text-white font-black text-base sm:text-xl mt-1 tracking-tight drop-shadow-sm">Rs. 129</span>
                                        <div className="relative flex items-center mt-0.5">
                                            <span className="text-rose-200/70 text-[9px] sm:text-[11px] font-bold line-through decoration-white/50 decoration-2">Rs. 149</span>
                                        </div>
                                        <div className="mt-1.5 bg-white text-rose-600 text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wide">40% OFF</div>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="absolute -top-4 -right-4 text-2xl sm:text-3xl select-none drop-shadow-md animate-spin [animation-duration:40s] pointer-events-none opacity-80">🎈</div>
                            <div className="absolute -bottom-4 -left-4 text-2xl sm:text-3xl select-none drop-shadow-md animate-spin [animation-duration:30s] [animation-direction:reverse] pointer-events-none opacity-80">✨</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;