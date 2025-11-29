'use client';

import { generatePersonalizedPlan, type PersonalizedPlanOutput } from '@/ai/flows/generate-personalized-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { Bot, Loader, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PersonalizedPlanPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [plan, setPlan] = useState<PersonalizedPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const didAutoRef = useRef(false);

  const handleGeneratePlan = useCallback(async () => {
    if (!user.profile) {
      toast({
        title: 'Profile Not Set',
        description: 'Please complete your profile in the onboarding page first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setPlan(null);
    try {
      const result = await generatePersonalizedPlan({
        ...user.profile,
        allergies: user.profile.allergies?.split(',').map(a => a.trim()) || [],
        healthData: user.healthData || 'No specific health data provided.',
      });
      setPlan(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Plan Generation Failed',
        description: 'Could not generate your plan at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);
  useEffect(() => {
    const auto = params.get('auto');
    if (auto === '1' && !didAutoRef.current) {
      didAutoRef.current = true;
      handleGeneratePlan();
    }
  }, [params, handleGeneratePlan]);
  
  const renderPlan = (planContent: string) => {
    return planContent
      .replace(/### (.*)/g, '<h3 class="font-semibold text-lg mt-4 mb-2">$1</h3>')
      .replace(/\* \*\*(.*)\*\*/g, '<p class="font-bold my-1">$1</p>')
      .replace(/\n/g, '<br/>');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Personalized Plan</h1>
        <p className="text-muted-foreground">AI-crafted diet and fitness plans, just for you.</p>
      </div>

      {!user.profile && (
        <Alert>
          <Bot className="h-4 w-4" />
          <AlertTitle>Complete Your Profile</AlertTitle>
          <AlertDescription>
            Please go to the onboarding page to set up your profile before generating a plan.
          </AlertDescription>
        </Alert>
      )}

      {!plan && !isLoading && user.profile && (
        <Card className="text-center">
          <CardHeader>
             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardTitle>Ready for your plan?</CardTitle>
            <CardDescription>
              Click the button below to generate a new diet and fitness plan based on your profile and health data.
            </CardDescription>
            <Button onClick={handleGeneratePlan} disabled={isLoading || !user.profile}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate My Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p>Generating your personalized plan...</p>
          <p className="text-sm">Our AI is crafting the perfect plan for you.</p>
        </div>
      )}

      {plan && (
        <div className="space-y-6">
           <div className="flex justify-end">
             <Button onClick={handleGeneratePlan} disabled={isLoading} variant="outline">
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" /> }
              Regenerate Plan
            </Button>
           </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Diet Plan</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
                <div dangerouslySetInnerHTML={{ __html: renderPlan(plan.dietPlan) }} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Fitness Plan</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
                <div dangerouslySetInnerHTML={{ __html: renderPlan(plan.fitnessPlan) }} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
