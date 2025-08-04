"use client";
import { useEffect, useState } from "react";
import { DietRecord, HealthRecord, ExerciseRecord } from "../../types";
import { getAllRecords } from "../../lib/db";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dietMetrics = [
  // No numeric metrics in DietRecord after calories removal
];
const healthMetrics = [
  { key: "energy", label: "Energy Level" },
  { key: "mood", label: "Mood" },
  { key: "pain", label: "Pain" },
  { key: "sleep", label: "Sleep" },
  { key: "allergy", label: "Allergy" },
  { key: "pooCount", label: "Poo Count" },
  { key: "pooRating", label: "Poo Rating" },
];
const exerciseMetrics = [
  // { key: "reps", label: "Reps" },
  // { key: "timeMinutes", label: "Time (min)" },
];

const allMetrics = [
  ...healthMetrics.map(m => ({ ...m, type: "health" })),
  ...exerciseMetrics.map(m => ({ ...m, type: "exercise" })),
];

export default function AnalysisPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["energy"]);
  const [health, setHealth] = useState<HealthRecord[]>([]);
  const [exercise, setExercise] = useState<ExerciseRecord[]>([]);
  // Diet metrics omitted as there are no numeric fields

  useEffect(() => {
    getAllRecords<HealthRecord>("red-dragon-health", "health").then(setHealth);
    getAllRecords<ExerciseRecord>("red-dragon-health", "exercise").then(setExercise);
  }, []);

  // Merge all records by date for charting
  const chartData = (() => {
    // Only health and exercise metrics for now
    const healthData = health.map(r => ({
      date: new Date(r.timestamp).toLocaleDateString(),
      ...r,
    }));
    const exerciseData = exercise.map(r => ({
      date: new Date(r.timestamp).toLocaleDateString(),
      ...r,
    }));
    // Group by date
    const byDate: Record<string, any> = {};
    healthData.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = { date: r.date };
      healthMetrics.forEach(m => {
        if (typeof (r as any)[m.key] !== "undefined") (byDate[r.date] as any)[m.key] = (r as any)[m.key];
      });
    });
    exerciseData.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = { date: r.date };
      exerciseMetrics.forEach(m => {
        if (typeof (r as any)[m.key] !== "undefined") (byDate[r.date] as any)[m.key] = (r as any)[m.key];
      });
    });
    return Object.values(byDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  })();

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Analysis</h1>
      <div className="mb-4 max-w-md mx-auto">
        <label className="block text-sm font-medium mb-2">Select metrics to display:</label>
        <div className="flex flex-wrap gap-2">
          {allMetrics.map(m => (
            <label key={m.key} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={m.key}
                checked={selectedMetrics.includes(m.key)}
                onChange={e => {
                  setSelectedMetrics(sel =>
                    e.target.checked
                      ? [...sel, m.key]
                      : sel.filter(k => k !== m.key)
                  );
                }}
              />
              {m.label}
            </label>
          ))}
        </div>
      </div>
      <div className="bg-white rounded shadow p-4">
        {selectedMetrics.length === 0 ? (
          <p className="text-center text-gray-500">Select one or more metrics to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {selectedMetrics.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={["#2563eb", "#f59e42", "#10b981", "#ef4444", "#a21caf"][i % 5]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </main>
  );
}
