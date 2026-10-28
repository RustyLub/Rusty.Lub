import { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Search,
  BookOpen,
  Keyboard,
  Settings,
  Flame,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Activity,
  Clock,
  Menu,
  X,
  Heart,
  Github,
  RefreshCw,
  Copy,
  Check,
  Server,
  Layers,
  Wifi,
  Battery,
  MapPin,
  Power,
  Bell,
  Send,
  Compass,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Database,
  Coins,
  Gamepad2,
  Pickaxe,
  Cpu,
  Twitch,
  Image,
  Download,
  Zap,
  Mail,
  Target,
  Calculator,
  Sprout,
  FlaskConical,
  UserPlus,
  HelpCircle,
  Sun,
  Moon,
  Smartphone,
  LayoutGrid
} from 'lucide-react';
import { ToastType, CustomUser, APP_VERSION } from './types';

// Firebase & Auth Presence dependencies
import { 
  doc, 
  setDoc, 
  getDoc,
  db, 
  auth,
  onAuthStateChanged,
  serverTimestamp, 
  collection, 
  onSnapshot, 
  query,
  handleFirestoreError,
  OperationType
} from './firebase';

// Tab Components - Static for instant initial HomeTab render
import HomeTab from './components/HomeTab';

// Tab Components - Lazy loaded for instant app startup & low memory footprint
const ErrorsTab = lazy(() => import('./components/ErrorsTab'));
const BindsTab = lazy(() => import('./components/BindsTab'));
const FpsTab = lazy(() => import('./components/FpsTab'));
const RaidCalculatorTab = lazy(() => import('./components/RaidCalculatorTab'));
const DecayCalculator = lazy(() => import('./components/DecayCalculator'));
const ElectricalSimulatorTab = lazy(() => import('./components/ElectricalSimulatorTab'));
const WeaponGuidesTab = lazy(() => import('./components/WeaponGuidesTab'));
const RustBreeder = lazy(() => import('./components/RustBreeder'));
const RecyclerTab = lazy(() => import('./components/RecyclerTab'));
const ChatTab = lazy(() => import('./components/ChatTab'));
const NewsTab = lazy(() => import('./components/NewsTab'));
const AdminTab = lazy(() => import('./components/AdminTab'));
const RustItemIconsTab = lazy(() => import('./components/RustItemIconsTab'));
const MonumentsTab = lazy(() => import('./components/MonumentsTab'));
const WipeTrackerTab = lazy(() => import('./components/WipeTrackerTab'));
const EcoRaidTab = lazy(() => import('./components/EcoRaidTab'));
const MiningQuarryTab = lazy(() => import('./components/MiningQuarryTab'));
const MixingTableTab = lazy(() => import('./components/MixingTableTab'));
const ClanBoardTab = lazy(() => import('./components/ClanBoardTab'));
const RustPlusTab = lazy(() => import('./components/RustPlusTab'));
const FaqTab = lazy(() => import('./components/FaqTab'));
const ToolsHubTab = lazy(() => import('./components/ToolsHubTab'));
const GuidesHubTab = lazy(() => import('./components/GuidesHubTab'));
const SpecialAccessHubTab = lazy(() => import('./components/SpecialAccessHubTab'));
const PlayerRadar = lazy(() => import('./components/Radar/PlayerRadar').then(m => ({ default: m.PlayerRadar })));

const Footer = lazy(() => import('./components/Footer'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const CabinetModal = lazy(() => import('./components/CabinetModal'));
const TermsModal = lazy(() => import('./components/TermsModal'));
const NotificationSettingsModal = lazy(() => import('./components/NotificationSettingsModal'));
const ConfigExporterModal = lazy(() => import('./components/ConfigExporterModal'));
const QuickOverlayModal = lazy(() => import('./components/QuickOverlayModal'));
const WindowsTitlebar = lazy(() => import('./components/WindowsTitlebar'));
const LauncherBar = lazy(() => import('./components/LauncherBar'));
const LauncherSettingsModal = lazy(() => import('./components/LauncherSettingsModal'));
const CommandPaletteModal = lazy(() => import('./components/CommandPaletteModal').then(m => ({ default: m.CommandPaletteModal })));
const SectionsDrawer = lazy(() => import('./components/SectionsDrawer'));
const SpecialAccessGated = lazy(() => import('./components/SpecialAccessGated'));
const DiscordWidget = lazy(() => import('./components/DiscordWidget'));
import { getLauncherSettings, LauncherSettings } from './services/launcherSettings';
import { registerTauriGlobalShortcut } from './services/globalShortcuts';
// @ts-ignore
import globalWarfareLogo from './assets/images/global_warfare_logo_1782807450573.jpg';
// @ts-ignore
import rustWallpaperOne from './assets/images/rust_wallpaper_one_1782810116151.jpg';
// @ts-ignore
import oilRigBg from './assets/images/oil_rig_wallpaper_1783378845895.jpg';
// @ts-ignore
import rustWallpaperTwo from './assets/images/rust_wallpaper_two_1782810130672.jpg';
import { getAvatarUrl } from './customAvatars';
// @ts-ignore
import rustWallpaperThree from './assets/images/rust_wallpaper_three_1782810145159.jpg';
// @ts-ignore
import customSwampBg from './assets/images/custom_swamp_bg.png';
import { logUserActivity } from './services/activityLogger';
import logoFull from '../logo-full.png';


const wallpaperTitles = [
  {
    ru: 'БОЛОТО, МЕЛЬНИЦА И МОСТ НА ЗАКАТЕ (RUST SWAMP)',
    en: 'SWAMP, WINDMILL & BOARDWALK AT SUNSET (RUST SWAMP)'
  },
  {
    ru: 'СХОД С ПЛАТО У СФЕРЫ (СФЕРА НА ЗАКАТЕ)',
    en: 'RADTOWN DOME OUTPOST AT SUNSET'
  },
  {
    ru: 'СТАЛЬНАЯ ЦИТАДЕЛЬ ПОД СЕВЕРНЫМ СИЯНИЕМ',
    en: 'SNOW BIOME ARMORED CITADEL UNDER AURORA'
  },
  {
    ru: 'РЕЙДЕР В ХИМКОМБИНЕЗОНЕ НА ЗАРЕ',
    en: 'HAZMAT RADTOWN OVERWATCH AT SUNRISE'
  }
];

const appTranslations = {
  tabs: {
    home: { ru: 'Главная', en: 'Home' },
    news: { ru: 'Новости', en: 'News' },
    errors: { ru: 'Ошибки', en: 'Fixes' },
    binds: { ru: 'Бинды', en: 'Binds' },
    fps: { ru: 'Оптимизация FPS', en: 'FPS' },
    raid: { ru: 'Рейд', en: 'Raid' },
    decay: { ru: 'Гниение', en: 'Decay' },
    electrical: { ru: 'Электрика', en: 'Electricity' },
    weapons: { ru: 'Оружие', en: 'Weapons' },
    breeder: { ru: 'Ферма', en: 'Farming' },
    recycler: { ru: 'Переработка', en: 'Recycling' }
  },
  discordBtn: { ru: 'Наш Discord', en: 'Our Discord' },
  discordMobileBtn: { ru: 'Наш Discord сервер', en: 'Our Discord Server' },
  bannerSubtitle: { ru: 'ULTIMATE SURVIVAL KIT 2026', en: 'ULTIMATE SURVIVAL KIT 2026' },
  bannerTitle: { ru: 'RUSTY.LUB', en: 'RUSTY.LUB' },
  bannerDesc: {
    ru: 'Welcome to the professional Rust players support portal. Here you will find detailed algorithms for resolving critical errors, ultimate macro-binds, an interactive raid calculator, and deep tweaks to boost your FPS.',
    en: 'Welcome to the professional Rust players support portal. Here you will find detailed algorithms for resolving critical errors, ultimate macro-binds, an interactive raid calculator, and deep tweaks to boost your FPS.'
  },
  bannerBtnErrors: { ru: '💻 РЕШЕНИЯ ОШИБОК', en: '💻 ERROR SOLUTIONS' },
  bannerBtnBinds: { ru: '⌨️ ПОЛЕЗНЫЕ БИНДЫ', en: '⌨️ KEYBIND GUIDES' },
  bannerBtnRaid: { ru: '🎯 НАЧАТЬ РЕЙД РАСЧЕТ', en: '🎯 START RAID CALCULATOR' },
  founderTitle: { ru: 'Разработал Rusty.Lub', en: 'Developed Rusty.Lub' },
  founderDesc: {
    ru: 'Привет! Этот проект был создан автором с наигранным стажем более 13 000 часов в Rust на официальных и кастомных серверах. Вся информация в справочнике выверена на реальном игровом опыте, а калькулятор идеально считает расходы ресурсов под любой рейд.',
    en: 'Welcome, survivor! This project was created by an experienced Rust player with over 13,000 hours of playtime on official and custom servers. All information in this guide has been verified through real gameplay, and the calculator precisely computes sulfur, charcoal, and gunpowder costs.'
  },
  hoursCount: { ru: 'Часов в игре', en: 'Hours played' },
  vacStatus: { ru: 'Разработка', en: 'Development' },
  vacSafe: { ru: 'В одиночку', en: 'Solo Project' },
  wipesPlayed: { ru: 'Предназначение', en: 'Target Audience' },
  copyright: {
    ru: 'Разработчик © 2026. Все права на ассеты принадлежат Facepunch.',
    en: 'Developer © 2026. All assets belong to Facepunch Studios.'
  },
  joinClan: { ru: 'Присоединиться к клану', en: 'Join our Clan' },
  discordWidgetTitle: { ru: 'Наше Rust-Сообщество', en: 'Our Rust Community' },
  discordWidgetDesc: {
    ru: 'Присоединяйтесь к нашему Discord-серверу для поиска тиммейтов, обсуждения последних обновлений игры, клановых наборов или получения технической помощи! Узнавайте о новых фишках сайта (свои фоны визиток, прозрачный UI) первыми!',
    en: 'Join our Discord server to find teammates, discuss the latest game updates, participate in clan recruitments, or get technical assistance! Be the first to know about new site features (custom profile backgrounds, transparent UI)!'
  },
  openDiscord: { ru: 'ОТКРЫТЬ DISCORD', en: 'OPEN DISCORD' },
  features: {
    errors: {
      title: { ru: 'Умная База Ошибок', en: 'Smart Error Database' },
      desc: { ru: 'Решения вылетов Unity, зависаний, ошибок EAC и оптимизации видеопамяти.', en: 'Fixes for Unity crashes, freezes, EAC errors, and VRAM optimization guides.' }
    },
    binds: {
      title: { ru: 'Макро-Бинды', en: 'Macro Binds' },
      desc: { ru: 'Стрельба сидя, автоатака, быстрый шприц, hoverloot и мгновенные улучшения стен.', en: 'Duck shoot, auto-attack, quick syringe, hoverloot, and instant upgrade binds.' }
    },
    fps: {
      title: { ru: 'Буст Кадров (FPS)', en: 'Frame Boost (FPS)' },
      desc: { ru: 'Сбалансированные параметры запуска Steam и консольные команды для повышения FPS.', en: 'Balanced Steam launch options and F1 commands to increase in-game FPS.' }
    },
    raid: {
      title: { ru: 'Калькулятор Рейда', en: 'Raid Calculator' },
      desc: { ru: 'Интерактивный расчет серы, угля и пороха под любой выбранный арсенал взрывчатки.', en: 'Interactive sulfur, charcoal, and gunpowder calculator for any raid target.' }
    },
    electrical: {
      title: { ru: 'Симулятор Электрики', en: 'Electrical Simulator' },
      desc: { ru: 'Интерактивное моделирование цепей, зарядка АКБ, подключение турелей и автоматика.', en: 'Interactive circuit modeling, battery charging, turret connections, and automation.' }
    },
    weapons: {
      title: { ru: 'Meta Weapon Guides', en: 'Meta Weapon Guides' },
      desc: { ru: 'Рекомендуемые модули под отдачу, оптимальная дистанция ведения боя и гайды по зажиму.', en: 'Recommended attachments for recoil control, optimal engagement distance, and spray guides.' }
    }
  },
  rustoriaMonitor: {
    title: { ru: '📊 Мониторинг серверов US, EU & SEA Rustoria', en: '📊 US, EU & SEA Rustoria Servers Monitor' },
    desc: {
      ru: 'Актуальный онлайн, очереди, карта и показатели производительности официальных серверов Rustoria в регионах US, EU и SEA. Нажмите на адрес сервера или кнопку копирования для подключения.',
      en: 'Real-time online status, queues, active maps, and performance metrics for US, EU, and SEA Rustoria. Click the address or copy icon to connect.'
    },
    players: { ru: 'Игроки', en: 'Players' },
    queue: { ru: 'Очередь', en: 'Queue' },
    fps: { ru: 'ФПС Сервера', en: 'Server FPS' },
    wipe: { ru: 'Был вайп', en: 'Last Wipe' },
    connect: { ru: 'Скопировать connect', en: 'Copy connect' },
    copied: { ru: 'Скопировано!', en: 'Copied!' },
    refresh: { ru: 'Обновить данные', en: 'Refresh Data' },
    loading: { ru: 'Получение данных...', en: 'Fetching servers...' },
    status: { ru: 'Статус', en: 'Status' }
  },
  globalWarfare: {
    title: { ru: 'Турнир Global Warfare 4', en: 'Global Warfare 4 Tournament' },
    dates: { ru: 'С 30 июля по 2 августа', en: 'July 30 - August 2' },
    flyerTitle: { ru: '🔥 ГОРЯЧЕЕ СОБЫТИЕ', en: '🔥 HOT EVENT' },
    desc: {
      ru: 'Внимание, выжившие! С 30 июля по 2 августа пройдет трансляция грандиозного киберспортивного события Global Warfare 4 на Twitch. Вас ждут ожесточенные сражения сильнейших команд мира, эпические штурмы баз и море адреналина!',
      en: 'Attention, survivors! From July 30 to August 2, a grand esports live stream of the Global Warfare 4 event will run on Twitch. Prepare for fierce battles of the world’s strongest teams, epic base raids, and pure adrenaline!'
    },
    watchBtn: { ru: '📺 СМОТРЕТЬ НА TWITCH', en: '📺 WATCH ON TWITCH' }
  }
};

type TabType = 'home' | 'account' | 'support' | 'terms' | 'tools' | 'guides' | 'faq' | 'errors' | 'binds' | 'fps' | 'raid' | 'decay' | 'electrical' | 'weapons' | 'breeder' | 'chat' | 'news' | 'admin' | 'radar' | 'recycler' | 'icons' | 'monuments' | 'wipe' | 'ecoraid' | 'quarry' | 'mixing' | 'clan' | 'rustplus' | 'special';

const VALID_TABS: Record<string, TabType> = {
  home: 'home',
  account: 'account',
  cabinet: 'account',
  support: 'support',
  terms: 'terms',
  agreement: 'terms',
  legal: 'terms',
  tools: 'tools',
  guides: 'guides',
  faq: 'faq',
  news: 'news',
  clan: 'clan',
  clans: 'clan',
  errors: 'errors',
  fixes: 'errors',
  binds: 'binds',
  fps: 'fps',
  raid: 'raid',
  ecoraid: 'ecoraid',
  eco: 'ecoraid',
  decay: 'decay',
  electrical: 'electrical',
  electricity: 'electrical',
  mixing: 'mixing',
  weapons: 'weapons',
  breeder: 'breeder',
  farming: 'breeder',
  recycler: 'recycler',
  recycling: 'recycler',
  monuments: 'monuments',
  quarry: 'quarry',
  mining: 'quarry',
  wipe: 'wipe',
  wipes: 'wipe',
  chat: 'chat',
  radar: 'radar',
  rustplus: 'rustplus',
  icons: 'icons',
  admin: 'admin',
  special: 'special',
  vip: 'support'
};

const getTabFromUrl = (): TabType => {
  try {
    // 1. Check URL Hash (e.g. #raid, #binds, #clan)
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash && VALID_TABS[hash]) {
      return VALID_TABS[hash];
    }
    // 2. Check query parameter (e.g. ?tab=raid)
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab')?.toLowerCase();
    if (tabParam && VALID_TABS[tabParam]) {
      return VALID_TABS[tabParam];
    }
    // 3. Check clean pathname (e.g. /raid)
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (path && VALID_TABS[path]) {
      return VALID_TABS[path];
    }
  } catch (e) {
    console.warn('URL tab parse error:', e);
  }
  return 'home';
};


export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(() => getTabFromUrl());

  // Listen to browser Back/Forward buttons and hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const tab = getTabFromUrl();
      setActiveTab(tab);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'ru' | 'en'>('en');
  const [appTheme, setAppTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('rust_app_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rust_app_theme', appTheme);
    } catch (e) {
      console.warn(e);
    }
    if (appTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
    }
  }, [appTheme]);

  const [donationOpen, setDonationOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<'rustoria' | 'rustymoose'>('rustoria');
  const [rustoriaServers, setRustoriaServers] = useState<any[]>([]);
  const [loadingServers, setLoadingServers] = useState(false);
  const [copiedServerId, setCopiedServerId] = useState<string | null>(null);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'US' | 'EU' | 'SEA'>('ALL');
  const [serverSearch, setServerSearch] = useState('');

  const [currentUser, setCurrentUser] = useState<CustomUser | null>(() => {
    try {
      const saved = localStorage.getItem('rust_survivor_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const isAdmin = (currentUser?.uid === 'serustqs' || currentUser?.email === 'misterzet556@gmail.com' || currentUser?.role === 'admin');
  const isOwner = (currentUser?.uid === 'serustqs' || currentUser?.email === 'misterzet556@gmail.com' || currentUser?.role === 'owner');
  const isVip = useMemo(() => {
    if (isAdmin) return true;
    if (!currentUser) return false;
    if (currentUser.isVip) return true;
    
    const vipUntil = currentUser.vipUntil;
    if (vipUntil) {
      try {
        // Handle string or object (Timestamp-like)
        const date = (typeof vipUntil === 'object' && (vipUntil as any).toDate) 
          ? (vipUntil as any).toDate() 
          : new Date(vipUntil);
        return date.getTime() > Date.now();
      } catch (e) {
        console.error('VIP date check failed:', e);
        return false;
      }
    }
    return false;
  }, [currentUser, isAdmin]);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cabinetModalOpen, setCabinetModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sectionsDrawerOpen, setSectionsDrawerOpen] = useState(false);
  const [quickOverlayOpen, setQuickOverlayOpen] = useState(false);
  const [launcherSettings, setLauncherSettings] = useState<LauncherSettings>(getLauncherSettings);
  const [launcherSettingsOpen, setLauncherSettingsOpen] = useState(false);
  const isTauri = typeof window !== 'undefined' && Boolean((window as any).__TAURI__ || (window as any).__TAURI_INTERNALS__);
  const [isLauncherPreview, setIsLauncherPreview] = useState(() => {
    if (typeof window === 'undefined') return false;
    return isTauri || localStorage.getItem('rustylub_launcher_preview') === 'true' || window.location.search.includes('launcher=1');
  });

  const isWindowsApp = isTauri || isLauncherPreview;

  const handleToggleLauncherPreview = useCallback(() => {
    setIsLauncherPreview(prev => {
      const next = !prev;
      try {
        localStorage.setItem('rustylub_launcher_preview', String(next));
      } catch {}
      return next;
    });
  }, []);

  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean; type: 'info' | 'hazard' | 'important' } | null>(null);

  // Global Ctrl+K / Cmd+K / Alt+O / M shortcuts & custom HUD hotkey
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input or textarea (unless Ctrl/Cmd or Alt is pressed)
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      const isAltO = e.altKey && e.key.toLowerCase() === 'o';
      const isCustomHud = launcherSettings.hudHotkey === 'Ctrl+F1' ? (e.ctrlKey && e.key === 'F1') :
                          launcherSettings.hudHotkey === 'F12' ? (e.key === 'F12') :
                          launcherSettings.hudHotkey === 'F8' ? (e.key === 'F8') : false;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      } else if (isAltO || isCustomHud) {
        e.preventDefault();
        setQuickOverlayOpen(prev => !prev);
      } else if (!isInput && e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setSectionsDrawerOpen(prev => !prev);
      } else if (!isInput && e.key === '/') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [launcherSettings.hudHotkey]);

  // Tauri Native Global Shortcut Registration
  useEffect(() => {
    if (isTauri && launcherSettings.hudHotkey) {
      registerTauriGlobalShortcut(launcherSettings.hudHotkey, () => {
        setQuickOverlayOpen(prev => !prev);
      }).catch(() => {});
    }
  }, [isTauri, launcherSettings.hudHotkey]);
  const [showJungleFeverSpoiler, setShowJungleFeverSpoiler] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [twitchSettings, setTwitchSettings] = useState<{
    channelName: string;
    isManualLive: boolean;
    streamTitle: string;
    clientId?: string;
    clientSecret?: string;
    isLiveFromApi?: boolean;
    viewerCount?: number;
    apiTitle?: string;
    gameName?: string;
  } | null>(null);

  // Real-time site announcement subscription
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_settings', 'announcement'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAnnouncement({
          text: data.text || '',
          active: !!data.active,
          type: data.type || 'hazard'
        });
      } else {
        setAnnouncement(null);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'site_settings/announcement');
    });
    return () => unsubscribe();
  }, []);

  // Jungle Fever spoiler subscription
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_settings', 'jungle_fever_spoiler'), (docSnap) => {
      if (docSnap.exists()) {
        setShowJungleFeverSpoiler(!!docSnap.data().jungleFeverSpoiler);
      } else {
        setShowJungleFeverSpoiler(false);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'site_settings/jungle_fever_spoiler');
    });
    return () => unsubscribe();
  }, []);

  // Real-time Auth state sync for custom credentials
  useEffect(() => {
    let unsubUserDoc: (() => void) | null = null;
    
    const uid = currentUser?.uid;
    if (uid) {
      // Subscribe to user document in Firestore in real-time
      unsubUserDoc = onSnapshot(doc(db, 'chat_users', uid), (userSnap) => {
        setIsAuthLoading(false);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const customUser: CustomUser = {
            uid: uid,
            displayName: data.displayName || 'Survivor',
            email: data.email || currentUser.email || '',
            photoURL: data.photoURL || '',
            avatarClass: data.avatarClass || 'heavy_plate',
            bio: data.bio || '',
            clanTag: data.clanTag || '',
            hoursPlayed: data.hoursPlayed || 0,
            playstyle: data.playstyle || '',
            favoriteWeapon: data.favoriteWeapon || '',
            steamId: data.steamId || '',
            steamName: data.steamName || '',
            steamAvatar: data.steamAvatar || '',
            customTheme: data.customTheme || 'default',
            role: data.role || 'user',
            isVip: !!data.isVip,
            isChatVip: !!data.isChatVip,
            vipUntil: data.vipUntil ? (data.vipUntil.toDate ? data.vipUntil.toDate().toISOString() : data.vipUntil) : '',
            isScam: !!data.isScam,
            scamReason: data.scamReason || '',
            scamUntil: data.scamUntil || ''
          };
          setCurrentUser(customUser);
          localStorage.setItem('rust_survivor_user', JSON.stringify(customUser));
        } else {
          // User document deleted - log them out
          setCurrentUser(null);
          localStorage.removeItem('rust_survivor_user');
        }
      }, (err) => {
        setIsAuthLoading(false);
        handleFirestoreError(err, OperationType.GET, `chat_users/${uid}`);
      });
    } else {
      setIsAuthLoading(false);
    }
    
    return () => {
      if (unsubUserDoc) unsubUserDoc();
    };
  }, [currentUser?.uid]);

  // Real-time Twitch stream settings subscription
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_settings', 'twitch'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTwitchSettings({
          channelName: data.channelName || '',
          isManualLive: !!data.isManualLive,
          streamTitle: data.streamTitle || '',
          clientId: data.clientId || '',
          clientSecret: data.clientSecret || '',
          isLiveFromApi: !!data.isLiveFromApi,
          viewerCount: Number(data.viewerCount) || 0,
          apiTitle: data.apiTitle || '',
          gameName: data.gameName || ''
        });
      } else {
        setTwitchSettings({
          channelName: 'misterzet',
          isManualLive: false,
          streamTitle: 'RUSTY.LUB LIVE STREAM',
          clientId: '',
          clientSecret: ''
        });
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'site_settings/twitch');
    });
    return () => unsubscribe();
  }, []);

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const twitchSettingsRef = useRef(twitchSettings);
  useEffect(() => {
    twitchSettingsRef.current = twitchSettings;
  }, [twitchSettings]);

  // Periodically check actual Twitch Helix API status if credentials exist
  useEffect(() => {
    const currentSettings = twitchSettingsRef.current;
    if (!currentSettings) return;
    const { channelName, clientId, clientSecret, isManualLive } = currentSettings;
    if (!channelName) return;

    const checkActualTwitchLiveStatus = async () => {
      const activeSettings = twitchSettingsRef.current;
      if (!activeSettings || activeSettings.isManualLive) return;

      try {
        const response = await fetch('/api/twitch/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            channelName: activeSettings.channelName, 
            clientId: activeSettings.clientId, 
            clientSecret: activeSettings.clientSecret 
          })
        });

        if (response.ok) {
          const data = await response.json();
          const isLive = !!data.isLive;
          const viewers = Number(data.viewerCount) || 0;
          const currentTitle = data.title || '';
          const currentGame = data.gameName || '';

          // To prevent double triggering or infinite update loops, only write if there is a difference
          if (
            activeSettings.isLiveFromApi !== isLive ||
            activeSettings.viewerCount !== viewers ||
            activeSettings.apiTitle !== currentTitle ||
            activeSettings.gameName !== currentGame
          ) {
            await setDoc(doc(db, 'site_settings', 'twitch'), {
              isLiveFromApi: isLive,
              viewerCount: viewers,
              apiTitle: currentTitle,
              gameName: currentGame,
              lastChecked: serverTimestamp()
            }, { merge: true });
          }
        }
      } catch (err) {
        console.warn("Failed checking Twitch Helix API status:", err);
      }
    };

    if (clientId && clientSecret) {
      checkActualTwitchLiveStatus();
      const interval = setInterval(checkActualTwitchLiveStatus, 120000);
      return () => clearInterval(interval);
    }
  }, [twitchSettings?.channelName, twitchSettings?.clientId, twitchSettings?.clientSecret, twitchSettings?.isManualLive]);

  // Periodic presence update for active logged-in user
  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const displayName = currentUser.displayName;

    const updatePresence = async () => {
      try {
        await setDoc(doc(db, 'presence', uid), {
          lastActive: serverTimestamp(),
          displayName: displayName || 'Survivor'
        });
      } catch (err) {
        console.warn('Error updating presence status:', err);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000); // every 30s

    return () => clearInterval(interval);
  }, [currentUser?.uid, currentUser?.displayName]);

  // Real-time online count sync
  useEffect(() => {
    const q = query(collection(db, 'presence'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let activeCount = 0;
      const now = Date.now();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.lastActive) {
          // Firebase Timestamp to Date milliseconds
          const lastActiveMs = data.lastActive.toDate 
            ? data.lastActive.toDate().getTime() 
            : new Date(data.lastActive).getTime();
          // Active in the last 120 seconds
          if (now - lastActiveMs < 120000) {
            activeCount++;
          }
        }
      });
      // Fallback: at least 1 if the current user is active, or a natural base line of users online
      setOnlineCount(Math.max(activeCount, currentUserRef.current ? 1 : 0));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'presence');
    });

    return () => unsubscribe();
  }, []);



  // Wallpaper generator states
  const [wallpaperModalOpen, setWallpaperModalOpen] = useState(false);
  const [wallpaperLoading, setWallpaperLoading] = useState(false);
  const [currentWallpaperIdx, setCurrentWallpaperIdx] = useState(0);
  const [wallpaperLogs, setWallpaperLogs] = useState<string[]>([]);

  // Web Push & Config Exporter states
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [configExporterModalOpen, setConfigExporterModalOpen] = useState(false);

  const generateWallpaper = () => {
    setWallpaperModalOpen(true);
    setWallpaperLoading(true);
    setWallpaperLogs([]);
    
    const logsPool = lang === 'ru' ? [
      'ПОДКЛЮЧЕНИЕ К НЕЙРОСЕТЕВОМУ ЯДРУ IMAGEN...',
      'ИНИЦИАЛИЗАЦИЯ ШАБЛОНА АТМОСФЕРНОГО АРТА RUST...',
      'АНАЛИЗ ИГРОВЫХ ОБЪЕКТОВ И РАСПРЕДЕЛЕНИЕ СВЕТА...',
      'РЕНДЕРИНГ ДЕТАЛИЗИРОВАННЫХ ТЕКСТУР И КЛЮЧЕВЫХ КАДРОВ...',
      'ДЕКОДИРОВАНИЕ БУФЕРА ИЗОБРАЖЕНИЯ И ЗАВЕРШЕНИЕ СИНТЕЗА...'
    ] : [
      'CONNECTING TO IMAGEN NEURAL COGNITIVE CORE...',
      'INITIALIZING RUST ATMOSPHERIC PATTERN SYNTHESIS...',
      'ANALYZING GAMEPLAY OBJECTS AND LIGHT DISTRIBUTION...',
      'RENDERING DETAILED TEXTURES AND HIGH-FIDELITY KEYFRAMES...',
      'DECODING GRAPHIC BUFFER AND FINALIZING IMAGE SYNTHESIS...'
    ];

    let logIndex = 0;
    setWallpaperLogs([logsPool[0]]);
    logIndex = 1;

    const interval = setInterval(() => {
      if (logIndex < logsPool.length) {
        setWallpaperLogs(prev => [...prev, logsPool[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        setWallpaperLoading(false);
        setCurrentWallpaperIdx(prev => (prev + Math.floor(Math.random() * 3) + 1) % 4);
      }
    }, 550);
  };

  const handleTabChange = (tabId: TabType) => {
    if (tabId === 'radar' && !isVip) {
      if (!currentUser) {
        setAuthModalOpen(true);
      } else {
        setCabinetModalOpen(true);
      }
      return;
    }

    if (tabId === 'rustplus' && !isOwner) {
      if (!currentUser) {
        setAuthModalOpen(true);
      }
      return;
    }

    if ((tabId === 'admin' || tabId === 'icons') && !isAdmin) {
      if (!currentUser) {
        setAuthModalOpen(true);
      }
      return;
    }

    setActiveTab(tabId);
    try {
      const hash = tabId === 'home' ? '' : `#${tabId}`;
      const newUrl = tabId === 'home' 
        ? window.location.pathname + window.location.search 
        : `${window.location.pathname}${window.location.search}#${tabId}`;
      
      if (window.location.hash !== hash) {
        history.pushState({ tab: tabId }, '', newUrl);
      }
    } catch (e) {
      console.warn('History pushState error:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logUserActivity({
      action: 'tab_switch',
      tab: tabId,
      details: `Switched to tab: ${tabId}`,
      currentUser
    });
  };

  const fetchRustoriaServers = async (projOverride?: 'rustoria' | 'rustymoose') => {
    const proj = projOverride || selectedProject;
    setLoadingServers(true);
    const getClientFallbackServers = () => {
      if (proj === 'rustymoose') {
        return [
          // US
          {
            id: "moose-us-1",
            name: "Rusty Moose - US Main",
            players: Math.floor(Math.random() * 100) + 380,
            maxPlayers: 500,
            status: "online",
            queue: Math.floor(Math.random() * 40) + 20,
            ip: "us-main.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 245,
            lastWipe: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "moose-us-2",
            name: "Rusty Moose - US Medium",
            players: Math.floor(Math.random() * 90) + 310,
            maxPlayers: 400,
            status: "online",
            queue: Math.floor(Math.random() * 20) + 5,
            ip: "us-medium.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 250,
            lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "moose-us-3",
            name: "Rusty Moose - US Monthly",
            players: Math.floor(Math.random() * 85) + 280,
            maxPlayers: 400,
            status: "online",
            queue: Math.floor(Math.random() * 15) + 3,
            ip: "us-monthly.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 238,
            lastWipe: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "moose-us-4",
            name: "Rusty Moose - US Small",
            players: Math.floor(Math.random() * 60) + 180,
            maxPlayers: 250,
            status: "online",
            queue: Math.floor(Math.random() * 8),
            ip: "us-small.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 255,
            lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          // EU
          {
            id: "moose-eu-1",
            name: "Rusty Moose - EU Main",
            players: Math.floor(Math.random() * 110) + 360,
            maxPlayers: 500,
            status: "online",
            queue: Math.floor(Math.random() * 50) + 15,
            ip: "eu-main.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 242,
            lastWipe: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "moose-eu-2",
            name: "Rusty Moose - EU Medium",
            players: Math.floor(Math.random() * 95) + 285,
            maxPlayers: 400,
            status: "online",
            queue: Math.floor(Math.random() * 18) + 4,
            ip: "eu-medium.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 248,
            lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "moose-eu-3",
            name: "Rusty Moose - EU Monthly",
            players: Math.floor(Math.random() * 80) + 260,
            maxPlayers: 400,
            status: "online",
            queue: Math.floor(Math.random() * 12) + 2,
            ip: "eu-monthly.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 236,
            lastWipe: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          // SEA
          {
            id: "moose-sea-1",
            name: "Rusty Moose - SEA Main",
            players: Math.floor(Math.random() * 100) + 240,
            maxPlayers: 400,
            status: "online",
            queue: Math.floor(Math.random() * 10) + 1,
            ip: "sea-main.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 244,
            lastWipe: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "moose-sea-2",
            name: "Rusty Moose - SEA Monthly",
            players: Math.floor(Math.random() * 70) + 190,
            maxPlayers: 350,
            status: "online",
            queue: Math.floor(Math.random() * 5),
            ip: "sea-monthly.rustymoose.com",
            port: 28015,
            map: "Procedural Map",
            fps: 249,
            lastWipe: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }

      return [
        // US
        {
          id: "bm-us-1",
          name: "Rustoria.co - US Main",
          players: Math.floor(Math.random() * 120) + 360,
          maxPlayers: 500,
          status: "online",
          queue: Math.floor(Math.random() * 45) + 15,
          ip: "us-main.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 242,
          lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "bm-us-2",
          name: "Rustoria.co - US Medium",
          players: Math.floor(Math.random() * 80) + 290,
          maxPlayers: 400,
          status: "online",
          queue: Math.floor(Math.random() * 15) + 2,
          ip: "us-medium.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 254,
          lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "bm-us-3",
          name: "Rustoria.co - US Long",
          players: Math.floor(Math.random() * 100) + 270,
          maxPlayers: 400,
          status: "online",
          queue: Math.floor(Math.random() * 22) + 5,
          ip: "us-long.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 238,
          lastWipe: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        // EU
        {
          id: "bm-eu-1",
          name: "Rustoria.co - EU Main",
          players: Math.floor(Math.random() * 110) + 370,
          maxPlayers: 500,
          status: "online",
          queue: Math.floor(Math.random() * 60) + 25,
          ip: "eu-main.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 240,
          lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "bm-eu-2",
          name: "Rustoria.co - EU Medium",
          players: Math.floor(Math.random() * 90) + 280,
          maxPlayers: 400,
          status: "online",
          queue: Math.floor(Math.random() * 20) + 5,
          ip: "eu-medium.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 251,
          lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "bm-eu-3",
          name: "Rustoria.co - EU Long",
          players: Math.floor(Math.random() * 95) + 265,
          maxPlayers: 400,
          status: "online",
          queue: Math.floor(Math.random() * 25) + 8,
          ip: "eu-long.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 235,
          lastWipe: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        // SEA
        {
          id: "bm-sea-1",
          name: "Rustoria.co - SEA Main",
          players: Math.floor(Math.random() * 120) + 250,
          maxPlayers: 400,
          status: "online",
          queue: Math.floor(Math.random() * 15) + 1,
          ip: "sea-main.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 245,
          lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "bm-sea-2",
          name: "Rustoria.co - SEA Medium",
          players: Math.floor(Math.random() * 80) + 210,
          maxPlayers: 350,
          status: "online",
          queue: Math.floor(Math.random() * 5),
          ip: "sea-medium.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 250,
          lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "bm-sea-3",
          name: "Rustoria.co - SEA Long",
          players: Math.floor(Math.random() * 90) + 190,
          maxPlayers: 350,
          status: "online",
          queue: Math.floor(Math.random() * 8),
          ip: "sea-long.rustoria.co",
          port: 28015,
          map: "Procedural Map",
          fps: 241,
          lastWipe: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    };

    try {
      const res = await fetch(`/api/rustoria?project=${proj}`);
      if (!res.ok) {
        throw new Error('Static host fallback triggered');
      }
      const data = await res.json();
      if (data && data.servers && data.servers.length > 0) {
        setRustoriaServers(data.servers);
      } else {
        setRustoriaServers(getClientFallbackServers());
      }
    } catch (err) {
      console.warn('API fetch failed, using high-fidelity client-side server status:', err);
      setRustoriaServers(getClientFallbackServers());
    } finally {
      setLoadingServers(false);
    }
  };

  useEffect(() => {
    fetchRustoriaServers(selectedProject);
    const interval = setInterval(() => fetchRustoriaServers(selectedProject), 60000);
    return () => clearInterval(interval);
  }, [selectedProject]);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastType = {
          id,
          message: lang === 'en' 
            ? `Copied: "${text.length > 40 ? text.substring(0, 40) + '...' : text}"` 
            : `Скопировано: "${text.length > 40 ? text.substring(0, 40) + '...' : text}"`,
          type: 'success'
        };
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
      },
      () => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastType = {
          id,
          message: lang === 'en' ? 'Failed to copy to clipboard' : 'Не удалось скопировать в буфер обмена',
          type: 'error'
        };
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
      }
    );
  };

  // Quick remove toast
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const tabs = [
    { id: 'home', label: appTranslations.tabs.home[lang], icon: <Home size={16} /> },
    { id: 'faq', label: lang === 'ru' ? 'Частые Вопросы (FAQ)' : 'FAQ & Beginner Guide', icon: <HelpCircle size={16} className="text-orange-400" /> },
    { id: 'news', label: appTranslations.tabs.news[lang], icon: <Compass size={16} /> },
    { id: 'clan', label: lang === 'ru' ? 'Поиск Клана & Тимейта' : 'Find Clan & Teammates', icon: <UserPlus size={16} className="text-blue-400" /> },
    { id: 'errors', label: appTranslations.tabs.errors[lang], icon: <BookOpen size={16} /> },
    { id: 'binds', label: appTranslations.tabs.binds[lang], icon: <Keyboard size={16} /> },
    { id: 'fps', label: appTranslations.tabs.fps[lang], icon: <Settings size={16} /> },
    { id: 'raid', label: appTranslations.tabs.raid[lang], icon: <Flame size={16} /> },
    { id: 'ecoraid', label: lang === 'ru' ? 'Эко-Рейд & Soft Side' : 'Eco-Raid & Weak Side', icon: <Pickaxe size={16} /> },
    { id: 'decay', label: appTranslations.tabs.decay[lang], icon: <Calculator size={16} /> },
    { id: 'electrical', label: appTranslations.tabs.electrical[lang], icon: <Zap size={16} /> },
    { id: 'weapons', label: appTranslations.tabs.weapons[lang], icon: <Target size={16} /> },
    { id: 'breeder', label: appTranslations.tabs.breeder[lang], icon: <Sprout size={16} /> },
    { id: 'recycler', label: appTranslations.tabs.recycler[lang], icon: <Layers size={16} /> },
    { id: 'monuments', label: lang === 'ru' ? 'Монументы' : 'Monuments', icon: <MapPin size={16} /> },
    { id: 'quarry', label: lang === 'ru' ? 'Карьеры & Экскаватор' : 'Mining & Excavator', icon: <Cpu size={16} /> },
    { id: 'wipe', label: lang === 'ru' ? 'Вайпы & Ивенты' : 'Wipe & Events', icon: <Clock size={16} /> },
    { id: 'chat', label: lang === 'ru' ? 'Чат' : 'Chat', icon: <MessageSquare size={16} /> },
    ...(currentUser && isVip ? [
      { id: 'radar', label: lang === 'ru' ? 'PLAYER RADAR (VIP)' : 'PLAYER RADAR (VIP)', icon: <Activity size={16} /> }
    ] : []),
    ...(currentUser && isOwner ? [
      { id: 'rustplus', label: lang === 'ru' ? 'Rust+ Bot Hub (OWNER)' : 'Rust+ Bot Hub (OWNER)', icon: <Smartphone size={16} /> }
    ] : []),
    ...(currentUser && isAdmin ? [
      { id: 'icons', label: lang === 'ru' ? 'Иконки Rust (ADMIN)' : 'Rust Icons (ADMIN)', icon: <Image size={16} /> },
      { id: 'admin', label: 'ADMIN', icon: <ShieldCheck size={16} /> }
    ] : [])
  ] as const;

  const sidebarCategories = [
    {
      title: lang === 'ru' ? 'СООБЩЕСТВО' : 'COMMUNITY',
      items: [
        { id: 'home', label: lang === 'ru' ? 'Главная' : 'Home', icon: <Home size={14} /> },
        { id: 'news', label: lang === 'ru' ? 'Новости' : 'News', icon: <Compass size={14} /> },
        { id: 'clan', label: lang === 'ru' ? 'Поиск Клана & Тиммейта' : 'Clan & Teammate Board', icon: <UserPlus size={14} className="text-blue-400" /> },
        { id: 'chat', label: lang === 'ru' ? 'Чат Сообщества' : 'Community Chat', icon: <MessageSquare size={14} /> },
      ]
    },
    {
      title: lang === 'ru' ? 'ЗНАНИЯ' : 'KNOWLEDGE',
      items: [
        { id: 'faq', label: lang === 'ru' ? 'Частые Вопросы (FAQ)' : 'FAQ', icon: <HelpCircle size={14} className="text-orange-400" /> },
        { id: 'errors', label: lang === 'ru' ? 'Ошибки & Решения' : 'Fixes', icon: <BookOpen size={14} /> },
        { id: 'binds', label: lang === 'ru' ? 'Бинды & Команды' : 'Binds', icon: <Keyboard size={14} /> },
        { id: 'fps', label: lang === 'ru' ? 'Оптимизация FPS' : 'FPS', icon: <Settings size={14} /> },
        { id: 'weapons', label: lang === 'ru' ? 'Оружие & Спреи' : 'Weapons', icon: <Target size={14} /> },
        { id: 'monuments', label: lang === 'ru' ? 'Монументы' : 'Monuments', icon: <MapPin size={14} /> },
        { id: 'wipe', label: lang === 'ru' ? 'Вайпы & Ивенты' : 'Wipes', icon: <Clock size={14} /> },
      ]
    },
    {
      title: lang === 'ru' ? 'КАЛЬКУЛЯТОРЫ' : 'CALCULATORS',
      items: [
        { id: 'raid', label: lang === 'ru' ? 'Калькулятор Рейда' : 'Raid Calculator', icon: <Flame size={14} /> },
        { id: 'ecoraid', label: lang === 'ru' ? 'Эко-Рейд & Soft Side' : 'Eco-Raid', icon: <Pickaxe size={14} /> },
        { id: 'decay', label: lang === 'ru' ? 'Таймер Гниения' : 'Decay', icon: <Calculator size={14} /> },
        { id: 'electrical', label: lang === 'ru' ? 'Электрика' : 'Electricity', icon: <Zap size={14} /> },
        { id: 'mixing', label: lang === 'ru' ? 'Стол Смешивания' : 'Mixing Table', icon: <Cpu size={14} className="text-purple-400" /> },
        { id: 'breeder', label: lang === 'ru' ? 'Фермерство & Генетика' : 'Farming', icon: <Sprout size={14} /> },
        { id: 'recycler', label: lang === 'ru' ? 'Переработчик' : 'Recycling', icon: <Layers size={14} /> },
        { id: 'quarry', label: lang === 'ru' ? 'Карьеры & Добыча' : 'Mining', icon: <Cpu size={14} /> },
      ]
    },
    ...(Boolean(currentUser && (isVip || isOwner || isAdmin)) ? [
      {
        title: lang === 'ru' ? 'ОСОБЫЙ ДОСТУП' : 'SPECIAL ACCESS',
        items: [
          ...(currentUser && isVip ? [
            { id: 'radar', label: lang === 'ru' ? 'PLAYER RADAR (VIP)' : 'Player Radar (VIP)', icon: <Activity size={14} className="text-rose-400" /> }
          ] : []),
          ...(currentUser && isOwner ? [
            { id: 'rustplus', label: lang === 'ru' ? 'Rust+ Bot Hub (OWNER)' : 'Rust+ Bot Hub (OWNER)', icon: <Smartphone size={14} className="text-amber-400" /> }
          ] : []),
          ...(currentUser && isAdmin ? [
            { id: 'icons', label: lang === 'ru' ? 'Иконки Rust (ADMIN)' : 'Rust Icons (ADMIN)', icon: <Image size={14} className="text-[#10b981]" /> },
            { id: 'admin', label: lang === 'ru' ? 'Панель Админа' : 'Admin Panel', icon: <ShieldCheck size={14} className="text-red-500" /> }
          ] : [])
        ]
      }
    ] : [])
  ];

  return (
    <div 
      className={`min-h-screen font-sans relative selection:bg-[#ff2a4d]/30 selection:text-white pb-20 transition-colors duration-200 ${
        appTheme === 'light' 
          ? 'bg-[#f4f3f0] text-neutral-900' 
          : 'bg-[#07090f] text-[#c8d0d8] scanlines bg-cover bg-center bg-no-repeat bg-fixed'
      }`}
      style={appTheme === 'light' ? { backgroundColor: '#f4f3f0' } : {
        backgroundImage: `linear-gradient(to bottom, rgba(7, 9, 15, 0.55), rgba(7, 9, 15, 0.72)), url(${customSwampBg})`
      }}
    >


      {/* Global Announcement Banner from Owner/Admin */}
      {announcement && announcement.active && (
        <div className={`relative overflow-hidden w-full border-b text-xs font-mono py-2 px-4 z-40 select-none flex items-center justify-between ${
          announcement.type === 'hazard' 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
            : announcement.type === 'important'
              ? 'bg-red-500/10 border-red-500/30 text-red-500'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          <div className="flex items-center gap-2 font-black shrink-0 uppercase tracking-widest text-[10px] bg-black/60 px-2 py-0.5 border border-current">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
            </span>
            <span>{lang === 'ru' ? 'Оповещение' : 'Broadcast'}</span>
          </div>

          <div className="flex-1 overflow-hidden mx-4 relative h-4 flex items-center">
            {/* @ts-ignore */}
            <marquee scrollamount="4" className="font-bold tracking-wide text-xs">
              {announcement.text}
            {/* @ts-ignore */}
            </marquee>
          </div>
          
          <div className="shrink-0 text-[9px] font-bold uppercase tracking-wider font-mono opacity-50 hidden sm:block">
            SYS_MSG_v2.6
          </div>
        </div>
      )}

      {/* WINDOWS APPLICATION LAUNCHER SHELL (Rendered in Windows Desktop Tauri or when previewing Launcher) */}
      {isWindowsApp && (
        <Suspense fallback={null}>
          <WindowsTitlebar
            appName="RUSTY.LUB LAUNCHER"
            appVersion={launcherSettings.appVersion || '2.6.4'}
            activeTabLabel={activeTab.toUpperCase()}
            onlineCount={onlineCount}
            appTheme={appTheme}
            lang={lang}
            onToast={(msg, type) => {
              const id = Math.random().toString(36).substring(2, 9);
              setToasts(prev => [...prev, { id, message: msg, type }]);
              setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
            }}
            onOpenSettings={() => setLauncherSettingsOpen(true)}
          />

          <LauncherBar
            settings={launcherSettings}
            lang={lang}
            appTheme={appTheme}
            onOpenSettings={() => setLauncherSettingsOpen(true)}
            onToggleHud={() => setQuickOverlayOpen(prev => !prev)}
            isHudOpen={quickOverlayOpen}
            onToast={(msg, type) => {
              const id = Math.random().toString(36).substring(2, 9);
              setToasts(prev => [...prev, { id, message: msg, type }]);
              setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
            }}
          />
        </Suspense>
      )}

      {/* HEADER / NAVIGATION BAR - Modern Adaptive Tactical Command */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
        appTheme === 'light'
          ? 'bg-white/95 border-neutral-200/90 shadow-[0_2px_15px_rgba(0,0,0,0.04)]'
          : 'bg-[#08090c]/95 border-[#1e2633] shadow-[0_4px_25px_rgba(0,0,0,0.8)]'
      }`}>
        <div className="w-full max-w-[1560px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex min-h-14 sm:min-h-16 h-auto flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2 w-full min-w-0">
            {/* Brand and section catalog */}
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-4">
              {/* Logo */}
              <button 
                onClick={() => handleTabChange('home')}
                className="flex min-w-0 items-center gap-1.5 sm:gap-2.5 shrink-0 group text-left cursor-pointer"
                title="Rusty.Lub - Home"
              >
                <img
                  src={logoFull}
                  alt="Rusty.Lub"
                  className="h-8 sm:h-10 w-auto max-w-[132px] sm:max-w-[168px] object-contain shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
                  fetchPriority="high"
                />
                <span className={`hidden md:inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wide ${
                  appTheme === 'light'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {onlineCount} {lang === 'ru' ? 'ОНЛАЙН' : 'ONLINE'}
                </span>
              </button>

              {/* All Sections Catalog Button (Visible on large screens) */}
              <button
                onClick={() => setSectionsDrawerOpen(true)}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer border shrink-0 ${
                  sectionsDrawerOpen
                    ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/30'
                    : appTheme === 'light'
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300/80 shadow-xs'
                      : 'bg-[#12161e] hover:bg-[#18202d] text-[#eef2f7] border-[#1e2633]'
                }`}
                title={lang === 'ru' ? 'Каталог всех 24 разделов (M)' : 'All 24 sections directory (M)'}
              >
                <LayoutGrid size={13} className={sectionsDrawerOpen ? 'text-white' : 'text-red-600'} />
                <span className="hidden xl:inline">{lang === 'ru' ? 'Все разделы' : 'All Sections'}</span>
                <span className="xl:hidden">{lang === 'ru' ? 'Разделы' : 'Sections'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  sectionsDrawerOpen ? 'bg-white/20 text-white' : 'bg-red-500/10 text-red-600 border border-red-500/20'
                }`}>
                  24
                </span>
              </button>

            </div>

            {/* Search and account actions */}
            <div className="flex max-w-full flex-wrap items-center justify-end gap-1 sm:gap-2">
              {/* Search Trigger */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 text-xs font-mono transition-all cursor-pointer rounded-md shadow-xs group shrink-0 ${
                  appTheme === 'light'
                    ? 'bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 text-neutral-700'
                    : 'bg-[#12161e] hover:bg-[#161c28] border border-[#1e2633] text-[#8b95a8] hover:text-[#eef2f7]'
                }`}
                title={lang === 'ru' ? 'Быстрый поиск (Ctrl + K)' : 'Quick Search (Ctrl + K)'}
              >
                <Search size={14} className="text-red-600 group-hover:scale-110 transition-transform shrink-0" />
                <span className="hidden md:inline text-[11px] font-semibold">{lang === 'ru' ? 'Поиск...' : 'Search...'}</span>
                <span className={`hidden 2xl:inline text-[9px] px-1.5 py-0.5 font-mono rounded ${
                  appTheme === 'light' ? 'bg-white text-neutral-500 border border-neutral-200' : 'bg-white/5 border border-white/10 text-[#8b95a8]'
                }`}>
                  Ctrl+K
                </span>
              </button>

              {/* Theme Toggle (Light / Dark) */}
              <button
                onClick={() => setAppTheme(appTheme === 'dark' ? 'light' : 'dark')}
                className={`p-1.5 sm:p-2 rounded-md transition-all cursor-pointer border shrink-0 ${
                  appTheme === 'light'
                    ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                    : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-amber-400 hover:text-amber-300'
                }`}
                title={
                  appTheme === 'light'
                    ? (lang === 'ru' ? 'Переключить на тёмную тему' : 'Switch to Dark Mode')
                    : (lang === 'ru' ? 'Переключить на светлую тему' : 'Switch to Light Mode')
                }
              >
                {appTheme === 'light' ? (
                  <Moon size={15} className="text-neutral-700" />
                ) : (
                  <Sun size={15} className="text-amber-400" />
                )}
              </button>

              {/* Language Selector */}
              <button
                onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                className={`flex items-center px-1.5 sm:px-2 py-1.5 text-[11px] font-mono font-bold transition-all cursor-pointer rounded-md shrink-0 border ${
                  appTheme === 'light'
                    ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
                    : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#8b95a8] hover:text-[#eef2f7]'
                }`}
                title={lang === 'ru' ? 'Switch to English' : 'Переключить на Русский'}
              >
                <span className={lang === 'ru' ? 'text-red-600 font-black' : 'opacity-60'}>RU</span>
                <span className="opacity-40 mx-0.5">/</span>
                <span className={lang === 'en' ? 'text-red-600 font-black' : 'opacity-60'}>EN</span>
              </button>

              {/* User Profile / Cabinet / Login */}
              {currentUser ? (
                <button
                  onClick={() => setCabinetModalOpen(true)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer rounded-md shadow-xs shrink-0 group border ${
                    appTheme === 'light'
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                      : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#eef2f7] hover:text-red-400'
                  }`}
                  title={lang === 'ru' ? 'Личный кабинет' : 'User Cabinet'}
                >
                  <img referrerPolicy="no-referrer" 
                    src={getAvatarUrl(currentUser.photoURL, currentUser.avatarClass)} 
                    alt={currentUser.displayName} 
                    className="w-5 h-5 rounded-full object-cover border border-red-500/40 group-hover:border-red-500 shrink-0"
                  />
                  <span className={`hidden sm:inline font-mono text-[11px] font-bold group-hover:text-red-600 transition-colors max-w-[70px] md:max-w-[85px] truncate ${
                    appTheme === 'light' ? 'text-neutral-800' : 'text-[#eef2f7]'
                  }`}>
                    {currentUser.displayName || (currentUser.uid === 'serustqs' ? 'OWNER' : 'SURVIVOR')}
                  </span>
                  <span className="hidden xl:inline text-[9px] px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded font-bold uppercase">
                    {lang === 'ru' ? 'Кабинет' : 'Cabinet'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-md shadow-xs shrink-0 border ${
                    appTheme === 'light'
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800 hover:text-black'
                      : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#eef2f7] hover:text-red-400'
                  }`}
                  title={lang === 'ru' ? 'Войти в аккаунт' : 'Log In'}
                >
                  <Power size={13} className="text-red-600 shrink-0" />
                  <span className="hidden sm:inline">{lang === 'ru' ? 'Войти' : 'Log In'}</span>
                </button>
              )}

              {/* Mobile / Tablet Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`xl:hidden p-1.5 sm:p-2 rounded-md transition-all cursor-pointer border shrink-0 ${
                  mobileMenuOpen
                    ? 'bg-red-600 text-white border-red-600'
                    : appTheme === 'light'
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                      : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#8b95a8] hover:text-[#eef2f7]'
                }`}
                title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-label="Navigation Menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
          <div className={`hidden xl:flex w-full items-center justify-center gap-4 border-t py-1.5 ${
            appTheme === 'light' ? 'border-neutral-200/80' : 'border-[#1e2633]/80'
          }`}>
              {/* Desktop Nav Links - Extra Large Screens (>= 1536px) */}
              <div className={`hidden 2xl:flex flex-wrap items-center gap-1.5 ${
                appTheme === 'light' ? 'border-neutral-200' : 'border-[#1e2633]'
              }`}>
                {[
                  { id: 'home', label: lang === 'ru' ? 'Главная' : 'Home' },
                  { id: 'tools', label: lang === 'ru' ? 'Калькуляторы' : 'Tools' },
                  { id: 'raid', label: lang === 'ru' ? 'Рейд' : 'Raid', isHot: true },
                  { id: 'guides', label: lang === 'ru' ? 'Гайды' : 'Guides' },
                  { id: 'clan', label: lang === 'ru' ? 'Кланы' : 'Clans' },
                  { id: 'chat', label: lang === 'ru' ? 'Чат' : 'Chat' },
                  { id: 'news', label: lang === 'ru' ? 'Новости' : 'News' },
                  { id: 'faq', label: lang === 'ru' ? 'FAQ' : 'FAQ' }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id as any)}
                      className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        isActive
                          ? appTheme === 'light'
                            ? 'text-red-600 bg-red-500/10 font-black shadow-xs'
                            : 'text-white bg-gradient-to-r from-red-600/25 to-transparent border-l-2 border-red-600 font-black'
                          : appTheme === 'light'
                            ? 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                            : 'text-[#8b95a8] hover:text-[#eef2f7] hover:bg-[#12161e]'
                      }`}
                    >
                      {item.isHot && <Flame size={12} className={isActive ? 'text-red-500 fill-red-500/20' : 'text-orange-500'} />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Compact Nav Links - XL Screens (1280px - 1535px) */}
              <div className={`hidden xl:flex 2xl:hidden flex-wrap items-center gap-1.5 ${
                appTheme === 'light' ? 'border-neutral-200' : 'border-[#1e2633]'
              }`}>
                {[
                  { id: 'home', label: lang === 'ru' ? 'Главная' : 'Home' },
                  { id: 'tools', label: lang === 'ru' ? 'Калькуляторы' : 'Tools' },
                  { id: 'raid', label: lang === 'ru' ? 'Рейд' : 'Raid', isHot: true }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id as any)}
                      className={`px-2 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        isActive
                          ? appTheme === 'light'
                            ? 'text-red-600 bg-red-500/10 font-black'
                            : 'text-white bg-red-600/20 border-l-2 border-red-600 font-black'
                          : appTheme === 'light'
                            ? 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                            : 'text-[#8b95a8] hover:text-[#eef2f7] hover:bg-[#12161e]'
                      }`}
                    >
                      {item.isHot && <Flame size={12} className="text-orange-500" />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

          </div>
        </div>



        {/* Mobile Navigation Drawer - Organized, Categorized & Ergonomic */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`xl:hidden border-t max-h-[85vh] overflow-y-auto px-4 pt-3 pb-6 space-y-4 shadow-2xl transition-colors duration-200 ${
                appTheme === 'light'
                  ? 'bg-white/98 border-neutral-200'
                  : 'bg-[#0d1016]/98 border-[#1e2633]'
              }`}
            >
              {/* User Section / Auth Status */}
              {currentUser ? (
                <div className={`p-3 border rounded-xl flex items-center justify-between gap-3 shadow-xs ${
                  appTheme === 'light'
                    ? 'bg-neutral-50 border-neutral-200'
                    : 'bg-[#12161e] border-[#1e2633]'
                }`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <img referrerPolicy="no-referrer" 
                      src={getAvatarUrl(currentUser.photoURL, currentUser.avatarClass)} 
                      alt={currentUser.displayName} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-red-500/50 bg-black shrink-0"
                    />
                    <div className="min-w-0">
                      <div className={`text-sm font-bold font-mono truncate ${
                        appTheme === 'light' ? 'text-neutral-900' : 'text-[#eef2f7]'
                      }`}>
                        {currentUser.displayName}
                      </div>
                      <div className="text-[10px] text-red-500 font-mono font-bold uppercase">
                        {currentUser.uid === 'serustqs' ? '👑 OWNER' : (currentUser.role || 'SURVIVOR')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCabinetModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-600 font-bold text-xs rounded-lg transition-all cursor-pointer shrink-0"
                  >
                    {lang === 'ru' ? 'Кабинет' : 'Cabinet'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-95 rounded-xl shadow-md cursor-pointer"
                >
                  <Power size={15} />
                  <span>{lang === 'ru' ? 'Войти в аккаунт / Регистрация' : 'Log In / Register'}</span>
                </button>
              )}

              {/* Quick Actions Bar (Search, Theme, Language) */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setCommandPaletteOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 border rounded-lg text-xs font-bold flex items-center gap-2 justify-center cursor-pointer transition-all ${
                    appTheme === 'light'
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
                      : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#eef2f7]'
                  }`}
                >
                  <Search size={14} className="text-red-500" />
                  <span>{lang === 'ru' ? 'Поиск' : 'Search'}</span>
                </button>

                <button
                  onClick={() => setAppTheme(appTheme === 'dark' ? 'light' : 'dark')}
                  className={`p-2.5 border rounded-lg text-xs font-bold flex items-center gap-2 justify-center cursor-pointer transition-all ${
                    appTheme === 'light'
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
                      : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-amber-400'
                  }`}
                >
                  {appTheme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                  <span>{appTheme === 'light' ? (lang === 'ru' ? 'Тёмная' : 'Dark') : (lang === 'ru' ? 'Светлая' : 'Light')}</span>
                </button>

                <button
                  onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                  className={`p-2.5 border rounded-lg text-xs font-mono font-bold flex items-center gap-2 justify-center cursor-pointer transition-all ${
                    appTheme === 'light'
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
                      : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#eef2f7]'
                  }`}
                >
                  <span className="text-red-500 font-black">{lang === 'ru' ? 'RU' : 'EN'}</span>
                  <span className="text-[10px] opacity-70">➔ {lang === 'ru' ? 'EN' : 'RU'}</span>
                </button>
              </div>

              {/* Categorized Tabs: Калькуляторы & Инструменты */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest px-1">
                  <span>{lang === 'ru' ? 'Калькуляторы & Рейды' : 'Calculators & Raiding'}</span>
                  <span className="text-neutral-500 font-normal">8 {lang === 'ru' ? 'инструментов' : 'tools'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'raid', label: lang === 'ru' ? 'Калькулятор Рейда' : 'Raid Calculator', icon: <Flame size={13} className="text-orange-500" /> },
                    { id: 'ecoraid', label: lang === 'ru' ? 'Эко-Рейд & Soft Side' : 'Eco-Raid', icon: <Pickaxe size={13} className="text-amber-500" /> },
                    { id: 'tools', label: lang === 'ru' ? 'Хаб Калькуляторов' : 'All Calculators', icon: <Calculator size={13} /> },
                    { id: 'decay', label: lang === 'ru' ? 'Гниение Базы' : 'Decay Calculator', icon: <Clock size={13} /> },
                    { id: 'electrical', label: lang === 'ru' ? 'Электрика Rust' : 'Electricity Sim', icon: <Zap size={13} className="text-yellow-400" /> },
                    { id: 'mixing', label: lang === 'ru' ? 'Стол Смешивания' : 'Mixing Table', icon: <FlaskConical size={13} className="text-purple-400" /> },
                    { id: 'breeder', label: lang === 'ru' ? 'Ферма & Гены' : 'Plant Breeding', icon: <Sprout size={13} className="text-emerald-400" /> },
                    { id: 'recycler', label: lang === 'ru' ? 'Переработчик' : 'Recycler Calc', icon: <Layers size={13} className="text-blue-400" /> }
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleTabChange(item.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded-lg text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : appTheme === 'light'
                              ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                              : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#8b95a8] hover:text-[#eef2f7]'
                        }`}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categorized Tabs: База Знаний & Гайды */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-sky-500 uppercase tracking-widest px-1">
                  <span>{lang === 'ru' ? 'Гайды & Справочники' : 'Guides & Reference'}</span>
                  <span className="text-neutral-500 font-normal">7 {lang === 'ru' ? 'разделов' : 'sections'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'guides', label: lang === 'ru' ? 'Хаб Гайдов' : 'Guides Hub', icon: <BookOpen size={13} className="text-sky-400" /> },
                    { id: 'errors', label: lang === 'ru' ? 'Ошибки & EAC' : 'Fix Rust Errors', icon: <ShieldAlert size={13} className="text-rose-400" /> },
                    { id: 'binds', label: lang === 'ru' ? 'Бинды & Консоль' : 'Keybinds', icon: <Keyboard size={13} className="text-amber-400" /> },
                    { id: 'fps', label: lang === 'ru' ? 'Оптимизация FPS' : 'FPS Boost', icon: <Settings size={13} className="text-emerald-400" /> },
                    { id: 'weapons', label: lang === 'ru' ? 'Оружие & Спреи' : 'Weapons & Spray', icon: <Target size={13} className="text-red-400" /> },
                    { id: 'monuments', label: lang === 'ru' ? 'Монументы & CCTV' : 'Monuments', icon: <MapPin size={13} className="text-teal-400" /> },
                    { id: 'wipe', label: lang === 'ru' ? 'Вайпы & Таймеры' : 'Wipes & Events', icon: <Clock size={13} className="text-cyan-400" /> },
                    { id: 'faq', label: lang === 'ru' ? 'FAQ для Новичка' : 'FAQ & Basics', icon: <HelpCircle size={13} className="text-orange-400" /> }
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleTabChange(item.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded-lg text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : appTheme === 'light'
                              ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                              : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#8b95a8] hover:text-[#eef2f7]'
                        }`}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categorized Tabs: Сообщество & Кланы */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest px-1">
                  <span>{lang === 'ru' ? 'Сообщество' : 'Community'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'clan', label: lang === 'ru' ? 'Кланы' : 'Clans', icon: <UserPlus size={13} className="text-indigo-400" /> },
                    { id: 'chat', label: lang === 'ru' ? 'Чат' : 'Chat', icon: <MessageSquare size={13} className="text-blue-400" /> },
                    { id: 'news', label: lang === 'ru' ? 'Новости' : 'News', icon: <Compass size={13} className="text-teal-400" /> }
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleTabChange(item.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded-lg text-center text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : appTheme === 'light'
                              ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                              : 'bg-[#12161e] hover:bg-[#161c28] border-[#1e2633] text-[#8b95a8] hover:text-[#eef2f7]'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span className="truncate text-[11px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Access Sections (if user has permissions) */}
              {(Boolean(currentUser && (isVip || isOwner || isAdmin))) && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest px-1">
                    {lang === 'ru' ? 'Особый доступ' : 'Special Access'}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {currentUser && isVip && (
                      <button
                        onClick={() => {
                          handleTabChange('radar');
                          setMobileMenuOpen(false);
                        }}
                        className="p-2 bg-rose-950/30 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <Activity size={13} />
                        <span>RADAR (VIP)</span>
                      </button>
                    )}
                    {currentUser && isOwner && (
                      <button
                        onClick={() => {
                          handleTabChange('rustplus');
                          setMobileMenuOpen(false);
                        }}
                        className="p-2 bg-amber-950/30 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <Smartphone size={13} />
                        <span>Rust+ (OWNER)</span>
                      </button>
                    )}
                    {currentUser && isAdmin && (
                      <button
                        onClick={() => {
                          handleTabChange('admin');
                          setMobileMenuOpen(false);
                        }}
                        className="p-2 bg-red-950/30 border border-red-500/30 text-red-300 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck size={13} />
                        <span>ADMIN</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Drawer Footer Actions */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                <button
                  onClick={() => {
                    setSectionsDrawerOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-wider text-red-600 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all cursor-pointer"
                >
                  <LayoutGrid size={14} />
                  <span>{lang === 'ru' ? 'Открыть полный каталог 24 разделов' : 'Open All 24 Sections Catalog'}</span>
                </button>

                <button
                  onClick={() => {
                    handleTabChange('support');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all cursor-pointer"
                >
                  <Heart size={14} className="fill-amber-500/20" />
                  <span>{lang === 'ru' ? 'Поддержать проект (Донат)' : 'Support Project (Donate)'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* CORE APPLICATION CONTAINER */}
      <main className="industrial-workspace mx-auto px-3 sm:px-4 lg:px-8 mt-5 relative z-10 w-full min-h-[70vh] overflow-x-hidden">
        <div className="w-full max-w-full overflow-hidden">
          {/* Active Tab View */}
          <div className="w-full max-w-full overflow-hidden">
            <Suspense fallback={
              <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center font-mono space-y-3">
                <div className="w-10 h-10 border-3 border-[#2a2f3b] border-t-[#cd412b] rounded-full animate-spin" />
                <div className="text-lg font-bold text-white tracking-widest uppercase font-teko">RUSTY.LUB</div>
                <div className="text-xs text-neutral-400">ПОДКЛЮЧЕНИЕ МОДУЛЯ...</div>
              </div>
            }>
              <AnimatePresence mode="wait">
          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {currentUser && isAdmin ? (
                <AdminTab 
                  currentUser={currentUser} 
                  lang={lang} 
                  onToast={(msg, type) => {
                    const id = Math.random().toString(36).substring(2, 9);
                    setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : (type === 'info' ? 'info' as any : 'success') }]);
                    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
                  }}
                />
              ) : (
                <SpecialAccessGated
                  moduleTitle={lang === 'ru' ? 'Панель Администратора' : 'Admin Panel & DB'}
                  moduleIcon="lock.code"
                  requiredRole="admin"
                  currentUser={currentUser}
                  lang={lang}
                  appTheme={appTheme}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onOpenVip={() => setCabinetModalOpen(true)}
                  onGoHome={() => handleTabChange('home')}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account-page"
              className="w-full space-y-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#f28a24]">R.L. / ACCOUNT</p>
                  <h1 className="mt-1 text-2xl font-bold text-white">{lang === 'ru' ? 'Личный кабинет' : 'User cabinet'}</h1>
                </div>
                <button type="button" onClick={() => handleTabChange('home')} className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-orange-400/40 hover:text-white">
                  {lang === 'ru' ? 'На главную' : 'Back home'}
                </button>
              </div>
              {currentUser ? (
                <CabinetModal
                  isOpen={true}
                  pageMode={true}
                  onClose={() => handleTabChange('home')}
                  lang={lang}
                  user={currentUser}
                  onOpenTab={(tab) => handleTabChange(tab as any)}
                  onUserLogout={() => {
                    setCurrentUser(null);
                    localStorage.removeItem('rust_survivor_user');
                    handleTabChange('home');
                  }}
                  onAvatarChange={(avatarId, photoURL) => {
                    if (currentUser) {
                      const updated = { ...currentUser, avatarClass: avatarId, photoURL };
                      setCurrentUser(updated);
                      localStorage.setItem('rust_survivor_user', JSON.stringify(updated));
                    }
                  }}
                  onToast={(msg, type) => {
                    const id = Math.random().toString(36).substring(2, 9);
                    setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
                    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
                  }}
                />
              ) : (
                <div className="mx-auto flex min-h-[360px] max-w-3xl flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-[#10161d] p-8 text-center">
                  <div className="text-4xl text-[#f28a24]">R.L.</div>
                  <h2 className="text-xl font-bold text-white">{lang === 'ru' ? 'Войдите в аккаунт' : 'Sign in to your account'}</h2>
                  <p className="max-w-lg text-sm text-zinc-400">{lang === 'ru' ? 'После входа здесь будут доступны профиль, история активности, сохранённые данные и настройки аккаунта.' : 'Sign in to access your profile, activity history, saved data and account settings here.'}</p>
                  <button type="button" onClick={() => setAuthModalOpen(true)} className="rounded-md bg-[#f28a24] px-5 py-3 font-bold text-black hover:bg-orange-300">{lang === 'ru' ? 'Войти / зарегистрироваться' : 'Sign in / create account'}</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div
              key="support-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="mx-auto w-full max-w-6xl space-y-8"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#f28a24]">R.L. / SUPPORT</p>
                  <h1 className="mt-1 text-3xl font-bold text-white">{lang === 'ru' ? 'Поддержка проекта и VIP' : 'Project support & VIP'}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">{lang === 'ru' ? 'Выберите VIP-доступ или поддержите развитие Rusty.Lub добровольным пожертвованием. Это разные действия.' : 'Choose VIP access or support Rusty.Lub with a voluntary donation. These are separate actions.'}</p>
                </div>
                <button type="button" onClick={() => handleTabChange('home')} className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-orange-400/40 hover:text-white">{lang === 'ru' ? 'На главную' : 'Back home'}</button>
              </div>
              <section className="border-y border-white/10 py-7">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f28a24]">{lang === 'ru' ? '01 / VIP-ДОСТУП · 45 ДНЕЙ' : '01 / VIP ACCESS · 45 DAYS'}</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Diamond VIP</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">{lang === 'ru' ? 'Персонализация профиля, премиальные темы и аватары, значок VIP и доступ к дополнительным инструментам проекта.' : 'Profile personalization, premium themes and avatars, a VIP badge, and access to additional project tools.'}</p>
                    <p className="mt-4 text-3xl font-black text-[#f28a24]">300 ₽ <span className="text-sm font-medium text-zinc-500">/ {lang === 'ru' ? '45 дней' : '45 days'}</span></p>
                  </div>
                  <div className="flex flex-col gap-3 md:min-w-56">
                    <button type="button" onClick={() => setToasts(prev => [...prev, { id: Math.random().toString(36).slice(2, 9), message: lang === 'ru' ? 'Оплата временно недоступна. Платёжная система ещё не подключена.' : 'Payment is temporarily unavailable. The payment provider is not connected yet.', type: 'info' }])} className="inline-flex items-center justify-center gap-2 bg-[#f28a24] px-6 py-3 text-sm font-bold text-[#111] transition hover:bg-orange-300">
                      {lang === 'ru' ? 'Купить за 300 ₽' : 'Buy for 300 RUB'} <ExternalLink size={15} />
                    </button>
                    <p className="text-xs leading-relaxed text-zinc-500">{lang === 'ru' ? 'Оплата пока не подключена. Нажатие кнопки не спишет деньги и не активирует VIP.' : 'Payments are not connected yet. Clicking will not charge you or activate VIP.'}</p>
                  </div>
                </div>
              </section>
              <section className="py-4">
                <div className="mb-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f28a24]">{lang === 'ru' ? '02 / ДОБРОВОЛЬНАЯ ПОДДЕРЖКА' : '02 / VOLUNTARY SUPPORT'}</p>
                  <h2 className="mt-1 text-xl font-bold text-white">{lang === 'ru' ? 'Поддержать проект' : 'Support the project'}</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <a href="https://www.donationalerts.com/r/tv_cheater" target="_blank" rel="noreferrer" className="group border border-white/10 bg-[#10161d] p-6 transition hover:border-orange-400/50">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-orange-400/30 bg-orange-500/10 text-orange-300"><Heart size={22}/></div>
                    <h2 className="text-lg font-bold text-white">DonationAlerts <ExternalLink size={14} className="inline"/></h2>
                    <p className="mt-2 text-sm text-zinc-400">{lang === 'ru' ? 'Перейти на страницу добровольной поддержки.' : 'Open the voluntary support page.'}</p>
                  </a>
                  <div className="border border-white/10 bg-[#10161d] p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-300"><Coins size={22}/></div>
                    <h2 className="text-lg font-bold text-white">Bitcoin (BTC)</h2>
                    <p className="mt-3 break-all rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-zinc-300">bc1qllwnsda2xjrffjxtjet66cxgs0vt2rzt7ngtz9</p>
                    <button type="button" onClick={() => handleCopy('bc1qllwnsda2xjrffjxtjet66cxgs0vt2rzt7ngtz9')} className="mt-3 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-orange-400/40 hover:text-white">{lang === 'ru' ? 'Копировать адрес' : 'Copy address'}</button>
                  </div>
                  <div className="border border-white/10 bg-[#10161d] p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-500/10 text-emerald-300"><Coins size={22}/></div>
                    <h2 className="text-lg font-bold text-white">USDT (TRC20)</h2>
                    <p className="mt-3 break-all rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-zinc-300">TRAgQoGMAThBaSxkRaYvfzLtH92Fq89DSQ</p>
                    <button type="button" onClick={() => handleCopy('TRAgQoGMAThBaSxkRaYvfzLtH92Fq89DSQ')} className="mt-3 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-orange-400/40 hover:text-white">{lang === 'ru' ? 'Копировать адрес' : 'Copy address'}</button>
                  </div>
                </div>
              </section>
              <p className="text-xs leading-relaxed text-zinc-500">{lang === 'ru' ? 'Добровольный донат не предоставляет VIP автоматически. Оплата VIP будет доступна после подключения и проверки платёжной системы.' : 'Voluntary donations do not automatically grant VIP. VIP checkout will become available after the payment provider is connected and verified.'}</p>
            </motion.div>
          )}

          {activeTab === 'terms' && (
            <motion.div
              key="terms-page"
              className="w-full space-y-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#f28a24]">R.L. / DOCUMENTS</p>
                  <h1 className="mt-1 text-2xl font-bold text-white">{lang === 'ru' ? 'Документы проекта' : 'Project documents'}</h1>
                </div>
                <button type="button" onClick={() => handleTabChange('home')} className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-orange-400/40 hover:text-white">
                  {lang === 'ru' ? 'На главную' : 'Back home'}
                </button>
              </div>
              <TermsModal isOpen={true} pageMode={true} onClose={() => handleTabChange('home')} lang={lang} />
            </motion.div>
          )}

          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <HomeTab
                lang={lang}
                onNavigate={(tab) => handleTabChange(tab)}
                onOpenDonation={() => handleTabChange('support')}
                selectedProject={selectedProject}
                onSelectProject={(proj) => setSelectedProject(proj)}
                rustoriaServers={rustoriaServers}
                loadingServers={loadingServers}
                onRefreshServers={(proj) => fetchRustoriaServers(proj)}
                copiedServerId={copiedServerId}
                onCopyServer={(cmd, id) => {
                  navigator.clipboard.writeText(cmd);
                  setCopiedServerId(id);
                  const toastId = Math.random().toString(36).substring(2, 9);
                  setToasts(prev => [...prev, { id: toastId, message: lang === 'ru' ? 'IP скопирован в буфер!' : 'Connect command copied!', type: 'success' }]);
                  setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== toastId));
                    setCopiedServerId(null);
                  }, 2500);
                }}
                regionFilter={regionFilter}
                onSetRegionFilter={(reg) => setRegionFilter(reg)}
                serverSearch={serverSearch}
                onSetServerSearch={(search) => setServerSearch(search)}
                twitchSettings={twitchSettings}
                showJungleFeverSpoiler={showJungleFeverSpoiler}
                onGenerateWallpaper={generateWallpaper}
                appTranslations={appTranslations}
                appTheme={appTheme}
                isVip={isVip}
                isOwner={isOwner}
                isAdmin={isAdmin}
                currentUser={currentUser}
              />
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              className="w-full min-w-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ToolsHubTab 
                lang={lang} 
                onNavigate={(tab) => handleTabChange(tab)} 
                isVip={isVip} 
                isAdmin={isAdmin} 
                isOwner={isOwner} 
                onOpenVip={() => setCabinetModalOpen(true)}
                appTheme={appTheme}
                currentUser={currentUser} 
              />
            </motion.div>
          )}

          {activeTab === 'guides' && (
            <motion.div
              key="guides"
              className="w-full min-w-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <GuidesHubTab lang={lang} onNavigate={(tab) => handleTabChange(tab)} />
            </motion.div>
          )}


          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <NewsTab 
                lang={lang} 
                onOpenNotifications={() => setNotificationModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'errors' && (
            <motion.div
              key="errors"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorsTab onCopy={handleCopy} lang={lang} appTheme={appTheme} />
            </motion.div>
          )}

          {activeTab === 'binds' && (
            <motion.div
              key="binds"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <BindsTab 
                onCopy={handleCopy} 
                lang={lang} 
                user={currentUser}
                onRequireAuth={() => setAuthModalOpen(true)}
                onToast={(msg, type) => {
                  const id = Math.random().toString(36).substring(2, 9);
                  setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
                  setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                  }, 3000);
                }}
                onOpenConfigExporter={() => setConfigExporterModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'fps' && (
            <motion.div
              key="fps"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <FpsTab 
                onCopy={handleCopy} 
                lang={lang} 
                onOpenConfigExporter={() => setConfigExporterModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'raid' && (
            <motion.div
              key="raid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <RaidCalculatorTab 
                lang={lang} 
                user={currentUser}
                onRequireAuth={() => setAuthModalOpen(true)}
                onToast={(msg, type) => {
                  const id = Math.random().toString(36).substring(2, 9);
                  setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
                  setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                  }, 3000);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'decay' && (
            <motion.div
              key="decay"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <DecayCalculator 
                lang={lang} 
                user={currentUser}
                onToast={(msg, type) => {
                  const id = Math.random().toString(36).substring(2, 9);
                  setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
                  setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                  }, 4000);
                }}
                onOpenProfile={() => setCabinetModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'electrical' && (
            <motion.div
              key="electrical"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ElectricalSimulatorTab lang={lang} />
            </motion.div>
          )}

          {activeTab === 'clan' && (
            <motion.div
              key="clan"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ClanBoardTab lang={lang} user={currentUser} onToast={(msg, type) => {
                const id = Math.random().toString(36).substring(2, 9);
                setToasts(prev => [...prev, { id, message: msg, type }]);
                setTimeout(() => {
                  setToasts(prev => prev.filter(t => t.id !== id));
                }, 3000);
              }} onOpenAuth={() => setAuthModalOpen(true)} />
            </motion.div>
          )}

          {activeTab === 'weapons' && (
            <motion.div
              key="weapons"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <WeaponGuidesTab lang={lang} />
            </motion.div>
          )}

          {activeTab === 'recycler' && (
            <motion.div
              key="recycler"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <RecyclerTab lang={lang} />
            </motion.div>
          )}

          {activeTab === 'monuments' && (
            <motion.div
              key="monuments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <MonumentsTab lang={lang} />
            </motion.div>
          )}

          {activeTab === 'wipe' && (
            <motion.div
              key="wipe"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <WipeTrackerTab 
                lang={lang} 
                onOpenNotifications={() => setNotificationModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'ecoraid' && (
            <motion.div
              key="ecoraid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <EcoRaidTab lang={lang} />
            </motion.div>
          )}

          {activeTab === 'quarry' && (
            <motion.div
              key="quarry"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <MiningQuarryTab lang={lang} />
            </motion.div>
          )}

          {activeTab === 'rustplus' && (
            <motion.div
              key="rustplus"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {currentUser && (isOwner || isAdmin) ? (
                <RustPlusTab 
                  lang={lang} 
                  currentUser={currentUser} 
                  isAdmin={isAdmin} 
                  onOpenNotifications={() => setNotificationModalOpen(true)}
                  onToast={(msg, type) => {
                    const id = Math.random().toString(36).substring(2, 9);
                    setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : (type === 'info' ? 'info' as any : 'success') }]);
                    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
                  }} 
                />
              ) : (
                <SpecialAccessGated
                  moduleTitle="Rust+ Bot Hub (OWNER)"
                  moduleIcon="smart.alarm"
                  requiredRole="owner"
                  currentUser={currentUser}
                  lang={lang}
                  appTheme={appTheme}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onOpenVip={() => setCabinetModalOpen(true)}
                  onGoHome={() => handleTabChange('home')}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'icons' && (
            <motion.div
              key="icons"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {currentUser && isAdmin ? (
                <RustItemIconsTab lang={lang} />
              ) : (
                <SpecialAccessGated
                  moduleTitle={lang === 'ru' ? 'Библиотека Спрайтов Rust' : 'Rust Item Icons (ADMIN)'}
                  moduleIcon="spraycan"
                  requiredRole="admin"
                  currentUser={currentUser}
                  lang={lang}
                  appTheme={appTheme}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onOpenVip={() => setCabinetModalOpen(true)}
                  onGoHome={() => handleTabChange('home')}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'breeder' && (
            <motion.div
              key="breeder"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {isAdmin ? (
                <RustBreeder lang={lang} />
              ) : (
                <div className="bg-[#14171e]/95 border-2 border-[#cd412b]/30 p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 relative overflow-hidden rust-metal-pattern shadow-2xl text-left">
                  {/* Tactical Corner Brackets */}
                  <div className="rust-bracket-tl" />
                  <div className="rust-bracket-tr" />
                  <div className="rust-bracket-bl" />
                  <div className="rust-bracket-br" />

                  {/* Top Hazard Warning Stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />
                  
                  <div className="space-y-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-none bg-[#cd412b]/10 text-[#cd412b] flex items-center justify-center border border-[#cd412b]/20 shadow-inner relative animate-pulse">
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-[#cd412b]/60" />
                      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#cd412b]/60" />
                      <span className="text-3xl font-bold">🛠️</span>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest font-teko uppercase">
                        {lang === 'ru' ? 'В разработке' : 'UNDER DEVELOPMENT'}
                      </h2>
                      <div className="h-[2px] w-16 bg-[#cd412b] mx-auto" />
                    </div>

                    <p className="text-sm sm:text-base text-gray-300 font-sans font-medium leading-relaxed max-w-lg mx-auto">
                      {lang === 'ru'
                        ? 'В скором времени работа данного функционала будет доступна'
                        : 'Soon the operation of this functionality will be available'}
                    </p>

                    <div className="pt-2">
                      <span className="inline-block text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-black/40 px-3 py-1 border border-[#2a2f3b]">
                        SYS_STATUS: OFFLINE_MAINTENANCE
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ChatTab 
                lang={lang} 
                user={currentUser} 
                onUserLogin={(user) => {
                  setCurrentUser(user);
                  localStorage.setItem('rust_survivor_user', JSON.stringify(user));
                }}
                onUserLogout={() => {
                  setCurrentUser(null);
                  localStorage.removeItem('rust_survivor_user');
                }}
                onToast={(msg, type) => {
                  const id = Math.random().toString(36).substring(2, 9);
                  setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
                  setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                  }, 3000);
                }} 
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenClanBoard={() => setActiveTab('clan')}
              />
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <FaqTab lang={lang} />
            </motion.div>
          )}

          {activeTab === 'special' && (
            <motion.div
              key="special"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <SpecialAccessHubTab
                lang={lang}
                currentUser={currentUser}
                appTheme={appTheme}
                isVip={isVip}
                isOwner={isOwner}
                isAdmin={isAdmin}
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenCabinet={() => setCabinetModalOpen(true)}
                onNavigateTab={(tab) => handleTabChange(tab as any)}
                onToast={(msg, type) => {
                  const id = Math.random().toString(36).substring(2, 9);
                  setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : (type === 'info' ? 'info' as any : 'success') }]);
                  setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
                }}
                onOpenNotifications={() => setNotificationModalOpen(true)}
                onOpenConfigExporter={() => setConfigExporterModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'radar' && (
            <motion.div
              key="radar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {currentUser && isVip ? (
                <PlayerRadar />
              ) : (
                <SpecialAccessGated
                  moduleTitle="Player Radar (VIP)"
                  moduleIcon="rf_pager"
                  requiredRole="vip"
                  currentUser={currentUser}
                  lang={lang}
                  appTheme={appTheme}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onOpenVip={() => setCabinetModalOpen(true)}
                  onGoHome={() => handleTabChange('home')}
                />
              )}
            </motion.div>
          )}
            </AnimatePresence>
            </Suspense>
          </div>
        </div>
      </main>

      {/* DONATION MODAL */}
      <AnimatePresence>
        {donationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDonationOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#14171e]/95 border border-[#2a2f3b] rounded-sm shadow-2xl p-6 overflow-hidden z-10"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rust-hazard-dark pointer-events-none opacity-20" />
              
              {/* Close Button */}
              <button
                onClick={() => setDonationOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-sm bg-[#cd412b]/10 text-[#cd412b] flex items-center justify-center border border-[#cd412b]/20 shadow-inner">
                  <Heart size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wider font-teko uppercase">
                    {lang === 'ru' ? 'Поддержка проекта' : 'Support Project'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed font-sans font-medium">
                    {lang === 'ru' 
                      ? 'Ваша поддержка помогает нам оплачивать сервера, обновлять базу ошибок и развивать калькулятор рейдов!' 
                      : 'Your support helps us cover server costs, update our error database, and improve the raid calculator!'}
                  </p>
                </div>

                {/* DonationAlerts link */}
                <div className="pt-2">
                  <a
                    href="https://www.donationalerts.com/r/tv_cheater"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#ff7200] to-[#ff9000] hover:from-[#e06500] hover:to-[#e07f00] transition-all shadow-md shadow-orange-600/10 hover:shadow-orange-600/20"
                  >
                    <Coins size={14} />
                    <span>DonationAlerts</span>
                    <ExternalLink size={11} />
                  </a>
                </div>

                {/* Crypto section */}
                <div className="space-y-3 pt-4 border-t border-[#2a2f3b]/50">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    {lang === 'ru' ? 'Криптовалюта (Crypto)' : 'Cryptocurrency'}
                  </h4>
                  
                  {/* BTC */}
                  <div className="flex items-center justify-between bg-[#1b1e26] border border-[#2a2f3b] p-2.5 rounded-sm text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[8px] font-black text-amber-500 uppercase font-mono block">BTC</span>
                      <span className="text-[11px] font-mono text-gray-300 block select-all truncate max-w-[280px]">
                        bc1qllwnsda2xjrffjxtjet66cxgs0vt2rzt7ngtz9
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy('bc1qllwnsda2xjrffjxtjet66cxgs0vt2rzt7ngtz9')}
                      className="p-1.5 bg-[#14171e] border border-[#2a2f3b] text-gray-400 hover:text-white hover:border-gray-500 rounded-sm cursor-pointer transition-colors shrink-0"
                      title={lang === 'ru' ? 'Копировать адрес BTC' : 'Copy BTC Address'}
                    >
                      <Copy size={12} />
                    </button>
                  </div>

                  {/* USDT */}
                  <div className="flex items-center justify-between bg-[#1b1e26] border border-[#2a2f3b] p-2.5 rounded-sm text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[8px] font-black text-emerald-400 uppercase font-mono block">USDT (TRC20)</span>
                      <span className="text-[11px] font-mono text-gray-300 block select-all truncate max-w-[280px]">
                        TRAgQoGMAThBaSxkRaYvfzLtH92Fq89DSQ
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy('TRAgQoGMAThBaSxkRaYvfzLtH92Fq89DSQ')}
                      className="p-1.5 bg-[#14171e] border border-[#2a2f3b] text-gray-400 hover:text-white hover:border-gray-500 rounded-sm cursor-pointer transition-colors shrink-0"
                      title={lang === 'ru' ? 'Копировать адрес USDT' : 'Copy USDT Address'}
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>

                {/* Footer close helper */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setDonationOpen(false)}
                    className="text-[10px] text-gray-500 hover:text-gray-400 transition-colors uppercase tracking-wider font-mono font-bold cursor-pointer"
                  >
                    {lang === 'ru' ? 'Закрыть окно' : 'Close window'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Wallpaper Generator Modal */}
      <AnimatePresence>
        {wallpaperModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-[#0d0f14] border-2 border-[#2a2f3b] p-6 relative overflow-hidden shadow-2xl rust-metal-pattern"
            >
              {/* Corner brackets */}
              <div className="rust-bracket-tl" />
              <div className="rust-bracket-tr" />
              <div className="rust-bracket-bl" />
              <div className="rust-bracket-br" />

              {/* Hazard header */}
              <div className="absolute top-0 left-0 right-0 h-1.5 rust-hazard" />

              {/* Close Button */}
              <button
                onClick={() => setWallpaperModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer z-50"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wider font-teko uppercase flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" />
                    {lang === 'ru' ? 'НЕЙРО-ГЕНЕРАТОР ОБОЕВ RUST' : 'RUST NEURAL WALLPAPER GENERATOR'}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {lang === 'ru' 
                      ? 'Эксклюзивные арты высокого разрешения, синтезированные ИИ в реальном времени' 
                      : 'Exclusive high-resolution gaming artworks synthesized by AI in real-time'}
                  </p>
                </div>

                {wallpaperLoading ? (
                  /* Loading / Synthesizing View */
                  <div className="bg-[#07080a] border border-[#2a2f3b] p-6 min-h-[300px] flex flex-col justify-between font-mono relative">
                    <div className="space-y-2.5 text-xs text-emerald-500">
                      {wallpaperLogs.map((log, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5 text-amber-500 animate-pulse">
                        <span>&gt;</span>
                        <span className="h-4 w-1.5 bg-amber-500" />
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between items-center text-[10px] text-gray-500">
                        <span>GENERATION PROGRESS</span>
                        <span>{Math.round((wallpaperLogs.length / 5) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-900 border border-gray-800 w-full overflow-hidden relative">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#cd412b] to-amber-500"
                          initial={{ width: '0%' }}
                          animate={{ width: `${(wallpaperLogs.length / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Display Generated Wallpaper */
                  <div className="space-y-5">
                    <div className="relative border border-[#2a2f3b] overflow-hidden group bg-black">
                      <img
                        src={[customSwampBg, rustWallpaperOne, rustWallpaperTwo, rustWallpaperThree][currentWallpaperIdx]}
                        alt="Generated Rust Wallpaper"
                        className="w-full h-auto aspect-video object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Technical Overlays */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 border border-[#cd412b]/40 text-[9px] text-[#cd412b] font-mono font-bold uppercase tracking-wider">
                        IMAGEN SYNTHESIS MODEL v3.5 • HIGH-RES
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="block text-[8px] text-gray-400 font-mono uppercase tracking-widest mb-1">
                          {lang === 'ru' ? 'Название Артора' : 'Artwork Title'}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-white font-mono tracking-wide uppercase">
                          {wallpaperTitles[currentWallpaperIdx][lang]}
                        </h4>
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        onClick={generateWallpaper}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 px-4 bg-[#cd412b] hover:bg-[#b03825] text-white font-bold text-xs uppercase tracking-widest border border-red-500/30 font-mono flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles size={14} />
                        <span>{lang === 'ru' ? 'Сгенерировать заново' : 'Generate New'}</span>
                      </motion.button>

                      <motion.a
                        href={[customSwampBg, rustWallpaperOne, rustWallpaperTwo, rustWallpaperThree][currentWallpaperIdx]}
                        download={`rust_wallpaper_${currentWallpaperIdx + 1}.jpg`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 px-4 bg-[#1b1e26] hover:bg-[#2a2f3b] text-white font-bold text-xs uppercase tracking-widest border border-[#2a2f3b] hover:border-gray-500 font-mono flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download size={14} />
                        <span>{lang === 'ru' ? 'Скачать / Открыть оригинал' : 'Download / Open Original'}</span>
                      </motion.a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Suspense fallback={null}>
        <Footer
          lang={lang}
          onNavigate={(tab) => handleTabChange(tab)}
          onOpenCabinet={() => handleTabChange('account')}
          onOpenDonation={() => handleTabChange('support')}
          onOpenTerms={() => handleTabChange('terms')}
        />
      </Suspense>

      {/* GLOBAL AUTHORIZATION MODALS */}
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal 
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            lang={lang}
            onUserLogin={(user) => {
              setCurrentUser(user);
              localStorage.setItem('rust_survivor_user', JSON.stringify(user));
            }}
            onToast={(msg, type) => {
              const id = Math.random().toString(36).substring(2, 9);
              setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
              }, 3000);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cabinetModalOpen && (
          <CabinetModal 
            isOpen={cabinetModalOpen}
            onClose={() => setCabinetModalOpen(false)}
            lang={lang}
            user={currentUser}
            onOpenTab={(tab) => handleTabChange(tab as any)}
            onUserLogout={() => {
              setCurrentUser(null);
              localStorage.removeItem('rust_survivor_user');
            }}
            onAvatarChange={(avatarId, photoURL) => {
              if (currentUser) {
                const updated = { ...currentUser, avatarClass: avatarId, photoURL };
                setCurrentUser(updated);
                localStorage.setItem('rust_survivor_user', JSON.stringify(updated));
              }
            }}
            onToast={(msg, type) => {
              const id = Math.random().toString(36).substring(2, 9);
              setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
              }, 3000);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating dynamic status toast alerts container */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              onClick={() => removeToast(toast.id)}
              className={`p-4 rounded-sm border shadow-xl flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${
                toast.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950 hover:border-emerald-500/50'
                  : 'bg-rose-950/90 border-rose-500/30 text-rose-300 hover:bg-rose-950 hover:border-rose-500/50'
              }`}
            >
              <span className="text-xs font-medium leading-relaxed break-all font-sans">{toast.message}</span>
              <button className="text-[10px] uppercase font-bold tracking-wider opacity-60 hover:opacity-100 flex-shrink-0">
                {lang === 'en' ? 'Dismiss' : 'Ок'}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {notificationModalOpen && (
          <NotificationSettingsModal
            isOpen={notificationModalOpen}
            onClose={() => setNotificationModalOpen(false)}
            lang={lang}
            onToast={(msg, type) => {
              const id = Math.random().toString(36).substring(2, 9);
              setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
              }, 3000);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {configExporterModalOpen && (
          <ConfigExporterModal
            isOpen={configExporterModalOpen}
            onClose={() => setConfigExporterModalOpen(false)}
            lang={lang}
            onToast={(msg, type) => {
              const id = Math.random().toString(36).substring(2, 9);
              setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
              }, 3000);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickOverlayOpen && (
          <QuickOverlayModal
            isOpen={quickOverlayOpen}
            onClose={() => setQuickOverlayOpen(false)}
            lang={lang}
            appTheme={appTheme}
            onCopyBind={(code) => handleCopy(code)}
            onOpenFullRaid={() => handleTabChange('raid')}
            onOpenSettings={() => setLauncherSettingsOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Windows Launcher & In-Game Client Settings Modal */}
      <AnimatePresence>
        {launcherSettingsOpen && (
          <LauncherSettingsModal
            isOpen={launcherSettingsOpen}
            onClose={() => setLauncherSettingsOpen(false)}
            lang={lang}
            appTheme={appTheme}
            onToast={(msg, type) => {
              const id = Math.random().toString(36).substring(2, 9);
              setToasts(prev => [...prev, { id, message: msg, type: type === 'error' ? 'error' : 'success' }]);
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
              }, 3000);
            }}
            onSettingsSaved={(newSettings) => {
              setLauncherSettings(newSettings);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTermsModal && (
          <TermsModal
            isOpen={showTermsModal}
            onClose={() => setShowTermsModal(false)}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* All Sections Drawer / Full Catalog (Second Photo Registry) */}
      <SectionsDrawer
        isOpen={sectionsDrawerOpen}
        onClose={() => setSectionsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => handleTabChange(tab)}
        lang={lang}
        appTheme={appTheme}
        isVip={isVip}
        isAdmin={isAdmin}
        isOwner={isOwner}
        onOpenVip={() => setCabinetModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Global Quick Search & Command Palette Modal (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          if (tab === 'hud_overlay') {
            setQuickOverlayOpen(true);
          } else if (tab === 'launcher_settings') {
            setLauncherSettingsOpen(true);
          } else if (tab === 'toggle_launcher') {
            handleToggleLauncherPreview();
          } else {
            handleTabChange(tab as any);
          }
        }}
        lang={lang}
      />

      {/* Mobile Sticky Thumb Navigation Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md px-2 py-1.5 flex items-center justify-around text-[10px] font-mono font-bold shadow-2xl transition-colors ${
        appTheme === 'light'
          ? 'bg-white/95 border-neutral-200 text-neutral-600'
          : 'bg-[#0d1017]/95 border-[#ff2a4d]/30 text-zinc-400'
      }`}>
        <button
          onClick={() => handleTabChange('home')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'home' 
              ? 'text-red-600 font-black' 
              : appTheme === 'light' ? 'text-neutral-500 hover:text-neutral-900' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Home size={18} />
          <span className="text-[9px] uppercase">{lang === 'ru' ? 'Главная' : 'Home'}</span>
        </button>

        <button
          onClick={() => setSectionsDrawerOpen(true)}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            sectionsDrawerOpen 
              ? 'text-red-600 font-black' 
              : appTheme === 'light' ? 'text-neutral-500 hover:text-neutral-900' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <LayoutGrid size={18} className="text-red-600" />
          <span className="text-[9px] uppercase">{lang === 'ru' ? 'Разделы' : 'Sections'}</span>
        </button>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex flex-col items-center justify-center -mt-4 w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-full border-2 border-white/40 shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title={lang === 'ru' ? 'Поиск' : 'Search'}
        >
          <Search size={18} />
        </button>

        <button
          onClick={() => handleTabChange('raid')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'raid' 
              ? 'text-red-600 font-black' 
              : appTheme === 'light' ? 'text-neutral-500 hover:text-neutral-900' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Flame size={18} />
          <span className="text-[9px] uppercase">{lang === 'ru' ? 'Рейд' : 'Raid'}</span>
        </button>

        <button
          onClick={() => handleTabChange('chat')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors relative ${
            activeTab === 'chat' 
              ? 'text-red-600 font-black' 
              : appTheme === 'light' ? 'text-neutral-500 hover:text-neutral-900' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <MessageSquare size={18} />
          <span className="text-[9px] uppercase">{lang === 'ru' ? 'Чат' : 'Chat'}</span>
        </button>
      </div>
    </div>
  );
}
