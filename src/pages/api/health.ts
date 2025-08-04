import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from './db';

// CREATE TABLE IF NOT EXISTS health_records (
//   id TEXT PRIMARY KEY,
//   timestamp TEXT,
//   energy INTEGER,
//   mood INTEGER,
//   pain INTEGER,
//   sleep INTEGER,
//   allergy INTEGER,
//   pooCount INTEGER,
//   pooRating INTEGER,
//   cycleDay INTEGER,
//   notes TEXT
// );

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Add a new health record
    const {
      id, timestamp, energy, mood, pain, sleep, allergy, pooCount, pooRating, cycleDay, notes
    } = req.body;
    try {
      await sql`INSERT INTO health_records (id, timestamp, energy, mood, pain, sleep, allergy, pooCount, pooRating, cycleDay, notes)
        VALUES (${id}, ${timestamp}, ${energy}, ${mood}, ${pain}, ${sleep}, ${allergy}, ${pooCount}, ${pooRating}, ${cycleDay}, ${notes})`;
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add record', details: err });
    }
  } else if (req.method === 'GET') {
    // Get all health records
    try {
      const records = await sql`SELECT * FROM health_records ORDER BY timestamp DESC`;
      res.status(200).json(records);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch records', details: err });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
