export type UserRole = 'jobseeker' | 'employer' | 'admin';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

type ApiRequestOptions = RequestInit & {
  skipAuth?: boolean;
  retryOnAuthError?: boolean;
};

const isBrowser = () => typeof window !== 'undefined';
const emitAuthChanged = () => {
  if (isBrowser()) window.dispatchEvent(new Event('auth-state-changed'));
};

export const authStorage = {
  getAccessToken: () => (isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null),
  setAccessToken: (token: string) => {
    if (isBrowser()) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      emitAuthChanged();
    }
  },
  clearAccessToken: () => {
    if (isBrowser()) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      emitAuthChanged();
    }
  },
  getUser: <T = unknown>(): T | null => {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setUser: (user: unknown) => {
    if (isBrowser()) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      emitAuthChanged();
    }
  },
  clearUser: () => {
    if (isBrowser()) {
      localStorage.removeItem(USER_KEY);
      emitAuthChanged();
    }
  },
  clearAll: () => {
    authStorage.clearAccessToken();
    authStorage.clearUser();
  },
};

export async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/api/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    authStorage.clearAccessToken();
    return null;
  }

  const payload = await res.json();
  const token = payload?.data?.accessToken as string | undefined;
  if (!token) {
    authStorage.clearAccessToken();
    return null;
  }

  authStorage.setAccessToken(token);
  return token;
}

export async function apiFetch<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipAuth = false, retryOnAuthError = true, headers, ...rest } = options;

  const requestHeaders = new Headers(headers || {});
  if (!requestHeaders.has('Content-Type') && !(rest.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = authStorage.getAccessToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const makeRequest = () =>
    fetch(`${API_BASE}${normalizedPath}`, {
      ...rest,
      headers: requestHeaders,
      credentials: 'include',
    });

  let res = await makeRequest();

  if (res.status === 401 && !skipAuth && retryOnAuthError) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      requestHeaders.set('Authorization', `Bearer ${newToken}`);
      res = await makeRequest();
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } finally {
    authStorage.clearAll();
  }
}
