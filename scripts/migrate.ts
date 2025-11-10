
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function main() {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await client.end();
}

main().catch(console.error);