// app/api/[[...route]]/route.ts
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import accounts from './accounts';
import categories from './categories';
import transactions from './transactions';
import summary from './summary';

// ✅ Add better error handling at app level
const app = new Hono().basePath('/api');

// Global error handling
app.onError((err, c) => {
  
  if (err.message.includes('ECONNRESET') || err.message.includes('database')) {
    return c.json({ error: 'Database connection issue' }, 503);
  }
  
  return c.json({ error: 'Internal server error' }, 500);
});

// Global timeout middleware
app.use('*', async (c, next) => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), 10000)
  );
  
  try {
    await Promise.race([next(), timeoutPromise]);
  } catch (error) {
    return c.json({ error: 'Request timeout' }, 408);
  }
});

const routes = app
  .route('/accounts', accounts)
  .route('/categories', categories)
  .route('/transactions', transactions)
  .route('/summary', summary);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;