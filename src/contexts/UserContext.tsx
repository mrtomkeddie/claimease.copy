'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserTier, UserTierType, CLAIM_LIMITS } from '@/lib/constants';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  const { firebaseUser, loading, error, signIn: firebaseSignIn, signUp: firebaseSignUp, signOut: firebaseSignOut } = useFirebaseAuth();

  useEffect(() => {
    if (firebaseUser) {
      // User is authenticated with Firebase, but we need to sync with our local user state
      // This will be handled by the signIn/signUp functions
    } else {
      setUser(null);
    }
  }, [firebaseUser]);

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

    // Update in Firestore
    if (user.id) {
      try {
        await updateDoc(doc(db, 'users', user.id), {
          claims_used: newClaimsUsed,
          claims_remaining: newClaimsRemaining,
          updated_at: new Date()
        });
      } catch (error) {
        console.error('Error updating claim count:', error);
      }
    }
  };

  const getRemainingClaims = (): number => {
    if (!user) return 0;
    if (user.tier === UserTier.PRO) return -1;
    return Math.max(0, CLAIM_LIMITS[user.tier] - user.claims_used);
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const userData = await firebaseSignIn(email, password);
    setUser(userData);
    return userData;
  };

  const signUp = async (email: string, password: string, name: string, tier: UserTierType = UserTier.STANDARD): Promise<User> => {
    const userData = await firebaseSignUp(email, password, name, tier);
    setUser(userData);
    return userData;
  };

  const signOut = async (): Promise<void> => {
    await firebaseSignOut();
    setUser(null);
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