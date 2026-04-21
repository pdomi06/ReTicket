import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type LoadingContextValue = {
    isPageLoading: boolean;
    trackPageLoading: <T>(promiseOrPromises: Promise<T> | Promise<T>[]) => Promise<T | T[]>;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

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

export function usePageLoading() {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error("usePageLoading must be used within a LoadingProvider");
    }

    return context.trackPageLoading;
}

export function useIsPageLoading() {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error("useIsPageLoading must be used within a LoadingProvider");
    }

    return context.isPageLoading;
}
