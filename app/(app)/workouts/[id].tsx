import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useActiveWorkout, useLogSet } from '@/lib/hooks';
import { useWorkoutStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const workoutId = parseInt(id as string);
  
  const { data: workout, isLoading } = useActiveWorkout(workoutId);
  const logSet = useLogSet();
  const { isSetComplete, markSetComplete } = useWorkoutStore();
  
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [rpe, setRpe] = useState('');

  if (isLoading || !workout) {
    return (
      <View className="flex-1 bg-background p-4">
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleCompleteSet = async (exerciseId: number, setNumber: number) => {
    await logSet.mutateAsync({
      workoutId,
      exerciseTemplateId: exerciseId,
      setNumber,
      reps: parseInt(reps) || undefined,
      weight: parseInt(weight) || undefined,
      rpe: parseInt(rpe) || undefined,
    });
    markSetComplete(workoutId, exerciseId, setNumber);
    setReps('');
    setWeight('');
    setRpe('');
  };

  // Group sets by exercise
  const setsByExercise = workout.sets.reduce((acc, set) => {
    if (!acc[set.exerciseTemplateId]) {
      acc[set.exerciseTemplateId] = [];
    }
    acc[set.exerciseTemplateId].push(set);
    return acc;
  }, {} as Record<number, typeof workout.sets>);

  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">{workout.name}</Text>
        <Text className="text-gray-500">
          {format(new Date(workout.startedAt), 'HH:mm')}
        </Text>
      </View>

      {Object.entries(setsByExercise).map(([exerciseId, sets]) => (
        <View key={exerciseId} className="bg-surface p-4 rounded-lg mb-4">
          <Text className="font-semibold mb-2">Exercise {exerciseId}</Text>
          
          {sets.map((set, index) => {
            const completed = isSetComplete(workoutId, parseInt(exerciseId), set.setNumber);
            
            return (
              <View key={set.id} className="flex-row items-center gap-2 mb-2">
                <Text className="w-8">Set {set.setNumber}</Text>
                <TextInput
                  className="border p-2 rounded w-16"
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={reps}
                  onChangeText={setReps}
                />
                <TextInput
                  className="border p-2 rounded w-16"
                  placeholder="kg"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
                <TextInput
                  className="border p-2 rounded w-12"
                  placeholder="RPE"
                  keyboardType="numeric"
                  value={rpe}
                  onChangeText={setRpe}
                />
                <Pressable
                  onPress={() => handleCompleteSet(parseInt(exerciseId), set.setNumber)}
                  className={`px-4 py-2 rounded ${completed ? 'bg-green-500' : 'bg-primary'}`}
                >
                  <Text className="text-white">{completed ? '✓' : 'Done'}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}

      <Pressable
        onPress={() => router.back()}
        className="bg-red-500 p-4 rounded-lg mt-4"
      >
        <Text className="text-white font-semibold text-center">End Workout</Text>
      </Pressable>
    </View>
  );
}
