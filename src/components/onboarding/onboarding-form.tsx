'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { type UserProfile } from '@/context/UserContext';

const step1Schema = z.object({
  age: z.coerce.number().min(1, 'Age is required').max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
});

const step2Schema = z.object({
  weight: z.coerce.number().min(1, 'Weight is required'),
  height: z.coerce.number().min(1, 'Height is required'),
});

const step3Schema = z.object({
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  allergies: z.string().optional(),
});

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);

const steps = [
  { id: 1, title: 'Personal Info', fields: ['age', 'gender'] },
  { id: 2, title: 'Body Metrics', fields: ['weight', 'height'] },
  { id: 3, title: 'Health Details', fields: ['bloodGroup', 'allergies'] },
];

interface OnboardingFormProps {
  onSave: (profile: UserProfile) => void;
}

export function OnboardingForm({ onSave }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      gender: undefined,
      weight: undefined,
      height: undefined,
      bloodGroup: undefined,
      allergies: '',
    },
  });

  const goNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const goPrev = () => {
    setCurrentStep((step) => step - 1);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onSave(values);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Profile Updated!',
        description: 'Your health profile has been successfully saved.',
      });
      router.push('/dashboard');
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Card className="border-2 border-border/40 shadow-lg">
      <CardHeader>
        <Progress value={(currentStep + 1) * (100 / steps.length)} className="h-2" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Personal Info</h2>
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 25"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={(field.value as string | undefined) ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Body Metrics</h2>
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (in kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 70"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (in cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 175"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Health Details</h2>
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} value={(field.value as string | undefined) ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Peanuts, Shellfish, Gluten"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0}>
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Finish Setup'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
