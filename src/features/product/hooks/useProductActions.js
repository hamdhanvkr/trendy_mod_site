import { useCallback } from 'react';
import { trackEvent } from '@/utils/analytics';

export const useProductActions = (state, dispatch, navigate, location) => {

    const handleSearch = useCallback((query) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
        const searchParams = new URLSearchParams(location.search);
        if (query && query.trim()) {
            searchParams.set('search', query.trim());
        } else {
            searchParams.delete('search');
        }
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }, [dispatch, navigate, location]);

    const clearSearch = useCallback(() => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('search');
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }, [dispatch, navigate, location]);

    const handleSortChange = useCallback((e) => {
        dispatch({ type: 'SET_SORT_BY', payload: e.target.value });
    }, [dispatch]);

    const handlePriceChange = useCallback((newRange) => {
        dispatch({ type: 'SET_PRICE_RANGE', payload: newRange });
    }, [dispatch]);

    const toggleCategoryFilter = useCallback((category) => {
        dispatch({ type: 'TOGGLE_CATEGORY_FILTER', payload: category });
    }, [dispatch]);

    const clearFilters = useCallback(() => {
        dispatch({ type: 'CLEAR_FILTERS' });
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('search');
        navigate(`/products?${searchParams.toString()}`, { replace: true });
        dispatch({ type: 'TOGGLE_MOBILE_FILTERS' });
    }, [dispatch, navigate, location]);

    const toggleWishlist = useCallback((productId, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        dispatch({ type: 'TOGGLE_WISHLIST', payload: productId });

        const isInWishlist = state.wishlist.includes(productId);
        trackEvent(isInWishlist ? 'remove_from_wishlist' : 'add_to_wishlist', {
            productId
        });
    }, [dispatch, state.wishlist]);

    const handleAddToCart = useCallback((product, quantityOrEvent = 1, maybeEvent) => {
        let quantity = 1;
        let e = null;

        if (typeof quantityOrEvent === 'number') {
            quantity = quantityOrEvent;
            e = maybeEvent;
        } else {
            e = quantityOrEvent;
        }

        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, quantity }
        });

        trackEvent('add_to_cart', {
            productId: product.id,
            price: product.price,
            quantity
        });

        setTimeout(() => {
            dispatch({ type: 'CLEAR_CART_ITEM_FEEDBACK', payload: product.id });
        }, 3000);
    }, [dispatch]);

    const handleProductClick = useCallback((productId, e) => {
        if (e && e.target.closest('button')) {
            return;
        }
        navigate(`/product/${productId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [navigate]);

    const handleCategorySelect = useCallback((id) => {
        navigate(`/products/${id}`);
    }, [navigate]);

    const handleViewModeChange = useCallback((mode) => {
        dispatch({ type: 'SET_VIEW_MODE', payload: mode });
    }, [dispatch]);

    const loadMore = useCallback((hasMore, loading, currentPage) => {
        if (hasMore && !loading) {
            dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage + 1 });
        }
    }, [dispatch]);

    const toggleMobileFilters = useCallback(() => {
        dispatch({ type: 'TOGGLE_MOBILE_FILTERS' });
    }, [dispatch]);

    return {
        handleSearch,
        clearSearch,
        handleSortChange,
        handlePriceChange,
        toggleCategoryFilter,
        clearFilters,
        toggleWishlist,
        handleAddToCart,
        handleProductClick,
        handleCategorySelect,
        handleViewModeChange,
        loadMore,
        toggleMobileFilters
    };
};