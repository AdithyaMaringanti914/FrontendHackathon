import { NextRequest, NextResponse } from 'next/server';
import { analyzeMealImage } from '@/ai/flows/analyze-meal-image';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const result = await analyzeMealImage(input);
    return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Meal analysis failed', details: e?.message }, { status: 500 });
  }
}
