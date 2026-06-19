import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { MAX_PRICE } from '../constants';

export const FilterPanel = React.memo(({
    selectedCategories,
    onToggleCategory,
    priceRange,
    onPriceChange,
    availableCategories,
    onClearFilters,
    categoryId
}) => {
    const [localPriceRange, setLocalPriceRange] = useState(priceRange);

    const prevPriceRangeRef = React.useRef(priceRange);
    useEffect(() => {
        if (prevPriceRangeRef.current !== priceRange) {
            prevPriceRangeRef.current = priceRange;
            setLocalPriceRange(priceRange);
        }
    }, [priceRange]);

    const handlePriceApply = useCallback(() => {
        const min = localPriceRange.min === '' ? 0 : Number(localPriceRange.min);
        const max = localPriceRange.max === '' ? MAX_PRICE : Number(localPriceRange.max);
        onPriceChange({ min, max });
    }, [localPriceRange, onPriceChange]);

    const handlePriceInputChange = useCallback((type, value) => {
        if (value === '') {
            setLocalPriceRange(prev => ({
                ...prev,
                [type]: ''
            }));
            return;
        }

        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
            setLocalPriceRange(prev => ({
                ...prev,
                [type]: numValue
            }));
        }
    }, []);

    return (
        <div className="w-64 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Filters</h2>

                {/* Categories */}
                {!categoryId && availableCategories.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Categories</h3>
                        <div className="space-y-2">
                            {availableCategories.map(category => (
                                <label key={category} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => onToggleCategory(category)}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm capitalize">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Range */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Price Range</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-slate-500">Min</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={localPriceRange.min === 0 && localPriceRange.max === MAX_PRICE ? '' : localPriceRange.min}
                                        onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                        placeholder="Min"
                                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
                                    />
                                    {localPriceRange.min !== '' && localPriceRange.min !== 0 && (
                                        <button
                                            onClick={() => handlePriceInputChange('min', '')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            aria-label="Clear min price"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-slate-500">Max</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={localPriceRange.max === MAX_PRICE && localPriceRange.min === 0 ? '' : localPriceRange.max}
                                        onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                        placeholder="Max"
                                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
                                    />
                                    {localPriceRange.max !== '' && localPriceRange.max !== MAX_PRICE && (
                                        <button
                                            onClick={() => handlePriceInputChange('max', '')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            aria-label="Clear max price"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handlePriceApply}
                            className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Apply Price Range
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <button
                    onClick={onClearFilters}
                    className="w-full py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
});

FilterPanel.displayName = 'FilterPanel';