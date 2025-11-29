'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateBudgetMealPlan } from '@/ai/flows/generate-budget-meal-plan';
import {
  type BudgetMealPlanOutput,
  BudgetMealPlanInputSchema,
} from '@/ai/schemas/budget-meal-plan-schema';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader, Sparkles, Wallet, ShoppingCart, Lightbulb, ChefHat } from 'lucide-react';

type FormData = z.infer<typeof BudgetMealPlanInputSchema>;

export default function BudgetPlannerPage() {
  const { toast } = useToast();
  const [plan, setPlan] = useState<BudgetMealPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(BudgetMealPlanInputSchema),
    defaultValues: {
      weeklyBudget: 1000,
      householdSize: 1,
    },
  });

  const handleGeneratePlan = async (values: FormData) => {
    setIsLoading(true);
    setPlan(null);
    try {
      const result = await generateBudgetMealPlan(values);
      setPlan(result);
      toast({
        title: 'Plan Generated!',
        description: 'Your budget-friendly meal plan is ready.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate your budget plan at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMealPlan = (mealPlan: BudgetMealPlanOutput['mealPlan']) => {
    const days = Object.keys(mealPlan) as (keyof typeof mealPlan)[];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => (
          <Card key={day} className="flex flex-col">
            <CardHeader>
              <CardTitle className="capitalize text-lg">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
              <p><span className="font-semibold">Breakfast:</span> {mealPlan[day].breakfast}</p>
              <p><span className="font-semibold">Lunch:</span> {mealPlan[day].lunch}</p>
              <p><span className="font-semibold">Dinner:</span> {mealPlan[day].dinner}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Budget Meal Planner</h1>
        <p className="text-muted-foreground">Generate a healthy, affordable weekly meal plan tailored to your budget.</p>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGeneratePlan)}>
            <CardHeader>
              <CardTitle>Set Your Budget</CardTitle>
              <CardDescription>Enter your weekly grocery budget and household size.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weeklyBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Budget (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1500" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="householdSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Household Size</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Budget Plan
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p>Crafting your affordable meal plan...</p>
        </div>
      )}

      {!plan && !isLoading && (
        <Card className="text-center py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Your Plan Awaits</CardTitle>
          <CardDescription className="mt-2">
            Your personalized budget plan will appear here once generated.
          </CardDescription>
        </Card>
      )}

      {plan && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ChefHat className="text-primary"/>Weekly Meal Plan</CardTitle>
              <CardDescription>Here is your 7-day meal plan designed to fit your budget.</CardDescription>
            </CardHeader>
            <CardContent>{renderMealPlan(plan.mealPlan)}</CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingCart className="text-primary"/>Grocery List</CardTitle>
                <CardDescription>This shopping list covers all the items for your weekly plan.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {plan.groceryList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/>Budget-Saving Tips</CardTitle>
                 <CardDescription>Expert advice on affordable proteins and smart shopping.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.budgetTips}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
