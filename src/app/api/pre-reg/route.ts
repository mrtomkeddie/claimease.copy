import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { email, plan } = await request.json();

    if (!email || !plan) {
      return NextResponse.json(
        { error: 'Email and plan are required' },
        { status: 400 }
      );
    }

    if (!['standard', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be standard or pro' },
        { status: 400 }
      );
    }

    // Create a hash of the email for the document ID
    const emailHash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
    
    // Check if pre-registration already exists
    const preRegRef = doc(db, 'pre_reg', emailHash);
    const preRegSnap = await getDoc(preRegRef);

    if (preRegSnap.exists()) {
      // Update existing pre-registration
      await setDoc(preRegRef, {
        email: email.toLowerCase(),
        plan,
        updatedAt: new Date().toISOString(),
        used: false
      });
    } else {
      // Create new pre-registration
      await setDoc(preRegRef, {
        email: email.toLowerCase(),
        plan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        used: false
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Pre-registration saved successfully' 
    });

  } catch (error) {
    console.error('Pre-registration error:', error);
    return NextResponse.json(
      { error: 'Failed to save pre-registration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Create a hash of the email for the document ID
    const emailHash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
    
    // Get pre-registration
    const preRegRef = doc(db, 'pre_reg', emailHash);
    const preRegSnap = await getDoc(preRegRef);

    if (!preRegSnap.exists()) {
      return NextResponse.json(
        { error: 'Pre-registration not found' },
        { status: 404 }
      );
    }

    const preRegData = preRegSnap.data();
    
    return NextResponse.json({ 
      success: true, 
      data: {
        email: preRegData.email,
        plan: preRegData.plan,
        used: preRegData.used,
        createdAt: preRegData.createdAt,
        updatedAt: preRegData.updatedAt
      }
    });

  } catch (error) {
    console.error('Get pre-registration error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve pre-registration' },
      { status: 500 }
    );
  }
}