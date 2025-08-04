// API-based CRUD utilities for health, diet, and exercise records
import { HealthRecord, DietRecord, ExerciseRecord } from "../types";

export async function addHealthRecord(record: HealthRecord) {
  const res = await fetch("/api/health", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error("Failed to add health record");
  return res.json();
}

export async function getAllHealthRecords(): Promise<HealthRecord[]> {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error("Failed to fetch health records");
  return res.json();
}

export async function addDietRecord(record: DietRecord) {
  const res = await fetch("/api/diet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error("Failed to add diet record");
  return res.json();
}

export async function getAllDietRecords(): Promise<DietRecord[]> {
  const res = await fetch("/api/diet");
  if (!res.ok) throw new Error("Failed to fetch diet records");
  return res.json();
}

export async function addExerciseRecord(record: ExerciseRecord) {
  const res = await fetch("/api/exercise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error("Failed to add exercise record");
  return res.json();
}

export async function getAllExerciseRecords(): Promise<ExerciseRecord[]> {
  const res = await fetch("/api/exercise");
  if (!res.ok) throw new Error("Failed to fetch exercise records");
  return res.json();
}
