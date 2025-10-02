import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let adminAuth: any = null;
let adminDb: any = null;

try {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  if (!getApps().length && serviceAccount.private_key) {
    const app = initializeApp({
      credential: cert(serviceAccount as any),
    });
    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
  } else if (getApps().length) {
    const app = getApps()[0];
    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase Admin initialization failed:', error);
  // Fallback to client SDK for development
  adminAuth = null;
  adminDb = null;
}

export { adminAuth, adminDb };