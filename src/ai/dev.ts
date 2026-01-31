import { config } from 'dotenv';
config();

import '@/ai/flows/offline-symptom-fallback.ts';
import '@/ai/flows/semantic-triage.ts';
import '@/ai/flows/realtime-queue-alerts.ts';