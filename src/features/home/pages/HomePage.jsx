import { useState, useEffect, useCallback } from 'react';
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

    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }, [cart]);

    useEffect(() => {
        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }, [wishlist]);

    const handleCategorySelect = (categoryId) => {
        navigate(`/products/${categoryId}`);
    };

    const handleAddToCart = useCallback((product) => {
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
            return newCart;
        });

        // Show feedback
        setShowAddToCartFeedback(true);
        setTimeout(() => setShowAddToCartFeedback(false), 3000);
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

    return (
        <>
            {showAddToCartFeedback && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
                    <Check size={18} />
                    Added to Cart!
                </div>
            )}
            <AnnouncementBar />
            <HomeHeader
                onCategorySelect={handleCategorySelect}
                cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                wishlistCount={wishlist.length}
                onCartOpen={() => setIsCartOpen(true)}
                onWishlistOpen={() => setIsWishlistOpen(true)}
                isCartOpen={isCartOpen}
                isWishlistOpen={isWishlistOpen}
                onCartClose={() => setIsCartOpen(false)}
                onWishlistClose={() => setIsWishlistOpen(false)}
            />
            <HeroSection
                onShopNow={() => setIsCartOpen(true)}
                onViewCollection={handleViewAllProducts}
            />
            <PromoBanner />
            <FeaturedSection
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                wishlist={wishlist}
            />
            <StatsSection />
            <SiteFooter />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                setCart={setCart}
            />

            {/* Wishlist Drawer */}
            <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={() => setIsWishlistOpen(false)}
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
            />
        </>
    );
}

export default HomePage;