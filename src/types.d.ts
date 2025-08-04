export type DietRecord = {
  id: string;
  timestamp: string; // ISO string
  food: string;
  calories: number;
  notes?: string;
};
