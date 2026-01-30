import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'd1',
  dbCredentials: {
    wranglerConfigPath: './wrangler.toml',
    dbName: process.env.D1_DATABASE_NAME || 'workout-tracker',
  },
});
