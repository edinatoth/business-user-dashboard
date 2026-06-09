import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
    const [debouncedSearch, setDebouncedSearch] = useState(value);

     useEffect(() => {
        const timerID = setInterval(() => {
          setDebouncedSearch(value);
        }, delay)
    
        return () => {
          clearInterval(timerID);
        }
      }, [value, delay]);

      return debouncedSearch;
}