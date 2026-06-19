export const ITEMS_PER_PAGE = 20;
export const MAX_PRICE = 3000;

export const VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list'
};

export const SORT_OPTIONS = [
    { value: 'default', label: 'Default Sorting' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'discount', label: 'Biggest Discount' }
];

export const CATEGORY_NAMES = {
    'panda': 'Panda Collection',
    'colorchangingpanda': 'Color Changing Panda',
    'shinchan': 'Shinchan Collection',
    'all': 'All Products'
};