'use server';

/**
 * @fileOverview An AI agent to analyze meal images.
 *
 * - analyzeMealImage - A function that handles the meal image analysis process.
 * - AnalyzeMealImageInput - The input type for the analyzeMealImage function deserving an award
 * - AnalyzeMealImageOutput - The return type for the analyzeMealImage function.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

const AnalyzeMealImageInputSchema = z.object({
  mealImageDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeMealImageInput = z.infer<typeof AnalyzeMealImageInputSchema>;

const RecipeSuggestionSchema = z.object({
  recipeName: z.string().describe('The name of the suggested healthy recipe.'),
  description: z.string().describe('A brief description of why this recipe is a healthier alternative.'),
  nutritionScore: z.number().min(1).max(10).describe('A nutrition score out of 10, where 10 is highly nutritious.'),
  calories: z.number().describe('The estimated number of calories per serving.'),
  preparationTime: z.string().describe('The estimated preparation time for the recipe (e.g., "25 minutes").'),
});

const AnalyzeMealImageOutputSchema = z.object({
  foodItems: z.array(z.string()).describe('A list of identified food items in the meal.'),
  estimatedCalories: z.number().describe('The estimated total calories in the meal.'),
  nutritionScore: z.number().min(1).max(10).describe('A nutrition score from 1 to 10 for the analyzed meal, based on nutrient balance, vitamins, portion size, and sugar/oil levels.'),
  estimatedNutrients: z
    .object({
      protein: z.number().describe('Estimated protein in grams.'),
      carbohydrates: z.number().describe('Estimated carbohydrates in grams.'),
      fat: z.number().describe('Estimated fat in grams.'),
    })
    .describe('A record of estimated nutrients in the meal (protein, carbs, fats).'),
  allergens: z
    .array(z.string())
    .describe('A list of potential allergens present in the meal.'),
  suggestedImprovements: z
    .string()
    .describe('Suggestions for improving the meal to be healthier.'),
  recipeSuggestions: z.array(RecipeSuggestionSchema).length(3).describe('A list of exactly 3 healthier recipe suggestions as alternatives to the user\'s meal.'),
});
export type AnalyzeMealImageOutput = z.infer<typeof AnalyzeMealImageOutputSchema>;

export async function analyzeMealImage(input: AnalyzeMealImageInput): Promise<AnalyzeMealImageOutput> {
  return analyzeMealImageFlow(input);
}

const analyzeMealImagePrompt = ai.definePrompt({
  name: 'analyzeMealImagePrompt',
  input: {schema: AnalyzeMealImageInputSchema},
  output: {schema: AnalyzeMealImageOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing meal images and providing detailed nutritional information and healthy alternatives.

  Analyze the provided meal image with great care and accuracy. Your task is to:
  1.  **Identify Food Items**: List all discernible food items in the image.
  2.  **Estimate Calories**: Provide a reasonable estimate of the total calorie count for the meal.
  3.  **Provide a Nutrition Score**: Give the meal a score from 1 to 10, where 10 is highly nutritious. Base this on the balance of carbs/protein/fats, vitamins, minerals, portion size, and estimated sugar/oil levels.
  4.  **Estimate Nutrients**: Break down the estimated macronutrients (protein, carbohydrates, fat) in grams.
  5.  **Identify Allergens**: List common potential allergens present (e.g., nuts, dairy, gluten, soy).
  6.  **Suggest Improvements**: Offer specific, actionable advice on how to make the meal healthier.
  7.  **Suggest Healthier Recipes**: Based on the user's meal, provide exactly three alternative healthy recipe suggestions. For each recipe, include:
      - A descriptive recipe name.
      - A short description of its health benefits.
      - A nutrition score from 1 to 10.
      - Estimated calories per serving.
      - Estimated preparation time.


  Image: {{media url=mealImageDataUri}}

  Provide a response in a structured JSON format.`,
});

const analyzeMealImageFlow = ai.defineFlow(
  {
    name: 'analyzeMealImageFlow',
    inputSchema: AnalyzeMealImageInputSchema,
    outputSchema: AnalyzeMealImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeMealImagePrompt(input);
    return output!;
  }
);
