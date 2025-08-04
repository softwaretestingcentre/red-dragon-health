"use client";
import { useEffect, useState } from "react";
import { ExerciseRecord } from "../../types";
import ExerciseEntryForm from "../../components/ExerciseEntryForm";
import { addRecord as dbAdd, getAllRecords } from "../../lib/db";
import Link from "next/link";

export default function ExercisePage() {
  const [records, setRecords] = useState<ExerciseRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllRecords<ExerciseRecord>("red-dragon-health", "exercise").then(setRecords);
  }, []);

  async function addRecord(record: ExerciseRecord) {
    await dbAdd("red-dragon-health", "exercise", record);
    setRecords([record, ...records]);
  }

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    return (
      r.type.toLowerCase().includes(q) ||
      r.reps.toString().includes(q) ||
      r.timeMinutes.toString().includes(q) ||
      (r.notes?.toLowerCase().includes(q) ?? false) ||
      new Date(r.timestamp).toLocaleDateString().includes(q)
    );
  });

  return (
    <>
      <main className="min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Exercise Records</h1>
        <ExerciseEntryForm onAdd={addRecord} />
        <input
          type="text"
          placeholder="Search by date, type, reps, time, or notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md mx-auto block my-6 border rounded px-3 py-2"
        />
        <ul className="mt-2 space-y-2">
          {filtered.map(r => (
            <li key={r.id} className="bg-white rounded shadow p-3 flex flex-col">
              <span className="text-xs text-gray-500">{new Date(r.timestamp).toLocaleString()}</span>
              <span className="font-semibold">{r.type}</span>
              <span className="text-sm">{r.reps} reps, {r.timeMinutes} min</span>
              {r.notes && <span className="text-xs text-gray-600 mt-1">{r.notes}</span>}
            </li>
          ))}
        </ul>
      </main>
      <div className="mt-8 flex justify-center">
        <Link href="/" className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-xl shadow text-center text-lg transition" style={{ color: '#fff' }}>Back to Home</Link>
      </div>
    </>
  );
}
