import { useMemo } from 'react';
import { getDiscountedPrice } from '../data/products';
import { MAX_PRICE } from '../constants';

export const useProductFilters = (products, filters, sortBy) => {
    
    return useMemo(() => {

        let result = products;

        // Apply search filter
        const query = filters.searchQuery?.toLowerCase().trim();
        if (query) {
            result = result.filter(p => {
                const nameMatch = p.name?.toLowerCase().includes(query) ?? false;
                const categoryMatch = p.category?.toLowerCase().includes(query) ?? false;
                const descriptionMatch = p.description?.toLowerCase().includes(query) ?? false;
                const idMatch = p.id?.toString().toLowerCase().includes(query) ?? false;
                const tagsMatch = p.tags?.some(tag => tag?.toLowerCase().includes(query)) ?? false;

                return nameMatch || categoryMatch || descriptionMatch || idMatch || tagsMatch;
            });
        }

        // Apply category filter
        if (!filters.categoryId && filters.selectedCategories.length > 0) {
            result = result.filter(p => filters.selectedCategories.includes(p.category));
        }

        // Apply price filter
        const min = filters.priceRange.min === '' || filters.priceRange.min == null
            ? 0
            : Number(filters.priceRange.min);
        const max = filters.priceRange.max === '' || filters.priceRange.max == null
            ? MAX_PRICE
            : Number(filters.priceRange.max);

        result = result.filter(p => {
            const price = getDiscountedPrice(p.price, p.discount);
            return price >= min && price <= max;
        });

        // Apply sorting
        result = [...result];
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => getDiscountedPrice(a.price, a.discount) - getDiscountedPrice(b.price, b.discount));
                break;
            case 'price-high':
                result.sort((a, b) => getDiscountedPrice(b.price, b.discount) - getDiscountedPrice(a.price, a.discount));
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
                break;
            case 'newest':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'discount':
                result.sort((a, b) => b.discount - a.discount);
                break;
            default:
                break;
        }

        return result;
        
    }, [products, filters, sortBy]);
};