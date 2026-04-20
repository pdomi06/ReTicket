import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { LoadingContext, type LoadingContextValue } from "./LoadingContextStore";

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isPageLoading, setIsPageLoading] = useState(false);
    const activeRequestCountRef = useRef(0);

    const incrementLoading = useCallback(() => {
        activeRequestCountRef.current += 1;
        if (activeRequestCountRef.current === 1) {
            setIsPageLoading(true);
        }
    }, []);

    const decrementLoading = useCallback(() => {
        activeRequestCountRef.current = Math.max(0, activeRequestCountRef.current - 1);
        if (activeRequestCountRef.current === 0) {
            setIsPageLoading(false);
        }
    }, []);

    const trackPageLoading = useCallback(async <T,>(promiseOrPromises: Promise<T> | Promise<T>[]) => {
        incrementLoading();

        try {
            if (Array.isArray(promiseOrPromises)) {
                return await Promise.all(promiseOrPromises);
            }

            return await promiseOrPromises;
        } finally {
            decrementLoading();
        }
    }, [decrementLoading, incrementLoading]);

    const value = useMemo<LoadingContextValue>(() => ({
        isPageLoading,
        trackPageLoading,
    }), [isPageLoading, trackPageLoading]);

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
}