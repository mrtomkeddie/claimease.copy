'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { ClaimEaseLogo } from './ClaimEaseLogo';
import { FooterSlim } from './FooterSlim';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { poppins, gilroyHeavy } from '@/lib/fonts';
import { useRouter } from 'next/navigation';

export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signIn, loading: authLoading } = useUser();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 md:pb-12 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <ClaimEaseLogo />
        </div>

        {/* Main Content - Two Column Layout */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Brand/Welcome Section */}
              <div className="text-center lg:text-left">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mx-auto lg:mx-0">
                    <Lock className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="space-y-4">
                    <h1 className={`text-3xl lg:text-4xl font-bold text-foreground ${gilroyHeavy.className}`}>
                      Welcome Back
                    </h1>
                    <p className={`text-lg text-muted-foreground ${poppins.className}`}>
                      Sign in to access your ClaimEase dashboard and manage your claims with ease.
                    </p>
                  </div>
                  <div className="hidden lg:block pt-8">
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className={`${poppins.className}`}>Track your claims in real-time</span>
                      </div>
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className={`${poppins.className}`}>Manage documents securely</span>
                      </div>
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className={`${poppins.className}`}>Get instant updates</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Login Form */}
              <div>
                <Card className="w-full glass-effect backdrop-blur-lg border-primary/30">
                  <CardHeader className="text-center space-y-2 pb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                      <Lock className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                    </div>
                    <CardDescription className={`text-muted-foreground ${poppins.className}`}>
                      Sign in to your account
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-6 py-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {(error || authLoading) && (
                        <div className={`p-4 text-sm rounded-md ${
                          error ? 'text-red-600 bg-red-50 border border-red-200' : 'text-blue-600 bg-blue-50 border border-blue-200'
                        }`}>
                          {error || 'Authenticating...'}
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10 h-12 bg-background/50 border-primary/30"
                            required
                            disabled={isSubmitting || authLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10 pr-10 h-12 bg-background/50 border-primary/30"
                            required
                            disabled={isSubmitting || authLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            disabled={isSubmitting || authLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-input" disabled={isSubmitting || authLoading} />
                          <span className="text-muted-foreground">Remember me</span>
                        </label>
                        <a href="#" className="text-primary hover:text-primary/80 font-medium">
                          Forgot password?
                        </a>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || authLoading}
                        className="w-full h-12 btn-brand mt-8"
                      >
                        {isSubmitting || authLoading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>

                    <div className="mt-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <a href="https://www.claimease.co.uk" className="text-primary hover:text-primary/80 font-medium">
                          Sign up here
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <FooterSlim />
      </div>
    </div>
  );
}

export default Login;