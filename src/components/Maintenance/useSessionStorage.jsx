import { useState, useEffect } from 'react';

const useSessionStorage = (key, defaultValue = false) => {
    const [storedValue, setStoredValue] = useState(() => {
        const value = sessionStorage.getItem(key);
        return value !== null ? JSON.parse(value) : defaultValue;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const value = sessionStorage.getItem(key);
            setStoredValue(value !== null ? JSON.parse(value) : defaultValue);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, defaultValue]);

    return [storedValue, setStoredValue];
};

export default useSessionStorage;
