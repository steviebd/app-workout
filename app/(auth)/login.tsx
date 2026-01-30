import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/auth/hooks';
import { handleLogin } from '@/lib/auth/redirect';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const { isAuthenticated } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Tracker</Text>
      <Text style={styles.subtitle}>Sign in to sync your workouts</Text>

      <Pressable
        onPress={handleLogin}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign in with WorkOS</Text>
      </Pressable>

      <Link href="/" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    width: '100%',
    maxWidth: 320,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  secondaryButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
});
