import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProductBreadcrumb = React.memo(({ product }) => {

    const navigate = useNavigate();

    if (!product) return null;

    return (
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
    );
});

ProductBreadcrumb.displayName = 'ProductBreadcrumb';