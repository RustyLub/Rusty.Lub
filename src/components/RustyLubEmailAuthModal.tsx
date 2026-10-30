import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, User, Crosshair, ShieldCheck, KeyRound } from 'lucide-react';
import type { CustomUser } from '../types';
import {
  completeVerifiedRegistration,
  loginWithEmail,
  registerWithEmail,
  requestPasswordReset,
  rustylubAuth
} from '../services/rustylubEmailAuth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  onUserLogin: (user: CustomUser) => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
  onBackToLegacy: () => void;
}

export default function RustyLubEmailAuthModal({ isOpen, onClose, lang, onUserLogin, onToast, onBackToLegacy }: Props) {
  const ru = lang === 'ru';
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === 'reset') {
        if (!email.trim()) throw new Error(ru ? 'Введите email.' : 'Enter your email.');
        await requestPasswordReset(email);
        onToast(ru ? 'Письмо для сброса пароля отправлено.' : 'Password reset email sent.', 'success');
        setMode('login');
        return;
      }

      if (mode === 'register') {
        if (!acceptedTerms) throw new Error(ru ? 'Примите условия использования.' : 'Accept the terms to continue.');
        if (!/^[a-z0-9_-]{3,20}$/i.test(username.trim()) || username.trim().toLowerCase() === 'serustqs') {
          throw new Error(ru ? 'Логин: 3–20 символов. Логин владельца зарезервирован.' : 'Username must be 3–20 characters. The owner username is reserved.');
        }
        if (displayName.trim().length < 2 || displayName.trim().length > 40) {
          throw new Error(ru ? 'Никнейм должен содержать 2–40 символов.' : 'Nickname must contain 2–40 characters.');
        }
        if (password.length < 8 || password.length > 128 || password !== confirmPassword) {
          throw new Error(ru ? 'Проверьте пароль: минимум 8 символов, оба поля должны совпадать.' : 'Check your password: at least 8 characters and both fields must match.');
        }
        if (!verificationPending) {
          await registerWithEmail(email, password, username, displayName);
          setVerificationPending(true);
          onToast(ru ? 'Письмо подтверждения отправлено. Откройте его, затем вернитесь сюда.' : 'Verification email sent. Open it, then return here.', 'success');
          return;
        }
        const user = rustylubAuth.currentUser;
        if (!user) throw new Error(ru ? 'Сессия регистрации не найдена. Начните регистрацию заново.' : 'Registration session not found. Please register again.');
        const result = await completeVerifiedRegistration(user, username, displayName);
        const profile = result.profile;
        onUserLogin({
          uid: profile.uid,
          displayName: profile.displayName,
          email: profile.email,
          photoURL: '',
          role: 'user'
        } as CustomUser);
        onToast(ru ? 'Email подтверждён, профиль создан.' : 'Email verified and profile created.', 'success');
        onClose();
        return;
      }

      const result = await loginWithEmail(email, password);
      const profile = result.profile;
      onUserLogin({
        uid: profile.uid,
        displayName: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL || '',
        avatarClass: profile.avatarClass || 'whiteout',
        role: profile.role || 'user',
        isVip: Boolean(profile.isVip),
        isChatVip: Boolean(profile.isChatVip),
        vipUntil: profile.vipUntil
      } as CustomUser);
      onToast(ru ? 'Вход выполнен.' : 'Signed in successfully.', 'success');
      onClose();
    } catch (error: any) {
      const code = String(error?.code || '');
      const messages: Record<string, string> = {
        'auth/email-already-in-use': ru ? 'Этот email уже зарегистрирован.' : 'This email is already registered.',
        'auth/invalid-email': ru ? 'Некорректный email.' : 'Invalid email address.',
        'auth/weak-password': ru ? 'Пароль слишком простой.' : 'Password is too weak.',
        'auth/invalid-credential': ru ? 'Неверный email или пароль.' : 'Incorrect email or password.',
        'auth/too-many-requests': ru ? 'Слишком много попыток. Попробуйте позже.' : 'Too many attempts. Try again later.',
        'auth/network-request-failed': ru ? 'Ошибка сети. Проверьте подключение.' : 'Network error. Check your connection.'
      };
      onToast(messages[code] || error?.message || (ru ? 'Не удалось выполнить операцию.' : 'The operation failed.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#090b0f] text-white">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center border-x border-white/10 bg-[#0d1016] px-5 py-12 sm:px-10">
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-transparent" />
        <button type="button" onClick={onClose} className="absolute right-5 top-5 border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:text-white">{ru ? 'Закрыть' : 'Close'}</button>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border border-orange-500/40 bg-orange-500/10 text-orange-400"><ShieldCheck size={22} /></div>
          <div><div className="font-mono text-xs tracking-[.25em] text-orange-400">RUSTY.LUB</div><div className="text-[10px] tracking-widest text-zinc-500">FIREBASE EMAIL AUTH</div></div>
        </div>
        <h2 className="mb-2 text-3xl font-bold">{mode === 'login' ? (ru ? 'Вход по почте' : 'Email sign in') : mode === 'register' ? (ru ? 'Регистрация' : 'Create account') : (ru ? 'Восстановление пароля' : 'Reset password')}</h2>
        <p className="mb-7 text-sm leading-6 text-zinc-400">{ru ? 'Новая авторизация Firebase. Email необходимо подтвердить перед использованием аккаунта.' : 'New Firebase authentication. Verify your email before using your account.'}</p>
        <div className="mb-6 flex border-b border-white/10">
          <button type="button" onClick={() => { setMode('login'); setVerificationPending(false); }} className={`flex-1 border-b-2 py-3 text-sm ${mode === 'login' ? 'border-orange-400 text-orange-300' : 'border-transparent text-zinc-500'}`}>{ru ? 'Вход' : 'Sign in'}</button>
          <button type="button" onClick={() => { setMode('register'); setVerificationPending(false); }} className={`flex-1 border-b-2 py-3 text-sm ${mode === 'register' ? 'border-orange-400 text-orange-300' : 'border-transparent text-zinc-500'}`}>{ru ? 'Регистрация' : 'Register'}</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs text-zinc-300">{ru ? 'Электронная почта' : 'Email'}
            <span className="relative mt-2 block"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input type="email" required maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full border border-[#2a2f3b] bg-[#090b0f] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-orange-500" /></span>
          </label>
          {mode === 'register' && <>
            <label className="block text-xs text-zinc-300">{ru ? 'Логин' : 'Username'}
              <span className="relative mt-2 block"><User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input required minLength={3} maxLength={20} value={username} onChange={e => setUsername(e.target.value)} className="w-full border border-[#2a2f3b] bg-[#090b0f] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-orange-500" /></span>
            </label>
            <label className="block text-xs text-zinc-300">{ru ? 'Никнейм' : 'Display name'}
              <span className="relative mt-2 block"><Crosshair size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input required minLength={2} maxLength={40} value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full border border-[#2a2f3b] bg-[#090b0f] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-orange-500" /></span>
            </label>
          </>}
          {mode !== 'reset' && <label className="block text-xs text-zinc-300">{ru ? 'Пароль' : 'Password'}
            <span className="relative mt-2 block"><Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input type="password" required minLength={mode === 'register' ? 8 : 1} maxLength={128} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-[#2a2f3b] bg-[#090b0f] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-orange-500" /></span>
          </label>}
          {mode === 'register' && <label className="block text-xs text-zinc-300">{ru ? 'Повторите пароль' : 'Confirm password'}
            <span className="relative mt-2 block"><KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border border-[#2a2f3b] bg-[#090b0f] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-orange-500" /></span>
          </label>}
          {mode === 'register' && <label className="flex items-start gap-2 text-xs text-zinc-400"><input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-0.5 accent-orange-500" />{ru ? 'Я принимаю условия использования Rusty.Lub.' : 'I accept the Rusty.Lub terms of use.'}</label>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 bg-orange-500 px-5 py-4 text-sm font-bold text-black hover:bg-orange-400 disabled:opacity-50">{busy ? (ru ? 'Подождите...' : 'Please wait...') : mode === 'reset' ? (ru ? 'Отправить письмо' : 'Send email') : mode === 'register' ? (verificationPending ? (ru ? 'Я подтвердил email' : 'I verified my email') : (ru ? 'Зарегистрироваться и отправить письмо' : 'Register and send verification')) : (ru ? 'Войти' : 'Sign in')}</button>
        </form>
        {mode === 'login' && <button type="button" onClick={() => setMode('reset')} className="mt-4 text-left text-xs text-orange-300 hover:underline">{ru ? 'Забыли пароль?' : 'Forgot password?'}</button>}
        {verificationPending && <p className="mt-4 text-xs leading-5 text-amber-300">{ru ? 'Откройте письмо и подтвердите адрес. Затем нажмите «Я подтвердил email».' : 'Open the email and verify the address, then click “I verified my email”.'}</p>}
        <button type="button" onClick={onBackToLegacy} className="mt-8 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-zinc-500 hover:text-white"><ArrowLeft size={14} />{ru ? 'Вернуться к прежнему входу' : 'Back to existing sign in'}</button>
      </motion.div>
    </div>
  );
}
