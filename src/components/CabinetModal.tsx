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
  Upload,
  Wallet,
  Copy,
  ExternalLink,
  RefreshCw,
  Lock,
  ShieldAlert
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
  const [activeTab, setActiveTab] = useState<'profile' | 'friends' | 'admin_users' | 'admin_site' | 'vip'>('profile');
  
  // USDT TRC20 Payment states
  const [usdtTxId, setUsdtTxId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('diamond');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [isSandbox, setIsSandbox] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [daNickname, setDaNickname] = useState('');
  const [isSubmittingDa, setIsSubmittingDa] = useState(false);

  const VIP_PLANS = [
    {
      id: 'diamond',
      name: { ru: 'Diamond VIP', en: 'Diamond VIP' },
      price: 3,
      perks: {
        ru: [
          'Персонализация профиля (кастомные темы и аватары)',
          'Радар игроков: отслеживание истории серверов Rust по SteamID64 через BattleMetrics',
          'Анимированная фиолетовая корона 👑 в чате',
          'Все платные аватары и профильные темы открыты',
          'Добавление в почетный список спонсоров проекта',
          'Выделенный золотой никнейм и иконка ⭐ в глобальном чате'
        ],
        en: [
          'Profile personalization (custom themes & avatars)',
          'Player Radar: track Rust server history via BattleMetrics by SteamID64',
          'Animated purple crown 👑 in chat messages',
          'All premium survival avatars & themes unlocked',
          'Inclusion in the honorary project sponsors wall',
          'Highlighted gold username and star icon ⭐ in global chat'
        ]
      },
      badgeId: 'vip_diamond'
    }
  ];

  // Customization local states
  const [displayName, setDisplayName] = useState('');
  const [profileSubTab, setProfileSubTab] = useState<'info' | 'appearance' | 'security'>('info');
  const [bio, setBio] = useState('');
  const [clanTag, setClanTag] = useState('');
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);
  const [playstyle, setPlaystyle] = useState('Casual');
  const [favoriteWeapon, setFavoriteWeapon] = useState('AK-47');
  const [customTheme, setCustomTheme] = useState('slate');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [customBackground, setCustomBackground] = useState('');
  const [steamLink, setSteamLink] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [jungleFeverSpoiler, setJungleFeverSpoiler] = useState(false);

  // Security and Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);
  const [isCancellingDeletion, setIsCancellingDeletion] = useState(false);

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
          steamLink: data.steamLink || '',
          isVip: !!data.isVip,
          vipUntil: data.vipUntil || '',
          role: data.role || 'user',
          customBackground: data.customBackground || '',
          deletionRequested: !!data.deletionRequested,
          deletionRequestedAt: data.deletionRequestedAt || ''
        };
        setFullProfile(profile);

        // Pre-fill fields once
        setDisplayName(profile.displayName || '');
        setBio(profile.bio || '');
        setClanTag(profile.clanTag || '');
        setHoursPlayed(profile.hoursPlayed || 0);
        setPlaystyle(profile.playstyle || 'Casual');
        setFavoriteWeapon(profile.favoriteWeapon || 'AK-47');
        setCustomTheme(profile.customTheme || 'slate');
        setCustomAvatarUrl(profile.photoURL || '');
        setSteamLink(profile.steamLink || '');
        setCustomBackground(data.customBackground || '');
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

      if (!displayName.trim()) {
        onToast(lang === 'ru' ? 'Имя (Позывной) не может быть пустым!' : 'Callsign (Display Name) cannot be empty!', 'warning');
        setIsSavingProfile(false);
        return;
      }
      
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
        displayName: displayName.trim(),
        bio,
        clanTag: clanTag.slice(0, 5),
        hoursPlayed: Number(hoursPlayed) || 0,
        playstyle,
        favoriteWeapon,
        customTheme,
        steamLink: steamLink || '',
        badges: updatedBadges,
        customBackground: customBackground || ''
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

  // Handle password change request (Security section)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      onToast(lang === 'ru' ? 'Введите новый пароль!' : 'Please enter a new password!', 'warning');
      return;
    }
    if (newPassword.length < 4) {
      onToast(lang === 'ru' ? 'Пароль должен быть не менее 4 символов!' : 'Password must be at least 4 characters!', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      onToast(lang === 'ru' ? 'Пароли не совпадают!' : 'Passwords do not match!', 'warning');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateDoc(doc(db, 'chat_users', user.uid), {
        password: newPassword
      });
      onToast(lang === 'ru' ? 'Пароль успешно обновлен!' : 'Password updated successfully!', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${user.uid}`);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle request for profile deletion (sent to Control Center)
  const handleRequestDeletion = async () => {
    if (!confirm(lang === 'ru' ? 'Вы уверены, что хотите отправить запрос на удаление профиля? Это действие нельзя отменить автоматически.' : 'Are you sure you want to submit a profile deletion request? This action cannot be undone automatically.')) {
      return;
    }
    setIsRequestingDeletion(true);
    try {
      await updateDoc(doc(db, 'chat_users', user.uid), {
        deletionRequested: true,
        deletionRequestedAt: new Date().toISOString()
      });
      onToast(lang === 'ru' ? 'Заявка на удаление профиля отправлена в Control Center!' : 'Profile deletion request submitted to Control Center!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${user.uid}`);
    } finally {
      setIsRequestingDeletion(false);
    }
  };

  // Handle canceling/deleting one's own profile deletion request
  const handleCancelDeletion = async () => {
    setIsCancellingDeletion(true);
    try {
      await updateDoc(doc(db, 'chat_users', user.uid), {
        deletionRequested: false,
        deletionRequestedAt: null
      });
      onToast(lang === 'ru' ? 'Заявка на удаление профиля успешно отменена!' : 'Profile deletion request successfully cancelled!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${user.uid}`);
    } finally {
      setIsCancellingDeletion(false);
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

  const handleVerifyUsdtPayment = async () => {
    const trimmedTxId = usdtTxId.trim();
    if (!trimmedTxId) {
      onToast(lang === 'ru' ? 'Пожалуйста, введите ID транзакции (TxID)!' : 'Please enter the Transaction ID (TxID)!', 'error');
      return;
    }

    const activePlan = VIP_PLANS.find(p => p.id === selectedPlanId) || VIP_PLANS[0];
    const isActuallySandbox = isSandbox || trimmedTxId.toLowerCase().startsWith('demo_');

    setIsVerifyingPayment(true);
    setPaymentStatus('verifying');
    setPaymentError('');

    try {
      // Step 1: Query the Express server verification endpoint
      const response = await fetch('/api/payment/verify-usdt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txId: trimmedTxId,
          plan: activePlan.name[lang],
          amount: activePlan.price,
          userId: user.uid,
          isSandbox: isActuallySandbox
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setPaymentStatus('error');
        setPaymentError(data.error || (lang === 'ru' ? 'Ошибка верификации платежа на сервере.' : 'Server payment verification error.'));
        onToast(data.error || (lang === 'ru' ? 'Ошибка верификации!' : 'Verification failed!'), 'error');
        return;
      }

      // Calculate 45 days expiration from now
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
      const vipUntilIso = expiresAt.toISOString();

      // Step 2: Write transaction log & update VIP status in Firestore
      const paymentRef = doc(db, 'payments', trimmedTxId);
      await setDoc(paymentRef, {
        txId: trimmedTxId,
        userId: user.uid,
        userDisplayName: fullProfile?.displayName || user.displayName,
        amount: activePlan.price,
        plan: activePlan.id,
        status: 'approved',
        isSandbox: isActuallySandbox,
        createdAt: now.toISOString(),
        expiresAt: vipUntilIso
      });

      // Update user document
      const userRef = doc(db, 'chat_users', user.uid);
      const updatedBadges = [...(fullProfile?.badges || [])];
      if (!updatedBadges.includes(activePlan.badgeId)) {
        updatedBadges.push(activePlan.badgeId);
      }
      if (!updatedBadges.includes('vip')) {
        updatedBadges.push('vip');
      }

      // Automatically unlock premium settings if user buys Gold or Diamond
      let premiumTheme = fullProfile?.customTheme || 'slate';
      if (activePlan.id === 'gold') premiumTheme = 'amber';
      if (activePlan.id === 'diamond') premiumTheme = 'matrix';

      await updateDoc(userRef, {
        isVip: true,
        vipUntil: vipUntilIso,
        badges: updatedBadges,
        customTheme: premiumTheme
      });

      setPaymentStatus('success');
      setUsdtTxId('');
      onToast(
        lang === 'ru' 
          ? 'Оплата подтверждена! VIP статус и бонусы успешно активированы! 🎉' 
          : 'Payment verified! VIP status and rewards successfully activated! 🎉', 
        'success'
      );

    } catch (err: any) {
      console.error("[USDT VERIFICATION CLIENT ERROR]", err);
      setPaymentStatus('error');
      setPaymentError(lang === 'ru' ? 'Не удалось связаться с сервером верификации.' : 'Could not contact the verification server.');
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  const handleDonationSubmit = async () => {
    if (!daNickname.trim()) {
      onToast(lang === 'ru' ? 'Введите ваш никнейм из DonationAlerts!' : 'Enter your DonationAlerts nickname!', 'warning');
      return;
    }

    setIsSubmittingDa(true);
    try {
      const appId = `da_${Date.now()}_${user.uid.slice(0, 4)}`;
      await setDoc(doc(db, 'vip_applications', appId), {
        id: appId,
        userId: user.uid,
        userDisplayName: fullProfile?.displayName || user.uid,
        paymentMethod: 'donationalerts',
        donatorNickname: daNickname.trim(),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      onToast(
        lang === 'ru' 
          ? 'Заявка успешно отправлена! Ожидайте проверки администратором.' 
          : 'Application submitted! Awaiting administrator verification.', 
        'success'
      );
      setDaNickname('');
    } catch (err) {
      console.error(err);
      onToast(lang === 'ru' ? 'Ошибка отправки заявки.' : 'Failed to submit application.', 'error');
    } finally {
      setIsSubmittingDa(false);
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
              <img referrerPolicy="no-referrer" 
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

              <button
                onClick={() => setActiveTab('vip')}
                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer transition-all border flex items-center gap-2 ${
                  activeTab === 'vip'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 font-black'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Crown size={13} className={fullProfile?.isVip ? 'text-amber-500 animate-pulse' : ''} />
                <span>{lang === 'ru' ? 'VIP Подписка' : 'VIP Subscription'}</span>
                {fullProfile?.isVip && (
                  <span className="ml-auto bg-amber-500 text-black text-[8px] px-1 font-black font-mono uppercase tracking-widest rounded-sm">
                    {lang === 'ru' ? 'АКТИВНО' : 'ACTIVE'}
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
                  <form onSubmit={handleSaveProfile} className="xl:col-span-7 space-y-5 order-2 xl:order-1">
                    
                    {/* Sleek Tactical Segmented Tabs for Profile Editing */}
                    <div className="flex bg-[#0c0d10] p-1 border border-[#2a2f3b] rounded-sm gap-1">
                      <button
                        type="button"
                        onClick={() => setProfileSubTab('info')}
                        className={`flex-1 py-2 text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer text-center transition-all flex items-center justify-center gap-1.5 ${
                          profileSubTab === 'info'
                            ? 'bg-[#cd412b]/15 border border-[#cd412b]/50 text-white font-black'
                            : 'border border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/30'
                        }`}
                      >
                        <User size={12} className={profileSubTab === 'info' ? 'text-[#cd412b]' : 'text-zinc-600'} />
                        {lang === 'ru' ? 'Параметры' : 'Parameters'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileSubTab('appearance')}
                        className={`flex-1 py-2 text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer text-center transition-all flex items-center justify-center gap-1.5 ${
                          profileSubTab === 'appearance'
                            ? 'bg-[#cd412b]/15 border border-[#cd412b]/50 text-white font-black'
                            : 'border border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/30'
                        }`}
                      >
                        <Sparkles size={12} className={profileSubTab === 'appearance' ? 'text-[#cd412b]' : 'text-zinc-600'} />
                        {lang === 'ru' ? 'Внешний вид' : 'Appearance'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileSubTab('security')}
                        className={`flex-1 py-2 text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer text-center transition-all flex items-center justify-center gap-1.5 ${
                          profileSubTab === 'security'
                            ? 'bg-[#cd412b]/15 border border-[#cd412b]/50 text-white font-black'
                            : 'border border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/30'
                        }`}
                      >
                        <ShieldCheck size={12} className={profileSubTab === 'security' ? 'text-[#cd412b]' : 'text-zinc-600'} />
                        {lang === 'ru' ? 'Безопасность' : 'Security'}
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {profileSubTab === 'info' && (
                        <motion.div
                          key="info-tab"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-4"
                        >
                          <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4">
                            <span className="text-[10px] font-mono text-[#cd412b] font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5 flex items-center gap-1.5">
                              <User size={12} />
                              {lang === 'ru' ? 'ЛИЧНЫЕ ДАННЫЕ И ИГРОВЫЕ ПАРАМЕТРЫ' : 'PERSONAL DATA & IN-GAME TELEMETRY'}
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Callsign Display Name */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-500 font-mono uppercase block">
                                  {lang === 'ru' ? 'Имя (Позывной выжившего)' : 'Callsign (Display Name)'}
                                </label>
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    maxLength={20}
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    disabled={fullProfile?.role !== 'admin'}
                                    className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                                    placeholder={user.uid}
                                  />
                                  {fullProfile?.role !== 'admin' && (
                                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                      <Lock size={10} className="text-zinc-600" />
                                    </div>
                                  )}
                                </div>
                                {fullProfile?.role !== 'admin' && (
                                  <span className="text-[7px] text-zinc-600 font-mono uppercase tracking-tight">
                                    {lang === 'ru' ? 'Изменение доступно только Администрации' : 'Callsign change requires Admin override'}
                                  </span>
                                )}
                              </div>

                              {/* Clan Tag */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-500 font-mono uppercase block">
                                  {lang === 'ru' ? 'Клан-Тег (До 5 симв.)' : 'Clan Tag (Max 5)'}
                                </label>
                                <input 
                                  type="text" 
                                  maxLength={5}
                                  value={clanTag}
                                  onChange={(e) => setClanTag(e.target.value)}
                                  className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none"
                                  placeholder="STG"
                                />
                              </div>

                              {/* Hours in Rust */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-500 font-mono uppercase block">
                                  {lang === 'ru' ? 'Часы в Rust' : 'Hours in Rust'}
                                </label>
                                <input 
                                  type="number" 
                                  value={hoursPlayed}
                                  onChange={(e) => setHoursPlayed(Math.max(0, parseInt(e.target.value) || 0))}
                                  className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none"
                                  placeholder="2500"
                                />
                              </div>

                              {/* Playstyle */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-500 font-mono uppercase block">
                                  {lang === 'ru' ? 'Стиль Игры' : 'Playstyle'}
                                </label>
                                <select
                                  value={playstyle}
                                  onChange={(e) => setPlaystyle(e.target.value)}
                                  className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none cursor-pointer"
                                >
                                  {['Solo', 'Duo/Trio', 'Clan PVP', 'Base Builder', 'Farmer', 'Casual', 'Roleplay'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Favorite Weapon */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-500 font-mono uppercase block">
                                  {lang === 'ru' ? 'Любимое Оружие' : 'Favorite Weapon'}
                                </label>
                                <select
                                  value={favoriteWeapon}
                                  onChange={(e) => setFavoriteWeapon(e.target.value)}
                                  className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none cursor-pointer"
                                >
                                  {['AK-47', 'LR-300', 'M249', 'Bolt Rifle', 'SAR', 'MP5A4', 'Custom SMG', 'Python', 'Double Barrel', 'Pump Shotgun', 'Compound Bow'].map(w => (
                                    <option key={w} value={w}>{w}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Steam Link */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-500 font-mono uppercase block">
                                  {lang === 'ru' ? 'Ссылка на Steam профиль' : 'Steam Profile URL'}
                                </label>
                                <input 
                                  type="text" 
                                  value={steamLink}
                                  onChange={(e) => setSteamLink(e.target.value)}
                                  className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none"
                                  placeholder="https://steamcommunity.com/id/your_steam_id"
                                />
                              </div>

                              {/* Bio Status (Full Width) */}
                              <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[9.5px] text-zinc-500 font-mono uppercase block">
                                  {lang === 'ru' ? 'Статус / Описание выжившего (до 300 симв.)' : 'Status / Survivor Bio (max 300 chars)'}
                                </label>
                                <textarea
                                  rows={4}
                                  maxLength={300}
                                  value={bio}
                                  onChange={(e) => setBio(e.target.value)}
                                  placeholder={lang === 'ru' ? 'Расскажите о себе, ищите тиммейтов, рекламируйте свой магазин на сервере...' : 'Tell about yourself, recruit crew members, write base coords...'}
                                  className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 text-xs font-mono p-3 text-zinc-200 outline-none transition-all placeholder-zinc-750 resize-none leading-relaxed"
                                />
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
                            <span>{isSavingProfile ? (lang === 'ru' ? 'ОБНОВЛЕНИЕ БИОСИСТЕМЫ...' : 'TRANSMITTING CODES...') : (lang === 'ru' ? 'СОХРАНИТЬ ПАРАМЕТРЫ ПРОФИЛЯ' : 'SAVE PROFILE PARAMETERS')}</span>
                          </button>
                        </motion.div>
                      )}

                      {profileSubTab === 'appearance' && (
                        <motion.div
                          key="appearance-tab"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-4"
                        >
                          {/* Choose Tactical Suit */}
                          <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4">
                            <span className="text-[10px] font-mono text-[#cd412b] font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5 flex items-center gap-1.5">
                              <Sparkles size={12} />
                              {lang === 'ru' ? 'ВЫБОР ТАКТИЧЕСКОГО КОСТЮМА (АВАТАР)' : 'CHOOSE TACTICAL SUIT (AVATAR)'}
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
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
                                    <img referrerPolicy="no-referrer" 
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

                            {/* Custom Avatar URL */}
                            <div className="space-y-1.5 pt-2">
                              <label className="text-[8.5px] text-zinc-500 font-mono uppercase block">
                                {lang === 'ru' ? 'Или своя тактическая аватарка по ссылке (URL фото)' : 'Or set custom avatar using image URL'}
                              </label>
                              <input 
                                type="text" 
                                value={customAvatarUrl}
                                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                                className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none"
                                placeholder="https://example.com/avatar.png"
                              />
                            </div>
                          </div>

                          {/* Theme selection */}
                          <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4">
                            <span className="text-[10px] font-mono text-[#cd412b] font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5 flex items-center gap-1.5">
                              <Layout size={12} />
                              {lang === 'ru' ? 'ЦВЕТОВАЯ ГАММА И ТЕМАТИКА ВИЗИТКИ' : 'CARD THEMATIC COLOR PALETTE'}
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {PROFILE_THEMES.map((theme) => {
                                const isSel = customTheme === theme.id;
                                return (
                                  <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => setCustomTheme(theme.id)}
                                    className={`p-2 border text-[9.5px] font-mono font-bold uppercase tracking-wider text-center cursor-pointer transition-all ${
                                      isSel 
                                        ? 'bg-[#cd412b]/20 border-[#cd412b] text-white shadow-[0_0_8px_rgba(205,65,43,0.15)]' 
                                        : 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                                    }`}
                                  >
                                    {theme.name[lang]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Custom background image (VIP ONLY) */}
                          {!(fullProfile?.isVip || fullProfile?.role === 'admin') ? (
                            <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4 relative overflow-hidden group">
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-3 p-4 text-center">
                                <div className="p-3 bg-amber-500/20 rounded-full border border-amber-500/40 text-amber-500">
                                  <Lock size={24} />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest font-mono">
                                    {lang === 'ru' ? 'ФУНКЦИЯ ЗАБЛОКИРОВАНА' : 'FEATURE ENCRYPTED'}
                                  </h4>
                                  <p className="text-[9px] text-zinc-400 font-mono uppercase leading-relaxed max-w-[200px]">
                                    {lang === 'ru' 
                                      ? 'СВОЙ ФОН ДОСТУПЕН ТОЛЬКО ДЛЯ VIP ПОЛЬЗОВАТЕЛЕЙ' 
                                      : 'CUSTOM BACKGROUND IS EXCLUSIVE FOR VIP SPONSORS'}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setActiveTab('vip')}
                                  className="mt-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-[9px] font-black font-mono uppercase tracking-widest transition-all"
                                >
                                  {lang === 'ru' ? 'ПОЛУЧИТЬ VIP' : 'GET VIP ACCESS'}
                                </button>
                              </div>
                              <span className="text-[10px] font-mono flex justify-between items-center text-zinc-600 font-bold uppercase tracking-wider block border-b border-zinc-900 pb-1.5 opacity-30">
                                <span className="flex items-center gap-1.5">
                                  <Crown size={12} />
                                  {lang === 'ru' ? 'СВОЙ ФОН ВИЗИТКИ' : 'CUSTOM BACKGROUND'}
                                </span>
                              </span>
                            </div>
                          ) : (
                            <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4 relative overflow-hidden">
                              <span className="text-[10px] font-mono flex justify-between items-center text-[#cd412b] font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5">
                                <span className="flex items-center gap-1.5">
                                  <Crown size={12} className="text-amber-500" />
                                  {lang === 'ru' ? 'СВОЙ ФОН ВИЗИТКИ (VIP-ФУНКЦИЯ)' : 'CUSTOM BACKGROUND (VIP FUNCTION)'}
                                </span>
                              </span>
                              
                              <div className="space-y-3 pt-1">
                                <div className="flex flex-col gap-2">
                                  <label className="text-[8px] text-zinc-500 font-mono uppercase block">
                                    {lang === 'ru' ? 'Загрузить файл с устройства (До 700KB)' : 'Upload file from device (Max 700KB)'}
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/40 text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-200 uppercase tracking-wider cursor-pointer transition-all">
                                      <Upload size={12} />
                                      <span>{lang === 'ru' ? 'Выбрать фото' : 'Choose Photo'}</span>
                                      <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const isVip = !!fullProfile?.isVip || fullProfile?.uid === "serustqs" || fullProfile?.role === "admin"; const limit = isVip ? 6 * 1024 * 1024 : 700 * 1024; const limitStr = isVip ? "6MB" : "700KB"; if (file.size > limit) {
                                              onToast(lang === 'ru' ? 'Размер файла превышает 700KB!' : 'File size exceeds 700KB!', 'warning');
                                              return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              setCustomBackground(reader.result as string);
                                              onToast(lang === 'ru' ? 'Фото успешно загружено!' : 'Photo successfully loaded!', 'success');
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </label>
                                    
                                    {customBackground && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCustomBackground('');
                                          onToast(lang === 'ru' ? 'Фон сброшен!' : 'Background reset!', 'success');
                                        }}
                                        className="px-2.5 py-2 border border-red-500/30 hover:border-red-500 bg-red-900/10 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                                      >
                                        {lang === 'ru' ? 'Сбросить' : 'Reset'}
                                      </button>
                                    )}
                                  </div>
                                </div>
    
                                <div className="space-y-1.5">
                                  <label className="text-[8px] text-zinc-500 font-mono uppercase block">
                                    {lang === 'ru' ? 'Или вставьте прямую ссылку на фото (URL)' : 'Or paste direct image URL'}
                                  </label>
                                  <input 
                                    type="text" 
                                    value={customBackground}
                                    onChange={(e) => setCustomBackground(e.target.value)}
                                    className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-[10px] font-mono text-white outline-none"
                                    placeholder="https://example.com/background.jpg"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Save profile block */}
                          <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="w-full py-3 bg-[#cd412b] hover:bg-[#b03825] text-white font-black text-xs uppercase tracking-widest font-mono cursor-pointer transition-all flex items-center justify-center gap-2 border border-[#cd412b]/65 hover:border-white shadow-lg"
                          >
                            <Save size={14} />
                            <span>{isSavingProfile ? (lang === 'ru' ? 'ОБНОВЛЕНИЕ БИОСИСТЕМЫ...' : 'TRANSMITTING CODES...') : (lang === 'ru' ? 'СОХРАНИТЬ ПАРАМЕТРЫ ПРОФИЛЯ' : 'SAVE PROFILE PARAMETERS')}</span>
                          </button>
                        </motion.div>
                      )}

                      {profileSubTab === 'security' && (
                        <motion.div
                          key="security-tab"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-4"
                        >
                          {!(fullProfile?.isVip || fullProfile?.role === 'admin') ? (
                            <div className="bg-[#0c0d10] border border-[#2a2f3b] p-12 flex flex-col items-center justify-center gap-4 text-center">
                              <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                <ShieldAlert size={32} />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] font-mono">
                                  {lang === 'ru' ? 'ДОСТУП ОГРАНИЧЕН' : 'ACCESS DENIED'}
                                </h3>
                                <p className="text-[10px] text-zinc-500 font-mono uppercase leading-relaxed max-w-sm">
                                  {lang === 'ru' 
                                    ? 'РАСШИРЕННЫЕ ПРОТОКОЛЫ БЕЗОПАСНОСТИ ДОСТУПНЫ ТОЛЬКО ДЛЯ VIP-ПОДРАЗДЕЛЕНИЙ' 
                                    : 'ADVANCED SECURITY PROTOCOLS ARE RESTRICTED TO VIP OPERATIVES ONLY'}
                                </p>
                              </div>
                              <button
                                onClick={() => setActiveTab('vip')}
                                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black font-mono uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                              >
                                {lang === 'ru' ? 'КУПИТЬ VIP ПОДПИСКУ' : 'UPGRADE TO VIP'}
                              </button>
                            </div>
                          ) : (
                            <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4">
                            <span className="text-[10px] font-mono text-[#cd412b] font-bold uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5 flex items-center gap-1.5">
                              <ShieldCheck size={12} className="text-[#cd412b]" />
                              {lang === 'ru' ? 'БЕЗОПАСНОСТЬ ПРОФИЛЯ' : 'PROFILE SECURITY PROTOCOLS'}
                            </span>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                              {/* Change Password */}
                              <div className="space-y-3.5">
                                <span className="text-[9px] text-[#cd412b] font-mono uppercase font-black block tracking-wider">
                                  {lang === 'ru' ? '1. ИЗМЕНЕНИЕ ПАРОЛЯ' : '1. UPDATE ACCESS CODE (PASSWORD)'}
                                </span>
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-[8px] text-zinc-500 font-mono uppercase block">
                                      {lang === 'ru' ? 'Новый пароль' : 'New Password'}
                                    </label>
                                    <input 
                                      type="password" 
                                      value={newPassword}
                                      onChange={(e) => setNewPassword(e.target.value)}
                                      className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none"
                                      placeholder="••••••••"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] text-zinc-500 font-mono uppercase block">
                                      {lang === 'ru' ? 'Подтвердите новый пароль' : 'Confirm New Password'}
                                    </label>
                                    <input 
                                      type="password" 
                                      value={confirmPassword}
                                      onChange={(e) => setConfirmPassword(e.target.value)}
                                      className="w-full bg-[#14171e] border border-zinc-800 focus:border-zinc-700 p-2.5 text-xs font-mono text-white outline-none"
                                      placeholder="••••••••"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleUpdatePassword}
                                    disabled={isUpdatingPassword}
                                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/50 hover:border-zinc-500 text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                                  >
                                    {isUpdatingPassword ? (lang === 'ru' ? 'ОБНОВЛЕНИЕ...' : 'UPDATING...') : (lang === 'ru' ? 'ИЗМЕНИТЬ ПАРОЛЬ' : 'CHANGE PASSWORD')}
                                  </button>
                                </div>
                              </div>

                              {/* Deletion Request */}
                              <div className="space-y-3.5 flex flex-col justify-between">
                                <div>
                                  <span className="text-[9px] text-red-500 font-mono uppercase font-black block tracking-wider mb-2">
                                    {lang === 'ru' ? '2. УДАЛЕНИЕ ПРОФИЛЯ' : '2. PROTOCOL: SELF-DESTRUCTION'}
                                  </span>
                                  <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
                                    {lang === 'ru' 
                                      ? 'Вы можете подать заявку на удаление своего профиля на рассмотрение администрации в Control Center.' 
                                      : 'You can submit a request for your profile deletion to be reviewed by administration in Control Center.'}
                                  </p>
                                </div>
                                
                                <div className="pt-2">
                                  {fullProfile?.deletionRequested ? (
                                    <div className="space-y-3">
                                      <div className="p-2.5 bg-red-950/20 border border-red-900/50 flex items-center gap-2 rounded-sm">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0" />
                                        <div className="min-w-0">
                                          <span className="block text-[8.5px] font-mono text-red-400 uppercase font-bold leading-tight">
                                            {lang === 'ru' ? 'ЗАЯВКА НА УДАЛЕНИЕ АКТИВНА' : 'DELETION REQUEST ACTIVE'}
                                          </span>
                                          {fullProfile.deletionRequestedAt && (
                                            <span className="block text-[6.5px] font-mono text-zinc-500">
                                              {new Date(fullProfile.deletionRequestedAt).toLocaleString()}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={handleCancelDeletion}
                                        disabled={isCancellingDeletion}
                                        className="w-full py-2 bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-500 hover:text-white text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                                      >
                                        {isCancellingDeletion ? (lang === 'ru' ? 'ОТМЕНА...' : 'CANCELLING...') : (lang === 'ru' ? 'ОТМЕНИТЬ ЗАЯВКУ НА УДАЛЕНИЕ' : 'CANCEL DELETION REQUEST')}
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={handleRequestDeletion}
                                      disabled={isRequestingDeletion}
                                      className="w-full py-2 bg-red-600/10 hover:bg-red-600 border border-red-600/20 text-red-500 hover:text-white text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                                    >
                                      {isRequestingDeletion ? (lang === 'ru' ? 'ОТПРАВКА...' : 'SUBMITTING...') : (lang === 'ru' ? 'ЗАПРОСИТЬ УДАЛЕНИЕ ПРОФИЛЯ' : 'REQUEST PROFILE DELETION')}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                    </AnimatePresence>

                  </form>

                  {/* Right Column: Live Card Preview (Span 5) */}
                  <div className="xl:col-span-5 space-y-3.5 order-1 xl:order-2 xl:sticky xl:top-0 bg-black/40 p-4 border border-[#2a2f3b]/50">
                    <span className="text-[10px] font-mono text-[#cd412b] font-black uppercase tracking-widest block flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      {lang === 'ru' ? 'ЖИВОЙ ПРЕДПРОСМОТР ВИЗИТКИ' : 'LIVE CARD TELEMETRY'}
                    </span>
                    
                    <div 
                      className={`border-2 border-[#2a2f3b] rounded-none overflow-hidden shadow-2xl relative flex flex-col p-0 rust-metal-pattern keep-dark ${selectedTheme.class}`}
                    >
                      {customBackground && (
                        <img referrerPolicy="no-referrer" src={customBackground} alt="Background" className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-60 mix-blend-screen" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0d10]/80 to-[#14171e]/65 pointer-events-none -z-10" />
                      {/* Sleek Tactical Header Bar */}
                      <div className="bg-[#0b0c0f]/60 backdrop-blur-sm border-b border-[#2a2f3b] px-3 py-1.5 flex items-center justify-between text-[8px] font-mono tracking-widest text-zinc-400 select-none relative z-10">
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

                      <div className="p-4 space-y-3.5 relative z-10">
                        {/* Avatar & Identifiers Split */}
                        <div className="flex gap-4 items-stretch pb-3.5 border-b border-[#2a2f3b]/50">
                          <div className="relative shrink-0">
                            <div className="border border-[#2a2f3b] p-1 bg-black w-24 h-24 relative overflow-hidden group">
                              <img referrerPolicy="no-referrer" 
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

                            <div className="bg-[#0b0c0f]/40 backdrop-blur-sm border border-[#2a2f3b] p-1.5 text-left">
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
                        <div className="bg-black/30 backdrop-blur-sm border border-[#2a2f3b]/50 p-2.5 space-y-1.5 text-left">
                          <div className="flex justify-between text-[7px] font-mono text-zinc-400">
                            <span>SURVIVAL HP STATUS</span>
                            <span className="text-emerald-400 font-bold">100 / 100</span>
                          </div>
                          <div className="h-1 bg-zinc-900 overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full" />
                          </div>
                        </div>

                        {/* Bio Status description */}
                        <div className="bg-black/20 backdrop-blur-sm border border-[#2a2f3b]/30 p-2.5 text-left relative overflow-hidden">
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
                                <img referrerPolicy="no-referrer" 
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
                                <img referrerPolicy="no-referrer" 
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

            {/* VIP SUBSCRIPTION TAB */}
            {activeTab === 'vip' && (
              <motion.div
                key="vip"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 text-left"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-amber-600/10 via-amber-500/5 to-transparent border border-amber-500/20 p-5 relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-amber-500/10 rotate-12">
                    <Crown size={80} />
                  </div>
                  <div className="relative z-10 space-y-1">
                    <h2 className="text-sm font-black font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
                      <Crown size={18} className="text-amber-400" />
                      {lang === 'ru' ? 'RUSTHUB VIP ПРИВИЛЕГИИ' : 'RUSTHUB VIP PRIVILEGES'}
                    </h2>
                    <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
                      {lang === 'ru' 
                        ? 'Поддержите развитие проекта и получите эксклюзивный статус на сайте и в чате с моментальной автоматической активацией!' 
                        : 'Support the project development and unlock exclusive premium status on the site and in chat with instant transaction processing!'}
                    </p>
                  </div>
                </div>

                {/* If already VIP */}
                {fullProfile?.isVip && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider font-mono">
                        {lang === 'ru' ? 'ВАШ VIP-СТАТУС АКТИВЕН!' : 'YOUR VIP STATUS IS ACTIVE!'}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {lang === 'ru' 
                          ? 'Спасибо большое за вашу поддержку! Все премиум-привилегии и темы уже разблокированы в вашем профиле.' 
                          : 'Thank you immensely for your sponsorship! All premium privileges and card designs are unlocked.'}
                      </p>
                      {fullProfile?.vipUntil && (
                        <div className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          <span>
                            {lang === 'ru' ? 'АКТИВЕН ДО:' : 'ACTIVE UNTIL:'} {new Date(fullProfile.vipUntil).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Plans Selection Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Free Perks Card */}
                  <div className="bg-zinc-950/20 border border-zinc-800/40 p-4 space-y-3 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 text-zinc-800/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <Lock size={60} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">
                        DEFAULT ACCESS
                      </span>
                      <h3 className="text-sm font-black text-zinc-300 font-sans uppercase mt-0.5">
                        {lang === 'ru' ? 'БАЗОВЫЙ ДОСТУП (FREE)' : 'BASIC ACCESS (FREE)'}
                      </h3>
                    </div>
                    <ul className="space-y-1.5 pt-2 border-t border-zinc-800/30">
                      {[
                        { ru: 'Глобальный радио-чат RustHub', en: 'Global RustHub radio chat' },
                        { ru: 'Калькулятор рейдов (базовый)', en: 'Raid calculator (basic)' },
                        { ru: 'Справочник биндов и консольных команд', en: 'Binds and console command library' },
                        { ru: 'База ошибок Rust и способы их решения', en: 'Rust error database & fixes' },
                        { ru: 'Просмотр новостей и блогов', en: 'News and developer blogs' },
                        { ru: 'Создание своего профиля и списка друзей', en: 'Profile creation and friends list' }
                      ].map((perk, i) => (
                        <li key={i} className="text-[9px] text-zinc-500 flex items-start gap-1.5 leading-relaxed">
                          <Check size={10} className="text-emerald-500/50 mt-0.5 shrink-0" />
                          <span>{perk[lang]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {VIP_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setPaymentStatus('idle');
                          setPaymentError('');
                        }}
                        className={`border p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                          isSelected
                            ? 'bg-amber-500/5 border-amber-500 shadow-lg shadow-amber-950/10'
                            : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/30'
                        }`}
                      >
                        <span className="absolute -top-2.5 right-3 bg-amber-500 text-black text-[8px] font-black font-mono px-2 py-0.5 uppercase tracking-wider">
                          {lang === 'ru' ? '🔥 ВСЁ ВКЛЮЧЕНО' : '🔥 ALL INCLUDED'}
                        </span>
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">
                              {plan.id.toUpperCase()} PLAN
                            </span>
                            <h3 className="text-sm font-black text-white font-mono uppercase mt-0.5">
                              {plan.name[lang]}
                            </h3>
                          </div>

                          <div className="text-2xl font-black text-amber-500 font-mono">
                            {plan.price} <span className="text-xs text-zinc-400 font-bold font-sans">USDT / {lang === 'ru' ? '45 дней' : '45 days'}</span>
                          </div>

                          <ul className="space-y-1.5 pt-2 border-t border-zinc-900/40">
                            {plan.perks[lang].map((perk, i) => (
                              <li key={i} className="text-[10px] text-zinc-400 flex items-start gap-1.5 leading-relaxed font-medium">
                                <span className="text-amber-500 mt-0.5 select-none font-bold">✓</span>
                                <span>{perk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Checkout & Payment Section */}
                {(() => {
                  const activePlan = VIP_PLANS.find(p => p.id === selectedPlanId) || VIP_PLANS[0];
                  const merchantAddress = "TRAgQoGMAThBaSxkRaYvfzLtH92Fq89DSQ";
                  return (
                    <div className="bg-[#0c0d10] border border-zinc-850 p-5 space-y-5">
                      <div className="space-y-4 w-full">
                        <div className="space-y-1">
                          <h3 className="text-xs font-black text-zinc-300 uppercase tracking-wide font-mono">
                            1. {lang === 'ru' ? 'ОТПРАВЬТЕ USDT TRC20 (СЕТЬ TRON)' : 'SEND USDT TRC20 (TRON NETWORK)'}
                          </h3>
                          <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                            {lang === 'ru'
                              ? 'Сделайте перевод точной суммы с любого удобного кошелька (Binance, Trust Wallet, Tonkeeper, HTX и т.д.) на указанный TRC20 адрес.'
                              : 'Make a transfer of the exact amount from any wallet (Binance, Trust Wallet, Tonkeeper, etc.) to the specified TRC20 wallet.'}
                          </p>
                        </div>

                        {/* Plan Details Summary */}
                        <div className="bg-zinc-950 p-3 border border-zinc-900 flex justify-between items-center text-xs">
                          <span className="font-bold text-zinc-400 font-mono uppercase">
                            {lang === 'ru' ? 'Выбранный план:' : 'Selected Plan:'} {activePlan.name[lang]}
                          </span>
                          <span className="font-black text-amber-500 font-mono text-sm">
                            {activePlan.price}.00 USDT
                          </span>
                        </div>

                        {/* Target Address Copy Box */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                            {lang === 'ru' ? 'АДРЕС ПОЛУЧАТЕЛЯ (TRC20)' : 'RECIPIENT TRC20 ADDRESS'}
                          </span>
                          <div className="flex bg-zinc-950 border border-zinc-900 p-1 rounded-sm gap-2">
                            <input
                              type="text"
                              readOnly
                              value={merchantAddress}
                              className="bg-transparent border-0 text-zinc-300 font-mono text-[11px] flex-1 px-2 select-all focus:ring-0 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(merchantAddress);
                                onToast(lang === 'ru' ? 'Адрес скопирован!' : 'Address copied!', 'success');
                              }}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black font-mono uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              <Copy size={11} className="inline mr-1" />
                              {lang === 'ru' ? 'КОПИРОВАТЬ' : 'COPY'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Verification Form Column */}
                      <div className="border-t border-zinc-900 pt-5 space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-xs font-black text-zinc-300 uppercase tracking-wide font-mono flex items-center justify-between">
                            <span>2. {lang === 'ru' ? 'ПОДТВЕРДИТЕ ТРАНЗАКЦИЮ' : 'VERIFY TRANSACTION'}</span>
                            {/* Sandbox Toggle */}
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isSandbox}
                                onChange={(e) => {
                                  setIsSandbox(e.target.checked);
                                  if (e.target.checked) {
                                    setUsdtTxId('demo_tx_' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join(''));
                                  } else {
                                    setUsdtTxId('');
                                  }
                                }}
                                className="rounded border-zinc-850 bg-zinc-900 text-amber-500 focus:ring-amber-500/20 w-3.5 h-3.5"
                              />
                              <span className="text-[10px] text-amber-500 font-mono uppercase font-black">
                                {lang === 'ru' ? 'Песочница (Тест)' : 'Sandbox Mode'}
                              </span>
                            </label>
                          </h3>
                          <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                            {lang === 'ru'
                              ? 'Вставьте хеш выполненной транзакции (TxID / Hash) в поле ниже и нажмите проверить. Система автоматически сопоставит платеж на блокчейне.'
                              : 'Paste your Transaction Hash (TxID) below and click verify. Our system will instantly fetch and validate it on the TRON ledger.'}
                          </p>
                        </div>

                        {/* TxID Input box */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            disabled={isVerifyingPayment}
                            value={usdtTxId}
                            onChange={(e) => setUsdtTxId(e.target.value)}
                            placeholder={lang === 'ru' ? "Вставьте Hash транзакции (TxID, 64 символа)..." : "Paste Transaction Hash (TxID, 64 hex chars)..."}
                            className="flex-1 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-amber-500 px-3 py-2 text-xs font-mono text-zinc-300 focus:ring-0 focus:outline-none transition-colors"
                          />
                          <button
                            onClick={handleVerifyUsdtPayment}
                            disabled={isVerifyingPayment}
                            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 font-black font-mono text-xs uppercase tracking-wider text-black cursor-pointer transition-all flex items-center justify-center gap-2"
                          >
                            {isVerifyingPayment ? (
                              <>
                                <RefreshCw size={12} className="animate-spin" />
                                <span>{lang === 'ru' ? 'ПРОВЕРКА...' : 'VERIFYING...'}</span>
                              </>
                            ) : (
                              <>
                                <Check size={13} />
                                <span>{lang === 'ru' ? 'ПРОВЕРИТЬ ОПЛАТУ' : 'VERIFY PAYMENT'}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Payment Verification Messages */}
                        <AnimatePresence mode="wait">
                          {paymentStatus === 'verifying' && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono uppercase font-bold tracking-wide flex items-center gap-2"
                            >
                              <RefreshCw size={12} className="animate-spin text-amber-400" />
                              <span>
                                {lang === 'ru'
                                  ? 'СВЯЗЫВАЕМСЯ С СЕТЬЮ TRON ДЛЯ ПРОВЕРКИ ТРАНЗАКЦИИ... ОПЕРАЦИЯ ЗАНУЛИВАЕТ ДВОЙНЫЕ ТРАТЫ.'
                                  : 'CONTACTING THE TRON MAINNET FOR VERIFICATION... AVOIDING DOUBLE-SPENDS.'}
                              </span>
                            </motion.div>
                          )}

                          {paymentStatus === 'success' && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex flex-col gap-1 text-left"
                            >
                              <div className="font-black font-mono uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                                <CheckCircle2 size={14} className="text-emerald-400" />
                                {lang === 'ru' ? 'ОПЛАТА УСПЕШНО ПОДТВЕРЖДЕНА! 🎉' : 'PAYMENT SUCCESSFULLY VERIFIED! 🎉'}
                              </div>
                              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed font-medium">
                                {lang === 'ru'
                                  ? 'Ваш VIP статус и все внутриигровые бонусы мгновенно активированы! Вы можете закрыть кабинет и наслаждаться игровым процессом с новыми правами.'
                                  : 'Your VIP status and server perks have been permanently mapped. Close your profile page to enjoy survival with your newfound privileges.'}
                              </p>
                            </motion.div>
                          )}

                          {paymentStatus === 'error' && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex flex-col gap-1 text-left"
                            >
                              <div className="font-black font-mono uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                                <AlertTriangle size={14} className="text-red-400" />
                                {lang === 'ru' ? 'ОШИБКА ПОДТВЕРЖДЕНИЯ ПЛАТЕЖА' : 'PAYMENT VERIFICATION FAILED'}
                              </div>
                              <p className="text-[10px] text-zinc-350 font-mono bg-black/30 p-2 border border-red-500/10 mt-1 leading-relaxed select-all">
                                {paymentError}
                              </p>
                              <p className="text-[9px] text-zinc-500 mt-1 font-medium leading-relaxed">
                                {lang === 'ru'
                                  ? 'Рекомендация: Проверьте правильность выбранного тарифного плана, TxID транзакции и отправленной суммы USDT TRC20.'
                                  : 'Resolution: Please review your selected subscription tier, TxID hash correctness, and sent amount.'}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })()}

                {/* DonationAlerts Alternative Section */}
                <div className="bg-gradient-to-br from-[#1a1505] to-[#0c0d10] border border-amber-500/30 p-6 space-y-5 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                    <Wallet size={120} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest font-mono flex items-center gap-2">
                      <Wallet size={16} />
                      {lang === 'ru' ? 'НЕТ КРИПТОВАЛЮТЫ? ОПЛАТА ЧЕРЕЗ DONATIONALERTS' : 'NO CRYPTO? PAY VIA DONATIONALERTS'}
                    </h3>
                    <p className="text-[10px] text-zinc-400 max-w-2xl leading-relaxed">
                      {lang === 'ru'
                        ? 'Если вы не можете оплатить в USDT, воспользуйтесь сервисом DonationAlerts. Сумма с учетом комиссии составляет 260₽. Обязательно укажите ваш ID в сообщении к донату.'
                        : 'If you cannot pay via USDT, use DonationAlerts. The total amount including fees is 3.5$. Make sure to include your ID in the donation message.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      <div className="bg-black/40 border border-zinc-800 p-4 space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">{lang === 'ru' ? 'Сумма к оплате:' : 'Amount to pay:'}</span>
                          <span className="text-amber-500 font-black">{lang === 'ru' ? '260 ₽' : '3.5$'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">{lang === 'ru' ? 'Ваш ID для доната:' : 'Your ID for donation:'}</span>
                          <span className="text-blue-400 font-black select-all">{user.uid}</span>
                        </div>
                        <a 
                          href="https://www.donationalerts.com/r/rusthub_vip" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          <ExternalLink size={14} />
                          {lang === 'ru' ? 'ПЕРЕЙТИ К ОПЛАТЕ' : 'GO TO PAYMENT'}
                        </a>
                      </div>
                      
                      <div className="flex items-start gap-2 p-3 bg-red-950/20 border border-red-500/20 rounded-sm">
                        <AlertTriangle size={16} className="text-red-500 shrink-0" />
                        <p className="text-[9px] text-zinc-400 leading-normal uppercase font-mono">
                          {lang === 'ru' 
                            ? 'ВНИМАНИЕ: ЛЮБАЯ ПОПЫТКА ОБМАНА ПРИВЕДЕТ К БЛОКИРОВКЕ И ПОЛУЧЕНИЮ ТЕГА "SCAM" В ПРОФИЛЕ НАВСЕГДА.' 
                            : 'WARNING: ANY ATTEMPT TO FRAUD WILL RESULT IN A PERMANENT "SCAM" TAG ON YOUR PROFILE AND BAN.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">
                        {lang === 'ru' ? 'ПОДАТЬ ЗАЯВКУ ПОСЛЕ ОПЛАТЫ' : 'SUBMIT APPLICATION AFTER PAYMENT'}
                      </span>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={daNickname}
                          onChange={(e) => setDaNickname(e.target.value)}
                          placeholder={lang === 'ru' ? 'Ваш никнейм в DonationAlerts...' : 'Your DonationAlerts nickname...'}
                          className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white outline-none focus:border-amber-500/50"
                        />
                        <button
                          onClick={handleDonationSubmit}
                          disabled={isSubmittingDa}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 text-black text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          {isSubmittingDa ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Save size={14} />
                          )}
                          {lang === 'ru' ? 'ОТПРАВИТЬ ЗАЯВКУ' : 'SUBMIT APPLICATION'}
                        </button>
                      </div>
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
