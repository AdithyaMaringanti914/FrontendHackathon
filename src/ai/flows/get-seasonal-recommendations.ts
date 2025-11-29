'use server';

/**
 * @fileOverview An AI agent to generate seasonal diet recommendations for India.
 *
 * - getSeasonalRecommendations - A function that returns dietary tips for a given season.
 * - SeasonalRecsInput - The input type for the function.
 * - SeasonalRecsOutput - The return type for the function.
 */

import { ai } from '@/ai/init';
import { z } from 'genkit';

const SeasonalRecsInputSchema = z.object({
  season: z.enum(['Summer', 'Monsoon', 'Winter']).describe('The current season in India.'),
});
export type SeasonalRecsInput = z.infer<typeof SeasonalRecsInputSchema>;

const RecommendationSchema = z.object({
  name: z.string().describe('The name of the food item or health tip.'),
  reason: z.string().describe('A brief explanation of its benefits for the season.'),
  icon: z.string().describe('A single emoji representing the food or tip.'),
});

const SeasonalRecsOutputSchema = z.object({
  title: z.string().describe('A catchy title for the seasonal recommendations (e.g., "Monsoon Immunity Boost").'),
  summary: z.string().describe('A brief summary explaining the dietary focus for the season.'),
  recommendations: z.array(RecommendationSchema).length(5).describe('A list of exactly 5 food/tip recommendations.'),
});
export type SeasonalRecsOutput = z.infer<typeof SeasonalRecsOutputSchema>;

export async function getSeasonalRecommendations(input: SeasonalRecsInput): Promise<SeasonalRecsOutput> {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    return buildFallback(input.season);
  }
  return seasonalRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seasonalRecommendationsPrompt',
  input: { schema: SeasonalRecsInputSchema },
  output: { schema: SeasonalRecsOutputSchema },
  prompt: `You are a nutrition expert specializing in Indian seasonal diets.

  Your task is to generate 5 culturally relevant dietary recommendations for the given season in India.

  Season: {{{season}}}

  Based on the season, provide:
  1.  A catchy title for the set of recommendations.
  2.  A brief summary explaining the dietary focus (e.g., hydration for Summer, immunity for Winter).
  3.  A list of exactly 5 recommendations. Each recommendation should include:
      - The name of a common Indian food or a health tip.
      - A short reason explaining its benefit for that season.
      - A single, relevant emoji.

  Example for Summer:
  - Name: "Watermelon"
  - Reason: "High water content (92%) helps you stay hydrated in the heat."
  - Emoji: "🍉"

  Focus on readily available and commonly consumed foods in India.`,
});

const seasonalRecommendationsFlow = ai.defineFlow(
  {
    name: 'seasonalRecommendationsFlow',
    inputSchema: SeasonalRecsInputSchema,
    outputSchema: SeasonalRecsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

function buildFallback(season: SeasonalRecsInput['season']): SeasonalRecsOutput {
  if (season === 'Summer') {
    return {
      title: 'Stay Cool and Hydrated',
      summary: 'Focus on hydration, light meals, and seasonal fruits.',
      recommendations: [
        { name: 'Watermelon', reason: 'High water content helps hydration.', icon: '🍉' },
        { name: 'Buttermilk', reason: 'Cools the body and aids digestion.', icon: '🥛' },
        { name: 'Cucumber', reason: 'Refreshing and low in calories.', icon: '🥒' },
        { name: 'Coconut Water', reason: 'Natural electrolytes for hot days.', icon: '🥥' },
        { name: 'Mint Lemonade', reason: 'Helps beat the heat and refreshes.', icon: '🍋' },
      ],
    };
  }
  if (season === 'Monsoon') {
    return {
      title: 'Monsoon Immunity Boost',
      summary: 'Emphasize immunity, hygiene, and warm foods.',
      recommendations: [
        { name: 'Ginger Tea', reason: 'Supports immunity and relieves chills.', icon: '☕' },
        { name: 'Turmeric Milk', reason: 'Anti-inflammatory and comforting.', icon: '🥛' },
        { name: 'Steamed Veggies', reason: 'Safer than raw during monsoon.', icon: '🥦' },
        { name: 'Seasonal Fruits', reason: 'Wash well; rich in vitamins.', icon: '🍎' },
        { name: 'Khichdi', reason: 'Light, warm, and easy to digest.', icon: '🍲' },
      ],
    };
  }
  return {
    title: 'Winter Warmth and Wellness',
    summary: 'Prioritize warmth, protein, and good fats.',
    recommendations: [
      { name: 'Sesame Laddoos', reason: 'Healthy fats keep you warm.', icon: '🍘' },
      { name: 'Sarson Ka Saag', reason: 'Seasonal greens with nutrients.', icon: '🥬' },
      { name: 'Soups', reason: 'Warm, hydrating, and nourishing.', icon: '🍜' },
      { name: 'Peanuts', reason: 'Protein and energy for colder days.', icon: '🥜' },
      { name: 'Jaggery', reason: 'Minerals and gentle sweetness.', icon: '🍯' },
    ],
  };
}
