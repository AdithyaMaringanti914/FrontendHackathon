"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Pause, Play, RotateCcw, StepBack, StepForward, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type AsanaKey = "tadasana" | "vrikshasana" | "warrior2";
type LangKey = "en" | "hi" | "te" | "ta" | "kn" | "bn" | "mr" | "gu" | "pa";

const ASANA_STEPS: Record<AsanaKey, Record<LangKey, string[]>> = {
  tadasana: {
    en: [
      "Stand tall with feet together, shoulders relaxed.",
      "Distribute weight evenly across both feet.",
      "Engage thighs, lift kneecaps gently.",
      "Lengthen spine, roll shoulders back and down.",
      "Lift chest and breathe calmly for 5 breaths.",
    ],
    hi: [
      "पैरों को साथ मिलाकर सीधे खड़े हों, कंधे रिलैक्स रखें।",
      "दोनों पैरों पर वजन बराबर रखें।",
      "जांघों को सक्रिय करें और घुटनों को हल्का उठाएँ।",
      "रीढ़ लंबी रखें, कंधों को पीछे और नीचे रोल करें।",
      "छाती उठाएँ और 5 सांसों तक शांति से श्वास लें।",
    ],
    te: [
      "పాదాలను కలిపి నిటారుగా నిలబడండి, భుజాలను రిలాక్స్ చేయండి.",
      "రెండు పాదాలపై బరువును సమంగా ఉంచండి.",
      "తొడలను యాక్టివ్ చేసి మోకాళ్లను స్వల్పంగా పైకి లేపండి.",
      "వెన్నెముకను పొడవుగా ఉంచి భుజాలను వెనక్కి క్రిందికి తిప్పండి.",
      "ఛాతిని ఎత్తి 5 శ్వాసలు ప్రశాంతంగా తీసుకోండి.",
    ],
    ta: [
      "கால்களை சேர்த்து நேராக நில், தோள்களை தளர்த்து கொள்ளவும்.",
      "இரு கால்களிலும் எடையை சமமாகப் பகிரவும்.",
      "தொண்டைகளைச் செயல்படுத்தி முழங்கால்களை மெதுவாக உயர்த்தவும்.",
      "நெஞ்சை உயர்த்தி, தோள்களை பின்னுக்கு கீழே உருட்டவும்.",
      "5 மூச்சுகள் அமைதியாக எடுக்கவும்.",
    ],
    kn: ["", "", "", "", ""],
    bn: ["", "", "", "", ""],
    mr: ["", "", "", "", ""],
    gu: ["", "", "", "", ""],
    pa: ["", "", "", "", ""],
  },
  vrikshasana: {
    en: [
      "Shift weight onto right foot.",
      "Place left foot on inner right thigh or calf.",
      "Bring palms together at chest.",
      "Lengthen spine; keep gaze steady.",
      "Hold for 5 breaths and switch sides.",
    ],
    hi: [
      "वजन दाएँ पैर पर शिफ्ट करें।",
      "बाएँ पैर को दाएँ जांघ या पिंडली के अंदर रखें।",
      "हाथों को जोड़कर छाती के सामने नमस्ते करें।",
      "रीढ़ लंबी रखें; दृष्टि स्थिर रखें।",
      "5 सांसों तक रुकें और पक्ष बदलें।",
    ],
    te: [
      "బరువును కుడి పాదంపై ఉంచండి.",
      "ఎడమ పాదాన్ని కుడి తొడ లేదా కాలు లోపల ఉంచండి.",
      "చేతులను ఛాతి వద్ద నమస్తేలో కలపండి.",
      "వెన్నెముకను పొడవుగా ఉంచి చూపును స్థిరంగా ఉంచండి.",
      "5 శ్వాసల తర్వాత వైపు మార్చండి.",
    ],
    ta: [
      "எடையை வலது காலில் மாற்றவும்.",
      "இடது காலை வலதுக் கால் தொடை அல்லது காலில் வைக்கவும்.",
      "கைகளைக் கூடி நெஞ்சின் முன் நமஸ்காரம் செய்யவும்.",
      "மீண்டும் நேராக நிற்கவும்; பார்வையை நிலையாக வைத்திருக்கவும்.",
      "5 மூச்சுகளுக்கு பிறகு பக்கம் மாற்றவும்.",
    ],
    kn: ["", "", "", "", ""],
    bn: ["", "", "", "", ""],
    mr: ["", "", "", "", ""],
    gu: ["", "", "", "", ""],
    pa: ["", "", "", "", ""],
  },
  warrior2: {
    en: [
      "Step feet wide; turn right foot out, left slightly in.",
      "Bend right knee over ankle.",
      "Extend arms parallel to floor, palms down.",
      "Gaze over right fingertips.",
      "Hold for 5 breaths and switch sides.",
    ],
    hi: [
      "पैरों को चौड़ा रखें; दायाँ पैर बाहर, बायाँ थोड़ा अंदर।",
      "दायाँ घुटना टखने के ऊपर मोड़ें।",
      "हाथों को ज़मीन के समानांतर फैलाएँ, हथेलियाँ नीचे।",
      "दृष्टि दाईं उँगलियों के ऊपर रखें।",
      "5 सांसों तक रुकें और पक्ष बदलें।",
    ],
    te: [
      "కాళ్లను వెడల్పుగా పెట్టండి; కుడి పాదం బయటకు, ఎడమ కొంచెం లోపలికి.",
      "కుడి మోకాలని మడిచి మడమపై ఉంచండి.",
      "చేతులను నేలకు సమాంతరంగా చాపండి, అరలు క్రిందికి.",
      "కుడి వేళ్లపై చూపును ఉంచండి.",
      "5 శ్వాసల తర్వాత వైపు మార్చండి.",
    ],
    ta: [
      "கால்களை அகலமாக வைக்கவும்; வலது பாதம் வெளியே, இடது பாதம் சிறிது உள்ளே.",
      "வலது முழங்கை முகத்தில் வளைத்து வைக்கவும்.",
      "கைகளை தரைக்கு இணையாக நீட்டி, உள்ளங்கைகளை கீழே வைத்துக் கொள்ளவும்.",
      "பார்வையை வலது விரல்கள் மேல் வைத்து கொள்ளவும்.",
      "5 மூச்சுகளுக்கு பிறகு பக்கம் மாற்றவும்.",
    ],
    kn: ["", "", "", "", ""],
    bn: ["", "", "", "", ""],
    mr: ["", "", "", "", ""],
    gu: ["", "", "", "", ""],
    pa: ["", "", "", "", ""],
  },
};

const LANG_LABEL: Record<LangKey, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
};

function pickVoice(voices: SpeechSynthesisVoice[], lang: LangKey) {
  const lc = lang.toLowerCase();
  return (
    voices.find(v => v.lang?.toLowerCase().startsWith(lc)) ||
    voices.find(v => v.lang?.toLowerCase().startsWith(`${lc}-`)) ||
    voices.find(v => v.lang?.toLowerCase().startsWith("en")) ||
    undefined
  );
}

export function VoiceInstructions({ initialAsana = "tadasana" as AsanaKey }: { initialAsana?: AsanaKey }) {
  const form = useForm<{ asana: AsanaKey; lang: LangKey }>({ defaultValues: { asana: initialAsana, lang: "en" } });
  const asana = form.watch("asana");
  const lang = form.watch("lang");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [hasLangVoice, setHasLangVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [usingCloud, setUsingCloud] = useState(false);

  const steps = useMemo(() => {
    const list = ASANA_STEPS[asana][lang];
    const filled = list.some(s => s && s.trim().length > 0);
    return filled ? list : ASANA_STEPS[asana]["en"];
  }, [asana, lang]);

  useEffect(() => {
    function updateVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    const lc = lang.toLowerCase();
    const available = voices.some(v => v.lang?.toLowerCase().startsWith(lc) || v.lang?.toLowerCase().startsWith(`${lc}-`));
    setHasLangVoice(available);
  }, [voices, lang]);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIndex(0);
    setSpeaking(false);
    setUsingCloud(false);
    setPaused(false);
  }, [asana, lang]);

  async function speak(text: string) {
    window.speechSynthesis.cancel();
    if (!hasLangVoice && typeof window !== 'undefined') {
      try {
        const resp = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, lang }),
        });
        if (!resp.ok) throw new Error('cloud tts failed');
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = url;
        try {
          await audioRef.current.play();
          setSpeaking(true);
          setPaused(false);
          setUsingCloud(true);
          audioRef.current.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
          return;
        } catch {
          URL.revokeObjectURL(url);
          setUsingCloud(false);
        }
      } catch {
        
      }
    }
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(voices, lang);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = lang; }
    u.rate = 1.0;
    u.onend = () => setSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setSpeaking(true);
    setPaused(false);
    setUsingCloud(false);
  }

  function playCurrent() { speak(steps[index]); }
  function pause() {
    if (usingCloud && audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      setSpeaking(false);
      setPaused(true);
      return;
    }
    window.speechSynthesis.pause();
    setSpeaking(false);
    setPaused(true);
  }
  function resume() {
    if (usingCloud && audioRef.current) {
      try { audioRef.current.play(); setSpeaking(true); setPaused(false); } catch {}
      return;
    }
    window.speechSynthesis.resume();
    setSpeaking(true);
    setPaused(false);
  }
  function next() { const i = Math.min(index + 1, steps.length - 1); setIndex(i); speak(steps[i]); }
  function prev() { const i = Math.max(index - 1, 0); setIndex(i); speak(steps[i]); }
  function restart() { setIndex(0); speak(steps[0]); }

  return (
    <Card className="glass-card hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Volume2 className="h-5 w-5"/>Step-by-step Voice Instructions</CardTitle>
        <CardDescription>Select pose and language, then play or navigate steps.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="asana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asana</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Choose asana" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tadasana">Tadasana (Mountain)</SelectItem>
                        <SelectItem value="vrikshasana">Vrikshasana (Tree)</SelectItem>
                        <SelectItem value="warrior2">Virabhadrasana II (Warrior 2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="kn">Kannada</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                        <SelectItem value="gu">Gujarati</SelectItem>
                        <SelectItem value="pa">Punjabi</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Form>

        <div className="rounded-md border p-3 text-sm">
          <p className="mb-2 font-semibold">Step {index + 1} of {steps.length}</p>
          <p className="text-muted-foreground">{steps[index]}</p>
          <div className="mt-3">
            <Progress value={Math.round(((index + 1) / steps.length) * 100)} />
          </div>
        </div>

        {!hasLangVoice && !usingCloud && (
          <div className="rounded-md border border-yellow-300 bg-yellow-100/40 p-3 text-xs text-muted-foreground">
            {LANG_LABEL[lang]} voice may not be installed on your system. Audio will use the browser's default voice. To enable native support, install the {LANG_LABEL[lang]} language pack with Speech and restart the browser.
          </div>
        )}
        {usingCloud && (
          <div className="rounded-md border border-primary/40 bg-primary/10 p-3 text-xs text-muted-foreground">
            Playing {LANG_LABEL[lang]} via cloud TTS provider for consistent pronunciation.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={prev} variant="outline" disabled={index <= 0}><StepBack className="mr-2 h-4 w-4"/>Prev</Button>
          {!speaking ? (
            <Button onClick={playCurrent}><Play className="mr-2 h-4 w-4"/>Play</Button>
          ) : (
            <Button onClick={pause} variant="secondary"><Pause className="mr-2 h-4 w-4"/>Pause</Button>
          )}
          <Button onClick={resume} variant="outline" disabled={!paused}><Play className="mr-2 h-4 w-4"/>Resume</Button>
          <Button onClick={next} variant="outline" disabled={index >= steps.length - 1}><StepForward className="mr-2 h-4 w-4"/>Next</Button>
          <Button onClick={restart} variant="ghost"><RotateCcw className="mr-2 h-4 w-4"/>Restart</Button>
        </div>
      </CardContent>
    </Card>
  );
}
