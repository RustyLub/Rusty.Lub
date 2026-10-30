import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  reload,
  type User
} from 'firebase/auth';
import { rustylubAuth } from '../lib/rustylub-auth/firebase';

const PROFILE_API = '/api/rustylub-auth/profile';

async function profileRequest(user: User, method: 'GET' | 'POST', payload?: Record<string, string>) {
  const token = await user.getIdToken(true);
  const response = await fetch(PROFILE_API, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(payload ? { 'Content-Type': 'application/json' } : {})
    },
    ...(payload ? { body: JSON.stringify(payload) } : {})
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Не удалось получить профиль.');
  return data;
}

export async function registerWithEmail(email: string, password: string, username: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(rustylubAuth, email.trim().toLowerCase(), password);
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function resendVerification(user: User) {
  await sendEmailVerification(user);
}

export async function completeVerifiedRegistration(user: User, username: string, displayName: string) {
  await reload(user);
  if (!user.emailVerified) throw new Error('Сначала подтвердите адрес электронной почты по ссылке из письма.');
  return profileRequest(user, 'POST', { username, displayName });
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(rustylubAuth, email.trim().toLowerCase(), password);
  await reload(credential.user);
  if (!credential.user.emailVerified) {
    await signOut(rustylubAuth);
    throw new Error('Подтвердите email по ссылке из письма, затем войдите снова.');
  }
  const result = await profileRequest(credential.user, 'GET');
  return { firebaseUser: credential.user, profile: result.profile };
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(rustylubAuth, email.trim().toLowerCase());
}

export async function logoutFromRustyLub() {
  await signOut(rustylubAuth);
}

export { rustylubAuth };
