import { useAuthRedirect } from '@/lib/auth/redirect';

export default function AppLayout() {
  useAuthRedirect();
  
  return null;
}
