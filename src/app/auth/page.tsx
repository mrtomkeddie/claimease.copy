'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Mail, Lock, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClaimEaseLogo } from '@/components/ClaimEaseLogo';
import { useUser } from '@/contexts/UserContext';
import { auth } from '@/lib/firebase';
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { createUserProfile, getUserProfile, setPendingPlan, checkUserPaidStatus } from '@/lib/userProfile';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { signIn, signUp } = useUser();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // UI state
  const [authStep, setAuthStep] = useState<'email' | 'login' | 'signup'>('email');
  const [plan, setPlan] = useState<string | null>(null);

  // Prefill email from URL on mount and check for pre-registration
  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlPlan = searchParams.get('plan');
    
    if (urlEmail) {
      setEmail(urlEmail);
    }
    if (urlPlan) {
      setPlan(urlPlan);
    }

    // Check for selected plan from localStorage (from plans page)
    const storedPlan = localStorage.getItem('selectedPlan');
    if (storedPlan && !urlPlan) {
      setPlan(storedPlan);
    }
  }, [searchParams]);

  // Check for pre-registration data
  const checkPreRegistration = async (email: string) => {
    try {
      const response = await fetch(`/api/pre-reg?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && !data.data.used) {
          return data.data.plan;
        }
      }
    } catch (error) {
      console.warn('Failed to check pre-registration:', error);
    }
    return null;
  };

  // Check if user exists when email is submitted
  const handleContinue = async () => {
    if (!email.trim()) {
      toast({
        title: 'Please enter your email',
        variant: 'destructive',
      });
      return;
    }

    setCheckingEmail(true);
    
    try {
      // Check for pre-registration data first
      const preRegPlan = await checkPreRegistration(email);
      if (preRegPlan && !plan) {
        setPlan(preRegPlan);
      }

      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length > 0 && methods.includes('password')) {
        // Existing user - show login form
        setAuthStep('login');
      } else {
        // New user - show signup form
        setAuthStep('signup');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      toast({
        title: 'That email looks invalid. Please check and try again.',
        variant: 'destructive',
      });
    } finally {
      setCheckingEmail(false);
    }
  };

  // Handle login
  const handleSignIn = async () => {
    if (!password) {
      toast({
        title: 'Please enter your password',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user has paid
      const isPaid = await checkUserPaidStatus(user.uid);
      
      if (isPaid) {
        // Paid user - go to dashboard
        router.push('/dashboard');
      } else {
        // Unpaid user - route based on plan
        if (plan) {
          await setPendingPlan(user.uid, plan as 'standard' | 'pro');
          router.push(`/checkout?plan=${encodeURIComponent(plan)}`);
        } else {
          // Check if user has a pending plan
          const userProfile = await getUserProfile(user.uid);
          if (userProfile?.pendingPlan) {
            router.push(`/checkout?plan=${userProfile.pendingPlan}`);
          } else {
            router.push('/plans');
          }
        }
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        toast({
          title: 'Wrong password. Try again or reset.',
          variant: 'destructive',
        });
      } else if (error.code === 'auth/user-not-found') {
        // Edge case: user was deleted, show signup
        setAuthStep('signup');
        toast({
          title: 'Account not found. Please create an account.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sign-in failed. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignUp = async () => {
    if (!password || !confirmPassword) {
      toast({
        title: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save pre-registration data if user has a plan selected
      if (plan) {
        try {
          await fetch('/api/pre-reg', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              plan: plan
            }),
          });
        } catch (preRegError) {
          console.warn('Failed to save pre-registration:', preRegError);
        }
      }
      
      // Create user profile
      await createUserProfile(user.uid, email, plan || undefined);
      
      // Send verification email (optional, doesn't block flow)
      try {
        await sendEmailVerification(user);
      } catch (verifyError) {
        console.warn('Failed to send verification email:', verifyError);
      }
      
      // Navigate based on plan
      if (plan) {
        router.push(`/checkout?plan=${encodeURIComponent(plan)}`);
      } else {
        router.push('/plans');
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        // Switch to login
        setAuthStep('login');
        toast({
          title: 'Email already exists. Please sign in.',
          variant: 'destructive',
        });
      } else if (error.code === 'auth/weak-password') {
        toast({
          title: 'Please choose a longer password (8+ characters).',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sign-up failed. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({
        title: 'Enter your email first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password reset sent. Check your inbox.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Could not send reset email. Double-check the address.',
        variant: 'destructive',
      });
    }
  };

  // Render email step
  const renderEmailStep = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
            disabled={checkingEmail}
          />
        </div>
      </div>
      
      <Button 
        type="submit"
        className="w-full btn-brand"
        disabled={checkingEmail}
      >
        {checkingEmail ? 'Checking...' : 'Continue'}
      </Button>
    </form>
  );

  // Render login step
  const renderLoginStep = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-foreground">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            value={email}
            disabled
            className="pl-10 bg-secondary border-border text-muted-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-foreground">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAuthStep('email')}
          className="text-sm text-primary hover:text-primary/80"
        >
          ← Use a different email
        </button>
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80"
        >
          Forgot password?
        </button>
      </div>

      <Button 
        type="submit"
        className="w-full btn-brand"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );

  const renderSignupStep = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-foreground">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          disabled
          className="bg-secondary border-border text-muted-foreground"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-foreground">Create Password</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          className="bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAuthStep('email')}
          className="text-sm text-primary hover:text-primary/80"
        >
          ← Use a different email
        </button>
      </div>
      
      <Button
        type="submit"
        className="w-full btn-brand"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Brand/Welcome */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <ClaimEaseLogo className="h-12 w-auto text-white" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Welcome to ClaimEase
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Manage your claims with ease. Our streamlined platform helps you track, organize, and process claims efficiently.
              </p>
            </div>

            <div className="space-y-3 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Track claims in real-time</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Manage documents securely</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Get expert guidance</span>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div>
            <Card className="backdrop-blur-sm bg-card/90 border-border shadow-2xl">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl text-foreground">
                  {authStep === 'email' && 'Get Started'}
                  {authStep === 'login' && 'Welcome Back'}
                  {authStep === 'signup' && 'Create Account'}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {authStep === 'email' && 'Enter your email to continue'}
                  {authStep === 'login' && 'Sign in to your account'}
                  {authStep === 'signup' && 'Create your ClaimEase account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {authStep === 'email' && renderEmailStep()}
                {authStep === 'login' && renderLoginStep()}
                {authStep === 'signup' && renderSignupStep()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <ClaimEaseLogo className="h-12 w-auto" />
              </div>
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
            <Card className="backdrop-blur-sm bg-white/90 border-gray-200 shadow-xl">
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}