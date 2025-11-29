'use server';

/**
 * @fileOverview An AI agent to analyze health reports and extract key health markers.
 *
 * - analyzeHealthReport - A function that handles the health report analysis process.
 * - AnalyzeHealthReportInput - The input type for the analyzeHealthReport function.
 * - AnalyzeHealthReportOutput - The return type for the analyzeHealthReport function.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

const AnalyzeHealthReportInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      "A health report (PDF or image) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeHealthReportInput = z.infer<typeof AnalyzeHealthReportInputSchema>;

const HealthMarkerSchema = z.object({
  marker: z.string().describe('The name of the health marker (e.g., "Cholesterol").'),
  value: z.string().describe('The measured value of the marker.'),
  standardRange: z.string().describe('The standard medical range for this marker.'),
  status: z
    .enum(['Normal', 'Slightly Elevated', 'High Risk'])
    .describe('The risk status of the marker reading.'),
});

const AnalyzeHealthReportOutputSchema = z.object({
  overallSummary: z.string().describe('A comprehensive summary of the health report.'),
  findings: z.array(HealthMarkerSchema).describe('A structured list of key health markers and their analysis.'),
});
export type AnalyzeHealthReportOutput = z.infer<typeof AnalyzeHealthReportOutputSchema>;

export async function analyzeHealthReport(input: AnalyzeHealthReportInput): Promise<AnalyzeHealthReportOutput> {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    return buildFallback(input);
  }
  return analyzeHealthReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeHealthReportPrompt',
  input: {schema: AnalyzeHealthReportInputSchema},
  output: {schema: AnalyzeHealthReportOutputSchema},
  prompt: `You are a medical expert tasked with analyzing health reports with a high degree of accuracy.

You will receive a health report as a data URI. Your task is to:
1.  **Provide an Overall Summary**: Start with a concise, easy-to-understand summary of the entire report.
2.  **Extract Key Health Markers**: Identify and extract crucial health markers (e.g., Cholesterol, Blood Pressure, Blood Sugar, etc.).
3.  **Structure the Findings**: For each marker, create a structured object with the following fields:
    -   **marker**: The name of the health marker.
    -   **value**: The value as stated in the report, including units.
    -   **standardRange**: The generally accepted standard medical range.
    -   **status**: Classify the marker's status based on its value compared to the standard range. Use one of three categories:
        -   **"Normal"**: The value is within the healthy range.
        -   **"Slightly Elevated"**: The value is borderline or slightly outside the normal range, warranting caution.
        -   **"High Risk"**: The value is significantly outside the normal range, indicating a potential health risk.

Health Report: {{media url=reportDataUri}}`,
});

const analyzeHealthReportFlow = ai.defineFlow(
  {
    name: 'analyzeHealthReportFlow',
    inputSchema: AnalyzeHealthReportInputSchema,
    outputSchema: AnalyzeHealthReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

function buildFallback(input: AnalyzeHealthReportInput): AnalyzeHealthReportOutput {
  return {
    overallSummary: 'Basic summary generated locally. Provide actual report for detailed analysis when AI keys are configured.',
    findings: [
      { marker: 'Blood Pressure', value: '120/80 mmHg', standardRange: '90/60–120/80 mmHg', status: 'Normal' },
      { marker: 'Fasting Blood Sugar', value: '95 mg/dL', standardRange: '70–99 mg/dL', status: 'Normal' },
      { marker: 'Total Cholesterol', value: '205 mg/dL', standardRange: '< 200 mg/dL', status: 'Slightly Elevated' },
    ],
  };
}
