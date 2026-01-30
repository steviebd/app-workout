// API types
interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  description: string | null;
  createdAt: string;
}

interface ExerciseTemplate {
  id: number;
  exerciseId: number;
  name: string;
  defaultSets: number | null;
  defaultReps: string | null;
  defaultWeight: number | null;
  createdAt: string;
}

interface WorkoutTemplate {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

interface Workout {
  id: number;
  name: string;
  startedAt: string;
  completedAt: string | null;
  notes: string | null;
  sets?: WorkoutSet[];
}

interface WorkoutSet {
  id: number;
  workoutId: number;
  exerciseTemplateId: number;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  isCompleted: boolean;
  rpe: number | null;
  notes: string | null;
  createdAt: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => fetchApi<Exercise[]>('/exercises'),
  });
}

export function useExerciseTemplates() {
  return useQuery({
    queryKey: ['exercise-templates'],
    queryFn: () => fetchApi<ExerciseTemplate[]>('/exercise-templates'),
  });
}

export function useWorkoutTemplates() {
  return useQuery({
    queryKey: ['workout-templates'],
    queryFn: () => fetchApi<WorkoutTemplate[]>('/templates'),
  });
}

export function useRecentWorkouts() {
  return useQuery({
    queryKey: ['workouts', 'recent'],
    queryFn: () => fetchApi<Workout[]>('/workouts'),
  });
}

export function useActiveWorkout(workoutId: number) {
  return useQuery({
    queryKey: ['workouts', workoutId],
    queryFn: () => fetchApi<Workout>(`/workouts/${workoutId}`),
    enabled: !!workoutId,
  });
}

export function useStartWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (name: string) => {
      return fetchApi<Workout>('/workouts', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useLogSet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      workoutId: number;
      exerciseTemplateId: number;
      setNumber: number;
      reps?: number;
      weight?: number;
      rpe?: number;
      notes?: string;
    }) => {
      return fetchApi<WorkoutSet>(`/workouts/${data.workoutId}/sets`, {
        method: 'POST',
        body: JSON.stringify({
          exerciseTemplateId: data.exerciseTemplateId,
          setNumber: data.setNumber,
          reps: data.reps,
          weight: data.weight,
          rpe: data.rpe,
          notes: data.notes,
        }),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workouts', variables.workoutId] });
    },
  });
}
