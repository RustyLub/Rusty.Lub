import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, User, LogIn, ArrowLeft, Crown, Shield, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';
import { CustomUser } from '../types';
import { logSecurityAccessAttempt } from '../services/activityLogger';

interface SpecialAccessGatedProps {
  moduleTitle: string;
  moduleIcon: string;
  requiredRole: 'vip' | 'owner' | 'admin';
  currentUser?: CustomUser | null;
  lang: 'ru' | 'en';
  appTheme: 'light' | 'dark';
  onOpenAuth: () => void;
  onOpenVip: () => void;
  onGoHome: () => void;
}

export const SpecialAccessGated: React.FC<SpecialAccessGatedProps> = ({
  moduleTitle,
  moduleIcon,
  requiredRole,
  currentUser,
  lang,
  appTheme,
  onOpenAuth,
  onOpenVip,
  onGoHome
}) => {
  const isLight = appTheme === 'light';

  const roleLabels = {
    vip: {
      tag: 'VIP ACCESS',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
      titleRu: 'Требуется VIP-статус',
      titleEn: 'VIP Access Required',
      descRu: 'Данный модуль (Player Radar) является закрытым и доступен исключительно игрокам с активной подпиской VIP. Он предоставляет тактический радар, мониторинг активности врагов и истории их онлайна.',
      descEn: 'This module (Player Radar) is restricted to survivors with active VIP status. It features tactical player tracking, server activity history, and live positioning.'
    },
    owner: {
      tag: 'OWNER EXCLUSIVE',
      badgeColor: 'bg-red-500/10 text-red-600 border-red-500/30',
      titleRu: 'Доступ только для Владельца',
      titleEn: 'Server Owner Access Only',
      descRu: 'Модуль Rust+ Bot Hub предназначен для централизованного управления серверными ботами Rust+ Companion, умными выключателями и сиренами рейда.',
      descEn: 'The Rust+ Bot Hub module is restricted to server owners and authorized Rust+ companion bots for automated base defenses and smart alerts.'
    },
    admin: {
      tag: 'ADMINISTRATOR ONLY',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      titleRu: 'Доступ только для Администратора',
      titleEn: 'Administrator Privilege Required',
      descRu: 'Панель управления и служебные разделы доступны только администраторам проекта для модерации, управления базой пользователей и публикаций.',
      descEn: 'Site administration, user database management, and asset inspector are restricted to project administrators.'
    }
  };

  const roleInfo = roleLabels[requiredRole];

  // Log unauthorized access attempt (UID, timestamp, module, required role) to Firebase
  useEffect(() => {
    logSecurityAccessAttempt({
      module: moduleTitle,
      requiredRole,
      currentUser,
      moduleIcon
    });
  }, [moduleTitle, requiredRole, currentUser?.uid]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <div className={`border rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden text-center ${
        isLight
          ? 'bg-white border-neutral-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)]'
          : 'bg-[#10141d]/95 border-[#1e2637] shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
      }`}>
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-red-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Top Badges */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase font-mono tracking-wider bg-red-600 text-white shadow-sm">
            <Lock size={12} />
            <span>{lang === 'ru' ? 'ОСОБЫЙ ДОСТУП' : 'SPECIAL ACCESS GATED'}</span>
          </div>
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase font-mono border ${roleInfo.badgeColor}`}>
            {requiredRole === 'vip' && <Crown size={12} />}
            {requiredRole === 'owner' && <ShieldAlert size={12} />}
            {requiredRole === 'admin' && <Shield size={12} />}
            <span>{roleInfo.tag}</span>
          </div>
        </div>

        {/* Central Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-zinc-900 border border-neutral-700/80 flex items-center justify-center mb-6 shadow-inner relative group">
          <ItemImageOrFallback id={moduleIcon} lang={lang} size={52} />
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#10141d]">
            <Lock size={13} />
          </div>
        </div>

        {/* Title & Description */}
        <h1 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2 ${
          isLight ? 'text-neutral-900' : 'text-[#eef2f7]'
        }`}>
          {moduleTitle}
        </h1>
        <div className="text-sm font-bold text-red-600 mb-4">
          {lang === 'ru' ? roleInfo.titleRu : roleInfo.titleEn}
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed max-w-lg mx-auto mb-8 ${
          isLight ? 'text-neutral-600' : 'text-[#8b95a8]'
        }`}>
          {lang === 'ru' ? roleInfo.descRu : roleInfo.descEn}
        </p>

        {/* Current Auth Status Card */}
        <div className={`p-4 rounded-xl border mb-8 text-left text-xs ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#151a24] border-[#1e2637]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                currentUser 
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                  : 'bg-red-500/10 text-red-600 border border-red-500/20'
              }`}>
                <User size={16} />
              </div>
              <div>
                <div className={`font-bold ${isLight ? 'text-neutral-900' : 'text-[#eef2f7]'}`}>
                  {currentUser ? currentUser.displayName : (lang === 'ru' ? 'Вы не авторизованы' : 'Not Authenticated')}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {currentUser 
                    ? `${lang === 'ru' ? 'Роль в системе' : 'Current Role'}: ${currentUser.role || 'Survivor'}${currentUser.isVip ? ' (VIP)' : ''}`
                    : (lang === 'ru' ? 'Для доступа необходимо выполнить вход в аккаунт' : 'Please log in to verify access privileges')}
                </div>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
              currentUser 
                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                : 'bg-red-500/10 text-red-600 border border-red-500/20'
            }`}>
              {currentUser ? (lang === 'ru' ? 'НЕТ ПРАВ' : 'NO ACCESS') : (lang === 'ru' ? 'ГОСТЬ' : 'GUEST')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={15} />
              <span>{lang === 'ru' ? 'Войти в аккаунт' : 'Log In / Register'}</span>
            </button>
          ) : (
            requiredRole === 'vip' && (
              <button
                onClick={onOpenVip}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>{lang === 'ru' ? 'Активировать VIP-статус' : 'Get VIP Status'}</span>
              </button>
            )
          )}

          <button
            onClick={onGoHome}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border flex items-center justify-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-300'
                : 'bg-[#151a24] hover:bg-[#1c2230] text-[#8b95a8] hover:text-[#eef2f7] border-[#1e2637]'
            }`}
          >
            <ArrowLeft size={14} />
            <span>{lang === 'ru' ? 'Вернуться на главную' : 'Back to Home'}</span>
          </button>
        </div>

        {/* Security Audit Badge & Status */}
        <div className={`mt-8 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono ${
          isLight ? 'border-neutral-200/80 text-neutral-500' : 'border-[#1e2637] text-zinc-400'
        }`}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
            <span className="text-zinc-500">
              {lang === 'ru' ? 'Аудит безопасности:' : 'Security audit:'}
            </span>
            <span className="text-amber-500 font-bold">
              {lang === 'ru' ? 'попытка доступа зафиксирована' : 'access attempt logged'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
            <span>UID:</span>
            <span className="font-bold text-zinc-400">
              {currentUser?.uid ? `${currentUser.uid.slice(0, 10)}...` : (lang === 'ru' ? 'ГОСТЬ' : 'ANONYMOUS')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialAccessGated;
