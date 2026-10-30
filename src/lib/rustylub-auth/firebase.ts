import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

export const rustylubAuth = getAuth(app);
