'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserTier, UserTierType, CLAIM_LIMITS } from '@/lib/constants';
import { supabase } from '@/lib/supabaseClient';
import { getUserProfile, updateUserProfile, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from '@/lib/supabase-auth';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;
  pip_focus: string[];
  created_at: string;
  tier: UserTierType;
  claims_used: number;
  claims_remaining: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  canCreateClaim: () => boolean;
  incrementClaimCount: () => void;
  getRemainingClaims: () => number;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string, tier?: UserTierType) => Promise<User>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name || '',
              email: profile.email,
              timezone: 'UTC',
              pip_focus: [],
              created_at: profile.created_at,
              tier: profile.tier,
              claims_used: profile.claims_used,
              claims_remaining: profile.claims_remaining,
            });
          }
        }
      } catch (err) {
        console.error('Error initializing user:', err);
        setError('Failed to initialize user');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name || '',
            email: profile.email,
            timezone: 'UTC',
            pip_focus: [],
            created_at: profile.created_at,
            tier: profile.tier,
            claims_used: profile.claims_used,
            claims_remaining: profile.claims_remaining,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const canCreateClaim = (): boolean => {
    if (!user) return false;
    if (user.tier === UserTier.PRO) return true;
    return user.claims_used < CLAIM_LIMITS[user.tier];
  };

  const incrementClaimCount = async (): Promise<void> => {
    if (!user) return;

    const newClaimsUsed = user.claims_used + 1;
    const newClaimsRemaining = user.tier === UserTier.PRO
      ? -1
      : Math.max(0, CLAIM_LIMITS[user.tier] - newClaimsUsed);

    const updatedUser = {
      ...user,
      claims_used: newClaimsUsed,
      claims_remaining: newClaimsRemaining
    };

    setUser(updatedUser);

    try {
      await updateUserProfile(user.id, {
        claims_used: newClaimsUsed,
        claims_remaining: newClaimsRemaining,
      });
    } catch (error) {
      console.error('Error updating claim count:', error);
    }
  };

  const getRemainingClaims = (): number => {
    if (!user) return 0;
    if (user.tier === UserTier.PRO) return -1;
    return Math.max(0, CLAIM_LIMITS[user.tier] - user.claims_used);
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const { user: authUser } = await supabaseSignIn(email, password);
      const profile = await getUserProfile(authUser.id);

      if (!profile) {
        throw new Error('User profile not found');
      }

      const userData: User = {
        id: profile.id,
        name: profile.name || '',
        email: profile.email,
        timezone: 'UTC',
        pip_focus: [],
        created_at: profile.created_at,
        tier: profile.tier,
        claims_used: profile.claims_used,
        claims_remaining: profile.claims_remaining,
      };

      setUser(userData);
      return userData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, name: string, tier: UserTierType = UserTier.STANDARD): Promise<User> => {
    try {
      const { user: authUser } = await supabaseSignUp(email, password, name);
      const profile = await getUserProfile(authUser.id);

      if (!profile) {
        throw new Error('User profile not found');
      }

      const userData: User = {
        id: profile.id,
        name: profile.name || '',
        email: profile.email,
        timezone: 'UTC',
        pip_focus: [],
        created_at: profile.created_at,
        tier: profile.tier,
        claims_used: profile.claims_used,
        claims_remaining: profile.claims_remaining,
      };

      setUser(userData);
      return userData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabaseSignOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      canCreateClaim,
      incrementClaimCount,
      getRemainingClaims,
      loading,
      error,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
