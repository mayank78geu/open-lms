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
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';

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
      if (err?.status) {
        throw err;
      }
      throw {
        status: 0,
        message: 'Unable to connect to the backend. Make sure the Spring Boot server is running.',
        fieldErrors: [],
      };
    }
  }

  // Mock response fallback handled in feature api layers
  return null;
}
