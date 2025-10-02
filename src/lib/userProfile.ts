import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  email: string;
  pendingPlan?: 'standard' | 'pro' | null;
  plan?: 'standard' | 'pro' | null;
  paid: boolean;
  paidAt?: Date | null;
  stripeCustomerId?: string | null;
  name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createUserProfile = async (uid: string, email: string, plan?: string): Promise<void> => {
  try {
    const userProfile: UserProfile = {
      email,
      pendingPlan: plan === 'standard' || plan === 'pro' ? plan : null,
      paid: false,
      paidAt: null,
      stripeCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', uid), userProfile);
    console.log('User profile created successfully');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(doc(db, 'users', uid), updatesWithTimestamp);
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const setPendingPlan = async (uid: string, plan: 'standard' | 'pro'): Promise<void> => {
  await updateUserProfile(uid, { pendingPlan: plan });
};

export const markUserAsPaid = async (uid: string, plan: 'standard' | 'pro', stripeCustomerId: string): Promise<void> => {
  await updateUserProfile(uid, {
    plan,
    pendingPlan: null,
    paid: true,
    paidAt: new Date(),
    stripeCustomerId,
  });
};

export const checkUserPaidStatus = async (uid: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(uid);
    return profile?.paid === true;
  } catch (error) {
    console.error('Error checking paid status:', error);
    return false;
  }
};

export const getUserPlan = async (uid: string): Promise<'standard' | 'pro' | null> => {
  try {
    const profile = await getUserProfile(uid);
    return profile?.plan || null;
  } catch (error) {
    console.error('Error getting user plan:', error);
    return null;
  }
};

export const getPendingPlan = async (uid: string): Promise<'standard' | 'pro' | null> => {
  try {
    const profile = await getUserProfile(uid);
    return profile?.pendingPlan || null;
  } catch (error) {
    console.error('Error getting pending plan:', error);
    return null;
  }
};