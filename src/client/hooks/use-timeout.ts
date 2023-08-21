import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay: number, dependency: boolean) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (dependency) {
      timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
    } else {
      clearTimeout(timeoutRef.current);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [dependency]);
}
