import { neon } from "@neondatabase/serverless";

console.log(`[DB] Evaluating module - Running on: ${typeof window === 'undefined' ? 'Server' : 'Client'}`);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  console.warn('[DB] Warning: DATABASE_URL is missing in production. Build may fail if static page generation requires DB access.');
}

export const sql = databaseUrl ? neon(databaseUrl) : null;

export async function executeQuery<T>(
  query: string,
  params: any[] = [],
): Promise<T[]> {
  console.log(`[DB] Executing query: ${query}`);
  if (!sql) {
    console.error("[DB] Error: SQL client not initialized. DATABASE_URL might be missing.");
    return [] as T[];
  }
  
  try {
    const result = await (sql as any).query(query, params);
    return result as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
