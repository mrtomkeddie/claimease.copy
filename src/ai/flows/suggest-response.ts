
// src/ai/flows/suggest-response.ts
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for form responses based on the current question and previous answers.
 *
 * - suggestResponse - A function that generates suggested responses.
 * - SuggestResponseInput - The input type for the suggestResponse function.
 * - SuggestResponseOutput - The return type for the suggestResponse function.
 */

import {openai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestResponseInputSchema = z.object({
  currentQuestion: z.string().describe('The specific PIP form question the user is answering.'),
  previousAnswers: z.record(z.string()).describe('A record of previous answers, including the user\'s raw answer to the current question under the key "rawAnswer".'),
});

export type SuggestResponseInput = z.infer<typeof SuggestResponseInputSchema>;

const SuggestResponseOutputSchema = z.object({
  suggestedResponse: z.string().describe('The AI-rewritten, DWP-friendly response.'),
});

export type SuggestResponseOutput = z.infer<typeof SuggestResponseOutputSchema>;

export async function suggestResponse(input: SuggestResponseInput): Promise<SuggestResponseOutput> {
  const prompt = `Current Question:
"How does your condition affect '${input.currentQuestion}'?"

User's Raw Answer for this question:
"${input.previousAnswers.rawAnswer}"

Now, rewrite the user's raw answer into a well-structured, impactful response for their PIP form.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are ClaimEase, an assistant that helps people complete their UK Personal Independence Payment (PIP) application.

Your task:
Rewrite user's answers into clear, detailed first-person statements suitable for a PIP claim.
Keep everything truthful — do not invent or exaggerate.
Always emphasise reliability, safety, repetition, and reasonable time where it naturally fits.
Focus on frequency ("most of the time," "every time I attempt") and impact on independence.
Keep tone factual, formal, and respectful.
The answer must still sound like the claimant wrote it.

Output format:
ClaimEase Answer:
[Rewritten text here in first person]`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const suggestedResponse = completion.choices[0]?.message?.content || '';

    return {
      suggestedResponse
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate AI suggestion');
  }
}
