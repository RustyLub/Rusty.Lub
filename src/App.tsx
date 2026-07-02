import { useState, useEffect } from 'react';
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
  Activity,
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
  ChevronRight,
  Database,
  Coins,
  Gamepad2,
  Twitch,
  Image,
  Download,
  Zap,
  Mail,
  Target
} from 'lucide-react';
import { ToastType, CustomUser } from './types';

// Firebase & Auth Presence dependencies
import { 
  doc, 
  setDoc, 
  db, 
  serverTimestamp, 
  collection, 
  onSnapshot, 
  query
} from './firebase';

// Tab Components
import ErrorsTab from './components/ErrorsTab';
import BindsTab from './components/BindsTab';
import FpsTab from './components/FpsTab';
import RaidCalculatorTab from './components/RaidCalculatorTab';
import ElectricalSimulatorTab from './components/ElectricalSimulatorTab';
import WeaponGuidesTab from './components/WeaponGuidesTab';
import ChatTab from './components/ChatTab';
import NewsTab from './components/NewsTab';
import AuthModal from './components/AuthModal';
import CabinetModal from './components/CabinetModal';
// @ts-ignore
import globalWarfareLogo from './assets/images/global_warfare_logo_1782807450573.jpg';
// @ts-ignore
import rustWallpaperOne from './assets/images/rust_wallpaper_one_1782810116151.jpg';
// @ts-ignore
import rustWallpaperTwo from './assets/images/rust_wallpaper_two_1782810130672.jpg';
// @ts-ignore
import rustWallpaperThree from './assets/images/rust_wallpaper_three_1782810145159.jpg';

const wallpaperTitles = [
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
    errors: { ru: 'Ошибки', en: 'Errors' },
    binds: { ru: 'Бинды', en: 'Binds' },
    fps: { ru: 'Оптимизация FPS', en: 'FPS Boost' },
    raid: { ru: 'Рейд Калькулятор', en: 'Raid Calculator' },
    electrical: { ru: 'Симулятор Электрики', en: 'Electrical Simulator' },
    weapons: { ru: 'Оружие / Мета', en: 'Weapon Guides' },
    news: { ru: 'Новости', en: 'News' }
  },
  discordBtn: { ru: 'Наш Discord', en: 'Our Discord' },
  discordMobileBtn: { ru: 'Наш Discord сервер', en: 'Our Discord Server' },
  bannerSubtitle: { ru: 'УЛЬТИМАТИВНЫЙ СПРАВОЧНИК 2026', en: 'ULTIMATE SURVIVAL KIT 2026' },
  bannerTitle: { ru: 'Rusty.Lub', en: 'Rusty.Lub' },
  bannerDesc: {
    ru: 'Добро пожаловать на профессиональный портал помощи игрокам Rust. Здесь собраны подробные алгоритмы устранения критических ошибок, ультимативные макро-бинды, интерактивный калькулятор рейда с Сачелями и Бобовыми гранатами, а также тонкие настройки для повышения FPS.',
    en: 'Welcome to the professional Rust players support portal. Here you will find detailed algorithms for resolving critical errors, ultimate macro-binds, an interactive raid calculator, and deep tweaks to boost your FPS.'
  },
  bannerBtnErrors: { ru: '💻 РЕШЕНИЯ ОШИБОК', en: '💻 ERROR SOLUTIONS' },
  bannerBtnBinds: { ru: '⌨️ ПОЛЕЗНЫЕ БИНДЫ', en: '⌨️ KEYBIND GUIDES' },
  bannerBtnRaid: { ru: '🎯 НАЧАТЬ РЕЙД РАСЧЕТ', en: '🎯 START RAID CALCULATOR' },
  founderTitle: { ru: 'Основатель клана [EAC]', en: 'Founder of clan [EAC]' },
  founderDesc: {
    ru: 'Привет, боец! Этот проект был собран ветераном Rust с суммарным опытом более 12 000 часов на официальных и кастомных серверах. Вся информация в справочнике выверена на практике, а калькулятор идеально считает расходы ресурсов для рейда любого строения.',
    en: 'Welcome, survivor! This project is curated by a Rust veteran with over 12,000 hours on official and custom servers. All information in this guide has been tested in battle, and the calculator precisely computes sulfur, charcoal, and gunpowder costs.'
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
    ru: 'Присоединяйтесь к нашему Discord-серверу для поиска тиммейтов, обсуждения последних обновлений игры, клановых наборов или получения индивидуальной технической помощи!',
    en: 'Join our Discord server to find teammates, discuss the latest game updates, participate in clan recruitments, or get one-on-one technical assistance!'
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'errors' | 'binds' | 'fps' | 'raid' | 'electrical' | 'weapons' | 'chat' | 'news'>('home');
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'ru' | 'en'>('en');
  const [donationOpen, setDonationOpen] = useState(false);
  const [rustoriaServers, setRustoriaServers] = useState<any[]>([]);
  const [loadingServers, setLoadingServers] = useState(false);
  const [copiedServerId, setCopiedServerId] = useState<string | null>(null);
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

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cabinetModalOpen, setCabinetModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean; type: 'info' | 'hazard' | 'important' } | null>(null);

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
      console.warn("Announcement sync error:", err);
    });
    return () => unsubscribe();
  }, []);

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
      console.warn("Twitch sync error:", err);
    });
    return () => unsubscribe();
  }, []);

  // Periodically check actual Twitch Helix API status if credentials exist
  useEffect(() => {
    if (!twitchSettings) return;
    const { channelName, clientId, clientSecret, isManualLive } = twitchSettings;
    if (!channelName) return;

    const checkActualTwitchLiveStatus = async () => {
      if (isManualLive) return;

      try {
        const response = await fetch('/api/twitch/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelName, clientId, clientSecret })
        });

        if (response.ok) {
          const data = await response.json();
          const isLive = !!data.isLive;
          const viewers = Number(data.viewerCount) || 0;
          const currentTitle = data.title || '';
          const currentGame = data.gameName || '';

          // To prevent double triggering or infinite update loops, only write if there is a difference
          if (
            twitchSettings.isLiveFromApi !== isLive ||
            twitchSettings.viewerCount !== viewers ||
            twitchSettings.apiTitle !== currentTitle ||
            twitchSettings.gameName !== currentGame
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
  }, [twitchSettings]);

  // Periodic presence update for active logged-in user
  useEffect(() => {
    if (!currentUser) return;

    const updatePresence = async () => {
      try {
        await setDoc(doc(db, 'presence', currentUser.uid), {
          lastActive: serverTimestamp(),
          displayName: currentUser.displayName || 'Survivor'
        });
      } catch (err) {
        console.warn('Error updating presence status:', err);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000); // every 30s

    return () => clearInterval(interval);
  }, [currentUser]);

  // Automatically update the logged-in user's avatar and class to Developer as requested
  useEffect(() => {
    if (!currentUser || currentUser.uid !== 'serustqs') return;
    
    const applyDeveloperUpgrade = async () => {
      const developerAvatarUrl = '/src/assets/images/developer_cat_avatar_1782899645243.jpg';
      if (currentUser.avatarClass !== 'developer' || currentUser.photoURL !== developerAvatarUrl) {
        try {
          const userRef = doc(db, 'chat_users', currentUser.uid);
          await setDoc(userRef, {
            avatarClass: 'developer',
            photoURL: developerAvatarUrl
          }, { merge: true });

          const updated = {
            ...currentUser,
            avatarClass: 'developer',
            photoURL: developerAvatarUrl
          };
          setCurrentUser(updated);
          localStorage.setItem('rust_survivor_user', JSON.stringify(updated));

          const toastId = Math.random().toString(36).substring(2, 9);
          setToasts(prev => [...prev, {
            id: toastId,
            message: lang === 'ru' 
              ? 'Ваш аватар и класс успешно изменены на Разработчик!' 
              : 'Your avatar and class have been successfully updated to Developer!',
            type: 'success'
          }]);
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toastId));
          }, 4000);
        } catch (err) {
          console.error('Failed to auto-upgrade to Developer class:', err);
        }
      }
    };

    applyDeveloperUpgrade();
  }, [currentUser, lang]);

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
      setOnlineCount(Math.max(activeCount, currentUser ? 1 : 0));
    }, (error) => {
      console.warn("Presence sync error:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);



  // Wallpaper generator states
  const [wallpaperModalOpen, setWallpaperModalOpen] = useState(false);
  const [wallpaperLoading, setWallpaperLoading] = useState(false);
  const [currentWallpaperIdx, setCurrentWallpaperIdx] = useState(0);
  const [wallpaperLogs, setWallpaperLogs] = useState<string[]>([]);

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
        setCurrentWallpaperIdx(prev => (prev + Math.floor(Math.random() * 2) + 1) % 3);
      }
    }, 550);
  };

  const handleTabChange = (tabId: 'home' | 'errors' | 'binds' | 'fps' | 'raid' | 'electrical' | 'weapons' | 'chat' | 'news') => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchRustoriaServers = async () => {
    setLoadingServers(true);
    const getClientFallbackServers = () => [
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

    try {
      const res = await fetch('/api/rustoria');
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
    fetchRustoriaServers();
    const interval = setInterval(fetchRustoriaServers, 60000);
    return () => clearInterval(interval);
  }, []);

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
    { id: 'news', label: appTranslations.tabs.news[lang], icon: <Compass size={16} /> },
    { id: 'errors', label: appTranslations.tabs.errors[lang], icon: <BookOpen size={16} /> },
    { id: 'binds', label: appTranslations.tabs.binds[lang], icon: <Keyboard size={16} /> },
    { id: 'fps', label: appTranslations.tabs.fps[lang], icon: <Settings size={16} /> },
    { id: 'raid', label: appTranslations.tabs.raid[lang], icon: <Flame size={16} /> },
    { id: 'electrical', label: appTranslations.tabs.electrical[lang], icon: <Zap size={16} /> },
    { id: 'weapons', label: appTranslations.tabs.weapons[lang], icon: <Target size={16} /> },
    { id: 'chat', label: lang === 'ru' ? 'Чат' : 'Chat', icon: <MessageSquare size={16} /> }
  ] as const;

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#e1e1e6] font-sans relative selection:bg-[#cd412b]/30 selection:text-white pb-20 scanlines">
      {/* Topmost Warning Hazard Stripe for authentic Facepunch feel */}
      <div className="h-1 rust-hazard w-full sticky top-0 z-50 shadow-md" />

      {/* Global Announcement Banner from Owner/Admin */}
      {announcement && announcement.active && (
        <div className={`relative overflow-hidden w-full border-b text-xs font-mono py-2 px-4 z-40 select-none flex items-center justify-between ${
          announcement.type === 'hazard' 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
            : announcement.type === 'important'
              ? 'bg-red-500/10 border-red-500/30 text-red-500'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          <div className="flex items-center gap-2 font-black shrink-0 uppercase tracking-widest text-[10px] bg-black/40 px-2 py-0.5 border border-current">
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
            SYS_MSG_v1.0
          </div>
        </div>
      )}

      {/* Dynamic scanline overlay background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#cd412b]/8 via-[#0c0d10] to-[#08090c] pointer-events-none z-0" />
      
      {/* Subtle Grid overlay for tactical gamer theme */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Watermark in margins */}
      <div className="fixed bottom-3 right-5 text-[9px] font-mono text-gray-500/30 pointer-events-none z-50 select-none hidden md:block">
        [SYS_SEC: SECURE] • [EAC_STATUS: ACTIVE] • RUSTY.LUB 2026
      </div>

      {/* HEADER / NAVIGATION BAR */}
      <nav className="sticky top-1 z-40 bg-[#0c0e14]/90 backdrop-blur-md border-b border-[#1f232e] shadow-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-7 h-7 bg-[#cd412b] rounded flex items-center justify-center font-bold text-white shadow-md shadow-[#cd412b]/20 relative overflow-hidden group">
                <span className="relative z-10 text-sm">🦀</span>
                <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-black text-base tracking-widest text-white font-teko leading-none block">
                  RUSTY<span className="text-[#cd412b]">.LUB</span>
                </span>
                <span className="block text-[7.5px] font-black text-gray-400 tracking-widest font-mono uppercase leading-none mt-0.5">
                  SURVIVAL KIT v2.4
                </span>
                {/* Online Users Indicator integrated directly below logo */}
                <div className="flex items-center gap-1 text-[7.5px] font-mono text-[#10b981] font-bold select-none leading-none mt-1">
                  <span className="relative flex h-1 w-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1 w-1 bg-[#10b981]"></span>
                  </span>
                  <span className="tracking-widest uppercase text-gray-400">
                    {lang === 'ru' ? 'В СЕТИ' : 'ONLINE'}: <span className="text-emerald-400 font-extrabold">{onlineCount}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Language Selection, Chat & Login Buttons - Streamlined Horizontal Row */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Chat Button */}
              <button
                onClick={() => handleTabChange('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold border rounded-md transition-all cursor-pointer font-mono uppercase ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-blue-600 to-[#ff4d30] text-white border-purple-500/40 shadow-md shadow-purple-500/10'
                    : 'bg-[#1b1e26]/40 hover:bg-[#1b1e26]/80 border-[#2a2f3b] hover:border-gray-500 text-gray-300 hover:text-white'
                }`}
              >
                <MessageSquare size={12} className={activeTab === 'chat' ? 'text-white' : 'text-purple-400'} />
                <span>{lang === 'ru' ? 'ЧАТ' : 'CHAT'}</span>
              </button>

              {/* Profile/Auth Button */}
              {currentUser ? (
                <button
                  onClick={() => setCabinetModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold bg-[#1b1e26]/40 hover:bg-[#1b1e26]/80 border border-[#2a2f3b] hover:border-gray-500 text-gray-300 hover:text-white transition-all cursor-pointer rounded-md font-mono uppercase shrink-0"
                >
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName} 
                    className="w-4 h-4 rounded-full object-cover border border-gray-700 bg-black shrink-0"
                  />
                  <span className="tracking-wider">
                    {currentUser.uid === 'serustqs' 
                      ? (lang === 'ru' ? 'ВЛАДЕЛЕЦ' : 'OWNER') 
                      : (lang === 'ru' ? 'КАБИНЕТ' : 'PROFILE')}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold bg-[#cd412b]/10 border border-[#cd412b]/30 hover:border-[#cd412b] hover:bg-[#cd412b]/20 text-white transition-all cursor-pointer rounded-md font-mono uppercase shrink-0"
                >
                  <Power size={11} className="text-[#cd412b] animate-pulse" />
                  <span className="tracking-wider">{lang === 'ru' ? 'ВОЙТИ' : 'LOG IN'}</span>
                </button>
              )}

              {/* Language Selector */}
              <button
                onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                className="flex items-center px-2 py-1.5 text-[9px] font-mono font-bold bg-[#14171e]/40 hover:bg-[#1b1e26]/60 border border-[#2a2f3b] hover:border-gray-500 text-gray-400 hover:text-white transition-all cursor-pointer rounded-md shrink-0"
                title={lang === 'ru' ? 'Switch to English' : 'Переключить на Русский'}
              >
                <span className={lang === 'ru' ? 'text-white font-bold' : 'text-gray-500'}>RU</span>
                <span className="text-gray-700 mx-1">|</span>
                <span className={lang === 'en' ? 'text-white font-bold' : 'text-gray-500'}>EN</span>
              </button>
            </div>

            {/* Mobile Actions: Language & Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              {currentUser ? (
                <button
                  onClick={() => setCabinetModalOpen(true)}
                  className="p-1.5 bg-[#1b1e26] border border-[#2a2f3b] rounded-sm shrink-0"
                  title={lang === 'ru' ? 'Кабинет' : 'Profile'}
                >
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName} 
                    className="w-5 h-5 rounded-full object-cover border border-gray-700 bg-black"
                  />
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="p-1.5 bg-[#cd412b]/15 border border-[#cd412b]/40 rounded-sm text-white shrink-0"
                  title={lang === 'ru' ? 'Войти' : 'Log In'}
                >
                  <Power size={14} className="text-[#cd412b]" />
                </button>
              )}

              <div className="flex flex-col items-center">
                <button
                  onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                  className="flex items-center gap-1 px-2 py-1 text-[9px] font-bold bg-[#1b1e26] border border-[#2a2f3b] text-gray-300 rounded-sm"
                >
                  <span>{lang === 'ru' ? 'RU' : 'EN'}</span>
                </button>
                <div className="flex items-center gap-0.5 text-[8px] font-mono text-gray-500 font-bold uppercase mt-0.5 leading-none">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                  <span>{onlineCount}</span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-sm text-gray-400 hover:text-white hover:bg-[#1b1e26] border border-[#2a2f3b]"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-[#2a2f3b] bg-[#14171e]/95 px-4 pt-2 pb-4 space-y-2"
            >
              {currentUser ? (
                <button
                  onClick={() => {
                    setCabinetModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#cd412b]/10 border border-[#cd412b]/35 rounded-sm"
                >
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName} 
                    className="w-6 h-6 rounded-full object-cover border border-gray-700 bg-black shrink-0"
                  />
                  <span>
                    {currentUser.uid === 'serustqs' 
                      ? (lang === 'ru' ? 'Кабинет Владельца' : 'Owner Panel') 
                      : (lang === 'ru' ? 'Личный Кабинет' : 'My Profile')}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#cd412b] hover:bg-[#b03825] rounded-sm"
                >
                  <Power size={14} />
                  <span>{lang === 'ru' ? 'Войти в аккаунт' : 'Log In / Register'}</span>
                </button>
              )}

              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabChange(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all rounded-sm ${
                      isActive
                        ? 'bg-[#cd412b] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#1b1e26]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Donation button */}
              <button
                onClick={() => {
                  setDonationOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-amber-400 hover:text-white hover:bg-amber-600/10 border border-amber-500/20 rounded-sm"
              >
                <Heart size={16} className="fill-amber-500/20 animate-pulse" />
                <span>{lang === 'ru' ? 'Пожертвование для развития' : 'Donation for development'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* CORE APPLICATION CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          {/* Left Sidebar Navigation - Only on Desktop */}
          <aside className="w-full lg:w-52 shrink-0 lg:sticky lg:top-20 space-y-5 hidden lg:block xl:absolute xl:right-full xl:mr-8 xl:top-0 xl:w-44">
            <div className="bg-[#14171e]/90 border border-[#2a2f3b] p-2.5 space-y-1.5 rounded-none shadow-xl relative rust-metal-pattern">
              {/* Corner Brackets to fit the Rust authentic feel */}
              <div className="rust-bracket-tl" />
              <div className="rust-bracket-tr" />
              <div className="rust-bracket-bl" />
              <div className="rust-bracket-br" />
              
              <div className="px-3 py-2.5 border-b border-[#2a2f3b] mb-3">
                <span className="text-[9px] font-mono font-black text-[#cd412b] tracking-widest uppercase block">
                  {lang === 'ru' ? 'НАВИГАЦИЯ' : 'NAVIGATION'}
                </span>
              </div>

              {tabs.filter(t => t.id !== 'chat').map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer rounded-none relative overflow-hidden font-mono group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/10 to-[#ff4d30]/10 text-white border border-[#cd412b]/40 shadow-sm font-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className={`transition-transform duration-150 group-hover:scale-105 ${isActive ? 'text-[#cd412b]' : 'text-gray-500 group-hover:text-[#cd412b]'}`}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {/* Hover indicator side bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#cd412b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  </button>
                );
              })}
            </div>
            
            {/* System Status Info block in sidebar */}
            <div className="bg-[#14171e]/50 border border-[#2a2f3b] p-3 text-[10px] font-mono text-gray-500 space-y-2 rounded-none">
              <div className="flex justify-between">
                <span>SYSTEM_SEC:</span>
                <span className="text-gray-400">SECURE</span>
              </div>
              <div className="flex justify-between">
                <span>EAC_STATUS:</span>
                <span className="text-emerald-500 font-bold uppercase">{lang === 'ru' ? 'АКТИВЕН' : 'ACTIVE'}</span>
              </div>
              <div className="flex justify-between">
                <span>VERSION:</span>
                <span className="text-gray-400">v2.4</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 w-full">
            <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Grand Banner */}
              <div className="relative overflow-hidden rounded-none bg-gradient-to-b from-[#14171e] via-[#0d0f14] to-[#14171e] border-2 border-[#2a2f3b] p-8 sm:p-12 text-center space-y-6 shadow-2xl rust-metal-pattern">
                {/* Tactical Corner Brackets */}
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                {/* Top Hazard Diagonal Stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 rust-hazard" />
                
                {/* Visual HUD Corner details */}
                <div className="absolute bottom-2 left-3 text-[7px] font-mono text-gray-600 select-none hidden sm:block uppercase">SYS_REF: #F71A</div>
                <div className="absolute bottom-2 right-3 text-[7px] font-mono text-gray-600 select-none hidden sm:block uppercase">EAC_PROT: INSTALLED</div>

                {/* Visual Glow behind title */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#cd412b]/15 rounded-full blur-[100px] pointer-events-none" />

                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#cd412b]/15 border border-[#cd412b]/35 text-[10px] font-bold tracking-wider text-[#cd412b] uppercase font-mono rounded-none">
                  <Sparkles size={11} className="animate-pulse text-[#cd412b]" />
                  <span>{appTranslations.bannerSubtitle[lang]}</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-bold tracking-widest leading-none text-white font-teko uppercase">
                  RUSTY.LU<span className="text-[#cd412b]">B</span>
                </h1>

                <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
                  {appTranslations.bannerDesc[lang]}
                </p>

                {/* Suggestions & Feedback Terminal Banner */}
                <div className="relative overflow-hidden bg-[#1b1e26]/90 border border-[#2a2f3b] p-3 sm:p-4 max-w-xl mx-auto rounded-none text-left space-y-1 sm:space-y-1.5 shadow-md">
                  <div className="absolute top-0 right-0 w-2 h-full bg-[#cd412b] opacity-40" />
                  <div className="flex items-start gap-3">
                    <div className="bg-[#cd412b]/10 text-[#cd412b] p-1.5 border border-[#cd412b]/20 mt-0.5">
                      <Mail size={14} className="animate-pulse" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-black tracking-widest text-[#cd412b] uppercase font-mono leading-none">
                        {lang === 'ru' ? '📬 ПРЕДЛОЖЕНИЯ И ДОРАБОТКИ ДЛЯ САЙТА' : '📬 SUGGESTIONS & WEBSITE PROPOSALS'}
                      </h4>
                      <p className="text-[10.5px] text-gray-400 leading-normal font-sans font-medium">
                        {lang === 'ru' 
                          ? 'Если чего-то не хватает или нашли ошибку в базе данных, напишите нам на почту для обращений: ' 
                          : 'If anything is missing or you found an error in our database, please write to us at our official contact mail: '}
                        <a 
                          href="mailto:rusty.lub_offers@bk.ru" 
                          className="text-[#cd412b] hover:text-[#b03825] font-black underline hover:no-underline transition-colors font-mono"
                        >
                          rusty.lub_offers@bk.ru
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleTabChange('errors')}
                    className="px-5 py-2.5 bg-[#1b1e26] hover:bg-white/5 border border-[#2a2f3b] hover:border-gray-500 rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-white"
                  >
                    {appTranslations.bannerBtnErrors[lang]}
                  </button>
                  <button
                    onClick={() => handleTabChange('binds')}
                    className="px-5 py-2.5 bg-[#1b1e26] hover:bg-white/5 border border-[#2a2f3b] hover:border-gray-500 rounded-none text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-white"
                  >
                    {appTranslations.bannerBtnBinds[lang]}
                  </button>
                  <button
                    onClick={() => handleTabChange('raid')}
                    className="px-6 py-2.5 bg-[#cd412b] hover:bg-[#b03825] text-white rounded-none text-xs font-black uppercase tracking-wider shadow-lg shadow-[#cd412b]/20 hover:shadow-[#cd412b]/35 transition-all cursor-pointer border border-[#e6553f]"
                  >
                    {appTranslations.bannerBtnRaid[lang]}
                  </button>
                  <button
                    onClick={() => setDonationOpen(true)}
                    className="px-3 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/30 text-amber-500/90 hover:text-amber-400 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 font-mono"
                  >
                    <Heart size={11} className="fill-amber-500/10 animate-pulse text-amber-500/80" />
                    <span>{lang === 'ru' ? 'Поддержать проект' : 'Support development'}</span>
                  </button>
                </div>
              </div>

              {/* Twitch Live Stream Widget */}
              {twitchSettings && (twitchSettings.isManualLive || twitchSettings.isLiveFromApi) && (
                <div className="bg-[#14171e]/90 border-2 border-purple-600/50 rounded-none p-6 shadow-[0_0_25px_rgba(168,85,247,0.15)] relative overflow-hidden rust-metal-pattern">
                  {/* Tactical Corner Brackets with purple hue */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-500" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-500" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500" />

                  {/* Twitch Purple top header stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600" />

                  <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                    <div className="space-y-3 flex-1">
                      {/* Live Badge */}
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500 font-mono">
                          {lang === 'ru' ? 'ПРЯМОЙ ЭФИР' : 'LIVE BROADCAST'}
                        </span>
                        <span className="text-gray-600 font-mono text-[9px]">•</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-purple-400 font-mono flex items-center gap-1">
                          <span>TWITCH</span>
                        </span>
                        {!!twitchSettings.viewerCount && twitchSettings.viewerCount > 0 && (
                          <>
                            <span className="text-gray-600 font-mono text-[9px]">•</span>
                            <span className="text-[9px] font-bold text-gray-300 font-mono">
                              👁️ {twitchSettings.viewerCount} {lang === 'ru' ? 'зрителей' : 'viewers'}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase leading-tight font-sans tracking-wide">
                          {twitchSettings.streamTitle || twitchSettings.apiTitle || (lang === 'ru' ? 'НАЧАЛСЯ СТРИМ!' : 'STREAM IS LIVE!')}
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono">
                          {lang === 'ru' ? 'Канал:' : 'Channel:'} <span className="text-purple-400 font-bold hover:underline cursor-pointer" onClick={() => window.open(`https://twitch.tv/${twitchSettings.channelName}`, '_blank')}>{twitchSettings.channelName}</span>
                          {twitchSettings.gameName && ` • ${lang === 'ru' ? 'Категория' : 'Category'}: ${twitchSettings.gameName}`}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <a
                          href={`https://twitch.tv/${twitchSettings.channelName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-600/20 border border-purple-500"
                        >
                          <span className="text-xs">📺</span>
                          <span>{lang === 'ru' ? 'ПЕРЕЙТИ НА TWITCH КАНАЛ' : 'GO TO TWITCH CHANNEL'}</span>
                        </a>
                      </div>
                    </div>

                    {/* Interactive Twitch Stream Frame embed */}
                    <div className="w-full lg:w-[420px] aspect-video border border-purple-500/20 bg-black/50 relative overflow-hidden shrink-0">
                      <iframe
                        src={`https://player.twitch.tv/?channel=${twitchSettings.channelName}&parent=${window.location.hostname}&muted=false`}
                        frameBorder="0"
                        allowFullScreen={true}
                        scrolling="no"
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}

              {/* Global Warfare 4 Event Section */}
              <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-6 sm:p-8 shadow-xl relative overflow-hidden rust-metal-pattern">
                {/* Tactical Corner Brackets */}
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                {/* Left side decorative hazard stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rust-hazard" />
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                  {/* Left Side: Generated Artwork */}
                  <div className="md:col-span-5 relative group overflow-hidden border border-[#2a2f3b] bg-black/40">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                    
                    {/* Corner accents on image */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#cd412b] z-20" />
                    <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#cd412b] z-20" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#cd412b] z-20" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#cd412b] z-20" />

                    <img 
                      src={globalWarfareLogo} 
                      alt="Global Warfare 4" 
                      className="w-full h-auto aspect-square object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Date Badge Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/85 border-l-2 border-l-[#cd412b] border-y border-r border-[#2a2f3b] px-3.5 py-2 z-20">
                      <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-wider font-mono">
                        {lang === 'ru' ? 'Даты Проведения' : 'Event Dates'}
                      </span>
                      <span className="text-xs font-black text-[#cd412b] uppercase tracking-wide font-mono">
                        {appTranslations.globalWarfare.dates[lang]}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Event Details */}
                  <div className="md:col-span-7 space-y-5">
                    <div className="space-y-2">
                      {/* Live Indicator Badge & Event Flyer Tag */}
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cd412b] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#cd412b]"></span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white bg-[#cd412b]">
                          {appTranslations.globalWarfare.flyerTitle[lang]}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider">
                          GW4 Esports
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans uppercase leading-none">
                        {appTranslations.globalWarfare.title[lang]}
                      </h3>
                      
                      <div className="h-[1px] w-20 bg-[#cd412b]" />
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans font-medium">
                      {appTranslations.globalWarfare.desc[lang]}
                    </p>

                    {/* Twitch CTA Button */}
                    <div className="pt-2">
                      <motion.a
                        href="https://www.twitch.tv/tv_cheater/about"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-[#6441a5] hover:bg-[#772ce8] transition-all shadow-lg shadow-[#6441a5]/10 rounded-none border border-[#9146ff]/40 hover:border-[#9146ff] relative overflow-hidden group"
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                        
                        <Twitch size={15} className="animate-bounce" />
                        <span>{appTranslations.globalWarfare.watchBtn[lang]}</span>
                        <ExternalLink size={12} className="opacity-80" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clan EAC Leader & Veteran Bio */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Biography card */}
                <div className="md:col-span-8 bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
                  <div className="rust-bracket-tl" />
                  <div className="rust-bracket-tr" />
                  <div className="rust-bracket-bl" />
                  <div className="rust-bracket-br" />

                  <div className="absolute top-0 right-0 w-24 h-24 rust-hazard-dark pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">👑</span>
                        <div>
                          <h2 className="text-lg font-bold text-white tracking-wider font-teko uppercase">
                            {appTranslations.founderTitle[lang]}
                          </h2>
                          <span className="text-xs text-[#cd412b] font-bold font-mono">
                            [EAC]{'{'}CHEATER{'}'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Interactive Custom Rust Survival Stats HUD */}
                      <div className="flex gap-4 bg-[#0c0d10] p-2 border border-[#2a2f3b] text-[10px] font-mono">
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-gray-500 gap-4">
                            <span>🥩 FOOD</span>
                            <span className="text-orange-400">250</span>
                          </div>
                          <div className="w-16 h-1 bg-orange-500" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-gray-500 gap-4">
                            <span>💧 WATER</span>
                            <span className="text-blue-400">250</span>
                          </div>
                          <div className="w-16 h-1 bg-blue-500" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-gray-500 gap-4">
                            <span>☢️ RADS</span>
                            <span className="text-emerald-400">0</span>
                          </div>
                          <div className="w-16 h-1 bg-[#2a2f3b]" />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium">
                      {appTranslations.founderDesc[lang]}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                      <div className="bg-[#1b1e26] p-3.5 rounded-none border border-[#2a2f3b] text-center hover:border-gray-600/50 transition-colors relative">
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
                        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
                        <Clock className="text-[#cd412b] mx-auto mb-1.5" size={18} />
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider font-mono">
                          {appTranslations.hoursCount[lang]}
                        </span>
                        <span className="text-base font-black text-white font-mono">12 000+</span>
                      </div>

                      <div className="bg-[#1b1e26] p-3.5 rounded-none border border-[#2a2f3b] text-center hover:border-gray-600/50 transition-colors relative">
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
                        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
                        <ShieldAlert className="text-[#cd412b] mx-auto mb-1.5" size={18} />
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider font-mono">
                          {appTranslations.vacStatus[lang]}
                        </span>
                        <span className="text-base font-black text-emerald-400 font-sans">{appTranslations.vacSafe[lang]}</span>
                      </div>

                      <div className="bg-[#1b1e26] p-3.5 rounded-none border border-[#2a2f3b] text-center col-span-2 sm:col-span-3 hover:border-gray-600/50 transition-colors relative">
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
                        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
                        <Flame className="text-[#cd412b] mx-auto mb-1.5" size={18} />
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider font-mono">
                          {appTranslations.wipesPlayed[lang]}
                        </span>
                        <span className="text-xs font-bold text-gray-200 font-sans block mt-1 uppercase tracking-wide leading-relaxed">
                          {lang === 'ru'
                            ? 'Отличный инструмент как для новичка, так и для опытного игрока'
                            : 'An excellent tool for both beginners and experienced players'}
                        </span>
                      </div>
                    </div>

                    {/* Social profiles row with tactile, beautifully designed masked link buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <motion.a
                        href="https://steamcommunity.com/id/EACCHEATER"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white bg-[#171a21] hover:bg-[#2a475e] transition-colors border border-[#2a2f3b] hover:border-blue-400/50 rounded-none shadow-md shadow-black/25 relative"
                      >
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-gray-500/50" />
                        <Gamepad2 size={13} className="text-blue-400 animate-pulse" />
                        <span>{lang === 'ru' ? 'Steam Профиль' : 'Steam Profile'}</span>
                        <ExternalLink size={10} className="text-gray-500" />
                      </motion.a>

                      <motion.a
                        href="https://www.twitch.tv/tv_cheater/about"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white bg-[#6441a5]/10 hover:bg-[#6441a5] hover:text-white text-[#9146ff] transition-all border border-[#6441a5]/30 hover:border-[#9146ff] rounded-none shadow-md relative"
                      >
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-gray-500/50" />
                        <Twitch size={13} />
                        <span>{lang === 'ru' ? 'Twitch Канал' : 'Twitch Channel'}</span>
                        <ExternalLink size={10} className="opacity-75" />
                      </motion.a>

                      <motion.button
                        onClick={generateWallpaper}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 hover:bg-amber-500 hover:text-black transition-all border border-amber-500/30 hover:border-amber-400 rounded-none shadow-md relative cursor-pointer"
                      >
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-amber-500/50" />
                        <Sparkles size={13} className="animate-pulse" />
                        <span>{lang === 'ru' ? 'Сгенерировать обои Rust' : 'Generate Rust Wallpaper'}</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2a2f3b] flex items-center justify-between flex-wrap gap-4">
                    <span className="text-[10px] text-gray-500 font-mono">
                      {appTranslations.copyright[lang]}
                    </span>
                    <a
                      href="https://discord.gg/R2TyKZ9xvZ"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#cd412b] hover:text-[#b03825] font-bold tracking-wider uppercase font-mono"
                    >
                      <span>{appTranslations.joinClan[lang]}</span> <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Right Side Sidebar Column */}
                <div className="md:col-span-4 space-y-6 flex flex-col justify-between">
                  {/* News & Updates Widget - Styled "как на самом вверху" (with hazard stripe, brackets, flashing dot) */}
                  <div className="bg-gradient-to-b from-[#14171e] via-[#0d0f14] to-[#14171e] border-2 border-[#cd412b]/40 p-6 shadow-xl relative overflow-hidden rust-metal-pattern flex flex-col justify-between">
                    {/* Tactical Corner Brackets */}
                    <div className="rust-bracket-tl" />
                    <div className="rust-bracket-tr" />
                    <div className="rust-bracket-bl" />
                    <div className="rust-bracket-br" />

                    {/* Top Hazard Warning Stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />

                    <div className="space-y-4">
                      {/* Flashing Alert Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-[#cd412b]/15 border border-[#cd412b]/35 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#cd412b] font-mono">
                          <span className="relative flex h-1 w-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1 w-1 bg-[#cd412b]"></span>
                          </span>
                          <span>{lang === 'ru' ? 'СВЕЖИЕ НОВОСТИ' : 'LATEST NEWS'}</span>
                        </div>
                        <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">FEED_v2.6</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white tracking-wider font-teko uppercase text-lg">
                          {lang === 'ru' ? 'Новости и обновления Rust' : 'Rust News & Updates'}
                        </h3>
                        <div className="h-[1px] w-12 bg-[#cd412b]" />
                      </div>

                      {/* July Update 2026 Promo */}
                      <div className="bg-black/40 border border-[#2a2f3b] p-3.5 space-y-2 relative text-left">
                        <div className="absolute top-1 right-2 text-[7px] font-mono text-gray-600 font-bold">02.07.2026</div>
                        <span className="block text-[9px] text-[#cd412b] font-mono font-bold uppercase tracking-wider">
                          JULY UPDATE 2026
                        </span>
                        <h4 className="text-xs font-black text-white uppercase tracking-wide leading-snug">
                          {lang === 'ru' 
                            ? 'Июльское обновление 2026: Военная Верфь и Энергетический Прорыв' 
                            : 'July Update 2026: Military Shipyard & Power Grid Breakthrough'}
                        </h4>
                        <p className="text-[10.5px] text-gray-400 font-sans leading-normal line-clamp-3">
                          {lang === 'ru'
                            ? 'Глобальный патч: новый монумент высокой опасности Tier 3, автоматизация жидкотопливных генераторов и оптимизация Unity Job System.'
                            : 'Global patch: brand new Tier 3 high-danger monument, liquid fuel generators automation, and Unity Job System optimizations.'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleTabChange('news')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#cd412b] hover:bg-[#b03825] text-white rounded-none text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border border-[#e6553f]"
                      >
                        <span>{lang === 'ru' ? 'ЧИТАТЬ ОБНОВЛЕНИЕ' : 'READ PATCH LOG'}</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Discord Widget / CTA */}
                  <div className="bg-gradient-to-br from-[#14171e] to-[#0c0d10] p-6 flex flex-col justify-between border border-[#2a2f3b] rounded-none shadow-xl relative overflow-hidden flex-1 mt-0">
                    <div className="rust-bracket-tl" />
                    <div className="rust-bracket-tr" />
                    <div className="rust-bracket-bl" />
                    <div className="rust-bracket-br" />

                    <div className="absolute top-0 right-0 w-2 h-full rust-hazard opacity-40" />
                    
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-none bg-[#cd412b]/10 text-[#cd412b] flex items-center justify-center border border-[#cd412b]/20 shadow-inner relative">
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-[#cd412b]/60" />
                        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#cd412b]/60" />
                        <MessageSquare size={22} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-wider font-teko uppercase text-lg">
                          {appTranslations.discordWidgetTitle[lang]}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-sans font-medium">
                          {appTranslations.discordWidgetDesc[lang]}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 relative z-10">
                      <a
                        href="https://discord.gg/R2TyKZ9xvZ"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-none text-xs font-bold uppercase tracking-wider text-white bg-[#5865F2] hover:bg-[#4752c4] transition-all shadow-md"
                      >
                        <span>{appTranslations.openDiscord[lang]}</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  {
                    icon: '📖',
                    title: appTranslations.features.errors.title[lang],
                    desc: appTranslations.features.errors.desc[lang],
                    tab: 'errors'
                  },
                  {
                    icon: '⌨️',
                    title: appTranslations.features.binds.title[lang],
                    desc: appTranslations.features.binds.desc[lang],
                    tab: 'binds'
                  },
                  {
                    icon: '⚙️',
                    title: appTranslations.features.fps.title[lang],
                    desc: appTranslations.features.fps.desc[lang],
                    tab: 'fps'
                  },
                  {
                    icon: '💣',
                    title: appTranslations.features.raid.title[lang],
                    desc: appTranslations.features.raid.desc[lang],
                    tab: 'raid'
                  },
                  {
                    icon: '🔌',
                    title: appTranslations.features.electrical.title[lang],
                    desc: appTranslations.features.electrical.desc[lang],
                    tab: 'electrical'
                  },
                  {
                    icon: '🎯',
                    title: appTranslations.features.weapons.title[lang],
                    desc: appTranslations.features.weapons.desc[lang],
                    tab: 'weapons'
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={() => handleTabChange(feature.tab as any)}
                    className="p-5 rounded-none bg-[#14171e]/90 hover:bg-[#1b1e26] border border-[#2a2f3b] hover:border-[#cd412b]/50 cursor-pointer space-y-4 group shadow-md relative overflow-hidden"
                  >
                    {/* Brackets */}
                    <div className="rust-bracket-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-tr opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-bl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-br opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Hover subtle line indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#cd412b] scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />

                    <div className="w-11 h-11 rounded-none flex items-center justify-center bg-[#1b1e26] border border-[#2a2f3b] group-hover:border-[#cd412b]/30 group-hover:bg-[#cd412b]/5 transition-colors text-xl relative">
                       <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
                       <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
                       {feature.icon}
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-black text-gray-200 group-hover:text-[#cd412b] transition-colors font-sans uppercase tracking-wider text-[13px]">
                        {feature.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans font-medium">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* US, EU & SEA Rustoria Server Monitor Section */}
              <div id="rustoria-monitor-section" className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden rust-metal-pattern">
                {/* Tactical Corner Brackets */}
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                {/* Top Hazard Warning Stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />
                <div className="absolute bottom-2 left-3 text-[7px] font-mono text-gray-600 select-none hidden sm:block uppercase">NET_SYS: ONLINE</div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2f3b] pb-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cd412b] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#cd412b]"></span>
                      </span>
                      <h3 className="text-lg font-bold tracking-wider text-white font-teko uppercase leading-none">
                        {appTranslations.rustoriaMonitor.title[lang]}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-2xl font-medium">
                      {appTranslations.rustoriaMonitor.desc[lang]}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Region Filter Selector */}
                    <div className="flex bg-[#0c0d10] p-1 border border-[#2a2f3b] text-[10px] font-mono uppercase">
                      {(['ALL', 'US', 'EU', 'SEA'] as const).map((reg) => (
                        <button
                          key={reg}
                          onClick={() => setRegionFilter(reg)}
                          className={`px-2.5 py-1 font-bold cursor-pointer transition-all ${
                            regionFilter === reg
                              ? 'bg-[#cd412b] text-white font-black'
                              : 'text-gray-500 hover:text-white'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        fetchRustoriaServers();
                      }}
                      disabled={loadingServers}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm text-xs font-bold text-gray-300 bg-[#1b1e26] border border-[#2a2f3b] hover:border-[#cd412b]/40 hover:text-white transition-all cursor-pointer disabled:opacity-50 flex-shrink-0 font-mono uppercase"
                    >
                      <RefreshCw size={12} className={loadingServers ? "animate-spin text-[#cd412b]" : ""} />
                      <span>{loadingServers ? appTranslations.rustoriaMonitor.loading[lang] : appTranslations.rustoriaMonitor.refresh[lang]}</span>
                    </button>
                  </div>
                </div>

                {/* Secondary Controls Bar for Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#1b1e26]/80 p-3 border border-[#2a2f3b] rounded-sm">
                  {/* Search box */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="text"
                      id="server-search-input"
                      value={serverSearch}
                      onChange={(e) => setServerSearch(e.target.value)}
                      placeholder={lang === 'en' ? "Search by server name, map, or IP..." : "Поиск по названию, карте или IP..."}
                      className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/70 text-[#e1e1e6] placeholder-gray-500 pl-9 pr-16 py-2 rounded-sm outline-none transition-all text-xs font-mono"
                    />
                    {serverSearch && (
                      <button
                        onClick={() => setServerSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-[#cd412b]/25 hover:bg-[#cd412b]/40 text-white border border-[#cd412b]/30 transition-colors uppercase font-mono"
                      >
                        {lang === 'en' ? 'Clear' : 'Сброс'}
                      </button>
                    )}
                  </div>

                  {/* Active servers counter */}
                  <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5 self-center">
                    <span>{lang === 'en' ? 'Showing' : 'Показано'}:</span>
                    <span className="text-[#cd412b] font-black bg-[#0c0d10] px-2 py-0.5 border border-[#2a2f3b] rounded-sm">
                      {rustoriaServers.filter((server) => {
                        const matchesRegion = regionFilter === 'ALL' || 
                          server.name.toLowerCase().includes(`-${regionFilter.toLowerCase()}`) || 
                          server.name.toLowerCase().includes(` ${regionFilter.toLowerCase()} `) ||
                          server.id.toLowerCase().includes(`-${regionFilter.toLowerCase()}`);
                        const matchesSearch = serverSearch === '' || 
                          server.name.toLowerCase().includes(serverSearch.toLowerCase()) ||
                          server.ip.toLowerCase().includes(serverSearch.toLowerCase()) ||
                          (server.map && server.map.toLowerCase().includes(serverSearch.toLowerCase()));
                        return matchesRegion && matchesSearch;
                      }).length}
                    </span>
                    <span>{lang === 'en' ? 'servers' : 'серверов'}</span>
                  </div>
                </div>

                {/* Server Table / Cards List */}
                <div className="space-y-3">
                  {rustoriaServers.length === 0 && loadingServers ? (
                    <div className="py-12 text-center space-y-3">
                      <RefreshCw size={24} className="animate-spin text-[#cd412b] mx-auto" />
                      <p className="text-xs text-gray-500 font-mono">{appTranslations.rustoriaMonitor.loading[lang]}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      <AnimatePresence>
                      {rustoriaServers
                        .filter((server) => {
                          const matchesRegion = regionFilter === 'ALL' || 
                            server.name.toLowerCase().includes(`-${regionFilter.toLowerCase()}`) || 
                            server.name.toLowerCase().includes(` ${regionFilter.toLowerCase()} `) ||
                            server.id.toLowerCase().includes(`-${regionFilter.toLowerCase()}`);
                          const matchesSearch = serverSearch === '' || 
                            server.name.toLowerCase().includes(serverSearch.toLowerCase()) ||
                            server.ip.toLowerCase().includes(serverSearch.toLowerCase()) ||
                            (server.map && server.map.toLowerCase().includes(serverSearch.toLowerCase()));
                          return matchesRegion && matchesSearch;
                        })
                        .map((server) => {
                          const connectCmd = `connect ${server.ip}:${server.port}`;
                          const isCopied = copiedServerId === server.id;
                          const progressPercent = Math.min(100, Math.max(0, (server.players / server.maxPlayers) * 100));
                          
                          return (
                            <motion.section
                              key={server.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-sm bg-[#1b1e26] border-l-4 border-l-[#cd412b] border-y border-r border-[#2a2f3b] hover:border-r-gray-500 hover:border-y-gray-500 transition-all gap-4 group relative overflow-hidden"
                            >
                              {/* Server info / Status */}
                              <div className="flex items-start gap-3 lg:w-1/3 z-10">
                                <div className="mt-1 flex-shrink-0">
                                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${server.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500'}`} />
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="text-xs sm:text-sm font-bold text-white font-sans tracking-tight group-hover:text-[#cd412b] transition-colors leading-tight uppercase font-mono">
                                    {server.name}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-gray-500 font-mono">
                                    <span>{server.map}</span>
                                    <span>•</span>
                                    <span className="text-[#cd412b] font-bold">{server.fps} FPS</span>
                                  </div>
                                </div>
                              </div>

                              {/* Players progress bar and count */}
                              <div className="lg:w-1/4 space-y-1.5 z-10">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-gray-400 font-bold uppercase">{appTranslations.rustoriaMonitor.players[lang]}</span>
                                  <span className="text-white font-black">{server.players} / {server.maxPlayers}</span>
                                </div>
                                <div className="w-full h-2 bg-[#0c0d10] border border-[#2a2f3b] rounded-none overflow-hidden">
                                  <div 
                                    className="h-full bg-[#cd412b] transition-all duration-500" 
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>

                              {/* Queue and Wipe date info */}
                              <div className="flex items-center justify-between lg:justify-start gap-6 lg:w-1/5 text-xs z-10">
                                <div className="space-y-0.5">
                                  <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-wider font-mono">{appTranslations.rustoriaMonitor.queue[lang]}</span>
                                  <span className={`font-mono font-bold ${server.queue > 0 ? 'text-amber-400 text-sm' : 'text-gray-400'}`}>
                                    {server.queue}
                                  </span>
                                </div>
                                
                                <div className="space-y-0.5">
                                  <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-wider font-mono">{appTranslations.rustoriaMonitor.wipe[lang]}</span>
                                  <span className="font-mono text-gray-300 font-bold uppercase">
                                    {server.lastWipe ? new Date(server.lastWipe).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                                  </span>
                                </div>
                              </div>

                              {/* Connect buttons */}
                              <div className="flex items-center gap-2 lg:w-1/5 justify-end z-10">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(connectCmd);
                                    setCopiedServerId(server.id);
                                    handleCopy(connectCmd);
                                    setTimeout(() => setCopiedServerId(null), 3000);
                                  }}
                                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-sm text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer font-mono ${
                                    isCopied 
                                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
                                      : 'bg-[#0c0d10] text-gray-300 border border-[#2a2f3b] hover:border-[#cd412b]/40 hover:text-white'
                                  }`}
                                >
                                  {isCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                  <span>{isCopied ? appTranslations.rustoriaMonitor.copied[lang] : appTranslations.rustoriaMonitor.connect[lang]}</span>
                                </button>
                              </div>
                            </motion.section>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
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
              <NewsTab lang={lang} />
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
              <ErrorsTab onCopy={handleCopy} lang={lang} />
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
              <BindsTab onCopy={handleCopy} lang={lang} />
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
              <FpsTab onCopy={handleCopy} lang={lang} />
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
              <RaidCalculatorTab lang={lang} />
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
              />
            </motion.div>
          )}
            </AnimatePresence>
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
                        src={[rustWallpaperOne, rustWallpaperTwo, rustWallpaperThree][currentWallpaperIdx]}
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
                        href={[rustWallpaperOne, rustWallpaperTwo, rustWallpaperThree][currentWallpaperIdx]}
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
    </div>
  );
}
