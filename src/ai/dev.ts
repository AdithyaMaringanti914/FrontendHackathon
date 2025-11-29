'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-meal-image.ts';
import '@/ai/flows/analyze-health-report.ts';
import '@/ai/flows/generate-personalized-plan.ts';
import '@/ai/flows/get-seasonal-recommendations.ts';
