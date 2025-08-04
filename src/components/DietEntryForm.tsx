"use client";
import { useState } from "react";
import { DietRecord } from "../types";

export default function DietEntryForm({ onAdd }: { onAdd: (record: DietRecord) => void }) {
  const [food, setFood] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!food) return;
    const record: DietRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      food,
      notes: notes.trim() || undefined,
    };
    onAdd(record);
    setFood("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Food</label>
        <input value={food} onChange={e => setFood(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Add Entry</button>
    </form>
  );
}
