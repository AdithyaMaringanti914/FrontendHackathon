import { NextRequest, NextResponse } from 'next/server';
import { getSeasonalRecommendations } from '@/ai/flows/get-seasonal-recommendations';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const result = await getSeasonalRecommendations(input);
    return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Seasonal recommendations failed', details: e?.message }, { status: 500 });
  }
}
