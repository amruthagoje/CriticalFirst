// src/ai/flows/realtime-queue-alerts.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for monitoring the patient queue in real-time and triggering alerts if critical patients have been waiting too long.
 *
 * - monitorQueueAndAlert - A function that monitors the queue and triggers alerts.
 * - MonitorQueueAndAlertInput - The input type for the monitorQueueAndAlert function.
 * - MonitorQueueAndAlertOutput - The return type for the monitorQueueAndAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MonitorQueueAndAlertInputSchema = z.object({
  criticalPatientWaitTimeThreshold: z
    .number()
    .describe(
      'The maximum wait time (in minutes) for critical patients before an alert is triggered.'
    ),
  queueData: z.array(
    z.object({
      patientId: z.string().describe('The ID of the patient.'),
      priority: z
        .enum(['Critical', 'High', 'Medium', 'Low'])
        .describe('The priority of the patient.'),
      waitTime: z.number().describe('The wait time (in minutes) of the patient.'),
    })
  ).describe('An array of patient objects with their priority and wait time.'),
});

export type MonitorQueueAndAlertInput = z.infer<typeof MonitorQueueAndAlertInputSchema>;

const MonitorQueueAndAlertOutputSchema = z.object({
  alerts: z.array(
    z.object({
      patientId: z.string().describe('The ID of the patient.'),
      message: z.string().describe('The alert message.'),
    })
  ).describe('An array of alerts for critical patients who have been waiting too long.'),
});

export type MonitorQueueAndAlertOutput = z.infer<typeof MonitorQueueAndAlertOutputSchema>;

export async function monitorQueueAndAlert(
  input: MonitorQueueAndAlertInput
): Promise<MonitorQueueAndAlertOutput> {
  return monitorQueueAndAlertFlow(input);
}

const monitorQueueAndAlertPrompt = ai.definePrompt({
  name: 'monitorQueueAndAlertPrompt',
  input: {schema: MonitorQueueAndAlertInputSchema},
  output: {schema: MonitorQueueAndAlertOutputSchema},
  prompt: `You are a hospital administrator monitoring patient queues.

You are responsible for generating alerts for critical patients who have been waiting too long based on the provided queue data and wait time threshold.

Generate an alert message for each critical patient whose wait time exceeds the specified threshold. The alert message should include the patient ID and a message indicating that the patient has been waiting too long and requires immediate attention.

Critical Patient Wait Time Threshold: {{{criticalPatientWaitTimeThreshold}}} minutes

Queue Data:
{{#each queueData}}
  - Patient ID: {{{patientId}}}, Priority: {{{priority}}}, Wait Time: {{{waitTime}}} minutes
{{/each}}

Output alerts only for critical patients who have exceeded the wait time threshold.
`,
});

const monitorQueueAndAlertFlow = ai.defineFlow(
  {
    name: 'monitorQueueAndAlertFlow',
    inputSchema: MonitorQueueAndAlertInputSchema,
    outputSchema: MonitorQueueAndAlertOutputSchema,
  },
  async input => {
    const {output} = await monitorQueueAndAlertPrompt(input);
    return output!;
  }
);
