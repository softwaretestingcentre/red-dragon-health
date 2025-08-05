"use client";
import { useState } from "react";
import { HealthRecord } from "../types";

const moodEmojis = ["😡", "😢", "😐", "😊", "🤩"];
const ratingEmojis = ["😖", "😕", "😐", "🙂", "😃"];
const sleepEmojis = ["😴", "😫", "😐", "🙂", "😃"];
const allergyEmojis = ["🤧", "😕", "😐", "🙂", "😃"];
const pooEmojis = ["💩", "💩", "💩", "💩", "💩"];
const energyEmojis = ["🥱", "😪", "😐", "🙂", "⚡️"];

// Polyfill for crypto.randomUUID if not available
function getUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: simple random string (not RFC compliant)
  return 'id-' + Math.random().toString(36).substr(2, 16);
}

export default function HealthEntryForm({ onAdd }: { onAdd: (record: HealthRecord) => void }) {
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(3);
  const [pain, setPain] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [allergy, setAllergy] = useState(3);
  const [pooCount, setPooCount] = useState(0);
  const [pooRating, setPooRating] = useState(3);
  const [cycleDay, setCycleDay] = useState<number|undefined>(undefined);
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const record: HealthRecord = {
      id: getUUID(),
      timestamp: new Date().toISOString(),
      energy: energy as 1|2|3|4|5,
      mood: mood as 1|2|3|4|5,
      pain: pain as 1|2|3|4|5,
      sleep: sleep as 1|2|3|4|5,
      allergy: allergy as 1|2|3|4|5,
      pooCount: Number(pooCount),
      pooRating: pooRating as 1|2|3|4|5,
      cycleDay,
      notes: notes.trim() || undefined,
    };
    onAdd(record);
    setEnergy(3); setMood(3); setPain(3); setSleep(3); setAllergy(3); setPooCount(0); setPooRating(3); setCycleDay(undefined); setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Energy Level</label>
        <div className="flex gap-2">
          {energyEmojis.map((emoji, i) => (
            <button type="button" key={i} aria-label={`Energy ${i+1}`} onClick={() => setEnergy(i+1)} className={`text-2xl ${energy===i+1?'':'opacity-50'}`}>{emoji}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mood</label>
        <div className="flex gap-2">
          {moodEmojis.map((emoji, i) => (
            <button type="button" key={i} aria-label={`Mood ${i+1}`} onClick={() => setMood(i+1)} className={`text-2xl ${mood===i+1?'':'opacity-50'}`}>{emoji}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Pain</label>
        <div className="flex gap-2">
          {ratingEmojis.map((emoji, i) => (
            <button type="button" key={i} aria-label={`Pain ${i+1}`} onClick={() => setPain(i+1)} className={`text-2xl ${pain===i+1?'':'opacity-50'}`}>{emoji}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sleep</label>
        <div className="flex gap-2">
          {sleepEmojis.map((emoji, i) => (
            <button type="button" key={i} aria-label={`Sleep ${i+1}`} onClick={() => setSleep(i+1)} className={`text-2xl ${sleep===i+1?'':'opacity-50'}`}>{emoji}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Allergy</label>
        <div className="flex gap-2">
          {allergyEmojis.map((emoji, i) => (
            <button type="button" key={i} aria-label={`Allergy ${i+1}`} onClick={() => setAllergy(i+1)} className={`text-2xl ${allergy===i+1?'':'opacity-50'}`}>{emoji}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Poo Count</label>
        <input type="number" min={0} value={pooCount} onChange={e => setPooCount(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Poo Rating</label>
        <div className="flex gap-2">
          {pooEmojis.map((emoji, i) => (
            <button type="button" key={i} aria-label={`Poo Rating ${i+1}`} onClick={() => setPooRating(i+1)} className={`text-2xl ${pooRating===i+1?'':'opacity-50'}`}>{emoji}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Cycle Day</label>
        <select value={cycleDay ?? ""} onChange={e => setCycleDay(e.target.value ? Number(e.target.value) : undefined)} className="w-full border rounded px-3 py-2">
          <option value="">Select day</option>
          {[...Array(29)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Add Entry</button>
    </form>
  );
}
