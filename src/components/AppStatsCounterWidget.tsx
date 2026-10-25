import React, { useState, useEffect } from 'react';
import { Download, Users, Radio, Activity, Monitor, ShieldCheck, Sparkles } from 'lucide-react';
import { subscribeToGlobalAppStats, GlobalAppStats } from '../services/appStatsService';

interface AppStatsCounterWidgetProps {
  lang: 'ru' | 'en';
  appTheme?: 'light' | 'dark';
}

export const AppStatsCounterWidget: React.FC<AppStatsCounterWidgetProps> = ({
  lang,
  appTheme = 'dark'
}) => {
  const isLight = appTheme === 'light';
  const [stats, setStats] = useState<GlobalAppStats>({
    totalUsers: 1280,
    totalInstalls: 3850,
    onlineNow: 1,
    activeToday: 48
  });

  useEffect(() => {
    const unsub = subscribeToGlobalAppStats((newStats) => {
      setStats(newStats);
    });
    return () => unsub();
  }, []);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden font-mono shadow-md ${
      isLight
        ? 'bg-white border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-neutral-900'
        : 'bg-[#0d1017]/95 border-[#1e2637] text-[#eef2f7] shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
    }`}>
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-800/40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider font-teko text-red-500">
            {lang === 'ru' ? '📊 СТАТИСТИКА ПЛАТФОРМЫ & УСТАНОВОК' : '📊 PLATFORM & INSTALLATION ANALYTICS'}
          </h3>
        </div>

        <span className="text-[10px] text-neutral-400 font-bold bg-black/30 px-2 py-0.5 rounded border border-white/5">
          LIVE FIRESTORE METRICS
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Counter 1: App Installs */}
        <div className={`p-3.5 rounded-xl border space-y-1 transition-all group ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#121620] border-[#1e2637] hover:border-red-500/40'
        }`}>
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase">{lang === 'ru' ? 'Установок ПК' : 'App Installs'}</span>
            <Download size={14} className="text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-teko text-red-500 tracking-tight">
            {stats.totalInstalls.toLocaleString()}
          </div>
          <div className="text-[9px] text-neutral-500 flex items-center gap-1">
            <Monitor size={10} className="text-sky-400" />
            <span>Windows Tauri 2 x64</span>
          </div>
        </div>

        {/* Counter 2: Total Registered Users */}
        <div className={`p-3.5 rounded-xl border space-y-1 transition-all group ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#121620] border-[#1e2637] hover:border-amber-500/40'
        }`}>
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase">{lang === 'ru' ? 'Всего Игроков' : 'Total Users'}</span>
            <Users size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-teko text-amber-500 tracking-tight">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-[9px] text-neutral-500 flex items-center gap-1">
            <ShieldCheck size={10} className="text-emerald-400" />
            <span>{lang === 'ru' ? 'Зарегистрированы' : 'Registered Accounts'}</span>
          </div>
        </div>

        {/* Counter 3: Online Now */}
        <div className={`p-3.5 rounded-xl border space-y-1 transition-all group ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#121620] border-[#1e2637] hover:border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase">{lang === 'ru' ? 'Онлайн Сейчас' : 'Online Now'}</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-teko text-emerald-400 tracking-tight">
            {stats.onlineNow.toLocaleString()}
          </div>
          <div className="text-[9px] text-neutral-500 flex items-center gap-1">
            <Activity size={10} className="text-emerald-400" />
            <span>{lang === 'ru' ? 'Активные сессии' : 'Active Sessions'}</span>
          </div>
        </div>

        {/* Counter 4: Active 24h */}
        <div className={`p-3.5 rounded-xl border space-y-1 transition-all group ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#121620] border-[#1e2637] hover:border-purple-500/40'
        }`}>
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase">{lang === 'ru' ? 'Активно 24ч' : 'Active 24h'}</span>
            <Sparkles size={14} className="text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-teko text-purple-400 tracking-tight">
            {stats.activeToday.toLocaleString()}
          </div>
          <div className="text-[9px] text-neutral-500 flex items-center gap-1">
            <Radio size={10} className="text-purple-400" />
            <span>{lang === 'ru' ? 'Выживших сегодня' : 'Daily Active Users'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStatsCounterWidget;
