import React from 'react';
import { Lock, Sparkles, ChevronRight, Check } from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';
import { CustomUser } from '../types';

interface ToolsHubTabProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
  isVip: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  onOpenVip: () => void;
  currentUser?: CustomUser | null;
}

export default function ToolsHubTab({ 
  lang, 
  onNavigate, 
  isVip, 
  isAdmin, 
  isOwner, 
  onOpenVip,
  currentUser
}: ToolsHubTabProps) {
  
  // Public tools that everyone can see and click with genuine Rust item icon IDs
  const publicTools = [
    {
      id: 'raid',
      iconId: 'explosive.timed',
      title: lang === 'ru' ? 'Калькулятор Рейда' : 'Raid Calculator',
      desc: lang === 'ru' ? 'Расчёт взрывчатки, серы, угля и компонентов.' : 'Calculate sulfur, gunpowder, and component costs.',
      tag: 'Hot'
    },
    {
      id: 'ecoraid',
      iconId: 'pickaxe',
      title: lang === 'ru' ? 'Эко-Рейд & Soft Side' : 'Eco-Raid & Weak Side',
      desc: lang === 'ru' ? 'Рейд инструментами, слабые стороны строительных блоков.' : 'Cheap tool raiding routes and soft-side calculations.',
      tag: 'Popular'
    },
    {
      id: 'decay',
      iconId: 'cupboard.tool',
      title: lang === 'ru' ? 'Таймеры Гниения' : 'Decay Timer',
      desc: lang === 'ru' ? 'Время жизни базы без ресурсов в шкафу (TC).' : 'Upkeep lifetimes of wooden, stone, metal and armored bases.',
    },
    {
      id: 'electrical',
      iconId: 'generator.wind.scrap',
      title: lang === 'ru' ? 'Электрика & Схемы' : 'Electricity Simulator',
      desc: lang === 'ru' ? 'Схемы ветряков, умных выключателей и автодверей.' : 'Simulate solar arrays, batteries, and automated turrets.',
    },
    {
      id: 'mixing',
      iconId: 'mixingtable',
      title: lang === 'ru' ? 'Стол Смешивания (Чаи)' : 'Mixing Table',
      desc: lang === 'ru' ? 'Рецепты рудных, лечебных и фермерских чаёв.' : 'Craft tea recipes, buffs, ore multipliers and values.',
    },
    {
      id: 'breeder',
      iconId: 'seed.hemp',
      title: lang === 'ru' ? 'Селекция растений' : 'Farming & Genetics',
      desc: lang === 'ru' ? 'Скрещивание генов G/Y/H и сбор урожая ягод.' : 'Berry genetics crossbreeding simulation helper.',
    },
    {
      id: 'recycler',
      iconId: 'scrap',
      title: lang === 'ru' ? 'Калькулятор Переработки' : 'Recycling Calculator',
      desc: lang === 'ru' ? 'Выход ресурсов и скрапа при переработке предметов.' : 'Calculate scrap and high quality metal output from components.',
    },
    {
      id: 'binds',
      iconId: 'keycard_blue',
      title: lang === 'ru' ? 'Генератор Биндов' : 'Keybinds Generator',
      desc: lang === 'ru' ? 'Консольные команды выживания и бинды клавиш.' : 'Generate keyboard commands and F1 scripts.',
    },
    {
      id: 'quarry',
      iconId: 'jackhammer',
      title: lang === 'ru' ? 'Добыча руды & Карьеры' : 'Mining & Excavator',
      desc: lang === 'ru' ? 'Расчет добычи карьеров и расхода дизеля.' : 'Calculate diesel efficiency on giant excavators and quarries.'
    }
  ];

  // Special Access / Role-gated tools list with exact requested genuine Rust icons (strictly gated)
  const hasSpecialAccess = Boolean(currentUser && (isVip || isOwner || isAdmin));
  const visibleSpecialTools = [
    ...(currentUser && isVip ? [{
      id: 'radar',
      iconId: 'rf_pager',
      title: 'Player Radar',
      desc: lang === 'ru' 
        ? 'Отслеживание врагов на серверах, истории онлайна и активности баз.' 
        : 'Track enemy player online status and server histories.',
      tag: 'VIP',
      isLocked: false,
      badgeColor: 'bg-amber-500 text-black font-extrabold',
      borderClass: 'border-amber-200/80 hover:border-amber-500'
    }] : []),
    ...(currentUser && isOwner ? [{
      id: 'rustplus',
      iconId: 'smart.alarm',
      title: 'Rust+ Bot Hub',
      desc: lang === 'ru' 
        ? 'Удаленное управление умной базой: сирены рейда, турели.' 
        : 'Control smart devices, automatic sam sites, and raid sirens.',
      tag: 'OWNER',
      isLocked: false,
      badgeColor: 'bg-red-600 text-white font-extrabold',
      borderClass: 'border-red-200/80 hover:border-red-500'
    }] : []),
    ...(currentUser && isAdmin ? [
      {
        id: 'admin',
        iconId: 'lock.code',
        title: lang === 'ru' ? 'Панель Администратора' : 'Admin Panel',
        desc: lang === 'ru' 
          ? 'Панель администратора проекта для управления новостями, модерации чата.' 
          : 'Site administration, user database management, and news publisher.',
        tag: 'ADMIN',
        isLocked: false,
        badgeColor: 'bg-purple-600 text-white font-extrabold',
        borderClass: 'border-purple-200/80 hover:border-purple-500'
      },
      {
        id: 'icons',
        iconId: 'spraycan',
        title: lang === 'ru' ? 'Иконки Rust (ADMIN)' : 'Rust Icons Catalog',
        desc: lang === 'ru' 
          ? 'Библиотека внутриигровых спрайтов, иконок предметов и кодов.' 
          : 'Asset catalog of item sprite definitions and RustLabs image CDN IDs.',
        tag: 'ADMIN',
        isLocked: false,
        badgeColor: 'bg-emerald-600 text-white font-extrabold',
        borderClass: 'border-emerald-200/80 hover:border-emerald-500'
      }
    ] : [])
  ];

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-red-600 font-mono flex items-center gap-1.5">
          <Sparkles size={12} className="animate-pulse" />
          <span>{lang === 'ru' ? 'ПОРТАЛ ИНСТРУМЕНТОВ' : 'TACTICAL TOOLS PORTAL'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 uppercase">
          {lang === 'ru' ? 'Калькуляторы и утилиты' : 'Calculators & Utilities'}
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl font-medium">
          {lang === 'ru' 
            ? 'Полный набор тактических инструментов для оптимизации вайпа и экономии времени.' 
            : 'Complete set of tactical utilities and calculators updated for the current patch.'}
        </p>
      </div>

      {/* SECTION 1: PUBLIC CALCULATORS */}
      <div className="space-y-4">
        <h2 className="text-xs font-black text-neutral-400 uppercase tracking-widest font-mono border-b border-neutral-200 pb-2">
          {lang === 'ru' ? '⚡ Доступные калькуляторы' : '⚡ Public Utilities'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:border-red-500 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between group h-full will-change-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-neutral-800 flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-200">
                    <ItemImageOrFallback id={tool.iconId} lang={lang} size={36} />
                  </div>
                  {tool.tag && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                      tool.tag === 'Hot' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {tool.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-red-600 transition-colors mb-1.5">
                  {tool.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-red-600 group-hover:translate-x-0.5 transition-transform duration-200">
                <span>{lang === 'ru' ? 'Открыть утилиту' : 'Open utility'}</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SPECIAL ACCESS (ONLY VISIBLE IF AUTHORIZED WITH SPECIAL ACCESS) */}
      {hasSpecialAccess && visibleSpecialTools.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xs font-black text-neutral-400 uppercase tracking-widest font-mono border-b border-neutral-200 pb-2 flex items-center gap-1.5">
            <Lock size={12} className="text-red-500" />
            <span>{lang === 'ru' ? '🔒 Особый Доступ' : '🔒 Special Access Gated'}</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleSpecialTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className={`bg-white border p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-xl cursor-pointer group flex flex-col justify-between transition-all duration-300 ease-out hover:scale-105 will-change-transform ${tool.borderClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-neutral-800 flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-200">
                      <ItemImageOrFallback id={tool.iconId} lang={lang} size={36} />
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-extrabold ${tool.badgeColor}`}>
                        {tool.tag}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-red-500 transition-colors mb-1.5">
                    {tool.title}
                  </h3>
                  
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-red-600 transition-transform duration-200 group-hover:translate-x-0.5">
                  <span>{lang === 'ru' ? 'Открыть утилиту' : 'Open utility'}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
