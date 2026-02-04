import { neon } from "@neondatabase/serverless";

console.log(`[DB] Evaluating module - Running on: ${typeof window === 'undefined' ? 'Server' : 'Client'}`);

if (!process.env.DATABASE_URL) {
  console.error('[DB] Error: DATABASE_URL is missing!');
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export const sql = neon(process.env.DATABASE_URL);

export async function executeQuery<T>(
  query: string,
  params: any[] = [],
): Promise<T[]> {
  console.log(`[DB] Executing query: ${query}`);
  try {
    const result = await (sql as any).query(query, params);
    return result as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
