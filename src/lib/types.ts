export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Patient {
  id: string;
  tokenNumber: number;
  name: string;
  age: number;
  symptomDescription: string;
  priority: Priority;
  registrationTime: string;
}

export interface PatientWithWaitTime extends Patient {
  estimatedWaitTime: number; // in minutes
}

export interface QueueStats {
  totalPatients: number;
  avgWaitTime: number;
  criticalCount: number;
  staffCount: number;
}
