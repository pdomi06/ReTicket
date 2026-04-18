import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
    AUTH_SESSION_EXPIRED_EVENT,
    clearStoredAuthSession,
    normalizeAuthUser,
    persistAuthSession,
    readStoredAuthSession,
    type AuthUser,
} from "../../lib/authSession";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./auth-context";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");

function resolveResponseUser(payload: unknown): unknown {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    const data = payload as { data?: unknown; user?: unknown };
    if (data.data && typeof data.data === "object") {
        const nested = data.data as { user?: unknown };
        if (nested.user) {
            return nested.user;
        }
    }

    if (data.user) {
        return data.user;
    }

    return payload;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const initialSession = readStoredAuthSession();
    const [user, setUser] = useState<AuthUser | null>(initialSession.user);
    const [token, setToken] = useState<string | null>(initialSession.token);
    const [status, setStatus] = useState<AuthStatus>(initialSession.token ? "bootstrapping" : "ready");

    const clearSession = useCallback(() => {
        setUser(null);
        setToken(null);
        clearStoredAuthSession();
        setStatus("ready");
    }, []);

    const setSession = useCallback((session: { user: unknown; token: string }) => {
        const nextUser = normalizeAuthUser(session.user);
        const nextToken = session.token.trim();

        if (!nextUser || !nextToken) {
            clearSession();
            return;
        }

        setUser(nextUser);
        setToken(nextToken);
        persistAuthSession({ user: nextUser, token: nextToken });
        setStatus("ready");
    }, [clearSession]);

    const refreshSession = useCallback(async (): Promise<boolean> => {
        const currentToken = token ?? readStoredAuthSession().token;

        if (!currentToken) {
            clearSession();
            return false;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/me`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${currentToken}`,
                },
            });

            if (response.status === 401) {
                clearSession();
                return false;
            }

            if (!response.ok) {
                return false;
            }

            const payload = await response.json();
            const refreshedUser = normalizeAuthUser(resolveResponseUser(payload));

            if (!refreshedUser) {
                clearSession();
                return false;
            }

            setUser(refreshedUser);
            setToken(currentToken);
            persistAuthSession({ user: refreshedUser, token: currentToken });
            return true;
        } catch {
            return false;
        } finally {
            setStatus("ready");
        }
    }, [clearSession, token]);

    useEffect(() => {
        const syncExpiredSession = () => {
            clearSession();
        };

        window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, syncExpiredSession);

        return () => {
            window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, syncExpiredSession);
        };
    }, [clearSession]);

    useEffect(() => {
        if (!token) {
            setStatus("ready");
            return;
        }

        let cancelled = false;

        const bootstrap = async () => {
            setStatus("bootstrapping");
            await refreshSession();

            if (cancelled) {
                return;
            }

            setStatus("ready");
        };

        void bootstrap();

        return () => {
            cancelled = true;
        };
    }, [refreshSession, token]);

    useEffect(() => {
        if (!token) {
            return;
        }

        const refreshIfVisible = () => {
            if (document.visibilityState === "visible") {
                void refreshSession();
            }
        };

        const onFocus = () => {
            void refreshSession();
        };

        document.addEventListener("visibilitychange", refreshIfVisible);
        window.addEventListener("focus", onFocus);

        const intervalId = window.setInterval(() => {
            if (document.visibilityState === "visible") {
                void refreshSession();
            }
        }, 10 * 60 * 1000);

        return () => {
            document.removeEventListener("visibilitychange", refreshIfVisible);
            window.removeEventListener("focus", onFocus);
            window.clearInterval(intervalId);
        };
    }, [refreshSession, token]);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        token,
        status,
        isAuthenticated: Boolean(user && token),
        setSession,
        refreshSession,
        clearSession,
    }), [clearSession, refreshSession, setSession, status, token, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}