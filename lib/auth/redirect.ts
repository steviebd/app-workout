import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { useAuthStore } from '@/lib/auth/store';
import { exchangeCodeForToken, getAuthorizationUrl } from '@/lib/auth/store';

export function useAuthRedirect() {
  const segments = useSegments();
  const { setUser, setAccessToken, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!isAuthenticated && inAppGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [segments, isAuthenticated]);
}

export async function handleLogin() {
  const authUrl = await getAuthorizationUrl();
  
  // Open in browser - user will be redirected back to app via deep link
  // Use Linking from react-native to open URL
  const { Linking } = require('react-native');
  await Linking.openURL(authUrl);
}

export async function handleCallback(url: string) {
  const { searchParams } = new URL(url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    throw new Error(error);
  }

  if (!code) {
    throw new Error('No authorization code found');
  }

  const { accessToken, user } = await exchangeCodeForToken(code);
  
  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setAccessToken(accessToken);
  
  router.replace('/');
}
