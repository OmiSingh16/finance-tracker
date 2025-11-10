import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { accounts } from '@/db/schema'

// Proper validation
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is required in environment variables')
}

const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client)

// Database operations ke liye function
export async function getAllUsers() {
  return await db.select().from(accounts)
}

// Usage
getAllUsers().then(users => {
  console.log('Users:', users)
})