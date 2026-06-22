import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Check } from 'lucide-react';
import {
    AnnouncementBar,
    HomeHeader,
    PromoBanner,
    HeroSection,
    StatsSection,
    FeaturedSection,
    SiteFooter
} from '../components';
import CartDrawer from '@/features/cart/components/CartDrawer';
import WishlistDrawer from '@/features/wishlist/components/WishlistDrawer';
import OrderForm from '@/features/order/components/OrderForm';
import { getDiscountedPrice } from '@/features/product/data/products';
import { useNavigate } from 'react-router-dom';

function HomePage() {

    const navigate = useNavigate();
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [showAddToCartFeedback, setShowAddToCartFeedback] = useState(false);
    const [directOrderProduct, setDirectOrderProduct] = useState(null);
    const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
    const feedbackTimeoutRef = useRef(null);
    const historyStackRef = useRef([]);
    const isProcessingBackRef = useRef(false);

    const directOrderCart = useMemo(() => {
        if (!directOrderProduct) return [];
        return [directOrderProduct];
    }, [directOrderProduct]);

    const directOrderTotal = directOrderCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

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

    // Save cart to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }, [cart]);

    // Save wishlist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }, [wishlist]);

    // Handle back button for mobile
    useEffect(() => {
        const handlePopState = () => {
            if (isDirectOrderOpen) {
                closeDirectOrder();
                return;
            }
            if (isProcessingBackRef.current) return;
            if (historyStackRef.current.length > 0) {

                isProcessingBackRef.current = true;
                const lastDrawer = historyStackRef.current[historyStackRef.current.length - 1];

                if (lastDrawer === 'wishlist' && isWishlistOpen) {
                    setIsWishlistOpen(false);
                    historyStackRef.current.pop();
                    window.history.pushState({ drawerOpen: true }, '', window.location.href);
                    isProcessingBackRef.current = false;
                    return;
                }

                if (lastDrawer === 'cart' && isCartOpen) {
                    setIsCartOpen(false);
                    historyStackRef.current.pop();
                    window.history.pushState({ drawerOpen: true }, '', window.location.href);
                    isProcessingBackRef.current = false;
                    return;
                }

                // If we get here, clear the history
                historyStackRef.current = [];
                isProcessingBackRef.current = false;
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isWishlistOpen, isCartOpen, isDirectOrderOpen, closeDirectOrder]);

    useEffect(() => {
        if (isDirectOrderOpen && !window.history.state?.directOrderOpen) {
            window.history.pushState({ directOrderOpen: true }, '', window.location.href);
        }
    }, [isDirectOrderOpen]);

    // Initialize history
    useEffect(() => {
        window.history.pushState({ initial: true }, '', window.location.href);
        return () => {
            historyStackRef.current = [];
        };
    }, []);

    const handleCategorySelect = (categoryId) => {
        navigate(`/products/${categoryId}`);
    };

    const handleAddToCart = useCallback((product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            let newCart;
            if (existing) {
                newCart = prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newCart = [...prev, { ...product, quantity }];
            }
            return newCart;
        });

        // Clear any existing timeout
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
        }

        // Show feedback
        setShowAddToCartFeedback(true);
        feedbackTimeoutRef.current = setTimeout(() => {
            setShowAddToCartFeedback(false);
        }, 3000);
    }, []);

    const handleCartOpen = useCallback(() => {
        setIsCartOpen(true);
        historyStackRef.current.push('cart');
        window.history.pushState({ drawerOpen: true, type: 'cart' }, '', window.location.href);
    }, []);

    const handleBuyNow = useCallback((product, quantity = 1) => {
        const price = getDiscountedPrice(product.price, product.discount);
        setDirectOrderProduct({ ...product, price, quantity });
        setIsDirectOrderOpen(true);
    }, []);

    const handleWishlistToggle = useCallback((productId) => {
        setWishlist(prev => {
            const exists = prev.includes(productId);
            let newWishlist;
            if (exists) {
                newWishlist = prev.filter(id => id !== productId);
            } else {
                newWishlist = [...prev, productId];
            }
            return newWishlist;
        });
    }, []);

    const handleViewAllProducts = useCallback(() => {
        navigate('/products');
    }, [navigate]);

    const handleWishlistOpen = useCallback(() => {
        setIsWishlistOpen(true);
        historyStackRef.current.push('wishlist');
        window.history.pushState({ drawerOpen: true, type: 'wishlist' }, '', window.location.href);
    }, []);

    const handleWishlistClose = useCallback(() => {
        setIsWishlistOpen(false);
        const index = historyStackRef.current.lastIndexOf('wishlist');
        if (index !== -1) {
            historyStackRef.current.splice(index, 1);
        }
    }, []);

    const handleCartClose = useCallback(() => {
        setIsCartOpen(false);
        const index = historyStackRef.current.lastIndexOf('cart');
        if (index !== -1) {
            historyStackRef.current.splice(index, 1);
        }
    }, []);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            {/* Add to Cart Feedback */}
            {showAddToCartFeedback && (
                <div className="fixed bottom-27 left-1/2 -translate-x-1/2 z-100 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
                    <Check size={18} className="shrink-0" />
                    <span>Added to Cart!</span>
                </div>
            )}

            <AnnouncementBar />

            <HomeHeader
                onCategorySelect={handleCategorySelect}
                cartCount={cartCount}
                wishlistCount={wishlist.length}
                onCartOpen={handleCartOpen}
                onWishlistOpen={handleWishlistOpen}
                isCartOpen={isCartOpen}
                isWishlistOpen={isWishlistOpen}
                onCartClose={handleCartClose}
                onWishlistClose={handleWishlistClose}
            />

            <HeroSection
                onShopNow={handleCartOpen}
                onViewCollection={handleViewAllProducts}
            />

            <PromoBanner />

            <FeaturedSection
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onWishlistToggle={handleWishlistToggle}
                wishlist={wishlist}
            />

            <StatsSection />
            <SiteFooter />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={handleCartClose}
                cart={cart}
                setCart={setCart}
            />

            {/* Wishlist Drawer */}
            <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={handleWishlistClose}
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
            />

            {/* Order Form Modal Panel Context */}
            <OrderForm
                isOpen={isDirectOrderOpen}
                onClose={handleDirectOrderClose}
                cart={directOrderCart}
                total={directOrderTotal}
                onOrderComplete={handleDirectOrderClose}
            />
        </>
    );
}

export default HomePage;