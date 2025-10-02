'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2 } from 'lucide-react';
import { ClaimEaseLogo } from '@/components/ClaimEaseLogo';

interface Plan {
  id: 'standard' | 'pro';
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'standard',
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
  {
    id: 'pro',
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
    ],
    recommended: true
  }
];

export default function PlansPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'pro' | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = async (planId: 'standard' | 'pro') => {
    // Store the selected plan in localStorage for auth flow
    localStorage.setItem('selectedPlan', planId);

    // Save pre-registration data if email is available
    if (user?.email) {
      try {
        await fetch('/api/pre-reg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            plan: planId
          }),
        });
      } catch (error) {
        console.warn('Failed to save pre-registration:', error);
      }
    }

    if (!user) {
      router.push(`/auth?plan=${planId}`);
      return;
    }

    setSelectedPlan(planId);
    setLoading(true);
    
    // Navigate to checkout with the selected plan
    router.push(`/checkout?plan=${planId}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-gray-800/90 border-gray-700 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-gray-300">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <ClaimEaseLogo className="h-16 w-auto text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan to manage your claims with ease. All plans include core features to help you navigate the PIP process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <Card 
              key={plan.id} 
              className={`backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105 ${
                plan.recommended 
                  ? 'bg-gradient-to-br from-blue-900/90 to-purple-900/90 border-blue-500 shadow-2xl shadow-blue-500/25' 
                  : 'bg-gray-800/90 border-gray-700 shadow-xl'
              }`}
            >
              <CardHeader className="text-center pb-6">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                  {plan.recommended && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                      Recommended
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-5xl font-bold text-white">£{plan.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <CardDescription className="text-gray-300 mt-2">
                  Perfect for {plan.id === 'standard' ? 'individual users' : 'power users and teams'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={loading}
                  className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Not sure which plan is right for you? 
            <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">
              Contact our support team
            </a>
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Secure payment processing</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}