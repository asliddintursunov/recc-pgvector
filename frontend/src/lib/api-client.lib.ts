import localstorage from './local-storage.lib';
import { BASE_URL } from '../constants/base-url.endpoint';
export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(status: number, data: unknown) {
    super(`Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
  skipAuthRetry?: boolean;
};


function buildHeaders(token: string | null, extra?: HeadersInit): Record<string, string> {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!extra) {
    return baseHeaders;
  }

  const extraHeaders = new Headers(extra);
  extraHeaders.forEach((value, key) => {
    baseHeaders[key] = value;
  });

  return baseHeaders;
}

async function executeRequest<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, credentials: 'include' });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(response.status, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function buildUrl(endpoint: string, params?: RequestOptions['params']): string {
  const baseUrl = BASE_URL || window.location.origin;
  const url = new URL(endpoint, baseUrl);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, params, method = 'GET', skipAuth = false, skipAuthRetry = false, ...rest } = options;
  const token = skipAuth ? null : localstorage.get('authToken');
  const requestUrl = buildUrl(url, params);

  const init: RequestInit = {
    method,
    headers: buildHeaders(token, headers),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...rest,
  };

  try {
    return await executeRequest<T>(requestUrl, init);
  } catch (error) {
    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, body, method: 'POST' }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, body, method: 'PUT' }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, body, method: 'PATCH' }),

  delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export function getError(error: unknown, value: 'error' | 'message' | 'statusCode'): string {
  if (error instanceof ApiError) {
    const data = error.data as { message?: string; type?: string; statusCode?: number } | null;

    if (value === 'statusCode') {
      return String(data?.statusCode);
    }

    if (value === 'error') {
      return data?.type || 'error';
    }

    return data?.message || 'Something went wrong. Please try again later.';
  }

  if (value === 'statusCode') {
    return '500';
  }

  if (value === 'error') {
    return 'error';
  }

  return 'Unable to connect. Please check your internet connection.';
}
