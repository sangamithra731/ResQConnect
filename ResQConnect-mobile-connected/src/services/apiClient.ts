// Thin fetch wrapper for the RiskIntel command-center backend.
//
// Set VITE_API_URL in your .env (see .env.example) to the backend's base
// URL, e.g. http://localhost:5000 for local dev or your deployed Render
// URL such as https://riskintel.onrender.com in production.
//
// All requests use credentials: 'include' because the backend uses
// session-cookie auth for command-center accounts (see authService.ts).
// Public endpoints (/api/public/*) work the same way but don't require a
// session.

const API_BASE_URL: string = (import.meta as any).env?.VITE_API_URL || '';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError('VITE_API_URL is not configured', 0);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON or empty response body
  }

  if (!response.ok) {
    const message = body?.error || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined }),
  isConfigured: () => !!API_BASE_URL
};
