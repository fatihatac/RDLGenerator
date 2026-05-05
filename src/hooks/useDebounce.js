import { useEffect, useRef, useState } from 'react';

/**
 * Debounces a value by delayMs milliseconds.
 * @param {*} value - The value to debounce.
 * @param {number} delayMs - Delay in milliseconds.
 * @returns {*} The debounced value.
 */
function useDebounce(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const parseTimeoutRef = useRef(null);

  useEffect(() => {
    parseTimeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(parseTimeoutRef.current);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

export default useDebounce;
