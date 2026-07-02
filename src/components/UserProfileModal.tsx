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
import { CUSTOM_AVATARS } from '../customAvatars';

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
          avatarClass: data.avatarClass || 'hazmat',
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
          customTheme: data.customTheme || 'slate'
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
          avatarClass: data.avatarClass || 'hazmat',
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
        class: 'bg-indigo-500/15 border-indigo-500/35 hover:bg-indigo-500 hover:text-white text-indigo-400'
      };
    }
  };

  const selectedTheme = PROFILE_THEMES.find(t => t.id === targetUser?.customTheme) || PROFILE_THEMES[0];
  const friendBtn = getFriendButtonState();
  const matchedAvatar = targetUser ? CUSTOM_AVATARS.find(a => a.id === targetUser.avatarClass) || CUSTOM_AVATARS[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-lg border-2 border-[#2a2f3b] rounded-none overflow-hidden shadow-2xl relative flex flex-col p-6 rust-metal-pattern ${selectedTheme.class}`}
      >
        {/* Corner Brackets */}
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer z-20"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono uppercase text-zinc-500">
            {lang === 'ru' ? 'Считывание параметров выжившего...' : 'Scanning biometric parameters...'}
          </div>
        ) : !targetUser ? (
          <div className="py-20 text-center">
            <span className="block text-sm text-red-400 font-mono font-bold uppercase">
              {lang === 'ru' ? 'ДАННЫЕ ПОВРЕЖДЕНЫ ИЛИ НЕ НАЙДЕНЫ' : 'USER BIO-SIGNAL LOST'}
            </span>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 border border-zinc-700 text-xs font-mono text-zinc-300 hover:bg-zinc-800"
            >
              {lang === 'ru' ? 'Назад' : 'Back'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Header Card */}
            <div className="flex flex-col sm:flex-row gap-4 items-center border-b border-[#2a2f3b]/50 pb-5">
              <div className="relative">
                <img 
                  src={targetUser.photoURL || matchedAvatar?.url} 
                  alt={targetUser.displayName} 
                  className="w-16 h-16 rounded-full border-2 border-zinc-600 object-cover bg-black shadow-lg"
                />
                {targetUser.clanTag && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600/95 border border-red-500/50 text-[8px] font-black text-white px-1 py-0.5 font-mono shadow rounded-sm uppercase tracking-wider">
                    [{targetUser.clanTag}]
                  </span>
                )}
              </div>

              <div className="text-center sm:text-left space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="text-lg font-black text-white uppercase tracking-wider leading-none truncate font-sans">
                    {targetUser.displayName}
                  </span>
                  
                  {targetUser.uid === 'serustqs' ? (
                    <span className="text-[9px] font-bold text-red-400 bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 rounded-none font-mono tracking-widest uppercase">
                      Owner
                    </span>
                  ) : targetUser.badges?.includes('founder') ? (
                    <span className="text-[9px] font-bold text-[#cd412b] bg-[#cd412b]/15 border border-[#cd412b]/30 px-1.5 py-0.5 rounded-none font-mono tracking-widest uppercase">
                      Admin
                    </span>
                  ) : targetUser.badges?.includes('sponsor') ? (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-none font-mono tracking-widest uppercase">
                      VIP
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-zinc-400 bg-zinc-500/10 border border-zinc-500/20 px-1.5 py-0.5 rounded-none font-mono tracking-widest uppercase">
                      Survivor
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-zinc-400 font-mono tracking-wide leading-relaxed">
                  {lang === 'ru' ? 'Класс:' : 'Suit:'} <span className="text-zinc-200 font-bold">{matchedAvatar?.name[lang]}</span>
                </div>
              </div>
            </div>

            {/* Friends Interaction Action */}
            {friendBtn && (
              <button
                onClick={handleFriendAction}
                disabled={actionLoading}
                className={`w-full py-2.5 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border ${friendBtn.class}`}
              >
                {friendBtn.icon}
                <span>{actionLoading ? '...' : friendBtn.label}</span>
              </button>
            )}

            {/* Dynamic Status/Bio Description Block */}
            <div className="bg-black/40 border border-[#2a2f3b]/40 p-3">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider mb-1.5">
                {lang === 'ru' ? 'О СЕБЕ / СТАТУС В ЭФИРЕ' : 'PERSONAL LOG & BIO'}
              </span>
              <p className="text-xs text-zinc-200 font-mono leading-relaxed italic break-words whitespace-pre-line">
                {targetUser.bio || (lang === 'ru' ? '«Данный выживший еще не заполнил свою радиочастотную визитку...»' : '"This survivor has not broadcasted their radio log profile yet..."')}
              </p>
            </div>

            {/* Survivor Stats Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/30 border border-[#2a2f3b]/30 p-2 text-center">
                <span className="text-[8px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ЧАСЫ В RUST' : 'RUST HOURS'}</span>
                <span className="text-sm font-black font-mono text-zinc-200 mt-1 block">
                  {targetUser.hoursPlayed?.toLocaleString() || 0}
                </span>
              </div>
              <div className="bg-black/30 border border-[#2a2f3b]/30 p-2 text-center">
                <span className="text-[8px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ОБОРУДОВАНИЕ' : 'FAV WEAPON'}</span>
                <span className="text-xs font-bold font-sans text-zinc-200 mt-1 block truncate">
                  {targetUser.favoriteWeapon || 'AK-47'}
                </span>
              </div>
              <div className="bg-black/30 border border-[#2a2f3b]/30 p-2 text-center">
                <span className="text-[8px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ТАКТИКА' : 'TACTICS'}</span>
                <span className="text-xs font-bold font-sans text-zinc-200 mt-1 block truncate">
                  {targetUser.playstyle || 'Solo'}
                </span>
              </div>
            </div>

            {/* Steam Link Integration Section */}
            <div className="bg-[#171a21]/90 border border-[#3b4b57]/40 p-3.5 rounded-sm flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded bg-[#101216] flex items-center justify-center border border-[#4c5c68]/30 shrink-0">
                  <Gamepad2 size={16} className="text-[#3a8bca]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block leading-none mb-0.5">
                    Steam Profile Integration
                  </span>
                  {targetUser.steamId ? (
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

              {targetUser.steamId && (
                <div className="shrink-0 flex items-center gap-1 bg-[#223846]/40 border border-[#3a8bca]/30 px-2 py-1">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                  <span className="text-[8px] font-mono font-black text-[#3a8bca] uppercase tracking-wider">Connected</span>
                </div>
              )}
            </div>

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
    </div>
  );
}
