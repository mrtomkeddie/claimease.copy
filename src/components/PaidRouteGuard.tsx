'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { checkUserPaidStatus } from '@/lib/userProfile';
import { Loader2, Lock } from 'lucide-react';

interface PaidRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PaidRouteGuard({ children, fallback }: PaidRouteGuardProps) {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkPaidStatus = async () => {
      if (authLoading) return;

      if (!user) {
        // Not authenticated - redirect to auth page
        router.push('/auth');
        return;
      }

      try {
        const paid = await checkUserPaidStatus(user.uid);
        setIsPaid(paid);
        
        if (!paid) {
          // User is not paid - redirect to plans page
          router.push('/plans');
        }
      } catch (error) {
        console.error('Error checking paid status:', error);
        // On error, assume not paid and redirect
        router.push('/plans');
      } finally {
        setChecking(false);
      }
    };

    checkPaidStatus();
  }, [user, authLoading, router]);

  if (authLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!user || !isPaid) {
    // Show fallback if provided, otherwise show default message
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-destructive/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">
            This content requires a paid subscription. Please upgrade your account to continue.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/plans')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              View Plans
            </button>
            <button
              onClick={() => router.push('/auth')}
              className="w-full border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and paid - render children
  return <>{children}</>;
}