import React, { useEffect, useReducer, useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeHeader, SiteFooter } from '@/features/home/components';
import WishlistDrawer from '@/features/wishlist/components/WishlistDrawer';
import CartDrawer from '@/features/cart/components/CartDrawer';
import OrderForm from '@/features/order/components/OrderForm';
import { trackEvent } from '@/utils/analytics';
import {
    ProductBreadcrumb,
    ProductGallery,
    ProductInfo,
    ProductActions,
    ProductHighlights,
    ProductRelated,
    ProductLoading,
    ProductError,
    ShareFeedback,
    AddToCartFeedback,
    ProductBenefits
} from '../components';
import { useProductDetail } from '../hooks';
import { getDiscountedPrice } from '../data/products';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { productDetailReducer, productDetailInitialState } from '../reducers';
import { MIN_QUANTITY, MAX_QUANTITY } from '../constants';

const ProductPageHeader = ({
    onCategorySelect,
    onSearch,
    cart,
    wishlist,
    dispatch,
    state
}) => (
    <HomeHeader
        onCategorySelect={onCategorySelect}
        onSearch={onSearch}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onCartOpen={() => dispatch({ type: 'TOGGLE_CART_DRAWER', payload: true })}
        onWishlistOpen={() => dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: true })}
        isCartOpen={state.isCartOpen}
        isWishlistOpen={state.isWishlistOpen}
        onCartClose={() => dispatch({ type: 'TOGGLE_CART_DRAWER', payload: false })}
        onWishlistClose={() => dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: false })}
    />
);

const ProductDetailPage = () => {

    const { productId } = useParams();
    const navigate = useNavigate();

    // State
    const [state, dispatch] = useReducer(productDetailReducer, productDetailInitialState);
    const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
    const [cart, setCart] = useLocalStorage('cart', []);
    const prevWishlistOpenRef = useRef(state.isWishlistOpen);
    const prevCartOpenRef = useRef(state.isCartOpen);
    const [directOrderProduct, setDirectOrderProduct] = useState(null);
    const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);

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

    // Back button handling for open drawers
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
        if (isDirectOrderOpen && !window.history.state?.directOrderOpen) {
            window.history.pushState({ directOrderOpen: true }, '', window.location.href);
        }
    }, [isDirectOrderOpen]);

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

    // Custom hook for product data
    const {
        product,
        relatedProducts,
        loading,
        error,
        selectedColor,
        setSelectedColor,
        productImages,
        handleProductClick
    } = useProductDetail(productId);

    // Sync product data to state
    useEffect(() => {
        if (product) {
            dispatch({ type: 'SET_PRODUCT', payload: product });
            if (relatedProducts && relatedProducts.length > 0) {
                dispatch({ type: 'SET_RELATED_PRODUCTS', payload: relatedProducts });
            }
        }
    }, [product, relatedProducts]);

    // Sync loading/error states
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: loading });
        if (error) {
            dispatch({ type: 'SET_ERROR', payload: error });
        }
    }, [loading, error]);

    // Check if product is in wishlist
    const isInWishlist = useMemo(() => {
        return product ? wishlist.includes(product.id) : false;
    }, [product, wishlist]);

    // Handlers
    const handleQuantityChange = useCallback((type) => {
        if (type === 'increase') {
            dispatch({
                type: 'SET_QUANTITY',
                payload: Math.min(state.quantity + 1, MAX_QUANTITY)
            });
        } else {
            dispatch({
                type: 'SET_QUANTITY',
                payload: Math.max(state.quantity - 1, MIN_QUANTITY)
            });
        }
    }, [state.quantity]);

    const handleAddToCart = useCallback(() => {
        if (!product) return;

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            let newCart;
            if (existing) {
                newCart = prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + state.quantity }
                        : item
                );
            } else {
                newCart = [...prev, { ...product, quantity: state.quantity }];
            }
            return newCart;
        });

        dispatch({ type: 'SET_ADDED_FEEDBACK', payload: true });
        trackEvent('add_to_cart', {
            productId: product.id,
            price: product.price,
            quantity: state.quantity
        });

        setTimeout(() => {
            dispatch({ type: 'SET_ADDED_FEEDBACK', payload: false });
        }, 3000);
    }, [product, state.quantity, setCart]);

    const handleBuyNow = useCallback(() => {
        if (!product) return;
        const price = getDiscountedPrice(product.price, product.discount);
        setDirectOrderProduct({ ...product, price, quantity: state.quantity });
        setIsDirectOrderOpen(true);
    }, [product, state.quantity]);

    const handleWishlistToggle = useCallback((e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (!product) return;

        setWishlist(prev => {
            const exists = prev.includes(product.id);
            const newWishlist = exists
                ? prev.filter(id => id !== product.id)
                : [...prev, product.id];

            trackEvent(exists ? 'remove_from_wishlist' : 'add_to_wishlist', {
                productId: product.id
            });

            return newWishlist;
        });
    }, [product, setWishlist]);

    const handleRelatedWishlistToggle = useCallback((productId, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setWishlist(prev => {
            const exists = prev.includes(productId);
            return exists
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
        });
    }, [setWishlist]);

    const handleShare = useCallback(async () => {
        if (!product) return;

        const shareData = {
            title: product.name,
            text: `Check out ${product.name} on TrendyMod! 🎁`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                dispatch({ type: 'SET_SHARE_OPEN', payload: true });
                setTimeout(() => {
                    dispatch({ type: 'SET_SHARE_OPEN', payload: false });
                }, 2000);
                return;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Web Share API error:', error);
                } else {
                    return;
                }
            }
        }

        try {
            await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
            dispatch({ type: 'SET_COPIED', payload: true });
            dispatch({ type: 'SET_SHARE_OPEN', payload: true });
            setTimeout(() => {
                dispatch({ type: 'SET_COPIED', payload: false });
                setTimeout(() => {
                    dispatch({ type: 'SET_SHARE_OPEN', payload: false });
                }, 1500);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
            const copyText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            if (window.prompt) {
                window.prompt('Copy this link to share:', copyText);
            }
        }
    }, [product]);

    const handleWhatsAppSupport = useCallback(() => {
        window.open('https://wa.me/919629601141', '_blank');
    }, []);

    const handleCategorySelect = useCallback((id) => {
        navigate(`/products/${id}`);
    }, [navigate]);

    const handleSearch = useCallback((query) => {
        navigate(`/products?search=${encodeURIComponent(query)}`);
    }, [navigate]);

    const directOrderCart = useMemo(() => {
        if (!directOrderProduct) return [];
        return [directOrderProduct];
    }, [directOrderProduct]);

    const directOrderTotal = directOrderCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Common header props
    const headerProps = {
        onCategorySelect: handleCategorySelect,
        onSearch: handleSearch,
        cart,
        wishlist,
        dispatch,
        state
    };

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-between">
                <ProductPageHeader {...headerProps} />
                <ProductError error={error} />
                <SiteFooter />
            </div>
        );
    }

    // Loading state
    if (loading || !product) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-between">
                <ProductPageHeader {...headerProps} />
                <ProductLoading />
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <ProductPageHeader {...headerProps} />

            {/* Drawers */}
            <WishlistDrawer
                isOpen={state.isWishlistOpen}
                onClose={() => dispatch({ type: 'TOGGLE_WISHLIST_DRAWER', payload: false })}
                wishlist={wishlist}
                onWishlistToggle={handleRelatedWishlistToggle}
                onAddToCart={handleAddToCart}
            />

            <CartDrawer
                isOpen={state.isCartOpen}
                onClose={() => dispatch({ type: 'TOGGLE_CART_DRAWER', payload: false })}
                cart={cart}
                setCart={setCart}
            />

            {/* Feedback Components */}
            <ShareFeedback isOpen={state.isShareOpen} isCopied={state.isCopied} />
            <AddToCartFeedback isOpen={state.showAddedFeedback} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Breadcrumb */}
                <ProductBreadcrumb product={product} />

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
                    aria-label="Go back"
                >
                    <motion.span
                        animate={{ x: 0 }}
                        whileHover={{ x: -4 }}
                        className="inline-block"
                    >
                        ←
                    </motion.span>
                    Back
                </button>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left - Gallery */}
                    <ProductGallery
                        product={product}
                        productImages={productImages}
                        selectedImage={state.selectedImage}
                        isInWishlist={isInWishlist}
                        onWishlistToggle={handleWishlistToggle}
                        onShare={handleShare}
                    />

                    {/* Right - Product Info */}
                    <div className="space-y-5 lg:space-y-6">
                        <ProductInfo
                            product={product}
                            quantity={state.quantity}
                            selectedColor={selectedColor}
                            onColorSelect={setSelectedColor}
                            showFullDescription={state.showFullDescription}
                            onToggleDescription={() => dispatch({ type: 'TOGGLE_FULL_DESCRIPTION' })}
                            activeTab={state.activeTab}
                            onTabChange={(tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })}
                        />

                        <ProductHighlights />

                        <ProductActions
                            product={product}
                            quantity={state.quantity}
                            onQuantityChange={handleQuantityChange}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                            onWhatsAppSupport={handleWhatsAppSupport}
                            inStock={product.inStock}
                        />

                        <ProductBenefits />
                    </div>
                </div>

                {/* Related Products */}
                <ProductRelated
                    products={relatedProducts}
                    wishlist={wishlist}
                    onWishlistToggle={handleRelatedWishlistToggle}
                    onProductClick={handleProductClick}
                />
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

export default React.memo(ProductDetailPage);