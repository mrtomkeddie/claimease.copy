import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';

// Initialize Stripe
let stripe: Stripe | null = null;
let endpointSecret: string = '';

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
    endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  }
} catch (error) {
  console.error('Failed to initialize Stripe webhook:', error);
}

export async function POST(request: NextRequest) {
  // Check if Stripe is initialized
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      console.error('Missing userId or plan in session metadata');
      return;
    }

    if (!adminDb) {
      console.error('Firebase Admin not available');
      return;
    }

    // Get customer details
    const customer = await stripe.customers.retrieve(session.customer as string);
    const customerEmail = (customer as Stripe.Customer).email;
    const customerName = (customer as Stripe.Customer).name;

    // Update user profile in Firestore
    const userRef = adminDb.collection('users').doc(userId);
    
    await userRef.update({
      paid: true,
      plan: plan,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      paidAt: new Date(),
      updatedAt: new Date(),
      // Update name if available from Stripe
      ...(customerName && { name: customerName }),
      // Clear pending plan
      pendingPlan: null,
    });

    // Log successful payment
    console.log(`User ${userId} (${customerEmail}) successfully subscribed to ${plan} plan`);

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;
    
    if (!userId) {
      console.error('Missing userId in subscription metadata');
      return;
    }

    if (!adminDb) {
      console.error('Firebase Admin not available');
      return;
    }

    // Update subscription status
    const userRef = adminDb.collection('users').doc(userId);
    
    await userRef.update({
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      updatedAt: new Date(),
    });

    console.log(`Subscription updated for user ${userId}: ${subscription.status}`);

  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;
    
    if (!userId) {
      console.error('Missing userId in subscription metadata');
      return;
    }

    if (!adminDb) {
      console.error('Firebase Admin not available');
      return;
    }

    // Mark user as not paid
    const userRef = adminDb.collection('users').doc(userId);
    
    await userRef.update({
      paid: false,
      plan: null,
      subscriptionStatus: 'cancelled',
      cancelledAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Subscription cancelled for user ${userId}`);

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}