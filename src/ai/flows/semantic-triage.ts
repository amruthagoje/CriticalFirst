// Implemented semantic understanding of symptom descriptions using Genkit and assign a priority.

'use server';

/**
 * @fileOverview Implements semantic understanding of symptom descriptions and automatically assign an appropriate priority to expedite triage.
 *
 * - semanticTriage - A function that handles the triage process.
 * - SemanticTriageInput - The input type for the semanticTriage function.
 * - SemanticTriageOutput - The return type for the semanticTriage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticTriageInputSchema = z.object({
  symptomDescription: z
    .string()
    .describe('The description of the patient symptoms.'),
});
export type SemanticTriageInput = z.infer<typeof SemanticTriageInputSchema>;

const SemanticTriageOutputSchema = z.object({
  priority: z
    .enum(['Critical', 'High', 'Medium', 'Low'])
    .describe('The priority level assigned to the patient based on their symptoms.'),
});
export type SemanticTriageOutput = z.infer<typeof SemanticTriageOutputSchema>;

export async function semanticTriage(input: SemanticTriageInput): Promise<SemanticTriageOutput> {
  return semanticTriageFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: {schema: SemanticTriageInputSchema},
  output: {schema: SemanticTriageOutputSchema},
  prompt: `You are an AI triage assistant in a busy emergency room.  Based on the patient's symptom description, assign a priority of Critical, High, Medium, or Low.

Symptom Description: {{{symptomDescription}}}

Consider these factors when assigning priority:
- Critical: Immediate life-threatening conditions requiring immediate intervention.
- High: Potentially life-threatening or severe conditions that require prompt attention.
- Medium: Conditions that require evaluation and treatment but are not immediately life-threatening.
- Low: Minor conditions that can be addressed with standard care.

Please provide the priority.
`,
});

const semanticTriageFlow = ai.defineFlow(
  {
    name: 'semanticTriageFlow',
    inputSchema: SemanticTriageInputSchema,
    outputSchema: SemanticTriageOutputSchema,
  },
  async input => {
    const {output} = await triagePrompt(input);
    return output!;
  }
);
