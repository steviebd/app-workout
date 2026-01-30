import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);

// WorkOS config
const WORKOS_CLIENT_ID = process.env.EXPO_PUBLIC_WORKOS_CLIENT_ID || '';
const WORKOS_REDIRECT_URI = process.env.EXPO_PUBLIC_WORKOS_REDIRECT_URI || 'workout-tracker://auth/callback';
const WORKOS_API_URL = 'https://api.workos.com';

export async function getAuthorizationUrl(): Promise<string> {
  const params = new URLSearchParams({
    client_id: WORKOS_CLIENT_ID,
    redirect_uri: WORKOS_REDIRECT_URI,
    response_type: 'code',
    state: generateState(),
  });

  return `${WORKOS_API_URL}/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string;
  user: User;
}> {
  const response = await fetch(`${WORKOS_API_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: WORKOS_CLIENT_ID,
      client_secret: process.env.WORKOS_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();
  
  // Fetch user profile
  const userResponse = await fetch(`${WORKOS_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  const userData = await userResponse.json();

  return {
    accessToken: data.access_token,
    user: {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
    },
  };
}

function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
