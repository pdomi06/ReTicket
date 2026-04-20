import { createContext } from "react";

export type LoadingContextValue = {
    isPageLoading: boolean;
    trackPageLoading: <T>(promiseOrPromises: Promise<T> | Promise<T>[]) => Promise<T | T[]>;
};

export const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);