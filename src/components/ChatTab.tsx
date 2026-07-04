import React, { useState, useEffect, useRef } from 'react';
import { 
  db, 
  collection, 
  addDoc, 
  query, 
  where,
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { 
  Send, 
  LogOut, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Hammer, 
  Crosshair, 
  Lock, 
  Unlock,
  Power, 
  Trash2, 
  ShieldAlert, 
  Settings, 
  RefreshCw, 
  UserX, 
  UserCheck,
  Smile,
  Star,
  Hash,
  Volume2,
  Bell,
  Pin,
  Users,
  Mic,
  Headphones,
  Plus,
  PlusCircle,
  Search,
  HelpCircle,
  ChevronDown,
  Compass,
  PhoneOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomUser } from '../types';
import UserProfileModal from './UserProfileModal';
import { CUSTOM_AVATARS, getAvatarUrl } from '../customAvatars';

interface ChatTabProps {
  lang: 'ru' | 'en';
  user: CustomUser | null;
  onUserLogin: (user: CustomUser) => void;
  onUserLogout: () => void;
  onToast: (msg: string, type: 'success' | 'error' | 'warning') => void;
}

interface Message {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  photoURL: string;
  avatarClass?: string;
  createdAt: any;
  isHighlighted?: boolean;
}

interface RegisteredUser {
  username: string;
  displayName: string;
  photoURL: string;
  avatarClass: string;
  role: string;
  isBlocked: boolean;
  isVip?: boolean;
  isChatVip?: boolean;
  clanTag?: string;
  voiceChannel?: string | null;
}

export const SURVIVOR_AVATARS = [
  {
    id: 'heavy_plate',
    name: { ru: 'Тяжелый Бронекостюм', en: 'Heavy Juggernaut' },
    role: { ru: 'PVP Дефендер', en: 'Raid Juggernaut' },
    url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=80',
    color: '#4f5e71',
    borderClass: 'border-[#4f5e71]/40 bg-[#4f5e71]/10 text-slate-100',
    tagClass: 'bg-[#4f5e71]/20 border-[#4f5e71]/40 text-[#a0aec0]'
  },
  ...CUSTOM_AVATARS.map((avatar) => {
    let color = '#cd412b';
    let borderClass = 'border-[#cd412b]/40 bg-[#cd412b]/10 text-red-100';
    let tagClass = 'bg-[#cd412b]/20 border-[#cd412b]/40 text-[#cd412b]';

    if (avatar.id === 'builder') {
      color = '#eab308';
      borderClass = 'border-amber-500/40 bg-amber-500/10 text-amber-100';
      tagClass = 'bg-amber-500/20 border-amber-500/40 text-amber-400';
    } else if (avatar.id === 'solo_player') {
      color = '#a855f7';
      borderClass = 'border-purple-500/40 bg-purple-500/10 text-purple-100';
      tagClass = 'bg-purple-500/20 border-purple-500/40 text-purple-400';
    } else if (avatar.id === 'clan_player') {
      color = '#3b82f6';
      borderClass = 'border-blue-500/40 bg-blue-500/10 text-blue-100';
      tagClass = 'bg-blue-500/20 border-blue-500/40 text-blue-400';
    } else if (avatar.id === 'newbie') {
      color = '#10b981';
      borderClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100';
      tagClass = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
    } else if (avatar.id === 'pve_player') {
      color = '#14b8a6';
      borderClass = 'border-teal-500/40 bg-teal-500/10 text-teal-100';
      tagClass = 'bg-teal-500/20 border-teal-500/40 text-teal-400';
    } else if (avatar.id === 'pvp_player') {
      color = '#f97316';
      borderClass = 'border-orange-500/40 bg-orange-500/10 text-orange-100';
      tagClass = 'bg-orange-500/20 border-orange-500/40 text-orange-400';
    } else if (avatar.id === 'whiteout') {
      color = '#38bdf8';
      borderClass = 'border-sky-500/40 bg-sky-500/10 text-sky-100';
      tagClass = 'bg-sky-500/20 border-sky-500/40 text-sky-400';
    } else if (avatar.id === 'clown') {
      color = '#8b5cf6';
      borderClass = 'border-violet-500/40 bg-violet-500/10 text-violet-100';
      tagClass = 'bg-violet-500/20 border-violet-500/40 text-violet-400';
    } else if (avatar.id === 'skull_text') {
      color = '#71717a';
      borderClass = 'border-zinc-500/40 bg-zinc-500/10 text-zinc-100';
      tagClass = 'bg-zinc-500/20 border-zinc-500/40 text-zinc-400';
    } else if (avatar.id === 'rocket_launcher') {
      color = '#64748b';
      borderClass = 'border-slate-500/40 bg-slate-500/10 text-slate-100';
      tagClass = 'bg-slate-500/20 border-slate-500/40 text-slate-400';
    } else if (avatar.id === 'santa_girl') {
      color = '#ef4444';
      borderClass = 'border-red-500/40 bg-red-500/10 text-red-100';
      tagClass = 'bg-red-500/20 border-red-500/40 text-red-400';
    } else if (avatar.id === 'putin_rust') {
      color = '#eab308';
      borderClass = 'border-yellow-500/40 bg-yellow-500/10 text-yellow-100';
      tagClass = 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
    } else if (avatar.id === 'white_mask') {
      color = '#6366f1';
      borderClass = 'border-indigo-500/40 bg-indigo-500/10 text-indigo-100';
      tagClass = 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400';
    } else if (avatar.id === 'cat_mask') {
      color = '#ec4899';
      borderClass = 'border-pink-500/40 bg-pink-500/10 text-pink-100';
      tagClass = 'bg-pink-500/20 border-pink-500/40 text-pink-400';
    } else if (avatar.id === 'rust_logo_avatar') {
      color = '#dc2626';
      borderClass = 'border-red-600/40 bg-red-600/10 text-red-100';
      tagClass = 'bg-red-600/20 border-red-600/40 text-red-500';
    } else if (avatar.id === 'wolf_sunset') {
      color = '#f97316';
      borderClass = 'border-amber-600/40 bg-amber-600/10 text-amber-100';
      tagClass = 'bg-amber-600/20 border-amber-600/40 text-amber-500';
    }

    return {
      id: avatar.id,
      name: avatar.name,
      role: avatar.role,
      url: avatar.url,
      color,
      borderClass,
      tagClass,
    };
  }),
];

export default function ChatTab({ lang, user, onUserLogin, onUserLogout, onToast }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);
  
  // Custom auth modes & states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('whiteout');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [authLoading, setAuthLoading] = useState(false);

  // Admin controls & list
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, { isBlocked: boolean; isVip?: boolean; isChatVip?: boolean; role: string; displayName: string; photoURL: string; avatarClass: string; clanTag?: string; voiceChannel?: string | null }>>({});
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const [activeChannel, setActiveChannel] = useState<'rust-russian' | 'rust-english' | 'rust-vip'>('rust-russian');
  const [highlightNextMessage, setHighlightNextMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Translations
  const t = {
    title: { ru: 'ОБЩИЙ ЧАТ ВЫЖИВШИХ RUST', en: 'GLOBAL RUST SURVIVORS CHAT' },
    subtitle: { 
      ru: 'Официальный радиоэфир для поиска тимейтов, торговли чертежами и координации рейдов.', 
      en: 'Official radio channel for team recruitment, blueprint trade, and raid planning.' 
    },
    loginTitle: { ru: 'ПОДКЛЮЧЕНИЕ К ЧАТУ RUST', en: 'ESTABLISHING SECURE BEACON' },
    loginDesc: { 
      ru: 'Войдите или зарегистрируйте защищенный аккаунт для обмена разведданными и координации рейдов.', 
      en: 'Log in or register a secure account to share tactical intel and orchestrate raids.' 
    },
    usernameLabel: { ru: 'Имя пользователя (Логин)', en: 'Username (Login)' },
    passwordLabel: { ru: 'Пароль доступа', en: 'Access Password' },
    displayNameLabel: { ru: 'Позывной в эфире (Никнейм)', en: 'Radio Callsign (In-game Name)' },
    classLabel: { ru: 'Выберите ваш класс выжившего', en: 'Select your combat archetype' },
    signInBtn: { ru: 'ВОЙТИ В ЭФИР', en: 'CONNECT RADIO' },
    signUpBtn: { ru: 'ЗАРЕГИСТРИРОВАТЬСЯ', en: 'REGISTER FREQUENCY' },
    tabLogin: { ru: 'Вход в аккаунт', en: 'Sign In' },
    tabRegister: { ru: 'Создать профиль', en: 'Create Profile' },
    adminHint: { 
      ru: '💡 КАНАЛ СОЗДАТЕЛЯ: Войдите как serustqs с паролем Duf@#13@4fhe34 для доступа к панели Создателя!',
      en: '💡 CREATOR CHANNEL: Sign in as serustqs with password Duf@#13@4fhe34 to access Founder panel!'
    },
    placeholder: { ru: 'Введите сообщение в эфир...', en: 'Transmit message over frequency...' },
    sendBtn: { ru: 'ПЕРЕДАТЬ', en: 'SEND' },
    logoutBtn: { ru: 'Отключиться', en: 'Disconnect' },
    welcomeUser: { ru: 'Позывной', en: 'Callsign' },
    emptyChat: { ru: 'Канал пуст. Начните трансляцию!', en: 'Frequency is silent. Start broadcasting!' },
    sending: { ru: 'Отправка...', en: 'Sending...' },
    errorSend: { ru: 'Не удалось отправить сообщение.', en: 'Failed to send message over the wire.' },
    charLimit: { ru: 'Превышен лимит символов (макс. 1000).', en: 'Character limit exceeded (max 1000).' },
    onlineUsers: { ru: 'Выживших на связи', en: 'Survivors Online' },
    adminTag: { ru: '👑 СОЗДАТЕЛЬ / FOUNDER', en: '👑 FOUNDER / CREATOR' },
    vipTag: { ru: '⭐ VIP-ПЕРСОНА', en: '⭐ VIP SURVIVOR' },
    eacTag: { ru: 'ВЕТЕРАН', en: 'VETERAN' },
    googleTag: { ru: 'GOOGLE VERIFIED', en: 'GOOGLE VERIFIED' },
    validationName: { ru: 'Позывной должен быть от 3 до 40 символов', en: 'Callsign must be between 3 and 40 characters' },
    validationUser: { ru: 'Имя пользователя должно быть от 3 до 20 символов (латиница/цифры)', en: 'Username must be 3-20 characters long' },
    validationPass: { ru: 'Пароль должен быть не менее 4 символов', en: 'Password must be at least 4 characters long' },
    
    // Admin translations
    adminPanelTitle: { ru: 'ТАКТИЧЕСКИЙ ТЕРМИНАЛ СОЗДАТЕЛЯ', en: 'CREATOR TACTICAL CONSOLE' },
    clearChatBtn: { ru: 'ОЧИСТИТЬ ВЕСЬ ЧАТ', en: 'PURGE ENTIRE CHAT' },
    confirmClear: { ru: 'Вы уверены, что хотите удалить ВСЕ сообщения в чате?', en: 'Are you absolutely sure you want to delete ALL messages?' },
    chatPurged: { ru: 'Радиоэфир успешно очищен!', en: 'Radio frequency successfully purged!' },
    usersListTitle: { ru: 'База Выживших', en: 'Survivor Database' },
    searchPlaceholder: { ru: 'Поиск по никнейму...', en: 'Search by callsign...' },
    blockUserBtn: { ru: 'Забанить', en: 'Ban' },
    unblockUserBtn: { ru: 'Разбанить', en: 'Unban' },
    vipBtn: { ru: 'Дать VIP', en: 'Grant VIP' },
    unvipBtn: { ru: 'Снять VIP', en: 'Remove VIP' },
    userBlockedMsg: { ru: 'Выживший успешно заблокирован в эфире', en: 'Survivor successfully banned from frequency' },
    userUnblockedMsg: { ru: 'Выживший разблокирован', en: 'Survivor unbanned successfully' },
    bannedToastError: { ru: 'Ошибка! Ваш аккаунт заблокирован создателем!', en: 'Access Denied! Your account has been banned by the Founder.' }
  };

  // Setup initial admin account on load if it doesn't exist & Purge old chat if requested
  useEffect(() => {
    const setupAdminAndPurge = async () => {
      try {
        // Setup new admin
        const adminRef = doc(db, 'chat_users', 'serustqs');
        const defaultAvatar = SURVIVOR_AVATARS.find(a => a.id === 'heavy_plate') || SURVIVOR_AVATARS[0];
        await setDoc(adminRef, {
          username: 'serustqs',
          password: 'Duf@#13@4fhe34',
          displayName: 'SEO-RustyLub',
          avatarClass: 'heavy_plate',
          photoURL: defaultAvatar.url,
          role: 'admin',
          isBlocked: false,
          createdAt: new Date().toISOString()
        });

        // Clean up fraudulent mock-admin accounts that mimicking logins created
        try {
          await deleteDoc(doc(db, 'chat_users', 'seo-rustylub'));
          await deleteDoc(doc(db, 'chat_users', 'seo-rusty'));
        } catch (e) {
          console.warn("Error deleting fraud accounts:", e);
        }

        // Set default gender 'male' for all existing users
        const usersSnap = await getDocs(collection(db, 'chat_users'));
        usersSnap.forEach(async (userDoc) => {
          const userData = userDoc.data();
          if (!userData.gender) {
            await setDoc(userDoc.ref, { gender: 'male' }, { merge: true });
          }
        });

        // Trigger one-time chat purge to clear existing messages completely
        const purgeMetaRef = doc(db, 'chat_metadata', 'purge_req_v1');
        const purgeMetaSnap = await getDoc(purgeMetaRef);
        if (!purgeMetaSnap.exists()) {
          const messagesSnapshot = await getDocs(collection(db, 'messages'));
          const batch = writeBatch(db);
          messagesSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          await setDoc(purgeMetaRef, { purged: true });
          console.log("Chat purged completely as requested by SEO-RustyLub.");
        }
      } catch (err) {
        console.warn("Could not setup admin/purge:", err);
      }
    };
    setupAdminAndPurge();
  }, []);

  // Real-time subscribe to registered users to dynamically retrieve VIP status, blocks, and roles
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'chat_users'), (snapshot) => {
      const uMap: Record<string, { isBlocked: boolean; isVip?: boolean; isChatVip?: boolean; role: string; displayName: string; photoURL: string; avatarClass: string; clanTag?: string; voiceChannel?: string | null }> = {};
      const usersList: RegisteredUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        uMap[doc.id] = {
          isBlocked: !!data.isBlocked,
          isVip: !!data.isVip,
          isChatVip: !!data.isChatVip,
          role: data.role || 'user',
          displayName: data.displayName || doc.id,
          photoURL: data.photoURL || '',
          avatarClass: data.avatarClass || 'whiteout',
          clanTag: data.clanTag || '',
          voiceChannel: data.voiceChannel || null
        };
        usersList.push({
          username: doc.id,
          displayName: data.displayName || doc.id,
          photoURL: data.photoURL || '',
          avatarClass: data.avatarClass || 'whiteout',
          role: data.role || 'user',
          isBlocked: !!data.isBlocked,
          isVip: !!data.isVip,
          isChatVip: !!data.isChatVip,
          clanTag: data.clanTag || '',
          voiceChannel: data.voiceChannel || null
        });
      });
      setUsersMap(uMap);
      setRegisteredUsers(usersList);
    }, (err) => {
      console.warn("Could not load real-time users map:", err);
    });
    return () => unsubscribe();
  }, []);

  // Kick blocked user or fraudulent mimics in real-time
  useEffect(() => {
    if (user) {
      const isBlocked = usersMap[user.uid]?.isBlocked;
      const isFraud = user.uid === 'seo-rustylub' || user.uid === 'seo-rusty' || (user.uid !== 'serustqs' && user.displayName?.toLowerCase().includes('seo-rustylub'));
      if (isBlocked || isFraud) {
        onToast(isFraud ? (lang === 'ru' ? 'Ошибка безопасности! Доступ запрещен.' : 'Security error! Access Denied.') : t.bannedToastError[lang], 'error');
        onUserLogout();
      }
    }
  }, [user, usersMap, lang]);



  // Auth Submit Handler (Login or Register)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();
    const cleanDisplayName = displayNameInput.trim() || usernameInput.trim();

    if (cleanUsername.length < 3 || cleanUsername.length > 20 || !/^[a-zA-Z0-9_\-]+$/.test(cleanUsername)) {
      onToast(t.validationUser[lang], 'warning');
      return;
    }

    if (cleanPassword.length < 4) {
      onToast(t.validationPass[lang], 'warning');
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
          onToast(t.validationName[lang], 'warning');
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

        const matchedAvatar = SURVIVOR_AVATARS.find(a => a.id === selectedAvatar) || SURVIVOR_AVATARS[0];
        
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

        // Automatically make admin accounts
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
          onToast(t.bannedToastError[lang], 'error');
          setAuthLoading(false);
          return;
        }

        onUserLogin({
          uid: dbUser.username,
          displayName: dbUser.displayName,
          photoURL: dbUser.photoURL,
          avatarClass: dbUser.avatarClass
        });

        onToast(
          lang === 'ru' ? `С возвращением, ${dbUser.displayName}!` : `Welcome back, ${dbUser.displayName}!`,
          'success'
        );
      }
    } catch (error) {
      console.error("Auth process failure:", error);
      onToast(lang === 'ru' ? 'Ошибка базы данных.' : 'Database connectivity error.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  // Sync messages from Firestore - public access
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setLoading(false);
      
      // Auto scroll
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'messages');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Scroll on messages count change or channel switch
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeChannel]);

  // Send message with instant ban check block
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    if (newMessage.length > 1000) {
      onToast(t.charLimit[lang], 'warning');
      return;
    }

    setSending(true);

    try {
      // Security Check: is current user banned?
      const userRef = doc(db, 'chat_users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().isBlocked) {
        onToast(t.bannedToastError[lang], 'error');
        onUserLogout(); // kick out blocked user
        setSending(false);
        return;
      }

      // Security Check: is sending in rust-vip restricted?
      if (activeChannel === 'rust-vip' && !isCurrentVipSub) {
        onToast(lang === 'ru' ? 'Доступ запрещен! Чат только для VIP-подписчиков.' : 'Access Denied! VIP Subscribers only.', 'error');
        setSending(false);
        return;
      }

      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        avatarClass: user.avatarClass || 'whiteout',
        channel: activeChannel,
        createdAt: serverTimestamp(),
        isHighlighted: !!(isCurrentVipSub && highlightNextMessage),
        replyTo: replyTo ? {
          text: replyTo.text,
          displayName: replyTo.displayName
        } : null
      });

      setNewMessage('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
      onToast(t.errorSend[lang], 'error');
    } finally {
      setSending(false);
    }
  };

  // Message deletion
  const handleDeleteMessage = async (msgId: string) => {
    try {
      await deleteDoc(doc(db, 'messages', msgId));
      onToast(lang === 'ru' ? 'Сообщение удалено' : 'Message deleted', 'success');
    } catch (error) {
      onToast('Error deleting message', 'error');
    }
  };

  // Block/unblock user
  const handleToggleBlockUser = async (targetUid: string, currentlyBlocked: boolean) => {
    if (targetUid === 'serustqs') {
      onToast(lang === 'ru' ? 'Нельзя забанить создателя!' : 'Cannot block founder!', 'warning');
      return;
    }

    setAdminActionLoading(true);
    try {
      await setDoc(doc(db, 'chat_users', targetUid), { isBlocked: !currentlyBlocked }, { merge: true });
      onToast(
        currentlyBlocked ? t.userUnblockedMsg[lang] : t.userBlockedMsg[lang],
        'success'
      );
    } catch (err) {
      console.error(err);
      onToast('Error toggling block', 'error');
    } finally {
      setAdminActionLoading(false);
    }
  };

  // Toggle VIP status for user
  const handleToggleVipUser = async (targetUid: string, currentlyVip: boolean) => {
    if (targetUid === 'serustqs') {
      onToast(lang === 'ru' ? 'Создатель имеет максимальные права!' : 'Founder has full permissions!', 'warning');
      return;
    }

    setAdminActionLoading(true);
    try {
      await setDoc(doc(db, 'chat_users', targetUid), { isChatVip: !currentlyVip }, { merge: true });
      onToast(
        currentlyVip 
          ? (lang === 'ru' ? 'VIP статус чата снят' : 'Chat VIP status removed')
          : (lang === 'ru' ? 'Пользователю успешно выдан статус VIP в чате!' : 'Chat VIP status granted successfully!'),
        'success'
      );
    } catch (err) {
      console.error(err);
      onToast('Error toggling VIP status', 'error');
    } finally {
      setAdminActionLoading(false);
    }
  };

  // Toggle EAC tag for user exclusively by Owner
  const handleToggleEacTag = async (targetUid: string, hasEac: boolean) => {
    if (targetUid === 'serustqs') {
      onToast(lang === 'ru' ? 'Владелец всегда имеет максимальный статус!' : 'Owner always has maximum status!', 'warning');
      return;
    }

    setAdminActionLoading(true);
    try {
      await setDoc(doc(db, 'chat_users', targetUid), { clanTag: hasEac ? '' : 'EAC' }, { merge: true });
      onToast(
        hasEac 
          ? (lang === 'ru' ? 'Клан-тег [EAC] успешно забран у пользователя!' : 'Clan tag [EAC] successfully revoked from user!')
          : (lang === 'ru' ? 'Клан-тег [EAC] успешно выдан пользователю!' : 'Clan tag [EAC] successfully granted to user!'),
        'success'
      );
    } catch (err) {
      console.error("Toggle EAC error:", err);
      onToast('Error toggling EAC tag', 'error');
    } finally {
      setAdminActionLoading(false);
    }
  };

  // Purge entire chat (Clear chat database)
  const handlePurgeChat = async () => {
    if (!window.confirm(t.confirmClear[lang])) return;

    setAdminActionLoading(true);
    try {
      const messagesSnapshot = await getDocs(collection(db, 'messages'));
      const batch = writeBatch(db);
      
      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      onToast(t.chatPurged[lang], 'success');
      setShowAdminPanel(false);
    } catch (err) {
      console.error("Purge chat error:", err);
      onToast('Error purging chat database', 'error');
    } finally {
      setAdminActionLoading(false);
    }
  };

  const formatTime = (createdAt: any) => {
    if (!createdAt) return '';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Web Audio API custom voice sound synthesizers (Discord styled)
  const playVoiceSound = (type: 'join' | 'leave') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'join') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("AudioContext block:", e);
    }
  };

  const joinVoiceChannel = async (channelId: string) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'chat_users', user.uid);
      await setDoc(userRef, { voiceChannel: channelId }, { merge: true });
      playVoiceSound('join');
      onToast(
        lang === 'ru' ? 'Подключено к голосу: Outpost Radio!' : 'Connected to voice: Outpost Radio!',
        'success'
      );
    } catch (err) {
      console.warn("Could not join voice channel:", err);
      onToast(lang === 'ru' ? 'Ошибка подключения к голосовому каналу.' : 'Failed to connect to voice channel.', 'error');
    }
  };

  const leaveVoiceChannel = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'chat_users', user.uid);
      await setDoc(userRef, { voiceChannel: null }, { merge: true });
      playVoiceSound('leave');
      onToast(
        lang === 'ru' ? 'Вы отключились от голосового канала.' : 'Disconnected from voice channel.',
        'warning'
      );
    } catch (err) {
      console.warn("Could not leave voice channel:", err);
    }
  };

  const handleLogout = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'chat_users', user.uid);
        await setDoc(userRef, { voiceChannel: null }, { merge: true });
      } catch (err) {
        console.warn("Could not clear voice channel on logout:", err);
      }
    }
    onUserLogout();
  };

  // Auto clean voice on unmount
  useEffect(() => {
    return () => {
      if (user) {
        const userRef = doc(db, 'chat_users', user.uid);
        setDoc(userRef, { voiceChannel: null }, { merge: true }).catch(() => {});
      }
    };
  }, [user]);

  // Check if user is Admin
  const isAdmin = user && (user.uid === 'serustqs' || user.email === 'misterzet556@gmail.com');

  // Check if current user is VIP Subscriber or Admin
  const isCurrentVipSub = user && (
    user.uid === 'serustqs' || 
    !!usersMap[user.uid]?.isVip || 
    user.role === 'admin' || 
    user.email === 'misterzet556@gmail.com'
  );

  // Security guard: redirect if non-VIP tries to access rust-vip
  useEffect(() => {
    if (activeChannel === 'rust-vip' && !isCurrentVipSub) {
      setActiveChannel('rust-russian');
    }
  }, [activeChannel, isCurrentVipSub]);

  const filteredMessages = messages.filter((msg: any) => {
    const msgChannel = msg.channel || 'rust-russian';
    return msgChannel === activeChannel;
  });

  return (
    <div className="w-full min-h-[550px] font-sans" id="rust-chat-component">
      {/* DISCORD INTERFACE CONTAINER */}
      <div className="bg-[#313338] rounded-2xl flex h-[650px] shadow-2xl relative overflow-hidden text-zinc-200 border border-zinc-800/60">
        
        {/* 1. DISCORD CHANNELS SIDEBAR (LEFT) */}
        <div className="w-60 bg-[#2b2d31] flex-col border-r border-[#1f2023] hidden md:flex select-none">
          {/* Guild Header */}
          <div className="h-12 border-b border-[#1f2023] flex items-center justify-between px-4 font-bold text-white shadow-sm bg-[#2b2d31] hover:bg-zinc-700/20 cursor-pointer transition-colors">
            <span className="text-xs tracking-wider flex items-center gap-1.5 font-sans font-black">
              <span className="text-red-500">☢</span> RUST SURVIVORS
            </span>
            <ChevronDown size={14} className="text-zinc-400" />
          </div>

          {/* Sidebar Channels List */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
            {/* Active channel (Our main chat) */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-1.5 mb-1.5">
                <span>{lang === 'ru' ? 'ТЕКСТОВЫЕ КАНАЛЫ' : 'TEXT CHANNELS'}</span>
              </div>
              
              <div className="space-y-0.5">
                {/* Russian Channel */}
                <button
                  onClick={() => setActiveChannel('rust-russian')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition-colors group cursor-pointer ${
                    activeChannel === 'rust-russian'
                      ? 'bg-zinc-700/40 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-700/20 hover:text-zinc-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Hash size={15} className={activeChannel === 'rust-russian' ? 'text-zinc-200' : 'text-zinc-400'} />
                    <span>rust-russian</span>
                  </span>
                  <span className="text-[9px] text-red-400 font-bold tracking-wider font-mono bg-red-500/10 px-1 rounded">RU</span>
                </button>

                {/* English Channel */}
                <button
                  onClick={() => setActiveChannel('rust-english')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition-colors group cursor-pointer ${
                    activeChannel === 'rust-english'
                      ? 'bg-zinc-700/40 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-700/20 hover:text-zinc-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Hash size={15} className={activeChannel === 'rust-english' ? 'text-zinc-200' : 'text-zinc-400'} />
                    <span>rust-english</span>
                  </span>
                  <span className="text-[9px] text-blue-400 font-bold tracking-wider font-mono bg-blue-500/10 px-1 rounded">EN</span>
                </button>

                {/* VIP Channel (Only visible to VIP subscribers and Admins) */}
                {isCurrentVipSub && (
                  <button
                    onClick={() => setActiveChannel('rust-vip')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition-all duration-200 group cursor-pointer ${
                      activeChannel === 'rust-vip'
                        ? 'bg-gradient-to-r from-amber-500/20 to-blue-500/10 border-l-2 border-amber-500 text-white font-bold pl-2'
                        : 'text-zinc-400 hover:bg-zinc-700/20 hover:text-zinc-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Star size={14} className={activeChannel === 'rust-vip' ? 'text-amber-400 animate-pulse' : 'text-amber-500'} />
                      <span className="bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent font-black">rust-vip</span>
                    </span>
                    <span className="text-[9px] text-amber-400 font-bold tracking-wider font-mono bg-amber-500/10 border border-amber-500/20 px-1 rounded uppercase">
                      {lang === 'ru' ? 'ПОДПИСКА' : 'SUB'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive & Dynamic Voice Channels Section */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-1.5 mb-1.5">
                <span>{lang === 'ru' ? 'ГОЛОСОВОЙ ЭФИР' : 'VOICE BROADCAST'}</span>
              </div>
              
              <div className="space-y-1">
                {/* Outpost Radio Voice Channel */}
                <button
                  onClick={() => {
                    if (!user) {
                      onToast(lang === 'ru' ? 'Войдите в аккаунт, чтобы подключиться!' : 'Log in to connect!', 'warning');
                      return;
                    }
                    const isJoined = usersMap[user.uid]?.voiceChannel === 'outpost_radio';
                    if (isJoined) {
                      leaveVoiceChannel();
                    } else {
                      joinVoiceChannel('outpost_radio');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded transition-colors group cursor-pointer ${
                    user && usersMap[user.uid]?.voiceChannel === 'outpost_radio'
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15'
                      : 'text-zinc-400 hover:bg-zinc-700/20 hover:text-zinc-200'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Volume2 size={15} className={user && usersMap[user.uid]?.voiceChannel === 'outpost_radio' ? 'text-emerald-400 animate-pulse' : 'text-zinc-400'} />
                    <span className="font-bold">🔊 Outpost Radio</span>
                    <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1 py-0.5 rounded font-mono font-bold uppercase tracking-wider leading-none shrink-0 animate-pulse">
                      {lang === 'ru' ? 'В разработке' : 'WIP'}
                    </span>
                  </span>
                  
                  {/* Dynamic voice count */}
                  <span className="text-[9px] bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.2 rounded font-mono font-bold">
                    {registeredUsers.filter(u => (u as any).voiceChannel === 'outpost_radio').length}
                  </span>
                </button>

                {/* Real-time Sub-list of active users inside the voice channel */}
                <div className="pl-3 pr-1 py-1 space-y-1.5 max-h-52 overflow-y-auto font-sans">
                  {registeredUsers
                    .filter(u => (u as any).voiceChannel === 'outpost_radio')
                    .map((vUser) => {
                      const vAvatar = SURVIVOR_AVATARS.find(a => a.id === vUser.avatarClass) || SURVIVOR_AVATARS[0];
                      const isVUserAdmin = vUser.username === 'serustqs';
                      const isVUserVip = !!vUser.isChatVip;
                      return (
                        <div key={vUser.username} className="flex items-center justify-between py-1 px-1.5 rounded bg-zinc-800/15 border border-zinc-800/5 gap-2">
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={getAvatarUrl(vUser.photoURL, vUser.avatarClass)}
                              alt={vUser.displayName}
                              className="w-5 h-5 rounded-full object-cover bg-zinc-950"
                            />
                            <span className={`text-[11px] font-semibold truncate ${
                              isVUserAdmin ? 'text-[#f87171]' : isVUserVip ? 'text-[#60a5fa]' : 'text-zinc-300'
                            }`}>
                              {vUser.displayName}
                            </span>
                          </div>
                          {/* Sound wave bouncing animations */}
                          <span className="flex gap-0.5 items-center pr-1 flex-shrink-0">
                            <span className="w-0.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <span className="w-0.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="w-0.5 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                          </span>
                        </div>
                      );
                    })}
                  
                  {registeredUsers.filter(u => (u as any).voiceChannel === 'outpost_radio').length === 0 && (
                    <span className="text-[10px] text-zinc-500 block py-1.5 pl-2 font-medium">
                      {lang === 'ru' ? 'Канал пуст' : 'Channel empty'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Discord-style Voice Connected Status Bar */}
          {user && usersMap[user.uid]?.voiceChannel === 'outpost_radio' && (
            <div className="bg-[#232428] border-t border-[#1f2023] px-3 py-2 flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 truncate text-left">
                <div className="text-emerald-500 flex items-center justify-center">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-duration-1000"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-emerald-400 block uppercase leading-none">
                    {lang === 'ru' ? 'Голосовая связь' : 'Voice Connected'}
                  </span>
                  <span className="text-[9px] text-zinc-400 truncate block font-bold mt-0.5">
                    Outpost Radio
                  </span>
                </div>
              </div>

              <button
                onClick={leaveVoiceChannel}
                className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors rounded cursor-pointer"
                title={lang === 'ru' ? 'Отключиться' : 'Disconnect'}
              >
                <PhoneOff size={14} />
              </button>
            </div>
          )}

          {/* User Account Bar at Bottom */}
          {user && (
            <div className="h-14 bg-[#232428] flex items-center justify-between px-2.5 border-t border-[#1f2023] gap-2">
              <div className="flex items-center gap-2 truncate">
                <div className="relative flex-shrink-0">
                  <img
                    src={getAvatarUrl(user.photoURL, user.avatarClass)}
                    alt="User profile"
                    className="w-8 h-8 rounded-full border border-zinc-700 object-cover bg-zinc-950"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#232428] rounded-full" />
                </div>
                <div className="text-left min-w-0">
                  <span className="text-xs font-bold text-white block truncate leading-tight">
                    {user.displayName}
                  </span>
                  <span className="text-[9px] text-zinc-400 block truncate leading-none mt-0.5">
                    @{(user as any).username || 'survivor'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-400">
                <button 
                  onClick={() => onToast(lang === 'ru' ? 'Микрофон включен' : 'Microphone active', 'success')}
                  className="p-1 hover:bg-zinc-700/40 hover:text-zinc-200 transition-all rounded cursor-pointer" 
                  title="Mute"
                >
                  <Mic size={14} />
                </button>
                <button 
                  onClick={() => onToast(lang === 'ru' ? 'Звук включен' : 'Headphones active', 'success')}
                  className="p-1 hover:bg-zinc-700/40 hover:text-zinc-200 transition-all rounded cursor-pointer" 
                  title="Deafen"
                >
                  <Headphones size={14} />
                </button>
                {isAdmin ? (
                  <button
                    onClick={() => {
                      setShowAdminPanel(!showAdminPanel);
                      onToast(showAdminPanel ? 'Админ панель скрыта' : 'Админ панель открыта', 'warning');
                    }}
                    className={`p-1 transition-all rounded cursor-pointer ${
                      showAdminPanel 
                        ? 'bg-[#5865f2] text-white' 
                        : 'hover:bg-zinc-700/40 hover:text-zinc-200 text-amber-500'
                    }`}
                    title="Admin Panel"
                  >
                    <Settings size={14} className={showAdminPanel ? 'animate-spin' : ''} />
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="p-1 hover:bg-red-500/10 hover:text-red-400 transition-all rounded cursor-pointer"
                    title={t.logoutBtn[lang]}
                  >
                    <LogOut size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. MAIN CHAT CONTAINER (CENTER) */}
        <div className="flex-1 bg-gradient-to-br from-purple-950/20 via-[#313338] to-yellow-950/20 flex flex-col h-full overflow-hidden">
          
          {/* Top Chat Header */}
          <div className="h-12 border-b border-[#1f2023] flex items-center justify-between px-4 shadow-sm bg-[#313338]/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 truncate text-left">
              <Hash size={18} className="text-zinc-400" />
              <span className="font-bold text-white text-sm">{activeChannel}</span>
              <span className="hidden sm:inline text-[11px] text-zinc-400 border-l border-zinc-700 pl-3">
                {activeChannel === 'rust-russian' 
                  ? (lang === 'ru' ? 'Чат выживших на русском языке' : 'Russian language survivors broadcast')
                  : activeChannel === 'rust-english'
                    ? (lang === 'ru' ? 'Чат выживших на английском языке' : 'English language survivors broadcast')
                    : (lang === 'ru' ? '⭐️ Закрытый чат для VIP-подписчиков и администрации' : '⭐️ Private channel for VIP Subscribers and Admins')}
              </span>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-3 text-zinc-400">
              <button 
                onClick={() => onToast(lang === 'ru' ? 'Уведомления включены' : 'Notifications on', 'success')}
                className="hover:text-zinc-200 transition-colors cursor-pointer" 
                title="Notifications"
              >
                <Bell size={16} />
              </button>
              <button 
                onClick={() => onToast(lang === 'ru' ? 'Закрепленных сообщений нет' : 'No pinned messages', 'warning')}
                className="hover:text-zinc-200 transition-colors cursor-pointer" 
                title="Pins"
              >
                <Pin size={16} />
              </button>
              {isAdmin && (
                <button 
                  onClick={() => setShowMembers(!showMembers)}
                  className={`hover:text-zinc-200 transition-colors cursor-pointer ${showMembers ? 'text-[#5865f2]' : ''}`} 
                  title="Toggle Member List"
                >
                  <Users size={16} />
                </button>
              )}
              
              {user && (
                <button
                  onClick={handleLogout}
                  className="sm:hidden p-1 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all rounded cursor-pointer"
                  title={t.logoutBtn[lang]}
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Channels Switcher Bar for Phones */}
          <div className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#2b2d31] border-b border-[#1f2023] overflow-x-auto scrollbar-none shrink-0 select-none">
            {/* Russian Channel Button */}
            <button
              onClick={() => setActiveChannel('rust-russian')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded font-bold transition-all duration-200 cursor-pointer ${
                activeChannel === 'rust-russian'
                  ? 'bg-[#35373c] text-white shadow-sm font-black'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Hash size={13} className={activeChannel === 'rust-russian' ? 'text-zinc-200' : 'text-zinc-400'} />
              <span>rust-russian</span>
              <span className="text-[8px] text-red-400 font-extrabold bg-red-500/10 px-0.5 rounded ml-0.5 font-mono">RU</span>
            </button>

            {/* English Channel Button */}
            <button
              onClick={() => setActiveChannel('rust-english')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded font-bold transition-all duration-200 cursor-pointer ${
                activeChannel === 'rust-english'
                  ? 'bg-[#35373c] text-white shadow-sm font-black'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Hash size={13} className={activeChannel === 'rust-english' ? 'text-zinc-200' : 'text-zinc-400'} />
              <span>rust-english</span>
              <span className="text-[8px] text-blue-400 font-extrabold bg-blue-500/10 px-0.5 rounded ml-0.5 font-mono">EN</span>
            </button>

            {/* VIP Channel Button */}
            {isCurrentVipSub && (
              <button
                onClick={() => setActiveChannel('rust-vip')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded font-bold transition-all duration-200 cursor-pointer ${
                  activeChannel === 'rust-vip'
                    ? 'bg-gradient-to-r from-amber-500/25 to-blue-500/15 border border-amber-500/35 text-white font-black'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Star size={13} className={activeChannel === 'rust-vip' ? 'text-amber-400 animate-pulse' : 'text-amber-500'} />
                <span className="bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent font-black">rust-vip</span>
                <span className="text-[8px] text-amber-400 font-extrabold bg-amber-500/10 px-0.5 rounded ml-0.5 font-mono uppercase">VIP</span>
              </button>
            )}

            {/* Voice Channel Connection Toggle */}
            <button
              onClick={() => {
                if (!user) {
                  onToast(lang === 'ru' ? 'Войдите в аккаунт, чтобы подключиться!' : 'Log in to connect!', 'warning');
                  return;
                }
                const isJoined = usersMap[user.uid]?.voiceChannel === 'outpost_radio';
                if (isJoined) {
                  leaveVoiceChannel();
                } else {
                  joinVoiceChannel('outpost_radio');
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded font-bold transition-all ml-auto shrink-0 border duration-200 cursor-pointer ${
                user && usersMap[user.uid]?.voiceChannel === 'outpost_radio'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/30 hover:text-zinc-300'
              }`}
            >
              <Volume2 size={12} className={user && usersMap[user.uid]?.voiceChannel === 'outpost_radio' ? 'text-emerald-400 animate-pulse' : 'text-zinc-400'} />
              <span>{lang === 'ru' ? 'Голос' : 'Voice'}</span>
              <span className="text-[8px] font-mono bg-zinc-950 px-1 py-0.5 rounded-sm text-zinc-400 font-extrabold leading-none">
                {registeredUsers.filter(u => (u as any).voiceChannel === 'outpost_radio').length}
              </span>
            </button>
          </div>

          {/* Collapsible Admin Console Section */}
          <AnimatePresence>
            {showAdminPanel && isAdmin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-[#2b2d31] border-b border-[#1f2023] p-4 text-left shadow-lg overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <ShieldAlert size={14} />
                      {lang === 'ru' ? 'ТАКТИЧЕСКИЙ ТЕРМИНАЛ СОЗДАТЕЛЯ' : 'TACTICAL FOUNDER TERMINAL'}
                    </h3>
                    <p className="text-[10px] text-zinc-400 leading-relaxed max-w-xl">
                      {lang === 'ru' 
                        ? 'Выполняйте очистку всей базы данных сообщений или управляйте пользователями прямо в панели справа.' 
                        : 'Erase all messages from Firestore or administer user lists inside the client sidebar.'}
                    </p>
                  </div>
                  <button
                    onClick={handlePurgeChat}
                    disabled={adminActionLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-45 shadow-md shadow-red-950/20"
                  >
                    <Trash2 size={13} />
                    <span>{t.clearChatBtn[lang]}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Feed / Auth Forms Area */}
          <div className="flex-1 overflow-y-auto min-h-0 relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#313338]">
                <div className="w-8 h-8 border-2 border-t-[#5865f2] border-zinc-700 rounded-full animate-spin" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                  {lang === 'ru' ? 'Подключение к частоте...' : 'CONNECTING TO FREQUENCY...'}
                </span>
              </div>
            ) : !user ? (
              /* REQUIRED LOGIN REDIRECT FOR DISCORD CHAT FEEL */
              <div className="h-full overflow-y-auto px-4 py-8 flex flex-col items-center justify-center bg-[#313338] text-center">
                <div className="w-full max-w-sm bg-[#2b2d31] border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-5">
                  <div className="w-16 h-16 bg-[#5865f2]/10 border border-[#5865f2]/20 rounded-full flex items-center justify-center mx-auto text-[#5865f2] animate-pulse">
                    <Lock size={32} />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-wide">
                      {lang === 'ru' ? 'ВХОД ОГРАНИЧЕН' : 'AUTHENTICATION REQUIRED'}
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                      {lang === 'ru' 
                        ? 'Для отправки сообщений и просмотра истории радиоэфира вам необходимо авторизоваться на сайте.' 
                        : 'To send messages and participate in the survival beacon broadcasts, please log in on the website.'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const evt = new CustomEvent('open-auth-modal');
                      window.dispatchEvent(evt);
                    }}
                    className="w-full py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <Power size={13} />
                    <span>{lang === 'ru' ? 'ВОЙТИ НА САЙТЕ' : 'LOG IN ON SITE'}</span>
                  </button>
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col gap-2 text-center py-20">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{t.emptyChat[lang]}</p>
              </div>
            ) : (
              <div className="py-4 space-y-0.5">
                {filteredMessages.map((msg) => {
                  const isOwnMessage = msg.uid === user.uid;
                  const avatarConfig = SURVIVOR_AVATARS.find(a => a.id === msg.avatarClass) || SURVIVOR_AVATARS[0];
                  const msgUser = usersMap[msg.uid] || { role: 'user', isVip: false, isChatVip: false };
                  const isMsgChatVip = !!msgUser.isChatVip;
                  const isMsgVipSub = msg.uid === 'serustqs' || !!msgUser.isVip || msgUser.role === 'admin';
                  const isMsgFounder = msg.uid === 'serustqs';
                  const isHighlighted = !!msg.isHighlighted || (activeChannel === 'rust-vip');

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex items-start gap-4 px-4 py-2.5 transition-all duration-150 relative group select-text border-l-2 ${
                        isHighlighted 
                          ? 'bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-transparent border-amber-500 shadow-[inset_1px_0_10px_rgba(245,158,11,0.03)]' 
                          : 'hover:bg-[#2e3035]/60 border-transparent'
                      }`}
                    >
                      {/* Avatar */}
                      <div 
                        className="relative flex-shrink-0 mt-0.5 cursor-pointer hover:opacity-85 transition-opacity"
                        onClick={() => setInspectUserId(msg.uid)}
                      >
                        <img referrerPolicy="no-referrer" 
                          src={getAvatarUrl(usersMap[msg.uid]?.photoURL || msg.photoURL, usersMap[msg.uid]?.avatarClass || msg.avatarClass)} 
                          alt="Avatar" 
                          className={`w-10 h-10 rounded-full border bg-zinc-900 object-cover ${
                            isMsgVipSub && !isMsgFounder
                              ? 'border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                              : 'border-zinc-700'
                          }`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== avatarConfig.url) {
                              target.src = avatarConfig.url;
                            }
                          }}
                        />
                        <div 
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#2b2d31] shadow-sm" 
                          style={{ 
                            backgroundColor: isMsgFounder 
                              ? '#f87171' 
                              : isMsgVipSub 
                                ? '#f59e0b' 
                                : isMsgChatVip 
                                  ? '#60a5fa' 
                                  : '#828292' 
                          }} 
                        />
                      </div>
                      
                      {/* Message body */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span 
                            onClick={() => setInspectUserId(msg.uid)}
                            className="text-[13px] font-bold cursor-pointer hover:underline flex items-center gap-1"
                          >
                            {usersMap[msg.uid]?.clanTag && (
                              <span className="text-[#cd412b] font-black font-mono">
                                [{usersMap[msg.uid].clanTag}]
                              </span>
                            )}
                            <span className={
                              isMsgFounder 
                                ? 'text-[#f87171]' 
                                : isMsgVipSub 
                                  ? 'bg-gradient-to-r from-amber-400 via-yellow-200 to-blue-400 bg-clip-text text-transparent font-black tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]' 
                                  : isMsgChatVip 
                                    ? 'text-[#60a5fa]' 
                                    : 'text-zinc-200'
                            }>
                              {usersMap[msg.uid]?.displayName || msg.displayName}
                            </span>
                          </span>
                          
                          {/* Role tag badge - Discord style */}
                          {isMsgFounder ? (
                            <span className="px-1.5 py-0.2 bg-[#f87171]/10 border border-[#f87171]/20 text-[#f87171] text-[8px] font-black tracking-wide uppercase rounded-md flex items-center gap-0.5">
                              👑 {t.adminTag[lang]}
                            </span>
                          ) : isMsgVipSub ? (
                            <span className="px-1.5 py-0.2 bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/30 text-amber-300 text-[8px] font-black tracking-wide uppercase rounded-md flex items-center gap-0.5 shadow-[0_0_6px_rgba(245,158,11,0.15)]">
                              ⭐ {lang === 'ru' ? 'VIP ПОДПИСКА' : 'VIP SUB'}
                            </span>
                          ) : isMsgChatVip ? (
                            <span className="px-1.5 py-0.2 bg-[#60a5fa]/10 border border-[#60a5fa]/20 text-[#60a5fa] text-[8px] font-black tracking-wide uppercase rounded-md flex items-center gap-0.5">
                              ⭐ {t.vipTag[lang]}
                            </span>
                          ) : null}

                          <span className="px-1 py-0.2 bg-zinc-800 border border-zinc-700/50 text-zinc-400 text-[8px] font-semibold tracking-wider font-mono uppercase rounded">
                            {avatarConfig.name[lang]}
                          </span>
                          
                          <span className="text-[10px] text-zinc-500 font-medium">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>

                        {/* Text block directly under name - 100% Discord style */}
                        <div className="text-zinc-200 text-sm leading-relaxed mt-1 break-words select-text">
                          {(msg as any).replyTo && (
                            <div className="bg-[#2b2d31] text-[11px] text-zinc-400 p-1.5 rounded-md border-l-2 border-zinc-600 mb-1.5 opacity-80">
                              <span className="font-bold text-zinc-300">{(msg as any).replyTo.displayName}: </span>
                              {(msg as any).replyTo.text.slice(0, 60)}{(msg as any).replyTo.text.length > 60 ? '...' : ''}
                            </div>
                          )}
                          {msg.text}
                        </div>
                      </div>

                      {/* HOVER MESSAGE ACTIONS - DISCORD STYLE FLOATING BAR */}
                      {user && (
                        <div className="absolute top-1 right-4 bg-[#313338] border border-zinc-800 rounded-lg shadow-lg py-1 px-1.5 items-center gap-1.5 flex opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => setReplyTo(msg)}
                            className="p-1 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded"
                            title={lang === 'ru' ? 'Ответить' : 'Reply'}
                          >
                            <MessageSquare size={13} />
                          </button>
                          
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer rounded"
                                title={lang === 'ru' ? 'Удалить сообщение' : 'Delete Message'}
                              >
                                <Trash2 size={13} />
                              </button>

                              {msg.uid !== 'serustqs' && (
                                <button
                                  onClick={() => handleToggleBlockUser(msg.uid, false)}
                                  className="p-1 hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer rounded"
                                  title={lang === 'ru' ? 'Забанить автора' : 'Ban Author'}
                                >
                                  <UserX size={13} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Floating Message Input Area */}
          {user && (
            <div className="bg-[#313338] border-t border-[#1f2023]/20 relative">
              {replyTo && (
                <div className="bg-[#2b2d31] p-2 px-4 text-xs text-zinc-400 flex items-center justify-between border-b border-zinc-700/50">
                  <span className="truncate">
                    {lang === 'ru' ? 'Ответ пользователю ' : 'Replying to '}
                    <b className="text-zinc-100">{replyTo.displayName}</b>: {replyTo.text.slice(0, 50)}{replyTo.text.length > 50 ? '...' : ''}
                  </span>
                  <button onClick={() => setReplyTo(null)} className="text-zinc-500 hover:text-white cursor-pointer ml-2">✕</button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-3 items-center p-4">
                <div className="relative flex-1 bg-[#383a40] focus-within:ring-1 focus-within:ring-[#5865f2] rounded-lg flex items-center px-4 transition-all">
                  
                  {/* Plus action icon inside input (Discord aesthetic) */}
                  <button
                    type="button"
                    onClick={() => onToast(lang === 'ru' ? 'Загрузка медиа временно заблокирована!' : 'Media uploads currently paused on radio wave!', 'warning')}
                    className="mr-3 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Upload File"
                  >
                    <PlusCircle size={18} />
                  </button>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t.placeholder[lang]}
                    maxLength={1000}
                    disabled={sending}
                    className="w-full bg-transparent focus:outline-none py-3 text-sm text-zinc-100 placeholder-zinc-500 disabled:opacity-50 pr-24 font-medium"
                  />

                  {/* Character counter & Emoji Trigger inside input */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isCurrentVipSub && (
                      <button
                        type="button"
                        onClick={() => {
                          setHighlightNextMessage(!highlightNextMessage);
                          onToast(
                            !highlightNextMessage 
                              ? (lang === 'ru' ? 'Выделение сообщения включено' : 'Message highlighting enabled')
                              : (lang === 'ru' ? 'Выделение сообщения выключено' : 'Message highlighting disabled'), 
                            'success'
                          );
                        }}
                        className={`p-1 cursor-pointer transition-all duration-200 rounded flex items-center justify-center ${
                          highlightNextMessage 
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 scale-110 shadow-[0_0_8px_rgba(245,158,11,0.2)] animate-pulse' 
                            : 'text-zinc-400 hover:text-amber-400 hover:scale-105'
                        }`}
                        title={lang === 'ru' ? 'Выделить сообщение' : 'Highlight message'}
                      >
                        <Sparkles size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`text-zinc-400 hover:text-amber-400 p-1 cursor-pointer transition-colors ${showEmojiPicker ? 'text-amber-400' : ''}`}
                      title="Emojis"
                    >
                      <Smile size={18} />
                    </button>
                    <span className="text-[9px] font-mono text-zinc-600 font-bold hidden sm:inline">
                      {newMessage.length}/1000
                    </span>
                  </div>
                  
                  {/* DISCORD COMPACT EMOJI PICKER POPUP */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-16 right-0 bg-[#2b2d31] border border-zinc-800 p-3 grid grid-cols-7 gap-1.5 shadow-2xl z-50 rounded-xl w-64 text-center">
                      <div className="col-span-7 flex justify-between items-center pb-1.5 border-b border-zinc-800 mb-2">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{lang === 'ru' ? 'СМАЙЛИКИ' : 'EMOJIS'}</span>
                        <button 
                          type="button" 
                          onClick={() => setShowEmojiPicker(false)} 
                          className="text-[10px] text-zinc-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                      {['😊', '😂', '🤣', '💀', '👍', '🔥', '💩', '🤬', '🤡', '🤝', '📦', '🛠️', '🔫', '💣', '🏹', '🩸', '❤️', '🛡️', '🔑', '⛺', '🌲', '🪵', '🌋', '🚁', '🛶', '🎯', '⛏️', '🍖'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setNewMessage(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="w-7 h-7 text-sm flex items-center justify-center hover:bg-zinc-700 transition-colors cursor-pointer rounded-md active:scale-90"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Send Button */}
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="w-10 h-10 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-30 disabled:hover:bg-[#5865f2] text-white flex items-center justify-center cursor-pointer transition-colors rounded-lg flex-shrink-0 shadow-md"
                  title={t.sendBtn[lang]}
                >
                  <Send size={15} className={sending ? 'animate-pulse' : ''} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 3. DISCORD ACTIVE MEMBERS LIST (RIGHT SIDEBAR) */}
        {showMembers && user && isAdmin && (
          <div className="w-56 bg-[#2b2d31] border-l border-[#1f2023] flex flex-col hidden lg:flex select-none">
            <div className="h-12 border-b border-[#1f2023] flex items-center px-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'ru' ? 'База Выживших' : 'Active Survivors'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Category: Administrators */}
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block px-1 mb-2">
                  {lang === 'ru' ? 'АДМИНИСТРАЦИЯ' : 'FOUNDERS'} — 1
                </span>
                
                {/* Admin user display */}
                <div className="flex items-center gap-2 px-1.5 py-1 hover:bg-zinc-700/20 rounded cursor-pointer group">
                  <div className="relative">
                    <img referrerPolicy="no-referrer" 
                      src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=80" 
                      alt="serustqs" 
                      className="w-7 h-7 rounded-full object-cover bg-zinc-950 border border-red-500/30"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 border border-[#2b2d31] rounded-full" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <span className="text-xs font-bold text-red-400 block truncate">
                      serustqs
                    </span>
                    <span className="text-[8px] text-red-300 font-semibold block uppercase font-mono tracking-tight leading-none mt-0.5">
                      👑 OWNER / DEVELOPER
                    </span>
                  </div>
                </div>
              </div>

              {/* Category: Normal users list */}
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block px-1 mb-2 mt-4">
                  {lang === 'ru' ? 'В СЕТИ' : 'ONLINE SURVIVORS'} — {registeredUsers.filter(u => u.username !== 'serustqs').length}
                </span>

                <div className="space-y-1">
                  {registeredUsers
                    .filter(u => u.username !== 'serustqs')
                    .map((u) => {
                      const userAvatar = SURVIVOR_AVATARS.find(a => a.id === u.avatarClass) || SURVIVOR_AVATARS[0];
                      const isChatVip = !!u.isChatVip;
                      return (
                        <div 
                          key={u.username} 
                          onClick={() => setInspectUserId(u.username)}
                          className="flex items-center justify-between p-1.5 hover:bg-zinc-700/30 rounded-lg group transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="relative">
                              <img referrerPolicy="no-referrer" 
                                src={getAvatarUrl(u.photoURL, u.avatarClass)} 
                                alt={u.displayName} 
                                className="w-7 h-7 rounded-full object-cover bg-zinc-950 border border-zinc-800"
                              />
                              <span className={`absolute bottom-0 right-0 w-2 h-2 ${u.isBlocked ? 'bg-red-500' : 'bg-emerald-500'} border border-[#2b2d31] rounded-full`} />
                            </div>
                            <div className="text-left min-w-0">
                              <span className={`text-xs font-bold block truncate ${
                                isChatVip ? 'text-blue-400' : 'text-zinc-300'
                              }`}>
                                {u.displayName}
                              </span>
                              <span className="text-[8px] text-zinc-500 block truncate font-mono leading-none">
                                {isChatVip ? '⭐ VIP SURVIVOR' : userAvatar.name[lang]}
                              </span>
                            </div>
                          </div>

                          {/* Quick Moderator actions right inside Member List item on hover */}
                          {isAdmin && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleEacTag(u.username, u.clanTag === 'EAC'); }}
                                disabled={adminActionLoading}
                                className={`p-1 border rounded text-[8px] font-black uppercase transition-colors cursor-pointer ${
                                  u.clanTag === 'EAC' 
                                    ? 'bg-red-600/30 border-red-500/50 text-red-400' 
                                    : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:text-white'
                                }`}
                                title={u.clanTag === 'EAC' ? (lang === 'ru' ? 'Забрать [EAC]' : 'Revoke [EAC]') : (lang === 'ru' ? 'Выдать [EAC]' : 'Grant [EAC]')}
                              >
                                EAC
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleVipUser(u.username, !!u.isChatVip); }}
                                disabled={adminActionLoading}
                                className={`p-1 border rounded text-[8px] font-black uppercase transition-colors cursor-pointer ${
                                  u.isChatVip 
                                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' 
                                    : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:text-white'
                                }`}
                                title={u.isChatVip ? t.unvipBtn[lang] : t.vipBtn[lang]}
                              >
                                VIP
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleBlockUser(u.username, u.isBlocked); }}
                                disabled={adminActionLoading}
                                className={`p-1 border rounded text-[8px] font-black uppercase transition-colors cursor-pointer ${
                                  u.isBlocked 
                                    ? 'bg-red-600/20 border-red-500/40 text-red-400' 
                                    : 'bg-zinc-800 border-zinc-700 text-amber-500 hover:text-white'
                                }`}
                                title={u.isBlocked ? t.unblockUserBtn[lang] : t.blockUserBtn[lang]}
                              >
                                {u.isBlocked ? 'UNBAN' : 'BAN'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {registeredUsers.filter(u => u.username !== 'serustqs').length === 0 && (
                    <span className="text-[9px] text-zinc-500 font-medium block py-2 text-center">
                      {lang === 'ru' ? 'Нет других выживших' : 'No other survivors online'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC PROFILE CARD INSPECTOR MODAL */}
      <AnimatePresence>
        {inspectUserId && (
          <UserProfileModal
            isOpen={!!inspectUserId}
            onClose={() => setInspectUserId(null)}
            targetUserId={inspectUserId}
            currentUser={user}
            lang={lang}
            onToast={onToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
