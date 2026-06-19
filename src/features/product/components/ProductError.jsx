import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const ProductError = React.memo(({ error }) => {

    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center py-12 bg-linear-to-br from-red-50 to-red-100 rounded-3xl border border-red-200">
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
    );
});

ProductError.displayName = 'ProductError';