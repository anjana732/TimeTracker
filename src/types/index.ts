export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'intern';
}

export interface TimeEntry {
  id: string;
  userId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration: number; // in minutes
  manualEntry: boolean;
  notes?: string;
}