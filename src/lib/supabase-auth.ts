import { supabase } from './supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  tier: 'standard' | 'pro';
  claims_used: number;
  claims_remaining: number;
  stripe_customer_id: string | null;
  pending_plan: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function signUp(email: string, password: string, name?: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('No user returned from sign up');

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user.id,
        email: authData.user.email!,
        name: name || null,
        tier: 'standard',
        claims_used: 0,
        claims_remaining: 1,
      },
    ])
    .select()
    .single();

  if (profileError) throw profileError;

  return { user: authData.user, profile };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function setPendingPlan(userId: string, plan: 'standard' | 'pro') {
  return updateUserProfile(userId, { pending_plan: plan });
}

export async function checkUserPaidStatus(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.paid_at !== null;
}

export async function markUserAsPaid(userId: string, plan: 'standard' | 'pro', stripeCustomerId?: string) {
  const updates: Partial<UserProfile> = {
    tier: plan,
    paid_at: new Date().toISOString(),
    pending_plan: null,
  };

  if (stripeCustomerId) {
    updates.stripe_customer_id = stripeCustomerId;
  }

  if (plan === 'standard') {
    updates.claims_remaining = 1;
  } else {
    updates.claims_remaining = -1;
  }

  return updateUserProfile(userId, updates);
}

export async function getUserPlan(userId: string): Promise<'standard' | 'pro' | null> {
  const profile = await getUserProfile(userId);
  return profile?.tier || null;
}
