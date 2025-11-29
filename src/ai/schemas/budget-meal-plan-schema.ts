/**
 * @fileOverview Zod schemas and TypeScript types for the budget meal plan feature.
 *
 * - BudgetMealPlanInputSchema - The Zod schema for the input of the meal plan generation.
 * - BudgetMealPlanInput - The TypeScript type for the input.
 * - BudgetMealPlanOutputSchema - The Zod schema for the output of the meal plan generation.
 * - BudgetMealPlanOutput - The TypeScript type for the output.
 */

import { z } from 'genkit';

export const BudgetMealPlanInputSchema = z.object({
  weeklyBudget: z.number().positive().describe('The maximum weekly budget for groceries in the local currency (assume INR for India).'),
  householdSize: z.number().int().positive().default(1).describe('The number of people in the household.'),
});
export type BudgetMealPlanInput = z.infer<typeof BudgetMealPlanInputSchema>;

const MealSchema = z.object({
  breakfast: z.string().describe('A budget-friendly breakfast suggestion.'),
  lunch: z.string().describe('A budget-friendly lunch suggestion.'),
  dinner: z.string().describe('A budget-friendly dinner suggestion.'),
});

export const BudgetMealPlanOutputSchema = z.object({
  mealPlan: z.object({
    monday: MealSchema,
    tuesday: MealSchema,
    wednesday: MealSchema,
    thursday: MealSchema,
    friday: MealSchema,
    saturday: MealSchema,
    sunday: MealSchema,
  }).describe('A 7-day meal plan with three meals per day.'),
  groceryList: z.array(z.string()).describe('A comprehensive grocery list for the week, optimized for affordability.'),
  budgetTips: z.string().describe('Actionable tips for saving money on groceries, including advice on finding low-cost protein sources like lentils, legumes, and eggs.'),
});
export type BudgetMealPlanOutput = z.infer<typeof BudgetMealPlanOutputSchema>;
