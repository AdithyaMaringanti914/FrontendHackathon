'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized daily diet and fitness plans based on user profile and health data.
 *
 * - generatePersonalizedPlan - A function that takes user profile and health data as input and returns a personalized diet and fitness plan.
 * - PersonalizedPlanInput - The input type for the generatePersonalizedPlan function.
 * - PersonalizedPlanOutput - The return type for the generatePersonalizedPlan function.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

// Define the input schema for the personalized plan generation
const PersonalizedPlanInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  gender: z.string().describe('The gender of the user.'),
  bloodGroup: z.string().describe('The blood group of the user.'),
  allergies: z.array(z.string()).describe('A list of allergies the user has.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  height: z.number().describe('The height of the user in centimeters.'),
  healthData: z.string().describe('A summary of the user health data.'),
});
export type PersonalizedPlanInput = z.infer<typeof PersonalizedPlanInputSchema>;

// Define the output schema for the personalized plan generation
const PersonalizedPlanOutputSchema = z.object({
  dietPlan: z.string().describe('A personalized daily diet plan for the user.'),
  fitnessPlan: z.string().describe('A personalized daily fitness plan for the user.'),
});
export type PersonalizedPlanOutput = z.infer<typeof PersonalizedPlanOutputSchema>;

// Define the main function that will be called from the outside
export async function generatePersonalizedPlan(input: PersonalizedPlanInput): Promise<PersonalizedPlanOutput> {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    return buildFallback(input);
  }
  return personalizedPlanFlow(input);
}

// Define the prompt for generating the personalized plan
const personalizedPlanPrompt = ai.definePrompt({
  name: 'personalizedPlanPrompt',
  input: {schema: PersonalizedPlanInputSchema},
  output: {schema: PersonalizedPlanOutputSchema},
  prompt: `You are a personal health and fitness coach.

  Based on the following user profile and health data, generate a personalized daily diet and fitness plan.

  User Profile:
  Age: {{{age}}}
  Gender: {{{gender}}}
  Blood Group: {{{bloodGroup}}}
  Allergies: {{#if allergies}}{{#each allergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
  Weight: {{{weight}}} kg
  Height: {{{height}}} cm

  Health Data:
  {{{healthData}}}

  Diet Plan Instructions:
  - Consider the user's allergies and blood group.
  - Provide a balanced diet with appropriate calorie intake.
  - Suggest specific meals and snacks.

  Fitness Plan Instructions:
  - Consider the user's age and health data.
  - Provide a mix of cardio, strength training, and flexibility exercises.
  - Suggest specific exercises with sets and reps.

  Output the diet and fitness plan in a readable format.
  `,
});

// Define the Genkit flow for generating the personalized plan
const personalizedPlanFlow = ai.defineFlow(
  {
    name: 'personalizedPlanFlow',
    inputSchema: PersonalizedPlanInputSchema,
    outputSchema: PersonalizedPlanOutputSchema,
  },
  async input => {
    const {output} = await personalizedPlanPrompt(input);
    return output!;
  }
);

function buildFallback(input: PersonalizedPlanInput): PersonalizedPlanOutput {
  const bmi = Math.round((input.weight / ((input.height / 100) ** 2)) * 10) / 10;
  const kcal = bmi < 18.5 ? 2200 : bmi > 25 ? 1800 : 2000;
  const allergyNote = input.allergies.length ? `Avoid: ${input.allergies.join(', ')}` : 'No known allergies';
  const dietPlan = `### Overview\nDaily target: ~${kcal} kcal. ${allergyNote}.\n\n### Breakfast\nOats with milk and fruits; boiled eggs or paneer.\n\n### Lunch\n2 chapatis or rice, dal, mixed sabzi, salad, curd.\n\n### Snack\nSeasonal fruit; nuts (almonds/walnuts).\n\n### Dinner\nGrilled chicken/tofu/paneer, sautéed vegetables, soup.\n\n### Hydration\n2–3L water; limit sugary drinks.\n\n### Notes\nProfile: ${input.age}y, ${input.gender}, ${input.bloodGroup}.`; 
  const fitnessPlan = `### Warm-up\n5–10 min light cardio and mobility.\n\n### Cardio (3–4 days)\n20–30 min brisk walk/jog/cycle.\n\n### Strength (3 days)\nSquats, push-ups, rows, core: 3×10–12 reps.\n\n### Flexibility\n10 min stretching or yoga daily.\n\n### Recovery\n1 rest day; sleep 7–8 hours.\n\n### Notes\nHeight ${input.height} cm, weight ${input.weight} kg, BMI ~${bmi}. ${input.healthData}`;
  return { dietPlan, fitnessPlan };
}
