import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTiktok, FaTwitter, FaYoutube, FaHeart, FaArrowRight, FaCode } from 'react-icons/fa';
import { MdEmail, MdPhone, MdWhatsapp } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';

function SiteFooter() {

    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert(`Subscribed with: ${email}`);
        setEmail('');
    };

    return (
        <footer className="relative bg-gradient-to-b from-slate-900 via-gray-950 to-black text-slate-200 pt-6 md:pt-20 pb-8 border-t border-slate-800/60 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 md:px-10 relative z-10">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800/60">

                    {/* Brand Section (4 Columns) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div>
                                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                    Trendy Mod
                                </span>
                                <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold mt-0.5">Est. 2020</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Spreading joy one toy at a time. Handcrafted with love, precision, and multi-generational heritage in India.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/40">
                                <span className="text-orange-400 font-bold">•</span> 100% Handcrafted
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/40">
                                <span className="text-pink-400 font-bold">•</span> Eco-friendly
                            </span>
                        </div>
                    </div>

                    {/* Quick Links (2 Columns) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-200 mb-6">Explore</h4>
                        <ul className="space-y-3.5 text-sm">
                            {['About Us', 'Our Story', 'Shop All', 'Custom Orders', 'Contact'].map((item, idx) => (
                                <li key={idx}>
                                    <motion.a
                                        href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                        whileHover={{ x: 4 }}
                                        className="text-slate-400 hover:text-orange-400 transition-colors duration-200 flex items-center font-medium"
                                    >
                                        {item}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policies (2 Columns) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-200 mb-6">Support</h4>
                        <ul className="space-y-3.5 text-sm">
                            {['Shipping Policy', 'Returns & Exchanges', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((item, idx) => (
                                <li key={idx}>
                                    <motion.a
                                        href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                        whileHover={{ x: 4 }}
                                        className="text-slate-400 hover:text-orange-400 transition-colors duration-200 flex items-center font-medium"
                                    >
                                        {item}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Contact (4 Columns) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div>
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-200 mb-3">Stay in the Loop</h4>
                            <p className="text-xs text-slate-400 mb-4">Subscribe to receive special offers, free giveaways, and once-in-a-lifetime deals.</p>
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 w-full transition-all"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white p-2.5 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/10 transition-all"
                                    aria-label="Subscribe"
                                >
                                    <FaArrowRight className="text-sm" />
                                </motion.button>
                            </form>
                        </div>

                        <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Connect With Us</h5>
                            <div className="flex gap-2.5">
                                {[
                                    { icon: FaInstagram, color: 'hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-500 hover:text-white', label: 'Instagram', url: 'https://instagram.com' },
                                    { icon: FaFacebook, color: 'hover:bg-blue-600 hover:text-white', label: 'Facebook', url: 'https://facebook.com' },
                                    { icon: FaTiktok, color: 'hover:bg-black hover:text-cyan-400 border-white/10', label: 'TikTok', url: 'https://tiktok.com' },
                                    { icon: FaTwitter, color: 'hover:bg-sky-500 hover:text-white', label: 'Twitter', url: 'https://twitter.com' },
                                    { icon: FaYoutube, color: 'hover:bg-red-600 hover:text-white', label: 'YouTube', url: 'https://youtube.com' }
                                ].map((social, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -4, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 ${social.color} transition-all duration-300 text-lg shadow-sm`}
                                        aria-label={social.label}
                                    >
                                        <social.icon />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Micro-Contact Grid Information Strip */}
                <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-400 border-b border-slate-800/40">
                    <a href="mailto:support@trendymod.com" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900/40 transition-colors group w-full">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                            <MdEmail className="text-base" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 font-bold uppercase truncate">Email Support</p>
                            <span className="font-medium group-hover:text-slate-200 block truncate">support@trendymod.com</span>
                        </div>
                    </a>
                    <a href="tel:+919876543210" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900/40 transition-colors group w-full">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                            <MdPhone className="text-base" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 font-bold uppercase truncate">Call Us</p>
                            <span className="font-medium group-hover:text-slate-200 block truncate">+91 98765 43210</span>
                        </div>
                    </a>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900/40 transition-colors group w-full">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors shrink-0">
                            <MdWhatsapp className="text-base" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 font-bold uppercase truncate">WhatsApp Chat</p>
                            <span className="font-medium group-hover:text-slate-200 block truncate">Instant Assistance</span>
                        </div>
                    </a>
                    <div className="flex items-center gap-3 p-3 rounded-xl cursor-default w-full">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
                            <IoLocationOutline className="text-base" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 font-bold uppercase truncate">Headquarters</p>
                            <span className="font-medium text-slate-300 block truncate">Mumbai, India</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Developer Credits */}
                <div className="pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 text-xs text-slate-500 text-center lg:text-left">
                    <div className="font-medium tracking-wide">
                        © {currentYear} <span className="text-slate-400 font-semibold">Trendy Mod</span>. All rights reserved.
                    </div>

                    {/* Developer Credits */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-950/60 px-4 py-2 rounded-full border border-slate-800/80 backdrop-blur-sm shadow-inner">
                        <span>Made with</span>
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="text-red-500 mx-0.5 flex items-center justify-center"
                        >
                            <FaHeart className="inline text-xs" />
                        </motion.span>
                        <span>by</span>

                        <motion.a
                            href="https://hamdhan--portfolio.web.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ color: '#f97316' }}
                            className="text-slate-400 hover:text-orange-400 font-semibold transition-colors"
                        >
                            Mohamed Hamdhan J
                        </motion.a>
                        <span>&</span>
                        <motion.a
                            href="https://haneef-portfolio-nu.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ color: '#f97316' }}
                            className="text-slate-400 hover:text-orange-400 font-semibold transition-colors"
                        >
                            Mohamed Jainul Haneef M I
                        </motion.a>

                        <span className="text-slate-700 mx-1">|</span>

                        <motion.a
                            href="https://github.com/your-repo/trendy-mod"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ color: '#f97316' }}
                            className="text-slate-500 hover:text-orange-400 transition-colors font-medium"
                        >
                            View Source
                        </motion.a>
                    </div>

                    {/* App Version System Status tag */}
                    <div className="flex items-center gap-2 bg-slate-900/40 px-2.5 py-1 rounded-md border border-slate-800/50 text-slate-400 text-[11px] shrink-0">
                        <FaCode className="text-xs text-slate-500" />
                        <span className="font-mono tracking-wider font-semibold">v2.1.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default SiteFooter;