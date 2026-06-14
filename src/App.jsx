// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, ArrowLeft, ShoppingCart, Sparkles, Gift, Star, ChevronLeft, ChevronRight, TrendingUp, Clock, Award, Zap } from 'lucide-react';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import SideMenu from './components/SideMenu';
import Marquee from './components/Marquee';
import { products } from './data/products';
import { categoryCollections } from './data/categories';

// Category Page Component
function CategoryPage({ onAddToCart, cartItemCount, setIsCartOpen }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  const category = categoryCollections[categoryId];

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Category not found</h2>
          <button onClick={() => navigate('/')} className="mt-4 text-orange-500">Go Back Home</button>
        </div>
      </div>
    );
  }

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100 transition">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
                <p className="text-sm text-gray-500">{category.products.length} products</p>
              </div>
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
              <ShoppingBag size={18} />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {category.products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
                {!imageErrors[product.id] && product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(product.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {product.emoji || '🧸'}
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg md:text-xl font-bold text-orange-600">₹{product.price}</span>
                  <button
                    onClick={() => onAddToCart(product, 1)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-full hover:shadow-lg transition-all hover:scale-105"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Featured Products Slider Component
function FeaturedSlider({ products, onAddToCart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / 3));
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(products.length / 3)) % Math.ceil(products.length / 3));
  };

  const featuredProducts = products.filter(p => p.isPopular || p.isNew).slice(0, 9);

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-orange-500" size={24} />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prevSlide} className="p-2 rounded-full bg-white shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} className="p-2 rounded-full bg-white shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="relative overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ x: direction === 1 ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === 1 ? -300 : 300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredProducts.slice(currentIndex * 3, (currentIndex + 1) * 3).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image || `/images/products/${product.id}.jpg`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = `https://via.placeholder.com/300x300?text=${product.emoji}`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <button
                    onClick={() => onAddToCart(product, 1)}
                    className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">New</span>
                )}
                {product.isPopular && (
                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} /> Popular
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Stats Counter Component
function StatsSection() {
  const stats = [
    { icon: Gift, value: "10k+", label: "Happy Customers", color: "text-orange-500" },
    { icon: Award, value: "50+", label: "Toy Varieties", color: "text-yellow-500" },
    { icon: Clock, value: "24/7", label: "Customer Support", color: "text-green-500" },
    { icon: Zap, value: "2-3 Days", label: "Fast Delivery", color: "text-blue-500" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <stat.icon size={40} className={`${stat.color} mx-auto mb-3`} />
          <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// Category Section Component for Home Page
function CategorySection({ title, emoji, description, products, categoryPath, bgGradient, delay }) {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: delay }}
      className={`mb-16 rounded-3xl p-6 ${bgGradient} hover:shadow-xl transition-all duration-500`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <motion.div 
            className="text-5xl"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {emoji}
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(categoryPath)}
          className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full hover:bg-white shadow-md transition-all duration-300"
        >
          <span className="text-sm font-semibold text-orange-600">View All</span>
          <span className="text-orange-600 group-hover:translate-x-1 transition">→</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {products.slice(0, 5).map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group/product"
          >
            <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden relative">
              {!imageErrors[product.id] && product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-500"
                  onError={() => handleImageError(product.id)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {product.emoji || '🧸'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => {
                    const addToCartEvent = new CustomEvent('addToCart', { detail: { product, quantity: 1 } });
                    window.dispatchEvent(addToCartEvent);
                  }}
                  className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-semibold transform translate-y-4 group-hover/product:translate-y-0 transition-all duration-300"
                >
                  Quick Add
                </button>
              </div>
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">New</span>
              )}
              {product.isPopular && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} /> Popular
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2 min-h-[40px]">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg md:text-xl font-bold text-orange-600">₹{product.price}</span>
                <button
                  onClick={() => {
                    const addToCartEvent = new CustomEvent('addToCart', { detail: { product, quantity: 1 } });
                    window.dispatchEvent(addToCartEvent);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-full hover:shadow-lg transition-all hover:scale-105"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Hero Banner Component - FIXED (No Icons, No Emojis)
function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const banners = [
    { title: "Big Summer Sale!", subtitle: "Up to 50% off on select toys", color: "from-purple-600 to-pink-500" },
    { title: "New Arrivals!", subtitle: "Check out our latest collection", color: "from-blue-600 to-cyan-500" },
    { title: "Free Delivery!", subtitle: "On orders above ₹1000", color: "from-green-600 to-emerald-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const banner = banners[currentBanner];

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        key={currentBanner}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden bg-gradient-to-r ${banner.color} rounded-2xl p-8 mb-8 text-center cursor-pointer group`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-5 text-4xl animate-bounce">🎈</div>
          <div className="absolute bottom-5 right-5 text-4xl animate-spin-slow">🎪</div>
          <div className="absolute top-1/2 left-1/4 text-3xl animate-pulse">🎨</div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            {banner.title}
          </h2>
          <p className="text-white/90 text-lg md:text-xl">{banner.subtitle}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-white text-gray-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Shop Now →
          </motion.button>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentBanner === idx ? 'w-6 bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Home Page Component
function HomePage({ onAddToCart, cartItemCount, setIsCartOpen, setIsMenuOpen, products }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pandaProducts = products.filter(p => p.category === 'soft' || p.name.includes('Panda'));
  const colorPandaProducts = products.filter(p => p.category === 'action');
  const sinchanProducts = products.filter(p => p.category === 'educational');

  return (
    <>
      <Marquee />

      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm shadow-sm'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Menu size={22} />
              </motion.button>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <motion.span 
                  className="text-2xl"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  🎪
                </motion.span>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Trendy Mod
                  </h1>
                  <p className="text-xs text-gray-400">Toys & More</p>
                </div>
              </motion.div>
            </div>

            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      <HeroBanner />

      <div className="container mx-auto px-4 py-4">
        <StatsSection />
        
        <FeaturedSlider products={products} onAddToCart={onAddToCart} />

        <CategorySection
          title="Panda Collection"
          emoji="🐼"
          description="Cute and cuddly panda toys for all ages"
          products={pandaProducts}
          categoryPath="/category/panda"
          bgGradient="bg-gradient-to-br from-white to-amber-50"
          delay={0}
        />

        <CategorySection
          title="Color Changing Panda"
          emoji="🎨"
          description="Magic pandas that change color with temperature"
          products={colorPandaProducts}
          categoryPath="/category/colorChangingPanda"
          bgGradient="bg-gradient-to-br from-white to-purple-50"
          delay={0.1}
        />

        <CategorySection
          title="Shinchan Mobile Stand"
          emoji="📱"
          description="Funny Shinchan themed phone stands and accessories"
          products={sinchanProducts}
          categoryPath="/category/sinchanMobileStand"
          bgGradient="bg-gradient-to-br from-white to-blue-50"
          delay={0.2}
        />
      </div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-orange-500 to-amber-500 mx-4 md:mx-8 rounded-3xl p-8 mb-12 text-center text-white"
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-orange-100 mb-6">Get exclusive offers and updates directly in your inbox</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Subscribe
          </motion.button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎪</span>
                <span className="font-bold text-xl">Trendy Mod</span>
              </div>
              <p className="text-gray-400 text-sm">Spreading joy one toy at a time. Handcrafted with love in India.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 support@trendymod.com</li>
                <li>📞 +91 98765 43210</li>
                <li>💬 Available on WhatsApp</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {['📷', '📘', '🎵', '🐦'].map((social, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.2, y: -3 }}
                    className="text-2xl cursor-pointer hover:text-orange-400 transition"
                  >
                    {social}
                  </motion.span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">© 2026 Trendy Mod. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// Main App Component
function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  React.useEffect(() => {
    const handleAddToCart = (event) => {
      addToCart(event.detail.product, event.detail.quantity);
    };
    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, []);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Routes>
        <Route path="/" element={
          <HomePage
            onAddToCart={addToCart}
            cartItemCount={cartItemCount}
            setIsCartOpen={setIsCartOpen}
            setIsMenuOpen={setIsMenuOpen}
            products={products}
          />
        } />
        <Route path="/category/:categoryId" element={
          <CategoryPage
            onAddToCart={addToCart}
            cartItemCount={cartItemCount}
            setIsCartOpen={setIsCartOpen}
          />
        } />
      </Routes>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={(categoryId) => {
          navigate(`/category/${categoryId}`);
          setIsMenuOpen(false);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
      />
    </div>
  );
}

export default App;