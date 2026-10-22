import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function SsoCallbackPage() {
  const navigate = useNavigate();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      if (!isAuthLoaded || !isUserLoaded || !isSignedIn || !user) {
        return;
      }

      const token = await getToken();
      if (!token) {
        throw new Error('The Clerk session token could not be loaded.');
      }
      if (cancelled) {
        return;
      }

      const currentUser = await useAuthStore.getState().loginWithClerk({ token, user });
      if (cancelled) {
        return;
      }

      navigate(
        currentUser.role === 'FACULTY' ? '/professor/overview' : '/student/home',
        { replace: true }
      );
    }

    completeSignIn().catch((err) => {
      if (!cancelled) {
        setError(err.message || 'Unable to complete Google sign-in.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [getToken, isAuthLoaded, isSignedIn, isUserLoaded, navigate, user]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 text-sm text-ink-muted">
      Completing Google sign-in...
    </main>
  );
}
