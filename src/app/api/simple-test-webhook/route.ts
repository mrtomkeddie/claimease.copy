import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint that doesn't require Firebase Admin
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

    // Return mock data for testing
    return NextResponse.json({
      success: true,
      message: 'Webhook test endpoint is working',
      userId,
      mockData: {
        paid: true,
        plan: 'pro',
        subscriptionStatus: 'active',
        stripeCustomerId: 'cus_test_123',
        stripeSubscriptionId: 'sub_test_123',
      },
      note: 'This is a mock response. In production, this would query Firebase.',
    });

  } catch (error) {
    console.error('Simple test webhook error:', error);
    return NextResponse.json(
      { error: 'Simple test webhook failed', details: error.message },
      { status: 500 }
    );
  }
}

// Simple POST endpoint for testing
export async function POST(request: NextRequest) {
  try {
    const { userId, plan, testType } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'Missing userId or plan' },
        { status: 400 }
      );
    }

    // Return mock response for different test types
    const responses = {
      checkout_completed: {
        message: 'Mock checkout completed',
        userData: {
          paid: true,
          plan: plan,
          stripeCustomerId: 'cus_test_123',
          stripeSubscriptionId: 'sub_test_123',
          paidAt: new Date().toISOString(),
          pendingPlan: null,
        },
      },
      subscription_updated: {
        message: 'Mock subscription updated',
        userData: {
          subscriptionStatus: 'active',
          updatedAt: new Date().toISOString(),
        },
      },
      subscription_cancelled: {
        message: 'Mock subscription cancelled',
        userData: {
          paid: false,
          plan: null,
          subscriptionStatus: 'cancelled',
          cancelledAt: new Date().toISOString(),
        },
      },
    };

    const response = responses[testType] || {
      message: 'Unknown test type',
      userData: { userId, plan },
    };

    return NextResponse.json({
      success: true,
      testType,
      ...response,
      note: 'This is a mock response for testing webhook functionality.',
    });

  } catch (error) {
    console.error('Simple test webhook error:', error);
    return NextResponse.json(
      { error: 'Simple test webhook failed', details: error.message },
      { status: 500 }
    );
  }
}