import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Test endpoint to verify webhook functionality
export async function POST(request: NextRequest) {
  try {
    const { userId, plan, testType } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'Missing userId or plan' },
        { status: 400 }
      );
    }

    let userData;

    // Test different webhook scenarios
    switch (testType) {
      case 'checkout_completed':
        // Simulate successful checkout
        await adminDb.collection('users').doc(userId).update({
          paid: true,
          plan: plan,
          stripeCustomerId: 'test_customer_123',
          stripeSubscriptionId: 'test_subscription_123',
          paidAt: new Date(),
          pendingPlan: null,
          updatedAt: new Date(),
        });
        break;

      case 'subscription_updated':
        // Simulate subscription update
        await adminDb.collection('users').doc(userId).update({
          subscriptionStatus: 'active',
          updatedAt: new Date(),
        });
        break;

      case 'subscription_cancelled':
        // Simulate subscription cancellation
        await adminDb.collection('users').doc(userId).update({
          paid: false,
          plan: null,
          subscriptionStatus: 'cancelled',
          cancelledAt: new Date(),
          updatedAt: new Date(),
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid test type' },
          { status: 400 }
        );
    }

    // Get updated user data
    const userDoc = await adminDb.collection('users').doc(userId).get();
    userData = userDoc.data();

    return NextResponse.json({
      success: true,
      message: `Webhook test ${testType} completed successfully`,
      userData: userData,
    });

  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Test webhook failed', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check user status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 503 }
      );
    }

    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      paid: userData.paid || false,
      plan: userData.plan || null,
      subscriptionStatus: userData.subscriptionStatus || null,
      stripeCustomerId: userData.stripeCustomerId || null,
      stripeSubscriptionId: userData.stripeSubscriptionId || null,
      paidAt: userData.paidAt || null,
      pendingPlan: userData.pendingPlan || null,
      userData: userData,
    });

  } catch (error) {
    console.error('Test webhook GET error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user data' },
      { status: 500 }
    );
  }
}