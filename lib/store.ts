import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkoutState {
  activeWorkoutId: number | null;
  currentExerciseId: number | null;
  completedSets: Set<string>;
  
  setActiveWorkout: (workoutId: number) => void;
  clearActiveWorkout: () => void;
  markSetComplete: (workoutId: number, exerciseId: number, setNumber: number) => void;
  isSetComplete: (workoutId: number, exerciseId: number, setNumber: number) => boolean;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeWorkoutId: null,
      currentExerciseId: null,
      completedSets: new Set(),

      setActiveWorkout: (workoutId) => set({ activeWorkoutId: workoutId }),
      clearActiveWorkout: () => set({ activeWorkoutId: null, currentExerciseId: null }),

      markSetComplete: (workoutId, exerciseId, setNumber) => {
        const key = `${workoutId}:${exerciseId}:${setNumber}`;
        set((state) => ({
          completedSets: new Set([...state.completedSets, key]),
        }));
      },

      isSetComplete: (workoutId, exerciseId, setNumber) => {
        const key = `${workoutId}:${exerciseId}:${setNumber}`;
        return get().completedSets.has(key);
      },
    }),
    { name: 'workout-storage' }
  )
);
