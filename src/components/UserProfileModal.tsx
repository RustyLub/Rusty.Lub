import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Crown, 
  Clock, 
  Gamepad2, 
  Check, 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  Award, 
  Sparkles, 
  MessageSquare,
  Bookmark
} from 'lucide-react';
import { doc, db, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from '../firebase';
import { CustomUser } from '../types';
import { CUSTOM_AVATARS, getAvatarUrl } from '../customAvatars';

export interface BadgeInfo {
  id: string;
  icon: string;
  color: string;
  title: { ru: string; en: string };
  desc: { ru: string; en: string };
}

export const BADGES: BadgeInfo[] = [
  {
    id: 'first_beacon',
    icon: '🛰️',
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/25 text-blue-400',
    title: { ru: 'Первый Сигнал', en: 'First Beacon' },
    desc: { ru: 'Зарегистрировал свой профиль на Rusty.Lub', en: 'Registered profile on Rusty.Lub' }
  },
  {
    id: 'steam_linked',
    icon: '🎮',
    color: 'from-sky-500/10 to-blue-600/10 border-sky-500/35 text-sky-400',
    title: { ru: 'Стим Выживший', en: 'Steam Survivor' },
    desc: { ru: 'Успешно привязал свой игровой Steam аккаунт', en: 'Successfully linked Steam gaming account' }
  },
  {
    id: 'veteran',
    icon: '💀',
    color: 'from-amber-600/10 to-red-600/10 border-amber-500/30 text-amber-400',
    title: { ru: 'Ветеран Острова', en: 'Veteran of the Island' },
    desc: { ru: 'Установил более 1000 часов игры в Rust', en: 'Logged over 1,000 hours of gameplay in Rust' }
  },
  {
    id: 'radio_operator',
    icon: '📻',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/25 text-emerald-400',
    title: { ru: 'Радиооператор', en: 'Radio Operator' },
    desc: { ru: 'Вышел в голосовой эфир Outpost Radio', en: 'Broadcasted voice feed via Outpost Radio' }
  },
  {
    id: 'sponsor',
    icon: '💎',
    color: 'from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400',
    title: { ru: 'Спонсор Радио', en: 'Radio Sponsor' },
    desc: { ru: 'Открыл поддержку проекта для ускорения вайпа', en: 'Opened project support for wipe acceleration' }
  },
  {
    id: 'founder',
    icon: '👑',
    color: 'from-red-500/10 to-yellow-500/10 border-red-500/30 text-red-400',
    title: { ru: 'Хозяин Острова', en: 'Island Overlord' },
    desc: { ru: 'Обладает правами администратора в биосистеме', en: 'Holds administrator credentials in biometrics' }
  }
];

export const PROFILE_THEMES = [
  { id: 'slate', name: { ru: 'Угольный Сланец', en: 'Charcoal Slate' }, class: 'bg-gradient-to-br from-[#0c0d10] to-[#14171e]' },
  { id: 'radiation', name: { ru: 'Зона Радиации', en: 'Radiation Zone' }, class: 'bg-gradient-to-br from-[#1a1505] to-[#261e08] border-yellow-500/30' },
  { id: 'outpost', name: { ru: 'Аванпост', en: 'Outpost' }, class: 'bg-gradient-to-br from-[#051a10] to-[#082618] border-emerald-500/30' },
  { id: 'bandit', name: { ru: 'Лагерь Бандитов', en: 'Bandit Camp' }, class: 'bg-gradient-to-br from-[#1a0f05] to-[#261508] border-amber-500/30' },
  { id: 'wasteland', name: { ru: 'Красная Пустошь', en: 'Red Wasteland' }, class: 'bg-gradient-to-br from-[#1c0505] to-[#2a0808] border-red-500/30' },
  { id: 'arctic', name: { ru: 'Полярная Станция', en: 'Arctic Outpost' }, class: 'bg-gradient-to-br from-[#05181a] to-[#082326] border-cyan-500/30' }
];

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  currentUser: CustomUser | null;
  lang: 'ru' | 'en';
  onToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  targetUserId,
  currentUser,
  lang,
  onToast
}: UserProfileModalProps) {
  const [targetUser, setTargetUser] = useState<CustomUser | null>(null);
  const [currentUserFull, setCurrentUserFull] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isFullscreenAvatar, setIsFullscreenAvatar] = useState(false);
  const [twitchChannel, setTwitchChannel] = useState('serustqs');

  // Load live site Twitch settings to obtain correct channel URL for Owner Card
  useEffect(() => {
    if (!isOpen) return;
    const unsubTwitch = onSnapshot(doc(db, 'site_settings', 'twitch'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.channelName) {
          setTwitchChannel(data.channelName);
        }
      }
    });
    return () => unsubTwitch();
  }, [isOpen]);

  // Sync target user profile live
  useEffect(() => {
    if (!isOpen || !targetUserId) return;
    setLoading(true);

    const unsubTarget = onSnapshot(doc(db, 'chat_users', targetUserId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTargetUser({
          uid: docSnap.id,
          displayName: data.displayName || docSnap.id,
          photoURL: data.photoURL || '',
          avatarClass: data.avatarClass || 'whiteout',
          bio: data.bio || '',
          clanTag: data.clanTag || '',
          hoursPlayed: data.hoursPlayed || 0,
          playstyle: data.playstyle || 'Casual',
          favoriteWeapon: data.favoriteWeapon || 'AK-47',
          steamId: data.steamId || '',
          steamName: data.steamName || '',
          steamAvatar: data.steamAvatar || '',
          friends: data.friends || [],
          friendRequestsSent: data.friendRequestsSent || [],
          friendRequestsReceived: data.friendRequestsReceived || [],
          badges: data.badges || [],
          customTheme: data.customTheme || 'slate',
          steamLink: data.steamLink || ''
        });
      } else {
        setTargetUser(null);
      }
      setLoading(false);
    });

    return () => unsubTarget();
  }, [isOpen, targetUserId]);

  // Sync current logged-in user details live (for friend relation check)
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const unsubCurrent = onSnapshot(doc(db, 'chat_users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentUserFull({
          uid: docSnap.id,
          displayName: data.displayName || docSnap.id,
          photoURL: data.photoURL || '',
          avatarClass: data.avatarClass || 'whiteout',
          friends: data.friends || [],
          friendRequestsSent: data.friendRequestsSent || [],
          friendRequestsReceived: data.friendRequestsReceived || [],
          badges: data.badges || []
        });
      }
    });

    return () => unsubCurrent();
  }, [isOpen, currentUser]);

  if (!isOpen || !targetUserId) return null;

  const handleFriendAction = async () => {
    if (!currentUser || !targetUser || !currentUserFull) {
      onToast(lang === 'ru' ? 'Вы должны войти в аккаунт!' : 'You must be logged in!', 'warning');
      return;
    }

    setActionLoading(true);
    const selfId = currentUser.uid;
    const targetId = targetUser.uid;

    const isFriend = currentUserFull.friends?.includes(targetId);
    const hasSentReq = currentUserFull.friendRequestsSent?.includes(targetId);
    const hasReceivedReq = currentUserFull.friendRequestsReceived?.includes(targetId);

    try {
      if (isFriend) {
        // Remove Friend
        await updateDoc(doc(db, 'chat_users', selfId), {
          friends: arrayRemove(targetId)
        });
        await updateDoc(doc(db, 'chat_users', targetId), {
          friends: arrayRemove(selfId)
        });
        onToast(
          lang === 'ru' ? `Пользователь ${targetUser.displayName} удален из друзей.` : `Removed ${targetUser.displayName} from friends.`,
          'success'
        );
      } else if (hasSentReq) {
        // Cancel Sent Request
        await updateDoc(doc(db, 'chat_users', selfId), {
          friendRequestsSent: arrayRemove(targetId)
        });
        await updateDoc(doc(db, 'chat_users', targetId), {
          friendRequestsReceived: arrayRemove(selfId)
        });
        onToast(
          lang === 'ru' ? 'Запрос в друзья отменен.' : 'Friend request cancelled.',
          'success'
        );
      } else if (hasReceivedReq) {
        // Accept Request
        await updateDoc(doc(db, 'chat_users', selfId), {
          friendRequestsReceived: arrayRemove(targetId),
          friends: arrayUnion(targetId)
        });
        await updateDoc(doc(db, 'chat_users', targetId), {
          friendRequestsSent: arrayRemove(selfId),
          friends: arrayUnion(selfId)
        });
        // Check achievements for accept
        onToast(
          lang === 'ru' ? `Вы и ${targetUser.displayName} теперь друзья!` : `You and ${targetUser.displayName} are now friends!`,
          'success'
        );
      } else {
        // Send Friend Request
        await updateDoc(doc(db, 'chat_users', selfId), {
          friendRequestsSent: arrayUnion(targetId)
        });
        await updateDoc(doc(db, 'chat_users', targetId), {
          friendRequestsReceived: arrayUnion(selfId)
        });
        onToast(
          lang === 'ru' ? `Запрос в друзья отправлен ${targetUser.displayName}.` : `Friend request sent to ${targetUser.displayName}.`,
          'success'
        );
      }
    } catch (err) {
      console.error("Friend action error:", err);
      onToast(lang === 'ru' ? 'Ошибка изменения списка друзей.' : 'Failed to update friends.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getFriendButtonState = () => {
    if (!currentUser || !targetUser || !currentUserFull) return null;
    if (currentUser.uid === targetUser.uid) return null;

    const isFriend = currentUserFull.friends?.includes(targetUser.uid);
    const hasSentReq = currentUserFull.friendRequestsSent?.includes(targetUser.uid);
    const hasReceivedReq = currentUserFull.friendRequestsReceived?.includes(targetUser.uid);

    if (isFriend) {
      return {
        label: lang === 'ru' ? 'Удалить из друзей' : 'Remove Friend',
        icon: <UserMinus size={13} />,
        class: 'bg-red-500/15 border-red-500/35 hover:bg-red-500 hover:text-white text-red-400'
      };
    } else if (hasSentReq) {
      return {
        label: lang === 'ru' ? 'Запрос отправлен (Отмена)' : 'Request Sent (Cancel)',
        icon: <Clock size={13} className="animate-pulse" />,
        class: 'bg-amber-500/15 border-amber-500/35 hover:bg-amber-600 hover:text-black text-amber-400'
      };
    } else if (hasReceivedReq) {
      return {
        label: lang === 'ru' ? 'Принять запрос в друзья' : 'Accept Friend Request',
        icon: <UserCheck size={13} />,
        class: 'bg-emerald-500/15 border-emerald-500/40 hover:bg-emerald-500 hover:text-black text-emerald-400'
      };
    } else {
      return {
        label: lang === 'ru' ? 'Добавить в друзья' : 'Add Friend',
        icon: <UserPlus size={13} />,
        class: 'bg-[#cd412b]/15 border-[#cd412b]/45 hover:bg-[#cd412b] hover:text-white text-red-400'
      };
    }
  };

  const selectedTheme = PROFILE_THEMES.find(t => t.id === targetUser?.customTheme) || PROFILE_THEMES[0];
  const friendBtn = getFriendButtonState();
  const matchedAvatar = targetUser ? CUSTOM_AVATARS.find(a => a.id === targetUser.avatarClass) || CUSTOM_AVATARS[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-2xl border-2 border-[#2a2f3b] rounded-none overflow-hidden shadow-2xl relative flex flex-col p-0 rust-metal-pattern keep-dark ${selectedTheme.class}`}
      >
        {/* Sleek Tactical Header Bar */}
        <div className="bg-[#0b0c0f] border-b border-[#2a2f3b] px-4 py-2 flex items-center justify-between text-[9px] font-mono tracking-widest text-zinc-400 select-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="font-bold text-red-500 uppercase">Rusty.Lub // BIOMETRIC DOSSIER DECRYPTED</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>SYS_LOC: CO-ORDS SEC_4</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-500 font-bold uppercase">STATUS: SECURE LINK</span>
          </div>
        </div>

        {/* Corner Brackets */}
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-10 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer z-20 bg-black/40 p-1.5 border border-[#2a2f3b]/60 hover:border-zinc-500"
        >
          <X size={16} />
        </button>

        {loading ? (
          <div className="py-24 text-center text-xs font-mono uppercase text-[#cd412b] animate-pulse">
            {lang === 'ru' ? 'Считывание параметров биометрии выжившего...' : 'ESTABLISHING BIOMETRIC TELEMETRY LINK...'}
          </div>
        ) : !targetUser ? (
          <div className="py-24 text-center">
            <span className="block text-sm text-red-400 font-mono font-bold uppercase tracking-widest">
              {lang === 'ru' ? 'ДАННЫЕ ПОВРЕЖДЕНЫ ИЛИ НЕ НАЙДЕНЫ' : 'USER BIO-SIGNAL LOST'}
            </span>
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 border border-[#cd412b]/40 text-xs font-mono text-zinc-300 hover:bg-[#cd412b]/10"
            >
              {lang === 'ru' ? 'Назад' : 'Back'}
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Split layout: Avatar & Gauges on Left, Bio & Identity on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch border-b border-[#2a2f3b]/50 pb-5">
              
              {/* Left Column: Holographic Avatar display & Survival Telemetry Gauges (Span 5) */}
              <div className="md:col-span-5 flex flex-col items-center space-y-4">
                <div 
                  className="relative group cursor-zoom-in overflow-hidden border border-[#2a2f3b] bg-black p-1.5 shadow-xl hover:border-[#cd412b] transition-all duration-300 w-full max-w-[210px] sm:max-w-[230px]"
                  onClick={() => setIsFullscreenAvatar(true)}
                >
                  <div className="relative overflow-hidden aspect-square bg-zinc-950">
                    <img 
                      src={getAvatarUrl(targetUser.photoURL, targetUser.avatarClass)} 
                      alt={targetUser.displayName} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Retro UI Overlay Scanlines */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.02] to-transparent bg-[size:100%_4px]" />
                    
                    {/* Visual target crosshairs inside frame */}
                    <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#cd412b]/70" />
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#cd412b]/70" />
                    <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#cd412b]/70" />
                    <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#cd412b]/70" />

                    {/* Telemetry Status badge */}
                    <div className="absolute bottom-2 left-2 bg-black/85 border border-[#cd412b]/35 px-2 py-0.5 text-[7px] font-mono text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span>{lang === 'ru' ? 'СВЯЗЬ АКТИВНА' : 'LIVE BEACON'}</span>
                    </div>
                  </div>
                  
                  {targetUser.clanTag && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#cd412b] border border-red-500 text-[10px] font-black text-white px-2 py-0.5 font-mono shadow-md uppercase tracking-wider">
                      [{targetUser.clanTag}]
                    </span>
                  )}
                </div>

                {/* Micro Button for Zoom */}
                <button 
                  onClick={() => setIsFullscreenAvatar(true)}
                  className="text-[8px] font-mono text-zinc-500 hover:text-[#cd412b] transition-colors cursor-pointer uppercase tracking-widest flex items-center gap-1.5"
                >
                  <span>🔍 {lang === 'ru' ? 'УВЕЛИЧИТЬ СЪЕМКУ' : 'HOLOGRAPHIC ENLARGEMENT'}</span>
                </button>

                {/* Tactical Status Bars (Simulated Survival HUD) */}
                <div className="w-full bg-black/60 border border-[#2a2f3b]/70 p-3 space-y-2 select-none text-left">
                  <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest block border-b border-zinc-900 pb-1">
                    {lang === 'ru' ? 'ПОКАЗАТЕЛИ ЖИЗНЕДЕЯТЕЛЬНОСТИ' : 'VITAL TELEMETRY STATUS'}
                  </span>
                  
                  {/* Health gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[7.5px] font-mono text-zinc-400">
                      <span>HP (SURVIVAL STATUS)</span>
                      <span className="text-emerald-400 font-bold">100 / 100</span>
                    </div>
                    <div className="h-1 bg-zinc-900 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-full" />
                    </div>
                  </div>

                  {/* Comfort/Hydration gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[7.5px] font-mono text-zinc-400">
                      <span>WATER LEVEL</span>
                      <span className="text-blue-400 font-bold">250ml</span>
                    </div>
                    <div className="h-1 bg-zinc-900 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-[85%]" />
                    </div>
                  </div>

                  {/* Rads gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[7.5px] font-mono text-zinc-400">
                      <span>RADIATION BARRIER</span>
                      <span className="text-yellow-500 font-bold">0.0 mSv/h (SECURE)</span>
                    </div>
                    <div className="h-1 bg-zinc-900 overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[5%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio details, Identity & Interventions (Span 7) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[8px] font-mono text-[#cd412b] uppercase tracking-widest block mb-1">
                      {lang === 'ru' ? 'КОДОВОЕ ИМЯ ВЫЖИВШЕГО' : 'SURVIVOR ALIAS / CALLSIGN'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide leading-none font-sans drop-shadow-md">
                        {targetUser.displayName}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badges Row */}
                  <div className="flex flex-wrap gap-1.5">
                    {targetUser.uid === 'serustqs' ? (
                      <span className="text-[8px] font-bold text-red-400 bg-red-500/15 border border-red-500/40 px-2 py-0.5 font-mono tracking-widest uppercase">
                        System Owner
                      </span>
                    ) : targetUser.badges?.includes('founder') ? (
                      <span className="text-[8px] font-bold text-[#cd412b] bg-[#cd412b]/15 border border-[#cd412b]/40 px-2 py-0.5 font-mono tracking-widest uppercase">
                        Admin Officer
                      </span>
                    ) : targetUser.badges?.includes('sponsor') ? (
                      <span className="text-[8px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 font-mono tracking-widest uppercase">
                        VIP Sponsor
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold text-zinc-400 bg-zinc-500/10 border border-zinc-500/25 px-2 py-0.5 font-mono tracking-widest uppercase">
                        Survivor Elite
                      </span>
                    )}
                  </div>

                  {/* Character Suit Spec Description */}
                  <div className="bg-[#0b0c0f]/80 border border-[#2a2f3b] p-3 text-left">
                    <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                      {lang === 'ru' ? 'СПЕЦИФИКАЦИЯ ЭКИПИРОВАННОГО КОСТЮМА' : 'EQUIPPED SKIN SPECIFICATION'}
                    </span>
                    <span className="text-xs font-black text-zinc-200 font-mono flex items-center gap-2 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#cd412b] animate-pulse" />
                      {matchedAvatar?.name[lang]}
                    </span>
                    {matchedAvatar?.role && (
                      <span className="text-[9px] text-zinc-400 font-mono block mt-1 italic pl-4">
                        {matchedAvatar.role[lang]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Personal Telex Log (Bio text area) */}
                <div className="bg-black/50 border border-[#2a2f3b]/50 p-3.5 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 text-[7px] font-mono text-zinc-600 uppercase">SYS_LOG_V2</div>
                  <span className="text-[8px] font-mono text-[#cd412b] block uppercase tracking-wider mb-1.5 border-b border-zinc-900 pb-1">
                    {lang === 'ru' ? 'РАДИОФОННЫЙ ЖУРНАЛ' : 'DECRYPTED TRANSMISSION LOG'}
                  </span>
                  <p className="text-[11px] text-zinc-300 font-mono leading-relaxed italic break-words whitespace-pre-line max-h-24 overflow-y-auto">
                    {targetUser.bio || (lang === 'ru' ? '«Выживший не предоставил радиовещательный лог...»' : '"No logs recorded on this survivor frequency..."')}
                  </p>
                </div>

                {/* Friends direct action */}
                {friendBtn && (
                  <button
                    onClick={handleFriendAction}
                    disabled={actionLoading}
                    className={`w-full py-2.5 font-mono font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 border-2 ${friendBtn.class}`}
                  >
                    {friendBtn.icon}
                    <span>{actionLoading ? '...' : friendBtn.label}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Survivor Stats Cards - Clean grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/40 border border-[#2a2f3b]/40 p-3 text-center">
                <span className="text-[7.5px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ЧАСЫ В ИГРЕ' : 'RUST STATISTICS'}</span>
                <span className="text-sm font-black font-mono text-zinc-100 mt-1 block">
                  {targetUser.hoursPlayed?.toLocaleString() || 0} H
                </span>
              </div>
              <div className="bg-black/40 border border-[#2a2f3b]/40 p-3 text-center">
                <span className="text-[7.5px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ОРУЖИЕ ВЫБОРА' : 'EQUIPPED WEAPON'}</span>
                <span className="text-xs font-bold font-mono text-[#cd412b] mt-1 block truncate">
                  {targetUser.favoriteWeapon || 'AK-47'}
                </span>
              </div>
              <div className="bg-black/40 border border-[#2a2f3b]/40 p-3 text-center">
                <span className="text-[7.5px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ТАКТИКА БОЯ' : 'PLAYSTYLE TACTICS'}</span>
                <span className="text-xs font-bold font-mono text-zinc-200 mt-1 block truncate">
                  {targetUser.playstyle || 'Solo'}
                </span>
              </div>
            </div>

            {/* Steam Link Integration Section */}
            <div className="bg-[#171a21]/95 border border-[#3b4b57]/40 p-3.5 rounded-none flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded bg-[#101216] flex items-center justify-center border border-[#4c5c68]/30 shrink-0">
                    <Gamepad2 size={16} className="text-[#3a8bca]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block leading-none mb-0.5">
                      Steam Profile Integration
                    </span>
                    {targetUser.steamLink ? (
                      <span className="text-xs font-bold text-zinc-200 font-sans truncate block">
                        {targetUser.steamLink}
                      </span>
                    ) : targetUser.steamId ? (
                      <span className="text-xs font-bold text-zinc-200 font-sans truncate block">
                        {targetUser.steamName}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#3a8bca] font-mono block">
                        {lang === 'ru' ? 'НЕ СВЯЗАН' : 'NOT LINKED'}
                      </span>
                    )}
                  </div>
                </div>

                {(targetUser.steamId || targetUser.steamLink) && (
                  <div className="shrink-0 flex items-center gap-1 bg-[#223846]/40 border border-[#3a8bca]/30 px-2 py-1">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                    <span className="text-[8px] font-mono font-black text-[#3a8bca] uppercase tracking-wider">Connected</span>
                  </div>
                )}
              </div>

              {targetUser.steamLink && (
                <a
                  href={targetUser.steamLink.startsWith('http') ? targetUser.steamLink : `https://${targetUser.steamLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#1b2838] hover:bg-[#2a475e] border border-[#66c0f4]/40 hover:border-[#66c0f4] text-white font-mono font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
                >
                  <Gamepad2 size={13} className="text-[#66c0f4]" />
                  <span>{lang === 'ru' ? 'ПЕРЕЙТИ В ПРОФИЛЬ STEAM' : 'GO TO STEAM PROFILE'}</span>
                </a>
              )}
            </div>

            {/* Twitch Link for the Owner of the site (serustqs) */}
            {targetUser.uid === 'serustqs' && (
              <a
                href={`https://twitch.tv/${twitchChannel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#6441a5] hover:bg-[#7d5bbe] border border-[#a991d4]/40 hover:border-[#a991d4] text-white font-mono font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>{lang === 'ru' ? 'ПЕРЕЙТИ НА ТВИТЧ' : 'GO TO TWITCH'}</span>
              </a>
            )}

            {/* Exclusive Owner Administration Panel */}
            {currentUser && currentUser.uid === 'serustqs' && (
              <div className="bg-red-950/20 border border-red-900/50 p-3.5 space-y-2 relative" id="owner-admin-panel">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                  {lang === 'ru' ? '🛠️ Панель Владельца: Выдача тега [EAC]' : '🛠️ Owner Control: [EAC] Tag'}
                </span>
                <p className="text-[9px] text-zinc-400 font-mono leading-normal">
                  {lang === 'ru' 
                    ? 'Вы можете эксклюзивно выдать или забрать этот системный тег у любого выжившего.'
                    : 'You can exclusively grant or revoke this system tag for any survivor.'}
                </p>
                <button
                  onClick={async () => {
                    try {
                      setActionLoading(true);
                      const isCurrentlyEac = targetUser.clanTag === 'EAC';
                      await updateDoc(doc(db, 'chat_users', targetUser.uid), {
                        clanTag: isCurrentlyEac ? '' : 'EAC'
                      });
                      onToast(
                        lang === 'ru' 
                          ? (isCurrentlyEac ? 'Клан-тег [EAC] успешно аннулирован!' : 'Клан-тег [EAC] успешно присвоен!')
                          : (isCurrentlyEac ? 'Clan tag [EAC] successfully revoked!' : 'Clan tag [EAC] successfully granted!'),
                        'success'
                      );
                    } catch (err) {
                      console.error("EAC Tag toggling error:", err);
                      onToast('Failed to modify user clan tag', 'error');
                    } finally {
                      setActionLoading(false);
                    }
                  }}
                  disabled={actionLoading}
                  className={`w-full py-2 border font-mono font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    targetUser.clanTag === 'EAC'
                      ? 'bg-red-600/25 border-red-500/40 hover:bg-red-600 text-red-400 hover:text-white'
                      : 'bg-zinc-800/80 border-zinc-700 hover:bg-red-600/30 hover:border-red-500 hover:text-red-400 text-zinc-300'
                  }`}
                >
                  <span>
                    {targetUser.clanTag === 'EAC' 
                      ? (lang === 'ru' ? 'Забрать клан-тег [EAC]' : 'Revoke Clan Tag [EAC]') 
                      : (lang === 'ru' ? 'Присвоить клан-тег [EAC]' : 'Grant Clan Tag [EAC]')}
                  </span>
                </button>
              </div>
            )}

            {/* Achievements & Badges Grid */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 border-b border-[#2a2f3b]/30 pb-1">
                <Award size={13} className="text-amber-500" />
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  {lang === 'ru' ? 'ДОСТИЖЕНИЯ И НАШИВКИ' : 'UNLOCKED ACHIEVEMENTS'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {BADGES.map((badge) => {
                  const isUnlocked = targetUser.badges?.includes(badge.id) || 
                    (badge.id === 'first_beacon') || 
                    (badge.id === 'founder' && targetUser.uid === 'serustqs') ||
                    (badge.id === 'veteran' && (targetUser.hoursPlayed || 0) >= 1000) ||
                    (badge.id === 'steam_linked' && !!targetUser.steamId);

                  return (
                    <div 
                      key={badge.id}
                      className={`p-2 border flex items-center gap-2 text-left transition-all relative ${
                        isUnlocked 
                          ? `bg-gradient-to-r ${badge.color}` 
                          : 'border-zinc-800/20 bg-zinc-900/10 opacity-30 select-none'
                      }`}
                      title={`${badge.title[lang]}: ${badge.desc[lang]}`}
                    >
                      <span className="text-xl shrink-0">{badge.icon}</span>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold text-zinc-100 uppercase leading-tight truncate">
                          {badge.title[lang]}
                        </span>
                        <span className="block text-[7px] text-zinc-400 font-mono truncate">
                          {isUnlocked ? badge.desc[lang] : (lang === 'ru' ? 'Заблокировано' : 'Locked')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-1.5 pt-4 border-t border-[#2a2f3b]">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">
                {lang === 'ru' ? 'НАСТРОЙКИ УВЕДОМЛЕНИЙ' : 'NOTIFICATION SETTINGS'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={async () => {
                    if (!targetUser) return;
                    setActionLoading(true);
                    await updateDoc(doc(db, 'chat_users', targetUser.uid), {
                      'notifications.news': !targetUser.notifications?.news
                    });
                    setActionLoading(false);
                  }}
                  disabled={actionLoading}
                  className={`flex items-center justify-between p-2 text-[10px] font-mono border ${
                    targetUser.notifications?.news ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-black/40 border-zinc-800'
                  }`}
                >
                  <span>{lang === 'ru' ? 'Новости' : 'News'}</span>
                  {targetUser.notifications?.news ? <Check size={12} className="text-emerald-500" /> : <X size={12} className="text-zinc-500" />}
                </button>
                <button
                  onClick={async () => {
                    if (!targetUser) return;
                    setActionLoading(true);
                    await updateDoc(doc(db, 'chat_users', targetUser.uid), {
                      'notifications.streams': !targetUser.notifications?.streams
                    });
                    setActionLoading(false);
                  }}
                  disabled={actionLoading}
                  className={`flex items-center justify-between p-2 text-[10px] font-mono border ${
                    targetUser.notifications?.streams ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-black/40 border-zinc-800'
                  }`}
                >
                  <span>{lang === 'ru' ? 'Стримы' : 'Streams'}</span>
                  {targetUser.notifications?.streams ? <Check size={12} className="text-emerald-500" /> : <X size={12} className="text-zinc-500" />}
                </button>
              </div>
            </div>

            {/* Friends List inside Inspector */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">
                {lang === 'ru' ? 'ДРУЗЬЯ ВЫЖИВШЕГО' : 'SURVIVOR CONTACTS'}
              </span>
              <div className="flex flex-wrap gap-1 bg-black/20 p-2 border border-zinc-800/40">
                {targetUser.friends && targetUser.friends.length > 0 ? (
                  targetUser.friends.map((fUid) => (
                    <span key={fUid} className="text-[9px] font-mono bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 px-2 py-0.5 rounded-sm border border-zinc-700/35 uppercase">
                      {fUid}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600">
                    {lang === 'ru' ? 'Нет контактов' : 'No friends linked'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Fullscreen Avatar Lightbox */}
      <AnimatePresence>
        {isFullscreenAvatar && targetUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreenAvatar(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-full max-h-[90vh] border border-zinc-700 bg-zinc-950 p-2 shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getAvatarUrl(targetUser.photoURL, targetUser.avatarClass)}
                alt={targetUser.displayName}
                className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-sm"
              />
              <div className="mt-3.5 text-center text-xs font-mono text-zinc-400 uppercase tracking-widest">
                {targetUser.displayName} • {matchedAvatar?.name[lang]}
              </div>
              
              <button
                onClick={() => setIsFullscreenAvatar(false)}
                className="absolute -top-10 right-0 text-white font-mono text-xs uppercase tracking-widest flex items-center gap-1 hover:text-[#cd412b] transition-colors cursor-pointer"
              >
                <X size={16} /> {lang === 'ru' ? 'Закрыть' : 'Close'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
