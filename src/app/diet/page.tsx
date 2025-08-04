"use client";
import { useEffect, useState } from "react";
import { DietRecord } from "../../types";
import DietEntryForm from "../../components/DietEntryForm";
import { addDietRecord, getAllDietRecords } from "../../lib/apiRecords";
// import { addRecord as dbAdd, getAllRecords } from "../../lib/db";
import Link from "next/link";

export default function DietPage() {
  const [records, setRecords] = useState<DietRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllDietRecords().then(setRecords);
  }, []);

  async function addRecord(record: DietRecord) {
    const saved = await addDietRecord(record);
    setRecords([saved, ...records]);
  }

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    return (
      r.food.toLowerCase().includes(q) ||
      (r.notes?.toLowerCase().includes(q) ?? false) ||
      new Date(r.timestamp).toLocaleDateString().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Red Dragon Health</h1>
      <DietEntryForm onAdd={addRecord} />
      <input
        type="text"
        placeholder="Search by date, food, or notes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md mx-auto block my-6 border rounded px-3 py-2"
      />
      <ul className="mt-2 space-y-2">
        {filtered.map(r => (
          <li key={r.id} className="bg-white rounded shadow p-3 flex flex-col">
            <span className="text-xs text-gray-500">{new Date(r.timestamp).toLocaleString()}</span>
            <span className="font-semibold">{r.food}</span>
            {r.notes && <span className="text-xs text-gray-600 mt-1">{r.notes}</span>}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <Link href="/" className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-xl shadow text-center text-lg transition" style={{ color: '#fff' }}>Back to Home</Link>
      </div>
    </main>
  );
}
