import crypto from 'crypto';
import axios from 'axios';
import type { Express } from 'express';
import { adminDb } from '../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const digest = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
const emailId = (email: string) => digest(email.toLowerCase());
const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
const passwordHash = (password: string, salt = crypto.randomBytes(16).toString('hex')) => ({
  salt, hash: crypto.scryptSync(password, salt, 64).toString('hex')
});
const passwordMatches = (password: string, salt: string, hash: string) => {
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};

export function registerEmailAuthRoutes(app: Express) {
  app.post('/api/auth/email/send-code', async (req: any, res: any) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      if (!validEmail(email)) return res.status(400).json({ message: 'Введите корректный email.' });
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) return res.status(503).json({ message: 'Отправка почты не настроена на сервере.' });
      const ref = adminDb.collection('email_verification').doc(emailId(email));
      const snap = await ref.get();
      const old = snap.exists ? snap.data() : {};
      const now = Date.now();
      if (old?.lastSentAt && now - old.lastSentAt < 60_000) return res.status(429).json({ message: 'Повторный запрос доступен через минуту.' });
      const hourStart = old?.hourStartedAt && now - old.hourStartedAt < 3_600_000 ? old.hourStartedAt : now;
      const sent = hourStart === old?.hourStartedAt ? (old?.sentInHour || 0) : 0;
      if (sent >= 5) return res.status(429).json({ message: 'Слишком много запросов. Попробуйте позже.' });
      const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
      await axios.post('https://api.resend.com/emails', {
        from: process.env.RESEND_FROM_EMAIL || 'Rusty.Lub <noreply@rusty-lub.ru>',
        to: [email], subject: 'Код подтверждения Rusty.Lub',
        html: '<div style="font-family:Arial;background:#0d1016;color:#fff;padding:28px"><h2>Подтверждение email</h2><p>Ваш код Rusty.Lub:</p><strong style="font-size:32px;letter-spacing:8px;color:#fb923c">' + code + '</strong><p>Код действует 10 минут.</p></div>'
      }, { headers: { Authorization: 'Bearer ' + apiKey }, timeout: 12000 });
      await ref.set({ email, codeHash: digest(email + ':' + code), expiresAt: now + 600000, attempts: 0, lastSentAt: now, hourStartedAt: hourStart, sentInHour: sent + 1, verifiedAt: null });
      return res.json({ success: true, message: 'Код отправлен на вашу почту.' });
    } catch (error: any) {
      console.error('Email code send failed:', error?.response?.data || error?.message);
      return res.status(502).json({ message: 'Не удалось отправить письмо. Попробуйте позже.' });
    }
  });

  app.post('/api/auth/email/verify-code', async (req: any, res: any) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      const code = String(req.body?.code || '').trim();
      if (!validEmail(email) || !/^\d{6}$/.test(code)) return res.status(400).json({ message: 'Проверьте email и шестизначный код.' });
      const ref = adminDb.collection('email_verification').doc(emailId(email));
      let message = '';
      await adminDb.runTransaction(async (tx: any) => {
        const snap = await tx.get(ref);
        const data = snap.exists ? snap.data() : null;
        if (!data || data.expiresAt < Date.now()) { message = 'Код истёк. Запросите новый.'; return; }
        if ((data.attempts || 0) >= 5) { message = 'Слишком много попыток. Запросите новый код.'; return; }
        if (data.codeHash !== digest(email + ':' + code)) {
          tx.update(ref, { attempts: (data.attempts || 0) + 1 }); message = 'Неверный код.'; return;
        }
        tx.update(ref, { verifiedAt: Date.now(), codeHash: null });
      });
      if (message) return res.status(400).json({ message });
      return res.json({ success: true, message: 'Email подтверждён.' });
    } catch (error) {
      console.error('Email code verify failed:', error);
      return res.status(500).json({ message: 'Не удалось проверить код.' });
    }
  });

  app.post('/api/auth/register', async (req: any, res: any) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      const username = String(req.body?.username || '').trim().toLowerCase();
      const password = String(req.body?.password || '');
      const displayName = String(req.body?.displayName || '').trim();
      if (!validEmail(email)) return res.status(400).json({ message: 'Введите корректный email.' });
      if (!/^[a-z0-9_-]{3,20}$/.test(username) || username === 'serustqs') return res.status(400).json({ message: 'Логин недопустим или зарезервирован.' });
      if (password.length < 8 || password.length > 128) return res.status(400).json({ message: 'Пароль должен содержать не менее 8 символов.' });
      if (!displayName || displayName.length > 40) return res.status(400).json({ message: 'Никнейм должен содержать до 40 символов.' });
      const vRef = adminDb.collection('email_verification').doc(emailId(email));
      const userRef = adminDb.collection('chat_users').doc(username);
      const mailRef = adminDb.collection('chat_user_emails').doc(emailId(email));
      const p = passwordHash(password);
      let message = '';
      await adminDb.runTransaction(async (tx: any) => {
        const vSnap = await tx.get(vRef);
        const uSnap = await tx.get(userRef);
        const eSnap = await tx.get(mailRef);
        const v = vSnap.exists ? vSnap.data() : null;
        if (!v?.verifiedAt || Date.now() - v.verifiedAt > 30 * 60000) { message = 'Сначала подтвердите email. Подтверждение действует 30 минут.'; return; }
        if (uSnap.exists) { message = 'Этот логин уже занят.'; return; }
        if (eSnap.exists) { message = 'Этот email уже используется.'; return; }
        const avatarClass = String(req.body?.avatarClass || 'whiteout');
        const photoURL = String(req.body?.photoURL || '');
        const gender = req.body?.gender === 'female' ? 'female' : 'male';
        tx.set(userRef, { username, email, passwordHash: p.hash, passwordSalt: p.salt, displayName, avatarClass, photoURL, gender, role: 'user', isBlocked: false, emailVerified: true, createdAt: new Date().toISOString() });
        tx.set(mailRef, { username, email, createdAt: Date.now() });
        tx.delete(vRef);
      });
      if (message) return res.status(400).json({ message });
      return res.json({ success: true, user: { uid: username, displayName, email, photoURL: String(req.body?.photoURL || ''), avatarClass: String(req.body?.avatarClass || 'whiteout'), role: 'user' } });
    } catch (error) {
      console.error('Account registration failed:', error);
      return res.status(500).json({ message: 'Не удалось создать аккаунт.' });
    }
  });

  app.post('/api/auth/login', async (req: any, res: any) => {
    try {
      const username = String(req.body?.username || '').trim().toLowerCase();
      const password = String(req.body?.password || '');
      if (!/^[a-z0-9_-]{3,20}$/.test(username) || !password) return res.status(400).json({ message: 'Неверный логин или пароль.' });
      const ref = adminDb.collection('chat_users').doc(username);
      const snap = await ref.get();
      if (!snap.exists) return res.status(401).json({ message: 'Неверный логин или пароль.' });
      const data = snap.data() || {};
      const valid = data.passwordHash && data.passwordSalt ? passwordMatches(password, data.passwordSalt, data.passwordHash) : data.password === password;
      if (!valid) return res.status(401).json({ message: 'Неверный логин или пароль.' });
      if (data.isBlocked) return res.status(403).json({ message: 'Аккаунт заблокирован.' });
      if (!data.passwordHash) {
        const p = passwordHash(password);
        await ref.update({ passwordHash: p.hash, passwordSalt: p.salt, password: FieldValue.delete() });
      }
      return res.json({ success: true, user: { uid: username, displayName: data.displayName || username, email: data.email || '', photoURL: data.photoURL || '', avatarClass: data.avatarClass || 'whiteout', role: data.role || 'user' } });
    } catch (error) {
      console.error('Account login failed:', error);
      return res.status(500).json({ message: 'Не удалось выполнить вход.' });
    }
  });
}
