import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  muscleGroup: text('muscle_group').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const exerciseTemplates = sqliteTable('exercise_templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  exerciseId: integer('exercise_id').references(() => exercises.id).notNull(),
  name: text('name').notNull(),
  defaultSets: integer('default_sets'),
  defaultReps: text('default_reps'),
  defaultWeight: integer('default_weight'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const workoutTemplates = sqliteTable('workout_templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const workoutTemplateExercises = sqliteTable('workout_template_exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  templateId: integer('template_id').references(() => workoutTemplates.id).notNull(),
  exerciseTemplateId: integer('exercise_template_id').references(() => exerciseTemplates.id).notNull(),
  orderIndex: integer('order_index').notNull(),
  targetSets: integer('target_sets'),
  targetReps: text('target_reps'),
  notes: text('notes'),
});

export const workouts = sqliteTable('workouts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  startedAt: integer('started_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  notes: text('notes'),
});

export const workoutSets = sqliteTable('workout_sets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workoutId: integer('workout_id').references(() => workouts.id).notNull(),
  exerciseTemplateId: integer('exercise_template_id').references(() => exerciseTemplates.id).notNull(),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps'),
  weight: integer('weight'),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
  rpe: integer('rpe'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
