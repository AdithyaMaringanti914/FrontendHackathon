'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCurrentIndianSeason } from '@/lib/seasons';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SeasonalSuggestions() {
  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true);
      try {
        const season = getCurrentIndianSeason();
        const resp = await fetch('/api/seasonal-recs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ season }),
        });
        if (!resp.ok) throw new Error('Failed to load seasonal recommendations');
        const result = await resp.json();
        setRecommendations(result);
      } catch (error) {
        console.error('Failed to fetch seasonal recommendations:', error);
        toast({
          title: 'Could not load suggestions',
          description: 'There was a problem fetching seasonal diet tips.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Suggestions</CardTitle>
          <CardDescription>AI-powered tips for eating well this season.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-24">
          <Loader className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading tips...</p>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations) {
    return null; 
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{recommendations.title}</CardTitle>
        <CardDescription>{recommendations.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recommendations.recommendations.map((item) => (
            <div
              key={item.name}
              className="rounded-lg border bg-card p-4 text-center text-card-foreground shadow-sm flex flex-col items-center justify-start"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
