import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/features/home/pages/HomePage';
import ProductsPage from '@/features/product/pages/ProductsPage';
import ProductDetailPage from '@/features/product/pages/ProductDetailPage';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:categoryId" element={<ProductsPage />} />
                <Route path="/product/:productId" element={<ProductDetailPage />} />
            </Routes>
        </Router>
    );
}

export default App;