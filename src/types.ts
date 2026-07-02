export interface ErrorItem {
  category: 'critical' | 'network' | 'eac' | 'graphics';
  title: string;
  desc?: string;
  sols: string[];
}

export interface BindItem {
  category: 'PVP' | 'МЕДИЦИНА' | 'ФАРМ' | 'СТРОЙКА' | 'УПРАВЛЕНИЕ' | 'QOL';
  cmd: string;
  desc: string;
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
}

