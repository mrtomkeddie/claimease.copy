import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getUserProfile, updateUserProfile } from '@/lib/supabase-auth';
import Stripe from 'stripe';

// Initialize Stripe
let stripe: Stripe | null = null;
let PLAN_PRICE_IDS: { [key: string]: string } = {};

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
    
    PLAN_PRICE_IDS = {
      standard: process.env.STRIPE_STANDARD_PRICE_ID || '',
      pro: process.env.STRIPE_PRO_PRICE_ID || '',
    };
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { userId, plan, email } = body;

    // Validate input
    if (!userId || !plan || !email) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
    );
    }

    // Validate plan
    if (!PLAN_PRICE_IDS[plan as keyof typeof PLAN_PRICE_IDS]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const userProfile = await getUserProfile(userId);

    if (!userProfile || userProfile.email !== email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let customerId = userProfile.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;

      await updateUserProfile(userId, {
        stripe_customer_id: customerId,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLAN_PRICE_IDS[plan as keyof typeof PLAN_PRICE_IDS],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?plan=${plan}`,
      metadata: {
        userId: userId,
        plan: plan,
      },
      // Collect customer name
      customer_update: {
        name: 'auto',
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: plan,
        },
      },
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}