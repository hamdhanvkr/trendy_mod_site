import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrendyLogo from '/TrendyLogo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Grid, Sparkles, Palette, Monitor, Layers, Heart, Home, Search, ChevronDown, X, MessageCircle, Package } from 'lucide-react';
import { products, getCategoryDisplayName, getCategoryIcon, getCategoryTag } from '@/features/product/data/products';

const ICON_MAP = {
    Sparkles: <Sparkles size={16} />,
    Palette: <Palette size={16} />,
    Monitor: <Monitor size={16} />,
    Layers: <Layers size={16} />,
    Home: <Home size={16} />,
    Package: <Package size={16} />,
    Heart: <Heart size={16} />
};

const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || <Layers size={16} />;
};

const getDynamicCategories = () => {
    const categoryMap = new Map();
    products.forEach(product => {
        const categoryId = product.category;
        if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
                id: categoryId,
                name: getCategoryDisplayName(categoryId),
                icon: getCategoryIcon(categoryId),
                count: 0,
                tag: getCategoryTag(categoryId),
                iconComponent: getIconComponent(getCategoryIcon(categoryId))
            });
        }
        const cat = categoryMap.get(categoryId);
        cat.count += 1;
    });
    return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
};

const CategoryList = ({ categories, onCategoryClick }) => (
    <div className="flex flex-col gap-0.5">
        {categories.map((cat) => (
            <button
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label={`Select ${cat.name}`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 w-5 h-5 flex items-center justify-center">
                        {cat.iconComponent}
                    </span>
                    <div>
                        <div className="text-xs font-medium text-slate-700">{cat.name}</div>
                        <div className="text-[11px] text-slate-400">{cat.count} Products</div>
                    </div>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">
                    {cat.tag}
                </span>
            </button>
        ))}
    </div>
);

const HomeHeader = ({
    onCategorySelect,
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
    const [isScrolled, setIsScrolled] = useState(false);
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
    const [showMobileDrawer, setShowMobileDrawer] = useState(false);

    // Generate dynamic categories
    const dynamicCategories = useMemo(() => getDynamicCategories(), []);

    const activeTab = useMemo(() => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.includes('/products')) return 'categories';
        if (path.includes('/wishlist')) return 'wishlist';
        if (path.includes('/cart')) return 'cart';
        return 'home';
    }, [location.pathname]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when cart or wishlist is open
    useEffect(() => {
        if (isCartOpen || isWishlistOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen, isWishlistOpen]);

    // Handle Escape key for closing drawers
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

    // Memoized handlers
    const handleCategoryClick = useCallback((id) => {
        onCategorySelect?.(id);
        setShowCategoriesDropdown(false);
        setShowMobileDrawer(false);
    }, [onCategorySelect]);

    const handleWhatsAppClick = useCallback(() => {
        window.open('https://wa.me/919629601141', '_blank');
    }, []);

    const handleTrackOrder = useCallback(() => {
        window.open('https://stcourier.com/track/shipment', '_blank', 'noopener,noreferrer');
    }, []);

    const handleWishlistOpen = useCallback(() => {
        if (onWishlistOpen && !isWishlistOpen) {
            onWishlistOpen();
        }
    }, [onWishlistOpen, isWishlistOpen]);

    const handleCartOpen = useCallback(() => {
        if (onCartOpen && !isCartOpen) {
            onCartOpen();
        }
    }, [onCartOpen, isCartOpen]);

    const tabbarItems = [
        { id: 'home', label: 'Home', icon: <Home size={18} />, path: '/' },
        { id: 'categories', label: 'Categories', icon: <Grid size={18} /> },
        { id: 'track', label: 'Track', icon: <Package size={18} />, action: handleTrackOrder },
        { id: 'cart', label: 'Cart', icon: <ShoppingBag size={18} />, badge: cartCount, action: handleCartOpen },
    ];

    const isHomePage = location.pathname === '/';

    const closeMobileDrawer = useCallback(() => {
        setShowMobileDrawer(false);
    }, []);

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${isScrolled
                    ? 'bg-white/95 backdrop-blur-xl border-b border-blue-100/50 shadow-[0_8px_30px_rgb(37,99,235,0.03)] py-1'
                    : 'bg-white border-b border-transparent'
                    }`}
                role="banner"
            >
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">

                        {/* BRAND & LOGO */}
                        <div
                            className="flex items-center cursor-pointer select-none shrink-0"
                            onClick={() => window.location.href = '/'}
                            role="link"
                            tabIndex={0}
                            aria-label="Go to home page"
                            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = '/')}
                        >
                            <motion.img
                                src={TrendyLogo}
                                alt="Trendy Mod Logo"
                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain block"
                                whileHover={{ scale: 1.05, rotate: -1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            />
                        </div>

                        {/* RIGHT CONTROLS */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/'
                                        ? 'text-blue-600 bg-blue-50/50'
                                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                                        }`}
                                    aria-current={location.pathname === '/' ? 'page' : undefined}
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
                                        aria-haspopup="true"
                                        className={`flex items-center gap-1 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${showCategoriesDropdown || location.pathname.includes('/products')
                                            ? 'text-blue-600 bg-blue-50/50'
                                            : 'text-slate-600 hover:text-blue-600'
                                            }`}
                                    >
                                        Categories
                                        <ChevronDown
                                            size={12}
                                            className={`transition-transform duration-300 ${showCategoriesDropdown ? 'rotate-180 text-blue-500' : 'text-slate-400'
                                                }`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {showCategoriesDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg border border-slate-200 shadow-lg p-3 z-50"
                                                role="menu"
                                            >
                                                <CategoryList
                                                    categories={dynamicCategories}
                                                    onCategoryClick={handleCategoryClick}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={handleTrackOrder}
                                    className="px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                                >
                                    Track
                                </button>

                                <button
                                    onClick={handleWhatsAppClick}
                                    className="px-3 py-2 rounded-lg text-sm font-bold text-green-600 hover:text-green-700 hover:bg-green-50/50 transition-all flex items-center gap-1"
                                    aria-label="Contact support via WhatsApp"
                                >
                                    <MessageCircle size={14} className='mr-1' />
                                    Support
                                </button>
                            </nav>

                            <div className="w-px h-6 bg-slate-200 hidden lg:block mx-1" role="separator" />

                            {/* Mobile Search Toggle - Only show on home page */}
                            {isHomePage && (
                                <button
                                    onClick={() => navigate('/products')}
                                    className="flex p-2 -mr-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"
                                    aria-label="Search products"
                                >
                                    <Search size={18} />
                                </button>
                            )}

                            {/* Wishlist Button */}
                            <button
                                onClick={handleWishlistOpen}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl relative transition-all"
                                aria-label={`Wishlist ${wishlistCount > 0 ? `(${wishlistCount} items)` : ''}`}
                            >
                                <Heart size={18} />
                                {wishlistCount > 0 && (
                                    <span
                                        className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-black border border-white shadow-sm"
                                        aria-label={`${wishlistCount} items in wishlist`}
                                    >
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart Button */}
                            <button
                                onClick={handleCartOpen}
                                className="relative bg-blue-600 hover:bg-blue-700 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs shadow-md shadow-blue-600/10 active:scale-[0.97]"
                                aria-label={`Open cart ${cartCount > 0 ? `(${cartCount} items)` : ''}`}
                            >
                                <ShoppingBag size={15} />
                                <span className="hidden sm:inline tracking-wide">Cart</span>
                                {cartCount > 0 && (
                                    <span
                                        className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] rounded-md min-w-4 h-4 px-1 flex items-center justify-center font-black shadow-sm"
                                        aria-label={`${cartCount} items in cart`}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
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
                            onClick={closeMobileDrawer}
                            className="lg:hidden fixed inset-0 bg-black z-50"
                            aria-hidden="true"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 pb-24 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] max-h-[70vh] overflow-y-auto"
                            role="dialog"
                            aria-label="Categories menu"
                            aria-modal="true"
                        >
                            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800">Browse Collection</h3>
                                <button
                                    onClick={closeMobileDrawer}
                                    className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                                    aria-label="Close categories menu"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <CategoryList
                                categories={dynamicCategories}
                                onCategoryClick={handleCategoryClick}
                            />
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition"
                                    aria-label="Contact support via WhatsApp"
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
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-blue-50/80 shadow-[0_-10px_30px_rgba(37,99,235,0.03)]"
                aria-label="Mobile navigation"
            >
                <div className="flex items-center justify-around py-2 px-2">
                    {tabbarItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.id === 'categories') {
                                        setShowMobileDrawer(true);
                                    } else if (item.id === 'home') {
                                        window.location.href = '/';
                                    } else if (item.action) {
                                        item.action();
                                    } else {
                                        setShowMobileDrawer(false);
                                    }
                                }}
                                className={`relative flex flex-col items-center gap-0.5 py-1.5 min-w-15 transition-all duration-200 ${isActive ? 'text-blue-600 scale-105' : 'text-slate-400'
                                    }`}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={`${item.label}${item.badge > 0 ? ` (${item.badge} items)` : ''}`}
                            >
                                <div className="relative">
                                    {item.icon}
                                    {item.badge > 0 && (
                                        <span
                                            className="absolute -top-1 -right-2 bg-blue-600 text-white text-[8px] rounded-full min-w-3 h-3 flex items-center justify-center font-black px-0.5"
                                            aria-label={`${item.badge} items`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[9px] font-bold tracking-tight uppercase scale-90">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default HomeHeader;