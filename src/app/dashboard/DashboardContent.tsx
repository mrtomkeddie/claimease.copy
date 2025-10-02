'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getUserProfile, getUserPlan } from '@/lib/userProfile';
import { UserProfile } from '@/lib/userProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { 
  User, 
  CreditCard, 
  Calendar, 
  Settings, 
  FileText, 
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';

export function DashboardContent() {
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const planName = profile?.plan === 'pro' ? 'Pro' : 'Standard';
  const planColor = profile?.plan === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Manage your claims and access powerful tools to streamline your workflow.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No claims processed yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Start processing claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">No data available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge className={planColor}>{planName}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Active subscription</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with ClaimEase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button 
                onClick={() => router.push('/claims/new')}
                className="justify-start"
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Submit New Claim
              </Button>
              
              <Button 
                onClick={() => router.push('/claims')}
                className="justify-start"
                variant="outline"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View All Claims
              </Button>
              
              <Button 
                onClick={() => router.push('/settings')}
                className="justify-start"
                variant="outline"
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
              
              <Button 
                onClick={() => router.push('/billing')}
                className="justify-start"
                variant="outline"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing & Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{user?.email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={planColor}>{planName}</Badge>
              </div>
            </div>
            
            {profile?.paidAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-sm">
                  {new Date(profile.paidAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Learn how to make the most of ClaimEase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Submit Your First Claim</h4>
                <p className="text-sm text-muted-foreground">
                  Upload your insurance documents and let our AI analyze them for potential claims.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Track Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor the status of your claims and see detailed analytics about your submissions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Customize Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure your preferences and notification settings to match your workflow.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}