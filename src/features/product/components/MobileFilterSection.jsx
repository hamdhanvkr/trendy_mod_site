import React from 'react';
import { motion } from 'framer-motion';
import { MAX_PRICE } from '../constants';

export const MobileFilterSection = React.memo(({
    showMobileFilters,
    categoryId,
    availableCategories,
    selectedCategories,
    priceRange,
    searchQuery,
    onToggleCategory,
    onClearFilters,
    onToggleMobileFilters,
    onPriceChange,
    activeFilterCount
}) => {
    if (!showMobileFilters) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
        >
            <div className="pt-4 pb-2 border-t border-slate-200">
                {/* Categories */}
                {!categoryId && availableCategories.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-slate-700 mb-2">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => onToggleCategory(category)}
                                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategories.includes(category)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Range */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Price Range</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <label className="text-xs text-slate-500">Min</label>
                            <input
                                type="number"
                                value={priceRange.min === 0 && priceRange.max === MAX_PRICE ? '' : priceRange.min}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        onPriceChange({ ...priceRange, min: 0 });
                                    } else {
                                        const num = parseInt(value, 10);
                                        if (!isNaN(num) && num >= 0) {
                                            onPriceChange({ ...priceRange, min: num });
                                        }
                                    }
                                }}
                                placeholder="Min"
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-500">Max</label>
                            <input
                                type="number"
                                value={priceRange.max === MAX_PRICE && priceRange.min === 0 ? '' : priceRange.max}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        onPriceChange({ ...priceRange, max: MAX_PRICE });
                                    } else {
                                        const num = parseInt(value, 10);
                                        if (!isNaN(num) && num >= 0) {
                                            onPriceChange({ ...priceRange, max: num });
                                        }
                                    }
                                }}
                                placeholder="Max"
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onClearFilters}
                        className="flex-1 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onToggleMobileFilters}
                        className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>

                {/* Active filters summary */}
                {activeFilterCount > 0 && (
                    <div className="mt-3 text-xs text-slate-500">
                        {selectedCategories.length > 0 && (
                            <span className="inline-block mr-3">
                                Categories: {selectedCategories.length}
                            </span>
                        )}
                        {searchQuery && (
                            <span className="inline-block mr-3">
                                Search: "{searchQuery}"
                            </span>
                        )}
                        {(priceRange.min > 0 || priceRange.max < MAX_PRICE) && (
                            <span>
                                Price: ₹{priceRange.min} - ₹{priceRange.max}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
});

MobileFilterSection.displayName = 'MobileFilterSection';