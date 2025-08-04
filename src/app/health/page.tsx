"use client";
import { useEffect, useState } from "react";
import { HealthRecord } from "../../types";
import HealthEntryForm from "../../components/HealthEntryForm";
import { addHealthRecord, getAllHealthRecords } from "../../lib/apiRecords";
// import { addRecord as dbAdd, getAllRecords } from "../../lib/db";
import Link from "next/link";

export default function HealthPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllHealthRecords().then(setRecords);
  }, []);

  async function addRecord(record: HealthRecord) {
    const saved = await addHealthRecord(record);
    setRecords([saved, ...records]);
  }

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    return (
      (r.notes?.toLowerCase().includes(q) ?? false) ||
      (r.cycleDay?.toString().includes(q) ?? false) ||
      r.pooCount.toString().includes(q) ||
      r.pooRating.toString().includes(q) ||
      r.mood.toString().includes(q) ||
      r.pain.toString().includes(q) ||
      r.sleep.toString().includes(q) ||
      r.allergy.toString().includes(q) ||
      new Date(r.timestamp).toLocaleDateString().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Health Records</h1>
      <HealthEntryForm onAdd={addRecord} />
      <input
        type="text"
        placeholder="Search by date or any value..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md mx-auto block my-6 border rounded px-3 py-2"
      />
      <ul className="mt-2 space-y-2">
        {filtered.map(r => (
          <li key={r.id} className="bg-white rounded shadow p-3 flex flex-col">
            <span className="text-xs text-gray-500">{new Date(r.timestamp).toLocaleString()}</span>
            <ul className="mt-2 space-y-1">
              <li><strong>Energy Level:</strong> <span title="Energy">{["🥱","😪","😐","🙂","⚡️"][r.energy-1]}</span> ({r.energy})</li>
              <li><strong>Mood:</strong> <span title="Mood">{["😡","😢","😐","😊","🤩"][r.mood-1]}</span> ({r.mood})</li>
              <li><strong>Pain:</strong> <span title="Pain">{["😖","😕","😐","🙂","😃"][r.pain-1]}</span> ({r.pain})</li>
              <li><strong>Sleep:</strong> <span title="Sleep">{["😴","😫","😐","🙂","😃"][r.sleep-1]}</span> ({r.sleep})</li>
              <li><strong>Allergy:</strong> <span title="Allergy">{["🤧","😕","😐","🙂","😃"][r.allergy-1]}</span> ({r.allergy})</li>
              <li><strong>Poo Count:</strong> {r.pooCount}</li>
              <li><strong>Poo Rating:</strong> <span title="Poo Rating">{["💩","💩","💩","💩","💩"][r.pooRating-1]}</span> ({r.pooRating})</li>
              {r.cycleDay && <li><strong>Cycle Day:</strong> {r.cycleDay}</li>}
              {r.notes && <li><strong>Notes:</strong> {r.notes}</li>}
            </ul>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <Link href="/" className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-xl shadow text-center text-lg transition" style={{ color: '#fff' }}>Back to Home</Link>
      </div>
    </main>
  );
}
