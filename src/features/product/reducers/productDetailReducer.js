import { TAB_TYPES } from '../constants';

export const productDetailInitialState = {
    product: null,
    relatedProducts: [],
    quantity: 1,
    selectedImage: 0,
    activeTab: TAB_TYPES.DESCRIPTION,
    loading: true,
    error: null,
    showFullDescription: false,
    selectedColor: null,
    showAddedFeedback: false,
    isWishlistOpen: false,
    isCartOpen: false,
    isShareOpen: false,
    isCopied: false,
    wishlist: [],
    cart: []
};

export function productDetailReducer(state, action) {
    
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_PRODUCT':
            return {
                ...state,
                product: action.payload,
                loading: false,
                error: null
            };
        case 'SET_RELATED_PRODUCTS':
            return { ...state, relatedProducts: action.payload };
        case 'SET_QUANTITY':
            return { ...state, quantity: action.payload };
        case 'SET_SELECTED_IMAGE':
            return { ...state, selectedImage: action.payload };
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
        case 'TOGGLE_FULL_DESCRIPTION':
            return { ...state, showFullDescription: !state.showFullDescription };
        case 'SET_SELECTED_COLOR':
            return { ...state, selectedColor: action.payload };
        case 'SET_ADDED_FEEDBACK':
            return { ...state, showAddedFeedback: action.payload };
        case 'TOGGLE_WISHLIST_DRAWER':
            return { ...state, isWishlistOpen: action.payload };
        case 'TOGGLE_CART_DRAWER':
            return { ...state, isCartOpen: action.payload };
        case 'SET_SHARE_OPEN':
            return { ...state, isShareOpen: action.payload };
        case 'SET_COPIED':
            return { ...state, isCopied: action.payload };
        case 'SET_WISHLIST':
            return { ...state, wishlist: action.payload };
        case 'SET_CART':
            return { ...state, cart: action.payload };
        case 'RESET_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}