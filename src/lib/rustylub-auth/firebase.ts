import { initializeApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence
} from 'firebase/auth';

const config = {
  apiKey: 'AIzaSyAdWMYqPO1mgx2h2DO3Iw8XZxEyZJQitO0',
  authDomain: 'rustylub.firebaseapp.com',
  projectId: 'rustylub',
  storageBucket: 'rustylub.firebasestorage.app',
  messagingSenderId: '835038801032',
  appId: '1:835038801032:web:643113413df82f7af9033d',
  measurementId: 'G-X4W9S6S0LH'
};

const app = getApps().find((item) => item.name === 'rustylub-auth')
  || initializeApp(config, 'rustylub-auth');

/**
 * This application only uses Firebase Email/Password authentication.
 * Do not install the popup/redirect resolver: its default browser
 * implementation loads Google's cross-origin iframe (gapi.iframes),
 * which can fail under strict tracking protection / third-party storage
 * restrictions and surface as auth/internal-error during startup.
 *
 * IndexedDB is preferred for durable sessions; localStorage is the
 * fallback for browsers where IndexedDB persistence is unavailable.
 */
export const rustylubAuth = (() => {
  try {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence]
    });
  } catch (error) {
    // Vite HMR or another module may have initialized this named app's Auth.
    // Reuse that instance rather than attempting a second initialization.
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('already been initialized') || message.includes('already exists')) {
      throw error;
    }
    throw error;
  }
})();
