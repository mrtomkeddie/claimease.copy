'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/userProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { ClaimEaseLogo } from '@/components/ClaimEaseLogo';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('Invalid session');
      setLoading(false);
      return;
    }

    if (!user) {
      router.push('/auth');
      return;
    }

    // Check user status
    checkUserStatus();
  }, [user, searchParams]);

  const checkUserStatus = async () => {
    if (!user) return;

    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      
      // If user is not paid, wait a bit and check again (webhook might still be processing)
      if (!profile?.paid) {
        setTimeout(async () => {
          const updatedProfile = await getUserProfile(user.uid);
          setUserProfile(updatedProfile);
          
          if (!updatedProfile?.paid) {
            setError('Payment verification is taking longer than expected. Please check back in a few moments.');
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setError('Failed to verify payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-gray-800/90 border-gray-700 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-gray-300">Verifying your payment...</p>
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
            <CardTitle className="text-red-400">Verification Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
            <div className="mt-6 space-y-3">
              <Button 
                onClick={checkUserStatus}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
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
      <Card className="backdrop-blur-sm bg-gray-800/90 border-gray-700 shadow-2xl max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-400">Payment Successful!</CardTitle>
          <CardDescription className="text-gray-400">
            Welcome to ClaimEase {userProfile?.name || ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-white mb-2">Your Subscription</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Plan</span>
                <span className="text-white font-medium capitalize">{userProfile?.plan} Plan</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-300">Status</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-300 mb-4">
                Your account is now ready. You can start managing your claims right away!
              </p>
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
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
    }>
      <SuccessContent />
    </Suspense>
  );
}