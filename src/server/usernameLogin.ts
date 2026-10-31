import type { Express } from 'express';
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'rustylub';
const DATABASE_ID = 'ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59';
const WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || 'AIzaSyAdWMYqPO1mgx2h2DO3Iw8XZxEyZJQitO0';

function services() {
  const app = getApps().find((item) => item.name === 'rustylub-username-auth')
    || initializeApp({
      credential: applicationDefault(),
      projectId: PROJECT_ID
    }, 'rustylub-username-auth');

  return {
    auth: getAuth(app),
    db: getFirestore(app, DATABASE_ID)
  };
}

export function registerUsernameLoginRoute(app: Express) {
  app.post('/api/auth/login', async (req: any, res: any) => {
    res.set('Cache-Control', 'no-store');
    try {
      const username = String(req.body?.login || '').trim().toLowerCase();
      const password = typeof req.body?.password === 'string' ? req.body.password : '';

      if (!/^[a-z0-9._-]{3,32}$/.test(username) || password.length < 1 || password.length > 128) {
        return res.status(400).json({ message: 'Введите логин и пароль.' });
      }

      const { auth, db } = services();
      const usernameSnap = await db.collection('usernames').doc(username).get();
      if (!usernameSnap.exists) {
        return res.status(401).json({ message: 'Неверный логин или пароль.' });
      }

      const uid = String(usernameSnap.data()?.uid || '');
      if (!uid) return res.status(401).json({ message: 'Неверный логин или пароль.' });

      const profileSnap = await db.collection('Users').doc(uid).get();
      if (!profileSnap.exists) return res.status(401).json({ message: 'Неверный логин или пароль.' });

      const profile = profileSnap.data() || {};
      if (profile.uid !== uid || String(profile.normalizedLogin || '').toLowerCase() !== username || profile.status !== 'active') {
        return res.status(403).json({ message: 'Аккаунт недоступен. Обратитесь к администрации.' });
      }

      const authUser = await auth.getUser(uid);
      if (!authUser.email) return res.status(401).json({ message: 'Неверный логин или пароль.' });

      const signInResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(WEB_API_KEY)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authUser.email,
            password,
            returnSecureToken: true
          })
        }
      );

      if (!signInResponse.ok) {
        // Do not disclose whether the username, email, or password was incorrect.
        return res.status(401).json({ message: 'Неверный логин или пароль.' });
      }

      const tokenResult = await signInResponse.json() as { localId?: string };
      if (tokenResult.localId !== uid) {
        return res.status(401).json({ message: 'Неверный логин или пароль.' });
      }

      const customToken = await auth.createCustomToken(uid);
      return res.status(200).json({ customToken });
    } catch (error) {
      console.error('[RustyLub username auth] Login failed:', error instanceof Error ? error.message : 'unknown');
      return res.status(503).json({ message: 'Авторизация временно недоступна. Попробуйте позже.' });
    }
  });
}
