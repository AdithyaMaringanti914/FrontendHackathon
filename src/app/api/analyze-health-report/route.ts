import { NextRequest, NextResponse } from 'next/server';
import { analyzeHealthReport } from '@/ai/flows/analyze-health-report';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const result = await analyzeHealthReport(input);
    return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Health report analysis failed', details: e?.message }, { status: 500 });
  }
}
