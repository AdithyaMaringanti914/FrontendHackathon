import { SignupForm } from '@/components/auth/signup-form';
import { Logo } from '@/components/icons/logo';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row-reverse">
      <div className="flex w-full flex-1 flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <Logo className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-muted-foreground">Start your journey to a healthier you</p>
          </div>
          <SignupForm />
        </div>
      </div>
      <div className="relative hidden w-1/2 flex-1 lg:block">
        <Image
          src="https://picsum.photos/seed/fitness/1200/1800"
          alt="Person exercising"
          fill
          className="h-full w-full object-cover"
          data-ai-hint="fitness"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-background/10" />
      </div>
    </div>
  );
}
