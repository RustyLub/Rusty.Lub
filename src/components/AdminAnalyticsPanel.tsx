import { useEffect, useMemo, useState } from 'react';
import { Activity, Eye, Users, UserCheck, UserPlus, Clock3, Monitor, TrendingUp } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

type AnalyticsEvent = { id: string; event: string; page?: string; visitorId?: string; createdAtMs?: number; source?: string };
type Presence = { visitorId: string; lastSeenAtMs?: number; page?: string };

const number = (value: number) => value.toLocaleString('ru-RU');

export default function AdminAnalyticsPanel({ lang }: { lang: 'ru' | 'en' }) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [presence, setPresence] = useState<Presence[]>([]);
  const [error, setError] = useState('');
  const [range, setRange] = useState<7 | 30>(7);

  useEffect(() => {
    const eventsQuery = query(collection(db, 'site_analytics_events'), orderBy('createdAtMs', 'desc'), limit(5000));
    const stopEvents = onSnapshot(eventsQuery, snap => {
      setEvents(snap.docs.map(item => ({ id: item.id, ...item.data() } as AnalyticsEvent)));
      setError('');
    }, () => setError(lang === 'ru' ? 'Нет доступа к данным аналитики. Проверьте правила Firestore.' : 'Analytics access denied. Check Firestore rules.'));
    const stopPresence = onSnapshot(collection(db, 'site_analytics_presence'), snap => {
      setPresence(snap.docs.map(item => ({ visitorId: item.id, ...item.data() } as Presence)));
    }, () => setError(lang === 'ru' ? 'Не удалось загрузить онлайн-статус.' : 'Could not load online presence.'));
    return () => { stopEvents(); stopPresence(); };
  }, [lang]);

  const now = Date.now();
  const since = now - range * 24 * 60 * 60 * 1000;
  const recent = useMemo(() => events.filter(e => (e.createdAtMs || 0) >= since), [events, since]);
  const visitors = new Set(recent.filter(e => e.event === 'page_view').map(e => e.visitorId).filter(Boolean)).size;
  const views = recent.filter(e => e.event === 'page_view').length;
  const logins = recent.filter(e => e.event === 'login').length;
  const registrations = recent.filter(e => e.event === 'registration').length;
  const online = presence.filter(p => (p.lastSeenAtMs || 0) >= now - 5 * 60 * 1000).length;
  const pages = Object.entries(recent.filter(e => e.event === 'page_view').reduce<Record<string, number>>((acc, e) => {
    const key = e.page || '/';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {})).sort((a,b) => b[1] - a[1]).slice(0, 8);
  const sources = Object.entries(recent.filter(e => e.event === 'page_view').reduce<Record<string, number>>((acc,e) => {
    const key = e.source || 'direct'; acc[key] = (acc[key] || 0) + 1; return acc;
  }, {})).sort((a,b) => b[1] - a[1]).slice(0, 6);

  const cards = [
    { label: lang === 'ru' ? 'Уникальные посетители' : 'Unique visitors', value: visitors, icon: Users },
    { label: lang === 'ru' ? 'Просмотры страниц' : 'Page views', value: views, icon: Eye },
    { label: lang === 'ru' ? 'Сейчас онлайн · 5 мин' : 'Online now · 5 min', value: online, icon: Activity },
    { label: lang === 'ru' ? 'Авторизации' : 'Logins', value: logins, icon: UserCheck },
    { label: lang === 'ru' ? 'Регистрации' : 'Registrations', value: registrations, icon: UserPlus }
  ];

  return <section className="space-y-6 text-white">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-black">{lang === 'ru' ? 'Аналитика посещаемости' : 'Traffic analytics'}</h2>
      <p className="mt-1 text-xs text-zinc-500">{lang === 'ru' ? 'События сайта и активные посетители' : 'Site events and active visitors'}</p></div>
      <div className="flex gap-2">
        {[7,30].map(days => <button key={days} onClick={() => setRange(days as 7 | 30)} className={`border px-3 py-2 text-xs font-mono ${range === days ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-zinc-700 text-zinc-400'}`}>{days} {lang === 'ru' ? 'дней' : 'days'}</button>)}
      </div>
    </div>
    {error && <div className="border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-300">{error}</div>}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(card => { const Icon = card.icon; return <div key={card.label} className="border border-[#2a2f3b] bg-[#14171e] p-5">
        <div className="flex items-center justify-between text-zinc-500"><span className="text-[10px] uppercase tracking-wider">{card.label}</span><Icon size={17}/></div>
        <div className="mt-3 text-3xl font-black font-mono">{number(card.value)}</div>
      </div>; })}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="border border-[#2a2f3b] bg-[#14171e] p-5">
        <h3 className="mb-4 flex items-center gap-2 font-bold"><TrendingUp size={16}/> {lang === 'ru' ? 'Популярные страницы' : 'Popular pages'}</h3>
        {pages.length ? pages.map(([page,count]) => <div key={page} className="flex justify-between gap-3 border-b border-white/5 py-2 text-sm"><span className="truncate text-zinc-300">{page}</span><b className="font-mono">{number(count)}</b></div>) : <p className="text-sm text-zinc-500">{lang === 'ru' ? 'Пока нет данных. Счётчик начнёт собирать статистику после установки.' : 'No data yet. Tracking starts after deployment.'}</p>}
      </div>
      <div className="border border-[#2a2f3b] bg-[#14171e] p-5">
        <h3 className="mb-4 flex items-center gap-2 font-bold"><Monitor size={16}/> {lang === 'ru' ? 'Источники переходов' : 'Traffic sources'}</h3>
        {sources.length ? sources.map(([source,count]) => <div key={source} className="flex justify-between gap-3 border-b border-white/5 py-2 text-sm"><span className="truncate text-zinc-300">{source}</span><b className="font-mono">{number(count)}</b></div>) : <p className="text-sm text-zinc-500">{lang === 'ru' ? 'Источники появятся после первых посещений.' : 'Sources appear after the first visits.'}</p>}
      </div>
    </div>
    <p className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-500"><Clock3 size={14} className="mt-0.5 shrink-0"/> {lang === 'ru' ? 'Онлайн — посетители, отметившиеся за последние 5 минут. Счётчики начинают заполняться после установки. Это базовая внутренняя аналитика; данные браузерных событий могут блокироваться настройками приватности и не заменяют Google Search Console.' : 'Online means visitors seen in the last 5 minutes. Tracking begins after deployment. Browser events can be blocked by privacy settings and do not replace Google Search Console.'}</p>
  </section>;
}
