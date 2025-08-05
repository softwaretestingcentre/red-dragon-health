/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { DietRecord, HealthRecord, ExerciseRecord } from "../../types";
import { getAllHealthRecords, getAllDietRecords, getAllExerciseRecords } from "../../lib/apiRecords";
// import { getAllRecords } from "../../lib/db";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const healthMetrics = [
  { key: "energy", label: "Energy Level" },
  { key: "mood", label: "Mood" },
  { key: "pain", label: "Pain" },
  { key: "sleep", label: "Sleep" },
  { key: "allergy", label: "Allergy" },
];

const allMetrics = [
  ...healthMetrics.map(m => ({ ...m, type: "health" })),
];

export default function AnalysisPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(healthMetrics.map(m => m.key));
  const [health, setHealth] = useState<HealthRecord[]>([]);
  const [exercise, setExercise] = useState<ExerciseRecord[]>([]);
  // Diet metrics omitted as there are no numeric fields

  useEffect(() => {
    getAllHealthRecords().then(setHealth);
    getAllExerciseRecords().then(setExercise);
  }, []);

  // Merge all records by date for charting
  const chartData = (() => {
    // Use ISO date string for sorting and grouping
    const toISO = (ts: string | number | Date) => {
      const d = new Date(ts);
      return d.toISOString().slice(0, 10); // YYYY-MM-DD
    };
    const healthData = health.map(r => ({
      isoDate: toISO(r.timestamp),
      ...r,
    }));
    const exerciseData = exercise.map(r => ({
      isoDate: toISO(r.timestamp),
      ...r,
    }));
    // Group by isoDate
    const byDate: Record<string, any> = {};
    healthData.forEach(r => {
      if (!byDate[r.isoDate]) byDate[r.isoDate] = { isoDate: r.isoDate };
      healthMetrics.forEach(m => {
        if (typeof (r as any)[m.key] !== "undefined") (byDate[r.isoDate] as any)[m.key] = (r as any)[m.key];
      });
      if (typeof r.cycleDay !== "undefined") byDate[r.isoDate].cycleDay = r.cycleDay;
    });
    exerciseData.forEach(r => {
      if (!byDate[r.isoDate]) byDate[r.isoDate] = { isoDate: r.isoDate };
      if (r.type) {
        if (!byDate[r.isoDate].exerciseTypes) byDate[r.isoDate].exerciseTypes = [];
        if (!byDate[r.isoDate].exerciseTypes.includes(r.type)) byDate[r.isoDate].exerciseTypes.push(r.type);
      }
    });
    // Sort by isoDate ascending
    return Object.values(byDate).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  })();

  // Fetch diet records and add food per day
  const [diet, setDiet] = useState<DietRecord[]>([]);
  useEffect(() => {
    getAllDietRecords().then(setDiet);
  }, []);
  // Instead of mutating chartData, create a new array with food added
  const chartDataWithFood = chartData.map((d: any) => {
    const isoDate = d.isoDate;
    const food = diet
      .filter(r => {
        const rIso = new Date(r.timestamp).toISOString().slice(0, 10);
        return rIso === isoDate;
      })
      .map(r => r.food)
      .join(", ") || undefined;
    // For display, add a formatted date string (e.g. locale)
    const displayDate = new Date(isoDate).toLocaleDateString();
    return { ...d, food, date: displayDate };
  });

  // State for selected date info
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Find info for selected date
  const selectedInfo = selectedDate
    ? chartDataWithFood.find((d: any) => d.date === selectedDate)
    : null;

  // Custom handler for X axis click
  function handleXAxisClick(e: any) {
    if (e && e.activeLabel) setSelectedDate(e.activeLabel);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Red Dragon Health</h1>
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
          <>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartDataWithFood} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                onClick={handleXAxisClick}
              >
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} domain={[0, 5]} />
                <Tooltip content={undefined} />
                <Legend />
                {selectedMetrics.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={{"sleep": "#2563eb", "energy": "#f59e42", "allergy": "#10b981", "pain": "#ef4444", "mood": "#a21caf"}[key]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm">
              {selectedDate && selectedInfo ? (
                <div className="inline-block bg-gray-100 rounded p-3 shadow">
                  <div className="font-semibold mb-1">{selectedDate}</div>
                  {typeof selectedInfo.cycleDay !== "undefined" && (
                    <div><strong>Cycle Day:</strong> {selectedInfo.cycleDay}</div>
                  )}
                  {selectedInfo.food && (
                    <div><strong>Food:</strong> {selectedInfo.food}</div>
                  )}
                  {selectedInfo.exerciseTypes && selectedInfo.exerciseTypes.length > 0 && (
                    <div><strong>Exercise:</strong> {selectedInfo.exerciseTypes.join(", ")}</div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">Click a date on the chart to view details.</div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/" className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-xl shadow text-center text-lg transition" style={{ color: '#fff' }}>Back to Home</Link>
      </div>
    </main>
  );
}
