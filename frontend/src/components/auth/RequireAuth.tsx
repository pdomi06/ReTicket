import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/auth/useAuth";

export default function RequireAuth({ children }: { children: ReactNode }) {
    const location = useLocation();
    const { status, isAuthenticated } = useAuth();

    if (status !== "ready") {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}