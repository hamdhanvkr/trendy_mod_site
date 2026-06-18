import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ShoppingBag,
    Star,
    Heart,
    Eye,
    Grid,
    List,
    ChevronDown,
    AlertCircle,
    ImageOff,
    Check,
    X,
    Search,
    SlidersHorizontal
} from 'lucide-react';
import { products, getProductsByCategory, getDiscountedPrice } from '../data/products';
import { HomeHeader, SiteFooter } from '@/features/home/components';
import WishlistDrawer from '@/features/wishlist/components/WishlistDrawer';
import CartDrawer from '@/features/cart/components/CartDrawer';

const ProductImage = ({ src, alt, className = "" }) => {

    const [imgError, setImgError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = (e) => {
        if (!imgError) {
            console.warn(`Failed to load image: ${src}`);
            setImgError(true);
            setIsLoading(false);
            e.target.onerror = null;
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={`relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!imgError ? (
                <img
                    src={src}
                    alt={alt || 'Product image'}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onError={handleError}
                    onLoad={handleLoad}
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
                    <ImageOff className="w-12 h-12 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500 font-medium">
                        {alt || 'Image unavailable'}
                    </span>
                </div>
            )}
        </div>
    );
};

const ProductsPage = () => {

    const { categoryId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // State Management
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('All Products');
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('productViewMode') || 'grid';
    });
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 3000 });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [addedToCart, setAddedToCart] = useState({});
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Category names mapping
    const categoryNames = useMemo(() => ({
        'panda': 'Panda Collection',
        'colorchangingpanda': 'Color Changing Panda',
        'shinchan': 'Shinchan Collection',
        'all': 'All Products'
    }), []);

    // Get unique categories from products
    const availableCategories = useMemo(() => {
        const cats = new Set();
        products.forEach(p => cats.add(p.category));
        return Array.from(cats);
    }, []);

    // Load Products
    useEffect(() => {
        let isMounted = true;

        const loadProducts = () => {
            try {
                setLoading(true);
                setError(null);

                let productList;
                if (categoryId && categoryId !== 'all') {
                    productList = getProductsByCategory(categoryId);
                    setCategoryName(categoryNames[categoryId] || 'Products');
                } else {
                    productList = products;
                    setCategoryName('All Products');
                }

                if (!productList || !Array.isArray(productList)) {
                    throw new Error('Invalid products data');
                }

                if (isMounted) {
                    setAllProducts(productList);
                    setFilteredProducts(productList);
                }
            } catch (err) {
                console.error('Error loading products:', err);
                if (isMounted) {
                    setError(err.message || 'Failed to load products');
                    setFilteredProducts([]);
                    setAllProducts([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        // Check for search query in URL
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search');
        if (query) {
            setSearchQuery(query);
        }

        return () => {
            isMounted = false;
        };
    }, [categoryId, categoryNames, location.search]);

    // Apply filters, search, and sort
    useEffect(() => {
        let result = [...allProducts];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
        }

        if (selectedCategories.length > 0 && !categoryId) {
            result = result.filter(p => selectedCategories.includes(p.category));
        }

        result = result.filter(p => {
            const price = getDiscountedPrice(p.price, p.discount);
            return price >= priceRange.min && price <= priceRange.max;
        });

        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => getDiscountedPrice(a.price, a.discount) - getDiscountedPrice(b.price, b.discount));
                break;
            case 'price-high':
                result.sort((a, b) => getDiscountedPrice(b.price, b.discount) - getDiscountedPrice(a.price, a.discount));
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
                break;
            case 'newest':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'discount':
                result.sort((a, b) => b.discount - a.discount);
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    }, [allProducts, searchQuery, selectedCategories, priceRange, sortBy, categoryId]);

    // Save view mode to localStorage
    useEffect(() => {
        localStorage.setItem('productViewMode', viewMode);
    }, [viewMode]);

    // Save wishlist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }, [wishlist]);

    // Save cart to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }, [cart]);

    // Handlers
    const toggleWishlist = useCallback((productId, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setWishlist(prev => {
            const isInWishlist = prev.includes(productId);
            const newWishlist = isInWishlist
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    }, []);

    const handleAddToCart = useCallback((product, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            let newCart;
            if (existing) {
                newCart = prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newCart = [...prev, { ...product, quantity: 1 }];
            }
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });

        setAddedToCart(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedToCart(prev => ({ ...prev, [product.id]: false }));
        }, 10000);
    }, []);

    const handleProductClick = useCallback((productId, e) => {
        if (e && e.target.closest('button')) {
            return;
        }
        navigate(`/product/${productId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [navigate]);

    const handleCategorySelect = useCallback((id) => {
        navigate(`/products/${id}`);
    }, [navigate]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        const searchParams = new URLSearchParams(location.search);
        if (query) {
            searchParams.set('search', query);
        } else {
            searchParams.delete('search');
        }
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }, [navigate, location]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        navigate(location.pathname);
    }, [navigate, location]);

    const handlePriceChange = useCallback((type, value) => {
        setPriceRange(prev => ({
            ...prev,
            [type]: parseInt(value) || 0
        }));
    }, []);

    const toggleCategoryFilter = useCallback((category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    }, []);

    const clearFilters = useCallback(() => {
        setSelectedCategories([]);
        setPriceRange({ min: 0, max: 3000 });
        setSortBy('default');
        setSearchQuery('');
        navigate('/products');
    }, [navigate]);

    const handleWishlistOpen = useCallback(() => {
        setIsWishlistOpen(true);
    }, []);

    const handleWishlistClose = useCallback(() => {
        setIsWishlistOpen(false);
    }, []);

    const handleCartClose = useCallback(() => {
        setIsCartOpen(false);
    }, []);

    // Render Stars
    const renderStars = useCallback((rating) => {
        return (
            <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={`${star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                            } transition-colors duration-200`}
                    />
                ))}
            </div>
        );
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex flex-col justify-between">
                <HomeHeader
                    onCategorySelect={handleCategorySelect}
                    onSearch={handleSearch}
                    cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                    wishlistCount={wishlist.length}
                    onCartOpen={() => setIsCartOpen(true)}
                    onWishlistOpen={handleWishlistOpen}
                    isCartOpen={isCartOpen}
                    isWishlistOpen={isWishlistOpen}
                    onCartClose={handleCartClose}
                    onWishlistClose={handleWishlistClose}
                />
                <div className="flex-1 flex flex-col items-center justify-center py-24">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="mt-6 text-slate-600 font-medium animate-pulse">
                        Loading products...
                    </p>
                </div>
                <SiteFooter />
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex flex-col justify-between">
                <HomeHeader
                    onCategorySelect={handleCategorySelect}
                    onSearch={handleSearch}
                    cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                    wishlistCount={wishlist.length}
                    onCartOpen={() => setIsCartOpen(true)}
                    onWishlistOpen={handleWishlistOpen}
                    isCartOpen={isCartOpen}
                    isWishlistOpen={isWishlistOpen}
                    onCartClose={handleCartClose}
                    onWishlistClose={handleWishlistClose}
                />
                <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
                    <div className="max-w-md w-full text-center py-12 bg-red-50 rounded-2xl border border-red-200">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md shadow-red-600/20"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white">

            <HomeHeader
                onCategorySelect={handleCategorySelect}
                onSearch={handleSearch}
                cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                wishlistCount={wishlist.length}
                onCartOpen={() => setIsCartOpen(true)}
                onWishlistOpen={handleWishlistOpen}
                isCartOpen={isCartOpen}
                isWishlistOpen={isWishlistOpen}
                onCartClose={handleCartClose}
                onWishlistClose={handleWishlistClose}
            />

            {/* Global "Added to Cart" Feedback */}
            <AnimatePresence>
                {Object.values(addedToCart).some(v => v) && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2"
                        >
                            <Check size={18} />
                            Added to Cart!
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Wishlist Drawer */}
            <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={handleWishlistClose}
                wishlist={wishlist}
                onWishlistToggle={toggleWishlist}
                onAddToCart={handleAddToCart}
            />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={handleCartClose}
                cart={cart}
                setCart={setCart}
            />

            {/* Utility Control Header Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-[80px] z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                {categoryName}
                            </h1>
                            <p className="text-sm text-slate-500">
                                Showing {filteredProducts.length} items
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Search (Mobile) */}
                        <div className="flex sm:hidden flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-3 py-2 pl-8 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex sm:hidden p-2.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                            aria-label="Toggle filters"
                        >
                            <SlidersHorizontal size={18} />
                        </button>

                        {/* Sort Dropdown */}
                        <div className="relative flex-1 sm:flex-initial min-w-[160px]">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full appearance-none bg-white text-sm font-medium text-slate-700 pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-colors"
                            >
                                <option value="default">Default Sorting</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="popular">Most Popular</option>
                                <option value="newest">Newest First</option>
                                <option value="discount">Biggest Discount</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* View Mode Switcher */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/20">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                aria-label="Grid view"
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                aria-label="List view"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="sm:hidden overflow-hidden border-t border-slate-100"
                        >
                            <div className="p-4 space-y-4 bg-white">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-2">Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {availableCategories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => toggleCategoryFilter(cat)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${selectedCategories.includes(cat)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {cat.replace(/([A-Z])/g, ' $1').trim()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-2">Price Range</h4>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => handlePriceChange('min', e.target.value)}
                                            placeholder="Min"
                                            className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
                                        />
                                        <span className="text-slate-400">to</span>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => handlePriceChange('max', e.target.value)}
                                            placeholder="Max"
                                            className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="w-full py-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode + sortBy + filteredProducts.length}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-lg font-bold text-slate-700 mb-2">No Products Found</h3>
                                <p className="text-slate-500">
                                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className={`grid ${viewMode === 'grid'
                                ? 'grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
                                : 'grid-cols-1 lg:grid-cols-3 gap-4'
                                }`}
                            >
                                {filteredProducts.map((product, index) => {
                                    const discountedPrice = getDiscountedPrice(product.price, product.discount);
                                    const isInWishlist = wishlist.includes(product.id);
                                    const isAdded = addedToCart[product.id];

                                    return (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, type: 'spring', stiffness: 400 }}
                                            whileHover={{ y: viewMode === 'grid' ? -4 : 0 }}
                                            className={`group bg-white rounded-md md:rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex flex-row h-40 sm:h-44 lg:h-48' : ''
                                                }`}
                                            onClick={(e) => handleProductClick(product.id, e)}
                                        >
                                            {/* Product Image */}
                                            <div
                                                className={`relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex-shrink-0 ${viewMode === 'list'
                                                    ? 'w-32 sm:w-40 lg:w-48 h-full'
                                                    : 'aspect-square'
                                                    }`}
                                            >
                                                <ProductImage src={product.image} alt={product.name} />

                                                {/* Badges */}
                                                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5">
                                                    {product.isNew && (
                                                        <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white rounded-full shadow-lg animate-pulse">
                                                            New
                                                        </span>
                                                    )}
                                                    {product.isPopular && (
                                                        <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-lg">
                                                            Popular
                                                        </span>
                                                    )}
                                                    {product.discount > 0 && (
                                                        <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white rounded-full shadow-lg">
                                                            {product.discount}% OFF
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-1.5">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => toggleWishlist(product.id, e)}
                                                        className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 relative z-10"
                                                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                                    >
                                                        <Heart
                                                            size={14}
                                                            className={`${isInWishlist
                                                                ? 'fill-rose-500 text-rose-500'
                                                                : 'text-slate-600'
                                                                } transition-colors duration-200 sm:w-4 sm:h-4`}
                                                        />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleProductClick(product.id);
                                                        }}
                                                        className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 relative z-10"
                                                        aria-label="Quick view"
                                                    >
                                                        <Eye size={14} className="text-slate-600 sm:w-4 sm:h-4" />
                                                    </motion.button>
                                                </div>

                                                {/* Quick View Overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                            </div>

                                            {/* Product Info */}
                                            <div className={`p-2 sm:p-3 lg:p-4 flex flex-col justify-between flex-1 ${viewMode === 'list' ? 'min-w-0' : ''
                                                }`}>
                                                <div>
                                                    <div className="mb-0.5 sm:mb-1.5">
                                                        {renderStars(product.rating)}
                                                    </div>

                                                    <h3
                                                        className="text-xs sm:text-sm mt-2 font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProductClick(product.id);
                                                        }}
                                                    >
                                                        {product.name}
                                                    </h3>

                                                    {viewMode === 'list' && product.description && (
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 sm:line-clamp-3">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                                                        <span className="text-sm sm:text-lg font-black text-slate-900">
                                                            ₹{discountedPrice}
                                                        </span>
                                                        {product.discount > 0 && (
                                                            <>
                                                                <span className="text-[10px] sm:text-sm text-slate-400 line-through">
                                                                    ₹{product.price}
                                                                </span>
                                                                <span className="text-[8px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded">
                                                                    Save ₹{product.price - discountedPrice}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={(e) => handleAddToCart(product, e)}
                                                        className={`w-full mt-2 sm:mt-3 py-1.5 sm:py-2 ${isAdded ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md md:rounded-xl font-bold text-[10px] sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 relative z-10`}
                                                    >
                                                        {isAdded ? (
                                                            <>
                                                                <Check size={12} className="sm:w-4 sm:h-4" />
                                                                <span>Added!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShoppingBag size={12} className="transition-transform sm:w-4 sm:h-4" />
                                                                <span>Add to Cart</span>
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
            <SiteFooter />
        </div>
    );
};

export default React.memo(ProductsPage);