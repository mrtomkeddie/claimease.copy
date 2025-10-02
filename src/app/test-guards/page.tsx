import { PaidRouteGuard } from '@/components/PaidRouteGuard';

export default function TestGuardsPage() {
  return (
    <PaidRouteGuard>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Route Guard Test Page
          </h1>
          <p className="text-muted-foreground text-lg">
            If you can see this, you are authenticated and have paid access!
          </p>
          <div className="mt-8 space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Protected Routes Implemented:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ /dashboard - Protected with PaidRouteGuard</li>
                <li>✅ /claim - Protected with PaidRouteGuard</li>
                <li>✅ /print - Protected with PaidRouteGuard (export functionality)</li>
                <li>✅ /onboarding - Protected with PaidRouteGuard</li>
              </ul>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Route Guard Behavior:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Unauthenticated users → redirected to /auth</li>
                <li>• Authenticated but unpaid users → redirected to /plans</li>
                <li>• Authenticated and paid users → can access content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PaidRouteGuard>
  );
}