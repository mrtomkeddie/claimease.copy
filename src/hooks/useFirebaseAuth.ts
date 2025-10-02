import { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/contexts/UserContext';
import { UserTier } from '@/lib/constants';

export function useFirebaseAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode (no valid Firebase config)
    const isDemo = process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'demo-key' || 
                   !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    setIsDemoMode(isDemo);

    if (isDemo) {
      console.log('Running in demo mode - Firebase not configured');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          console.log('User data:', userDoc.data());
        }
      } else {
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      
      if (isDemoMode) {
        // Demo mode - create mock user
        console.log('Demo sign in with:', email);
        return {
          id: 'demo-user-id',
          name: email.split('@')[0],
          email: email,
          tier: UserTier.STANDARD,
          claims_used: 0,
          claims_remaining: 1,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          pip_focus: ['PIP (Personal Independence Payment)'],
          created_at: new Date().toISOString(),
        } as User;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: userCredential.user.uid,
          name: userData.name || email.split('@')[0],
          email: userData.email || email,
          tier: userData.tier || UserTier.STANDARD,
          claims_used: userData.claims_used || 0,
          claims_remaining: userData.claims_remaining || 1,
          timezone: userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          pip_focus: userData.pip_focus || ['PIP (Personal Independence Payment)'],
          created_at: userData.created_at?.toDate()?.toISOString() || new Date().toISOString(),
        } as User;
      }
      
      // If user doesn't exist in Firestore, return basic user data
      return {
        id: userCredential.user.uid,
        name: email.split('@')[0],
        email: email,
        tier: UserTier.STANDARD,
        claims_used: 0,
        claims_remaining: 1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        pip_focus: ['PIP (Personal Independence Payment)'],
        created_at: new Date().toISOString(),
      } as User;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, name: string, tier: UserTier = UserTier.STANDARD) => {
    try {
      setError(null);
      
      if (isDemoMode) {
        // Demo mode - create mock user
        console.log('Demo sign up with:', email, name, tier);
        return {
          id: 'demo-user-id',
          name: name,
          email: email,
          tier: tier,
          claims_used: 0,
          claims_remaining: tier === UserTier.PRO ? -1 : 1,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          pip_focus: ['PIP (Personal Independence Payment)'],
          created_at: new Date().toISOString(),
        } as User;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      const userData = {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        tier: tier,
        claims_used: 0,
        claims_remaining: tier === UserTier.PRO ? -1 : 1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        pip_focus: ['PIP (Personal Independence Payment)'],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      return {
        id: userCredential.user.uid,
        name: name,
        email: email,
        tier: tier,
        claims_used: 0,
        claims_remaining: tier === UserTier.PRO ? -1 : 1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        pip_focus: ['PIP (Personal Independence Payment)'],
        created_at: new Date().toISOString(),
      } as User;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      if (isDemoMode) {
        setFirebaseUser(null);
        return;
      }
      
      await firebaseSignOut(auth);
      setFirebaseUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    firebaseUser,
    loading,
    error,
    isDemoMode,
    signIn,
    signUp,
    signOut,
  };
}