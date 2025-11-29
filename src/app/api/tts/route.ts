import { NextRequest, NextResponse } from 'next/server';

const VOICE_BY_LANG: Record<string, string> = {
  'en': 'en-US-AriaNeural',
  'hi': 'hi-IN-SwaraNeural',
  'te': 'te-IN-ShrutiNeural',
  'ta': 'ta-IN-PallaviNeural',
  'kn': 'kn-IN-SapnaNeural',
  'bn': 'bn-IN-TanviNeural',
  'mr': 'mr-IN-AarohiNeural',
  'gu': 'gu-IN-DhwaniNeural',
  'pa': 'pa-IN-JamunaNeural',
};

const VOICERSS_LANG: Record<string, string> = {
  'en': 'en-us',
  'hi': 'hi-in',
  'te': 'te-in',
  'ta': 'ta-in',
  'kn': 'kn-in',
  'bn': 'bn-in',
  'mr': 'mr-in',
  'gu': 'gu-in',
  'pa': 'pa-in',
};

export async function POST(req: NextRequest) {
  try {
    const { text, lang } = await req.json();
    if (!text || !lang) return NextResponse.json({ error: 'Missing text or lang' }, { status: 400 });

    const voicerssKey = process.env.VOICERSS_KEY;
    if (voicerssKey) {
      const hl = VOICERSS_LANG[lang] || 'en-us';
      const params = new URLSearchParams({ key: voicerssKey, hl, c: 'MP3', r: '0', src: text });
      const resp = await fetch(`https://api.voicerss.org/?${params.toString()}`);
      let voiceRssError: string | null = null;
      if (!resp.ok) {
        voiceRssError = await resp.text();
      } else {
        const ct = resp.headers.get('Content-Type') || '';
        if (ct.toLowerCase().includes('audio')) {
          const ab = await resp.arrayBuffer();
          return new NextResponse(ab, { status: 200, headers: { 'Content-Type': ct, 'Cache-Control': 'no-store' } });
        } else {
          voiceRssError = await resp.text();
        }
      }

      const key = process.env.AZURE_SPEECH_KEY;
      const region = process.env.AZURE_SPEECH_REGION;
      if (key && region) {
        const voice = VOICE_BY_LANG[lang] || VOICE_BY_LANG['en'];
        const xmlLang = voice.split('-').slice(0, 2).join('-');
        const ssml = `<?xml version="1.0" encoding="UTF-8"?>
<speak version="1.0" xml:lang="${xmlLang}">
  <voice name="${voice}">
    ${text}
  </voice>
</speak>`;
        const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
        const aresp = await fetch(url, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
          },
          body: ssml,
        });
        if (aresp.ok) {
          const act = aresp.headers.get('Content-Type') || 'audio/mpeg';
          const ab = await aresp.arrayBuffer();
          return new NextResponse(ab, { status: 200, headers: { 'Content-Type': act, 'Cache-Control': 'no-store' } });
        } else {
          const txt = await aresp.text();
          return NextResponse.json({ error: 'VoiceRSS and Azure TTS failed', details: { voicerss: voiceRssError, azure: txt } }, { status: 500 });
        }
      }

      return NextResponse.json({ error: 'VoiceRSS TTS failed', details: voiceRssError }, { status: 500 });
    }

    const key = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;
    if (key && region) {
      const voice = VOICE_BY_LANG[lang] || VOICE_BY_LANG['en'];
      const xmlLang = voice.split('-').slice(0, 2).join('-');
      const ssml = `<?xml version="1.0" encoding="UTF-8"?>
<speak version="1.0" xml:lang="${xmlLang}">
  <voice name="${voice}">
    ${text}
  </voice>
</speak>`;
      const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        },
        body: ssml,
      });
      if (!resp.ok) {
        const txt = await resp.text();
        return NextResponse.json({ error: 'Azure TTS failed', details: txt }, { status: 500 });
      }
      const ct = resp.headers.get('Content-Type') || 'audio/mpeg';
      const ab = await resp.arrayBuffer();
      return new NextResponse(ab, { status: 200, headers: { 'Content-Type': ct, 'Cache-Control': 'no-store' } });
    }

    return NextResponse.json({ error: 'No TTS provider configured' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', details: e?.message }, { status: 500 });
  }
}
