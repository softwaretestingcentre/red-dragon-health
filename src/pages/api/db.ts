// Neon PostgreSQL connection utility for Next.js API routes
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.NETLIFY_DATABASE_URL!;
export const sql = neon(connectionString);
