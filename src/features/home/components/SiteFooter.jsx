import { motion } from 'framer-motion';
import { FaInstagram, FaCode, FaWhatsapp, FaFacebook, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';

function SiteFooter() {

    const currentYear = new Date().getFullYear();

    const developers = [
        {
            name: "Mohamed Hamdhan J",
            role: "Software Engineer",
            portfolio: "https://hamdhan--portfolio.web.app/",
            linkedin: "https://www.linkedin.com/in/mohamedhamdhan/"
        },
        {
            name: "Mohamed Jainul Haneef M I",
            role: "Software Engineer",
            portfolio: "https://haneef-portfolio-nu.vercel.app/",
            linkedin: "http://www.linkedin.com/in/mohamed-jainul-haneef-m-i-45a015303"
        }
    ];

    return (
        <footer className="relative bg-linear-to-b from-slate-950 via-gray-950 to-black text-slate-200 pt-12 pb-8 border-t border-slate-900 overflow-hidden">
            {/* Removed px-6 lg:px-0 from footer */}

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Added proper container padding */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 pb-12 border-b border-slate-900">
                    {/* Removed md:justify-items-center and max-w-sm */}

                    {/* Section 1: Brand Info */}
                    <div className="space-y-5">
                        <div>
                            <span className="font-extrabold text-2xl tracking-tight text-blue-500 bg-clip-text">
                                Trendy Mod
                            </span>
                            <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold mt-1">Est. 2026</p>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed text-justify">
                            Spreading joy, creativity, and unforgettable childhood memories one toy at a time. Thoughtfully handcrafted with love, exceptional precision, and a rich multi-generational heritage proudly rooted in India.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400 pt-1">
                            <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                                <span className="text-blue-400 font-bold">•</span> 100% Handcrafted
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                                <span className="text-indigo-400 font-bold">•</span> Eco-friendly
                            </span>
                        </div>
                    </div>

                    {/* Section 2: Contact */}
                    <div className="space-y-5 lg:px-24">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contact Us</h5>

                        <div className="space-y-3.5">
                            <div className="flex items-center gap-3 text-sm text-slate-300 group">
                                <MdEmail className="text-slate-500 group-hover:text-blue-400 transition-colors text-lg shrink-0" />
                                <a href="mailto:trendymod.in@gmail.com" className="hover:text-blue-400 transition-colors">
                                    trendymod.in@gmail.com
                                </a>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-slate-300 group">
                                <MdPhone className="text-slate-500 group-hover:text-blue-400 transition-colors text-lg shrink-0" />
                                <a href="tel:+6381374203" className="hover:text-blue-400 transition-colors">
                                    +91 6381374203
                                </a>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <IoLocationOutline className="text-slate-500 text-lg shrink-0" />
                                <span>Tiruchirappalli, Tamil Nadu, India</span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            {[
                                { icon: FaInstagram, color: 'hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-500 hover:text-white', label: 'Instagram', url: 'https://www.instagram.com/trendymod.in?igsh=bTRjemk0aG5sZXpz&utm_source=qr' },
                                { icon: FaFacebook, color: 'hover:bg-blue-600 hover:text-white', label: 'Facebook', url: 'https://facebook.com' },
                                { icon: FaWhatsapp, color: 'hover:bg-green-600 hover:text-white', label: 'WhatsApp', url: 'https://wa.me/916381374203' },
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 ${social.color} transition-all duration-200 text-base`}
                                    aria-label={social.label}
                                >
                                    <social.icon />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Developers */}
                    <div className="space-y-5">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Designed & Developed By</h5>
                        <div className="space-y-3">
                            {developers.map((dev, idx) => (
                                <div
                                    key={idx}
                                    className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-between gap-4 group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                                            {dev.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">{dev.role}</p>
                                    </div>

                                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                                        <motion.a
                                            href={dev.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1 }}
                                            className="p-2 text-slate-400 hover:text-blue-400 bg-slate-900 rounded-lg border border-slate-800 text-sm"
                                            title="Portfolio"
                                        >
                                            <FaGlobe />
                                        </motion.a>
                                        <motion.a
                                            href={dev.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1 }}
                                            className="p-2 text-slate-400 hover:text-blue-400 bg-slate-900 rounded-lg border border-slate-800 text-sm"
                                            title="LinkedIn"
                                        >
                                            <FaLinkedin />
                                        </motion.a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 pb-2 text-xs text-slate-500">
                    <div className="font-medium tracking-wide">
                        © {currentYear} <span className="text-blue-400 font-semibold">Trendy Mod</span>. All rights reserved.
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 font-mono">
                        <FaCode className="text-xs text-slate-500" />
                        <span className="tracking-wider font-semibold text-[11px]">v2.1.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default SiteFooter;