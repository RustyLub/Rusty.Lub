import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  MessageSquare, 
  Send, 
  Clock, 
  Plus, 
  Search,
  Flame,
  Star,
  Trash2,
  Gamepad2
} from 'lucide-react';
import { 
  db, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  where,
  onSnapshot
} from '../firebase';
import { logUserActivity } from '../services/activityLogger';
import { getAvatarUrl } from '../customAvatars';

interface ClanBoardTabProps {
  lang: 'ru' | 'en';
  user: any;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onOpenAuth: () => void;
}

export interface ClanPost {
  id: string;
  type: 'clan_recruit' | 'player_lfg'; // 'clan_recruit' = Сбор в клан, 'player_lfg' = Поиск тиммейта или клана
  title: string;
  clanName?: string;
  authorName: string;
  authorId: string;
  authorAvatar?: string;
  authorVip?: boolean;
  hours: number;
  serverType: string;
  teamSize?: string;
  rolesNeeded?: string[];
  primeTime?: string;
  ageMin?: number;
  description: string;
  discord: string;
  createdAt: any;
  status: 'open' | 'closed';
  pinned?: boolean;
  commentsCount?: number;
  likesCount?: number;
  likedBy?: string[];
}

export interface ClanComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorVip?: boolean;
  content: string;
  createdAt: any;
  likes?: number;
}

export interface ClanTicket {
  id: string;
  postId: string;
  postTitle: string;
  postAuthorId: string;
  applicantName: string;
  applicantId: string;
  applicantAvatar?: string;
  applicantHours: number;
  applicantAge?: number;
  applicantRoles?: string[];
  discord: string;
  message: string;
  createdAt: any;
  status: 'pending' | 'accepted' | 'rejected';
  responseNote?: string;
}

const PRESET_ROLES = [
  'PvP Стрелок',
  'Строитель (Builder)',
  'Фармер (Farmer)',
  'Электрик / Авт.',
  'Пилот (Коптер)',
  'Рейд-Лидер',
  'Всеядный (Универсал)'
];

const SERVER_TYPES = [
  'Vanilla Official',
  'Vanilla 2x',
  'Solo / Duo / Trio 2x',
  'Modded 3x-5x',
  'PvE / Roleplay',
  'Любой сервер'
];

export default function ClanBoardTab({ lang, user, onToast, onOpenAuth }: ClanBoardTabProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'clan_recruit' | 'player_lfg' | 'my_posts' | 'bookmarks'>('all');
  const [posts, setPosts] = useState<ClanPost[]>([]);
  const [tickets, setTickets] = useState<ClanTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [hoursFilter, setHoursFilter] = useState<number>(0);
  const [serverFilter, setServerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'comments' | 'hours'>('newest');

  // Bookmarked posts IDs (local state)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rusty_clan_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal state: Create Post
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPostType, setNewPostType] = useState<'clan_recruit' | 'player_lfg'>('clan_recruit');
  const [newTitle, setNewTitle] = useState('');
  const [newClanName, setNewClanName] = useState('');
  const [newHours, setNewHours] = useState(1000);
  const [newServerType, setNewServerType] = useState('Vanilla 2x');
  const [newTeamSize, setNewTeamSize] = useState('Trio (3 игрока)');
  const [newPrimeTime, setNewPrimeTime] = useState('18:00 - 24:00 МСК');
  const [newAgeMin, setNewAgeMin] = useState(18);
  const [newSelectedRoles, setNewSelectedRoles] = useState<string[]>(['PvP Стрелок']);
  const [newDesc, setNewDesc] = useState('');
  const [newDiscord, setNewDiscord] = useState('');

  // Modal / Thread Detail View state
  const [selectedPost, setSelectedPost] = useState<ClanPost | null>(null);
  const [threadTab, setThreadTab] = useState<'comments' | 'ticket'>('comments');
  
  // Discussion Comments state inside selected thread
  const [comments, setComments] = useState<ClanComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  // Tickets for selected post (if user is author of selectedPost)
  const [postTickets, setPostTickets] = useState<ClanTicket[]>([]);

  // Ticket application form state
  const [applyHours, setApplyHours] = useState<number>(1000);
  const [applyAge, setApplyAge] = useState<number>(18);
  const [applyRoles, setApplyRoles] = useState<string[]>(['PvP Стрелок']);
  const [applyDiscord, setApplyDiscord] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Ticket response note
  const [responseNote, setResponseNote] = useState('');

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rusty_clan_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  // Real-time listener for posts
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'clan_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ClanPost[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ClanPost);
      });
      setPosts(list);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for user's sent or received tickets
  useEffect(() => {
    if (!user) {
      setTickets([]);
      return;
    }
    const q = query(collection(db, 'clan_tickets'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ClanTicket[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ClanTicket;
        if (data.applicantId === user.uid || data.postAuthorId === user.uid) {
          list.push({ id: docSnap.id, ...data });
        }
      });
      setTickets(list);
    }, (error) => {
      console.error("Error fetching tickets:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Load comments when a thread post is opened
  useEffect(() => {
    if (!selectedPost) {
      setComments([]);
      setPostTickets([]);
      return;
    }

    setLoadingComments(true);
    // Listen to public comments for this post
    const qComments = query(
      collection(db, 'clan_comments'), 
      where('postId', '==', selectedPost.id)
    );
    const unsubComments = onSnapshot(qComments, (snap) => {
      const list: ClanComment[] = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ClanComment);
      });
      // Sort in memory by createdAt ascending
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB;
      });
      setComments(list);
      setLoadingComments(false);
    });

    // If user is author of selected post, listen to incoming tickets for this post
    let unsubTickets = () => {};
    if (user && selectedPost.authorId === user.uid) {
      const qTickets = query(
        collection(db, 'clan_tickets'),
        where('postId', '==', selectedPost.id)
      );
      unsubTickets = onSnapshot(qTickets, (snap) => {
        const tList: ClanTicket[] = [];
        snap.forEach(docSnap => {
          tList.push({ id: docSnap.id, ...docSnap.data() } as ClanTicket);
        });
        setPostTickets(tList);
      });
    }

    return () => {
      unsubComments();
      unsubTickets();
    };
  }, [selectedPost, user]);

  const toggleBookmark = (postId: string) => {
    if (bookmarks.includes(postId)) {
      setBookmarks(bookmarks.filter(id => id !== postId));
      onToast(lang === 'ru' ? 'Удалено из закладок' : 'Removed from bookmarks', 'info');
    } else {
      setBookmarks([...bookmarks, postId]);
      onToast(lang === 'ru' ? 'Добавлено в закладки ⭐' : 'Saved to bookmarks ⭐', 'success');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!newTitle.trim() || !newDesc.trim() || !newDiscord.trim()) {
      onToast(lang === 'ru' ? 'Заполните заголовок, описание и Discord!' : 'Fill title, description, and Discord!', 'error');
      return;
    }

    try {
      const postData: Record<string, any> = {
        type: newPostType,
        title: newTitle.trim(),
        authorName: user.displayName || user.email?.split('@')[0] || 'Rust Player',
        authorId: user.uid,
        authorAvatar: getAvatarUrl(user.photoURL, user.avatarClass),
        authorVip: !!user.isVip,
        hours: Number(newHours) || 0,
        serverType: newServerType,
        teamSize: newTeamSize,
        rolesNeeded: newSelectedRoles,
        primeTime: newPrimeTime,
        ageMin: Number(newAgeMin) || 16,
        description: newDesc.trim(),
        discord: newDiscord.trim(),
        createdAt: serverTimestamp(),
        status: 'open',
        commentsCount: 0,
        likesCount: 0,
        likedBy: []
      };

      if (newPostType === 'clan_recruit') {
        postData.clanName = newClanName.trim() || 'Клан';
      }

      await addDoc(collection(db, 'clan_posts'), postData as Omit<ClanPost, 'id'>);

      logUserActivity({
        action: 'create_clan_post',
        tab: 'clan_board',
        details: `Created post (${newPostType}): ${newTitle}`
      });

      onToast(
        lang === 'ru' 
          ? 'Объявление опубликовано на форуме!' 
          : 'Post published on forum board!', 
        'success'
      );
      setIsCreateOpen(false);
      setNewTitle('');
      setNewClanName('');
      setNewDesc('');
      setNewDiscord('');
    } catch (err) {
      console.error("Error creating post:", err);
      onToast(lang === 'ru' ? 'Ошибка при публикации темы' : 'Error publishing post', 'error');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!selectedPost) return;
    if (!newCommentText.trim()) return;

    try {
      await addDoc(collection(db, 'clan_comments'), {
        postId: selectedPost.id,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Survivor',
        authorAvatar: getAvatarUrl(user.photoURL, user.avatarClass),
        authorVip: !!user.isVip,
        content: newCommentText.trim(),
        createdAt: serverTimestamp(),
        likes: 0
      });

      // Increment comments count on post
      const postRef = doc(db, 'clan_posts', selectedPost.id);
      await updateDoc(postRef, {
        commentsCount: (selectedPost.commentsCount || 0) + 1
      });

      setNewCommentText('');
      onToast(lang === 'ru' ? 'Комментарий отправлен!' : 'Comment posted!', 'success');
    } catch (err) {
      console.error("Error adding comment:", err);
      onToast(lang === 'ru' ? 'Ошибка при отправке комментария' : 'Error adding comment', 'error');
    }
  };

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!selectedPost) return;
    if (!applyMessage.trim() || !applyDiscord.trim()) {
      onToast(lang === 'ru' ? 'Заполните сообщение и ваш Discord' : 'Please fill message and Discord handle', 'error');
      return;
    }

    setIsSubmittingTicket(true);
    try {
      await addDoc(collection(db, 'clan_tickets'), {
        postId: selectedPost.id,
        postTitle: selectedPost.title,
        postAuthorId: selectedPost.authorId,
        applicantName: user.displayName || user.email?.split('@')[0] || 'Survivor',
        applicantId: user.uid,
        applicantAvatar: getAvatarUrl(user.photoURL, user.avatarClass),
        applicantHours: Number(applyHours) || 0,
        applicantAge: Number(applyAge) || 18,
        applicantRoles: applyRoles,
        discord: applyDiscord.trim(),
        message: applyMessage.trim(),
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      logUserActivity({
        action: 'apply_clan_ticket',
        tab: 'clan_board',
        details: `Applied to post: ${selectedPost.title}`
      });

      onToast(
        lang === 'ru' 
          ? 'Заявка (тикет) успешно отправлена автору!' 
          : 'Ticket application submitted to author!', 
        'success'
      );
      setApplyMessage('');
      setThreadTab('comments');
    } catch (err) {
      console.error("Error submitting ticket:", err);
      onToast(lang === 'ru' ? 'Ошибка при отправке заявки' : 'Error submitting ticket', 'error');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: 'accepted' | 'rejected') => {
    try {
      const ticketRef = doc(db, 'clan_tickets', ticketId);
      const updatePayload: Record<string, any> = { status };
      const trimmedNote = responseNote.trim();
      if (trimmedNote) {
        updatePayload.responseNote = trimmedNote;
      }
      await updateDoc(ticketRef, updatePayload);
      setResponseNote('');
      onToast(
        lang === 'ru' 
          ? (status === 'accepted' ? 'Заявка принята! ✅' : 'Заявка отклонена') 
          : (status === 'accepted' ? 'Ticket accepted! ✅' : 'Ticket rejected'), 
        'success'
      );
    } catch (err) {
      console.error("Error updating ticket status:", err);
      onToast(lang === 'ru' ? 'Ошибка изменения статуса' : 'Error updating ticket status', 'error');
    }
  };

  const handleTogglePostStatus = async (post: ClanPost) => {
    if (!user || user.uid !== post.authorId) return;
    const newStatus = post.status === 'open' ? 'closed' : 'open';
    try {
      await updateDoc(doc(db, 'clan_posts', post.id), {
        status: newStatus
      });
      onToast(
        lang === 'ru' 
          ? (newStatus === 'open' ? 'Набор возобновлен 🟢' : 'Набор закрыт 🔴')
          : (newStatus === 'open' ? 'Recruitment reopened 🟢' : 'Recruitment closed 🔴'),
        'info'
      );
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDeletePost = async (post: ClanPost) => {
    if (!user || (user.uid !== post.authorId && user.role !== 'admin')) return;
    if (!window.confirm(lang === 'ru' ? 'Удалить эту тему с форума?' : 'Delete this post from board?')) return;

    try {
      await deleteDoc(doc(db, 'clan_posts', post.id));
      if (selectedPost?.id === post.id) setSelectedPost(null);
      onToast(lang === 'ru' ? 'Тема успешно удалена' : 'Post deleted successfully', 'success');
    } catch (err) {
      console.error("Error deleting post:", err);
      onToast(lang === 'ru' ? 'Ошибка при удалении' : 'Error deleting post', 'error');
    }
  };

  const toggleRoleSelection = (role: string, currentList: string[], setter: (val: string[]) => void) => {
    if (currentList.includes(role)) {
      setter(currentList.filter(r => r !== role));
    } else {
      setter([...currentList, role]);
    }
  };

  // Filter & Sort calculation
  const filteredPosts = posts.filter(post => {
    // Tab filtering
    if (activeTab === 'clan_recruit' && post.type !== 'clan_recruit') return false;
    if (activeTab === 'player_lfg' && post.type !== 'player_lfg') return false;
    if (activeTab === 'my_posts' && user && post.authorId !== user.uid) return false;
    if (activeTab === 'bookmarks' && !bookmarks.includes(post.id)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchServer = post.serverType.toLowerCase().includes(q);
      const matchClan = post.clanName?.toLowerCase().includes(q);
      const matchRoles = post.rolesNeeded?.some(r => r.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchAuthor && !matchServer && !matchClan && !matchRoles) {
        return false;
      }
    }

    // Hours Filter
    if (hoursFilter > 0 && post.hours < hoursFilter) return false;

    // Server Filter
    if (serverFilter !== 'all' && !post.serverType.toLowerCase().includes(serverFilter.toLowerCase())) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'comments') {
      return (b.commentsCount || 0) - (a.commentsCount || 0);
    }
    if (sortBy === 'hours') {
      return b.hours - a.hours;
    }
    // 'newest'
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  // Calculate statistics counters
  const clanRecruitCount = posts.filter(p => p.type === 'clan_recruit').length;
  const playerLfgCount = posts.filter(p => p.type === 'player_lfg').length;
  const myTicketsCount = user ? tickets.filter(t => t.applicantId === user.uid).length : 0;
  const totalCommentsCount = posts.reduce((acc, p) => acc + (p.commentsCount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Tactical Header Banner */}
      <div className="bg-[#14171e] border border-[#2a2f3b] p-6 rounded-none space-y-4 rust-metal-pattern relative overflow-hidden">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />
        <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-[#cd412b]/20 text-[#cd412b] border border-[#cd412b]/40 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                <Shield size={12} />
                {lang === 'ru' ? 'ФОРУМ И ДОСКА НАБОРА' : 'FORUM & RECRUITMENT BOARD'}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-[#1b1e26] px-2 py-0.5 border border-[#2a2f3b]">
                RUST LFG & RECRUITMENT v2.6
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider font-teko leading-none">
              {lang === 'ru' ? 'Сбор в Клан & Поиск Тиммейтов' : 'Clan Recruitment & Teammate Board'}
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl font-sans">
              {lang === 'ru' 
                ? 'Публикуйте объявления о наборе в кланы, ищите сквад или дуо/трио тиммейтов, обсуждайте темы на форуме и подавайте заявки-тикеты напрямую лидеру.'
                : 'Post clan recruitment threads, find duo/trio teammates, reply to forum discussions, and submit direct application tickets.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-5 py-3 bg-[#cd412b] hover:bg-[#b83824] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg border border-orange-500/40 hover:scale-[1.02] active:scale-95"
              >
                <Plus size={18} />
                <span>{lang === 'ru' ? 'Создать пост / объявление' : 'Create Forum Post'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border border-blue-400/40"
              >
                <Users size={18} />
                <span>{lang === 'ru' ? 'Войти для публикации / отклика' : 'Login to Post / Apply'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Overview Stats Widget Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#2a2f3b]">
          <div className="bg-[#1b1e26] p-3 border border-[#2a2f3b] flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">
                {lang === 'ru' ? 'Сбор в Клан' : 'Clan Recruits'}
              </span>
              <span className="text-lg font-bold text-white font-mono">{clanRecruitCount}</span>
            </div>
          </div>

          <div className="bg-[#1b1e26] p-3 border border-[#2a2f3b] flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
              <UserPlus size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">
                {lang === 'ru' ? 'Поиск Тиммейтов' : 'Players LFG'}
              </span>
              <span className="text-lg font-bold text-white font-mono">{playerLfgCount}</span>
            </div>
          </div>

          <div className="bg-[#1b1e26] p-3 border border-[#2a2f3b] flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">
                {lang === 'ru' ? 'Обсуждения' : 'Discussions'}
              </span>
              <span className="text-lg font-bold text-white font-mono">{totalCommentsCount}</span>
            </div>
          </div>

          <div className="bg-[#1b1e26] p-3 border border-[#2a2f3b] flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
              <Send size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">
                {lang === 'ru' ? 'Мои Тикеты' : 'My Tickets'}
              </span>
              <span className="text-lg font-bold text-white font-mono">{myTicketsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Forum Category Tabs */}
      <div className="bg-[#14171e] border border-[#2a2f3b] p-3 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#2a2f3b] pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'all' 
                ? 'bg-[#cd412b] text-white shadow-md' 
                : 'bg-[#1b1e26] text-zinc-400 hover:text-white hover:bg-[#252a36]'
            }`}
          >
            <Flame size={14} />
            <span>{lang === 'ru' ? 'Все посты форума' : 'All Forum Posts'}</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-black/40 rounded-none">{posts.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('clan_recruit')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'clan_recruit' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'bg-[#1b1e26] text-zinc-400 hover:text-white hover:bg-[#252a36]'
            }`}
          >
            <Shield size={14} />
            <span>{lang === 'ru' ? '🛡️ Сбор в Клан' : 'Clan Recruitment'}</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-black/40 rounded-none">{clanRecruitCount}</span>
          </button>

          <button
            onClick={() => setActiveTab('player_lfg')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'player_lfg' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-[#1b1e26] text-zinc-400 hover:text-white hover:bg-[#252a36]'
            }`}
          >
            <UserPlus size={14} />
            <span>{lang === 'ru' ? '👤 Поиск Тиммейта / Клана' : 'Player LFG / LFT'}</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-black/40 rounded-none">{playerLfgCount}</span>
          </button>

          {user && (
            <button
              onClick={() => setActiveTab('my_posts')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'my_posts' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-[#1b1e26] text-zinc-400 hover:text-white hover:bg-[#252a36]'
              }`}
            >
              <Send size={14} />
              <span>{lang === 'ru' ? 'Мои посты и тикеты' : 'My Posts & Tickets'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'bookmarks' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-[#1b1e26] text-zinc-400 hover:text-white hover:bg-[#252a36]'
            }`}
          >
            <Star size={14} />
            <span>{lang === 'ru' ? 'Закладки' : 'Saved'}</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-black/40 rounded-none">{bookmarks.length}</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={lang === 'ru' ? 'Поиск по заголовку, роли, автору, серверу...' : 'Search title, role, author, server...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b1e26] border border-[#2a2f3b] pl-9 pr-3 py-2 text-xs text-white font-mono placeholder:text-zinc-500 focus:border-[#cd412b] focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-mono"
              >
                ×
              </button>
            )}
          </div>

          {/* Hours Filter */}
          <select
            value={hoursFilter}
            onChange={(e) => setHoursFilter(Number(e.target.value))}
            className="bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-zinc-300 font-mono focus:border-[#cd412b] focus:outline-none cursor-pointer"
          >
            <option value={0}>{lang === 'ru' ? 'Любые часы в Rust' : 'Any Hours'}</option>
            <option value={500}>500+ {lang === 'ru' ? 'часов' : 'hrs'}</option>
            <option value={1000}>1,000+ {lang === 'ru' ? 'часов' : 'hrs'}</option>
            <option value={2000}>2,000+ {lang === 'ru' ? 'часов' : 'hrs'}</option>
            <option value={3000}>3,000+ {lang === 'ru' ? 'часов' : 'hrs'}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-zinc-300 font-mono focus:border-[#cd412b] focus:outline-none cursor-pointer"
          >
            <option value="newest">{lang === 'ru' ? 'Сначала новые' : 'Newest First'}</option>
            <option value="comments">{lang === 'ru' ? 'Самые обсуждаемые' : 'Most Discussed'}</option>
            <option value="hours">{lang === 'ru' ? 'Макс. требование часов' : 'Highest Hours'}</option>
          </select>
        </div>
      </div>

      {/* Primary Forum Post Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 bg-[#14171e] border border-[#2a2f3b] p-6 space-y-3">
            <div className="w-8 h-8 border-2 border-[#cd412b] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-zinc-400">
              {lang === 'ru' ? 'Загрузка форума и постов...' : 'Loading forum posts...'}
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-[#14171e] border border-[#2a2f3b] p-8 space-y-4">
            <Users className="mx-auto text-zinc-600" size={48} />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white uppercase font-mono">
                {lang === 'ru' ? 'Объявления не найдены' : 'No posts found'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                {lang === 'ru' 
                  ? 'По данному запросу нет тем на форуме. Попробуйте сбросить фильтры или создайте первое объявление!'
                  : 'No threads match your filters. Try resetting filters or post a new thread!'}
              </p>
            </div>
            {user && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 bg-[#cd412b] hover:bg-[#b83824] text-white text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>{lang === 'ru' ? 'Опубликовать тему' : 'Create Thread'}</span>
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isClanRecruit = post.type === 'clan_recruit';
            const isSaved = bookmarks.includes(post.id);
            const isOwner = user && user.uid === post.authorId;

            return (
              <div 
                key={post.id} 
                className={`bg-[#14171e] border border-[#2a2f3b] p-5 rounded-none space-y-4 hover:border-zinc-700 transition-all relative overflow-hidden group rust-metal-pattern ${
                  post.status === 'closed' ? 'opacity-75' : ''
                }`}
              >
                {/* Top Colored Hazard Indicator */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isClanRecruit ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} 
                />

                {/* Post Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Tag */}
                    <span 
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                        isClanRecruit 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {isClanRecruit ? (
                        <>
                          <Shield size={12} />
                          <span>{lang === 'ru' ? 'Сбор в Клан' : 'Clan Recruiting'}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={12} />
                          <span>{lang === 'ru' ? 'Поиск Тиммейта / Клана' : 'Player LFG'}</span>
                        </>
                      )}
                    </span>

                    {/* Status Badge */}
                    <span 
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase border ${
                        post.status === 'open' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {post.status === 'open' 
                        ? (lang === 'ru' ? '🟢 Набор открыт' : '🟢 Open') 
                        : (lang === 'ru' ? '🔴 Набор закрыт' : '🔴 Closed')}
                    </span>

                    {post.clanName && (
                      <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5">
                        [{post.clanName}]
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Clock size={11} />
                      <span>
                        {post.createdAt?.seconds 
                          ? new Date(post.createdAt.seconds * 1000).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : (lang === 'ru' ? 'Только что' : 'Just now')}
                      </span>
                    </span>
                  </div>

                  {/* Bookmark & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`p-1.5 border text-xs font-mono transition-all cursor-pointer ${
                        isSaved 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                          : 'bg-[#1b1e26] text-zinc-400 border-[#2a2f3b] hover:text-white'
                      }`}
                      title={lang === 'ru' ? 'Сохранить в закладки' : 'Bookmark'}
                    >
                      <Star size={14} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>

                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTogglePostStatus(post)}
                          className="px-2 py-1 bg-[#1b1e26] hover:bg-[#252a36] text-zinc-300 text-[10px] font-mono border border-[#2a2f3b] cursor-pointer"
                        >
                          {post.status === 'open' ? (lang === 'ru' ? 'Закрыть набор' : 'Close') : (lang === 'ru' ? 'Открыть набор' : 'Reopen')}
                        </button>
                        <button
                          onClick={() => handleDeletePost(post)}
                          className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer"
                          title={lang === 'ru' ? 'Удалить пост' : 'Delete'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Author & Title Block */}
                <div className="flex items-start gap-4">
                  <img
                    src={getAvatarUrl(post.authorAvatar)}
                    alt={post.authorName}
                    className="w-11 h-11 border border-[#2a2f3b] bg-zinc-900 object-cover shrink-0"
                  />

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-zinc-200">
                        {post.authorName}
                      </span>
                      {post.authorVip && (
                        <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-black uppercase">
                          VIP
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2">
                        ⚡ {post.hours.toLocaleString()} {lang === 'ru' ? 'ч.' : 'hrs'}
                      </span>
                    </div>

                    <h2 
                      onClick={() => setSelectedPost(post)}
                      className="text-base sm:text-lg font-bold text-white uppercase font-sans tracking-wide hover:text-[#cd412b] transition-colors cursor-pointer line-clamp-2"
                    >
                      {post.title}
                    </h2>
                  </div>
                </div>

                {/* Badges / Specs Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 bg-[#1b1e26] border border-[#2a2f3b] text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                    <Gamepad2 size={12} className="text-blue-400" />
                    <span>{post.serverType}</span>
                  </span>

                  {post.teamSize && (
                    <span className="px-2 py-0.5 bg-[#1b1e26] border border-[#2a2f3b] text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                      <Users size={12} className="text-emerald-400" />
                      <span>{post.teamSize}</span>
                    </span>
                  )}

                  {post.primeTime && (
                    <span className="px-2 py-0.5 bg-[#1b1e26] border border-[#2a2f3b] text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                      <Clock size={12} className="text-amber-400" />
                      <span>{post.primeTime}</span>
                    </span>
                  )}

                  {post.ageMin && (
                    <span className="px-2 py-0.5 bg-[#1b1e26] border border-[#2a2f3b] text-[10px] font-mono text-zinc-300">
                      🔞 {post.ageMin}+
                    </span>
                  )}
                </div>

                {/* Roles Tags */}
                {post.rolesNeeded && post.rolesNeeded.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">
                      {isClanRecruit ? (lang === 'ru' ? 'Требуются:' : 'Roles:') : (lang === 'ru' ? 'Навыки:' : 'Skills:')}
                    </span>
                    {post.rolesNeeded.map((role, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] font-mono border border-zinc-700 uppercase"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description Snippet */}
                <p className="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap bg-[#1b1e26] p-3 border border-[#2a2f3b] line-clamp-3">
                  {post.description}
                </p>

                {/* Card Footer Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#2a2f3b]">
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare size={14} className="text-blue-400" />
                      <span>
                        {post.commentsCount || 0} {lang === 'ru' ? 'ответов на форуме' : 'replies'}
                      </span>
                    </button>

                    <span className="text-zinc-600">|</span>

                    <span className="text-zinc-400 text-[11px]">
                      Discord: <strong className="text-zinc-200">{post.discord || 'Скрыт'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setThreadTab('comments');
                      }}
                      className="px-3 py-1.5 bg-[#1b1e26] hover:bg-[#252a36] text-zinc-300 text-[10px] font-mono font-bold uppercase border border-[#2a2f3b] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <MessageSquare size={13} />
                      <span>{lang === 'ru' ? 'Обсуждение' : 'Discuss'}</span>
                    </button>

                    {user ? (
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setThreadTab('ticket');
                        }}
                        className="px-4 py-1.5 bg-[#cd412b] hover:bg-[#b83824] text-white text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Send size={13} />
                        <span>{lang === 'ru' ? 'Подать заявку' : 'Apply Ticket'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={onOpenAuth}
                        className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>{lang === 'ru' ? 'Войти для отклика' : 'Login to Apply'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal / Thread Discussion Detail View */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#14171e] border border-[#2a2f3b] max-w-3xl w-full p-6 space-y-6 rounded-none rust-metal-pattern relative max-h-[90vh] flex flex-col my-auto">
            {/* Top Colored Hazard bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${selectedPost.type === 'clan_recruit' ? 'bg-amber-500' : 'bg-emerald-500'}`} />

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#2a2f3b] pb-4 gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold border ${
                    selectedPost.type === 'clan_recruit' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {selectedPost.type === 'clan_recruit' ? (lang === 'ru' ? '🛡️ СБОР В КЛАН' : 'CLAN RECRUITMENT') : (lang === 'ru' ? '👤 ПОИСК ТИММЕЙТА' : 'PLAYER LFG')}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {selectedPost.serverType}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white uppercase font-sans tracking-wide">
                  {selectedPost.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="text-zinc-400 hover:text-white text-sm font-mono font-bold cursor-pointer p-1 bg-[#1b1e26] border border-[#2a2f3b]"
              >
                [X]
              </button>
            </div>

            {/* Scrollable Thread Content */}
            <div className="space-y-6 overflow-y-auto pr-1 flex-1">
              {/* Author & Specs Card */}
              <div className="bg-[#1b1e26] p-4 border border-[#2a2f3b] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(selectedPost.authorAvatar)}
                      alt={selectedPost.authorName}
                      className="w-10 h-10 border border-[#2a2f3b] bg-zinc-900 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">
                          {selectedPost.authorName}
                        </span>
                        {selectedPost.authorVip && (
                          <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-black">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-amber-400">
                        ⚡ {selectedPost.hours.toLocaleString()} {lang === 'ru' ? 'часов в Rust' : 'Rust hours'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-zinc-400 block">
                      Discord: <strong className="text-amber-300">{selectedPost.discord || 'Скрыт'}</strong>
                    </span>
                    {selectedPost.primeTime && (
                      <span className="text-[10px] font-mono text-zinc-500 block">
                        Прайм-тайм: {selectedPost.primeTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Body Text */}
                <div className="text-sm text-zinc-200 font-sans leading-relaxed whitespace-pre-wrap pt-2 border-t border-[#2a2f3b]/60">
                  {selectedPost.description}
                </div>

                {/* Requirements / Tags list */}
                {selectedPost.rolesNeeded && selectedPost.rolesNeeded.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                      {lang === 'ru' ? 'Требуемые роли:' : 'Roles:'}
                    </span>
                    {selectedPost.rolesNeeded.map((role, i) => (
                      <span key={i} className="px-2 py-0.5 bg-zinc-800 text-zinc-200 text-xs font-mono border border-zinc-700">
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub-Tabs: Comments vs Submit Ticket */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#2a2f3b]">
                  <button
                    onClick={() => setThreadTab('comments')}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                      threadTab === 'comments'
                        ? 'border-[#cd412b] text-white bg-[#1b1e26]'
                        : 'border-transparent text-zinc-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare size={14} />
                    <span>{lang === 'ru' ? 'Обсуждение на форуме' : 'Forum Discussion'} ({comments.length})</span>
                  </button>

                  <button
                    onClick={() => setThreadTab('ticket')}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                      threadTab === 'ticket'
                        ? 'border-blue-500 text-white bg-[#1b1e26]'
                        : 'border-transparent text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Send size={14} />
                    <span>
                      {user && selectedPost.authorId === user.uid
                        ? (lang === 'ru' ? `Входящие заявки (${postTickets.length})` : `Incoming Tickets (${postTickets.length})`)
                        : (lang === 'ru' ? 'Подать заявку (Тикет)' : 'Submit Ticket Application')}
                    </span>
                  </button>
                </div>

                {/* TAB 1: Public Discussion Comments */}
                {threadTab === 'comments' && (
                  <div className="space-y-4">
                    {/* Add comment box */}
                    {user ? (
                      <form onSubmit={handleAddComment} className="space-y-2 bg-[#1b1e26] p-3 border border-[#2a2f3b]">
                        <textarea
                          rows={3}
                          placeholder={lang === 'ru' ? 'Напишите комментарий или вопрос автору темы...' : 'Post a reply or question...'}
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="w-full bg-[#14171e] border border-[#2a2f3b] p-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:border-[#cd412b] focus:outline-none resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={!newCommentText.trim()}
                            className="px-4 py-1.5 bg-[#cd412b] hover:bg-[#b83824] disabled:opacity-50 text-white text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5"
                          >
                            <Send size={12} />
                            <span>{lang === 'ru' ? 'Отправить ответ' : 'Post Reply'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-[#1b1e26] p-4 border border-[#2a2f3b] text-center space-y-2">
                        <p className="text-xs font-mono text-zinc-400">
                          {lang === 'ru' ? 'Войдите в аккаунт, чтобы оставлять комментарии на форуме' : 'Login to reply in forum thread'}
                        </p>
                        <button
                          onClick={onOpenAuth}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase cursor-pointer"
                        >
                          {lang === 'ru' ? 'Войти в аккаунт' : 'Login'}
                        </button>
                      </div>
                    )}

                    {/* Comments list */}
                    <div className="space-y-3">
                      {loadingComments ? (
                        <div className="text-center py-6 text-xs font-mono text-zinc-500">
                          {lang === 'ru' ? 'Загрузка комментариев...' : 'Loading replies...'}
                        </div>
                      ) : comments.length === 0 ? (
                        <div className="text-center py-6 text-xs font-mono text-zinc-500 bg-[#1b1e26] border border-[#2a2f3b]">
                          {lang === 'ru' ? 'Пока нет комментариев. Будьте первым!' : 'No replies yet. Be the first!'}
                        </div>
                      ) : (
                        comments.map((c) => (
                          <div key={c.id} className="bg-[#1b1e26] p-3 border border-[#2a2f3b] space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={getAvatarUrl(c.authorAvatar)}
                                  alt={c.authorName}
                                  className="w-7 h-7 border border-[#2a2f3b] bg-zinc-900 object-cover"
                                />
                                <span className="text-xs font-bold text-zinc-200 font-mono">
                                  {c.authorName}
                                </span>
                                {c.authorVip && (
                                  <span className="px-1 text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono uppercase">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] font-mono text-zinc-500">
                                {c.createdAt?.seconds 
                                  ? new Date(c.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : ''}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap pl-9">
                              {c.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: Submit Application / View Received Tickets */}
                {threadTab === 'ticket' && (
                  <div className="space-y-4">
                    {/* IF user is POST AUTHOR -> Show list of applications for this post */}
                    {user && selectedPost.authorId === user.uid ? (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                          <Users className="text-amber-400" size={16} />
                          <span>{lang === 'ru' ? 'Поступившие заявки от игроков' : 'Received Player Applications'}</span>
                        </h4>

                        {postTickets.length === 0 ? (
                          <div className="text-center py-8 bg-[#1b1e26] border border-[#2a2f3b] space-y-2">
                            <p className="text-xs font-mono text-zinc-400">
                              {lang === 'ru' ? 'Пока нет заявки от игроков на это объявление.' : 'No application tickets received yet.'}
                            </p>
                          </div>
                        ) : (
                          postTickets.map((t) => (
                            <div key={t.id} className="bg-[#1b1e26] border border-[#2a2f3b] p-4 space-y-3 relative">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={getAvatarUrl(t.applicantAvatar)}
                                    alt={t.applicantName}
                                    className="w-10 h-10 border border-[#2a2f3b] bg-zinc-900 object-cover"
                                  />
                                  <div>
                                    <h5 className="text-xs font-bold text-white font-mono">
                                      {t.applicantName}
                                    </h5>
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                                      <span className="text-amber-400">⚡ {t.applicantHours} ч.</span>
                                      {t.applicantAge && <span>🔞 {t.applicantAge} лет</span>}
                                      <span>Discord: <strong className="text-zinc-200">{t.discord}</strong></span>
                                    </div>
                                  </div>
                                </div>

                                <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold border ${
                                  t.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                  t.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                  'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                }`}>
                                  {t.status === 'accepted' ? '✅ Принят' : t.status === 'rejected' ? '❌ Отклонен' : '⏳ В обработке'}
                                </span>
                              </div>

                              <p className="text-xs text-zinc-300 font-sans bg-[#14171e] p-3 border border-[#2a2f3b]">
                                {t.message}
                              </p>

                              {/* Owner Response note if present */}
                              {t.responseNote && (
                                <div className="text-xs text-amber-300 bg-amber-500/10 p-2 border border-amber-500/20 font-mono">
                                  {lang === 'ru' ? 'Ваш ответ:' : 'Your note:'} {t.responseNote}
                                </div>
                              )}

                              {/* Action buttons for owner */}
                              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2a2f3b]">
                                <button
                                  onClick={() => handleUpdateTicketStatus(t.id, 'rejected')}
                                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-mono font-bold uppercase cursor-pointer border border-red-500/30"
                                >
                                  {lang === 'ru' ? 'Отклонить' : 'Reject'}
                                </button>
                                <button
                                  onClick={() => handleUpdateTicketStatus(t.id, 'accepted')}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono font-bold uppercase cursor-pointer"
                                >
                                  {lang === 'ru' ? 'Принять в клан' : 'Accept Player'}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      /* IF VISITOR -> Show Application Submission Form */
                      <form onSubmit={handleSendTicket} className="space-y-4 bg-[#1b1e26] p-4 border border-[#2a2f3b]">
                        <h4 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                          <Send className="text-blue-400" size={16} />
                          <span>{lang === 'ru' ? 'Анкета отклика для автора темы' : 'Application Ticket Form'}</span>
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                              {lang === 'ru' ? 'Ваши часы в Rust' : 'Your Rust Hours'}
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={20000}
                              value={applyHours}
                              onChange={(e) => setApplyHours(Number(e.target.value))}
                              className="w-full bg-[#14171e] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                              {lang === 'ru' ? 'Ваш возраст' : 'Your Age'}
                            </label>
                            <input
                              type="number"
                              min={12}
                              max={99}
                              value={applyAge}
                              onChange={(e) => setApplyAge(Number(e.target.value))}
                              className="w-full bg-[#14171e] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                            {lang === 'ru' ? 'Ваш Discord для связи' : 'Your Discord Contact'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="username#0000"
                            value={applyDiscord}
                            onChange={(e) => setApplyDiscord(e.target.value)}
                            className="w-full bg-[#14171e] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                            {lang === 'ru' ? 'Ваши ключевые роли' : 'Select Your Roles'}
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESET_ROLES.map((role) => {
                              const isSel = applyRoles.includes(role);
                              return (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() => toggleRoleSelection(role, applyRoles, setApplyRoles)}
                                  className={`px-2 py-1 text-[10px] font-mono border cursor-pointer transition-all ${
                                    isSel
                                      ? 'bg-blue-600 text-white border-blue-400 font-bold'
                                      : 'bg-[#14171e] text-zinc-400 border-[#2a2f3b] hover:text-white'
                                  }`}
                                >
                                  {role}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                            {lang === 'ru' ? 'Сообщение автору (Опыт, спрей, прайм-тайм)' : 'Message to Author'}
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder={lang === 'ru' ? 'Расскажите о вашем опыте, предпочтениях по серверам, онлайне в день...' : 'Describe your experience, active hours, spray accuracy...'}
                            value={applyMessage}
                            onChange={(e) => setApplyMessage(e.target.value)}
                            className="w-full bg-[#14171e] border border-[#2a2f3b] p-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingTicket}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Send size={14} />
                          <span>{lang === 'ru' ? 'Отправить тикет-заявку' : 'Submit Application Ticket'}</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Forum Post */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#14171e] border border-[#2a2f3b] max-w-2xl w-full p-6 space-y-5 rounded-none rust-metal-pattern relative max-h-[90vh] flex flex-col my-auto">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#cd412b]" />

            <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-3 shrink-0">
              <h3 className="text-xl font-bold text-white uppercase font-teko tracking-wider flex items-center gap-2">
                <Plus className="text-[#cd412b]" size={20} />
                <span>{lang === 'ru' ? 'Создать новое объявление на доске' : 'New Board Post'}</span>
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono font-bold cursor-pointer p-1 bg-[#1b1e26] border border-[#2a2f3b]"
              >
                [X]
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                  {lang === 'ru' ? 'Выберите тип темы / объявления:' : 'Select Post Type:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewPostType('clan_recruit')}
                    className={`p-3 border text-left cursor-pointer transition-all ${
                      newPostType === 'clan_recruit'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-[#1b1e26] border-[#2a2f3b] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase mb-1">
                      <Shield size={16} />
                      <span>{lang === 'ru' ? 'Сбор в Клан' : 'Clan Recruiting'}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sans leading-tight">
                      {lang === 'ru' ? 'Ваш клан или команда набирает игроков' : 'Your clan or squad is recruiting players'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPostType('player_lfg')}
                    className={`p-3 border text-left cursor-pointer transition-all ${
                      newPostType === 'player_lfg'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md'
                        : 'bg-[#1b1e26] border-[#2a2f3b] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase mb-1">
                      <UserPlus size={16} />
                      <span>{lang === 'ru' ? 'Поиск Тиммейта / Клана' : 'Player LFG'}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sans leading-tight">
                      {lang === 'ru' ? 'Вы игрок и ищете себе клан или дуо/трио' : 'You are looking for a clan or duo/trio squad'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                  {lang === 'ru' ? 'Заголовок темы' : 'Thread Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newPostType === 'clan_recruit'
                      ? (lang === 'ru' ? 'Клан [NEXUS] набирает стрелков и строителя на Vanilla 2x' : 'Clan recruiting PvP & Builder')
                      : (lang === 'ru' ? 'Ищу дуо/трио для плотного фарма и рейдов (3,500ч)' : 'Player looking for Duo/Trio')
                  }
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-[#cd412b] focus:outline-none"
                />
              </div>

              {/* Clan Name (If Clan Recruit) */}
              {newPostType === 'clan_recruit' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    {lang === 'ru' ? 'Название клана / тег' : 'Clan Name / Tag'}
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. [RAIDERS] / DOMINATION"
                    value={newClanName}
                    onChange={(e) => setNewClanName(e.target.value)}
                    className="w-full bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-[#cd412b] focus:outline-none"
                  />
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    {lang === 'ru' ? 'Мин. часов Rust' : 'Min Rust Hours'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20000}
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-[#cd412b] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    {lang === 'ru' ? 'Формат сервера' : 'Server Format'}
                  </label>
                  <select
                    value={newServerType}
                    onChange={(e) => setNewServerType(e.target.value)}
                    className="w-full bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-[#cd412b] focus:outline-none"
                  >
                    {SERVER_TYPES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    {lang === 'ru' ? 'Состав / Формат' : 'Team Format'}
                  </label>
                  <input
                    type="text"
                    placeholder="Duo / Trio / 6-8 players"
                    value={newTeamSize}
                    onChange={(e) => setNewTeamSize(e.target.value)}
                    className="w-full bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-[#cd412b] focus:outline-none"
                  />
                </div>
              </div>

              {/* Roles Chips */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                  {lang === 'ru' ? 'Выберите нужные роли / навыки:' : 'Select Required Roles:'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_ROLES.map((role) => {
                    const isSel = newSelectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRoleSelection(role, newSelectedRoles, setNewSelectedRoles)}
                        className={`px-2.5 py-1 text-[10px] font-mono border cursor-pointer transition-all ${
                          isSel
                            ? 'bg-[#cd412b] text-white border-orange-500 font-bold'
                            : 'bg-[#1b1e26] text-zinc-400 border-[#2a2f3b] hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discord & Prime Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    {lang === 'ru' ? 'Discord для связи' : 'Discord Handle'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="username#0000 / link"
                    value={newDiscord}
                    onChange={(e) => setNewDiscord(e.target.value)}
                    className="w-full bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-[#cd412b] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    {lang === 'ru' ? 'Прайм-тайм' : 'Prime Time'}
                  </label>
                  <input
                    type="text"
                    placeholder="18:00 - 24:00 MSK"
                    value={newPrimeTime}
                    onChange={(e) => setNewPrimeTime(e.target.value)}
                    className="w-full bg-[#1b1e26] border border-[#2a2f3b] px-3 py-2 text-xs text-white font-mono focus:border-[#cd412b] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                  {lang === 'ru' ? 'Подробное описание и правила' : 'Detailed Description & Rules'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    lang === 'ru'
                      ? 'Опишите требования к игрокам, дисциплине, прайм-тайму, опыту рейдов и коммуникации...'
                      : 'Describe team requirements, schedule, communication expectations...'
                  }
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#1b1e26] border border-[#2a2f3b] p-3 text-xs text-white font-mono focus:border-[#cd412b] focus:outline-none resize-none"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#2a2f3b] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-[#1b1e26] text-zinc-300 text-xs font-mono uppercase cursor-pointer hover:bg-[#252a36]"
                >
                  {lang === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#cd412b] hover:bg-[#b83824] text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-md"
                >
                  {lang === 'ru' ? 'Опубликовать тему' : 'Publish Thread'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
