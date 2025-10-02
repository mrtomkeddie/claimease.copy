import { PaidRouteGuard } from '@/components/PaidRouteGuard';
import { ClaimForm } from '@/components/claim-form';

export default function ClaimPage() {
  return (
    <PaidRouteGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create Your PIP Claim
              </h1>
              <p className="text-muted-foreground">
                Answer questions about your daily living and mobility needs
              </p>
            </div>
            <ClaimForm />
          </div>
        </div>
      </div>
    </PaidRouteGuard>
  );
}