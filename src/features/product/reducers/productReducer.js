import { MAX_PRICE } from '../constants';

const ensureArray = (value) => {
    return Array.isArray(value) ? value : [];
};

export const initialState = {
    products: [],
    categoryName: 'All Products',
    loading: true,
    error: null,
    searchQuery: '',
    sortBy: 'default',
    priceRange: { min: 0, max: MAX_PRICE },
    selectedCategories: [],
    viewMode: 'grid',
    currentPage: 1,
    wishlist: [],
    cart: [],
    addedToCart: {},
    isWishlistOpen: false,
    isCartOpen: false,
    showMobileFilters: false,
    isInitialized: false
};

// Helper to ensure safe state
const createSafeState = (state) => {
    return {
        ...state,
        cart: ensureArray(state.cart),
        wishlist: ensureArray(state.wishlist),
        products: ensureArray(state.products),
        selectedCategories: ensureArray(state.selectedCategories)
    };
};

export function productReducer(state, action) {

    const safeState = createSafeState(state);
    
    switch (action.type) {
        case 'SET_PRODUCTS':
            return {
                ...safeState,
                products: ensureArray(action.payload),
                loading: false,
                error: null,
                isInitialized: true
            };
            
        case 'SET_LOADING':
            return { ...safeState, loading: action.payload };
            
        case 'SET_ERROR':
            return { ...safeState, error: action.payload, loading: false };
            
        case 'SET_SEARCH_QUERY':
            return { ...safeState, searchQuery: action.payload, currentPage: 1 };
            
        case 'SET_SORT_BY':
            return { ...safeState, sortBy: action.payload, currentPage: 1 };
            
        case 'SET_PRICE_RANGE':
            return { ...safeState, priceRange: action.payload, currentPage: 1 };
            
        case 'TOGGLE_CATEGORY_FILTER': {
            const category = action.payload;
            const currentCategories = ensureArray(safeState.selectedCategories);
            return {
                ...safeState,
                selectedCategories: currentCategories.includes(category)
                    ? currentCategories.filter(c => c !== category)
                    : [...currentCategories, category],
                currentPage: 1
            };
        }
        
        case 'SET_VIEW_MODE':
            return { ...safeState, viewMode: action.payload };
            
        case 'SET_CURRENT_PAGE':
            return { ...safeState, currentPage: action.payload };
            
        case 'SET_WISHLIST':
            return { 
                ...safeState, 
                wishlist: ensureArray(action.payload) 
            };
            
        case 'TOGGLE_WISHLIST': {
            const productId = action.payload;
            const currentWishlist = ensureArray(safeState.wishlist);
            const isInWishlist = currentWishlist.includes(productId);
            return {
                ...safeState,
                wishlist: isInWishlist
                    ? currentWishlist.filter(id => id !== productId)
                    : [...currentWishlist, productId]
            };
        }
        
        case 'SET_CART':
            return { 
                ...safeState, 
                cart: ensureArray(action.payload) 
            };
            
        case 'ADD_TO_CART': {
            const currentCart = ensureArray(safeState.cart);
            const quantity = action.payload.quantity ?? 1;
            const existing = currentCart.find(item => item && item.id === action.payload.id);
            let newCart;
            if (existing) {
                newCart = currentCart.map(item =>
                    item && item.id === action.payload.id
                        ? { ...item, quantity: (item.quantity || 0) + quantity }
                        : item
                );
            } else {
                newCart = [...currentCart, { ...action.payload, quantity }];
            }
            return {
                ...safeState,
                cart: newCart,
                addedToCart: { ...safeState.addedToCart, [action.payload.id]: true }
            };
        }
        
        case 'REMOVE_FROM_CART': {
            const currentCart = ensureArray(safeState.cart);
            return {
                ...safeState,
                cart: currentCart.filter(item => item && item.id !== action.payload)
            };
        }
        
        case 'UPDATE_CART_QUANTITY': {
            const currentCart = ensureArray(safeState.cart);
            return {
                ...safeState,
                cart: currentCart.map(item =>
                    item && item.id === action.payload.id
                        ? { ...item, quantity: Math.max(0, (item.quantity || 0) + action.payload.delta) }
                        : item
                )
            };
        }
        
        case 'CLEAR_CART_ITEM_FEEDBACK': {
            const { [action.payload]: _, ...rest } = safeState.addedToCart;
            return { ...safeState, addedToCart: rest };
        }
        
        case 'TOGGLE_WISHLIST_DRAWER':
            return { ...safeState, isWishlistOpen: action.payload };
            
        case 'TOGGLE_CART_DRAWER':
            return { ...safeState, isCartOpen: action.payload };
            
        case 'TOGGLE_MOBILE_FILTERS':
            return { ...safeState, showMobileFilters: !safeState.showMobileFilters };
            
        case 'CLEAR_FILTERS':
            return {
                ...safeState,
                selectedCategories: [],
                priceRange: { min: 0, max: MAX_PRICE },
                sortBy: 'default',
                searchQuery: '',
                currentPage: 1
            };
            
        case 'SET_CATEGORY_NAME':
            return { ...safeState, categoryName: action.payload };
            
        default:
            return safeState;
    }
}