export function promptGoogleLogin({ onStart, onSuccess, onError, roleName = null } = {}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    onError?.('Google Client ID is not configured. Please check VITE_GOOGLE_CLIENT_ID in .env.');
    return;
  }

  if (!window.google?.accounts?.oauth2) {
    onError?.('Google Sign-In service is loading. Please check your internet connection or try again in a few seconds.');
    return;
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile openid',
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          onError?.(tokenResponse.error_description || tokenResponse.error || 'Google sign-in was cancelled.');
          return;
        }
        if (tokenResponse.access_token) {
          onSuccess?.({ accessToken: tokenResponse.access_token, roleName });
        }
      },
      error_callback: (err) => {
        onError?.(err?.message || 'Google Sign-In popup was closed.');
      },
    });

    onStart?.();
    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (err) {
    onError?.(err?.message || 'Failed to open Google Sign-In popup.');
  }
}
