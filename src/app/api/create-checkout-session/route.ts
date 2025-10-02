import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';
import { getAuth as getClientAuth } from 'firebase/auth';

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

    // Verify the user is authenticated
    try {
      let user;
      if (adminDb) {
        // Use Firebase Admin if available
        user = await getAuth().getUser(userId);
      } else {
        // Fallback to client SDK for development
        // In a real app, you'd want to verify the ID token
        return NextResponse.json(
          { error: 'Admin SDK not available' },
          { status: 503 }
        );
      }
      
      if (!user || user.email !== email) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user already has a Stripe customer ID
    let customerId;
    
    if (adminDb) {
      const userDoc = await adminDb.collection('users').doc(userId).get();
      const userData = userDoc.data();
      customerId = userData?.stripeCustomerId;

      // Create Stripe customer if they don't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: email,
          metadata: {
            firebaseUid: userId,
          },
        });
        customerId = customer.id;

        // Save customer ID to user profile
        await adminDb.collection('users').doc(userId).update({
          stripeCustomerId: customerId,
          updatedAt: new Date(),
        });
      }
    } else {
      // If admin SDK not available, create customer without saving to Firestore
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          firebaseUid: userId,
        },
      });
      customerId = customer.id;
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