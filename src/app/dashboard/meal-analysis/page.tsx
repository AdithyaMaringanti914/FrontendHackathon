'use client';

 
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMeal } from '@/context/MealContext';
import { CircleCheck, CircleX, Lightbulb, Loader, Sparkles, ChefHat, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import { useState, type ChangeEvent } from 'react';

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type Nutrients = { protein: number; carbohydrates: number; fat: number };
type RecipeSuggestion = {
  recipeName: string;
  description: string;
  nutritionScore: number;
  calories: number;
  preparationTime: string;
};
type AnalyzeMealImageOutput = {
  foodItems: string[];
  estimatedCalories: number;
  nutritionScore: number;
  estimatedNutrients: Nutrients;
  allergens: string[];
  suggestedImprovements: string;
  recipeSuggestions: RecipeSuggestion[];
};

export default function MealAnalysisPage() {
  const { toast } = useToast();
  const { addMeal } = useMeal();
  const [preview, setPreview] = useState<string | null>(null);
  const [mealImageDataUri, setMealImageDataUri] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeMealImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const dataUri = await fileToDataUri(file);
      setMealImageDataUri(dataUri);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!mealImageDataUri) {
      toast({
        title: 'No Image Selected',
        description: 'Please select an image to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const resp = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealImageDataUri }),
      });
      if (!resp.ok) throw new Error('Failed to analyze meal');
      const result: AnalyzeMealImageOutput = await resp.json();
      setAnalysis(result);

      if (result.foodItems.length > 0) {
        addMeal({
          meal: result.foodItems.join(', '),
          calories: result.estimatedCalories,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Lunch', // This could be made dynamic in a future update
          date: new Date(),
          nutrients: result.estimatedNutrients,
          nutritionScore: result.nutritionScore,
        });
        toast({
          title: 'Meal Logged!',
          description: `${result.foodItems[0]} has been added to your recent meals.`,
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        title: 'Analysis Failed',
        description: 'Something went wrong while analyzing the image.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Meal Analysis</h1>
        <p className="text-muted-foreground">Snap a photo of your meal and get an instant nutritional breakdown.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Meal</CardTitle>
            <CardDescription>Choose an image of your food to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meal-picture">Meal Picture</Label>
              <Input id="meal-picture" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            {preview && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <Image src={preview} alt="Meal preview" fill objectFit="cover" />
              </div>
            )}
          </CardContent>
          <CardContent>
            <Button className="w-full" onClick={handleAnalyze} disabled={!preview || isLoading}>
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analyze Meal
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Here's what our AI found in your meal.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p>Analyzing your meal...</p>
                <p className="text-sm">This might take a moment.</p>
              </div>
            )}
            {!isLoading && !analysis && (
              <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                <p>Your analysis will appear here once you upload and analyze an image.</p>
              </div>
            )}
            {analysis && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Identified Food Items</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.foodItems.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Nutritional Estimate</h3>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-muted-foreground">Calories</span>
                      <span className="font-semibold">{analysis.estimatedCalories} kcal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-muted-foreground">Nutrition Score</span>
                      <Badge variant={analysis.nutritionScore > 7 ? 'secondary' : analysis.nutritionScore < 4 ? 'destructive' : 'default'}>{analysis.nutritionScore} / 10</Badge>
                    </div>
                    {(['protein','carbohydrates','fat'] as const).map((key) => (
                      <div key={key} className="flex items-center justify-between col-span-2 sm:col-span-1">
                        <span className="font-medium capitalize text-muted-foreground">{key}</span>
                        <span className="font-semibold">{analysis.estimatedNutrients[key]}g</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Potential Allergens</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.allergens.length > 0 ? (
                      analysis.allergens.map((allergen) => (
                        <Badge key={allergen} variant="destructive">
                          <CircleX className="mr-1 h-3 w-3" />
                          {allergen}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">
                        <CircleCheck className="mr-1 h-3 w-3" />
                        None detected
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="rounded-lg bg-accent/50 p-4">
                   <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-primary"/>Suggested Improvements</h3>
                   <p className="text-sm mt-2 text-accent-foreground">{analysis.suggestedImprovements}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {analysis?.recipeSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="text-primary" /> Healthier Recipe Suggestions
            </CardTitle>
            <CardDescription>
              Here are 3 healthier alternatives our AI thinks you might like.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {analysis.recipeSuggestions.map((recipe, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{recipe.recipeName}</CardTitle>
                  <CardDescription className="text-xs italic">{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-400" /> Nutrition Score</span>
                    <Badge variant="secondary">{recipe.nutritionScore} / 10</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Calories</span>
                    <span className="font-semibold">{recipe.calories} kcal</span>
                  </div>
                   <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground flex items-center gap-1.5"><Clock className="h-4 w-4" /> Prep Time</span>
                    <span className="font-semibold">{recipe.preparationTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
