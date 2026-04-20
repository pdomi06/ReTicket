import { useContext } from "react";
import { LoadingContext } from "./LoadingContextStore";

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
