'use client';

import { VoiceInstructions } from '@/components/dashboard/voice-instructions';

export default function YogaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yoga Asanas</h1>
        <p className="text-muted-foreground">Step-by-step voice guidance for classic yoga poses.</p>
      </div>

      <VoiceInstructions />
    </div>
  );
}
