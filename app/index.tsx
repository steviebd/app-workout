import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useRecentWorkouts, useStartWorkout } from '@/lib/hooks';
import { useWorkoutStore } from '@/lib/store';
import { format } from 'date-fns';

export default function Home() {
  const { data: recentWorkouts } = useRecentWorkouts();
  const startWorkout = useStartWorkout();
  const { setActiveWorkout } = useWorkoutStore();

  const handleNewWorkout = async () => {
    const workout = await startWorkout.mutateAsync(`Workout ${format(new Date(), 'MMM d')}`);
    setActiveWorkout(workout.id);
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold mb-6">Workout Tracker</Text>
      
      <Pressable
        onPress={handleNewWorkout}
        className="bg-primary p-4 rounded-lg mb-6"
      >
        <Text className="text-white font-semibold text-center">Start New Workout</Text>
      </Pressable>

      <Text className="text-lg font-semibold mb-3">Recent Workouts</Text>
      
      {recentWorkouts?.length === 0 ? (
        <Text className="text-gray-500">No workouts yet. Start one above!</Text>
      ) : (
        <View className="space-y-2">
          {recentWorkouts?.map((workout) => (
            <Link
              key={workout.id}
              href={`/(app)/workouts/${workout.id}`}
              asChild
            >
              <Pressable className="bg-surface p-4 rounded-lg">
                <Text className="font-medium">{workout.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {format(new Date(workout.startedAt), 'MMM d, yyyy')}
                  {workout.completedAt && ' • Completed'}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      )}

      <View className="mt-6 flex-row gap-3">
        <Link href="/(app)/templates" asChild className="flex-1">
          <Pressable className="bg-secondary p-4 rounded-lg flex-1">
            <Text className="text-white font-semibold text-center">Templates</Text>
          </Pressable>
        </Link>
        <Link href="/(app)/profile" asChild className="flex-1">
          <Pressable className="bg-surface p-4 rounded-lg flex-1">
            <Text className="font-semibold text-center">Profile</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
