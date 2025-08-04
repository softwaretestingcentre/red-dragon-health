import { DietRecord, HealthRecord, ExerciseRecord } from "../types";
import { getAllRecords } from "./db";

function ensureStores(): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("red-dragon-health", 2);
    req.onupgradeneeded = () => {
      const db = req.result;
      try {
        if (!db.objectStoreNames.contains("health")) db.createObjectStore("health", { keyPath: "id" });
      } catch {}
      try {
        if (!db.objectStoreNames.contains("diet")) db.createObjectStore("diet", { keyPath: "id" });
      } catch {}
      try {
        if (!db.objectStoreNames.contains("exercise")) db.createObjectStore("exercise", { keyPath: "id" });
      } catch {}
    };
    req.onsuccess = () => { req.result.close(); resolve(); };
    req.onerror = () => reject(req.error);
  });
}

export async function searchAllRecords(query: string) {
  await ensureStores();
  const [health, diet, exercise] = await Promise.all([
    getAllRecords<HealthRecord>("red-dragon-health", "health"),
    getAllRecords<DietRecord>("red-dragon-health", "diet"),
    getAllRecords<ExerciseRecord>("red-dragon-health", "exercise"),
  ]);
  const q = query.toLowerCase();
  return [
    ...health.filter(r =>
      (r.notes?.toLowerCase().includes(q) ?? false) ||
      (r.cycleDay?.toString().includes(q) ?? false) ||
      r.pooCount.toString().includes(q) ||
      r.pooRating.toString().includes(q) ||
      r.mood.toString().includes(q) ||
      r.pain.toString().includes(q) ||
      r.sleep.toString().includes(q) ||
      r.allergy.toString().includes(q) ||
      new Date(r.timestamp).toLocaleDateString().includes(q)
    ).map(r => ({ ...r, _type: "health" })),
    ...diet.filter(r =>
      r.food.toLowerCase().includes(q) ||
      r.calories?.toString().includes(q) ||
      (r.notes?.toLowerCase().includes(q) ?? false) ||
      new Date(r.timestamp).toLocaleDateString().includes(q)
    ).map(r => ({ ...r, _type: "diet" })),
    ...exercise.filter(r =>
      r.type.toLowerCase().includes(q) ||
      r.reps.toString().includes(q) ||
      r.timeminutes.toString().includes(q) ||
      (r.notes?.toLowerCase().includes(q) ?? false) ||
      new Date(r.timestamp).toLocaleDateString().includes(q)
    ).map(r => ({ ...r, _type: "exercise" })),
  ];
}
