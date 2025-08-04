"use client";
import { useState } from "react";
import { ExerciseRecord } from "../types";

const defaultTypes = [
  { label: "Yoga 🧘‍♀️", value: "Yoga" },
  { label: "Walking 🚶‍♀️", value: "Walking" },
  { label: "Running 🏃‍♀️", value: "Running" },
  { label: "Cycling 🚴‍♀️", value: "Cycling" },
  { label: "Swimming 🏊‍♀️", value: "Swimming" },
  { label: "Dancing 💃", value: "Dancing" },
];

export default function ExerciseEntryForm({ onAdd }: { onAdd: (record: ExerciseRecord) => void }) {
  const [types, setTypes] = useState<{label: string, value: string}[]>([...defaultTypes]);
  const [type, setType] = useState(types[0].value);
  const [newType, setNewType] = useState("");
  const [reps, setReps] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");
  const [notes, setNotes] = useState("");

  function handleAddType(e: React.FormEvent) {
    e.preventDefault();
    if (newType.trim() && !types.some(t => t.value.toLowerCase() === newType.trim().toLowerCase())) {
      setTypes([...types, { label: `${newType.trim()} 🏋️`, value: newType.trim() }]);
      setType(newType.trim());
      setNewType("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type || !reps || !timeMinutes) return;
    const record: ExerciseRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type,
      reps: Number(reps),
      timeMinutes: Number(timeMinutes),
      notes: notes.trim() || undefined,
    };
    onAdd(record);
    setType(types[0].value);
    setReps("");
    setTimeMinutes("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Exercise Type</label>
        <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded px-3 py-2">
          {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <div className="flex gap-2 mt-2">
          <input value={newType} onChange={e => setNewType(e.target.value)} placeholder="Add new type" className="flex-1 border rounded px-3 py-2" />
          <button type="button" onClick={handleAddType} className="bg-green-600 text-white px-3 py-2 rounded font-semibold hover:bg-green-700 transition">Add</button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Reps</label>
        <input type="number" min={0} value={reps} onChange={e => setReps(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time Spent (minutes)</label>
        <input type="number" min={0} value={timeMinutes} onChange={e => setTimeMinutes(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Add Entry</button>
    </form>
  );
}
