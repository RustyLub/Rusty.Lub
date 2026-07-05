import React, { useState, useEffect } from 'react';
import { X, History, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { auth } from '../../firebase';
import { NameHistoryEntry } from '../../types';

interface NameHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerId: string;
}

export const NameHistoryModal: React.FC<NameHistoryModalProps> = ({ isOpen, onClose, playerId }) => {
  const [names, setNames] = useState<NameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
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

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = getCustomToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`/api/radar/player/${playerId}/names`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNames(response.data.names);
      }
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

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
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-100 font-bold">
            <History size={18} className="text-orange-500" />
            История имен (48ч)
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={32} className="text-orange-500 animate-spin" />
              <span className="text-zinc-500 text-sm">Загрузка истории...</span>
            </div>
          ) : names.length > 0 ? (
            <div className="space-y-3">
              {names.map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/30">
                  <span className="text-zinc-200 font-bold text-sm truncate pr-4">
                    {entry.playerName}
                  </span>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] whitespace-nowrap">
                    <Clock size={12} />
                    {new Date(entry.detectedAt).toLocaleString('ru-RU', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <History size={48} className="mx-auto mb-4 opacity-10" />
              <p className="text-sm">История имен пока пуста</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
            Данные обновляются автоматически
          </p>
        </div>
      </motion.div>
    </div>
  );
};
