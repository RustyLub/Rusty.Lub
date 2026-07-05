import React, { useState, useEffect, useMemo } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc, collection, onSnapshot, deleteDoc, serverTimestamp, getDoc, setDoc, addDoc, getCountFromServer, writeBatch, query, limit, getDocs, where } from 'firebase/firestore';
import { ShieldCheck, Send, Search, Crown, Star, Ban, Trash2, Users, Settings, Megaphone, EyeOff, Tv, PlusCircle, Activity, MessageSquare, AlertTriangle, ShieldAlert, IdCard, List, BarChart3 } from 'lucide-react';
import { CustomUser, NewsItem } from '../types';
import { CUSTOM_AVATARS, getAvatarUrl } from '../customAvatars';
import UserProfileModal from './UserProfileModal';

interface AdminTabProps {
  currentUser: CustomUser | null;
  lang: 'ru' | 'en';
}

interface RegisteredUser {
  id: string; // Document ID
  username?: string;
  displayName: string;
  photoURL: string;
  avatarClass: string;
  role: string;
  isBlocked: boolean;
  isVip?: boolean;
  isChatVip?: boolean;
  vipUntil?: string;
  deletionRequested?: boolean;
  deletionRequestedAt?: string;
}

export default function AdminTab({ currentUser, lang }: AdminTabProps) {
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [announcementType, setAnnouncementType] = useState<'info' | 'hazard' | 'important'>('info');
  const [jungleFeverSpoiler, setJungleFeverSpoiler] = useState(false);
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    news: 0
  });
  
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({
    category: 'updates',
    title: { ru: '', en: '' },
    summary: { ru: '', en: '' },
    coverImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg',
    author: 'Admin',
    badge: { ru: 'Новость', en: 'News' },
    isFeatured: false,
    content: { ru: [], en: [] }
  });
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'news'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      // Sort by date descending
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setNewsItems(items);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'news');
    });
    return () => unsubscribe();
  }, []);

  const [twitchChannel, setTwitchChannel] = useState('');
  const [twitchManualLive, setTwitchManualLive] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsSummary, setNewNewsSummary] = useState('');
  const [twitchStreamTitle, setTwitchStreamTitle] = useState('');
  const [twitchClientId, setTwitchClientId] = useState('');
  const [twitchClientSecret, setTwitchClientSecret] = useState('');
  const [savingTwitch, setSavingTwitch] = useState(false);

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'admins' | 'vips' | 'banned' | 'deletions'>('all');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const isSuperAdmin = useMemo(() => {
    return currentUser?.uid === 'serustqs' || currentUser?.email === 'misterzet556@gmail.com';
  }, [currentUser]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 1024 * 1024) { // 1MB limit for Firestore doc size safety
            alert(lang === 'ru' ? 'Файл слишком большой! Максимум 1МБ.' : 'File too large! Max 1MB.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewsForm({ ...newsForm, coverImage: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleAiGenerateImage = async () => {
    setIsGeneratingImage(true);
    // Simulating AI selection of a high-quality thematic image based on category
    const categoryKeywords: Record<string, string[]> = {
        updates: ['rust-game', 'survival', 'gaming-patch', 'technical'],
        blogs: ['concept-art', 'development', 'interface', 'environment'],
        events: ['esports', 'tournament', 'celebration', 'community']
    };
    const keywords = categoryKeywords[newsForm.category || 'updates'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    const aiUrl = `https://images.unsplash.com/photo-${Date.now() % 1000000}?q=80&w=1200&auto=format&fit=crop&keywords=${randomKeyword},rust`;
    
    // Using a set of known good Rust/Survival style placeholders for instant "AI" feel
    const placeholders = [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop"
    ];
    const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    
    setTimeout(() => {
        setNewsForm({ ...newsForm, coverImage: randomPlaceholder });
        setIsGeneratingImage(false);
    }, 800);
  };

  const handleAddSection = (targetLang: 'ru' | 'en') => {
    const content = { ...newsForm.content };
    if (!content[targetLang]) content[targetLang] = [];
    content[targetLang].push({ sectionTitle: '', text: '', highlights: [] });
    setNewsForm({ ...newsForm, content });
  };

  const handleUpdateSection = (targetLang: 'ru' | 'en', index: number, field: string, value: any) => {
    const content = { ...newsForm.content };
    content[targetLang][index] = { ...content[targetLang][index], [field]: value };
    setNewsForm({ ...newsForm, content });
  };

  const handleAddHighlight = (targetLang: 'ru' | 'en', sectionIndex: number) => {
    const content = { ...newsForm.content };
    if (!content[targetLang][sectionIndex].highlights) content[targetLang][sectionIndex].highlights = [];
    content[targetLang][sectionIndex].highlights.push('');
    setNewsForm({ ...newsForm, content });
  };

  const handleUpdateHighlight = (targetLang: 'ru' | 'en', sectionIndex: number, highlightIndex: number, value: string) => {
    const content = { ...newsForm.content };
    content[targetLang][sectionIndex].highlights[highlightIndex] = value;
    setNewsForm({ ...newsForm, content });
  };

  const handleRemoveHighlight = (targetLang: 'ru' | 'en', sectionIndex: number, highlightIndex: number) => {
    const content = { ...newsForm.content };
    content[targetLang][sectionIndex].highlights.splice(highlightIndex, 1);
    setNewsForm({ ...newsForm, content });
  };

  const handleRemoveSection = (targetLang: 'ru' | 'en', index: number) => {
    const content = { ...newsForm.content };
    content[targetLang].splice(index, 1);
    setNewsForm({ ...newsForm, content });
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chat_users'), (snapshot) => {
      const users: RegisteredUser[] = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() } as RegisteredUser);
      });
      setRegisteredUsers(users);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'chat_users');
    });
    
    // Load existing settings
    const loadSettings = async () => {
      const announceSnap = await getDoc(doc(db, 'site_settings', 'announcement'));
      if (announceSnap.exists()) {
        const data = announceSnap.data();
        setAnnouncementText(data.text || '');
        setAnnouncementActive(data.active || false);
        setAnnouncementType(data.type || 'info');
      }
      
      const spoilerSnap = await getDoc(doc(db, 'site_settings', 'jungle_fever_spoiler'));
      if (spoilerSnap.exists()) {
        setJungleFeverSpoiler(!!spoilerSnap.data().jungleFeverSpoiler);
      }

      const twitchSnap = await getDoc(doc(db, 'site_settings', 'twitch'));
      if (twitchSnap.exists()) {
        const data = twitchSnap.data();
        setTwitchChannel(data.channelName || '');
        setTwitchManualLive(data.isManualLive || false);
        setTwitchStreamTitle(data.streamTitle || '');
        setTwitchClientId(data.clientId || '');
        setTwitchClientSecret(data.clientSecret || '');
      }
    };

    const fetchStats = async () => {
        try {
            const usersCount = await getCountFromServer(collection(db, 'chat_users'));
            const newsCount = await getCountFromServer(collection(db, 'news'));
            const messagesCount = await getCountFromServer(collection(db, 'messages'));
            
            setStats({
                users: usersCount.data().count,
                news: newsCount.data().count,
                messages: messagesCount.data().count
            });
        } catch (err) {
            console.error("Stats error:", err);
        }
    };

    loadSettings();
    fetchStats();
    const statsInterval = setInterval(fetchStats, 60000); // Every minute
    
    return () => {
        unsub();
        clearInterval(statsInterval);
    };
  }, []);

  const handleClearChat = async () => {
    if (!confirm(lang === 'ru' ? 'Вы уверены, что хотите очистить ВЕСЬ чат? Это действие необратимо.' : 'Are you sure you want to clear the WHOLE chat? This action is irreversible.')) return;
    
    setLoading(true);
    try {
        const q = query(collection(db, 'messages'), limit(500));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        alert(lang === 'ru' ? 'Чат очищен (первые 500 сообщений).' : 'Chat cleared (first 500 messages).');
    } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'messages');
    } finally {
        setLoading(false);
    }
  };

  const [vipManagerUserId, setVipManagerUserId] = useState<string | null>(null);

  const filteredUsers = registeredUsers.filter(u => {
    const matchesSearch = u.displayName.toLowerCase().includes(userSearch.toLowerCase()) || 
      (u.username && u.username.toLowerCase().includes(userSearch.toLowerCase())) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (userTypeFilter === 'admins') return u.role === 'admin';
    if (userTypeFilter === 'vips') return u.isVip;
    if (userTypeFilter === 'banned') return u.isBlocked;
    if (userTypeFilter === 'deletions') return !!u.deletionRequested;
    
    return true;
  });

  const handleToggleVip = (uid: string) => {
    setVipManagerUserId(prev => prev === uid ? null : uid);
  };

  const handleSetVipDuration = async (uid: string, days: number) => {
    try {
      if (days === 0) {
        await updateDoc(doc(db, 'chat_users', uid), { 
          isVip: false,
          vipUntil: ''
        });
      } else {
        const vipUntilDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        await updateDoc(doc(db, 'chat_users', uid), { 
          isVip: true,
          vipUntil: vipUntilDate
        });
      }
      setVipManagerUserId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${uid}`);
    }
  };
  const handleToggleChatVip = async (uid: string, currentChatVip: boolean) => {
    try {
      await updateDoc(doc(db, 'chat_users', uid), { isChatVip: !currentChatVip });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${uid}`);
    }
  };

  const handleToggleBlock = async (uid: string, currentBlocked: boolean) => {
    try {
      await updateDoc(doc(db, 'chat_users', uid), { isBlocked: !currentBlocked });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${uid}`);
    }
  };
  const handleToggleRole = async (uid: string, currentRole: string) => {
    try {
      await updateDoc(doc(db, 'chat_users', uid), { role: currentRole === 'admin' ? 'user' : 'admin' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${uid}`);
    }
  };
  const handleDeleteUser = async (uid: string) => {
    if (!isSuperAdmin) {
      alert(lang === 'ru' ? 'Ошибка: Только Владелец проекта может удалять профили.' : 'Error: Only the Project Owner can delete profiles.');
      return;
    }
    if (confirm(lang === 'ru' ? 'Удалить?' : 'Delete?')) {
        try {
            await deleteDoc(doc(db, 'chat_users', uid));
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `chat_users/${uid}`);
        }
    }
  };

  const handleDismissDeletionRequest = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'chat_users', uid), {
        deletionRequested: false,
        deletionRequestedAt: null
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chat_users/${uid}`);
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'site_settings', 'announcement'), {
        text: announcementText,
        active: announcementActive,
        type: announcementType,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      await fetch('/api/discord/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `📢 Global Announcement: ${announcementText}` 
        })
      });
      alert('Announcement updated!');
    } catch (e) {
      console.error(e);
      alert('Failed to update announcement');
    }
    setLoading(false);
  };

  const handleToggleSpoiler = async () => {
    setJungleFeverSpoiler(!jungleFeverSpoiler);
    await setDoc(doc(db, 'site_settings', 'jungle_fever_spoiler'), {
        jungleFeverSpoiler: !jungleFeverSpoiler
    }, { merge: true });
  }

  const handleSaveTwitchSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert(lang === 'ru' ? 'Ошибка: У вас нет прав для изменения настроек Twitch.' : 'Error: You do not have permissions to modify Twitch settings.');
      return;
    }
    setSavingTwitch(true);
    try {
      await setDoc(doc(db, 'site_settings', 'twitch'), {
        channelName: twitchChannel.trim(),
        isManualLive: twitchManualLive,
        streamTitle: twitchStreamTitle,
        clientId: twitchClientId.trim(),
        clientSecret: twitchClientSecret.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert('Twitch settings updated!');
    } catch (e) {
      console.error(e);
      alert('Failed to update Twitch settings');
    }
    setSavingTwitch(false);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm(lang === 'ru' ? 'Удалить эту новость?' : 'Delete this news?')) return;
    try {
        await deleteDoc(doc(db, 'news', id));
    } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `news/${id}`);
    }
  }

  const handleEditNews = (news: NewsItem) => {
    setEditingNewsId(news.id);
    setNewsForm({ ...news });
  }

  const handleCancelEdit = () => {
    setEditingNewsId(null);
    setNewsForm({
        category: 'updates',
        title: { ru: '', en: '' },
        summary: { ru: '', en: '' },
        coverImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg',
        author: 'Admin',
        badge: { ru: 'Новость', en: 'News' },
        isFeatured: false,
        content: { ru: [], en: [] }
    });
  }

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const data = {
            ...newsForm,
            date: editingNewsId ? newsForm.date : new Date().toISOString(),
            updatedAt: serverTimestamp()
        };

        if (editingNewsId) {
            await updateDoc(doc(db, 'news', editingNewsId), data);
        } else {
            await addDoc(collection(db, 'news'), data);
        }
        handleCancelEdit();
    } catch (err) {
        handleFirestoreError(err, editingNewsId ? OperationType.UPDATE : OperationType.CREATE, 'news');
    }
  }

  if (currentUser?.uid !== 'serustqs' && currentUser?.email !== 'misterzet556@gmail.com' && currentUser?.role !== 'admin') {
    return <div className="p-8 text-center text-red-500 font-mono">ACCESS DENIED</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#2a2f3b] pb-8">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter uppercase italic">
            <ShieldCheck size={40} className="text-[#cd412b]" />
            Control Center
          </h2>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            RustHub System Infrastructure · v2.4.0
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleClearChat}
            disabled={loading}
            className="px-6 py-2.5 bg-red-600/10 border border-red-500/30 text-red-500 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-red-600/20 transition-all flex items-center gap-2 rounded-sm disabled:opacity-50"
          >
            <Trash2 size={14} />
            {lang === 'ru' ? 'ОЧИСТИТЬ ЧАТ' : 'CLEAR CHAT'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#14171e] border border-[#2a2f3b] p-8 rounded-sm shadow-2xl flex items-center gap-8 group hover:border-blue-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={80} />
            </div>
            <div className="p-5 bg-blue-500/10 rounded-sm text-blue-500 group-hover:scale-110 transition-transform duration-500">
                <Users size={32} />
            </div>
            <div>
                <div className="text-4xl font-black text-white font-mono tracking-tighter mb-1">{stats.users.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{lang === 'ru' ? 'Выживших зарегистрировано' : 'Total Survivors'}</div>
            </div>
        </div>
        <div className="bg-[#14171e] border border-[#2a2f3b] p-8 rounded-sm shadow-2xl flex items-center gap-8 group hover:border-emerald-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquare size={80} />
            </div>
            <div className="p-5 bg-emerald-500/10 rounded-sm text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                <MessageSquare size={32} />
            </div>
            <div>
                <div className="text-4xl font-black text-white font-mono tracking-tighter mb-1">{stats.messages.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{lang === 'ru' ? 'Перехвачено сообщений' : 'Communications Logged'}</div>
            </div>
        </div>
        <div className="bg-[#14171e] border border-[#2a2f3b] p-8 rounded-sm shadow-2xl flex items-center gap-8 group hover:border-purple-500/30 transition-all relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Megaphone size={80} />
            </div>
            <div className="p-5 bg-purple-500/10 rounded-sm text-purple-500 group-hover:scale-110 transition-transform duration-500">
                <Megaphone size={32} />
            </div>
            <div>
                <div className="text-4xl font-black text-white font-mono tracking-tighter mb-1">{stats.news.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{lang === 'ru' ? 'Новостных сводок' : 'Intelligence Briefings'}</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Global Settings */}
        <div className="space-y-6">
            {/* Announcement Controller */}
            <form onSubmit={handleSaveSiteSettings} className="bg-[#14171e] border border-[#2a2f3b] p-6 rounded-sm shadow-xl space-y-4">
                <h3 className="text-md font-bold text-gray-200 flex items-center gap-2">
                    <Megaphone size={18} className="text-[#cd412b]" />
                    {lang === 'ru' ? 'Оповещение' : 'Announcement'}
                </h3>
                <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-black/40 border border-zinc-800 p-3 text-sm font-mono text-white rounded-sm"
                placeholder={lang === 'ru' ? 'Текст объявления...' : 'Announcement text...'}
                rows={3}
                />
                <div className="flex flex-wrap gap-2">
                {(['info', 'hazard', 'important'] as const).map(type => (
                    <button
                    key={type}
                    type="button"
                    onClick={() => setAnnouncementType(type)}
                    className={`px-3 py-1 text-[10px] font-mono border ${announcementType === type ? 'bg-[#cd412b] border-[#cd412b]' : 'bg-black/40 border-zinc-800'}`}
                    >
                    {type.toUpperCase()}
                    </button>
                ))}
                <label className="flex items-center gap-2 text-xs text-white bg-black/40 border border-zinc-800 px-3 py-1">
                    <input type="checkbox" checked={announcementActive} onChange={e => setAnnouncementActive(e.target.checked)} />
                    Active
                </label>
                </div>
                <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-[#cd412b] text-white text-xs font-bold uppercase tracking-widest font-mono cursor-pointer hover:bg-red-700 transition">
                    {lang === 'ru' ? 'Сохранить настройки сайта' : 'Save Site Settings'}
                </button>
            </form>

            {/* Spoiler Controller */}
            <div className="bg-[#14171e] border border-[#2a2f3b] p-6 rounded-sm shadow-xl flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <EyeOff size={20} className="text-emerald-500" />
                    <h3 className="text-md font-bold text-gray-200">{lang === 'ru' ? 'Спойлер "Jungle Fever"' : 'Jungle Fever Spoiler'}</h3>
                </div>
                <button
                    onClick={handleToggleSpoiler}
                    className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase border cursor-pointer transition-colors ${
                        jungleFeverSpoiler 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                            : 'bg-red-500/10 border-red-500/40 text-red-400'
                    }`}
                >
                    {jungleFeverSpoiler ? (lang === 'ru' ? 'Включен' : 'Enabled') : (lang === 'ru' ? 'Отключен' : 'Disabled')}
                </button>
            </div>
        </div>

        {/* User Management */}
        <div className="lg:col-span-2 bg-[#14171e] border border-[#2a2f3b] p-6 rounded-sm shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2f3b]/60 pb-4">
                <div className="space-y-1">
                    <h3 className="text-md font-bold text-gray-200 flex items-center gap-2">
                        <Users size={18} className="text-blue-500" />
                        {lang === 'ru' ? 'Управление пользователями' : 'User Management'}
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                        {lang === 'ru' ? 'Поиск, назначение прав и управление подписками' : 'Search, assign roles, and manage active VIP subscriptions'}
                    </p>
                </div>
                <div className="text-[10px] font-mono text-gray-400 bg-black/40 border border-[#2a2f3b] px-3 py-1.5 rounded self-start sm:self-center">
                    {lang === 'ru' ? 'Всего зарегистрировано' : 'Total Registered'}: <span className="text-blue-400 font-bold">{registeredUsers.length}</span>
                </div>
            </div>

            {/* Practical Search and Filter Bar */}
            <div className="flex flex-col gap-3">
                <div className="relative w-full">
                    <Search size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                    <input
                        type="text"
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        placeholder={lang === 'ru' ? 'Поиск по имени, ID или @username...' : 'Search by name, ID, or @username...'}
                        className="w-full bg-black/30 border border-[#2a2f3b] rounded-sm py-2.5 pl-11 pr-4 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>

                {/* Segmented Filter Buttons */}
                <div className="flex flex-wrap gap-1 bg-black/20 p-1 rounded-sm border border-zinc-900">
                    {(['all', 'vips', 'admins', 'banned', 'deletions'] as const).map((filter) => {
                        const labelMap = {
                            all: lang === 'ru' ? 'Все' : 'All',
                            vips: lang === 'ru' ? 'VIP-Подписчики' : 'VIP Subs',
                            admins: lang === 'ru' ? 'Администраторы' : 'Admins',
                            banned: lang === 'ru' ? 'Забаненные' : 'Banned',
                            deletions: lang === 'ru' ? 'Заявки на удаление' : 'Deletions'
                        };
                        const countMap = {
                            all: registeredUsers.length,
                            vips: registeredUsers.filter(u => u.isVip).length,
                            admins: registeredUsers.filter(u => u.role === 'admin').length,
                            banned: registeredUsers.filter(u => u.isBlocked).length,
                            deletions: registeredUsers.filter(u => u.deletionRequested).length
                        };
                        const isActive = userTypeFilter === filter;
                        return (
                            <button
                                key={filter}
                                onClick={() => setUserTypeFilter(filter)}
                                className={`flex-1 min-w-[80px] py-1.5 px-3 text-[10px] font-mono font-bold uppercase transition rounded-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isActive 
                                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <span>{labelMap[filter]}</span>
                                <span className={`px-1 rounded-full text-[8px] ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {countMap[filter]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Users Scroll Container */}
            <div className="border border-[#2a2f3b] bg-black/10 divide-y divide-[#2a2f3b]/60 overflow-y-auto max-h-[500px] rounded-sm custom-scrollbar">
                {filteredUsers.length > 0 ? filteredUsers.map((rUser) => (
                    <div key={rUser.id} className="p-4 hover:bg-white/[0.02] transition space-y-3">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                            {/* User Profile Info */}
                            <div className="flex items-start sm:items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                    <img 
                                        referrerPolicy="no-referrer" 
                                        src={getAvatarUrl(rUser.photoURL, rUser.avatarClass)} 
                                        className="w-11 h-11 rounded-full border border-zinc-700/80 bg-zinc-950 object-cover" 
                                    />
                                    {rUser.isBlocked && (
                                        <span className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-1 border border-[#14171e] shadow-lg">
                                            <Ban size={10} />
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="font-bold text-zinc-200 text-sm truncate max-w-[180px]">
                                            {rUser.displayName}
                                        </span>
                                        {rUser.role === 'admin' ? (
                                            <span className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[8px] font-bold rounded font-mono uppercase tracking-wider">ADMIN</span>
                                        ) : (
                                            <span className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 text-[8px] font-bold rounded font-mono uppercase tracking-wider">USER</span>
                                        )}
                                        {rUser.isBlocked && (
                                            <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/30 text-red-500 text-[8px] font-bold rounded font-mono uppercase tracking-wider">{lang === 'ru' ? 'БАН' : 'BANNED'}</span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 font-mono flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <span>ID: <span className="text-zinc-400 select-all">{rUser.id}</span></span>
                                        {rUser.username && <span className="text-blue-400/80">@{rUser.username}</span>}
                                    </div>
                                    
                                    {/* Badges indicators */}
                                    <div className="flex flex-wrap gap-1">
                                        {rUser.isChatVip && (
                                            <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[8px] font-bold rounded uppercase tracking-wider">CHAT VIP</span>
                                        )}
                                        {rUser.isVip && (
                                            <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[8px] font-bold rounded uppercase tracking-wider">
                                                VIP SUB {rUser.vipUntil && `(${lang === 'ru' ? 'до' : 'until'}: ${new Date(rUser.vipUntil).toLocaleDateString()})`}
                                            </span>
                                        )}
                                        {rUser.deletionRequested && (
                                            <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/50 text-red-400 text-[8px] font-black rounded uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                                <AlertTriangle size={8} />
                                                {lang === 'ru' ? 'ЗАПРОС НА УДАЛЕНИЕ' : 'DELETION REQUEST'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* User Actions Grid */}
                            <div className="flex flex-wrap items-center gap-1.5 xl:justify-end">
                                {/* Chat VIP */}
                                <button 
                                    onClick={() => handleToggleChatVip(rUser.id, !!rUser.isChatVip)} 
                                    className={`px-2.5 py-1.5 border text-[9px] font-mono font-bold rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${rUser.isChatVip ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-zinc-800 text-zinc-500 bg-black/20 hover:border-zinc-700 hover:text-zinc-300'}`} 
                                    title={lang === 'ru' ? 'Выдать/Снять VIP Чат' : 'Toggle Chat VIP'}
                                >
                                    <Star size={11} />
                                    <span>{lang === 'ru' ? 'Чат VIP' : 'Chat VIP'}</span>
                                </button>

                                {/* VIP Subscription */}
                                <button 
                                    onClick={() => handleToggleVip(rUser.id)} 
                                    className={`px-2.5 py-1.5 border text-[9px] font-mono font-bold rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${vipManagerUserId === rUser.id ? 'border-amber-400 bg-amber-400/20 text-amber-300' : (rUser.isVip ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-zinc-800 text-zinc-500 bg-black/20 hover:border-zinc-700 hover:text-zinc-300')}`} 
                                    title={lang === 'ru' ? 'Управление VIP Подпиской' : 'Manage VIP Subscription'}
                                >
                                    <Crown size={11} />
                                    <span>{lang === 'ru' ? 'VIP Подписка' : 'VIP Sub'}</span>
                                </button>

                                {/* Block */}
                                <button 
                                    onClick={() => handleToggleBlock(rUser.id, !!rUser.isBlocked)} 
                                    className={`px-2.5 py-1.5 border text-[9px] font-mono font-bold rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${rUser.isBlocked ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-zinc-800 text-zinc-500 bg-black/20 hover:border-zinc-700 hover:text-red-400'}`} 
                                    title={rUser.isBlocked ? (lang === 'ru' ? 'Разблокировать' : 'Unblock') : (lang === 'ru' ? 'Заблокировать' : 'Block')}
                                >
                                    <Ban size={11} />
                                    <span>{rUser.isBlocked ? (lang === 'ru' ? 'Разбанить' : 'Unban') : (lang === 'ru' ? 'Бан' : 'Ban')}</span>
                                </button>

                                {/* Toggle Role */}
                                <button 
                                    onClick={() => handleToggleRole(rUser.id, rUser.role)} 
                                    className={`px-2.5 py-1.5 border text-[9px] font-mono font-bold rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${rUser.role === 'admin' ? 'border-purple-500 text-purple-400 bg-purple-500/10 font-black' : 'border-zinc-800 text-zinc-500 bg-black/20 hover:border-zinc-700 hover:text-zinc-300'}`} 
                                    title={lang === 'ru' ? 'Сменить Роль' : 'Toggle Role'}
                                >
                                    <ShieldAlert size={11} />
                                    <span>{rUser.role === 'admin' ? (lang === 'ru' ? 'Админ' : 'Admin') : (lang === 'ru' ? 'Юзер' : 'User')}</span>
                                </button>

                                {/* Card Inspector */}
                                <button 
                                    onClick={() => setInspectUserId(rUser.id)} 
                                    className="px-2.5 py-1.5 border border-zinc-800 text-zinc-500 bg-black/20 hover:text-emerald-500 hover:border-emerald-500/40 rounded-sm text-[9px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer" 
                                    title={lang === 'ru' ? 'Посмотреть Визитку' : 'Inspect Profile Card'}
                                >
                                    <IdCard size={11} />
                                    <span>{lang === 'ru' ? 'Визитка' : 'Card'}</span>
                                </button>

                                {/* Delete User Profile (Restricted to Owner/SuperAdmin but visible and has alert if non-owner) */}
                                <button 
                                    onClick={() => isSuperAdmin ? handleDeleteUser(rUser.id) : alert(lang === 'ru' ? 'Доступ ограничен: Удалять профили может только Владелец проекта.' : 'Access Denied: Only the Project Owner can delete profiles.')} 
                                    className={`px-2.5 py-1.5 border text-[9px] font-mono font-bold rounded-sm transition flex items-center gap-1.5 cursor-pointer ${
                                        !isSuperAdmin 
                                            ? 'border-zinc-800/45 text-zinc-600 bg-zinc-950/10 hover:text-amber-500 hover:border-amber-500/40' 
                                            : 'border-zinc-800 text-zinc-500 bg-black/20 hover:text-red-500 hover:border-red-500/50'
                                    }`} 
                                    title={lang === 'ru' ? 'Удалить профиль' : 'Delete Profile'}
                                >
                                    <Trash2 size={11} />
                                    <span>{lang === 'ru' ? 'Удалить' : 'Delete'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Inline VIP duration management panel */}
                        {vipManagerUserId === rUser.id && (
                            <div className="bg-black/45 border border-amber-500/20 p-3.5 rounded-sm space-y-2.5 animate-in slide-in-from-top-1 duration-200">
                                <div className="text-[9px] font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center gap-1.5">
                                    <Crown size={12} />
                                    <span>{lang === 'ru' ? 'Управление подпиской VIP' : 'Manage VIP Subscription'}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button 
                                        onClick={() => handleSetVipDuration(rUser.id, 45)}
                                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase transition cursor-pointer"
                                    >
                                        {lang === 'ru' ? '45 дней подписки' : '45 Days VIP'}
                                    </button>
                                    <button 
                                        onClick={() => handleSetVipDuration(rUser.id, 9999)}
                                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase transition cursor-pointer"
                                    >
                                        {lang === 'ru' ? 'Навсегда (Forever)' : 'Lifetime'}
                                    </button>
                                    <button 
                                        onClick={() => handleSetVipDuration(rUser.id, 0)}
                                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-mono font-bold uppercase transition cursor-pointer"
                                    >
                                        {lang === 'ru' ? 'Снять VIP подписку' : 'Remove VIP'}
                                    </button>
                                    <button 
                                        onClick={() => setVipManagerUserId(null)}
                                        className="px-3 py-1.5 bg-zinc-850 hover:bg-zinc-800 text-gray-400 text-[9px] font-mono font-bold uppercase transition ml-auto cursor-pointer"
                                    >
                                        {lang === 'ru' ? 'Отмена' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Deletion Request Action Panel */}
                        {rUser.deletionRequested && (
                            <div className="bg-red-950/10 border border-red-500/20 p-3.5 rounded-sm space-y-2.5 animate-in slide-in-from-top-1 duration-200 mt-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <AlertTriangle size={12} className="text-red-500" />
                                            {lang === 'ru' ? 'АКТИВНЫЙ ЗАПРОС НА УДАЛЕНИЕ АККАУНТА' : 'ACTIVE PROFILE DELETION REQUEST'}
                                        </span>
                                        {rUser.deletionRequestedAt && (
                                            <span className="block text-[8px] font-mono text-zinc-500">
                                                {lang === 'ru' ? 'Инициировано' : 'Requested at'}: {new Date(rUser.deletionRequestedAt).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleDismissDeletionRequest(rUser.id)}
                                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white text-[9px] font-mono font-bold uppercase transition rounded-sm cursor-pointer"
                                        >
                                            {lang === 'ru' ? 'ОТКЛОНИТЬ' : 'DISMISS REQUEST'}
                                        </button>
                                        <button
                                            onClick={() => isSuperAdmin ? handleDeleteUser(rUser.id) : alert(lang === 'ru' ? 'Доступ ограничен: Удалять профили может только Владелец проекта.' : 'Access Denied: Only the Project Owner can delete profiles.')}
                                            className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-500 hover:text-white text-[9px] font-mono font-bold uppercase transition rounded-sm cursor-pointer"
                                        >
                                            {lang === 'ru' ? 'ПОДТВЕРДИТЬ УДАЛЕНИЕ' : 'APPROVE DELETION'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="p-12 text-center text-zinc-600 font-mono text-xs uppercase space-y-2">
                        <Users size={32} className="mx-auto text-zinc-800" />
                        <div>{lang === 'ru' ? 'Пользователи не найдены' : 'No survivors found'}</div>
                    </div>
                )}
            </div>
        </div>

        {/* News Management */}
        <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* News Form */}
                <div className="xl:col-span-2 bg-[#14171e] border border-[#2a2f3b] p-6 rounded-sm shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-md font-bold text-gray-200 flex items-center gap-2">
                            <Megaphone size={18} className="text-blue-500" />
                            {editingNewsId 
                                ? (lang === 'ru' ? 'Редактировать новость' : 'Edit News')
                                : (lang === 'ru' ? 'Добавить новость' : 'Add News')}
                        </h3>
                        {editingNewsId && (
                            <button 
                                onClick={handleCancelEdit}
                                className="text-[10px] font-mono text-zinc-500 hover:text-white transition uppercase"
                            >
                                {lang === 'ru' ? '[ Отмена ]' : '[ Cancel ]'}
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSaveNews} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* RU Title/Summary */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Russian Version</label>
                                <input 
                                    type="text" 
                                    value={newsForm.title?.ru} 
                                    onChange={e => setNewsForm({...newsForm, title: {...newsForm.title!, ru: e.target.value}})} 
                                    placeholder="Заголовок (RU)" 
                                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-blue-500/50 outline-none transition" 
                                    required
                                />
                                <textarea 
                                    value={newsForm.summary?.ru} 
                                    onChange={e => setNewsForm({...newsForm, summary: {...newsForm.summary!, ru: e.target.value}})} 
                                    placeholder="Краткое описание (RU)" 
                                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-blue-500/50 outline-none transition h-20" 
                                    required
                                />
                                <input 
                                    type="text" 
                                    value={newsForm.badge?.ru} 
                                    onChange={e => setNewsForm({...newsForm, badge: {...newsForm.badge!, ru: e.target.value}})} 
                                    placeholder="Бейдж (RU, напр: Обновление)" 
                                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm" 
                                />
                            </div>

                            {/* EN Title/Summary */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">English Version</label>
                                <input 
                                    type="text" 
                                    value={newsForm.title?.en} 
                                    onChange={e => setNewsForm({...newsForm, title: {...newsForm.title!, en: e.target.value}})} 
                                    placeholder="Title (EN)" 
                                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-blue-500/50 outline-none transition" 
                                    required
                                />
                                <textarea 
                                    value={newsForm.summary?.en} 
                                    onChange={e => setNewsForm({...newsForm, summary: {...newsForm.summary!, en: e.target.value}})} 
                                    placeholder="Summary (EN)" 
                                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-blue-500/50 outline-none transition h-20" 
                                    required
                                />
                                <input 
                                    type="text" 
                                    value={newsForm.badge?.en} 
                                    onChange={e => setNewsForm({...newsForm, badge: {...newsForm.badge!, en: e.target.value}})} 
                                    placeholder="Badge (EN, e.g: Update)" 
                                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#2a2f3b]">
                            {/* Settings */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Category</label>
                                    <select 
                                        value={newsForm.category} 
                                        onChange={e => setNewsForm({...newsForm, category: e.target.value as any})}
                                        className="w-full bg-black/40 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm"
                                    >
                                        <option value="updates">Updates</option>
                                        <option value="blogs">Blogs</option>
                                        <option value="events">Events</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Author</label>
                                    <input 
                                        type="text" 
                                        value={newsForm.author} 
                                        onChange={e => setNewsForm({...newsForm, author: e.target.value})} 
                                        className="w-full bg-black/40 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm" 
                                    />
                                </div>
                                <label className="flex items-center gap-2 text-xs text-white bg-black/20 p-2 rounded-sm border border-zinc-800/50 cursor-pointer hover:bg-black/40 transition">
                                    <input 
                                        type="checkbox" 
                                        checked={newsForm.isFeatured} 
                                        onChange={e => setNewsForm({...newsForm, isFeatured: e.target.checked})} 
                                    />
                                    <span className="font-mono text-[10px] uppercase">Featured Post</span>
                                </label>
                            </div>

                            {/* Image Selection */}
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Cover Image</label>
                                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            value={newsForm.coverImage} 
                                            onChange={e => setNewsForm({...newsForm, coverImage: e.target.value})} 
                                            placeholder="https://..." 
                                            className="flex-1 bg-black/40 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm focus:border-blue-500/30 outline-none" 
                                        />
                                        <div className="flex gap-2">
                                            <label className="px-3 py-2 bg-[#2a2f3b] text-white text-[10px] font-mono uppercase cursor-pointer hover:bg-[#3a3f4b] transition flex items-center gap-2 border border-white/5 rounded-sm whitespace-nowrap">
                                                <PlusCircle size={14} />
                                                {lang === 'ru' ? 'Загрузить' : 'Upload'}
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                            </label>
                                            <button 
                                                type="button"
                                                onClick={handleAiGenerateImage}
                                                disabled={isGeneratingImage}
                                                className="px-3 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-400 text-[10px] font-mono uppercase hover:from-purple-600/30 hover:to-blue-600/30 transition flex items-center gap-2 rounded-sm disabled:opacity-50"
                                            >
                                                {isGeneratingImage ? '...' : 'AI GEN'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative aspect-video rounded-sm overflow-hidden border border-zinc-800 bg-black/40 group">
                                    {newsForm.coverImage ? (
                                        <img referrerPolicy="no-referrer" src={newsForm.coverImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-zinc-600">NO IMAGE PREVIEW</div>
                                    )}
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 text-[8px] font-mono text-white/50 border border-white/10">PREVIEW</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-[#2a2f3b]">
                            <h4 className="text-xs font-bold text-gray-400 font-mono uppercase tracking-widest">{lang === 'ru' ? 'Секции контента' : 'Content Sections'}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* RU Content */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase">RU Sections</span>
                                        <button type="button" onClick={() => handleAddSection('ru')} className="text-[10px] font-mono text-blue-400 hover:text-blue-300 transition">+ ADD SECTION</button>
                                    </div>
                                    {newsForm.content?.ru?.map((sec, idx) => (
                                        <div key={idx} className="p-3 bg-black/30 border border-zinc-800 rounded-sm space-y-3 relative group">
                                            <button type="button" onClick={() => handleRemoveSection('ru', idx)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-red-500"><Trash2 size={12} /></button>
                                            <input 
                                                type="text" 
                                                value={sec.sectionTitle} 
                                                onChange={e => handleUpdateSection('ru', idx, 'sectionTitle', e.target.value)} 
                                                placeholder="Название раздела (RU)" 
                                                className="w-full bg-black/40 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm" 
                                            />
                                            <textarea 
                                                value={sec.text} 
                                                onChange={e => handleUpdateSection('ru', idx, 'text', e.target.value)} 
                                                placeholder="Текст раздела (RU)" 
                                                className="w-full bg-black/40 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm h-20" 
                                            />
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">Highlights (RU)</span>
                                                    <button type="button" onClick={() => handleAddHighlight('ru', idx)} className="text-[8px] font-mono text-blue-500 hover:text-blue-400 transition">+ ADD</button>
                                                </div>
                                                {sec.highlights?.map((h, hIdx) => (
                                                    <div key={hIdx} className="flex gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={h} 
                                                            onChange={e => handleUpdateHighlight('ru', idx, hIdx, e.target.value)} 
                                                            className="flex-1 bg-black/20 border border-zinc-800 p-1.5 text-[10px] font-mono text-zinc-300 rounded-sm"
                                                            placeholder="Highlight text or link..."
                                                        />
                                                        <button type="button" onClick={() => handleRemoveHighlight('ru', idx, hIdx)} className="text-zinc-600 hover:text-red-500 transition"><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* EN Content */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase">EN Sections</span>
                                        <button type="button" onClick={() => handleAddSection('en')} className="text-[10px] font-mono text-blue-400 hover:text-blue-300 transition">+ ADD SECTION</button>
                                    </div>
                                    {newsForm.content?.en?.map((sec, idx) => (
                                        <div key={idx} className="p-3 bg-black/30 border border-zinc-800 rounded-sm space-y-3 relative group">
                                            <button type="button" onClick={() => handleRemoveSection('en', idx)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-red-500"><Trash2 size={12} /></button>
                                            <input 
                                                type="text" 
                                                value={sec.sectionTitle} 
                                                onChange={e => handleUpdateSection('en', idx, 'sectionTitle', e.target.value)} 
                                                placeholder="Section Title (EN)" 
                                                className="w-full bg-black/40 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm" 
                                            />
                                            <textarea 
                                                value={sec.text} 
                                                onChange={e => handleUpdateSection('en', idx, 'text', e.target.value)} 
                                                placeholder="Section Text (EN)" 
                                                className="w-full bg-black/40 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm h-20" 
                                            />
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">Highlights (EN)</span>
                                                    <button type="button" onClick={() => handleAddHighlight('en', idx)} className="text-[8px] font-mono text-blue-500 hover:text-blue-400 transition">+ ADD</button>
                                                </div>
                                                {sec.highlights?.map((h, hIdx) => (
                                                    <div key={hIdx} className="flex gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={h} 
                                                            onChange={e => handleUpdateHighlight('en', idx, hIdx, e.target.value)} 
                                                            className="flex-1 bg-black/20 border border-zinc-800 p-1.5 text-[10px] font-mono text-zinc-300 rounded-sm"
                                                            placeholder="Highlight text or link..."
                                                        />
                                                        <button type="button" onClick={() => handleRemoveHighlight('en', idx, hIdx)} className="text-zinc-600 hover:text-red-500 transition"><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest font-mono cursor-pointer hover:bg-blue-700 transition flex items-center justify-center gap-2">
                            {editingNewsId ? <Settings size={14} /> : <PlusCircle size={14} />}
                            {editingNewsId 
                                ? (lang === 'ru' ? 'Сохранить изменения' : 'Save Changes')
                                : (lang === 'ru' ? 'Опубликовать новость' : 'Publish News')}
                        </button>
                    </form>
                </div>

                {/* News List */}
                <div className="bg-[#14171e] border border-[#2a2f3b] p-6 rounded-sm shadow-xl flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-bold text-gray-200">
                            {lang === 'ru' ? 'Список новостей' : 'News List'}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500">{newsItems.length} items</span>
                    </div>
                    <div className="flex-1 border border-[#2a2f3b] bg-black/20 divide-y divide-[#2a2f3b] overflow-y-auto max-h-[650px] rounded-sm custom-scrollbar">
                    {newsItems.length > 0 ? newsItems.map((news) => (
                        <div key={news.id} className={`p-4 flex flex-col gap-3 group transition-colors ${editingNewsId === news.id ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : 'hover:bg-white/5'}`}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 overflow-hidden">
                                    <div className="font-bold text-gray-200 text-xs truncate">{news.title[lang]}</div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-sm border ${
                                            news.category === 'updates' ? 'border-blue-500/30 text-blue-400 bg-blue-400/5' :
                                            news.category === 'blogs' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-400/5' :
                                            'border-amber-500/30 text-amber-400 bg-amber-400/5'
                                        }`}>
                                            {news.category}
                                        </span>
                                        <span className="text-[8px] font-mono text-zinc-500">
                                            {new Date(news.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEditNews(news)} 
                                        className="p-1.5 border border-zinc-700 text-zinc-400 hover:text-blue-500 hover:border-blue-500 transition rounded-sm"
                                        title="Edit"
                                    >
                                        <Settings size={12} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteNews(news.id)} 
                                        className="p-1.5 border border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-500 transition rounded-sm"
                                        title="Delete"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-zinc-600 font-mono text-[10px]">EMPTY_LIST</div>
                    )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Twitch Settings */}
      <form onSubmit={handleSaveTwitchSettings} className="bg-[#14171e] border border-[#2a2f3b] p-6 rounded-sm shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-md font-bold text-gray-200 flex items-center gap-2">
                <Tv size={18} className="text-purple-500" />
                {lang === 'ru' ? 'Настройки Twitch' : 'Twitch Settings'}
            </h3>
            {!isSuperAdmin && (
                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-mono font-bold rounded uppercase">
                    {lang === 'ru' ? 'Только для чтения' : 'Read-only access'}
                </span>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" disabled={!isSuperAdmin} value={twitchChannel} onChange={e => setTwitchChannel(e.target.value)} placeholder="Channel Name" className="bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm disabled:opacity-55 disabled:cursor-not-allowed" />
            <input type="text" disabled={!isSuperAdmin} value={twitchStreamTitle} onChange={e => setTwitchStreamTitle(e.target.value)} placeholder="Stream Title" className="bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm disabled:opacity-55 disabled:cursor-not-allowed" />
            <input type="text" disabled={!isSuperAdmin} value={twitchClientId} onChange={e => setTwitchClientId(e.target.value)} placeholder="Client ID" className="bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm disabled:opacity-55 disabled:cursor-not-allowed" />
            <input type="text" disabled={!isSuperAdmin} value={twitchClientSecret} onChange={e => setTwitchClientSecret(e.target.value)} placeholder="Client Secret" className="bg-black/40 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm disabled:opacity-55 disabled:cursor-not-allowed" />
        </div>
        <label className={`flex items-center gap-2 text-xs text-white bg-black/40 border border-zinc-800 px-3 py-2 rounded-sm w-fit ${!isSuperAdmin ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}>
            <input type="checkbox" disabled={!isSuperAdmin} checked={twitchManualLive} onChange={e => setTwitchManualLive(e.target.checked)} />
            Manual Live
        </label>
        <button type="submit" disabled={savingTwitch || !isSuperAdmin} className={`px-4 py-2 text-white text-xs font-bold uppercase tracking-widest font-mono rounded-sm transition ${!isSuperAdmin ? 'bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed opacity-50' : 'bg-purple-600/80 hover:bg-purple-700 cursor-pointer'}`}>
            {lang === 'ru' ? 'Сохранить настройки Twitch' : 'Save Twitch Settings'}
        </button>
      </form>

      {/* User Profile Inspector Modal */}
      {inspectUserId && (
        <UserProfileModal
          isOpen={!!inspectUserId}
          onClose={() => setInspectUserId(null)}
          targetUserId={inspectUserId}
          currentUser={currentUser}
          lang={lang}
          onToast={(msg) => console.log(msg)}
        />
      )}
    </div>
  );
}
