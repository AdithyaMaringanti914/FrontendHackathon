import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const plugins = apiKey ? [googleAI({ apiKey })] : [];

export const ai = genkit({
  plugins,
  model: apiKey ? 'googleai/gemini-2.5-flash' : undefined,
});
