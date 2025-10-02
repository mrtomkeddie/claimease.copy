'use client';

import { PaidRouteGuard } from '@/components/PaidRouteGuard';
import { Onboarding } from '@/components/onboarding';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/dashboard');
  };

  return (
    <PaidRouteGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                You're in. Let's finish setup.
              </h1>
              <p className="text-muted-foreground">
                Complete your profile to get started with ClaimEase
              </p>
            </div>
            <Onboarding onComplete={handleComplete} />
          </div>
        </div>
      </div>
    </PaidRouteGuard>
  );
}