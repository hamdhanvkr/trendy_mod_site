import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrendyLogo from '/TrendyLogo.png';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Grid,
    Sparkles,
    Palette,
    Monitor,
    Layers,
    Heart,
    Home,
    Search,
    ChevronDown,
    X,
    MessageCircle
} from 'lucide-react';

const HomeHeader = ({
    onCategorySelect,
    onSearch,
    cartCount = 0,
    onCartOpen,
    onWishlistOpen,
    wishlistCount = 0,
    isCartOpen = false,
    isWishlistOpen = false,
    onCartClose,
    onWishlistClose
}) => {

    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [showSearch, setShowSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
    const [showMobileDrawer, setShowMobileDrawer] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const isDrawerOpen = useRef(false);

    // Update active tab based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') {
            setActiveTab('home');
        } else if (path.includes('/products')) {
            setActiveTab('categories');
        } else if (path.includes('/wishlist')) {
            setActiveTab('wishlist');
        } else if (path.includes('/cart')) {
            setActiveTab('cart');
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowCategoriesDropdown(false);
                setShowMobileDrawer(false);
                if (isCartOpen && onCartClose) onCartClose();
                if (isWishlistOpen && onWishlistClose) onWishlistClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCartOpen, isWishlistOpen, onCartClose, onWishlistClose]);

    // Handle browser back button for drawers
    useEffect(() => {
        const handlePopState = () => {
            if (isCartOpen && onCartClose) {
                onCartClose();
                window.history.pushState(null, '', window.location.href);
                return true;
            }
            if (isWishlistOpen && onWishlistClose) {
                onWishlistClose();
                window.history.pushState(null, '', window.location.href);
                return true;
            }
            return false;
        };

        // Add a history state when drawers open
        if (isCartOpen || isWishlistOpen) {
            if (!isDrawerOpen.current) {
                isDrawerOpen.current = true;
                window.history.pushState({ drawerOpen: true }, '', window.location.href);
            }
            window.addEventListener('popstate', handlePopState);
        } else {
            isDrawerOpen.current = false;
            window.removeEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isCartOpen, isWishlistOpen, onCartClose, onWishlistClose]);

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        if (onSearch) onSearch(val);
    };

    const categories = [
        {
            id: 'panda',
            name: 'Panda Collection',
            icon: 'Sparkles',
            count: 14,
            tag: 'Signature',
        },
        {
            id: 'colorchangingpanda',
            name: 'Magic Pandas',
            icon: 'Palette',
            count: 3,
            tag: 'Trending',
        },
        {
            id: 'shinchan',
            name: 'Shinchan Stands',
            icon: 'Monitor',
            count: 3,
            tag: 'Limited',
        },
    ];

    const iconMap = {
        Sparkles: <Sparkles size={16} />,
        Palette: <Palette size={16} />,
        Monitor: <Monitor size={16} />,
        Layers: <Layers size={16} />
    };

    const tabbarItems = [
        { id: 'home', label: 'Home', icon: <Home size={18} />, path: '/' },
        { id: 'categories', label: 'Categories', icon: <Grid size={18} /> },
        { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} />, badge: wishlistCount, action: onWishlistOpen },
        { id: 'cart', label: 'Cart', icon: <ShoppingBag size={18} />, badge: cartCount, action: onCartOpen },
    ];

    const handleCategoryClick = (id) => {
        onCategorySelect?.(id);
        setShowCategoriesDropdown(false);
        setShowMobileDrawer(false);
    };

    const handleWhatsAppClick = () => {
        window.open('https://wa.me/919629601141', '_blank');
    };

    // Handle wishlist open with history push
    const handleWishlistOpen = () => {
        if (onWishlistOpen) {
            onWishlistOpen();
            window.history.pushState({ drawerOpen: true }, '', window.location.href);
        }
    };

    // Handle cart open with history push
    const handleCartOpen = () => {
        if (onCartOpen) {
            onCartOpen();
            window.history.pushState({ drawerOpen: true }, '', window.location.href);
        }
    };

    const CategoryList = () => (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2">Collections</span>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-left focus:outline-none"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 w-5 h-5 flex items-center justify-center">
                            {iconMap[cat.icon]}
                        </span>
                        <div>
                            <div className="text-xs font-medium text-slate-700">{cat.name}</div>
                            <div className="text-[11px] text-slate-400">{cat.count} Artifacts</div>
                        </div>
                    </div>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {cat.tag}
                    </span>
                </button>
            ))}
        </div>
    );

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${isScrolled
                    ? 'bg-white backdrop-blur-xl border-b border-blue-100/50 shadow-[0_8px_30px_rgb(37,99,235,0.03)] py-1'
                    : 'bg-white border-b border-transparent'
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">

                        {/* BRAND & LOGO */}
                        <div
                            className="flex items-center cursor-pointer select-none flex-shrink-0"
                            onClick={() => window.location.href = '/'}
                        >
                            <motion.img
                                src={TrendyLogo}
                                alt="Trendy Mod Logo"
                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain block"
                                whileHover={{ scale: 1.05, rotate: -1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            />
                        </div>

                        {/* SEARCH BAR (Desktop) */}
                        <div className="hidden lg:flex flex-1 max-w-md xl:max-w-xl">
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Search custom toys, limited editions, figures..."
                                    className="w-full px-5 py-2.5 pl-11 pr-12 rounded-xl border border-blue-100/80 bg-blue-50/20 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
                                />
                                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                                {searchQuery && (
                                    <button
                                        onClick={() => handleSearchChange('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* RIGHT CONTROLS */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <nav className="hidden lg:flex items-center gap-0.5">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'}`}
                                >
                                    Home
                                </button>

                                {/* CATEGORIES POPUP DROPDOWN (Desktop) */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setShowCategoriesDropdown(true)}
                                    onMouseLeave={() => setShowCategoriesDropdown(false)}
                                >
                                    <button
                                        aria-expanded={showCategoriesDropdown}
                                        className={`flex items-center gap-1 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${showCategoriesDropdown || location.pathname.includes('/products') ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:text-blue-600'}`}
                                    >
                                        Categories
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${showCategoriesDropdown ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showCategoriesDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg border border-slate-200 shadow-lg p-3 z-50"
                                            >
                                                <CategoryList />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={() => window.open('https://stcourier.com/track/shipment', '_blank', 'noopener,noreferrer')}
                                    className="px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                                >
                                    Track
                                </button>

                                <button
                                    onClick={handleWhatsAppClick}
                                    className="px-3 py-2 rounded-lg text-sm font-bold text-green-600 hover:text-green-700 hover:bg-green-50/50 transition-all flex items-center gap-1"
                                >
                                    <MessageCircle size={14} className='mr-1' />
                                    Support
                                </button>
                            </nav>

                            <div className="w-px h-4 bg-slate-200 hidden lg:block mx-1" />

                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="flex lg:hidden p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"
                                aria-label="Toggle Search"
                            >
                                {showSearch ? <X size={18} /> : <Search size={18} />}
                            </button>

                            {/* Wishlist Button */}
                            <button
                                onClick={handleWishlistOpen}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl relative transition-all"
                                aria-label="Wishlist"
                            >
                                <Heart size={18} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-black border border-white shadow-sm">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>

                            {/* CART CONTAINER */}
                            <button
                                onClick={handleCartOpen}
                                className="relative bg-blue-600 hover:bg-blue-700 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs shadow-md shadow-blue-600/10 active:scale-[0.97]"
                                aria-label="Open Cart"
                            >
                                <ShoppingBag size={15} />
                                <span className="hidden sm:inline tracking-wide">Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] rounded-md min-w-[16px] h-4 px-1 flex items-center justify-center font-black shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Pull-down Search Box */}
                    <AnimatePresence>
                        {showSearch && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="lg:hidden overflow-hidden pb-3"
                            >
                                <div className="relative mb-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        placeholder="Search custom toys, limited editions, figures..."
                                        className="w-full px-4 py-2.5 pl-9 rounded-xl text-xs bg-blue-50/50 text-slate-900 outline-none border border-transparent focus:border-blue-200 focus:bg-white transition-all"
                                    />
                                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Mobile Categories Slide-up Drawer */}
            <AnimatePresence>
                {showMobileDrawer && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileDrawer(false)}
                            className="lg:hidden fixed inset-0 bg-black z-50"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 pb-24 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] max-h-[70vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800">Browse Catalog</h3>
                                <button
                                    onClick={() => setShowMobileDrawer(false)}
                                    className="p-1 rounded-full bg-slate-100 text-slate-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <CategoryList />
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition"
                                >
                                    <MessageCircle size={18} />
                                    WhatsApp Support
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Tab Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white backdrop-blur-xl border-t border-blue-50/80 shadow-[0_-10px_30px_rgba(37,99,235,0.03)]">
                <div className="flex items-center justify-around py-2 px-2">
                    {tabbarItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (item.id === 'categories') {
                                        setShowMobileDrawer(true);
                                    } else if (item.id === 'home') {
                                        window.location.href = '/';
                                    } else if (item.action) {
                                        if (item.id === 'wishlist') {
                                            handleWishlistOpen();
                                        } else if (item.id === 'cart') {
                                            handleCartOpen();
                                        } else {
                                            item.action();
                                        }
                                    } else {
                                        setShowMobileDrawer(false);
                                    }
                                }}
                                className={`relative flex flex-col items-center gap-0.5 py-1.5 min-w-[60px] transition-all duration-200 ${isActive ? 'text-blue-600 scale-105' : 'text-slate-400'}`}
                            >
                                <div className="relative">
                                    {item.icon}
                                    {item.badge > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[8px] rounded-full min-w-[12px] h-3 flex items-center justify-center font-black px-0.5">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[9px] font-bold tracking-tight uppercase scale-90">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default HomeHeader;