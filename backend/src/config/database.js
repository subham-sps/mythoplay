const { Pool } = require('pg');
require('dotenv').config();

// Only use SSL if explicitly enabled (for cloud databases like Heroku, Railway, Neon, Supabase, etc.)
const useSSL = process.env.DATABASE_SSL === 'true';

// On Vercel (serverless) each function invocation may spawn its own
// process. Keep the pool small so we don't exhaust the Postgres connection
// limit on free tiers (Neon/Supabase). A long-running process (local, Railway)
// can use a bigger pool to serve many concurrent requests from one instance.
const isServerless = !!process.env.VERCEL;
const poolMax = Number(process.env.PG_POOL_MAX) || (isServerless ? 1 : 20);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max: poolMax,
  idleTimeoutMillis: isServerless ? 10000 : 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // In a long-running server we exit so the orchestrator restarts us.
  // In serverless, the function process is short-lived — just log.
  console.error('Unexpected error on idle client', err);
  if (!isServerless) {
    process.exit(-1);
  }
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
    }
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const getClient = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = {
  query,
  getClient,
  pool,
};

