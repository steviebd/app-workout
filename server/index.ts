import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, desc } from 'drizzle-orm';
import * as schema from '../lib/schema';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

// Exercises
app.get('/exercises', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const exercises = await db.select().from(schema.exercises).all();
  return c.json(exercises);
});

app.post('/exercises', async (c) => {
  const { name, muscleGroup, description } = await c.req.json();
  const db = drizzle(c.env.DB, { schema });
  const result = await db.insert(schema.exercises).values({ name, muscleGroup, description }).returning().get();
  return c.json(result);
});

// Workouts
app.get('/workouts', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const workouts = await db
    .select()
    .from(schema.workouts)
    .orderBy(desc(schema.workouts.startedAt))
    .limit(20)
    .all();
  return c.json(workouts);
});

app.post('/workouts', async (c) => {
  const { name } = await c.req.json();
  const db = drizzle(c.env.DB, { schema });
  const result = await db.insert(schema.workouts).values({ name }).returning().get();
  return c.json(result);
});

app.get('/workouts/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const db = drizzle(c.env.DB, { schema });
  
  const workout = await db.select().from(schema.workouts).where(eq(schema.workouts.id, id)).get();
  if (!workout) return c.notFound();
  
  const sets = await db
    .select()
    .from(schema.workoutSets)
    .where(eq(schema.workoutSets.workoutId, id))
    .all();
  
  return c.json({ ...workout, sets });
});

// Workout Sets
app.post('/workouts/:id/sets', async (c) => {
  const workoutId = parseInt(c.req.param('id'));
  const { exerciseTemplateId, setNumber, reps, weight, rpe, notes } = await c.req.json();
  const db = drizzle(c.env.DB, { schema });
  
  const result = await db.insert(schema.workoutSets).values({
    workoutId,
    exerciseTemplateId,
    setNumber,
    reps,
    weight,
    rpe,
    notes,
    isCompleted: true,
  }).returning().get();
  
  return c.json(result);
});

// Templates
app.get('/templates', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const templates = await db.select().from(schema.workoutTemplates).all();
  return c.json(templates);
});

app.post('/templates', async (c) => {
  const { name, description } = await c.req.json();
  const db = drizzle(c.env.DB, { schema });
  const result = await db.insert(schema.workoutTemplates).values({ name, description }).returning().get();
  return c.json(result);
});

export default app;
