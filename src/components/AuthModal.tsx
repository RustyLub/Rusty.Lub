import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Crosshair, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  db
} from '../firebase';
import { CUSTOM_AVATARS } from '../customAvatars';
import { CustomUser } from '../types';
import TermsModal from './TermsModal';
import { trackSiteEvent } from '../services/siteAnalytics';

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
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('whiteout');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [authLoading, setAuthLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);


  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register' && !acceptedTerms) {
      onToast(lang === 'ru' ? 'Для регистрации необходимо принять пользовательское соглашение.' : 'You must accept the user agreement to register.', 'warning');
      return;
    }
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput;
    const cleanDisplayName = displayNameInput.trim();
    if (!/^[a-z0-9_-]{6,20}$/.test(cleanUsername)) {
      onToast(lang === 'ru' ? 'Логин: 6–20 символов, латиница, цифры, _ или -.' : 'Username must be 6–20 characters using letters, numbers, _ or -.', 'warning');
      return;
    }
    if (authMode === 'register' && cleanUsername === 'serustqs') {
      onToast(lang === 'ru' ? 'Этот логин зарезервирован.' : 'This username is reserved.', 'warning');
      return;
    }
    if (authMode === 'register' && (cleanDisplayName.length < 6 || cleanDisplayName.length > 32 || /[<>]/.test(cleanDisplayName))) {
      onToast(lang === 'ru' ? 'Никнейм должен содержать 6–32 символа.' : 'Nickname must be 6–32 characters.', 'warning');
      return;
    }
    if (cleanPassword.length < (authMode === 'register' ? 8 : 1) || cleanPassword.length > 128) {
      onToast(lang === 'ru' ? (authMode === 'register' ? 'Пароль должен содержать от 8 до 128 символов.' : 'Введите пароль.') : (authMode === 'register' ? 'Password must be 8–128 characters.' : 'Enter your password.'), 'warning');
      return;
    }
    if (authMode === 'register' && (!/[A-Z]/.test(cleanPassword) || !/[a-z]/.test(cleanPassword) || !/[0-9]/.test(cleanPassword) || !/[^A-Za-z0-9]/.test(cleanPassword))) {
      onToast(lang === 'ru' ? 'Пароль должен содержать заглавную и строчную буквы, цифру и специальный символ.' : 'Password must include an uppercase letter, a lowercase letter, a number, and a special character.', 'warning');
      return;
    }
    if (authMode === 'register' && cleanPassword !== confirmPasswordInput) {
      onToast(lang === 'ru' ? 'Пароли не совпадают.' : 'Passwords do not match.', 'warning');
      return;
    }
    setAuthLoading(true);
    try {
      const userRef = doc(db, 'chat_users', cleanUsername);
      const userSnap = await getDoc(userRef);
      if (authMode === 'register') {
        if (userSnap.exists()) {
          onToast(lang === 'ru' ? 'Этот логин уже занят. Выберите другой.' : 'This username is already taken. Choose another.', 'warning');
          return;
        }
        const matchedAvatar = CUSTOM_AVATARS.find(a => a.id === selectedAvatar) || CUSTOM_AVATARS[0];
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = Array.from(salt, b => b.toString(16).padStart(2, '0')).join('');
        const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(cleanPassword), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 210000, hash: 'SHA-256' }, key, 256);
        const hashHex = Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
        await setDoc(userRef, {
          username: cleanUsername, displayName: cleanDisplayName,
          passwordHash: hashHex, passwordSalt: saltHex, passwordAlgorithm: 'PBKDF2-SHA256',
          avatarClass: selectedAvatar, photoURL: matchedAvatar.url, gender,
          role: 'user', isBlocked: false, createdAt: new Date().toISOString()
        });
        onUserLogin({ uid: cleanUsername, displayName: cleanDisplayName, photoURL: matchedAvatar.url, avatarClass: selectedAvatar, gender, role: 'user' } as CustomUser);
        void trackSiteEvent('registration', { uid: cleanUsername, page: '/account' });
        onToast(lang === 'ru' ? 'Аккаунт создан!' : 'Account created!', 'success');
      } else {
        if (!userSnap.exists()) {
          onToast(lang === 'ru' ? 'Неверный логин или пароль.' : 'Incorrect username or password.', 'error');
          return;
        }
        const data = userSnap.data() as any;
        if (data.isBlocked) {
          onToast(lang === 'ru' ? 'Аккаунт заблокирован.' : 'This account is blocked.', 'error');
          return;
        }
        let passwordValid = false;
        if (data.passwordAlgorithm === 'PBKDF2-SHA256' && data.passwordHash && data.passwordSalt) {
          const salt = Uint8Array.from(data.passwordSalt.match(/.{2}/g) || [], (byte: string) => parseInt(byte, 16));
          const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(cleanPassword), 'PBKDF2', false, ['deriveBits']);
          const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 210000, hash: 'SHA-256' }, key, 256);
          const actual = Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
          passwordValid = actual === data.passwordHash;
        } else {
          passwordValid = typeof data.password === 'string' && data.password === cleanPassword;
          if (passwordValid) {
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const saltHex = Array.from(salt, b => b.toString(16).padStart(2, '0')).join('');
            const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(cleanPassword), 'PBKDF2', false, ['deriveBits']);
            const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 210000, hash: 'SHA-256' }, key, 256);
            const hashHex = Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
            await setDoc(userRef, { passwordHash: hashHex, passwordSalt: saltHex, passwordAlgorithm: 'PBKDF2-SHA256', password: null }, { merge: true });
          }
        }
        if (!passwordValid) {
          onToast(lang === 'ru' ? 'Неверный логин или пароль.' : 'Incorrect username or password.', 'error');
          return;
        }
        void trackSiteEvent('login', { uid: cleanUsername, page: '/account' });
        onUserLogin({
          uid: cleanUsername, displayName: data.displayName || cleanUsername,
          email: data.email || undefined, photoURL: data.photoURL || '',
          avatarClass: data.avatarClass || 'whiteout', gender: data.gender || 'male',
          role: data.role || 'user', isVip: Boolean(data.isVip), vipUntil: data.vipUntil
        } as CustomUser);
        onToast(lang === 'ru' ? 'С возвращением!' : 'Welcome back!', 'success');
      }
      onClose();
    } catch (error: any) {
      console.error('Auth error:', error);
      onToast(lang === 'ru' ? 'Не удалось выполнить операцию. Проверьте соединение и попробуйте ещё раз.' : 'Could not complete the request. Check your connection and try again.', 'error');
    } finally {
      setAuthLoading(false);
    }
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
                  minLength={3}
                  maxLength={20}
                  autoComplete="username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={lang === 'ru' ? 'Логин (6–20 символов)' : 'Username (6–20 characters)'}
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
                  minLength={authMode === 'register' ? 8 : 1}
                  maxLength={128}
                  autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={authMode === 'register' ? (lang === 'ru' ? '8+ символов, A-z, цифра, знак' : '8+ chars, A-z, number, symbol') : '••••••••'}
                  className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/60 text-white pl-9 pr-4 py-2 text-xs font-mono outline-none transition-all"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                  {lang === 'ru' ? 'Подтвердите пароль' : 'Confirm password'} <span className="text-[#cd412b]">*</span>
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder={lang === 'ru' ? 'Повторите пароль' : 'Repeat password'}
                    className={`w-full bg-[#0c0d10] border ${confirmPasswordInput && confirmPasswordInput !== passwordInput ? 'border-red-500' : 'border-[#2a2f3b]'} focus:border-[#cd412b]/60 text-white pl-9 pr-4 py-2 text-xs font-mono outline-none transition-all`} />
                </div>
                {confirmPasswordInput && <p className={`text-[10px] ${confirmPasswordInput === passwordInput ? 'text-green-400' : 'text-red-400'}`}>{confirmPasswordInput === passwordInput ? (lang === 'ru' ? 'Пароли совпадают' : 'Passwords match') : (lang === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match')}</p>}
              </div>
            )}
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
                    minLength={2}
                    maxLength={32}
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder={lang === 'ru' ? 'Никнейм (6–32 символа)' : 'Nickname (6–32 characters)'}
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
