import { motion } from 'framer-motion';
import { Gift, Award, Clock, Zap } from 'lucide-react';

function StatsSection() {

    const stats = [
        {
            icon: Gift,
            value: "1K+",
            label: "Happy Customers",
            accentBg: "bg-orange-500",
            iconColor: "text-orange-500 dark:text-orange-400",
            iconBg: "bg-orange-50 dark:bg-orange-950/40",
            hoverRing: "group-hover:ring-orange-100/80 dark:group-hover:ring-orange-900/30",
            glowBg: "group-hover:from-orange-500/[0.04]"
        },
        {
            icon: Award,
            value: "40+",
            label: "Toy Varieties",
            accentBg: "bg-amber-500",
            iconColor: "text-amber-500 dark:text-amber-400",
            iconBg: "bg-amber-50 dark:bg-amber-950/40",
            hoverRing: "group-hover:ring-amber-100/80 dark:group-hover:ring-amber-900/30",
            glowBg: "group-hover:from-amber-500/[0.04]"
        },
        {
            icon: Clock,
            value: "24/7",
            label: "Customer Support",
            accentBg: "bg-emerald-500",
            iconColor: "text-emerald-500 dark:text-emerald-400",
            iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
            hoverRing: "group-hover:ring-emerald-100/80 dark:group-hover:ring-emerald-900/30",
            glowBg: "group-hover:from-emerald-500/[0.04]"
        },
        {
            icon: Zap,
            value: "2-3 Days",
            label: "Fast Delivery",
            accentBg: "bg-blue-500",
            iconColor: "text-blue-500 dark:text-blue-400",
            iconBg: "bg-blue-50 dark:bg-blue-950/40",
            hoverRing: "group-hover:ring-blue-100/80 dark:group-hover:ring-blue-900/30",
            glowBg: "group-hover:from-blue-500/[0.04]"
        }
    ];

    return (
        <section className="w-full mt-6 mb-10 dark:bg-slate-900/50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-6 lg:mb-16"
                >
                    <span className="inline-flex items-center px-3.5 py-1 bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-widest rounded-md mb-3.5">
                        Performance Metrics
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Trusted by Thousands
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
                        Reliable operational milestones driving our commitment to product excellence.
                    </p>
                </motion.div>

                <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.7,
                                    ease: [0.21, 1.02, 0.43, 1.01]
                                }}
                                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:shadow-none hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_24px_48px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden"
                            >
                                {/* Premium Radial Glow */}
                                <div className={`absolute inset-0 bg-radial-gradient bg-linear-to-b ${stat.glowBg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                {/* Top Accent Line */}
                                <div className={`absolute top-0 left-0 right-0 h-1 ${stat.accentBg} opacity-85 group-hover:opacity-100 transition-all duration-300`} />

                                {/* Icon Container with Smooth Ring Expansion */}
                                <div className={`
                                    flex items-center justify-center mb-5 rounded-full w-14 h-14 mx-auto
                                    ${stat.iconBg} ${stat.iconColor}
                                    ring-0 group-hover:ring-8 ${stat.hoverRing}
                                    transition-all duration-300 ease-out
                                `}>
                                    <IconComponent className="w-6 h-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out" />
                                </div>

                                {/* Metric Content Wrapper */}
                                <div className="space-y-1 transform group-hover:scale-[1.02] transition-transform duration-300 ease-out">
                                    {/* Metric Value */}
                                    <dd className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight selection:bg-slate-100 dark:selection:bg-slate-800">
                                        {stat.value}
                                    </dd>

                                    {/* Label Description */}
                                    <dt className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                                        {stat.label}
                                    </dt>
                                </div>
                            </motion.div>
                        );
                    })}
                </dl>
            </div>
        </section>
    );
}

export default StatsSection;