import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    ArrowLeft,
    Search,
    X,
    ChevronDown,
    Grid,
    List,
    Check
} from 'lucide-react';

import { products, getProductsByCategory, getDiscountedPrice } from '../data/products';
import { HomeHeader, SiteFooter } from '@/features/home/components';
import WishlistDrawer from '@/features/wishlist/components/WishlistDrawer';
import CartDrawer from '@/features/cart/components/CartDrawer';
import OrderForm from '@/features/order/components/OrderForm';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { trackEvent } from '@/utils/analytics';

import {
    ProductCard,
    ProductSkeleton,
    ErrorFallback
} from '../components';
import { productReducer, initialState } from '../reducers';
import { useProductFilters, useProductActions } from '../hooks';
import {
    VIEW_MODES,
    SORT_OPTIONS,
    ITEMS_PER_PAGE,
    CATEGORY_NAMES
} from '../constants';

const ProductsPage = () => {

    const { categoryId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [storedWishlist, setWishlist] = useLocalStorage('wishlist', []);
    const [storedCart, setCart] = useLocalStorage('cart', []);
    const [state, dispatch] = useReducer(productReducer, {
        ...initialState,
        wishlist: storedWishlist,
        cart: storedCart
    });

    // Refs
    const isInitialMount = useRef(true);
    const prevWishlistOpenRef = useRef(state.isWishlistOpen);
    const prevCartOpenRef = useRef(state.isCartOpen);
    const [directOrderProduct, setDirectOrderProduct] = useState(null);
    const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);

    const directOrderCart = useMemo(() => {
        if (!directOrderProduct) return [];
        return [directOrderProduct];
    }, [directOrderProduct]);

    const directOrderTotal = directOrderCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleBuyNow = useCallback((product, quantityOrEvent = 1, maybeEvent) => {

        let quantity = 1;
        let e = null;

        if (typeof quantityOrEvent === 'number') {
            quantity = quantityOrEvent;
            e = maybeEvent;
        } else {
            e = quantityOrEvent;
        }

        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        const price = getDiscountedPrice(product.price, product.discount);
        setDirectOrderProduct({ ...product, price, quantity });
        setIsDirectOrderOpen(true);
    }, []);

    const closeDirectOrder = useCallback(() => {
        setIsDirectOrderOpen(false);
        setDirectOrderProduct(null);
    }, []);

    const handleDirectOrderClose = useCallback(() => {
        if (window.history.state?.directOrderOpen) {
            window.history.back();
        } else {
            closeDirectOrder();
        }
    }, [closeDirectOrder]);

    useEffect(() => {
        if (isDirectOrderOpen && !window.history.state?.directOrderOpen) {
            window.history.pushState({ directOrderOpen: true }, '', window.location.href);
        }
    }, [isDirectOrderOpen]);

    // Sync localStorage with state
    useEffect(() => {
        if (state.isInitialized) {
            setWishlist(state.wishlist);
            setCart(state.cart);
        }
    }, [state.wishlist, state.cart, state.isInitialized, setWishlist, setCart]);

    useEffect(() => {
        const handlePopState = () => {
            if (isDirectOrderOpen) {
                closeDirectOrder();
                return;
            }
            if (state.isWishlistOpen) {
                dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: false });
                return;
            }
            if (state.isCartOpen) {
                dispatch({ type: 'TOGGLE_CART_DRAWER', payload: false });
                return;
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [dispatch, state.isWishlistOpen, state.isCartOpen, isDirectOrderOpen, closeDirectOrder]);

    useEffect(() => {
        if (state.isWishlistOpen || state.isCartOpen) {
            window.history.pushState({ drawerOpen: true }, '', window.location.href);
        }
    }, [state.isWishlistOpen, state.isCartOpen]);

    useEffect(() => {
        if (prevWishlistOpenRef.current && !state.isWishlistOpen) {
            if (window.history.state?.drawerOpen) {
                window.history.back();
            }
        }
        prevWishlistOpenRef.current = state.isWishlistOpen;
    }, [state.isWishlistOpen]);

    useEffect(() => {
        if (prevCartOpenRef.current && !state.isCartOpen) {
            if (window.history.state?.drawerOpen) {
                window.history.back();
            }
        }
        prevCartOpenRef.current = state.isCartOpen;
    }, [state.isCartOpen]);

    // Debounced search query
    const debouncedSearch = useDebounce(state.searchQuery, 300);

    // Load products
    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                dispatch({ type: 'SET_ERROR', payload: null });

                await new Promise(resolve => setTimeout(resolve, 300));

                let productList;
                if (categoryId && categoryId !== 'all') {
                    productList = getProductsByCategory(categoryId);
                    dispatch({
                        type: 'SET_CATEGORY_NAME',
                        payload: CATEGORY_NAMES[categoryId] || 'Products'
                    });
                } else {
                    productList = products;
                    dispatch({ type: 'SET_CATEGORY_NAME', payload: 'All Products' });
                }

                if (!productList || !Array.isArray(productList)) {
                    throw new Error('Invalid products data');
                }

                if (isMounted) {
                    dispatch({ type: 'SET_PRODUCTS', payload: productList });
                    trackEvent('view_products', {
                        category: categoryId || 'all',
                        productCount: productList.length
                    });
                }
            } catch (err) {
                console.error('Error loading products:', err);
                if (isMounted) {
                    dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to load products' });
                }
            }
        };

        loadProducts();

        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search');
        if (query && isInitialMount.current) {
            dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
        }
        isInitialMount.current = false;

        return () => {
            isMounted = false;
        };
    }, [categoryId, location.search]);

    // Filters object
    const filters = useMemo(() => ({
        searchQuery: debouncedSearch,
        selectedCategories: state.selectedCategories,
        priceRange: state.priceRange,
        categoryId
    }), [debouncedSearch, state.selectedCategories, state.priceRange, categoryId]);

    // Single source of truth for filtered products
    const filteredProducts = useProductFilters(state.products, filters, state.sortBy);

    // Reset to page 1 when debounced search changes
    const prevSearchRef = useRef(debouncedSearch);
    useEffect(() => {
        if (prevSearchRef.current !== debouncedSearch) {
            prevSearchRef.current = debouncedSearch;
            dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
        }
    }, [debouncedSearch]);

    // Pagination
    const paginatedProducts = useMemo(() => {
        const end = state.currentPage * ITEMS_PER_PAGE;
        return filteredProducts.slice(0, end);
    }, [filteredProducts, state.currentPage]);

    const hasMore = paginatedProducts.length < filteredProducts.length;

    // Actions
    const {
        handleSearch,
        clearSearch,
        handleSortChange,
        clearFilters,
        toggleWishlist,
        handleAddToCart,
        handleProductClick,
        handleCategorySelect,
        handleViewModeChange,
        loadMore
    } = useProductActions(state, dispatch, navigate, location);

    // Error state
    if (state.error) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-between">
                <HomeHeader
                    onCategorySelect={handleCategorySelect}
                    onSearch={handleSearch}
                    cartCount={state.cart.reduce((sum, item) => sum + item.quantity, 0)}
                    wishlistCount={state.wishlist.length}
                    onCartOpen={() => dispatch({ type: 'TOGGLE_CART_DRAWER', payload: true })}
                    onWishlistOpen={() => dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: true })}
                    isCartOpen={state.isCartOpen}
                    isWishlistOpen={state.isWishlistOpen}
                    onCartClose={() => dispatch({ type: 'TOGGLE_CART_DRAWER', payload: false })}
                    onWishlistClose={() => dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: false })}
                />
                <ErrorFallback error={state.error} onRetry={() => window.location.reload()} />
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">

            <Helmet>
                <title>{state.categoryName} - Shop</title>
                <meta name="description" content={`Browse our ${state.categoryName} products. Find the perfect item for you.`} />
                <link rel="canonical" href={`${window.location.origin}/products/${categoryId || 'all'}`} />
            </Helmet>

            {/* Header */}
            <HomeHeader
                onCategorySelect={handleCategorySelect}
                onSearch={handleSearch}
                cartCount={state.cart.reduce((sum, item) => sum + item.quantity, 0)}
                wishlistCount={state.wishlist.length}
                onCartOpen={() => dispatch({ type: 'TOGGLE_CART_DRAWER', payload: true })}
                onWishlistOpen={() => dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: true })}
                isCartOpen={state.isCartOpen}
                isWishlistOpen={state.isWishlistOpen}
                onCartClose={() => dispatch({ type: 'TOGGLE_CART_DRAWER', payload: false })}
                onWishlistClose={() => dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: false })}
            />

            {/* Toast Notification */}
            <AnimatePresence>
                {Object.values(state.addedToCart).some(v => v) && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2"
                            role="alert"
                            aria-live="polite"
                        >
                            <Check size={18} />
                            Added to Cart!
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Drawers */}
            <WishlistDrawer
                isOpen={state.isWishlistOpen}
                onClose={() => dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: false })}
                wishlist={state.wishlist}
                onWishlistToggle={toggleWishlist}
                onAddToCart={handleAddToCart}
            />

            <CartDrawer
                isOpen={state.isCartOpen}
                onClose={() => dispatch({ type: 'TOGGLE_CART_DRAWER', payload: false })}
                cart={state.cart}
                setCart={(newCart) => dispatch({ type: 'SET_CART', payload: newCart })}
            />

            {/* Utility Control Header Bar */}
            <div className="bg-white backdrop-blur-md border-b border-slate-200/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* Mobile: Back button + Title */}
                    <div className="flex sm:hidden items-center gap-3 mb-3">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                                {state.categoryName}
                            </h1>
                            <p className="text-sm text-slate-500 truncate">
                                Showing {filteredProducts.length} items
                                {state.searchQuery && ` for "${state.searchQuery}"`}
                            </p>
                        </div>
                    </div>

                    {/* Mobile: Search Row */}
                    <div className="flex sm:hidden relative mb-3">
                        <input
                            type="text"
                            value={state.searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full px-3 py-2 pl-8 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            aria-label="Search products"
                        />
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        {state.searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label="Clear search"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Desktop: Back button + Title */}
                        <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                                    {state.categoryName}
                                </h1>
                                <p className="text-sm text-slate-500 truncate">
                                    Showing {filteredProducts.length} items
                                    {state.searchQuery && ` for "${state.searchQuery}"`}
                                </p>
                            </div>
                        </div>

                        {/* Desktop: Search */}
                        <div className="hidden sm:flex relative flex-1 max-w-md">
                            <input
                                type="text"
                                value={state.searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-3 py-2 pl-8 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                aria-label="Search products"
                            />
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            {state.searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative flex-1 sm:flex-initial min-w-40">
                            <select
                                value={state.sortBy}
                                onChange={handleSortChange}
                                className="w-full appearance-none bg-white text-sm font-medium text-slate-700 pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-colors"
                                aria-label="Sort products"
                            >
                                {SORT_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* View Mode Switcher */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/20 shrink-0">
                            <button
                                onClick={() => handleViewModeChange(VIEW_MODES.GRID)}
                                className={`p-2 rounded-lg transition-all ${state.viewMode === VIEW_MODES.GRID ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                aria-label="Grid view"
                                aria-pressed={state.viewMode === VIEW_MODES.GRID}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => handleViewModeChange(VIEW_MODES.LIST)}
                                className={`p-2 rounded-lg transition-all ${state.viewMode === VIEW_MODES.LIST ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                aria-label="List view"
                                aria-pressed={state.viewMode === VIEW_MODES.LIST}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filter Section */}
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                <div className="flex gap-6">
                    {/* Product Grid */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={state.viewMode + state.sortBy + filteredProducts.length}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                                {state.loading ? (
                                    <div className={`grid ${state.viewMode === VIEW_MODES.GRID
                                        ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
                                        : 'grid-cols-1 lg:grid-cols-2 gap-4'
                                        }`}>
                                        {[...Array(8)].map((_, i) => (
                                            <ProductSkeleton key={i} viewMode={state.viewMode} />
                                        ))}
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-6xl mb-4" role="img" aria-hidden="true">🔍</div>
                                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Products Found</h3>
                                        <p className="text-slate-500">
                                            {state.searchQuery ? `No results for "${state.searchQuery}"` : 'Try adjusting your filters'}
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`grid ${state.viewMode === VIEW_MODES.GRID
                                            ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
                                            : 'grid-cols-1 lg:grid-cols-3 gap-4'
                                            }`}>
                                            {paginatedProducts.map((product, index) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    viewMode={state.viewMode}
                                                    isInWishlist={state.wishlist.includes(product.id)}
                                                    isAdded={state.addedToCart[product.id] || false}
                                                    onProductClick={handleProductClick}
                                                    onToggleWishlist={toggleWishlist}
                                                    onAddToCart={handleAddToCart}
                                                    onBuyNow={handleBuyNow}
                                                    index={index}
                                                />
                                            ))}
                                        </div>

                                        {hasMore && (
                                            <div className="mt-8 text-center">
                                                <button
                                                    onClick={() => loadMore(hasMore, state.loading, state.currentPage)}
                                                    className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                                                    aria-label="Load more products"
                                                >
                                                    Load More
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-6 text-center text-sm text-slate-500">
                                            Showing {paginatedProducts.length} of {filteredProducts.length} products
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <SiteFooter />

            <OrderForm
                isOpen={isDirectOrderOpen}
                onClose={handleDirectOrderClose}
                cart={directOrderCart}
                total={directOrderTotal}
                onOrderComplete={handleDirectOrderClose}
            />
        </div>
    );
};

export default React.memo(ProductsPage);