import React, { useState } from 'react';
import { Search, UserPlus, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { auth } from '../../firebase';
import axios from 'axios';

interface PlayerSearchProps {
  onPlayerAdded: () => void;
}

export const PlayerSearch: React.FC<PlayerSearchProps> = ({ onPlayerAdded }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundPlayer, setFoundPlayer] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    try {
      setLoading(true);
      setError(null);
      setFoundPlayer(null);
      
      const response = await axios.post('/api/radar/search', { query });
      if (response.data.success) {
        setFoundPlayer(response.data.player);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Игрок не найден или ошибка API');
    } finally {
      setLoading(false);
    }
  };

  const getCustomToken = () => {
    try {
      const saved = localStorage.getItem('rust_survivor_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.uid || '';
      }
    } catch (e) {
      console.error(e);
    }
    return '';
  };

  const handleTrack = async () => {
    if (!foundPlayer) return;

    try {
      setTracking(true);
      const token = getCustomToken();
      if (!token) {
        setError('Вы должны войти в аккаунт для этого!');
        setTracking(false);
        return;
      }
      const response = await axios.post('/api/radar/track', {
        steamId: foundPlayer.steamId,
        battlemetricsId: foundPlayer.id,
        name: foundPlayer.name,
        avatar: foundPlayer.avatar
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setFoundPlayer(null);
        setQuery('');
        onPlayerAdded();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при добавлении игрока');
    } finally {
      setTracking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Найти игрока для отслеживания</h2>
        <p className="text-zinc-500 text-sm">
          Введите SteamID (17 цифр) или ссылку на профиль игрока в Steam.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative group mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="76561198110941835 или ссылка на Steam..."
          className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-4 pl-14 pr-32 text-zinc-100 focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-zinc-600 shadow-xl"
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors">
          <Search size={24} />
        </div>
        <button
          disabled={loading || !query}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Найти'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm animate-shake mb-6">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {foundPlayer && (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 flex items-center gap-6 animate-fade-in shadow-2xl">
          <img 
            src={foundPlayer.avatar} 
            alt={foundPlayer.name} 
            className="w-20 h-20 rounded-2xl object-cover bg-zinc-800 shadow-lg"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-zinc-100 mb-1">{foundPlayer.name}</h3>
            <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono mb-4">
              <span>{foundPlayer.steamId}</span>
              <a 
                href={`https://steamcommunity.com/profiles/${foundPlayer.steamId}`} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <button
              onClick={handleTrack}
              disabled={tracking}
              className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-200 hover:bg-white text-zinc-900 font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:bg-zinc-600"
            >
              {tracking ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              Начать отслеживание
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        {[
          { label: 'История имен', desc: 'Все никнеймы за 48ч' },
          { label: 'Серверные сессии', desc: 'Входы, выходы и время' },
          { label: 'Real-time статус', desc: 'Мгновенные уведомления' }
        ].map((item, i) => (
          <div key={i} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
            <div className="text-orange-500 font-bold text-sm mb-1">{item.label}</div>
            <div className="text-zinc-600 text-[10px] uppercase font-bold tracking-wider">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
