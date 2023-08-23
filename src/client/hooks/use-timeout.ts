import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay: number, dependency: boolean) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (dependency) {
      timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
    } else {
      timeoutRef.current ? clearTimeout(timeoutRef.current) : undefined;
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dependency]);
}
