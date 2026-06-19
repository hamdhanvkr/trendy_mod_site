import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, getProductsByCategory } from '../data/products';

export const useProductDetail = (productId) => {
    
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

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

                const related = getProductsByCategory(foundProduct.category)
                    .filter(p => p.id !== foundProduct.id)
                    .slice(0, 4);
                setRelatedProducts(related);

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

    const productImages = useMemo(() => {
        if (!product) return [];
        const images = [product.image];
        if (product.images && product.images.length > 0) {
            return [product.image, ...product.images];
        }
        for (let i = 2; i <= 4; i++) {
            images.push(`/images/products/${product.id}-${i}.jpg`);
        }
        return images;
    }, [product]);

    const handleProductClick = useCallback((id, e) => {
        if (e && e.target.closest('button')) {
            return;
        }
        navigate(`/product/${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [navigate]);

    return {
        product,
        relatedProducts,
        loading,
        error,
        selectedColor,
        setSelectedColor,
        productImages,
        handleProductClick
    };
};