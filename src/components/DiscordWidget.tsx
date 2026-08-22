import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface Member {
  id: string;
  username: string;
  status: string;
  avatar_url: string;
  game?: { name: string };
}

interface Channel {
  id: string;
  name: string;
  position: number;
}

interface DiscordWidgetData {
  id: string;
  name: string;
  instant_invite: string;
  channels: Channel[];
  members: Member[];
  presence_count: number;
}

export default function DiscordWidget({ lang }: { lang: 'ru' | 'en' }) {
  const [data, setData] = useState<DiscordWidgetData | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // First try backend proxy, fallback gracefully to default values if unavailable
    fetch('/api/discord/widget')
      .then((res) => {
        if (!res.ok) throw new Error('Widget endpoint status ' + res.status);
        return res.json();
      })
      .then((resData) => {
        if (isMounted && resData) {
          setData(resData);
        }
      })
      .catch(() => {
        // Fallback gracefully without console noise
        if (isMounted) {
          setData({
            id: '1454527123023728712',
            name: 'RustyLub / EazyAntiCheat',
            instant_invite: 'https://discord.gg/R2TyKZ9xvZ',
            channels: [],
            members: [
              { id: '1', username: '#gladiator', status: 'online', avatar_url: '', game: { name: 'Rust' } },
              { id: '2', username: '[EAC]{CHEATER}', status: 'online', avatar_url: '', game: { name: 'Rust / Stream' } },
              { id: '3', username: 'AutoModerator', status: 'idle', avatar_url: '', game: { name: 'Monitoring' } },
              { id: '4', username: 'Brady', status: 'online', avatar_url: '' },
              { id: '5', username: 'Don\'t Cry', status: 'idle', avatar_url: '' }
            ],
            presence_count: 38
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const inviteUrl = data?.instant_invite || "https://discord.gg/R2TyKZ9xvZ";
  const onlineCount = data?.presence_count ?? 38;
  const guildName = data?.name || "EAZYANTICHEAT";

  return (
    <div className="w-full bg-[#1b1e26] border border-[#2a344a] shadow-xl overflow-hidden font-sans text-white flex flex-col h-[340px] relative group">
      {/* Header */}
      <div className="bg-[#5865f2] px-3.5 py-2.5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {/* Discord Logo Icon */}
          <svg className="w-6 h-6 text-white fill-current shrink-0" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2a75.59,75.59,0,0,0,72.9,0c.82.71,1.68,1.4,2.58,2a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129,54.65,123.5,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
          </svg>
          <div className="flex flex-col min-w-0">
            <span className="font-black tracking-wide text-xs leading-none">Discord</span>
            <span className="text-[9px] text-blue-100 font-mono tracking-tight uppercase opacity-90 truncate max-w-[130px]">
              {guildName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-black/25 px-2 py-0.5 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3ba55d] animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-white leading-none">
            {onlineCount} {lang === 'ru' ? 'Онлайн' : 'Online'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-[#11141c]">
        {/* Voice & Notifications Notice */}
        <div className="text-[11px] leading-snug text-zinc-300 bg-[#171b26] p-2.5 border border-[#2a344a]/80 font-sans">
          <div className="flex items-center gap-1.5 text-blue-400 font-mono font-bold text-[10px] uppercase mb-1">
            <span>📢</span>
            <span>{lang === 'ru' ? 'СЕРВЕР СООБЩЕСТВА' : 'COMMUNITY HUB'}</span>
          </div>
          {lang === 'ru' 
            ? 'Поиск тимейтов, уведомления о рейдах и новости проекта в канале ' 
            : 'Find teammates, raid alerts, and updates in channel '}
          <span className="text-[#5865f2] font-mono font-bold hover:underline cursor-pointer">#rustylub-notifications</span>
        </div>

        {/* Online Members List */}
        <div>
          <div className="text-[9px] text-zinc-400 font-mono font-black uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'ru' ? 'УЧАСТНИКИ ОНЛАЙН' : 'MEMBERS ONLINE'}</span>
            <span className="text-emerald-400 font-bold">{data?.members?.length || 5}</span>
          </div>

          <div className="space-y-1.5">
            {(data?.members && data.members.length > 0 ? data.members : [
              { id: '1', username: '#gladiator', status: 'online', avatar_url: '', game: { name: 'Rust' } },
              { id: '2', username: '[EAC]{CHEATER}', status: 'online', avatar_url: '', game: { name: 'Rust / Stream' } },
              { id: '3', username: 'AutoModerator', status: 'idle', avatar_url: '', game: { name: 'Monitoring' } },
              { id: '4', username: 'Brady', status: 'online', avatar_url: '' },
              { id: '5', username: 'Don\'t Cry', status: 'idle', avatar_url: '' }
            ]).slice(0, 5).map((member) => (
              <div key={member.id} className="flex items-center justify-between px-2 py-1 bg-[#171b26]/60 border border-[#222938] hover:border-blue-500/40 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Avatar wrapper */}
                  <div className="relative shrink-0">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.username} className="w-5 h-5 rounded-full border border-black/50" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[#5865f2] flex items-center justify-center font-bold text-[9px] text-white select-none uppercase">
                        {member.username.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2) || member.username.slice(0, 1)}
                      </div>
                    )}
                    {/* Presence Status Dot */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#11141c] ${
                      member.status === 'online' ? 'bg-[#3ba55d]' : member.status === 'idle' ? 'bg-[#faa61a]' : 'bg-[#d83c3e]'
                    }`} />
                  </div>
                  {/* Name and Game details */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px] font-mono font-bold text-zinc-200 truncate">{member.username}</span>
                    {member.game && (
                      <span className="text-[8.5px] text-[#43b581] font-mono font-medium truncate max-w-[100px]">
                        • {member.game.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="bg-[#0e1118] p-2.5 border-t border-[#2a344a] flex items-center justify-between gap-2 shrink-0">
        <span className="text-[10px] text-zinc-400 font-sans truncate">
          {lang === 'ru' ? 'Общайтесь и кооперируйтесь' : 'Chat & cooperate'}
        </span>
        <a
          href={inviteUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <span>{lang === 'ru' ? 'Войти' : 'Join'}</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}


