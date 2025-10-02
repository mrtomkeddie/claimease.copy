// Test script for Stripe webhook endpoint
const crypto = require('crypto');

// Mock webhook payload
const mockPayload = {
  id: 'evt_test_webhook',
  object: 'event',
  api_version: '2024-11-20.acacia',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_session',
      object: 'checkout.session',
      customer: 'cus_test_customer',
      metadata: {
        userId: 'test_user_123',
        plan: 'standard'
      },
      subscription: 'sub_test_subscription'
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_request',
    idempotency_key: null
  },
  type: 'checkout.session.completed'
};

// Create mock signature (this won't be valid but will test the endpoint structure)
const timestamp = Math.floor(Date.now() / 1000);
const payload = JSON.stringify(mockPayload);
const signature = crypto.createHmac('sha256', 'test_webhook_secret')
  .update(`${timestamp}.${payload}`)
  .digest('hex');

console.log('Mock Webhook Test');
console.log('=================');
console.log('Event Type:', mockPayload.type);
console.log('User ID:', mockPayload.data.object.metadata.userId);
console.log('Plan:', mockPayload.data.object.metadata.plan);
console.log('Signature:', `t=${timestamp},v1=${signature}`);
console.log('');
console.log('To test the webhook endpoint:');
console.log('1. Start your development server: npm run dev');
console.log('2. Use Stripe CLI to forward webhooks:');
console.log('   stripe listen --forward-to localhost:3000/api/stripe/webhook');
console.log('3. Trigger test events with:');
console.log('   stripe trigger checkout.session.completed');
console.log('');
console.log('Note: You need to set STRIPE_WEBHOOK_SECRET in your .env.local file');