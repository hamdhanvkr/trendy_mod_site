import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

export const ProductImage = React.memo(({ src, alt, className = "", priority = false }) => {

    const [imgError, setImgError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        if (priority) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '50px' }
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    const handleError = useCallback(() => {
        if (!imgError) {
            console.warn(`Failed to load image: ${src}`);
            setImgError(true);
            setIsLoaded(true);
        }
    }, [src, imgError]);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div
            ref={imageRef}
            className={`relative w-full h-full bg-linear-to-br from-slate-50 to-slate-100 ${className}`}
        >
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {(isVisible || priority) && (
                !imgError ? (
                    <img
                        src={src}
                        alt={alt || 'Product image'}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onError={handleError}
                        onLoad={handleLoad}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
                        <ImageOff className="w-12 h-12 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500 font-medium">
                            {alt || 'Image unavailable'}
                        </span>
                    </div>
                )
            )}
        </div>
    );
});

ProductImage.displayName = 'ProductImage';