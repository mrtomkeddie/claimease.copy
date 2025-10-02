import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { setPendingPlan } from '@/lib/supabase-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, plan, userId } = await request.json();

    if (!plan || !userId) {
      return NextResponse.json(
        { error: 'User ID and plan are required' },
        { status: 400 }
      );
    }

    if (!['standard', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be standard or pro' },
        { status: 400 }
      );
    }

    await setPendingPlan(userId, plan as 'standard' | 'pro');

    return NextResponse.json({
      success: true,
      message: 'Pending plan saved successfully'
    });

  } catch (error) {
    console.error('Pre-registration error:', error);
    return NextResponse.json(
      { error: 'Failed to save pending plan' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID parameter is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .select('pending_plan')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        plan: data.pending_plan,
      }
    });

  } catch (error) {
    console.error('Get pending plan error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve pending plan' },
      { status: 500 }
    );
  }
}