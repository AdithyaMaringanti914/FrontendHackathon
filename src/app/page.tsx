import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/icons/logo';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="flex w-full flex-1 flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8 section-enter">
          <div className="flex flex-col items-center space-y-3 text-center">
            <Logo className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">Log in to your PoshanAI account</p>
          </div>
          <div className="rounded-xl border glass-card p-6 hover-lift">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden w-1/2 flex-1 lg:block">
        <Image
          src="https://picsum.photos/seed/health/1200/1800"
          alt="Healthy food"
          fill
          className="h-full w-full object-cover"
          data-ai-hint="healthy food"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-background/10" />
      </div>
    </div>
  );
}
