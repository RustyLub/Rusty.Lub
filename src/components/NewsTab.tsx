import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { motion } from 'motion/react';
import { NewsItem } from '../types';
import { 
  Compass, 
  Calendar, 
  User, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Info
} from 'lucide-react';

// Robust helper component that falls back to stylized placeholder art if Facepunch CDN is unstable or blocked
function NewsImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackSrc = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; 
  
  return (
    <div className={`relative bg-[#0c0d10] border border-[#2a2f3b] overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#171a22] animate-pulse">
          <div className="text-[9px] font-mono text-[#cd412b]/60 uppercase tracking-widest animate-pulse">
            SYS_RETRIEVING_ASSET...
          </div>
        </div>
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => {
          setHasError(true);
          setLoading(false);
        }}
        className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
}

interface NewsTabProps {
  lang: 'ru' | 'en';
}

export default function NewsTab({ lang }: NewsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'updates' | 'blogs' | 'events'>('all');
  const [activeNewsId, setActiveNewsId] = useState<string>('');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  console.log('NewsTab render - activeNewsId:', activeNewsId, 'newsItems count:', newsItems.length);

  const categories = [
    { id: 'all', label: { ru: 'Все публикации', en: 'All Posts' } },
    { id: 'updates', label: { ru: 'Обновления', en: 'Game Updates' } },
    { id: 'blogs', label: { ru: 'Блоги разработчиков', en: 'Devblogs' } },
    { id: 'events', label: { ru: 'События', en: 'Events' } }
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'news'), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
        // Sort by date descending
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNewsItems(items);
        if (items.length > 0 && !activeNewsId) {
            setActiveNewsId(items[0].id);
        }
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'news');
    });
    return () => unsubscribe();
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const activeItem = newsItems.find(item => item.id === activeNewsId) || newsItems[0];

  const handleCategoryChange = (catId: 'all' | 'updates' | 'blogs' | 'events') => {
    setSelectedCategory(catId);
    const matched = catId === 'all'
      ? newsItems
      : newsItems.filter(item => item.category === catId);
    if (matched.length > 0) {
      // If activeNewsId is not part of the newly selected category, set active to first item in category
      if (!matched.some(item => item.id === activeNewsId)) {
        setActiveNewsId(matched[0].id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a1c23] to-[#0c0d10] border border-[#2a2f3b] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />
        
        <div className="absolute top-0 left-0 bottom-0 w-1.5 rust-hazard" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-gradient-to-r from-blue-500/10 to-red-500/10 text-purple-400 border border-purple-500/20">
              <Compass size={16} />
            </span>
            <span id="news-desk-header" className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
              {lang === 'ru' ? 'Служба новостей Facepunch' : 'Facepunch News Desk'}
            </span>
          </div>
          <h2 id="news-desk-title" className="text-2xl sm:text-3xl font-black text-white font-teko uppercase tracking-wider leading-none">
            {lang === 'ru' ? 'НОВОСТИ И ОБНОВЛЕНИЯ RUST' : 'RUST NEWS & UPDATES'}
          </h2>
          <p id="news-desk-body" className="text-xs text-gray-400 font-medium max-w-xl">
            {lang === 'ru' 
              ? 'Официальные патчноуты, изменения баланса, киберспортивные анонсы и девблоги напрямую с передовой разработки выживания.' 
              : 'Official patch logs, balancing, esports announcements, and devblogs straight from the frontlines of survival development.'}
          </p>
        </div>

        {/* Categories Selectors */}
        <div className="flex flex-wrap gap-1.5 bg-[#08090d] p-1 border border-[#1f232e] rounded-sm self-stretch md:self-auto justify-start">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as any)}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all duration-150 rounded-sm font-mono cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-[#ff4d30] text-white shadow-sm font-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Side Featured, Right Side list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Selected News Detail */}
        <div className="lg:col-span-8 space-y-6">
          {activeItem ? (
            <div 
              key={activeItem.id} 
              className="bg-[#14171e]/90 border-2 border-[#2a2f3b] rounded-none p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden rust-metal-pattern"
            >
              <div className="rust-bracket-tl" />
              <div className="rust-bracket-tr" />
              <div className="rust-bracket-bl" />
              <div className="rust-bracket-br" />

              {/* Decorative side accent */}
              <div className="absolute top-0 right-0 w-32 h-32 rust-hazard-dark pointer-events-none opacity-25" />
              <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />

              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2f3b] pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500/10 to-red-500/10 border border-purple-500/30 text-[9px] font-black uppercase tracking-widest text-purple-400 font-mono">
                    {activeItem.badge ? activeItem.badge[lang] : (lang === 'ru' ? 'НОВОСТЬ' : 'NEWS')}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 font-bold">
                    <Calendar size={12} />
                    {new Date(activeItem.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500 font-bold uppercase">
                  <User size={12} className="text-purple-400" />
                  BY {activeItem.author}
                </span>
              </div>

              {/* Main Cover Image */}
              {activeItem.coverImage && (
                <NewsImage 
                  src={activeItem.coverImage} 
                  alt={activeItem.title[lang]} 
                  className="w-full aspect-video md:h-80 max-h-96 object-cover border-2 border-[#2a2f3b] shadow-inner" 
                />
              )}

              {/* Title */}
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans uppercase leading-tight">
                  {activeItem.title[lang]}
                </h3>
                <div className="relative text-sm text-gray-300 leading-relaxed font-sans font-medium bg-[#0c0d10] p-4 pl-5 border-y border-r border-[#2a2f3b]">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-red-500" />
                  {activeItem.summary ? activeItem.summary[lang] : ''}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-6 pt-2">
                {activeItem.content && activeItem.content[lang] && activeItem.content[lang].map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-4 bg-[#171a22]/60 p-5 border border-[#2a2f3b]/70 relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gray-600" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-600" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gray-600" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gray-600" />

                    <h4 className="text-xs font-mono font-black tracking-widest bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent uppercase inline-block">
                      {sec.sectionTitle}
                    </h4>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium">
                      {sec.text}
                    </p>

                    <ul className="space-y-2 pt-2">
                      {sec.highlights?.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5 text-[11px] text-gray-300 font-sans font-medium">
                          <CheckCircle2 size={13} className="text-purple-400 shrink-0 mt-0.5" />
                          <span>
                            {h.startsWith('BUTTON:') ? (
                              <button 
                                onClick={() => {
                                    console.log('Button clicked, setting activeNewsId to:', h.split(':')[2]);
                                    setActiveNewsId(h.split(':')[2]);
                                }}
                                className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer"
                              >
                                {h.split(':')[1]}
                              </button>
                            ) : h.startsWith('http') ? (
                              <a href={h} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                                {h}
                              </a>
                            ) : (
                              h
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="text-center p-12 bg-[#14171e] border border-[#2a2f3b] text-gray-500 font-mono text-xs uppercase">
              {lang === 'ru' ? 'Крупные обновления в этой категории отсутствуют' : 'No major updates found in this category'}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar List of other news */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-5 shadow-xl relative overflow-hidden">

            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            
            <h3 className="text-xs font-mono font-black tracking-widest uppercase border-b border-[#2a2f3b] pb-3 mb-4 flex items-center justify-between">
              <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">{lang === 'ru' ? 'ДРУГИЕ ПУБЛИКАЦИИ' : 'OTHER POSTS'}</span>
              <span className="text-[9px] text-gray-500 tracking-normal uppercase">FEED v1.2</span>
            </h3>

            <div className="space-y-4">
              {filteredNews.filter(n => activeItem && n.id !== activeItem.id).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setActiveNewsId(item.id)}
                  className="p-4 bg-[#1b1e26]/40 hover:bg-[#1b1e26]/80 border border-[#2a2f3b] hover:border-gray-600 transition-all cursor-pointer relative group"
                >
                  {/* Subtle side pointer bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-red-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-blue-500/10 to-red-500/10 text-purple-400 border border-purple-500/20 text-[8px] font-bold font-mono uppercase tracking-wider">
                      {item.badge ? item.badge[lang] : (lang === 'ru' ? 'НОВОСТЬ' : 'NEWS')}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 font-medium">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-wide leading-snug">
                    {item.title[lang]}
                  </h4>

                  <p className="text-[10.5px] text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                    {item.summary ? item.summary[lang] : ''}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-[9px] text-purple-400 font-bold font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{lang === 'ru' ? 'ЧИТАТЬ ПОЛНОСТЬЮ' : 'READ MORE'}</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}

              {filteredNews.filter(n => n.id !== activeItem.id).length === 0 && (
                <div className="text-center py-6 text-gray-500 font-mono text-[10px] uppercase">
                  {lang === 'ru' ? 'Нет дополнительных публикаций' : 'No secondary posts found'}
                </div>
              )}
            </div>
          </div>

          {/* Steam Community Spotlight Section */}
          <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-5 shadow-xl relative overflow-hidden">
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <h3 className="text-xs font-mono font-black tracking-widest uppercase border-b border-[#2a2f3b] pb-3 mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">{lang === 'ru' ? 'ОТ КЛИЕНТА ДО СЕРВЕРА' : 'CLIENT TO SERVER'}</span>
            </h3>

            <div className="bg-black/30 p-4 border border-[#2a2f3b] text-center space-y-3 relative">
              <div className="absolute top-1 left-1.5 text-[8px] font-mono text-gray-600">SYS_V: 242.0</div>
              <Cpu size={24} className="text-purple-400 mx-auto animate-pulse" />
              <div className="space-y-1">
                <span className="block text-[11px] text-gray-300 font-sans font-bold">
                  {lang === 'ru' ? 'Принудительный вайп карты' : 'Forced Map Wipe'}
                </span>
                <span className="block text-[9px] font-mono text-gray-500 font-bold uppercase">
                  {lang === 'ru' ? 'КАЖДЫЙ ПЕРВЫЙ ЧЕТВЕРГ МЕСЯЦА' : 'EVERY FIRST THURSDAY OF THE MONTH'}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                {lang === 'ru' 
                  ? 'Все официальные серверверы Rust проходят глобальную очистку баз и чертежей в день выпуска ежемесячного обновления.'
                  : 'All official Rust servers undergo a global map & blueprints reset on the release hour of monthly update logs.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
