'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/userProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';
import { ClaimEaseLogo } from '@/components/ClaimEaseLogo';

interface CheckoutSession {
  id: string;
  url: string;
}

const PLAN_DETAILS = {
  standard: {
    name: 'Standard Plan',
    price: 49,
    features: [
      'Up to 5 active claims',
      'Basic claim tracking',
      'Document storage (1GB)',
      'Email support',
      'Mobile app access'
    ]
  },
  pro: {
    name: 'Pro Plan',
    price: 79,
    features: [
      'Unlimited active claims',
      'Advanced claim analytics',
      'Document storage (10GB)',
      'Priority support',
      'Advanced reporting',
      'API access',
      'Team collaboration'
    ]
  }
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<'standard' | 'pro' | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null);

  useEffect(() => {
    const planParam = searchParams.get('plan') as 'standard' | 'pro' | null;
    
    if (!planParam || !PLAN_DETAILS[planParam]) {
      setError('Invalid plan selected');
      setLoading(false);
      return;
    }

    setPlan(planParam);

    // Check if user is authenticated
    if (!user) {
      router.push('/auth');
      return;
    }

    // Check if user is already paid
    checkUserStatus();
  }, [user, searchParams]);

  const checkUserStatus = async () => {
    if (!user) return;

    try {
      const userProfile = await getUserProfile(user.uid);
      
      // If user is already paid, redirect to dashboard
      if (userProfile?.paid) {
        router.push('/dashboard');
        return;
      }

      // Create checkout session
      await createCheckoutSession();
    } catch (error) {
      console.error('Error checking user status:', error);
      setError('Failed to load checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async () => {
    if (!user || !plan) return;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          plan: plan,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      setCheckoutSession(data);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Failed to create checkout session. Please try again.');
    }
  };

  const handleCheckout = () => {
    if (checkoutSession?.url) {
      window.location.href = checkoutSession.url;
    }
  };

  const currentPlan = plan ? PLAN_DETAILS[plan] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-gray-800/90 border-gray-700 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-gray-300">Loading checkout...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-gray-800/90 border-gray-700 shadow-2xl max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
            <div className="mt-6 space-y-3">
              <Button 
                onClick={() => router.push('/plans')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Choose a different plan
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ClaimEaseLogo className="h-12 w-auto text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Purchase</h1>
          <p className="text-gray-300">You're almost ready to start managing your claims</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Details */}
          <Card className="backdrop-blur-sm bg-gray-800/90 border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">{currentPlan?.name}</CardTitle>
              <CardDescription className="text-gray-400">
                £{currentPlan?.price}/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentPlan?.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="backdrop-blur-sm bg-gray-800/90 border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Payment Details</CardTitle>
              <CardDescription className="text-gray-400">
                Secure payment powered by Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Plan</span>
                    <span className="text-white font-medium">{currentPlan?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total</span>
                    <span className="text-white font-bold text-lg">£{currentPlan?.price}/month</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={!checkoutSession || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-gray-800/90 border-gray-700 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-gray-300">Loading checkout...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}