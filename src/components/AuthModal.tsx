import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Crosshair, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  collection, 
  where, 
  getDocs, 
  deleteDoc,
  db, 
  auth
} from '../firebase';
import { CUSTOM_AVATARS } from '../customAvatars';
import { CustomUser } from '../types';
import TermsModal from './TermsModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  onUserLogin: (user: CustomUser) => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export default function AuthModal({ isOpen, onClose, lang, onUserLogin, onToast }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('whiteout');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [authLoading, setAuthLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);

  if (!isOpen) return null;

  const requestEmailCode = async () => {
    const email = emailInput.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onToast(lang === 'ru' ? 'Введите корректный email.' : 'Enter a valid email.', 'warning');
      return;
    }
    setAuthLoading(true);
    try {
      const response = await fetch('/api/auth/email/send-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Email send failed');
      setEmailCodeSent(true);
      setEmailVerified(false);
      onToast(lang === 'ru' ? 'Код отправлен на почту.' : 'Verification code sent.', 'success');
    } catch (error: any) {
      onToast(error.message || (lang === 'ru' ? 'Не удалось отправить код.' : 'Could not send code.'), 'error');
    } finally { setAuthLoading(false); }
  };

  const verifyEmailCode = async () => {
    setAuthLoading(true);
    try {
      const response = await fetch('/api/auth/email/verify-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim().toLowerCase(), code: emailCode.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed');
      setEmailVerified(true);
      onToast(lang === 'ru' ? 'Email подтверждён.' : 'Email verified.', 'success');
    } catch (error: any) {
      onToast(error.message || (lang === 'ru' ? 'Неверный код.' : 'Invalid code.'), 'error');
    } finally { setAuthLoading(false); }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register' && !acceptedTerms) {
      onToast(lang === 'ru' ? 'Вы должны принять пользовательское соглашение!' : 'You must accept the user agreement!', 'warning');
      return;
    }
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput;
    const cleanDisplayName = displayNameInput.trim() || usernameInput.trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      onToast(lang === 'ru' ? 'Логин: 3–20 символов, латиница, цифры, _ или -.' : 'Username must be 3–20 characters using letters, numbers, _ or -.', 'warning');
      return;
    }
    if (authMode === 'register' && !emailVerified) {
      onToast(lang === 'ru' ? 'Сначала подтвердите email.' : 'Verify your email first.', 'warning');
      return;
    }
    if (cleanPassword.length < (authMode === 'register' ? 8 : 4)) {
      onToast(lang === 'ru' ? (authMode === 'register' ? 'Пароль должен быть не короче 8 символов.' : 'Введите пароль.') : (authMode === 'register' ? 'Password must be at least 8 characters.' : 'Enter your password.'), 'warning');
      return;
    }
    setAuthLoading(true);
    try {
      const matchedAvatar = CUSTOM_AVATARS.find(a => a.id === selectedAvatar) || CUSTOM_AVATARS[0];
      const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = authMode === 'register'
        ? { email: emailInput.trim().toLowerCase(), username: cleanUsername, password: cleanPassword, displayName: cleanDisplayName, avatarClass: selectedAvatar, photoURL: matchedAvatar.url, gender }
        : { username: cleanUsername, password: cleanPassword };
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Auth error');
      onUserLogin(result.user as CustomUser);
      onToast(lang === 'ru' ? (authMode === 'register' ? 'Регистрация прошла успешно!' : 'С возвращением!') : (authMode === 'register' ? 'Registration successful!' : 'Welcome back!'), 'success');
      onClose();
    } catch (error: any) {
      console.error(error);
      onToast(error.message || (lang === 'ru' ? 'Ошибка авторизации' : 'Auth error'), 'error');
    } finally { setAuthLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#090b0f] text-white">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative mx-auto flex min-h-screen w-full max-w-6xl items-stretch overflow-hidden bg-[#0d1016] shadow-2xl lg:my-5 lg:min-h-[calc(100vh-2.5rem)] lg:border lg:border-white/10"
      >
        <aside className="relative hidden w-[42%] flex-col justify-between overflow-hidden border-r border-white/10 bg-[#11151c] p-10 lg:flex">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="relative">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center border border-orange-500/40 bg-orange-500/10 text-orange-400"><ShieldCheck size={23} /></div>
              <div><div className="font-mono text-xs tracking-[.28em] text-orange-400">RUSTY.LUB</div><div className="mt-1 text-[10px] tracking-[.18em] text-zinc-500">SURVIVAL KNOWLEDGE BASE</div></div>
            </div>
            <div className="mb-4 font-mono text-[10px] tracking-[.3em] text-zinc-500">ИНСТРУМЕНТЫ • БАЗА ЗНАНИЙ • СООБЩЕСТВО</div>
            <h2 className="max-w-md text-5xl font-black leading-[.98] tracking-tight">Твой следующий вайп.<br/><span className="text-orange-400">Под твоим контролем.</span></h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">Сохраняй расчёты рейдов, собирай полезные материалы и возвращайся к своим инструментам с одного аккаунта.</p>
          </div>
          <div className="relative border-t border-white/10 pt-5 font-mono text-[10px] tracking-widest text-zinc-500">ACCOUNT ACCESS / RUSTY.LUB</div>
        </aside>
        <section className="relative flex min-w-0 flex-1 flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400/40 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={lang === 'ru' ? 'Закрыть' : 'Close'}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-white/10 text-zinc-400 transition-colors hover:border-orange-500/50 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="mx-auto w-full max-w-md space-y-7">
          <div className="space-y-2 pr-12 text-left">
            <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {authMode === 'login' 
                ? (lang === 'ru' ? 'Вход в аккаунт' : 'Sign in') 
                : (lang === 'ru' ? 'Создать аккаунт' : 'Create account')}
            </h3>
            <p className="max-w-sm text-sm leading-6 text-zinc-400">
              {authMode === 'login' 
                ? (lang === 'ru' ? 'Войдите, чтобы продолжить работу с вашими инструментами' : 'Sign in to continue using your tools') 
                : (lang === 'ru' ? 'Создайте аккаунт, чтобы сохранять расчёты и настройки' : 'Create an account to save your calculations and settings')}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-white/10">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 border-b-2 py-3 text-sm font-semibold transition-all cursor-pointer ${
                authMode === 'login' 
                  ? 'border-orange-400 text-orange-300 font-bold' 
                  : 'border-transparent text-zinc-500 hover:text-white'
              }`}
            >
              {lang === 'ru' ? 'Вход' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 border-b-2 py-3 text-sm font-semibold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'border-orange-400 text-orange-300 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-white'
              }`}
            >
              {lang === 'ru' ? 'Регистрация' : 'Register'}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-wide text-zinc-300">{lang === 'ru' ? 'Электронная почта' : 'Email'} *</label>
                <div className="flex gap-2">
                  <input type="email" required value={emailInput} disabled={emailVerified} onChange={(e) => { setEmailInput(e.target.value); setEmailVerified(false); setEmailCodeSent(false); }} placeholder="you@example.com" className="min-w-0 flex-1 bg-[#0c0d10] border border-[#2a2f3b] focus:border-orange-400 text-white px-3 py-3 text-xs outline-none" />
                  <button type="button" disabled={authLoading || emailVerified} onClick={requestEmailCode} className="border border-orange-500/50 px-3 text-xs font-bold text-orange-300 disabled:opacity-50">{emailCodeSent ? (lang === 'ru' ? 'Повторить' : 'Resend') : (lang === 'ru' ? 'Получить код' : 'Send code')}</button>
                </div>
                {emailCodeSent && !emailVerified && <div className="flex gap-2">
                  <input inputMode="numeric" maxLength={6} value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder={lang === 'ru' ? '6-значный код' : '6-digit code'} className="min-w-0 flex-1 bg-[#0c0d10] border border-[#2a2f3b] text-white px-3 py-3 text-xs outline-none" />
                  <button type="button" disabled={authLoading || emailCode.length !== 6} onClick={verifyEmailCode} className="border border-white/20 px-3 text-xs font-bold disabled:opacity-50">{lang === 'ru' ? 'Подтвердить' : 'Verify'}</button>
                </div>}
                {emailVerified && <p className="text-xs text-green-400">✓ {lang === 'ru' ? 'Email подтверждён' : 'Email verified'}</p>}
              </div>
            )}
            {/* Username */}
            <div className="space-y-1.5">
              <label className="mb-2 block text-xs font-semibold tracking-wide text-zinc-300">
                {lang === 'ru' ? 'Логин' : 'Username'} <span className="text-[#cd412b]">*</span>
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={lang === 'ru' ? 'Придумайте логин' : 'Choose a username'}
                  className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/60 text-white placeholder-gray-600 pl-9 pr-4 py-2 text-xs font-mono outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                {lang === 'ru' ? 'Пароль' : 'Password'} <span className="text-[#cd412b]">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/60 text-white pl-9 pr-4 py-2 text-xs font-mono outline-none transition-all"
                />
              </div>
            </div>

            {/* Display Name (if registering) */}
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                  {lang === 'ru' ? 'Никнейм' : 'Nickname'} <span className="text-[#cd412b]">*</span>
                </label>
                <div className="relative">
                  <Crosshair size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder={lang === 'ru' ? 'Введите свой никнейм' : 'Enter your nickname'}
                    className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/60 text-white placeholder-gray-600 pl-9 pr-4 py-2 text-xs font-mono outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Terms of Service Checkbox (Registration Only) */}
            {authMode === 'register' && (
              <div className="flex items-start gap-2.5 p-3 bg-[#0c0d10] border border-[#2a2f3b] group hover:border-[#cd412b]/30 transition-all cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                <div className="pt-0.5">
                  <div className={`w-4 h-4 border flex items-center justify-center transition-all ${acceptedTerms ? 'bg-[#cd412b] border-[#cd412b]' : 'border-gray-700 bg-black group-hover:border-gray-500'}`}>
                    {acceptedTerms && <Sparkles size={10} className="text-white" />}
                  </div>
                </div>
                <div className="flex-1 text-[10px] font-mono leading-tight">
                  <span className="text-gray-500">{lang === 'ru' ? 'Я ознакомился и принимаю ' : 'I have read and accept the '}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTerms(true);
                    }}
                    className="text-[#cd412b] hover:underline font-bold"
                  >
                    {lang === 'ru' ? 'условия использования Rusty.Lub' : 'Rusty.Lub Terms of Use'}
                  </button>
                  <span className="text-gray-500"> {lang === 'ru' ? ' и правила работы с аккаунтом.' : ' and account rules.'}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="flex w-full items-center justify-center gap-2 bg-orange-500 px-5 py-4 text-sm font-bold text-black transition-colors hover:bg-orange-400 disabled:cursor-wait disabled:opacity-50"
            >
              {authLoading 
                ? (lang === 'ru' ? 'Выполняется вход...' : 'Signing in...') 
                : authMode === 'login' 
                  ? (lang === 'ru' ? 'Войти в аккаунт' : 'Sign in') 
                  : (lang === 'ru' ? 'Создать аккаунт' : 'Create account')}
              {!authLoading && <ArrowRight size={17} />}
            </button>
          </form>
          <p className="text-center text-xs leading-5 text-zinc-500">
            {authMode === 'login'
              ? (lang === 'ru' ? 'Нет аккаунта? Переключитесь на регистрацию выше.' : 'New here? Choose Register above.')
              : (lang === 'ru' ? 'Уже зарегистрированы? Переключитесь на вход выше.' : 'Already registered? Choose Login above.')}
          </p>
        </div>
        </section>
      </motion.div>

      <AnimatePresence>
        {showTerms && (
          <TermsModal 
            isOpen={showTerms}
            onClose={() => setShowTerms(false)}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
