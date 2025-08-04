import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from './db';

// CREATE TABLE IF NOT EXISTS diet_records (
//   id TEXT PRIMARY KEY,
//   timestamp TEXT,
//   food TEXT,
//   notes TEXT
// );

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Add a new diet record
    const { id, timestamp, food, notes } = req.body;
    try {
      await sql`INSERT INTO diet_records (id, timestamp, food, notes)
        VALUES (${id}, ${timestamp}, ${food}, ${notes})`;
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add record', details: err });
    }
  } else if (req.method === 'GET') {
    // Get all diet records
    try {
      const records = await sql`SELECT * FROM diet_records ORDER BY timestamp DESC`;
      res.status(200).json(records);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch records', details: err });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
