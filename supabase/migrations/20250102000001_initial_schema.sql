/*
  # ClaimEase Initial Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `name` (text)
      - `tier` (text, default 'standard') - 'standard' or 'pro'
      - `claims_used` (integer, default 0)
      - `claims_remaining` (integer, default 1)
      - `stripe_customer_id` (text)
      - `stripe_subscription_id` (text)
      - `pending_plan` (text) - Plan selected before payment
      - `paid_at` (timestamptz)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `claims`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `title` (text, not null)
      - `status` (text, default 'draft') - 'draft', 'completed', 'submitted'
      - `form_data` (jsonb) - Stores all claim form data
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `stripe_payment_intent_id` (text, unique, not null)
      - `stripe_session_id` (text)
      - `amount` (integer, not null) - Amount in cents
      - `currency` (text, default 'gbp')
      - `plan` (text, not null) - 'standard' or 'pro'
      - `status` (text, default 'pending') - 'pending', 'completed', 'failed', 'refunded'
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  tier text DEFAULT 'standard' CHECK (tier IN ('standard', 'pro')),
  claims_used integer DEFAULT 0,
  claims_remaining integer DEFAULT 1,
  stripe_customer_id text,
  stripe_subscription_id text,
  pending_plan text CHECK (pending_plan IN ('standard', 'pro')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Claim',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'submitted')),
  form_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id text UNIQUE NOT NULL,
  stripe_session_id text,
  amount integer NOT NULL,
  currency text DEFAULT 'gbp',
  plan text NOT NULL CHECK (plan IN ('standard', 'pro')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for claims table
CREATE POLICY "Users can view own claims"
  ON claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own claims"
  ON claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own claims"
  ON claims FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own claims"
  ON claims FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for payments table
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_claims_updated_at ON claims;
CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
