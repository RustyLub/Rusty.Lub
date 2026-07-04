import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Crown, 
  Ban, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Settings, 
  Layout, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Megaphone,
  Compass,
  Users,
  Gamepad2,
  Award,
  Plus,
  UserCheck,
  UserMinus,
  Link,
  Save,
  UserPlus,
  Upload
} from 'lucide-react';
import { 
  doc, 
  db, 
  setDoc, 
  onSnapshot, 
  collection, 
  serverTimestamp,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { CUSTOM_AVATARS, getAvatarUrl } from '../customAvatars';
import { CustomUser } from '../types';
import UserProfileModal, { BADGES, PROFILE_THEMES } from './UserProfileModal';

interface CabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  user: CustomUser | null;
  onUserLogout: () => void;
  onAvatarChange: (newAvatarId: string, newPhotoURL: string) => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

interface RegisteredUser {
  username: string;
  displayName: string;
  photoURL: string;
  avatarClass: string;
  role: string;
  isBlocked: boolean;
  isVip?: boolean;
}

interface SiteAnnouncement {
  text: string;
  active: boolean;
  type: 'info' | 'hazard' | 'important';
  updatedAt: any;
}

export default function CabinetModal({ 
  isOpen, 
  onClose, 
  lang, 
  user, 
  onUserLogout, 
  onAvatarChange, 
  onToast 
}: CabinetModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'friends' | 'admin_users' | 'admin_site'>('profile');
  
  // Customization local states
  const [bio, setBio] = useState('');
  const [clanTag, setClanTag] = useState('');
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);
  const [playstyle, setPlaystyle] = useState('Casual');
  const [favoriteWeapon, setFavoriteWeapon] = useState('AK-47');
  const [customTheme, setCustomTheme] = useState('slate');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [steamLink, setSteamLink] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [jungleFeverSpoiler, setJungleFeverSpoiler] = useState(false);

  // Friend search and add direct states
  const [friendSearchId, setFriendSearchId] = useState('');

  // Target inspector modal state
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);

  // Registered users for admin view and quick friends listing
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  const [fullProfile, setFullProfile] = useState<CustomUser | null>(null);

  const isAdmin = user && (user.uid === 'serustqs' || user.email === 'misterzet556@gmail.com' || (fullProfile && fullProfile.badges?.includes('founder')));

  // Subscribe to logged-in user's own profile doc live
  useEffect(() => {
    if (!isOpen || !user) return;

    const unsubscribe = onSnapshot(doc(db, 'chat_users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const profile: CustomUser = {
          uid: docSnap.id,
          displayName: data.displayName || docSnap.id,
          photoURL: data.photoURL || '',
          avatarClass: data.avatarClass || 'whiteout',
          bio: data.bio || '',
          clanTag: data.clanTag || '',
          hoursPlayed: Number(data.hoursPlayed) || 0,
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
        };
        setFullProfile(profile);

        // Pre-fill fields once
        setBio(profile.bio || '');
        setClanTag(profile.clanTag || '');
        setHoursPlayed(profile.hoursPlayed || 0);
        setPlaystyle(profile.playstyle || 'Casual');
        setFavoriteWeapon(profile.favoriteWeapon || 'AK-47');
        setCustomTheme(profile.customTheme || 'slate');
        setCustomAvatarUrl(profile.photoURL || '');
        setSteamLink(profile.steamLink || '');
      }
    });

    return () => unsubscribe();
  }, [isOpen, user]);

  // Subscribe to all registered users for quick friends listing
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = onSnapshot(collection(db, 'chat_users'), (snapshot) => {
      const list: RegisteredUser[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          username: docSnap.id,
          displayName: data.displayName || docSnap.id,
          photoURL: data.photoURL || '',
          avatarClass: data.avatarClass || 'whiteout',
          role: data.role || 'user',
          isBlocked: !!data.isBlocked,
          isVip: !!data.isVip
        });
      });
      setRegisteredUsers(list);
    }, (err) => {
      console.error("Error syncing users:", err);
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Subscribe to jungle fever spoiler setting
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = onSnapshot(doc(db, 'site_settings', 'jungle_fever_spoiler'), (docSnap) => {
      if (docSnap.exists()) {
        setJungleFeverSpoiler(!!docSnap.data().jungleFeverSpoiler);
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen || !user) return null;

  // Save Extended Profile custom state
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    // Strict ban on EAC or [EAC] clan tag for regular users
    const isEacTag = clanTag.toLowerCase().includes('eac');
    if (isEacTag && user.uid !== 'serustqs' && user.email !== 'misterzet556@gmail.com') {
      onToast(
        lang === 'ru' 
          ? 'Использование клан-тега EAC разрешено только владельцу сайта!' 
          : 'Using the EAC clan tag is permitted only for the site owner!',
        'error'
      );
      setIsSavingProfile(false);
      return;
    }

    try {
      const userRef = doc(db, 'chat_users', user.uid);
      
      // Calculate dynamic badges
      const badges = fullProfile?.badges || [];
      const updatedBadges = [...badges];
      
      // Add first_beacon if missing
      if (!updatedBadges.includes('first_beacon')) {
        updatedBadges.push('first_beacon');
      }
      
      // Add veteran if hours >= 1000
      if (hoursPlayed >= 1000 && !updatedBadges.includes('veteran')) {
        updatedBadges.push('veteran');
      } else if (hoursPlayed < 1000 && updatedBadges.includes('veteran')) {
        const idx = updatedBadges.indexOf('veteran');
        if (idx > -1) updatedBadges.splice(idx, 1);
      }

      const updatePayload: any = {
        bio,
        clanTag: clanTag.slice(0, 5),
        hoursPlayed: Number(hoursPlayed) || 0,
        playstyle,
        favoriteWeapon,
        customTheme,
        steamLink: steamLink || '',
        badges: updatedBadges
      };

      if (customAvatarUrl && customAvatarUrl !== user.photoURL) {
        updatePayload.photoURL = customAvatarUrl;
        // Trigger parent state synchronization
        onAvatarChange(fullProfile?.avatarClass || 'whiteout', customAvatarUrl);
      }

      await updateDoc(userRef, updatePayload);

      onToast(
        lang === 'ru' ? 'Радиопрофиль успешно сохранен в базе выживших!' : 'Radio profile successfully written to the database!',
        'success'
      );
    } catch (err) {
      console.error(err);
      onToast(lang === 'ru' ? 'Ошибка сохранения радиопрофиля.' : 'Failed to save radio profile settings.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Change active avatar handler
  const handleSelectAvatar = async (avatarId: string) => {
    const matchedAvatar = CUSTOM_AVATARS.find(a => a.id === avatarId);
    if (!matchedAvatar) return;

    try {
      // 1. Update Firestore chat_users document
      const userRef = doc(db, 'chat_users', user.uid);
      await setDoc(userRef, {
        avatarClass: avatarId,
        photoURL: matchedAvatar.url
      }, { merge: true });

      setCustomAvatarUrl(matchedAvatar.url);

      // 2. Trigger parent callback to update App.tsx local state & localstorage
      onAvatarChange(avatarId, matchedAvatar.url);

      onToast(
        lang === 'ru' ? 'Внешний вид выжившего успешно обновлен!' : 'Survivor appearance updated successfully!',
        'success'
      );
    } catch (err) {
      console.error(err);
      onToast(lang === 'ru' ? 'Ошибка смены аватара.' : 'Failed to change avatar.', 'error');
    }
  };

  // Friends Action Listeners
  const handleAddFriendDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendSearchId.trim() || !fullProfile) return;
    if (friendSearchId.trim() === user.uid) {
      onToast(lang === 'ru' ? 'Вы не можете отправить запрос самому себе!' : 'You cannot add yourself!', 'warning');
      return;
    }

    try {
      const targetSnap = await getDoc(doc(db, 'chat_users', friendSearchId.trim()));
      if (!targetSnap.exists()) {
        onToast(lang === 'ru' ? 'Выживший с таким ID не зарегистрирован!' : 'No survivor registered with this ID!', 'error');
        return;
      }

      const targetData = targetSnap.data();
      if (fullProfile.friends?.includes(friendSearchId.trim())) {
        onToast(lang === 'ru' ? 'Вы уже друзья!' : 'You are already friends!', 'warning');
        return;
      }

      // Send Request
      await updateDoc(doc(db, 'chat_users', user.uid), {
        friendRequestsSent: arrayUnion(friendSearchId.trim())
      });
      await updateDoc(doc(db, 'chat_users', friendSearchId.trim()), {
        friendRequestsReceived: arrayUnion(user.uid)
      });

      setFriendSearchId('');
      onToast(
        lang === 'ru' 
          ? `Запрос отправлен выжившему ${targetData.displayName || friendSearchId}` 
          : `Request transmitted to survivor ${targetData.displayName || friendSearchId}`,
        'success'
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptFriend = async (targetId: string) => {
    if (!fullProfile) return;
    try {
      await updateDoc(doc(db, 'chat_users', user.uid), {
        friendRequestsReceived: arrayRemove(targetId),
        friends: arrayUnion(targetId)
      });
      await updateDoc(doc(db, 'chat_users', targetId), {
        friendRequestsSent: arrayRemove(user.uid),
        friends: arrayUnion(user.uid)
      });
      onToast(lang === 'ru' ? 'Запрос в друзья принят!' : 'Friend request accepted!', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineFriend = async (targetId: string) => {
    try {
      await updateDoc(doc(db, 'chat_users', user.uid), {
        friendRequestsReceived: arrayRemove(targetId)
      });
      await updateDoc(doc(db, 'chat_users', targetId), {
        friendRequestsSent: arrayRemove(user.uid)
      });
      onToast(lang === 'ru' ? 'Запрос отклонен.' : 'Request declined.', 'warning');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFriend = async (targetId: string) => {
    try {
      await updateDoc(doc(db, 'chat_users', user.uid), {
        friends: arrayRemove(targetId)
      });
      await updateDoc(doc(db, 'chat_users', targetId), {
        friends: arrayRemove(user.uid)
      });
      onToast(lang === 'ru' ? 'Удален из списка контактов.' : 'Removed contact node.', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle user block handler
  const handleToggleBlock = async (targetUsername: string, currentBlocked: boolean) => {
    if (targetUsername === user.uid) {
      onToast(lang === 'ru' ? 'Вы не можете заблокировать себя!' : 'You cannot block yourself!', 'error');
      return;
    }

    try {
      const ref = doc(db, 'chat_users', targetUsername);
      await setDoc(ref, { isBlocked: !currentBlocked }, { merge: true });
      onToast(
        lang === 'ru' 
          ? `Статус блокировки пользователя ${targetUsername} изменен.` 
          : `Block status for user ${targetUsername} updated.`,
        'success'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${targetUsername}`);
      onToast(lang === 'ru' ? 'Не удалось изменить статус блокировки.' : 'Failed to change block status.', 'error');
    }
  };

  // Toggle VIP handler
  const handleToggleVip = async (targetUsername: string, currentVip: boolean) => {
    try {
      const ref = doc(db, 'chat_users', targetUsername);
      await setDoc(ref, { isVip: !currentVip }, { merge: true });
      onToast(
        lang === 'ru' 
          ? `VIP-статус пользователя ${targetUsername} изменен.` 
          : `VIP status for user ${targetUsername} updated.`,
        'success'
      );
    } catch (err) {
      console.error(err);
      onToast(lang === 'ru' ? 'Не удалось изменить VIP статус.' : 'Failed to update VIP status.', 'error');
    }
  };

  // Toggle Role (User / Admin)
  const handleToggleRole = async (targetUsername: string, currentRole: string) => {
    if (targetUsername === user.uid) {
      onToast(lang === 'ru' ? 'Вы не можете разжаловать себя!' : 'You cannot demote yourself!', 'error');
      return;
    }

    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const ref = doc(db, 'chat_users', targetUsername);
      
      // Update role and achievements
      const userSnap = await getDoc(ref);
      let badges = userSnap.data()?.badges || [];
      if (nextRole === 'admin') {
        if (!badges.includes('founder')) badges.push('founder');
      } else {
        badges = badges.filter((b: string) => b !== 'founder');
      }

      await setDoc(ref, { role: nextRole, badges }, { merge: true });
      onToast(
        lang === 'ru' 
          ? `Роль пользователя ${targetUsername} изменена на ${nextRole}.` 
          : `Role for user ${targetUsername} updated to ${nextRole}.`,
        'success'
      );
    } catch (err) {
      console.error(err);
      onToast(lang === 'ru' ? 'Не удалось изменить роль.' : 'Failed to change role.', 'error');
    }
  };

  // Delete User Account
  const handleDeleteUser = async (targetUsername: string) => {
    if (targetUsername === user.uid) {
      onToast(lang === 'ru' ? 'Вы не можете удалить свой собственный аккаунт!' : 'You cannot delete your own account!', 'error');
      return;
    }

    const confirmed = window.confirm(
      lang === 'ru' 
        ? `Вы действительно хотите удалить аккаунт ${targetUsername}?` 
        : `Are you sure you want to delete account ${targetUsername}?`
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'chat_users', targetUsername));
      onToast(
        lang === 'ru' ? `Пользователь ${targetUsername} удален.` : `User ${targetUsername} deleted.`,
        'success'
      );
    } catch (err) {
      console.error(err);
      onToast(lang === 'ru' ? 'Ошибка удаления.' : 'Delete failed.', 'error');
    }
  };

  const selectedTheme = PROFILE_THEMES.find(t => t.id === customTheme) || PROFILE_THEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-6xl bg-[#14171e] border-2 border-[#2a2f3b] rounded-none overflow-hidden shadow-2xl rust-metal-pattern flex flex-col md:flex-row h-[95vh] md:h-[760px] relative cabinet-modal-container"
      >
        {/* Tactical Corner Brackets */}
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        {/* Hazard header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rust-hazard z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer z-50 bg-black/40 p-1.5 border border-[#2a2f3b]/60 hover:border-zinc-500"
        >
          <X size={18} />
        </button>

        {/* CABINET SIDEBAR */}
        <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#2a2f3b] bg-[#0c0d10] p-4 pt-6 flex flex-col justify-between shrink-0">
          <div className="space-y-5">
            {/* User Profile Header Mini */}
            <div className="flex items-center gap-3 border-b border-[#2a2f3b]/60 pb-4 cursor-pointer hover:bg-white/5 p-1 transition-all" onClick={() => setInspectUserId(user.uid)}>
              <img 
                src={getAvatarUrl(fullProfile?.photoURL || user.photoURL, fullProfile?.avatarClass || user.avatarClass)} 
                alt={user.displayName} 
                className="w-10 h-10 rounded-full border border-gray-700 bg-zinc-950 object-cover"
              />
              <div className="min-w-0">
                <span className="block text-xs font-black text-white truncate font-sans uppercase leading-tight tracking-wider">
                  {fullProfile?.displayName || user.displayName}
                </span>
                {fullProfile?.clanTag && (
                  <span className="inline-block text-[8px] font-bold text-[#cd412b] uppercase mr-1">
                    [{fullProfile.clanTag}]
                  </span>
                )}
                <span className="inline-block text-[8px] font-mono text-zinc-500">
                  ID: {user.uid}
                </span>
              </div>
            </div>

            {/* Sidebar Buttons */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer transition-all border flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-[#cd412b]/10 border-[#cd412b]/40 text-[#cd412b] font-black'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <User size={13} />
                <span>{lang === 'ru' ? 'Мой Профиль' : 'My Profile'}</span>
              </button>

              <button
                onClick={() => setActiveTab('friends')}
                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer transition-all border flex items-center gap-2 ${
                  activeTab === 'friends'
                    ? 'bg-[#cd412b]/10 border-[#cd412b]/40 text-[#cd412b] font-black'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users size={13} />
                <span>{lang === 'ru' ? 'Друзья и Контакты' : 'Friends Network'}</span>
                {fullProfile?.friendRequestsReceived && fullProfile.friendRequestsReceived.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[9px] px-1 rounded-sm font-bold animate-pulse font-mono">
                    +{fullProfile.friendRequestsReceived.length}
                  </span>
                )}
              </button>

              {isAdmin && (
                <>
                  <div className="pt-2 text-[8px] font-mono font-black text-gray-500 uppercase tracking-widest pl-3">
                    {lang === 'ru' ? 'АДМИН-ЦЕНТР' : 'ADMIN CONTROL'}
                  </div>

                  <button
                    onClick={() => setActiveTab('admin_users')}
                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer transition-all border flex items-center gap-2 ${
                      activeTab === 'admin_users'
                        ? 'bg-[#cd412b]/10 border-[#cd412b]/40 text-[#cd412b] font-black'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Settings size={13} />
                    <span>{lang === 'ru' ? 'Пользователи' : 'Users Admin'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('admin_site')}
                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer transition-all border flex items-center gap-2 ${
                      activeTab === 'admin_site'
                        ? 'bg-[#cd412b]/10 border-[#cd412b]/40 text-[#cd412b] font-black'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Layout size={13} />
                    <span>{lang === 'ru' ? 'Опции Сайта' : 'Site Settings'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              onUserLogout();
              onClose();
            }}
            className="w-full mt-4 py-2 bg-red-600/10 hover:bg-red-600 border border-red-600/20 text-red-500 hover:text-white font-black text-[10px] uppercase tracking-wider font-mono cursor-pointer transition-all"
          >
            {lang === 'ru' ? 'ВЫЙТИ ИЗ СЕТИ' : 'DISCONNECT BEACON'}
          </button>
        </div>

        {/* CABINET MAIN CONTENT CONTAINER */}
        <div className="flex-1 bg-[#14171e]/90 p-6 overflow-y-auto flex flex-col relative pt-14 md:pt-14">
          <AnimatePresence mode="wait">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && fullProfile && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wider font-teko uppercase">
                      {lang === 'ru' ? 'ЛИЧНЫЙ КАБИНЕТ ВЫЖИВШЕГО' : 'SURVIVOR PERSONAL PROFILE'}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      {lang === 'ru' ? 'Кастомизация вашей визитки и сбор нашивок на острове' : 'Customize your telemetry card and collect badges on the island'}
                    </p>
                  </div>
                  
                  {/* Inspect Profile Button */}
                  <button
                    onClick={() => setInspectUserId(user.uid)}
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700/60 hover:border-zinc-500 hover:text-white text-zinc-300 text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer"
                  >
                    👁️ {lang === 'ru' ? 'Превью визитки' : 'Card Preview'}
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Form inputs (Span 7) */}
                  <form onSubmit={handleSaveProfile} className="xl:col-span-7 space-y-6 order-2 xl:order-1">
                    {/* Grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left Column: Stats & Information */}
                      <div className="space-y-5">
                        {/* Biometric logs */}
                        <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4">
                          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5">
                            {lang === 'ru' ? '1. ИГРОВЫЕ ПАРАМЕТРЫ (ВИЗИТКА)' : '1. SURVIVOR STATS CARD'}
                          </span>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-500 font-mono uppercase block">{lang === 'ru' ? 'Клан-Тег (До 5 симв.)' : 'Clan Tag (Max 5)'}</label>
                              <input 
                                type="text" 
                                maxLength={5}
                                value={clanTag}
                                onChange={(e) => setClanTag(e.target.value)}
                                className="w-full bg-[#14171e] border border-zinc-800 p-2.5 text-xs font-mono text-white outline-none focus:border-zinc-700"
                                placeholder="STG"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-500 font-mono uppercase block">{lang === 'ru' ? 'Часы в Rust' : 'Rust Hours'}</label>
                              <input 
                                type="number" 
                                value={hoursPlayed}
                                onChange={(e) => setHoursPlayed(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-[#14171e] border border-zinc-800 p-2.5 text-xs font-mono text-white outline-none focus:border-zinc-700"
                                placeholder="2500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-500 font-mono uppercase block">{lang === 'ru' ? 'Стиль Игры' : 'Playstyle'}</label>
                              <select
                                value={playstyle}
                                onChange={(e) => setPlaystyle(e.target.value)}
                                className="w-full bg-[#14171e] border border-zinc-800 p-2.5 text-xs font-mono text-white outline-none focus:border-zinc-700 cursor-pointer"
                              >
                                {['Solo', 'Duo/Trio', 'Clan PVP', 'Base Builder', 'Farmer', 'Casual', 'Roleplay'].map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-500 font-mono uppercase block">{lang === 'ru' ? 'Любимое Оружие' : 'Fav Weapon'}</label>
                              <select
                                value={favoriteWeapon}
                                onChange={(e) => setFavoriteWeapon(e.target.value)}
                                className="w-full bg-[#14171e] border border-zinc-800 p-2.5 text-xs font-mono text-white outline-none focus:border-zinc-700 cursor-pointer"
                              >
                                {['AK-47', 'LR-300', 'M249', 'Bolt Rifle', 'SAR', 'MP5A4', 'Custom SMG', 'Python', 'Double Barrel', 'Pump Shotgun', 'Compound Bow'].map(w => (
                                  <option key={w} value={w}>{w}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Bio status */}
                        <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-3.5">
                          <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5">
                            {lang === 'ru' ? '2. ОПИСАНИЕ И СОЦСЕТИ ВЫЖИВШЕГО' : '2. SURVIVOR STATUS & BIO'}
                          </label>
                          <textarea
                            rows={3}
                            maxLength={300}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={lang === 'ru' ? 'Расскажите о себе, ищите тиммейтов, рекламируйте свой магазин на сервере...' : 'Tell about yourself, recruit crew members, write base coords...'}
                            className="w-full bg-[#14171e] border border-zinc-800 text-xs font-mono p-3 text-zinc-200 focus:border-zinc-700 outline-none transition-all placeholder-zinc-700 resize-none"
                          />
                          <div className="space-y-1.5 pt-1">
                            <label className="text-[9px] text-zinc-500 font-mono uppercase block">{lang === 'ru' ? 'Ссылка на Steam профиль' : 'Steam Profile URL'}</label>
                            <input 
                              type="text" 
                              value={steamLink}
                              onChange={(e) => setSteamLink(e.target.value)}
                              className="w-full bg-[#14171e] border border-zinc-800 p-2.5 text-xs font-mono text-white outline-none focus:border-zinc-700"
                              placeholder="https://steamcommunity.com/id/your_steam_id"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Customization and Presets */}
                      <div className="space-y-5">
                        {/* Avatar Custom URL or Preset selector */}
                        <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4">
                          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5">
                            {lang === 'ru' ? '3. ВНЕШНИЙ ВИД (ПРЕСЕТЫ)' : '3. SURVIVOR AVATAR'}
                          </span>

                          {/* Custom avatar URL */}
                          <div className="space-y-1.5">
                            <label className="text-[8px] text-zinc-500 font-mono uppercase block">{lang === 'ru' ? 'Ссылка на свою аватарку (URL)' : 'Custom Avatar Image URL'}</label>
                            <input 
                              type="text" 
                              value={customAvatarUrl}
                              onChange={(e) => setCustomAvatarUrl(e.target.value)}
                              className="w-full bg-[#14171e] border border-zinc-800 p-2.5 text-[10px] font-mono text-white outline-none focus:border-zinc-700"
                              placeholder="https://example.com/avatar.png"
                            />
                          </div>

                          {/* Preset avatars grid */}
                          <div className="space-y-2">
                            <label className="text-[8px] text-zinc-500 font-mono uppercase block">{lang === 'ru' ? 'Выберите тактический костюм' : 'Select tactical suit'}</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                              {CUSTOM_AVATARS.map((avatar) => {
                                const isCurrent = fullProfile && fullProfile.avatarClass === avatar.id;
                                return (
                                  <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() => {
                                      handleSelectAvatar(avatar.id);
                                      if (fullProfile) {
                                        setFullProfile({ ...fullProfile, avatarClass: avatar.id, photoURL: avatar.url });
                                      }
                                    }}
                                    className={`p-2 border text-left flex items-center gap-2.5 cursor-pointer transition-all rounded-sm relative ${
                                      isCurrent 
                                        ? 'border-[#cd412b] bg-[#cd412b]/10' 
                                        : 'border-[#2a2f3b] bg-[#14171e]/50 hover:border-zinc-600'
                                    }`}
                                  >
                                    <img 
                                      src={avatar.url} 
                                      alt={avatar.name[lang]} 
                                      className="w-9 h-9 border border-zinc-800 object-cover bg-black shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <span className="block text-[8.5px] font-black text-white leading-tight truncate">
                                        {avatar.name[lang]}
                                      </span>
                                      <span className="block text-[6.5px] font-mono text-zinc-500 truncate">
                                        {avatar.role[lang]}
                                      </span>
                                    </div>
                                    {isCurrent && <CheckCircle2 size={11} className="text-[#cd412b] shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Theme selection */}
                        <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-3.5">
                          <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5">
                            {lang === 'ru' ? '4. СТИЛЬ ВИЗИТКИ (ТЕМЫ ПРОФИЛЯ)' : '4. CARD THEME & LAYOUT'}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {PROFILE_THEMES.map((theme) => {
                              const isSel = customTheme === theme.id;
                              return (
                                <button
                                  key={theme.id}
                                  type="button"
                                  onClick={() => setCustomTheme(theme.id)}
                                  className={`p-2.5 border text-[9.5px] font-mono font-bold uppercase tracking-wider text-center cursor-pointer transition-all ${
                                    isSel 
                                      ? 'bg-[#cd412b]/20 border-[#cd412b] text-white' 
                                      : 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-600 text-zinc-400'
                                  }`}
                                >
                                  {theme.name[lang]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save profile block */}
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full py-3 bg-[#cd412b] hover:bg-[#b03825] text-white font-black text-xs uppercase tracking-widest font-mono cursor-pointer transition-all flex items-center justify-center gap-2 border border-[#cd412b]/65 hover:border-white shadow-lg"
                    >
                      <Save size={14} />
                      <span>{isSavingProfile ? (lang === 'ru' ? 'ОБНОВЛЕНИЕ БИОСИСТЕМЫ...' : 'TRANSMITTING CODES...') : (lang === 'ru' ? 'ЗАФИКСИРОВАТЬ ПАРАМЕТРЫ ПРОФИЛЯ' : 'COMMIT BIO-SYSTEM PARAMETERS')}</span>
                    </button>
                  </form>

                  {/* Right Column: Live Card Preview (Span 5) */}
                  <div className="xl:col-span-5 space-y-3.5 order-1 xl:order-2 xl:sticky xl:top-0 bg-black/40 p-4 border border-[#2a2f3b]/50">
                    <span className="text-[10px] font-mono text-[#cd412b] font-black uppercase tracking-widest block flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      {lang === 'ru' ? 'ЖИВОЙ ПРЕДПРОСМОТР ВИЗИТКИ' : 'LIVE CARD TELEMETRY'}
                    </span>
                    
                    <div className={`border-2 border-[#2a2f3b] rounded-none overflow-hidden shadow-2xl relative flex flex-col p-0 rust-metal-pattern keep-dark ${selectedTheme.class}`}>
                      {/* Sleek Tactical Header Bar */}
                      <div className="bg-[#0b0c0f] border-b border-[#2a2f3b] px-3 py-1.5 flex items-center justify-between text-[8px] font-mono tracking-widest text-zinc-400 select-none">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                          <span className="font-bold text-red-500">RUSTY.LUB // TELEMETRY PREVIEW</span>
                        </div>
                        <span className="text-[7px] text-emerald-500 font-bold">LINK ACTIVE</span>
                      </div>

                      {/* Corner Brackets */}
                      <div className="rust-bracket-tl" />
                      <div className="rust-bracket-tr" />
                      <div className="rust-bracket-bl" />
                      <div className="rust-bracket-br" />

                      <div className="p-4 space-y-3.5">
                        {/* Avatar & Identifiers Split */}
                        <div className="flex gap-4 items-stretch pb-3.5 border-b border-[#2a2f3b]/50">
                          <div className="relative shrink-0">
                            <div className="border border-[#2a2f3b] p-1 bg-black w-24 h-24 relative overflow-hidden group">
                              <img 
                                src={getAvatarUrl(customAvatarUrl, fullProfile?.avatarClass)} 
                                alt="Live Preview" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.01] to-transparent bg-[size:100%_4px]" />
                              
                              {/* Micro Crosshairs */}
                              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#cd412b]/60" />
                              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#cd412b]/60" />
                              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#cd412b]/60" />
                              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#cd412b]/60" />
                            </div>
                            
                            {clanTag && (
                              <span className="absolute -top-1.5 -right-1.5 bg-[#cd412b] border border-red-500 text-[8px] font-black text-white px-1.5 py-0.5 font-mono shadow uppercase tracking-wider">
                                [{clanTag}]
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[7.5px] font-mono text-[#cd412b] uppercase tracking-widest block mb-0.5">
                                {lang === 'ru' ? 'КОДОВОЕ ИМЯ' : 'CALLSIGN'}
                              </span>
                              <span className="text-lg font-black text-white uppercase tracking-wide truncate block font-sans">
                                {fullProfile.displayName}
                              </span>
                            </div>

                            <div className="bg-[#0b0c0f]/80 border border-[#2a2f3b] p-1.5 text-left">
                              <span className="text-[7px] font-mono text-zinc-500 uppercase block mb-0.5">
                                {lang === 'ru' ? 'КОМПЛЕКТАЦИЯ КОСТЮМА' : 'EQUIPPED SKIN'}
                              </span>
                              <span className="text-[9px] font-bold text-zinc-200 font-mono block truncate uppercase">
                                {(CUSTOM_AVATARS.find(a => a.id === fullProfile.avatarClass) || CUSTOM_AVATARS[0]).name[lang]}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Survival Telemetry HUD inside Preview */}
                        <div className="bg-black/60 border border-[#2a2f3b]/50 p-2.5 space-y-1.5 text-left">
                          <div className="flex justify-between text-[7px] font-mono text-zinc-400">
                            <span>SURVIVAL HP STATUS</span>
                            <span className="text-emerald-400 font-bold">100 / 100</span>
                          </div>
                          <div className="h-1 bg-zinc-900 overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full" />
                          </div>
                        </div>

                        {/* Bio Status description */}
                        <div className="bg-black/50 border border-[#2a2f3b]/30 p-2.5 text-left relative overflow-hidden">
                          <span className="text-[7.5px] font-mono text-[#cd412b] block uppercase tracking-wider mb-1">
                            {lang === 'ru' ? 'РАДИОФОННЫЙ ЖУРНАЛ' : 'DECRYPTED LOG'}
                          </span>
                          <p className="text-[10px] text-zinc-300 font-mono leading-relaxed italic break-words whitespace-pre-line max-h-16 overflow-y-auto">
                            {bio || (lang === 'ru' ? '«Описание не заполнено...»' : '"This log is empty..."')}
                          </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-[#0b0c0f]/40 border border-[#2a2f3b]/40 p-2 text-center">
                            <span className="text-[7px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ЧАСЫ' : 'HOURS'}</span>
                            <span className="text-[11px] font-black font-mono text-zinc-100 block mt-0.5">
                              {hoursPlayed?.toLocaleString() || 0} H
                            </span>
                          </div>
                          <div className="bg-[#0b0c0f]/40 border border-[#2a2f3b]/40 p-2 text-center">
                            <span className="text-[7px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ОРУЖИЕ' : 'WEAPON'}</span>
                            <span className="text-[9px] font-bold text-[#cd412b] block mt-0.5 truncate font-mono">
                              {favoriteWeapon || 'AK-47'}
                            </span>
                          </div>
                          <div className="bg-[#0b0c0f]/40 border border-[#2a2f3b]/40 p-2 text-center">
                            <span className="text-[7px] text-zinc-500 font-mono block uppercase">{lang === 'ru' ? 'ТАКТИКА' : 'TACTICS'}</span>
                            <span className="text-[9px] font-bold text-zinc-200 block mt-0.5 truncate font-mono">
                              {playstyle || 'Solo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FRIENDS TAB */}
            {activeTab === 'friends' && fullProfile && (
              <motion.div
                key="friends"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wider font-teko uppercase">
                    {lang === 'ru' ? 'ДРУЗЬЯ И КОНТАКТНАЯ СЕТЬ' : 'SURVIVOR CONTACT NETWORK'}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {lang === 'ru' ? 'Отправляйте зашифрованные запросы другим выжившим для связи' : 'Send encrypted handshakes to establish friendly relations in the radio wave'}
                  </p>
                </div>

                {/* Direct add form */}
                <form onSubmit={handleAddFriendDirect} className="flex gap-2 bg-[#0c0d10] p-3 border border-[#2a2f3b]">
                  <input
                    type="text"
                    value={friendSearchId}
                    onChange={(e) => setFriendSearchId(e.target.value)}
                    placeholder={lang === 'ru' ? 'Введите ID выжившего для отправки запроса...' : 'Enter target survivor ID (e.g., username)...'}
                    className="flex-1 bg-[#14171e] border border-zinc-800 text-xs font-mono px-3 py-2 text-white outline-none focus:border-zinc-700"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#cd412b] text-white text-[10px] font-black uppercase font-mono cursor-pointer hover:bg-red-700 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Plus size={11} />
                    <span>{lang === 'ru' ? 'ДОБАВИТЬ' : 'ADD'}</span>
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Pending Requests */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-1">
                      📬 {lang === 'ru' ? 'ВХОДЯЩИЕ ЗАПРОСЫ' : 'INCOMING SIGNALS'} ({fullProfile.friendRequestsReceived?.length || 0})
                    </span>

                    <div className="bg-[#0c0d10] border border-[#2a2f3b] p-3 rounded-none divide-y divide-zinc-800/50 max-h-[180px] overflow-y-auto">
                      {!fullProfile.friendRequestsReceived || fullProfile.friendRequestsReceived.length === 0 ? (
                        <div className="py-6 text-center text-[10px] text-zinc-600 font-mono uppercase">
                          {lang === 'ru' ? 'Запросы отсутствуют' : 'No incoming beacons'}
                        </div>
                      ) : (
                        fullProfile.friendRequestsReceived.map((reqId) => {
                          const reqUser = registeredUsers.find(u => u.username === reqId);
                          return (
                            <div key={reqId} className="py-2 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={() => setInspectUserId(reqId)}>
                                <img 
                                  src={reqUser ? getAvatarUrl(reqUser.photoURL, reqUser.avatarClass) : `https://api.dicebear.com/7.x/bottts/svg?seed=${reqId}`} 
                                  alt={reqId} 
                                  className="w-6 h-6 rounded-full object-cover bg-black"
                                />
                                <span className="font-bold text-white truncate font-sans uppercase">
                                  {reqUser?.displayName || reqId}
                                </span>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  onClick={() => handleAcceptFriend(reqId)}
                                  className="p-1 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 text-emerald-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                                  title={lang === 'ru' ? 'Принять' : 'Accept'}
                                >
                                  <UserCheck size={11} />
                                </button>
                                <button
                                  onClick={() => handleDeclineFriend(reqId)}
                                  className="p-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500 text-red-400 hover:text-white transition-colors rounded-sm cursor-pointer"
                                  title={lang === 'ru' ? 'Отклонить' : 'Reject'}
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-1">
                      ✈️ {lang === 'ru' ? 'ИСХОДЯЩИЕ ЗАПРОСЫ' : 'SENT TRANSMISSIONS'} ({fullProfile.friendRequestsSent?.length || 0})
                    </span>

                    <div className="bg-[#0c0d10] border border-[#2a2f3b] p-3 rounded-none divide-y divide-zinc-800/50 max-h-[140px] overflow-y-auto">
                      {!fullProfile.friendRequestsSent || fullProfile.friendRequestsSent.length === 0 ? (
                        <div className="py-6 text-center text-[10px] text-zinc-600 font-mono uppercase">
                          {lang === 'ru' ? 'Список пуст' : 'No outgoing beacons'}
                        </div>
                      ) : (
                        fullProfile.friendRequestsSent.map((reqId) => {
                          const reqUser = registeredUsers.find(u => u.username === reqId);
                          return (
                            <div key={reqId} className="py-2 flex items-center justify-between gap-3 text-xs">
                              <span className="font-bold text-zinc-300 font-sans uppercase truncate cursor-pointer" onClick={() => setInspectUserId(reqId)}>
                                {reqUser?.displayName || reqId}
                              </span>
                              <button
                                onClick={() => handleDeclineFriend(reqId)} // cancellation is same logic
                                className="px-2 py-0.5 border border-zinc-700 hover:border-red-500 text-[9px] font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                              >
                                {lang === 'ru' ? 'Отмена' : 'Cancel'}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right: Actual Friends list */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-1">
                      🤝 {lang === 'ru' ? 'СПИСОК КОНТАКТОВ (ДРУЗЬЯ)' : 'CONNECTED CONTACTS'} ({fullProfile.friends?.length || 0})
                    </span>

                    <div className="bg-[#0c0d10] border border-[#2a2f3b] p-4 rounded-none divide-y divide-zinc-800/40 max-h-[350px] overflow-y-auto space-y-2">
                      {!fullProfile.friends || fullProfile.friends.length === 0 ? (
                        <div className="py-12 text-center text-xs text-zinc-600 font-mono uppercase leading-relaxed">
                          {lang === 'ru' ? 'Вы еще не установили дружеские контакты. Нажмите на аватар любого выжившего в чате, чтобы подружиться!' : 'You have not connected base frequencies yet. Click any avatar in radio logs to send friend code!'}
                        </div>
                      ) : (
                        fullProfile.friends.map((fId) => {
                          const fUser = registeredUsers.find(u => u.username === fId);
                          return (
                            <div key={fId} className="py-2 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 min-w-0 cursor-pointer" onClick={() => setInspectUserId(fId)}>
                                <img 
                                  src={fUser ? getAvatarUrl(fUser.photoURL, fUser.avatarClass) : `https://api.dicebear.com/7.x/bottts/svg?seed=${fId}`} 
                                  alt={fId} 
                                  className="w-7 h-7 rounded-full object-cover bg-black border border-zinc-800"
                                />
                                <span className="font-black text-white truncate font-sans uppercase">
                                  {fUser?.displayName || fId}
                                </span>
                              </div>

                              <div className="flex gap-1 shrink-0">
                                <button
                                  onClick={() => setInspectUserId(fId)}
                                  className="px-2 py-1 bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-[8px] font-mono font-bold uppercase text-zinc-300 hover:text-white transition-all cursor-pointer"
                                >
                                  {lang === 'ru' ? 'Визитка' : 'Card'}
                                </button>
                                <button
                                  onClick={() => handleRemoveFriend(fId)}
                                  className="p-1 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-sm cursor-pointer"
                                  title={lang === 'ru' ? 'Удалить друга' : 'Remove Friend'}
                                >
                                  <UserMinus size={11} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ADMIN USERS TAB */}
            {activeTab === 'admin_users' && isAdmin && (
              <motion.div
                key="admin_users"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="p-8 text-center text-gray-500 font-mono">
                    {lang === 'ru' ? 'Управление пользователями перемещено в Админ Панель' : 'User management moved to Admin Panel'}
                </div>
              </motion.div>
            )}

            {/* ADMIN SITE TAB */}
            {activeTab === 'admin_site' && isAdmin && (
              <motion.div
                key="admin_site"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="p-8 text-center text-gray-500 font-mono">
                    {lang === 'ru' ? 'Управление сайтом перемещено в Админ Панель' : 'Site management moved to Admin Panel'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

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
