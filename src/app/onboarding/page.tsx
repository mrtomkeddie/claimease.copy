import { PaidRouteGuard } from '@/components/PaidRouteGuard';
import { Onboarding } from '@/components/onboarding';

export default function OnboardingPage() {
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
            <Onboarding onComplete={() => {}} />
          </div>
        </div>
      </div>
    </PaidRouteGuard>
  );
}