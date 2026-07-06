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
    fetch('https://discord.com/api/guilds/1454527123023728712/widget.json')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => console.error('Failed to load Discord widget data:', err));
  }, []);

  const inviteUrl = data?.instant_invite || "https://discord.gg/R2TyKZ9xvZ";
  const onlineCount = data?.presence_count ?? 0;
  const guildName = data?.name || "EazyAntiCheat";

  return (
    <div className="w-full bg-[#2f3136] rounded-md shadow-xl overflow-hidden font-sans border border-[#202225] text-white flex flex-col h-[520px] max-w-sm md:max-w-xs relative">
      {/* Header */}
      <div className="bg-[#5865f2] p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {/* Discord Logo Icon */}
          <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2a75.59,75.59,0,0,0,72.9,0c.82.71,1.68,1.4,2.58,2a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129,54.65,123.5,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wide text-sm leading-none">Discord</span>
            <span className="text-[10px] text-blue-100 font-medium tracking-tight mt-0.5 uppercase opacity-95">
              {guildName}
            </span>
          </div>
        </div>
        <div className="text-right flex flex-col justify-center">
          <span className="text-[11px] font-bold tracking-wide text-white bg-[#4f545c]/30 px-2 py-1 rounded-sm leading-none">
            {onlineCount} {lang === 'ru' ? 'В сети' : 'Online'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 custom-scrollbar bg-[#2f3136]">
        
        {/* Voice Channels Section */}
        <div>
          <div className="text-[11px] text-[#8e9297] font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'ru' ? 'РАЗГОВОРНЫЕ КАНАЛЫ' : 'VOICE CHANNELS'}</span>
          </div>
          
          <div className="space-y-1">
            {data?.channels ? data.channels.map((ch) => {
              if (ch.name.includes('D U O team')) {
                return (
                  <div key={ch.id} className="text-[13px] leading-snug text-[#b9bbbe] bg-[#34363c]/50 p-2.5 rounded-md border border-[#202225] mt-2 mb-2 font-medium">
                    Присоединяйтесь к нашему дискорд серверу для поиска команды или же узнавайте новости проекта в дискорд разделе <span className="text-[#5865f2] font-bold cursor-pointer hover:underline">#rustylub-notifications</span>
                  </div>
                );
              }
              return (
                <div 
                  key={ch.id} 
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#b9bbbe] hover:text-[#dcddde] hover:bg-[#34363c] cursor-pointer group transition-all duration-150"
                >
                  {/* Voice Icon */}
                  <svg className="w-[18px] h-[18px] text-[#8e9297] group-hover:text-[#dcddde] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span className="font-medium text-[13.5px] truncate">{ch.name}</span>
                </div>
              );
            }) : (
              <div className="text-[13px] leading-snug text-[#b9bbbe] bg-[#34363c]/50 p-2.5 rounded-md border border-[#202225] mt-2 mb-2 font-medium">
                Присоединяйтесь к нашему дискорд серверу для поиска команды или же узнавайте новости проекта в дискорд разделе <span className="text-[#5865f2] font-bold cursor-pointer hover:underline">#rustylub-notifications</span>
              </div>
            )}
          </div>
        </div>

        {/* Online Members List */}
        <div>
          <div className="text-[11px] text-[#8e9297] font-bold uppercase tracking-wider mb-2.5">
            {lang === 'ru' ? 'УЧАСТНИКИ ОНЛАЙН' : 'MEMBERS ONLINE'}
          </div>

          <div className="space-y-2.5">
            {data?.members?.map((member) => (
              <div key={member.id} className="flex items-center justify-between group px-1 py-0.5 rounded hover:bg-[#34363c]/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar wrapper */}
                  <div className="relative shrink-0">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.username} className="w-8 h-8 rounded-full border border-[#202225] shadow-inner" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center font-bold text-xs text-white border border-[#202225] select-none uppercase shadow-inner">
                        {member.username.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2) || member.username.slice(0, 1)}
                      </div>
                    )}
                    {/* Presence Status Dot */}
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2f3136] ${
                      member.status === 'online' ? 'bg-[#3ba55d]' : member.status === 'idle' ? 'bg-[#faa61a]' : 'bg-[#d83c3e]'
                    }`} />
                  </div>
                  {/* Name and Game details */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13.5px] font-medium text-[#dcddde] group-hover:text-white truncate">{member.username}</span>
                    {member.game && (
                      <span className="text-[10px] text-[#43b581] font-bold uppercase tracking-wider leading-none mt-0.5 truncate max-w-[120px]">
                        {lang === 'ru' ? 'Играет в ' : 'Playing '} {member.game.name}
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
      <div className="bg-[#202225] p-3 border-t border-[#1a1c1e] flex items-center justify-between gap-3 shrink-0">
        <span className="text-[11px] text-[#72767d] leading-snug font-medium max-w-[150px]">
          {lang === 'ru' ? 'Общайтесь с людьми, которые понимают' : 'Hangout with people who get it'}
        </span>
        <a
          href={inviteUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a5] text-white px-3.5 py-2 rounded-[3px] text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none shadow-md hover:shadow-lg"
        >
          <span>{lang === 'ru' ? 'Присоединиться' : 'Join Discord'}</span>
          <ExternalLink size={12} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}


