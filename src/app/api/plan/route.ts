import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedPlan } from '@/ai/flows/generate-personalized-plan';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const result = await generatePersonalizedPlan(input);
    return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Plan generation failed', details: e?.message }, { status: 500 });
  }
}
