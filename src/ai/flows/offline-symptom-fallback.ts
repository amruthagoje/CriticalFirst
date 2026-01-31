'use server';

/**
 * @fileOverview Implements a lightweight semantic fallback for triage when the system is offline.
 *
 * - offlineSymptomFallback - A function that handles the offline triage process.
 * - OfflineSymptomFallbackInput - The input type for the offlineSymptomFallback function.
 * - OfflineSymptomFallbackOutput - The return type for the offlineSymptomFallback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OfflineSymptomFallbackInputSchema = z.object({
  symptomDescription: z.string().describe('The description of the patient\'s symptoms.'),
});
export type OfflineSymptomFallbackInput = z.infer<typeof OfflineSymptomFallbackInputSchema>;

const OfflineSymptomFallbackOutputSchema = z.object({
  priority: z
    .enum(['Critical', 'High', 'Medium', 'Low'])
    .describe('The triage priority level assigned based on the symptoms.'),
  reason: z.string().describe('The reasoning behind the assigned priority.'),
});
export type OfflineSymptomFallbackOutput = z.infer<typeof OfflineSymptomFallbackOutputSchema>;

export async function offlineSymptomFallback(input: OfflineSymptomFallbackInput): Promise<OfflineSymptomFallbackOutput> {
  return offlineSymptomFallbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'offlineSymptomFallbackPrompt',
  input: {schema: OfflineSymptomFallbackInputSchema},
  output: {schema: OfflineSymptomFallbackOutputSchema},
  prompt: `You are a triage nurse assisting in a clinic setting where the system is offline.  Based on the patient's symptom description, assign a priority of Critical, High, Medium, or Low.

Symptom Description: {{{symptomDescription}}}

Consider the following:
- Critical: Severe symptoms indicating immediate life-threatening conditions (e.g., chest pain, difficulty breathing, loss of consciousness).
- High: Potentially serious symptoms that require prompt evaluation (e.g., severe abdominal pain, high fever, acute injury).
- Medium: Moderate symptoms that warrant medical attention but are not immediately life-threatening (e.g., mild abdominal pain, persistent cough, minor injury).
- Low: Mild symptoms that are unlikely to indicate a serious condition (e.g., mild headache, minor skin rash, slight discomfort).

Respond with a JSON object containing the \"priority\" (Critical, High, Medium, or Low) and the \"reason\" for the priority assignment.
Make sure to respond in a JSON format.`,
});

const offlineSymptomFallbackFlow = ai.defineFlow(
  {
    name: 'offlineSymptomFallbackFlow',
    inputSchema: OfflineSymptomFallbackInputSchema,
    outputSchema: OfflineSymptomFallbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
