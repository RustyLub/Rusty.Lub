import React from 'react';
import { Lock, ArrowRight, Shield, Award, Sparkles, AlertCircle } from 'lucide-react';

interface ToolsHubTabProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
  isVip: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  onOpenVip: () => void;
}

export default function ToolsHubTab({ lang, onNavigate, isVip, isAdmin, isOwner, onOpenVip }: ToolsHubTabProps) {
  // Public tools that everyone can see and click
  const publicTools = [
    {
      id: 'raid',
      icon: '💥',
      title: lang === 'ru' ? 'Калькулятор Рейда' : 'Raid Calculator',
      desc: lang === 'ru' ? 'Расчёт стоимости рейда: C4, ракеты, сатчели, взрывные' : 'C4 · rockets · satchels · explosive ammo',
      tag: 'Hot'
    },
    {
      id: 'ecoraid',
      icon: '🌿',
      title: lang === 'ru' ? 'Эко-Рейд & Soft Side' : 'Eco-Raid & Weak Side',
      desc: lang === 'ru' ? 'Эконом-рейд и слабые стороны построек' : 'Soft side exploitation and cheap raid routes',
      tag: 'Popular'
    },
    {
      id: 'decay',
      icon: '⏱️',
      title: lang === 'ru' ? 'Таймер гниения' : 'Decay Timer',
      desc: lang === 'ru' ? 'Таймеры гниения построек без апкипа TC' : 'Upkeep & structure decay calculation',
    },
    {
      id: 'electrical',
      icon: '⚡',
      title: lang === 'ru' ? 'Электрика & Авто-двери' : 'Electricity Simulator',
      desc: lang === 'ru' ? 'Энергосхемы, ветряки, батареи и автодвери' : 'Power circuits, solar, batteries & auto-doors',
    },
    {
      id: 'mixing',
      icon: '🧪',
      title: 'Mixing Table (Tea)',
      desc: lang === 'ru' ? 'Рецепты всех чаёв, баффов и крафта предметов' : 'Tea recipes, buff multipliers and crafting',
    },
    {
      id: 'breeder',
      icon: '🌾',
      title: lang === 'ru' ? 'Селекция растений' : 'Farming & Genetics',
      desc: lang === 'ru' ? 'Грядки, скрещивание генов G/Y/H и автополив' : 'Berry genetics, crossbreeding and irrigation',
    },
    {
      id: 'recycler',
      icon: '♻️',
      title: lang === 'ru' ? 'Калькулятор Переработки' : 'Recycling Calculator',
      desc: lang === 'ru' ? 'Выход скрапа и компонентов с переработчика' : 'Scrap & component yield per item',
    },
    {
      id: 'quarry',
      icon: '⛏️',
      title: lang === 'ru' ? 'Карьеры & Экскаватор' : 'Mining & Excavator',
      desc: lang === 'ru' ? 'Добыча руды, карьеры и расход дизеля' : 'Excavator, quarries & diesel fuel yield',
    },
    {
      id: 'binds',
      icon: '⌨️',
      title: lang === 'ru' ? 'Генератор Биндов' : 'Keybinds Generator',
      desc: lang === 'ru' ? 'Генератор и библиотека макро-биндов F1' : 'PVP, building and farm bind generator',
    }
  ];

  // Special Access / Role-gated tools list
  const specialTools = [];

  // PLAYER RADAR is visible to everyone, but locked for non-VIP
  specialTools.push({
    id: 'radar',
    icon: '📡',
    title: lang === 'ru' ? 'Player Radar' : 'Player Radar',
    desc: lang === 'ru' ? 'Отслеживание онлайна и серверов игроков' : 'Track enemy player online status & servers',
    tag: 'VIP',
    isLocked: !isVip,
    badgeColor: 'bg-[#f59e0b] text-black font-extrabold'
  });

  if (isOwner) {
    specialTools.push({
      id: 'rustplus',
      icon: '📱',
      title: lang === 'ru' ? 'Rust+ Бот Хаб' : 'Rust+ Bot Hub',
      desc: lang === 'ru' ? 'Управление умными устройствами и оповещения' : 'Manage smart devices & raid notifications',
      tag: 'OWNER',
      isLocked: false,
      badgeColor: 'bg-red-600 text-white font-extrabold'
    });
  }

  if (isAdmin) {
    specialTools.push({
      id: 'icons',
      icon: '🖼️',
      title: lang === 'ru' ? 'База иконок' : 'Rust Icons Database',
      desc: lang === 'ru' ? 'База предметов и текстур высокого разрешения' : 'HD item icons and prefab database',
      tag: 'ADMIN',
      isLocked: false,
      badgeColor: 'bg-purple-600 text-white font-extrabold'
    });
    specialTools.push({
      id: 'admin',
      icon: '🛡️',
      title: lang === 'ru' ? 'Панель администратора' : 'Admin Panel',
      desc: lang === 'ru' ? 'Управление пользователями, новостями и логами' : 'Manage users, news, and activity logs',
      tag: 'ADMIN',
      isLocked: false,
      badgeColor: 'bg-indigo-600 text-white font-extrabold'
    });
  }

  return (
    <div className="space-y-8 text-left pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-[#f97316] font-mono flex items-center gap-1.5">
          <Sparkles size={12} className="animate-pulse" />
          <span>{lang === 'ru' ? 'Инструменты' : 'Tools'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#eef2f7]">
          {lang === 'ru' ? 'Калькулятор и утилиты' : 'Calculators & Utilities'}
        </h1>
        <p className="text-sm text-[#8b95a8] max-w-xl">
          {lang === 'ru' 
            ? 'Полный набор тактических инструментов для оптимизации вайпа и экономии времени.' 
            : 'Complete set of tactical utilities and calculators updated for the current patch.'}
        </p>
      </div>

      {/* SECTION 1: PUBLIC CALCULATORS */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-[#f97316]/80 uppercase tracking-widest font-mono border-b border-[#1e2633] pb-2">
          {lang === 'ru' ? '⚡ Калькуляторы и Базы знаний' : '⚡ Calculators & databases'}
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

      {/* SECTION 2: SPECIAL ACCESS */}
      {specialTools.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-xs font-black text-rose-500/80 uppercase tracking-widest font-mono border-b border-[#1e2633] pb-2 flex items-center gap-1.5">
            <Lock size={12} className="text-rose-500" />
            <span>{lang === 'ru' ? '🔒 Закрытые Разделы (Special Access)' : '🔒 Special Access Gated'}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialTools.map((tool) => {
              const handleClick = () => {
                if (tool.isLocked) {
                  onOpenVip();
                } else {
                  onNavigate(tool.id);
                }
              };

              return (
                <div
                  key={tool.id}
                  onClick={handleClick}
                  className={`p-5 rounded-2xl bg-[#12161e] border hover:shadow-xl cursor-pointer group flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
                    tool.isLocked 
                      ? 'border-[#2a2f3b] opacity-80 hover:opacity-100 hover:border-amber-500/40' 
                      : 'border-[#1e2633] hover:border-[#f97316]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-105 ${
                        tool.isLocked ? 'bg-amber-500/5 text-gray-500' : 'bg-[#f97316]/10'
                      }`}>
                        {tool.isLocked ? '🔒' : tool.icon}
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide ${tool.badgeColor}`}>
                          {tool.tag}
                        </span>
                        {tool.isLocked && (
                          <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-amber-500/20">
                            <Lock size={9} />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className={`text-base font-bold transition-colors mb-1 ${
                      tool.isLocked 
                        ? 'text-gray-400 group-hover:text-amber-500' 
                        : 'text-[#eef2f7] group-hover:text-[#f97316]'
                    }`}>
                      {tool.title}
                    </h3>
                    
                    <p className="text-xs text-[#8b95a8] leading-relaxed">
                      {tool.isLocked 
                        ? (lang === 'ru' 
                            ? 'Доступно только пользователям с VIP статусом. Нажмите для перехода в кабинет.' 
                            : 'Exclusively available for VIP survivors. Click to visit VIP Cabinet.')
                        : tool.desc
                      }
                    </p>
                  </div>
                  
                  <div className={`mt-4 pt-3 border-t border-[#1e2633] flex items-center justify-between text-xs font-semibold transition-transform group-hover:translate-x-0.5 ${
                    tool.isLocked ? 'text-amber-500' : 'text-[#f97316]'
                  }`}>
                    <span>
                      {tool.isLocked 
                        ? (lang === 'ru' ? 'Разблокировать в Кабинете' : 'Unlock in Cabinet') 
                        : (lang === 'ru' ? 'Открыть' : 'Open')
                      }
                    </span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
