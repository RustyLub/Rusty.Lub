import React, { useState, useEffect } from 'react';
import { Search, List, Activity, UserPlus, Trash2, Clock, MapPin, ExternalLink, ChevronRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../../firebase';
import axios from 'axios';
import { RadarPlayer } from '../../types';
import { io } from 'socket.io-client';
import { PlayerCard } from './PlayerCard';
import { PlayerSearch } from './PlayerSearch';

const socket = io();

export const PlayerRadar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'tracked'>('tracked');
  const [trackedPlayers, setTrackedPlayers] = useState<RadarPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrackedPlayers();

    socket.on('player_status_update', (data) => {
      setTrackedPlayers(prev => prev.map(p => 
        p.steamId === data.steamId 
          ? { ...p, currentStatus: data.status, currentServer: data.server, currentName: data.currentName }
          : p
      ));
    });

    socket.on('new_name', (data) => {
      setTrackedPlayers(prev => prev.map(p => 
        p.steamId === data.steamId 
          ? { ...p, currentName: data.newName }
          : p
      ));
    });

    return () => {
      socket.off('player_status_update');
      socket.off('new_name');
    };
  }, []);

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

  const fetchTrackedPlayers = async () => {
    const token = getCustomToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get('/api/radar/tracked', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTrackedPlayers(response.data.players);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    const token = getCustomToken();
    if (!token) return;
    try {
      await axios.delete(`/api/radar/track/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrackedPlayers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-[600px] bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
      {/* Header Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/80">
        <button
          onClick={() => setActiveTab('tracked')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
            activeTab === 'tracked' ? 'text-orange-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <List size={18} />
          Мои игроки ({trackedPlayers.length})
          {activeTab === 'tracked' && (
            <motion.div layoutId="radar-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
            activeTab === 'search' ? 'text-orange-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Search size={18} />
          Поиск игрока
          {activeTab === 'search' && (
            <motion.div layoutId="radar-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'search' ? (
            <motion.div
              key="search-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PlayerSearch onPlayerAdded={fetchTrackedPlayers} />
            </motion.div>
          ) : (
            <motion.div
              key="tracked-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-zinc-800/50 rounded-xl animate-pulse" />
                ))
              ) : trackedPlayers.length > 0 ? (
                trackedPlayers
                  .sort((a, b) => (a.currentStatus === 'online' ? -1 : 1))
                  .map(player => (
                    <PlayerCard 
                      key={player.id} 
                      player={player} 
                      onRemove={() => handleRemove(player.id)} 
                    />
                  ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 text-zinc-500 mb-4">
                    <Activity size={32} />
                  </div>
                  <h3 className="text-zinc-200 font-medium mb-2">Список пуст</h3>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    Добавьте игроков, чтобы отслеживать их онлайн-статус и историю серверов.
                  </p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm rounded-lg transition-colors"
                  >
                    Перейти к поиску
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
