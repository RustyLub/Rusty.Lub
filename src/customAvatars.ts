import avatarClown from './assets/images/avatar_clown_1783101932577.jpg';
import avatarSkullText from './assets/images/avatar_skull_text_1783101944055.jpg';
import avatarRocket from './assets/images/avatar_rocket_launcher_1783101954928.jpg';
import avatarSanta from './assets/images/avatar_santa_girl_1783101967506.jpg';
import avatarPutin from './assets/images/avatar_putin_rust_1783101978018.jpg';
import avatarWhiteMask from './assets/images/avatar_white_facemask_1783101991181.jpg';
import avatarWhiteout from './assets/images/avatar_whiteout_1783101921371.jpg';
import avatarCat from './assets/images/avatar_cat_mask_1783102005831.jpg';
import avatarRustLogo from './assets/images/avatar_rust_logo_1783102022569.jpg';
import avatarWolfSunset from './assets/images/avatar_wolf_sunset_1783102034140.jpg';

export const CUSTOM_AVATARS = [
  {
    id: 'whiteout',
    name: { ru: 'Вайтаут', en: 'Whiteout' },
    role: { ru: 'Снежный воин', en: 'Snow Warrior' },
    url: avatarWhiteout,
  },
  {
    id: 'clown',
    name: { ru: 'Клоун', en: 'Clown' },
    role: { ru: 'Опасный мародер', en: 'Dangerous Looter' },
    url: avatarClown,
  },
  {
    id: 'skull_text',
    name: { ru: 'Типографика', en: 'Typography Skull' },
    role: { ru: 'Кибер арт', en: 'Cyber Art' },
    url: avatarSkullText,
  },
  {
    id: 'rocket_launcher',
    name: { ru: 'Ракетчик', en: 'Rocketeer' },
    role: { ru: 'Взломщик баз', en: 'Base Breaker' },
    url: avatarRocket,
  },
  {
    id: 'santa_girl',
    name: { ru: 'Новогодняя', en: 'Santa Girl' },
    role: { ru: 'Дух Рождества', en: 'Christmas Spirit' },
    url: avatarSanta,
  },
  {
    id: 'putin_rust',
    name: { ru: 'Начальник', en: 'The Boss' },
    role: { ru: 'Гроза пляжа', en: 'Terror of the Beach' },
    url: avatarPutin,
  },
  {
    id: 'white_mask',
    name: { ru: 'Призрак', en: 'Ghost' },
    role: { ru: 'Холодный взор', en: 'Cold Stare' },
    url: avatarWhiteMask,
  },
  {
    id: 'cat_mask',
    name: { ru: 'Кот в маске', en: 'Masked Cat' },
    role: { ru: 'Пушистый рейдер', en: 'Fluffy Raider' },
    url: avatarCat,
  },
  {
    id: 'rust_logo_avatar',
    name: { ru: 'Логотип Rust', en: 'Rust Logo' },
    role: { ru: 'Официальный фанат', en: 'Official Fan' },
    url: avatarRustLogo,
  },
  {
    id: 'wolf_sunset',
    name: { ru: 'Одинокий волк', en: 'Lone Wolf' },
    role: { ru: 'Созерцатель заката', en: 'Sunset Watcher' },
    url: avatarWolfSunset,
  },
];

export function getAvatarUrl(photoURL?: string | null, avatarClass?: string | null): string {
  // If the avatarClass is a known custom avatar preset, ALWAYS return its local runtime URL.
  // This avoids storing stale, absolute, or outdated environment-specific asset paths in Firestore!
  if (avatarClass) {
    const matched = CUSTOM_AVATARS.find(a => a.id === avatarClass);
    if (matched) return matched.url;
  }
  
  // If the user has a custom external URL (e.g., from Discord, Steam, or uploaded to a public host)
  if (photoURL && (photoURL.startsWith('http://') || photoURL.startsWith('https://')) && !photoURL.includes('avatar_') && !photoURL.includes('assets/')) {
    return photoURL;
  }
  
  // Fallback to default
  const defaultAv = CUSTOM_AVATARS.find(a => a.id === 'whiteout') || CUSTOM_AVATARS[0];
  return defaultAv.url;
}



