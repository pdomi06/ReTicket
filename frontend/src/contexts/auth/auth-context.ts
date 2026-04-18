import { createContext } from "react";
import type { AuthUser } from "../../lib/authSession";

export type AuthStatus = "bootstrapping" | "ready";

export type AuthContextValue = {
    user: AuthUser | null;
    token: string | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    setSession: (session: { user: unknown; token: string }) => void;
    refreshSession: () => Promise<boolean>;
    clearSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
