import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Local development or mobile (uses file-based SQLite)
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./local.db',
});

// For Cloudflare D1 (worker environment uses globalThis.DB)
export const db = (globalThis.DB as any) || client;

export { schema };

