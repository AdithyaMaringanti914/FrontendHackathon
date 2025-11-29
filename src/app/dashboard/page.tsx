'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Droplet, Flame, Salad, Zap, Star } from 'lucide-react';
import { NutrientChart } from '@/components/dashboard/nutrient-chart';
import { useMeal } from '@/context/MealContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SeasonalSuggestions } from '@/components/dashboard/seasonal-suggestions';
import { useEffect, useState } from 'react';

const CALORIE_GOAL = 2200;
const PROTEIN_GOAL = 120;

export default function DashboardPage() {
  const { meals } = useMeal();
  const [displayName, setDisplayName] = useState<string>('User');

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) setDisplayName(parsed.name);
      }
    } catch {}
  }, []);

  const todayMeals = meals.filter(
    (meal) =>
      new Date(meal.date).toDateString() === new Date().toDateString()
  );

  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.nutrients.protein, 0);
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.nutrients.carbohydrates, 0);
  const totalFat = todayMeals.reduce((sum, meal) => sum + meal.nutrients.fat, 0);

  const calorieProgress = Math.min((totalCalories / CALORIE_GOAL) * 100, 100);
  const proteinProgress = Math.min((totalProtein / PROTEIN_GOAL) * 100, 100);
  
  const nutrientChartData = [
    { nutrient: 'Protein', goal: PROTEIN_GOAL, consumed: totalProtein },
    { nutrient: 'Carbs', goal: 300, consumed: totalCarbs }, // Example goal
    { nutrient: 'Fats', goal: 70, consumed: totalFat }, // Example goal
  ]

  return (
    <div className="space-y-6 section-enter">
      <div>
        <h1 className="bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">Welcome, {displayName}!</h1>
        <p className="text-muted-foreground">Here's a look at your health data for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories} / {CALORIE_GOAL} kcal</div>
            <p className="text-xs text-muted-foreground">{calorieProgress.toFixed(0)}% of daily goal</p>
            <Progress value={calorieProgress} className="mt-2 h-2 transition-all duration-500" />
          </CardContent>
        </Card>
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <Salad className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProtein.toFixed(0)} / {PROTEIN_GOAL} g</div>
            <p className="text-xs text-muted-foreground">{proteinProgress.toFixed(0)}% of daily goal</p>
            <Progress value={proteinProgress} className="mt-2 h-2 transition-all duration-500" />
          </CardContent>
        </Card>
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hydration</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6 / 8 glasses</div>
            <p className="text-xs text-muted-foreground">75% of daily goal</p>
            <Progress value={75} className="mt-2 h-2 transition-all duration-500" />
          </CardContent>
        </Card>
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercise</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 / 60 min</div>
            <p className="text-xs text-muted-foreground">Morning Run</p>
            <Progress value={75} className="mt-2 h-2 transition-all duration-500" />
          </CardContent>
        </Card>
      </div>

      <div className="section-enter">
        <SeasonalSuggestions />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass-card hover-lift">
          <CardHeader>
            <CardTitle>Recent Meals</CardTitle>
            <CardDescription>A log of your meals for today.</CardDescription>
          </CardHeader>
          <CardContent>
             {todayMeals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meal</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-right">Calories</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayMeals.map((meal, index) => (
                      <TableRow key={`${meal.meal}-${index}`}>
                        <TableCell className="font-medium">{meal.meal}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{meal.type}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {meal.nutritionScore && (
                            <Badge variant={meal.nutritionScore > 7 ? 'secondary' : meal.nutritionScore < 4 ? 'destructive' : 'default'}>
                              <Star className="mr-1 h-3 w-3" />
                              {meal.nutritionScore}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{meal.calories}</TableCell>
                        <TableCell className="text-right">{meal.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <Salad className="h-4 w-4" />
                  <AlertTitle>No Meals Logged Today</AlertTitle>
                  <AlertDescription>
                    Go to the Meal Analysis page to log your first meal.
                  </AlertDescription>
                </Alert>
              )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 glass-card hover-lift">
          <CardHeader>
            <CardTitle>Nutrient Distribution</CardTitle>
            <CardDescription>Macronutrient breakdown for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <NutrientChart data={nutrientChartData} />
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
}
