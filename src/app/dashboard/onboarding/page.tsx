'use client';
import { OnboardingForm } from '@/components/onboarding/onboarding-form';
import { useUser } from '@/context/UserContext';

export default function OnboardingPage() {
  const { setUserProfile } = useUser();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Health Profile Setup</h1>
          <p className="text-muted-foreground">
            Let's get some basic information to personalize your experience.
          </p>
        </div>
        <OnboardingForm onSave={setUserProfile} />
      </div>
    </div>
  );
}
