import { Pool, type PoolClient, type QueryResult } from '@neondatabase/serverless';

let neonPool: Pool | null = null;

function getNeonPool(): Pool {
  if (neonPool) {
    return neonPool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing env.DATABASE_URL for Neon provider');
  }

  neonPool = new Pool({ connectionString });
  return neonPool;
}

export async function runNeonQuery<T = unknown>(text: string, values: unknown[] = []): Promise<QueryResult<T>> {
  const pool = getNeonPool();
  const client: PoolClient = await pool.connect();

  try {
    return await client.query<T>(text, values);
  } finally {
    client.release();
  }
}
