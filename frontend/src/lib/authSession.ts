export const AUTH_TOKEN_KEY = "token";
export const AUTH_USER_KEY = "user";
export const AUTH_SESSION_EXPIRED_EVENT = "reticket:auth-session-expired";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at?: string;
  updated_at?: string;
  lastLogin?: string | null;
  email_verified: boolean;
  email_verified_at?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
  isOnline?: boolean;
  kycStatus?: string;
};

export type StoredAuthSession = {
  token: string | null;
  user: AuthUser | null;
};

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return false;
}

export function normalizeAuthUser(rawUser: unknown): AuthUser | null {
  if (!rawUser || typeof rawUser !== "object") {
    return null;
  }

  const user = rawUser as Record<string, unknown>;
  const id = typeof user.id === "number" ? user.id : Number(user.id);

  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const name = typeof user.name === "string" ? user.name.trim() : "";
  const email = typeof user.email === "string" ? user.email.trim() : "";
  const phone = typeof user.phone === "string" ? user.phone.trim() : "";
  const role = typeof user.role === "string" ? user.role.trim() : "";

  if (!name || !email || !phone || !role) {
    return null;
  }

  const emailVerified =
    toBoolean(user.email_verified) ||
    toBoolean(user.isVerified) ||
    (user.email_verified_at !== null && user.email_verified_at !== undefined);

  return {
    id,
    name,
    email,
    phone,
    role,
    created_at: typeof user.created_at === "string" ? user.created_at : undefined,
    updated_at: typeof user.updated_at === "string" ? user.updated_at : undefined,
    lastLogin: typeof user.lastLogin === "string" || user.lastLogin === null ? (user.lastLogin as string | null) : undefined,
    email_verified: emailVerified,
    email_verified_at: typeof user.email_verified_at === "string" || user.email_verified_at === null ? (user.email_verified_at as string | null) : undefined,
    isVerified: typeof user.isVerified === "boolean" ? user.isVerified : undefined,
    isActive: typeof user.isActive === "boolean" ? user.isActive : undefined,
    isOnline: typeof user.isOnline === "boolean" ? user.isOnline : undefined,
    kycStatus: typeof user.kycStatus === "string" ? user.kycStatus : undefined,
  };
}

function readStorageValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key: string, value: string | null): void {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors; the in-memory auth state remains authoritative.
  }
}

export function readStoredAuthSession(): StoredAuthSession {
  const token = readStorageValue(AUTH_TOKEN_KEY);
  const userRaw = readStorageValue(AUTH_USER_KEY);

  let parsedUser: AuthUser | null = null;
  if (userRaw) {
    try {
      parsedUser = normalizeAuthUser(JSON.parse(userRaw));
    } catch {
      parsedUser = null;
    }
  }

  return {
    token: token && token.trim() ? token.trim() : null,
    user: parsedUser,
  };
}

export function persistAuthSession(session: StoredAuthSession): void {
  writeStorageValue(AUTH_TOKEN_KEY, session.token && session.token.trim() ? session.token.trim() : null);
  writeStorageValue(AUTH_USER_KEY, session.user ? JSON.stringify(session.user) : null);
}

export function clearStoredAuthSession(): void {
  persistAuthSession({ token: null, user: null });
}

export function dispatchAuthSessionExpired(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
}