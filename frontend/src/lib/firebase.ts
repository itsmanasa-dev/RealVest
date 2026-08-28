import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Checks whether all required Firebase credentials are provided in the environment.
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

// Singleton initialization
let app: FirebaseApp;
if (!getApps().length) {
  // If keys are missing in development, provide dummy fallbacks during build/init to prevent crash
  app = initializeApp(
    isFirebaseConfigured()
      ? firebaseConfig
      : {
          apiKey: 'AIzaSyMockKeyForInitializationDuringBuild',
          authDomain: 'realvest-auth.firebaseapp.com',
          projectId: 'realvest-auth',
          storageBucket: 'realvest-auth.appspot.com',
          messagingSenderId: '100000000000',
          appId: '1:100000000000:web:mockappid123456',
        }
  );
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export { app };
export default auth;
