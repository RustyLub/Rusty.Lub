import React, { useState, useEffect } from 'react';
import { X, Activity, Clock, Loader2, MapPin, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { auth } from '../../firebase';
import { SessionEntry } from '../../types';

interface SessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerId: string;
}

export const SessionsModal: React.FC<SessionsModalProps> = ({ isOpen, onClose, playerId }) => {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'sessions' | 'summary'>('sessions');

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen, playerId]);

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

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = getCustomToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`/api/radar/player/${playerId}/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSessions(response.data.sessions);
      }
    } catch (err) {
      console.error('Sessions fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSummary = () => {
    const serverMap = new Map<string, number>();
    let totalMinutes = 0;
    
    sessions.forEach(s => {
      const mins = Math.floor((s.durationSeconds || 0) / 60);
      totalMinutes += mins;
      serverMap.set(s.serverName, (serverMap.get(s.serverName) || 0) + mins);
    });

    const topServers = Array.from(serverMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { totalMinutes, topServers };
  };

  const summary = getSummary();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-100 font-bold">
            <Activity size={18} className="text-blue-500" />
            Статистика сессий (48ч)
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setTab('sessions')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              tab === 'sessions' ? 'text-blue-500 bg-blue-500/5' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Список сессий
          </button>
          <button
            onClick={() => setTab('summary')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              tab === 'summary' ? 'text-blue-500 bg-blue-500/5' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Сводка
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="text-blue-500 animate-spin" />
              <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Анализ сессий...</span>
            </div>
          ) : sessions.length > 0 ? (
            <AnimatePresence mode="wait">
              {tab === 'sessions' ? (
                <motion.div
                  key="sessions-list"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {sessions.map((session, i) => (
                    <div key={i} className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                      <div className="flex items-center gap-2 text-zinc-200 font-bold mb-2 truncate">
                        <MapPin size={14} className="text-blue-500 shrink-0" />
                        {session.serverName}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <Clock size={10} />
                            Вход: {new Date(session.sessionStart).toLocaleString('ru-RU')}
                          </div>
                          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <Clock size={10} />
                            Выход: {session.sessionEnd ? new Date(session.sessionEnd).toLocaleString('ru-RU') : 'В игре'}
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-zinc-900 rounded text-blue-500 font-mono text-xs font-bold">
                          {formatDuration(session.durationSeconds || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="summary-view"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-800/50 rounded-2xl text-center border border-zinc-700/30">
                      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Всего времени</div>
                      <div className="text-2xl font-black text-blue-500">{formatTime(summary.totalMinutes)}</div>
                    </div>
                    <div className="p-4 bg-zinc-800/50 rounded-2xl text-center border border-zinc-700/30">
                      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Всего сессий</div>
                      <div className="text-2xl font-black text-zinc-100">{sessions.length}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <BarChart3 size={14} />
                      Топ серверов
                    </h4>
                    <div className="space-y-3">
                      {summary.topServers.map(([name, mins], i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-zinc-300 truncate pr-4">{name}</span>
                            <span className="text-blue-500 whitespace-nowrap">{formatTime(mins)}</span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(mins / summary.totalMinutes) * 100}%` }}
                              className="h-full bg-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="text-center py-20 text-zinc-500">
              <Activity size={48} className="mx-auto mb-4 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest">История сессий пока пуста</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const formatDuration = (seconds: number) => {
  if (seconds === 0) return '---';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}м`;
  const hrs = Math.floor(mins / 60);
  const m = mins % 60;
  return `${hrs}ч ${m}м`;
};

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes} м`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} ч ${mins} м`;
};
