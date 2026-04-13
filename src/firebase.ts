import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  sendSignInLinkToEmail 
} from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Use the local config file as the source of truth.
const config = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
};

const databaseId = firebaseConfig.firestoreDatabaseId;

console.log("Initializing Firebase with Project ID:", config.projectId);

const app = initializeApp(config);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, databaseId);
export const auth = getAuth(app);

export { isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail };

// Test connection to Firestore
async function testConnection() {
  try {
    const docRef = doc(db, '_connection_test_', 'test');
    await getDocFromServer(docRef);
    console.log("[Firebase] Firestore connection successful");
  } catch (error: any) {
    if (error.message && error.message.includes('the client is offline')) {
      console.error("[Firebase] Firestore connection failed: the client is offline. Please check your Firebase configuration.");
    }
  }
}

testConnection();
