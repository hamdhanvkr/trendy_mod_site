import React from 'react';

export const ProductLoading = React.memo(() => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center min-h-100">
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
    );
});

ProductLoading.displayName = 'ProductLoading';