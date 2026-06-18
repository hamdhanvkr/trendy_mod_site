// src/features/product/pages/ProductDetailPage.jsx - COMPLETE FIXED WITH SHARE

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ShoppingBag,
    Heart,
    Star,
    Share2,
    Minus,
    Plus,
    Check,
    AlertCircle,
    Sparkles,
    ImageOff,
    ChevronDown,
    ChevronUp,
    Wallet,
    Award,
    Clock,
    ThumbsUp,
    TrendingUp,
    ShieldCheck,
    Gift,
    Truck,
    RotateCcw,
    MessageCircle,
    Copy,
    CheckCheck
} from 'lucide-react';
import { products, getProductsByCategory, getDiscountedPrice } from '../data/products';
import { HomeHeader, SiteFooter } from '@/features/home/components';
import WishlistDrawer from '@/features/wishlist/components/WishlistDrawer';
import CartDrawer from '@/features/cart/components/CartDrawer';

// Product Image Component
const ProductImage = ({ src, alt, className, onClick }) => {
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

    if (imgError) {
        return (
            <div
                className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}
                onClick={onClick}
            >
                <ImageOff className="w-12 h-12 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500 font-medium">Image unavailable</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <img
                src={src}
                alt={alt || 'Product image'}
                className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    } ${className || ''}`}
                onError={handleError}
                onLoad={handleLoad}
                loading="lazy"
                onClick={onClick}
            />
        </div>
    );
};

const ProductDetailPage = () => {

    const { productId } = useParams();
    const navigate = useNavigate();

    // State Management
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [showAddedFeedback, setShowAddedFeedback] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Cart State
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Wishlist State
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Check if product is in wishlist
    const isInWishlist = useMemo(() => {
        return product ? wishlist.includes(product.id) : false;
    }, [product, wishlist]);

    // Load Product
    useEffect(() => {
        const loadProduct = () => {
            try {
                setLoading(true);
                setError(null);

                const foundProduct = products.find(p => p.id === parseInt(productId));

                if (!foundProduct) {
                    throw new Error('Product not found');
                }

                setProduct(foundProduct);

                // Get related products from same category
                const related = getProductsByCategory(foundProduct.category)
                    .filter(p => p.id !== foundProduct.id)
                    .slice(0, 4);
                setRelatedProducts(related);

                // Set default color if available
                if (foundProduct.colors && foundProduct.colors.length > 0) {
                    setSelectedColor(foundProduct.colors[0]);
                }

            } catch (err) {
                console.error('Error loading product:', err);
                setError(err.message);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId]);

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

    // Generate product images array
    const productImages = useMemo(() => {
        if (!product) return [];
        const images = [product.image];
        if (product.images && product.images.length > 0) {
            return [product.image, ...product.images];
        }
        // Generate placeholder images
        for (let i = 2; i <= 4; i++) {
            images.push(`/images/products/${product.id}-${i}.jpg`);
        }
        return images;
    }, [product]);

    // Handlers
    const handleQuantityChange = useCallback((type) => {
        if (type === 'increase') {
            setQuantity(prev => Math.min(prev + 1, 10));
        } else {
            setQuantity(prev => Math.max(prev - 1, 1));
        }
    }, []);

    const handleAddToCart = useCallback(() => {
        if (!product) return;

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
                newCart = [...prev, { ...product, quantity: quantity }];
            }
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });

        setShowAddedFeedback(true);

        setTimeout(() => {
            setShowAddedFeedback(false);
        }, 3000);
    }, [product, quantity]);

    // Main Wishlist Toggle for the main product
    const handleWishlistToggle = useCallback((e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (!product) return;

        console.log('Toggling wishlist for product:', product.id);
        setWishlist(prev => {
            const exists = prev.includes(product.id);
            let newWishlist;
            if (exists) {
                newWishlist = prev.filter(id => id !== product.id);
            } else {
                newWishlist = [...prev, product.id];
            }
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    }, [product]);

    // Wishlist toggle for related products
    const handleRelatedWishlistToggle = useCallback((productId, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setWishlist(prev => {
            const exists = prev.includes(productId);
            let newWishlist;
            if (exists) {
                newWishlist = prev.filter(id => id !== productId);
            } else {
                newWishlist = [...prev, productId];
            }
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    }, []);

    // Share Handler - Fixed for both desktop and mobile
    const handleShare = useCallback(async () => {
        if (!product) return;

        const shareData = {
            title: product.name,
            text: `Check out ${product.name} on TrendyMod! 🎁`,
            url: window.location.href,
        };

        // Try using the Web Share API first (works on mobile and some desktop browsers)
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Shared successfully via Web Share API');
                return;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Web Share API error:', error);
                    // Fall through to fallback
                } else {
                    // User cancelled the share dialog
                    return;
                }
            }
        }

        // Fallback: Copy to clipboard with visual feedback
        try {
            await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
            setIsCopied(true);
            setIsShareOpen(true);
            setTimeout(() => {
                setIsCopied(false);
                setTimeout(() => {
                    setIsShareOpen(false);
                }, 1500);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
            // Fallback to prompt
            const copyText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            if (window.prompt) {
                window.prompt('Copy this link to share:', copyText);
            }
        }
    }, [product]);

    const handleProductClick = useCallback((id, e) => {
        if (e && e.target.closest('button')) {
            return;
        }
        navigate(`/product/${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [navigate]);

    const handleCategorySelect = useCallback((id) => {
        navigate(`/products/${id}`);
    }, [navigate]);

    const handleSearch = useCallback((query) => {
        navigate(`/products?search=${encodeURIComponent(query)}`);
    }, [navigate]);

    const handleWhatsAppSupport = useCallback(() => {
        window.open('https://wa.me/919629601141', '_blank');
    }, []);

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
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                            } transition-colors`}
                    />
                ))}
            </div>
        );
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-white">
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
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="mt-6 text-slate-600 font-medium animate-pulse">
                            Loading product details...
                        </p>
                    </div>
                </div>
                <SiteFooter />
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div className="min-h-screen bg-white">
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
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center py-12 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl border border-red-200">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-700 mb-2">
                            {error === 'Product not found' ? 'Product Not Found' : 'Something Went Wrong'}
                        </h2>
                        <p className="text-red-600 mb-6">
                            {error === 'Product not found'
                                ? "The product you're looking for doesn't exist or has been removed."
                                : 'An error occurred while loading the product details.'}
                        </p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <button
                                onClick={() => navigate('/products')}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
                            >
                                Browse Products
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
                <SiteFooter />
            </div>
        );
    }

    const discountedPrice = getDiscountedPrice(product.price, product.discount);
    const savings = product.price - discountedPrice;

    return (
        <div className="min-h-screen bg-white">
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

            {/* Wishlist Drawer */}
            <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={handleWishlistClose}
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
            />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={handleCartClose}
                cart={cart}
                setCart={setCart}
            />

            {/* Share Feedback */}
            <AnimatePresence>
                {isShareOpen && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2"
                        >
                            {isCopied ? (
                                <>
                                    <CheckCheck size={18} />
                                    Link Copied!
                                </>
                            ) : (
                                <>
                                    <Share2 size={18} />
                                    Share dialog opened!
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* "Added to Cart" Feedback */}
            <AnimatePresence>
                {showAddedFeedback && (
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

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                {/* Breadcrumb */}
                <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-6">
                    <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">
                        Home
                    </button>
                    <span className="text-slate-300">/</span>
                    <button onClick={() => navigate('/products')} className="hover:text-blue-600 transition-colors">
                        Products
                    </button>
                    <span className="text-slate-300">/</span>
                    <button
                        onClick={() => navigate(`/products/${product.category}`)}
                        className="hover:text-blue-600 transition-colors capitalize"
                    >
                        {product.category.replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-800 font-medium truncate">{product.name}</span>
                </nav>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* Left - Product Images */}
                    <div className="space-y-4">
                        <motion.div
                            className="relative aspect-square bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xl"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductImage
                                src={productImages[selectedImage] || product.image}
                                alt={product.name}
                                className="cursor-zoom-in"
                            />

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isNew && (
                                    <motion.span
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg"
                                    >
                                        <Sparkles size={12} className="inline mr-1" />
                                        New
                                    </motion.span>
                                )}
                                {product.isPopular && (
                                    <motion.span
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-full shadow-lg"
                                    >
                                        <TrendingUp size={12} className="inline mr-1" />
                                        Popular
                                    </motion.span>
                                )}
                                {product.discount > 0 && (
                                    <motion.span
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-rose-400 text-white rounded-full shadow-lg animate-pulse"
                                    >
                                        {product.discount}% OFF
                                    </motion.span>
                                )}
                            </div>

                            {/* Wishlist & Share */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => handleWishlistToggle(e)}
                                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 relative z-10"
                                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart
                                        size={18}
                                        className={`${isInWishlist
                                            ? 'fill-rose-500 text-rose-500'
                                            : 'text-slate-600'
                                            } transition-colors`}
                                    />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleShare}
                                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 relative z-10"
                                    aria-label="Share product"
                                >
                                    <Share2 size={18} className="text-slate-600" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right - Product Details */}
                    <div className="space-y-5 lg:space-y-6">
                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2.5 tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {renderStars(product.rating)}
                                </div>
                                <span className="text-slate-300 text-sm" aria-hidden="true">|</span>
                                <span className="text-sm font-medium text-slate-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                                    {product.reviews || 0} reviews
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-100/40">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                ₹{discountedPrice}
                            </span>
                            {product.discount > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                                        ₹{product.price}
                                    </span>
                                    <span className="px-2.5 py-0.5 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-100/80 rounded-lg backdrop-blur-sm">
                                        Save ₹{savings}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="relative flex h-2.5 w-2.5">
                                {product.inStock && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            </span>
                            <span className={`text-xs sm:text-sm font-bold tracking-wide uppercase ${product.inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {product.inStock ? 'In Stock • Ready to Ship' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-slate-800 tracking-wide">Color:</span>
                                <div className="flex flex-wrap gap-2.5">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`group relative p-0.5 rounded-full border-2 transition-all duration-200 ${selectedColor === color
                                                ? 'border-blue-600 shadow-md shadow-blue-600/10 scale-105'
                                                : 'border-slate-200 hover:border-slate-400'
                                                }`}
                                            aria-label={`Select ${color} color`}
                                        >
                                            <span
                                                className="block w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/10 shadow-inner"
                                                style={{ backgroundColor: color.toLowerCase() }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="text-slate-600 text-sm leading-relaxed bg-slate-50 border border-slate-100 p-3.5 sm:p-4 rounded-xl shadow-sm">
                            <p className={`transition-all duration-300 ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                                {product.description || 'Premium quality toy designed for endless fun and learning.'}
                            </p>
                            {product.description && product.description.length > 150 && (
                                <button
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 focus:outline-none"
                                >
                                    {showFullDescription ? (
                                        <>Show less <ChevronUp size={16} /></>
                                    ) : (
                                        <>Read more <ChevronDown size={16} /></>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Product Highlights */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-xs sm:text-sm bg-emerald-50/60 border border-emerald-100/50 p-2 rounded-lg transition-all hover:bg-emerald-50">
                                <Award size={15} className="text-emerald-600 flex-shrink-0" />
                                <span className="text-emerald-800 font-semibold">Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm bg-blue-50/60 border border-blue-100/50 p-2 rounded-lg transition-all hover:bg-blue-50">
                                <ShieldCheck size={15} className="text-blue-600 flex-shrink-0" />
                                <span className="text-blue-800 font-semibold">Certified Safe</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm bg-amber-50/60 border border-amber-100/50 p-2 rounded-lg transition-all hover:bg-amber-50">
                                <ThumbsUp size={15} className="text-amber-600 flex-shrink-0" />
                                <span className="text-amber-800 font-semibold">Top Rated</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm bg-purple-50/60 border border-purple-100/50 p-2 rounded-lg transition-all hover:bg-purple-50">
                                <Gift size={15} className="text-purple-600 flex-shrink-0" />
                                <span className="text-purple-800 font-semibold">Gift Ready</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                            <span className="text-sm font-bold text-slate-800 tracking-wide">Quantity:</span>
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/40 shadow-inner">
                                <button
                                    onClick={() => handleQuantityChange('decrease')}
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-10 text-center font-bold text-slate-800 text-sm select-none">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange('increase')}
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
                                    disabled={quantity >= 10}
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart & Buy Now */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <motion.button
                                whileHover={product.inStock ? { scale: 1.01, y: -1 } : {}}
                                whileTap={product.inStock ? { scale: 0.99 } : {}}
                                onClick={handleAddToCart}
                                className={`flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-sm`}
                                disabled={!product.inStock}
                            >
                                <ShoppingBag size={18} />
                                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                            </motion.button>
                            <motion.button
                                whileHover={product.inStock ? { scale: 1.01, y: -1 } : {}}
                                whileTap={product.inStock ? { scale: 0.99 } : {}}
                                onClick={() => {
                                    if (product.inStock) {
                                        handleAddToCart();
                                        setTimeout(() => navigate('/checkout'), 500);
                                    }
                                }}
                                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                                disabled={!product.inStock}
                            >
                                <Wallet size={18} className="" />
                                <span>Buy Now</span>
                            </motion.button>
                        </div>

                        {/* WhatsApp Support */}
                        <button
                            onClick={handleWhatsAppSupport}
                            className="w-full py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-green-200/50"
                        >
                            <MessageCircle size={16} />
                            Need Help? Chat with us on WhatsApp
                        </button>

                        {/* Features/Benefits Section */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80">
                            <div className="text-center p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                <Truck size={16} className="text-blue-600 mx-auto mb-1" />
                                <p className="text-xs font-bold text-slate-800">Free Shipping</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">On all orders</p>
                            </div>
                            <div className="text-center p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                <ShieldCheck size={16} className="text-emerald-600 mx-auto mb-1" />
                                <p className="text-xs font-bold text-slate-800">Quality Assured</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Premium materials</p>
                            </div>
                            <div className="text-center p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                <Clock size={16} className="text-amber-600 mx-auto mb-1" />
                                <p className="text-xs font-bold text-slate-800">Fast Delivery</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">2-4 business days</p>
                            </div>
                            <div className="text-center p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                <RotateCcw size={16} className="text-purple-600 mx-auto mb-1" />
                                <p className="text-xs font-bold text-slate-800">Easy Returns</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">7-day policy</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description Tab */}
                <div className="mt-6 border-t border-slate-200 pt-6">
                    <div className="border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'description'
                                ? 'text-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Description
                            {activeTab === 'description' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                />
                            )}
                        </button>
                    </div>

                    <div className="py-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="description"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <p className="text-slate-600 leading-relaxed">
                                        {product.description || 'This premium toy is designed with high-quality materials to ensure durability and safety. Perfect for children of all ages, it promotes creativity, learning, and endless fun.'}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                        <div className="flex items-center gap-2 text-sm bg-emerald-50 p-3 rounded-xl">
                                            <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                            <span>High-quality materials</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm bg-blue-50 p-3 rounded-xl">
                                            <Check size={16} className="text-blue-500 flex-shrink-0" />
                                            <span>Safe for children</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm bg-amber-50 p-3 rounded-xl">
                                            <Check size={16} className="text-amber-500 flex-shrink-0" />
                                            <span>Educational & fun</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm bg-purple-50 p-3 rounded-xl">
                                            <Check size={16} className="text-purple-500 flex-shrink-0" />
                                            <span>Durable design</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-2 pt-8 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">
                                You May Also Like
                            </h2>
                            <button
                                onClick={() => navigate('/products')}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                View All →
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((related) => {
                                const relatedDiscounted = getDiscountedPrice(related.price, related.discount);
                                const isRelatedInWishlist = wishlist.includes(related.id);

                                return (
                                    <motion.div
                                        key={related.id}
                                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                        className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                                        onClick={(e) => handleProductClick(related.id, e)}
                                    >
                                        <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden relative">
                                            <ProductImage
                                                src={related.image}
                                                alt={related.name}
                                                className="transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {related.discount > 0 && (
                                                <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                                                    {related.discount}% OFF
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => handleRelatedWishlistToggle(related.id, e)}
                                                className="absolute top-2 left-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all relative z-10"
                                                aria-label={isRelatedInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                            >
                                                <Heart
                                                    size={14}
                                                    className={`${isRelatedInWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
                                                />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                {related.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-sm font-black text-slate-900">₹{relatedDiscounted}</span>
                                                {related.discount > 0 && (
                                                    <span className="text-xs text-slate-400 line-through">₹{related.price}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-0.5 mt-1">
                                                {renderStars(related.rating)}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            <SiteFooter />
        </div>
    );
};

export default ProductDetailPage;