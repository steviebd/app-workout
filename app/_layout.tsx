import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { handleCallback } from '@/lib/auth/redirect';

export default function RootLayout() {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      if (event.url.includes('auth/callback')) {
        handleCallback(event.url);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url?.includes('auth/callback')) {
        handleCallback(url);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
