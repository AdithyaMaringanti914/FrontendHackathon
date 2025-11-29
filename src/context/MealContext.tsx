'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a single meal
export interface Meal {
  meal: string;
  calories: number;
  time: string;
  type: string;
  date: Date;
  nutrients: {
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  nutritionScore?: number;
}

// Define the shape of the context
interface MealContextType {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
}

// Create the context with a default value
const MealContext = createContext<MealContextType | undefined>(undefined);

// Create a provider component
export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  React.useEffect(() => {
    try {
      const currentUserRaw = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      const email = currentUserRaw ? (JSON.parse(currentUserRaw)?.email as string | undefined) : undefined;
      if (email) {
        const stored = localStorage.getItem(`meals_${email}`);
        if (stored) {
          const parsed = JSON.parse(stored) as any[];
          const restored: Meal[] = parsed.map(m => ({
            ...m,
            date: new Date(m.date),
          }));
          setMeals(restored);
        }
      }
    } catch {}
  }, []);

  const addMeal = (meal: Meal) => {
    setMeals((prevMeals) => {
      const next = [...prevMeals, meal].sort((a, b) => b.date.getTime() - a.date.getTime());
      try {
        const currentUserRaw = localStorage.getItem('currentUser');
        const email = currentUserRaw ? (JSON.parse(currentUserRaw)?.email as string | undefined) : undefined;
        if (email) {
          localStorage.setItem(`meals_${email}`, JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  return (
    <MealContext.Provider value={{ meals, addMeal }}>
      {children}
    </MealContext.Provider>
  );
};

// Create a custom hook to use the meal context
export const useMeal = () => {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error('useMeal must be used within a MealProvider');
  }
  return context;
};
