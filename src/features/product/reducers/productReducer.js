import { MAX_PRICE } from '../constants';

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

export function productReducer(state, action) {
    
    switch (action.type) {
        case 'SET_PRODUCTS':
            return {
                ...state,
                products: action.payload,
                loading: false,
                error: null,
                isInitialized: true
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload, currentPage: 1 };
        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload, currentPage: 1 };
        case 'SET_PRICE_RANGE':
            return { ...state, priceRange: action.payload, currentPage: 1 };
        case 'TOGGLE_CATEGORY_FILTER': {
            const category = action.payload;
            return {
                ...state,
                selectedCategories: state.selectedCategories.includes(category)
                    ? state.selectedCategories.filter(c => c !== category)
                    : [...state.selectedCategories, category],
                currentPage: 1
            };
        }
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        case 'SET_CURRENT_PAGE':
            return { ...state, currentPage: action.payload };
        case 'SET_WISHLIST':
            return { ...state, wishlist: action.payload };
        case 'TOGGLE_WISHLIST': {
            const productId = action.payload;
            const isInWishlist = state.wishlist.includes(productId);
            return {
                ...state,
                wishlist: isInWishlist
                    ? state.wishlist.filter(id => id !== productId)
                    : [...state.wishlist, productId]
            };
        }
        case 'SET_CART':
            return { ...state, cart: action.payload };
        case 'ADD_TO_CART': {
            const quantity = action.payload.quantity ?? 1;
            const existing = state.cart.find(item => item.id === action.payload.id);
            let newCart;
            if (existing) {
                newCart = state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newCart = [...state.cart, { ...action.payload, quantity }];
            }
            return {
                ...state,
                cart: newCart,
                addedToCart: { ...state.addedToCart, [action.payload.id]: true }
            };
        }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload)
            };
        case 'UPDATE_CART_QUANTITY':
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(0, item.quantity + action.payload.delta) }
                        : item
                )
            };
        case 'CLEAR_CART_ITEM_FEEDBACK': {
            // eslint-disable-next-line no-unused-vars
            const { [action.payload]: _, ...rest } = state.addedToCart;
            return { ...state, addedToCart: rest };
        }
        case 'TOGGLE_WISHLIST_DRAWER':
            return { ...state, isWishlistOpen: action.payload };
        case 'TOGGLE_CART_DRAWER':
            return { ...state, isCartOpen: action.payload };
        case 'TOGGLE_MOBILE_FILTERS':
            return { ...state, showMobileFilters: !state.showMobileFilters };
        case 'CLEAR_FILTERS':
            return {
                ...state,
                selectedCategories: [],
                priceRange: { min: 0, max: MAX_PRICE },
                sortBy: 'default',
                searchQuery: '',
                currentPage: 1
            };
        case 'SET_CATEGORY_NAME':
            return { ...state, categoryName: action.payload };
        default:
            return state;
    }
}