import { useAuthStore } from '@/lib/auth/store';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const queryClient = useQueryClient();

  return {
    user,
    isAuthenticated,
    logout: () => {
      logout();
      queryClient.clear();
    },
  };
}

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    // In a real app, you'd redirect to login here
    // For now, this is just a hook to check auth state
  }
  
  return { isAuthenticated };
}
