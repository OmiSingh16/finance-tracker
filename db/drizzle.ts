// lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

// Proper validation with better connection settings
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required in environment variables');
}

// ✅ Better connection configuration for Supabase
const client = postgres(connectionString, {
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 10,
  max_lifetime: 60 * 30, // 30 minutes
});

export const db = drizzle(client, { schema });

// Test connection function
export const testConnection = async () => {
  try {
    const result = await client`SELECT version()`;
    
    return true;
  } catch (error) {
    return false;
  }
};