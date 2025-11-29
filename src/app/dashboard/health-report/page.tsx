'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { FileUp, Loader, Sparkles, FileText, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const statusConfig: Record<'Normal' | 'Slightly Elevated' | 'High Risk', { icon: typeof CheckCircle; color: string; badgeVariant: BadgeProps['variant'] }> = {
  'Normal': {
    icon: CheckCircle,
    color: 'bg-green-500',
    badgeVariant: 'secondary',
  },
  'Slightly Elevated': {
    icon: AlertTriangle,
    color: 'bg-yellow-500',
    badgeVariant: 'default',
  },
  'High Risk': {
    icon: ShieldAlert,
    color: 'bg-red-500',
    badgeVariant: 'destructive',
  },
};


type HealthFinding = {
  marker: string;
  value: string;
  standardRange: string;
  status: 'Normal' | 'Slightly Elevated' | 'High Risk';
};

type AnalyzeHealthReportOutput = {
  overallSummary: string;
  findings: HealthFinding[];
};

export default function HealthReportPage() {
  const { toast } = useToast();
  const { setHealthData } = useUser();
  const [fileName, setFileName] = useState<string | null>(null);
  const [reportDataUri, setReportDataUri] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeHealthReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const dataUri = await fileToDataUri(file);
      setReportDataUri(dataUri);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!reportDataUri) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const resp = await fetch('/api/analyze-health-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportDataUri }),
      });
      if (!resp.ok) throw new Error('Failed to analyze report');
      const result: AnalyzeHealthReportOutput = await resp.json();
      setAnalysis(result);
      const healthSummary = `${result.overallSummary} Findings: ${result.findings.map((f: HealthFinding) => `${f.marker}: ${f.value} (${f.status})`).join(', ')}`;
      setHealthData(healthSummary);
      toast({
        title: 'Analysis Complete',
        description: 'Health data has been updated and can be used for plan generation.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Analysis Failed',
        description: 'Something went wrong while analyzing the report.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Health Report Analysis</h1>
        <p className="text-muted-foreground">Upload a health report (PDF or image) to get a quick summary of key markers.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Report</CardTitle>
            <CardDescription>Choose a PDF or image file of your health report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-file">Health Report File</Label>
              <Input id="report-file" type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
            </div>
            {fileName && (
              <div className="flex items-center gap-2 rounded-md border p-3 text-sm text-muted-foreground">
                <FileText className="h-5 w-5" />
                <span>{fileName}</span>
              </div>
            )}
          </CardContent>
          <CardContent>
            <Button className="w-full" onClick={handleAnalyze} disabled={!reportDataUri || isLoading}>
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analyze Report
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>A simplified summary of your report generated by AI.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p>Reading your report...</p>
              </div>
            )}
            {!isLoading && !analysis && (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <FileUp className="h-12 w-12" />
                <p className="mt-4">Your health summary will be displayed here.</p>
              </div>
            )}
            {analysis && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Overall Summary</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{analysis.overallSummary}</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Key Findings</h3>
                  {analysis.findings.map((finding) => {
                    const config = statusConfig[finding.status] || statusConfig['Normal'];
                    const Icon = config.icon;
                    return (
                      <div key={finding.marker} className="flex items-start gap-4">
                        <Icon className={cn('h-5 w-5 mt-0.5', 
                          finding.status === 'Normal' && 'text-green-500',
                          finding.status === 'Slightly Elevated' && 'text-yellow-500',
                          finding.status === 'High Risk' && 'text-red-500'
                        )} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{finding.marker}</p>
                            <Badge variant={config.badgeVariant}>{finding.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Value: <span className="font-semibold text-foreground">{finding.value}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Standard Range: {finding.standardRange}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
