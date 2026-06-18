import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ShoppingBag,
    Heart,
    Eye,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    ImageOff,
    Check
} from 'lucide-react';
import { getFeaturedProducts, getDiscountedPrice } from '../../product/data/products';
import { useNavigate } from 'react-router-dom';

const ProductImage = ({ src, alt }) => {
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
        <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100">
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
                    <span className="text-sm text-slate-500 font-medium">{alt || 'Image unavailable'}</span>
                </div>
            )}
        </div>
    );
};

const CategoryImage = ({ src, alt }) => {
    const [error, setError] = useState(false);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden">
            {!error ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover border-0 outline-none ring-0"
                    style={{ border: 'none', outline: 'none', background: 'transparent' }}
                    onError={() => setError(true)}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-transparent">
                    <span className="text-4xl">🎯</span>
                </div>
            )}
        </div>
    );
};

const FeaturedSection = ({ onAddToCart, onWishlistToggle, wishlist = [] }) => {

    const navigate = useNavigate();

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [addedToCart, setAddedToCart] = useState({});

    const categories = useMemo(() => [
        {
            id: 'panda',
            name: 'Panda Collection',
            image: '/Panda.png',
            description: '14 Cute panda themed toys',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            hoverColor: 'hover:border-emerald-400',
            gradient: 'from-emerald-50/50 to-teal-50/50'
        },
        {
            id: 'shinchan',
            name: 'Shinchan Collection',
            image: '/Shinchan.png',
            description: 'Funny Shinchan themed toys',
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            hoverColor: 'hover:border-blue-400',
            gradient: 'from-blue-50/50 to-cyan-50/50'
        },
        {
            id: 'colorchangingpanda',
            name: 'Color Changing Panda',
            image: '/Panda.png',
            description: 'Magic panda that changes color',
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            hoverColor: 'hover:border-purple-400',
            gradient: 'from-purple-50/50 to-pink-50/50'
        }
    ], []);

    // Load Featured Products
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const products = await Promise.resolve(getFeaturedProducts());

                if (!products || !Array.isArray(products)) {
                    throw new Error('Invalid products data received');
                }

                const validProducts = products.map(product => ({
                    ...product,
                    image: product.image || '/images/placeholder.jpg'
                }));

                setFeaturedProducts(validProducts);
                setCurrentIndex(0);
            } catch (err) {
                console.error('Error loading featured products:', err);
                setError(err.message || 'Failed to load products');
                setFeaturedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Handle Responsive Items Per View
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 640;
            setIsMobile(mobile);

            let newItemsPerView;
            if (mobile) {
                newItemsPerView = featuredProducts.length || 1;
            } else if (width < 768) {
                newItemsPerView = 2;
            } else if (width < 1024) {
                newItemsPerView = 2;
            } else if (width < 1280) {
                newItemsPerView = 3;
            } else {
                newItemsPerView = 4;
            }
            setItemsPerView(newItemsPerView);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [featuredProducts.length]);

    // Reset current index when items per view changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [itemsPerView]);

    // Calculate pagination
    const totalPages = useMemo(() => {
        if (!featuredProducts.length || isMobile) return 0;
        return Math.ceil(featuredProducts.length / itemsPerView);
    }, [featuredProducts, itemsPerView, isMobile]);

    // Get current page products
    const currentProducts = useMemo(() => {
        if (!featuredProducts.length) return [];
        if (isMobile) {
            return featuredProducts;
        }
        const start = currentIndex * itemsPerView;
        const end = Math.min(start + itemsPerView, featuredProducts.length);
        return featuredProducts.slice(start, end);
    }, [featuredProducts, currentIndex, itemsPerView, isMobile]);

    // Navigation Handlers
    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, [totalPages]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    }, [totalPages]);

    // Event Handlers
    const handleCategoryClick = useCallback((categoryId) => {
        navigate(`/products/${categoryId}`);
    }, [navigate]);

    const handleViewAllClick = useCallback(() => {
        navigate('/products');
    }, [navigate]);

    const handleProductClick = useCallback((productId, e) => {
        // Only navigate if the click wasn't on a button
        if (e && e.target.closest('button')) {
            return;
        }
        navigate(`/product/${productId}`);
    }, [navigate]);

    const handleAddToCartClick = useCallback((product, e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onAddToCart) {
            onAddToCart(product);
            setAddedToCart(prev => ({ ...prev, [product.id]: true }));
            setTimeout(() => {
                setAddedToCart(prev => ({ ...prev, [product.id]: false }));
            }, 10000);
        } else {
            console.log('Add to cart:', product.id);
        }
    }, [onAddToCart]);

    const handleWishlistClick = useCallback((productId, e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Wishlist clicked for product:', productId);
        if (onWishlistToggle) {
            onWishlistToggle(productId);
        } else {
            console.log('Toggle wishlist:', productId);
        }
    }, [onWishlistToggle]);

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
            <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center min-h-[500px]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="mt-6 text-slate-600 font-medium animate-pulse">Loading featured products...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error State
    if (error) {
        return (
            <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
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
            </section>
        );
    }

    // Empty State
    if (featuredProducts.length === 0) {
        return (
            <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Featured Products</h3>
                        <p className="text-slate-500">Check back soon for amazing toys!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-4 sm:py-6 lg:py-8 bg-gradient-to-b from-white via-slate-50/50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Featured Toys</h2>
                        </div>
                        <p className="text-slate-500 text-sm sm:text-base max-w-xl">Handpicked premium toys that kids absolutely love</p>
                    </div>
                    <motion.button
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleViewAllClick}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        View All Products
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
                    {categories.map((category, index) => (
                        <motion.button
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`group relative p-4 sm:p-5 rounded-2xl border-2 ${category.borderColor} ${category.bgColor} ${category.hoverColor} hover:shadow-lg transition-all duration-300 text-left overflow-hidden`}
                        >
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-sm transform transition-transform group-hover:scale-110 group-hover:rotate-6 border-0">
                                    <CategoryImage src={category.image} alt={category.name} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">{category.description}</p>
                                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                        <span>Browse Collection</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                            <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                            <div className={`absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-tr ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                        </motion.button>
                    ))}
                </div>

                {/* Featured Products Carousel */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {totalPages > 1 && !isMobile && (
                        <AnimatePresence>
                            {(isHovering || window.innerWidth >= 1024) && (
                                <>
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={prevSlide}
                                        className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300"
                                        aria-label="Previous products"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.button>
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={nextSlide}
                                        className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300"
                                        aria-label="Next products"
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.button>
                                </>
                            )}
                        </AnimatePresence>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isMobile ? 'all-products' : currentIndex}
                            initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isMobile ? 0 : -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                        >
                            {currentProducts.map((product, index) => {
                                const discountedPrice = getDiscountedPrice(product.price, product.discount);
                                const isInWishlist = wishlist.includes(product.id);
                                const isAdded = addedToCart[product.id];

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, type: 'spring', stiffness: 400 }}
                                        whileHover={{ y: -4 }}
                                        className="group rounded-md md:rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                    >
                                        <div
                                            className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden cursor-pointer"
                                            onClick={(e) => handleProductClick(product.id, e)}
                                        >
                                            <ProductImage src={product.image} alt={product.name} />

                                            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5">
                                                {product.isNew && (
                                                    <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white rounded-full shadow-lg animate-pulse">New</span>
                                                )}
                                                {product.isPopular && (
                                                    <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-lg">Popular</span>
                                                )}
                                                {product.discount > 0 && (
                                                    <span className="px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white rounded-full shadow-lg">{product.discount}% OFF</span>
                                                )}
                                            </div>

                                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-1.5">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => handleWishlistClick(product.id, e)}
                                                    className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 relative z-10"
                                                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                                >
                                                    <Heart
                                                        size={14}
                                                        className={`${isInWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-600'} transition-colors duration-200 sm:w-4 sm:h-4`}
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

                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                        </div>

                                        <div className="p-2 sm:p-3 md:p-4">
                                            <div className="mb-0.5 sm:mb-1.5">{renderStars(product.rating)}</div>

                                            <h3
                                                className="text-xs sm:text-sm font-bold mt-2 text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer"
                                                onClick={() => handleProductClick(product.id)}
                                            >
                                                {product.name}
                                            </h3>

                                            <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                                                <span className="text-sm sm:text-lg font-black text-slate-900">₹{discountedPrice}</span>
                                                {product.discount > 0 && (
                                                    <>
                                                        <span className="text-[10px] sm:text-sm text-slate-400 line-through">₹{product.price}</span>
                                                        <span className="text-[8px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded">
                                                            Save ₹{product.price - discountedPrice}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={(e) => handleAddToCartClick(product, e)}
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
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {totalPages > 1 && !isMobile && (
                        <div className="flex justify-center gap-1.5 mt-6">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === index
                                        ? 'w-6 bg-blue-600'
                                        : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                                        }`}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default React.memo(FeaturedSection);