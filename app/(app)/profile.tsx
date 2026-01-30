import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/lib/auth/hooks';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold mb-6">Profile</Text>
      
      {user && (
        <View className="bg-surface p-4 rounded-lg mb-6">
          <Text className="font-semibold">{user.firstName} {user.lastName}</Text>
          <Text className="text-gray-500">{user.email}</Text>
        </View>
      )}

      <Link href="/(app)/record" asChild>
        <Pressable className="bg-primary p-4 rounded-lg mb-4">
          <Text className="text-white font-semibold text-center">Record Workout Form</Text>
        </Pressable>
      </Link>

      <Pressable
        onPress={logout}
        className="bg-red-500 p-4 rounded-lg"
      >
        <Text className="text-white font-semibold text-center">Sign Out</Text>
      </Pressable>
    </View>
  );
}
