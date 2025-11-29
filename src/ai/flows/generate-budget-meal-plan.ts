'use server';

/**
 * @fileOverview An AI agent to generate budget-friendly weekly meal plans.
 *
 * - generateBudgetMealPlan - A function that handles the meal plan generation process.
 */

import { ai } from '@/ai/genkit';
import {
  BudgetMealPlanInputSchema,
  type BudgetMealPlanInput,
  BudgetMealPlanOutputSchema,
  type BudgetMealPlanOutput,
} from '@/ai/schemas/budget-meal-plan-schema';


export async function generateBudgetMealPlan(input: BudgetMealPlanInput): Promise<BudgetMealPlanOutput> {
  return budgetMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetMealPlanPrompt',
  input: { schema: BudgetMealPlanInputSchema },
  output: { schema: BudgetMealPlanOutputSchema },
  prompt: `You are an expert financial planner and nutritionist specializing in creating budget-friendly, healthy meal plans for Indian households.

  Your task is to generate a complete 7-day meal plan based on a user's weekly budget and household size. The plan should be nutritious, affordable, and culturally relevant.

  **User Constraints:**
  - Weekly Budget: {{{weeklyBudget}}} INR
  - Household Size: {{{householdSize}}} people

  **Your Response Must Include:**

  1.  **Weekly Meal Plan:**
      - Create a 7-day meal plan, from Monday to Sunday.
      - For each day, provide simple, low-cost suggestions for breakfast, lunch, and dinner.
      - Prioritize common, seasonal Indian ingredients that are widely available and affordable.

  2.  **Affordable Grocery List:**
      - Generate a detailed grocery list covering all the ingredients needed for the weekly meal plan.
      - Organize the list by category (e.g., Vegetables, Grains, Lentils & Legumes, Dairy, Spices).

  3.  **Budget Tips & Low-Cost Protein:**
      - Provide a paragraph of practical tips for saving money on groceries in India.
      - Specifically mention and recommend low-cost, high-quality protein sources such as dal (lentils), chickpeas, kidney beans, eggs, and paneer (if budget allows).

  Ensure the entire plan is realistic for the given budget.`,
});

const budgetMealPlanFlow = ai.defineFlow(
  {
    name: 'budgetMealPlanFlow',
    inputSchema: BudgetMealPlanInputSchema,
    outputSchema: BudgetMealPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
