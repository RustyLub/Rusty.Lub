import React from 'react';
import { Lock } from 'lucide-react';

interface ToolsHubTabProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
  isVip: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  onOpenVip: () => void;
}

export default function ToolsHubTab({ lang, onNavigate, isVip, isAdmin, isOwner, onOpenVip }: ToolsHubTabProps) {
  const publicTools = [
    {
      id: 'raid',
      icon: '💥',
      title: 'Raid Calculator',
      desc: lang === 'ru' ? 'Расчёт стоимости рейда: C4, ракеты, сатчели, взрывные' : 'C4 · rockets · satchels · explosive ammo',
      tag: 'Hot'
    },
    {
      id: 'ecoraid',
      icon: '🌿',
      title: 'Eco-Raid & Weak Side',
      desc: lang === 'ru' ? 'Эконом-рейд и слабые стороны построек' : 'Soft side exploitation and cheap raid routes',
      tag: 'Popular'
    },
    {
      id: 'decay',
      icon: '⏱️',
      title: 'Decay Timer',
      desc: lang === 'ru' ? 'Таймеры гниения построек без апкипа TC' : 'Upkeep & structure decay calculation',
    },
    {
      id: 'electrical',
      icon: '⚡',
      title: 'Electricity Simulator',
      desc: lang === 'ru' ? 'Энергосхемы, ветряки, батареи и автодвери' : 'Power circuits, solar, batteries & auto-doors',
    },
    {
      id: 'mixing',
      icon: '🧪',
      title: 'Mixing Table (Tea)',
      desc: lang === 'ru' ? 'Рецепты всех чаёв, баффов и крафта' : 'Tea recipes, buff multipliers and crafting',
    },
    {
      id: 'breeder',
      icon: '🌾',
      title: 'Farming & Genetics',
      desc: lang === 'ru' ? 'Грядки, скрещивание генов G/Y/H и автополив' : 'Berry genetics, crossbreeding and irrigation',
    },
    {
      id: 'recycler',
      icon: '♻️',
      title: 'Recycling Calculator',
      desc: lang === 'ru' ? 'Выход скрапа и компонентов с переработчика' : 'Scrap & component yield per item',
    },
    {
      id: 'quarry',
      icon: '⛏️',
      title: 'Mining & Excavator',
      desc: lang === 'ru' ? 'Добыча руды, карьеры и расход дизеля' : 'Excavator, quarries & diesel fuel yield',
    },
    {
      id: 'binds',
      icon: '⌨️',
      title: 'Keybinds Generator',
      desc: lang === 'ru' ? 'Генератор и библиотека макро-биндов' : 'PVP, building and farm bind generator',
    }
  ];

  const specialTools = [
    {
      id: 'radar',
      icon: '📡',
      title: 'Player Radar',
      desc: lang === 'ru' ? 'Отслеживание онлайна и серверов игроков' : 'Track enemy player online status & servers',
      tag: 'VIP',
      roleReq: 'vip' as const
    },
    ...(isOwner ? [{
      id: 'rustplus',
      icon: '📱',
      title: 'Rust+ Bot Hub',
      desc: lang === 'ru' ? 'Управление умными устройствами базы (Owner)' : 'Smart base device control & alarms (Owner)',
      tag: 'OWNER',
      roleReq: 'owner' as const
    }] : []),
    ...(isAdmin ? [
      {
        id: 'icons',
        icon: '🖼️',
        title: 'Rust Icons',
        desc: lang === 'ru' ? 'База предметов и текстур высокого разрешения' : 'HD item icons and prefab database',
        tag: 'ADMIN',
        roleReq: 'admin' as const
      },
      {
        id: 'admin',
        icon: '🛡️',
        title: 'Admin Panel',
        desc: lang === 'ru' ? 'Панель управления порталом и пользователями' : 'Portal management & user administration',
        tag: 'ADMIN',
        roleReq: 'admin' as const
      }
    ] : [])
  ];

  return (
    <div className="space-y-10 text-left pb-12">
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-[#f97316]">
          {lang === 'ru' ? 'Инструменты' : 'Tools'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#eef2f7]">
          {lang === 'ru' ? 'Калькуляторы и утилиты' : 'Calculators & Utilities'}
        </h1>
        <p className="text-sm text-[#8b95a8] max-w-xl">
          {lang === 'ru' 
            ? 'Полный набор тактических инструментов для оптимизации вайпа и экономии времени.' 
            : 'Complete set of tactical utilities and calculators updated for the current patch.'}
        </p>
      </div>

      {/* Public Tools Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-[#8b95a8] uppercase tracking-widest pl-2 border-l-2 border-[#f97316]">
          {lang === 'ru' ? 'КАЛЬКУЛЯТОРЫ И ФАРМ' : 'CALCULATORS & FARM'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="p-5 rounded-2xl bg-[#12161e] border border-[#1e2633] hover:border-[#f97316] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>
                  {tool.tag && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                      tool.tag === 'Hot' ? 'bg-[#ef4444] text-white' : 'bg-[#3b82f6] text-white'
                    }`}>
                      {tool.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-[#f97316] transition-colors mb-1">
                  {tool.title}
                </h3>
                <p className="text-xs text-[#8b95a8] leading-relaxed">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1e2633] flex items-center justify-between text-xs font-semibold text-[#f97316] group-hover:translate-x-0.5 transition-transform">
                <span>{lang === 'ru' ? 'Открыть' : 'Open'}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Access Tools Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-[#ef4444] uppercase tracking-widest pl-2 border-l-2 border-[#ef4444]">
          {lang === 'ru' ? 'СПЕЦИАЛЬНЫЙ ДОСТУП' : 'SPECIAL ACCESS'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialTools.map((tool) => {
            const isLocked = tool.roleReq === 'vip' && !isVip;
            return (
              <div
                key={tool.id}
                onClick={() => {
                  if (isLocked) {
                    onOpenVip();
                  } else {
                    onNavigate(tool.id);
                  }
                }}
                className={`p-5 rounded-2xl bg-[#12161e] border border-[#1e2633] transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                  isLocked 
                    ? 'opacity-80 hover:border-[#ef4444] hover:bg-[#ef4444]/5 hover:-translate-y-1'
                    : 'hover:border-[#f97316] hover:-translate-y-1 hover:shadow-xl'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform ${
                      isLocked ? 'bg-[#ef4444]/10 opacity-70 grayscale' : 'bg-[#f97316]/10'
                    }`}>
                      {tool.icon}
                    </div>
                    {tool.tag && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${
                        tool.tag === 'VIP' ? 'bg-[#f59e0b] text-black' : 
                        tool.tag === 'OWNER' ? 'bg-[#8b5cf6] text-white' : 
                        'bg-[#ef4444] text-white'
                      }`}>
                        {isLocked && <Lock size={10} />}
                        {tool.tag}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-bold transition-colors mb-1 flex items-center gap-2 ${
                    isLocked ? 'text-[#8b95a8] group-hover:text-[#ef4444]' : 'text-[#eef2f7] group-hover:text-[#f97316]'
                  }`}>
                    {tool.title}
                  </h3>
                  <p className="text-xs text-[#8b95a8] leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className={`mt-4 pt-3 border-t border-[#1e2633] flex items-center justify-between text-xs font-semibold group-hover:translate-x-0.5 transition-transform ${
                  isLocked ? 'text-[#ef4444]' : 'text-[#f97316]'
                }`}>
                  <span>{isLocked ? (lang === 'ru' ? 'Требуется VIP' : 'VIP Required') : (lang === 'ru' ? 'Открыть' : 'Open')}</span>
                  {isLocked ? <Lock size={12} /> : <span>→</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
