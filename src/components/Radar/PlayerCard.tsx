import React, { useState } from 'react';
import { Clock, MapPin, Trash2, History, Activity, ExternalLink, MoreVertical } from 'lucide-react';
import { RadarPlayer } from '../../types';
import { NameHistoryModal } from './NameHistoryModal';
import { SessionsModal } from './SessionsModal';

interface PlayerCardProps {
  player: RadarPlayer;
  onRemove: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onRemove }) => {
  const [showNames, setShowNames] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  const isOnline = player.currentStatus === 'online';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group relative">
      {/* Status Bar */}
      <div className={`h-1 w-full ${isOnline ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
      
      <div className="p-5">
        <div className="flex gap-4 items-start mb-4">
          <div className="relative">
            <img 
              src={player.avatar || 'https://via.placeholder.com/150'} 
              alt={player.currentName}
              className="w-14 h-14 rounded-lg object-cover bg-zinc-800"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 ${
              isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-500'
            }`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-zinc-100 font-bold truncate group-hover:text-orange-500 transition-colors">
              {player.currentName}
            </h4>
            <p className="text-zinc-500 text-xs font-mono truncate mb-1">
              {player.steamId}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                isOnline ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {isOnline ? 'В сети' : 'Не в сети'}
              </span>
            </div>
          </div>

          <button 
            onClick={onRemove}
            className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Удалить из отслеживания"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {isOnline && player.currentServer && (
          <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-500 mb-1">
              <MapPin size={14} />
              <span className="text-xs font-bold uppercase tracking-tight truncate">
                {player.currentServer.name}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-500">
              <span>{player.currentServer.ip}</span>
              <span className="font-mono">{player.currentServer.players}/{player.currentServer.maxPlayers}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2 bg-zinc-800/50 rounded-lg text-center">
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Время за 48ч</div>
            <div className="text-zinc-200 text-xs font-bold flex items-center justify-center gap-1">
              <Clock size={12} className="text-orange-500" />
              {formatTime(player.totalPlayTime || 0)}
            </div>
          </div>
          <div className="p-2 bg-zinc-800/50 rounded-lg text-center">
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Сессий</div>
            <div className="text-zinc-200 text-xs font-bold flex items-center justify-center gap-1">
              <Activity size={12} className="text-blue-500" />
              {player.totalSessions || 0}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowNames(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors"
          >
            <History size={14} />
            Имена
          </button>
          <button
            onClick={() => setShowSessions(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors"
          >
            <Activity size={14} />
            Сессии
          </button>
        </div>
      </div>

      <NameHistoryModal 
        isOpen={showNames} 
        onClose={() => setShowNames(false)} 
        playerId={player.id} 
      />
      <SessionsModal 
        isOpen={showSessions} 
        onClose={() => setShowSessions(false)} 
        playerId={player.id} 
      />
    </div>
  );
};

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes} м`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const h = hours % 24;
    return `${days} д ${h} ч`;
  }
  return `${hours} ч ${mins} м`;
};
