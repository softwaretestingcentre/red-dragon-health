import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from './db';

// CREATE TABLE IF NOT EXISTS exercise_records (
//   id TEXT PRIMARY KEY,
//   timestamp TEXT,
//   type TEXT,
//   reps INTEGER,
//   timeMinutes INTEGER,
//   notes TEXT
// );

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Add a new exercise record
    const { id, timestamp, type, reps, timeMinutes, notes } = req.body;
    try {
      await sql`INSERT INTO exercise_records (id, timestamp, type, reps, timeMinutes, notes)
        VALUES (${id}, ${timestamp}, ${type}, ${reps}, ${timeMinutes}, ${notes})`;
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add record', details: err });
    }
  } else if (req.method === 'GET') {
    // Get all exercise records
    try {
      const records = await sql`SELECT * FROM exercise_records ORDER BY timestamp DESC`;
      res.status(200).json(records);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch records', details: err });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
