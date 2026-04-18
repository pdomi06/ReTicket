import { dispatchAuthSessionExpired, readStoredAuthSession } from "./authSession";

type ApiFetchOptions = RequestInit & {
  includeAuth?: boolean;
};

export async function apiFetch(input: RequestInfo | URL, options: ApiFetchOptions = {}): Promise<Response> {
  const { includeAuth = true, headers, ...rest } = options;
  const mergedHeaders = new Headers(headers ?? undefined);

  if (!mergedHeaders.has("Accept")) {
    mergedHeaders.set("Accept", "application/json");
  }

  if (includeAuth && !mergedHeaders.has("Authorization")) {
    const { token } = readStoredAuthSession();

    if (token) {
      mergedHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(input, {
    ...rest,
    headers: mergedHeaders,
  });

  if (response.status === 401) {
    dispatchAuthSessionExpired();
  }

  return response;
}