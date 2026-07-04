export interface NewsItem {
  id: string;
  category: 'updates' | 'blogs' | 'events';
  title: { ru: string; en: string };
  date: string;
  author: string;
  badge: { ru: string; en: string };
  isFeatured: boolean;
  coverImage: string;
  summary: { ru: string; en: string };
  content: {
    ru: { sectionTitle: string; text: string; highlights: string[] }[];
    en: { sectionTitle: string; text: string; highlights: string[] }[];
  };
}

export interface ErrorItem {
  category: 'critical' | 'network' | 'eac' | 'graphics';
  title: string;
  desc?: string;
  sols: string[];
}

export interface BindItem {
  category: 'PVP' | 'МЕДИЦИНА' | 'ФАРМ' | 'СТРОЙКА' | 'УПРАВЛЕНИЕ' | 'QOL' | 'МОДОВЫЕ';
  cmd: string;
  desc: string;
  explanation?: string;
}

export interface AdminCommandItem {
  category: 'ПРАВА' | 'МОДЕРАЦИЯ' | 'РЕЖИМЫ' | 'ТЕЛЕПОРТ' | 'ВЫДАЧА' | 'МИР' | 'СУЩНОСТИ' | 'ИНФО';
  cmd: string;
  desc: string;
  example?: string;
  explanation?: string;
}

export interface RaidWeapon {
  id: 'c4' | 'rocket' | 'satchel' | 'explosive_ammo' | 'beancan';
  name: string;
  sulfurPer: number;
  charcoalPer: number;
  gpPer: number;
  metalPer: number;
  icon: string;
}

export interface RaidTarget {
  id: string;
  name: string;
  category: 'walls' | 'doors' | 'deployables';
  icon: string;
  hp: number;
  // Cost in absolute items needed to destroy
  c4: number;
  rocket: number;
  satchel: number;
  explosive_ammo: number;
  beancan: number;
}

export interface ToastType {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface CustomUser {
  uid: string;
  displayName: string;
  email?: string;
  photoURL: string;
  avatarClass?: string;
  bio?: string;
  clanTag?: string;
  hoursPlayed?: number;
  playstyle?: string;
  favoriteWeapon?: string;
  steamId?: string;
  steamName?: string;
  steamAvatar?: string;
  friends?: string[];
  friendRequestsSent?: string[];
  friendRequestsReceived?: string[];
  badges?: string[];
  customTheme?: string;
  gender?: 'male' | 'female';
  steamLink?: string;
  role?: 'admin' | 'user';
  isVip?: boolean;
  isChatVip?: boolean;
  vipUntil?: string;
  notifications?: {
    news: boolean;
    streams: boolean;
  };
}

