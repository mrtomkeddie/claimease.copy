'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getUserProfile, updateUserProfile } from '@/lib/userProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  ArrowUpCircle,
  Settings
} from 'lucide-react';

export function BillingContent() {
  const { user } = useUser();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading profile:', error);
          toast({
            title: 'Error loading billing information',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading billing information...</p>
          </div>
        </div>
      </div>
    );
  }

  const planName = profile?.plan === 'pro' ? 'Pro' : 'Standard';
  const planColor = profile?.plan === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  const isPro = profile?.plan === 'pro';

  const handleUpgrade = () => {
    // Navigate to checkout with pro plan
    window.location.href = '/checkout?plan=pro';
  };

  const handleManageSubscription = () => {
    // This would typically redirect to Stripe customer portal
    toast({
      title: 'Subscription Management',
      description: 'Redirecting to subscription management...',
    });
    // In a real implementation, you would create a Stripe customer portal session
    // and redirect the user there
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{planName} Plan</h3>
                <Badge className={planColor}>{isPro ? 'Pro' : 'Standard'}</Badge>
              </div>
            </div>
            {!isPro && (
              <Button onClick={handleUpgrade} className="gap-2">
                <ArrowUpCircle className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Basic claim analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Document upload support</span>
            </div>
            <div className="flex items-center gap-2">
              {isPro ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm">Advanced AI analysis</span>
            </div>
            <div className="flex items-center gap-2">
              {isPro ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm">Priority support</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Your payment and subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm text-muted-foreground">
                {profile?.paidAt ? new Date(profile.paidAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Next Billing Date</span>
              <span className="text-sm text-muted-foreground">
                {profile?.paidAt 
                  ? new Date(new Date(profile.paidAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  : 'N/A'
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Payment Method</span>
              <span className="text-sm text-muted-foreground">Credit Card ending in ****</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button 
              onClick={handleManageSubscription}
              variant="outline" 
              className="w-full gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage Subscription
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => {
                toast({
                  title: 'Payment Method',
                  description: 'Payment method management coming soon',
                });
              }}
            >
              <CreditCard className="h-4 w-4" />
              Update Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Compare features between Standard and Pro plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Feature</th>
                  <th className="text-center py-3 px-4 font-medium">Standard</th>
                  <th className="text-center py-3 px-4 font-medium">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Basic claim analysis</td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Document upload support</td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Advanced AI analysis</td>
                  <td className="text-center py-3 px-4">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Priority support</td>
                  <td className="text-center py-3 px-4">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Monthly Price</td>
                  <td className="text-center py-3 px-4 font-medium">$29</td>
                  <td className="text-center py-3 px-4 font-medium">$99</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {!isPro && (
            <div className="mt-6 text-center">
              <Button onClick={handleUpgrade} className="gap-2">
                <ArrowUpCircle className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}