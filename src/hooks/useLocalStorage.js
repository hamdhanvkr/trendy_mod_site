import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {

    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;
            
            const parsed = JSON.parse(item);
            
            if (key === 'cart' || key === 'wishlist') {
                if (!Array.isArray(parsed)) {
                    console.warn(`Invalid ${key} data in localStorage, resetting to initial value`);
                    window.localStorage.removeItem(key);
                    return initialValue;
                }
            }
            return parsed;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            window.localStorage.removeItem(key);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            if (key === 'cart' || key === 'wishlist') {
                if (!Array.isArray(valueToStore)) {
                    console.warn(`Attempted to save non-array to ${key}, converting to empty array`);
                    setStoredValue([]);
                    window.localStorage.setItem(key, JSON.stringify([]));
                    return;
                }
            }
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}