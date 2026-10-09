import { authStorage } from './auth';

// Standard normalized API response helper
export async function apiRequest(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // In mock mode, this resolves mock responses directly
  // When VITE_USE_MOCKS is false, it uses fetch against VITE_API_BASE_URL
  const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

  if (!useMocks) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.message || 'API request failed',
          fieldErrors: errorData.errors || [],
        };
      }

      return await response.json();
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock fixtures', err);
    }
  }

  // Mock response fallback handled in feature api layers
  return null;
}
