import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Crosshair, Sparkles } from 'lucide-react';
import { doc, getDoc, setDoc, query, collection, where, getDocs, db, auth } from '../firebase';
import { CUSTOM_AVATARS } from '../customAvatars';
import { CustomUser } from '../types';

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
  const [selectedAvatar, setSelectedAvatar] = useState('hazmat');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [authLoading, setAuthLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();
    const cleanDisplayName = displayNameInput.trim() || usernameInput.trim();

    if (cleanUsername.length < 3 || cleanUsername.length > 20 || !/^[a-zA-Z0-9_\-]+$/.test(cleanUsername)) {
      onToast(
        lang === 'ru' 
          ? 'Логин должен быть от 3 до 20 символов и содержать только латинские буквы, цифры и знаки _ -' 
          : 'Login must be 3-20 characters, alphanumeric with _ or - only', 
        'warning'
      );
      return;
    }

    if (cleanPassword.length < 4) {
      onToast(
        lang === 'ru' ? 'Пароль должен быть не менее 4 символов!' : 'Password must be at least 4 characters!', 
        'warning'
      );
      return;
    }

    setAuthLoading(true);

    try {
      const userRef = doc(db, 'chat_users', cleanUsername);
      const userSnap = await getDoc(userRef);

      if (authMode === 'register') {
        // Register Mode
        if (userSnap.exists()) {
          onToast(lang === 'ru' ? 'Этот логин уже занят!' : 'Username is already taken!', 'error');
          setAuthLoading(false);
          return;
        }

        if (cleanDisplayName.length < 3 || cleanDisplayName.length > 40) {
          onToast(
            lang === 'ru' ? 'Позывной должен быть от 3 до 40 символов!' : 'Callsign must be between 3 and 40 characters!', 
            'warning'
          );
          setAuthLoading(false);
          return;
        }

        // Check if the displayName (username/nickname) is already registered
        const nameQuery = query(
          collection(db, 'chat_users'),
          where('displayName', '==', cleanDisplayName)
        );
        const nameQuerySnap = await getDocs(nameQuery);
        if (!nameQuerySnap.empty) {
          onToast(
            lang === 'ru' ? 'Этот позывной (никнейм) уже занят!' : 'This callsign is already taken!',
            'error'
          );
          setAuthLoading(false);
          return;
        }

        // Case-insensitive double check for any matching display name or username
        const allUsersSnap = await getDocs(collection(db, 'chat_users'));
        let isNameTaken = false;
        allUsersSnap.forEach((doc) => {
          const data = doc.data();
          if (data.displayName && data.displayName.toLowerCase() === cleanDisplayName.toLowerCase()) {
            isNameTaken = true;
          }
          if (data.username && data.username.toLowerCase() === cleanUsername.toLowerCase()) {
            isNameTaken = true;
          }
        });

        if (isNameTaken) {
          onToast(
            lang === 'ru' ? 'Этот логин или позывной уже занят!' : 'This login or callsign is already taken!',
            'error'
          );
          setAuthLoading(false);
          return;
        }

        const matchedAvatar = CUSTOM_AVATARS.find(a => a.id === selectedAvatar) || CUSTOM_AVATARS[0];
        
        // Prevent mimicry of 'seo-rustylub' and related admin terms
        const lowerUser = cleanUsername.toLowerCase();
        const lowerDisplay = cleanDisplayName.toLowerCase();
        const isMimic = 
          lowerUser.includes('rusty') || 
          lowerUser.includes('seo') || 
          lowerDisplay.includes('rusty') || 
          lowerDisplay.includes('seo');

        if (isMimic && cleanUsername !== 'serustqs') {
          onToast(
            lang === 'ru' 
              ? 'Логины и никнеймы, содержащие SEO или RUSTY, защищены от копирования!' 
              : 'Usernames and nicknames containing SEO or RUSTY are protected from mimicry!',
            'error'
          );
          setAuthLoading(false);
          return;
        }

        // Strict ban on EAC tag/abbreviation in user nicknames
        const isEacMimic = lowerDisplay.includes('eac') || lowerUser.includes('eac');
        if (isEacMimic && cleanUsername !== 'serustqs') {
          onToast(
            lang === 'ru' 
              ? 'Использование клан-тега или аббревиатуры EAC в никнейме строго запрещено!' 
              : 'Using the EAC clan tag or abbreviation in your nickname is strictly prohibited!',
            'error'
          );
          setAuthLoading(false);
          return;
        }

        const isSystemAdmin = cleanUsername === 'serustqs';

        const newUserData = {
          username: cleanUsername,
          password: cleanPassword,
          displayName: isSystemAdmin ? 'SEO-RustyLub' : cleanDisplayName,
          avatarClass: isSystemAdmin ? 'heavy_plate' : selectedAvatar,
          photoURL: matchedAvatar.url,
          gender: gender,
          role: isSystemAdmin ? 'admin' : 'user',
          isBlocked: false,
          createdAt: new Date().toISOString()
        };

        await setDoc(userRef, newUserData);
        
        onUserLogin({
          uid: cleanUsername,
          displayName: newUserData.displayName,
          photoURL: newUserData.photoURL,
          avatarClass: newUserData.avatarClass
        });

        onToast(
          lang === 'ru' ? 'Регистрация прошла успешно! Вы в эфире.' : 'Registration successful! Connected to beacon.',
          'success'
        );
        onClose();
      } else {
        // Login Mode
        if (!userSnap.exists()) {
          onToast(lang === 'ru' ? 'Пользователь не найден!' : 'Survivor callsign not registered!', 'error');
          setAuthLoading(false);
          return;
        }

        const dbUser = userSnap.data();
        if (dbUser.password !== cleanPassword) {
          onToast(lang === 'ru' ? 'Неверный пароль!' : 'Incorrect credentials!', 'error');
          setAuthLoading(false);
          return;
        }

        if (dbUser.isBlocked) {
          onToast(
            lang === 'ru' 
              ? 'Ваш аккаунт заблокирован администратором за нарушение правил!' 
              : 'Your account has been banned by an administrator!', 
            'error'
          );
          setAuthLoading(false);
          return;
        }

        onUserLogin({
          uid: cleanUsername,
          displayName: dbUser.displayName,
          photoURL: dbUser.photoURL,
          avatarClass: dbUser.avatarClass
        });

        onToast(
          lang === 'ru' ? 'С возвращением в сеть, боец!' : 'Welcome back to the grid, survivor!',
          'success'
        );
        onClose();
      }
    } catch (err) {
      console.error(err);
      onToast(lang === 'ru' ? 'Произошла критическая ошибка базы данных.' : 'Database error occurred.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-[#14171e] border-2 border-[#2a2f3b] p-6 relative overflow-hidden shadow-2xl rust-metal-pattern"
      >
        {/* Tactical Corner Brackets */}
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        {/* Top Hazard Diagonal Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rust-hazard" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-wider font-teko uppercase">
              {authMode === 'login' 
                ? (lang === 'ru' ? 'ВХОД В АККАУНТ' : 'SURVIVOR LOGIN') 
                : (lang === 'ru' ? 'РЕГИСТРАЦИЯ' : 'SURVIVOR REGISTRATION')}
            </h3>
            <p className="text-xs text-gray-500 font-mono">
              {authMode === 'login' 
                ? (lang === 'ru' ? 'С возвращением на станцию связи' : 'Authenticate with your survivor ID') 
                : (lang === 'ru' ? 'Создайте позывной для выхода в эфир' : 'Establish your radio frequency credentials')}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[#0c0d10] p-1 border border-[#2a2f3b]">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-[#cd412b] text-white font-black' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {lang === 'ru' ? 'Вход' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                authMode === 'register' 
                  ? 'bg-[#cd412b] text-white font-black' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {lang === 'ru' ? 'Регистрация' : 'Register'}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                {lang === 'ru' ? 'ЛОГИН' : 'LOGIN ID'} <span className="text-[#cd412b]">*</span>
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={lang === 'ru' ? 'Ваш уникальный логин' : 'Enter unique login id'}
                  className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/60 text-white placeholder-gray-600 pl-9 pr-4 py-2 text-xs font-mono outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                {lang === 'ru' ? 'ПАРОЛЬ' : 'PASSWORD'} <span className="text-[#cd412b]">*</span>
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
                  {lang === 'ru' ? 'ИГРОВОЙ ПОЗЫВНОЙ (НИКНЕЙМ)' : 'CALLSIGN / NICKNAME'} <span className="text-[#cd412b]">*</span>
                </label>
                <div className="relative">
                  <Crosshair size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder={lang === 'ru' ? 'Например: TV_Cheater' : 'e.g. Survivor_X'}
                    className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/60 text-white placeholder-gray-600 pl-9 pr-4 py-2 text-xs font-mono outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Survivor Class Selector (if registering) */}
            {authMode === 'register' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    {lang === 'ru' ? 'ПОЛ' : 'GENDER'} <span className="text-[#cd412b]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`flex-1 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                        gender === 'male' ? 'bg-[#cd412b] text-white border-[#cd412b]' : 'bg-[#0c0d10] text-gray-400 border-[#2a2f3b]'
                      }`}
                    >
                      {lang === 'ru' ? 'Мужской' : 'Male'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`flex-1 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                        gender === 'female' ? 'bg-[#cd412b] text-white border-[#cd412b]' : 'bg-[#0c0d10] text-gray-400 border-[#2a2f3b]'
                      }`}
                    >
                      {lang === 'ru' ? 'Женский' : 'Female'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    {lang === 'ru' ? 'КЛАСС ВЫЖИВШЕГО' : 'SURVIVOR CLASS'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {CUSTOM_AVATARS.map((avatar) => {
                      const isSelected = selectedAvatar === avatar.id;
                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar.id)}
                          className={`p-2 border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-[#cd412b] bg-[#cd412b]/10' 
                              : 'border-[#2a2f3b] bg-[#0c0d10] hover:border-gray-500'
                          }`}
                        >
                          <img 
                            src={avatar.url} 
                            alt={avatar.name[lang]} 
                            className="w-6 h-6 rounded-full object-cover bg-zinc-950"
                          />
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold text-white block truncate leading-tight">
                              {avatar.name[lang]}
                            </span>
                            <span className="text-[7px] text-gray-500 block truncate leading-none mt-0.5 font-mono">
                              {avatar.role[lang]}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-[#cd412b] hover:bg-[#b03825] text-white font-black text-xs uppercase tracking-widest font-mono cursor-pointer disabled:opacity-50 transition-colors"
            >
              {authLoading 
                ? (lang === 'ru' ? 'ПОДКЛЮЧЕНИЕ...' : 'CONNECTING...') 
                : authMode === 'login' 
                  ? (lang === 'ru' ? 'ВОЙТИ В ЭФИР' : 'ENTER BROADCAST') 
                  : (lang === 'ru' ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ESTABLISH LINK')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
