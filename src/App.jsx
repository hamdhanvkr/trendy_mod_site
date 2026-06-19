import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/features/home/pages/HomePage';
import ProductsPage from '@/features/product/pages/ProductsPage';
import ProductDetailPage from '@/features/product/pages/ProductDetailPage';

function App() {
    return (
        <Router>
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