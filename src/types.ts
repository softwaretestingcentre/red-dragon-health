export type DietRecord = {
  id: string;
  timestamp: string; // ISO string
  food: string;
  notes?: string;
};

export type HealthRecord = {
  id: string;
  timestamp: string;
  energy: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5; // 1=upset, 2=sad, 3=neutral, 4=happy, 5=overjoyed
  pain: 1 | 2 | 3 | 4 | 5;
  sleep: 1 | 2 | 3 | 4 | 5;
  allergy: 1 | 2 | 3 | 4 | 5;
  pooCount: number;
  pooRating: 1 | 2 | 3 | 4 | 5;
  cycleDay?: number;
  notes?: string;
};

export type ExerciseRecord = {
  id: string;
  timestamp: string;
  type: string;
  reps: number;
  timeMinutes: number;
  notes?: string;
};
