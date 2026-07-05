import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ShieldAlert, Clock, User, Server, AlertTriangle, ExternalLink, HelpCircle, Star } from 'lucide-react';
import { CustomUser } from '../types';
import { auth } from '../firebase';

interface PlayerTrackerTabProps {
  currentUser: CustomUser | null;
  lang: 'ru' | 'en';
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  openCabinet: () => void;
}

interface PlayerProfile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  steamId: string;
  playtime: number;
  activeServer: {
    name: string;
    ip?: string;
    port?: string;
  } | null;
  history: Array<{
    serverName: string;
    firstSeen: string;
    lastPlayed: string;
    timePlayed: string;
  }>;
}

export default function PlayerTrackerTab({ currentUser, lang, onToast, openCabinet }: PlayerTrackerTabProps) {
  const [steamId, setSteamId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlayerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if current logged-in user has VIP sponsorship active
  // Since we have isAdmin as well, we allow admins too
  const isVip = currentUser?.role === 'admin' || currentUser?.uid === 'serustqs' || currentUser?.email === 'misterzet556@gmail.com' || (currentUser && typeof currentUser === 'object' && 'isVip' in currentUser && (currentUser as any).isVip);

  // Pre-configured SteamID demo for guest evaluation
  const DEMO_STEAMID = "76561198084135683";

  const handleSearch = async (targetId: string) => {
    const trimmedId = targetId.trim();
    if (!/^\d{17}$/.test(trimmedId)) {
      onToast(
        lang === 'ru' 
          ? 'SteamID64 должен содержать ровно 17 цифр!' 
          : 'SteamID64 must be exactly 17 digits!', 
        'error'
      );
      return;
    }

    // VIP Protection: if searching something else than the demo ID and not VIP, prompt to purchase VIP
    if (trimmedId !== DEMO_STEAMID && !isVip) {
      onToast(
        lang === 'ru'
          ? 'Для поиска по любому ID требуется VIP подписка!'
          : 'Sponsorship is required to search any SteamID64!',
        'info'
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/battlemetrics/player/${trimmedId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to fetch player stats');
      }
      const data = await response.json();
      setResult(data.profile);
      onToast(
        lang === 'ru' ? 'Данные успешно загружены!' : 'Player record retrieved!',
        'success'
      );
    } catch (err: any) {
      setError(err.message || 'Error communicating with BattleMetrics');
      onToast(err.message || 'Error loading stats', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemo = () => {
    setSteamId(DEMO_STEAMID);
    handleSearch(DEMO_STEAMID);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-1 sm:px-0" id="player-tracker-section">
      {/* Title & Introduction */}
      <div className="bg-zinc-950/60 border border-zinc-900 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-black font-mono tracking-widest uppercase">
              BATTLEMETRICS RADAR
            </span>
            {!isVip && (
              <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-black font-mono tracking-widest uppercase flex items-center gap-1">
                <Star size={8} fill="currentColor" /> VIP ONLY
              </span>
            )}
          </div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase font-teko">
            {lang === 'ru' ? '🕵️‍♂️ Поиск и Аналитика Игроков Rust' : '🕵️‍♂️ Rust Player Search & Analytics'}
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {lang === 'ru'
              ? 'Узнайте полную историю активности любого выжившего. Наш поисковый радар извлекает статистику посещений серверов, время в игре, текущий статус и любимые площадки напрямую из базы данных BattleMetrics по SteamID64.'
              : 'Unveil the true identity of any survivor. Our tracker queries BattleMetrics server databases by SteamID64 to reveal server join history, total hours, online states, and previous wipes.'}
          </p>
        </div>

        {!isVip && (
          <button
            onClick={openCabinet}
            className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black text-xs font-black font-mono uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Star size={12} fill="currentColor" />
            {lang === 'ru' ? 'РАЗБЛОКИРОВАТЬ ЗА 3 USDT' : 'UNLOCK FOR 3 USDT'}
          </button>
        )}
      </div>

      {/* Main Tracker Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Search and Information Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0c0d10] border border-zinc-850 p-5 space-y-4">
            <h3 className="text-xs font-black text-zinc-300 uppercase tracking-wider font-mono">
              {lang === 'ru' ? 'ПОИСК ПО STEAMID64' : 'SEARCH BY STEAMID64'}
            </h3>

            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="76561198084135683"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value.replace(/\D/g, ''))}
                  className="block w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono rounded-sm focus:border-amber-500 focus:ring-0 focus:outline-none transition-all placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleSearch(steamId)}
                  disabled={isLoading}
                  className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 text-white text-xs font-black font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-amber-500 rounded-full animate-spin" />
                  ) : (
                    <Search size={12} />
                  )}
                  {lang === 'ru' ? 'НАЙТИ ИГРОКА' : 'TRACK PLAYER'}
                </button>

                <button
                  onClick={loadDemo}
                  disabled={isLoading}
                  className="px-3 py-2 bg-[#cd412b]/10 hover:bg-[#cd412b]/25 border border-[#cd412b]/40 hover:border-[#cd412b]/60 text-white text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Test feature without VIP status"
                >
                  <span>DEMO</span>
                </button>
              </div>
            </div>

            {/* VIP Warning Notice for non-VIPs */}
            {!isVip && (
              <div className="bg-purple-950/20 border border-purple-900/40 p-3.5 space-y-2">
                <div className="flex gap-2 text-purple-400">
                  <Star size={14} fill="currentColor" className="shrink-0 mt-0.5" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    {lang === 'ru' ? 'РЕЖИМ БЕСПЛАТНОЙ ОЦЕНКИ' : 'FREE EVALUATION MODE'}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  {lang === 'ru'
                    ? 'Вы можете протестировать эту панель, нажав кнопку DEMO. Для поиска любого произвольного SteamID64 требуется активировать VIP статус за 3 USDT.'
                    : 'You can test this premium dashboard with our sample ID by clicking DEMO. Search access for custom SteamIDs is locked to sponsors.'}
                </p>
              </div>
            )}

            {/* Explanation Guide */}
            <div className="border-t border-zinc-900 pt-4 space-y-3">
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest block">
                {lang === 'ru' ? 'КАК УЗНАТЬ STEAMID64?' : 'HOW TO GET STEAMID64?'}
              </span>
              <ul className="text-[10px] text-zinc-400 space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-mono font-bold">1.</span>
                  <span>
                    {lang === 'ru'
                      ? 'Скопируйте ссылку на профиль игрока в Steam (например, steamcommunity.com/profiles/7656119...)'
                      : 'Copy the players Steam profile link (e.g. steamcommunity.com/profiles/7656119...)'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-mono font-bold">2.</span>
                  <span>
                    {lang === 'ru'
                      ? 'Если профиль буквенный, используйте любой открытый конвертер (SteamID.io) для получения 17-значного ID.'
                      : 'If they use a custom vanity URL, use SteamID.io to decode the 17-digit numeric string.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Statistics & History View Panel */}
        <div className="lg:col-span-7">
          {isLoading && (
            <div className="bg-[#0c0d10] border border-zinc-850 p-12 flex flex-col items-center justify-center space-y-4 h-full min-h-[300px]">
              <div className="w-8 h-8 border-3 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
              <div className="space-y-1 text-center">
                <span className="text-xs font-mono text-zinc-400 block font-bold uppercase tracking-wider">
                  {lang === 'ru' ? 'СКАНИРОВАНИЕ БАЗЫ ДАННЫХ...' : 'SCANNING BATTLEMETRICS DATABASE...'}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {lang === 'ru' ? 'Поиск записей сессий игрока и истории вайпов' : 'Fetching active connections and wipe timestamps'}
                </span>
              </div>
            </div>
          )}

          {!isLoading && !result && !error && (
            <div className="bg-zinc-950/20 border border-dashed border-zinc-850 p-12 flex flex-col items-center justify-center text-center space-y-3 h-full min-h-[300px]">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-600">
                <User size={24} />
              </div>
              <div className="space-y-1 max-w-xs">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  {lang === 'ru' ? 'РАДАР ИГРОКОВ ПУСТ' : 'RADAR STANDBY'}
                </span>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  {lang === 'ru'
                    ? 'Введите SteamID64 слева или запустите ДЕМО режим, чтобы мгновенно просканировать активность игрока.'
                    : 'Provide a SteamID64 on the left panel or trigger the DEMO mode to begin database scan.'}
                </p>
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="bg-[#0c0d10] border border-red-950/40 p-8 flex flex-col items-center justify-center text-center space-y-3 h-full min-h-[300px]">
              <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-full text-red-500 animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1 max-w-sm">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider block">
                  {lang === 'ru' ? 'ОШИБКА ЗАПРОСА' : 'LOOKUP FAILURE'}
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}

          {!isLoading && result && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Profile Card */}
              <div className="bg-[#0c0d10] border border-zinc-850 p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-zinc-950 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white tracking-wide font-mono flex items-center gap-1.5">
                        {result.name}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500 block">
                        SteamID64: <span className="text-zinc-400">{result.steamId}</span>
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://steamcommunity.com/profiles/${result.steamId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] font-mono font-black text-zinc-400 hover:text-amber-500 bg-zinc-950 border border-zinc-900 px-2.5 py-1 flex items-center gap-1 uppercase transition-colors select-none self-start sm:self-auto"
                  >
                    <span>STEAM PROFILE</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-zinc-950 p-3 border border-zinc-900 space-y-1">
                    <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                      {lang === 'ru' ? 'ОБЩЕЕ ВРЕМЯ НА СЕРВЕРАХ' : 'TOTAL TRACKED HOURS'}
                    </span>
                    <span className="text-base font-black font-mono text-amber-500 block">
                      {result.playtime} ч.
                    </span>
                  </div>

                  <div className="bg-zinc-950 p-3 border border-zinc-900 space-y-1">
                    <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                      {lang === 'ru' ? 'ТЕКУЩИЙ СТАТУС' : 'CURRENT STATUS'}
                    </span>
                    <span className={`text-xs font-black font-mono block uppercase tracking-wide flex items-center gap-1.5 mt-1 ${
                      result.activeServer ? 'text-[#10b981]' : 'text-zinc-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${result.activeServer ? 'bg-[#10b981] animate-pulse' : 'bg-zinc-600'}`} />
                      {result.activeServer ? (lang === 'ru' ? 'В ИГРЕ' : 'PLAYING') : (lang === 'ru' ? 'ОФФЛАЙН' : 'OFFLINE')}
                    </span>
                  </div>

                  <div className="bg-zinc-950 p-3 border border-zinc-900 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                      {lang === 'ru' ? 'ПЕРВЫЙ СЕССИОННЫЙ СЛЕД' : 'FIRST DISCOVERED'}
                    </span>
                    <span className="text-xs font-bold font-mono text-zinc-400 block mt-1">
                      {new Date(result.createdAt).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}
                    </span>
                  </div>
                </div>

                {/* Active Server Info */}
                {result.activeServer && (
                  <div className="bg-[#10b981]/5 border border-[#10b981]/20 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono font-black text-emerald-500 uppercase tracking-widest block">
                        {lang === 'ru' ? '⚡ АКТИВНЫЙ СЕРВЕР ПРЯМО СЕЙЧАС' : '⚡ CURRENTLY SEEN ONLINE ON'}
                      </span>
                      <span className="text-xs font-bold text-white block font-mono">
                        {result.activeServer.name}
                      </span>
                    </div>
                    {result.activeServer.ip && (
                      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-950 px-2 py-1 border border-zinc-900">
                        client.connect {result.activeServer.ip}:{result.activeServer.port || '28015'}
                      </span>
                    )}
                  </div>
                )}

                {/* History list */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Server size={11} className="text-zinc-500" />
                    {lang === 'ru' ? 'ИСТОРИЯ ПОСЕЩЕНИЯ ИГРОВЫХ СЕРВЕРОВ' : 'RUST SERVER VISIT HISTORY'}
                  </h5>

                  <div className="overflow-x-auto border border-zinc-900">
                    <table className="min-w-full divide-y divide-zinc-900 text-left text-[11px] font-mono">
                      <thead className="bg-zinc-950 text-zinc-500 font-bold uppercase tracking-wider text-[8px]">
                        <tr>
                          <th className="p-3">{lang === 'ru' ? 'НАЗВАНИЕ СЕРВЕРА' : 'SERVER NAME'}</th>
                          <th className="p-3">{lang === 'ru' ? 'ПЕРВЫЙ ВХОД' : 'FIRST JOINED'}</th>
                          <th className="p-3">{lang === 'ru' ? 'ПОСЛЕДНИЙ ВИЗИТ' : 'LAST ACTIVE'}</th>
                          <th className="p-3 text-right">{lang === 'ru' ? 'НАИГРАНО' : 'PLAYED'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-zinc-300">
                        {result.history && result.history.length > 0 ? (
                          result.history.map((row, i) => (
                            <tr key={i} className="hover:bg-zinc-900/30">
                              <td className="p-3 font-bold text-zinc-200">{row.serverName}</td>
                              <td className="p-3 text-zinc-400">{new Date(row.firstSeen).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}</td>
                              <td className="p-3 text-zinc-400">{new Date(row.lastPlayed).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' })}</td>
                              <td className="p-3 text-right font-bold text-amber-500">{row.timePlayed}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-zinc-500">
                              {lang === 'ru' ? 'История посещений скрыта или отсутствует.' : 'No detailed visit logs found.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono">
                  <HelpCircle size={10} />
                  <span>
                    {lang === 'ru' 
                      ? 'Вся информация предоставлена на основе публичных сессионных логов BattleMetrics.' 
                      : 'Data is synchronized via open-access BattleMetrics session databases.'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
