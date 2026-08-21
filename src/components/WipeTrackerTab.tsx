import { useState, useEffect } from 'react';
import { Clock, Calendar, ShieldAlert, Radio, Play, RotateCcw, Copy, Check, Volume2, VolumeX, AlertTriangle, Cpu, Camera, Bell, Sparkles, Compass, BellRing } from 'lucide-react';
import { sendWebNotification, getNotificationSettings } from '../services/notificationManager';

interface WipeTrackerTabProps {
  lang: 'ru' | 'en';
  onOpenNotifications?: () => void;
}

interface CustomTimer {
  id: string;
  name: string;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  category: 'locked_crate' | 'bradley' | 'heli' | 'cargo' | 'custom';
}

const CCTV_CODES = [
  { monument: { ru: 'Большая Нефтяная Вышка', en: 'Large Oil Rig' }, codes: ['OILRIG1', 'OILRIG2', 'OILRIG2L1', 'OILRIG2L2'] },
  { monument: { ru: 'Малая Нефтяная Вышка', en: 'Small Oil Rig' }, codes: ['OILRIG1L1', 'OILRIG1L2'] },
  { monument: { ru: 'Космодром (Launch Site)', en: 'Launch Site' }, codes: ['LAUNCHSITE1', 'LAUNCHSITE2'] },
  { monument: { ru: 'Аэродром (Airfield)', en: 'Airfield' }, codes: ['AIRFIELD1', 'AIRFIELD2'] },
  { monument: { ru: 'Сфера (The Dome)', en: 'The Dome' }, codes: ['DOME1', 'DOME2'] },
  { monument: { ru: 'Ракетный Силос (Missile Silo)', en: 'Missile Silo' }, codes: ['SILO1', 'SILO2', 'SILO3'] },
  { monument: { ru: 'Подводные Лаборатории', en: 'Underwater Labs' }, codes: ['LAB1', 'LAB2', 'LAB3', 'LAB4'] },
  { monument: { ru: 'Морской Порт (Harbor)', en: 'Harbor' }, codes: ['HARBOR1', 'HARBOR2'] },
];

export default function WipeTrackerTab({ lang, onOpenNotifications }: WipeTrackerTabProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cctvSearch, setCctvSearch] = useState<string>('');

  // Event Timers state
  const [timers, setTimers] = useState<CustomTimer[]>([
    { id: '1', name: lang === 'ru' ? 'Взлом Locked Crate (Oil Rig / Cargo)' : 'Locked Crate Hack (15m)', durationSeconds: 900, remainingSeconds: 900, isRunning: false, category: 'locked_crate' },
    { id: '2', name: lang === 'ru' ? 'Респавн Брэдли APC (1 час)' : 'Bradley APC Respawn (1h)', durationSeconds: 3600, remainingSeconds: 3600, isRunning: false, category: 'bradley' },
    { id: '3', name: lang === 'ru' ? 'Таймер Патрульного Вертолета (2.5ч)' : 'Patrol Heli Cooldown (2.5h)', durationSeconds: 9000, remainingSeconds: 9000, isRunning: false, category: 'heli' },
    { id: '4', name: lang === 'ru' ? 'Длительность Cargo Ship (45м)' : 'Cargo Ship Duration (45m)', durationSeconds: 2700, remainingSeconds: 2700, isRunning: false, category: 'cargo' },
  ]);

  // Force Wipe Calculation (First Thursday of month at 19:00 UTC)
  const [forceWipeTime, setForceWipeTime] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateForceWipe = () => {
      const now = new Date();
      let year = now.getUTCFullYear();
      let month = now.getUTCMonth();

      // Find first Thursday of current month
      const getFirstThursday = (y: number, m: number) => {
        const firstDay = new Date(Date.UTC(y, m, 1));
        let dayOfWeek = firstDay.getUTCDay(); // 0: Sun, 1: Mon, ..., 4: Thu
        let daysUntilThu = (4 - dayOfWeek + 7) % 7;
        const firstThu = new Date(Date.UTC(y, m, 1 + daysUntilThu, 19, 0, 0));
        return firstThu;
      };

      let targetWipe = getFirstThursday(year, month);
      if (now.getTime() >= targetWipe.getTime()) {
        // Next month's force wipe
        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
        targetWipe = getFirstThursday(year, month);
      }

      const diffMs = targetWipe.getTime() - now.getTime();
      const totalSecs = Math.max(0, Math.floor(diffMs / 1000));

      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      setForceWipeTime({ days, hours, minutes, seconds });
    };

    calculateForceWipe();
    const interval = setInterval(calculateForceWipe, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer Tick Effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimers(prevTimers =>
        prevTimers.map(t => {
          if (t.isRunning && t.remainingSeconds > 0) {
            const nextSec = t.remainingSeconds - 1;
            if (nextSec === 0) {
              const settings = getNotificationSettings();
              if (settings.eventTimers) {
                sendWebNotification(
                  lang === 'ru' ? `⏰ Таймер завершен: ${t.name}` : `⏰ Timer Completed: ${t.name}`,
                  {
                    body: lang === 'ru'
                      ? 'Время события истекло! Проверьте ящик или респавн патруля в Rust.'
                      : 'Event cooldown finished! Check the monument in Rust.',
                    soundType: 'timer'
                  }
                );
              }
            }
            return { ...t, remainingSeconds: nextSec, isRunning: nextSec > 0 };
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [soundEnabled, lang]);

  const toggleTimer = (id: string) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, isRunning: !t.isRunning } : t));
  };

  const resetTimer = (id: string) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, remainingSeconds: t.durationSeconds, isRunning: false } : t));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 text-gray-200 font-sans">
      {/* Header Banner */}
      <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-5 sm:p-6 shadow-xl relative overflow-hidden rust-metal-pattern">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#cd412b]/20 text-[#cd412b] border border-[#cd412b]/40 rounded-sm">
                <Clock size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
                {lang === 'ru' ? 'Вайп-Трекер & Таймеры Событий' : 'Wipe Tracker & Event Timers'}
              </h2>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-3xl">
              {lang === 'ru'
                ? 'Обратный отсчет до глобального Force Wipe от Facepunch, интерактивные таймеры для Locked Crate (15 мин), Bradley, Cargo Ship, а также полное руководство по CCTV камерам.'
                : 'Live countdown to official Facepunch Force Wipe, interactive timers for Locked Crate (15m), Bradley, Cargo Ship, and full CCTV camera directory.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="px-3 py-1.5 bg-[#cd412b]/20 hover:bg-[#cd412b]/30 border border-[#cd412b]/50 text-xs font-mono font-bold text-white rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <BellRing size={14} className="text-[#cd412b] animate-bounce" />
                <span>{lang === 'ru' ? 'Web Push Оповещения' : 'Web Push Alerts'}</span>
              </button>
            )}

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="px-3 py-1.5 bg-[#1b1e26] hover:bg-[#252a36] border border-[#2a2f3b] text-xs font-mono font-bold text-gray-300 rounded-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-gray-500" />}
              <span>{soundEnabled ? (lang === 'ru' ? 'Звук Вкл' : 'Sound On') : (lang === 'ru' ? 'Звук Выкл' : 'Sound Off')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Force Wipe Countdown Display */}
      <div className="bg-[#10131a] border border-[#cd412b]/40 p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-3 py-1 bg-[#cd412b]/20 text-[#cd412b] border-b border-l border-[#cd412b]/40 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
          <Calendar size={12} />
          <span>Facepunch Official</span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#cd412b]" />
              <span>{lang === 'ru' ? 'Официальный Force Wipe (Первый Четверг Месяца)' : 'Official Force Wipe (1st Thursday of Month)'}</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              {lang === 'ru' ? 'Время серверов: 19:00 UTC / 22:00 МСК. Вайпаются все карты и чертежи (Blueprints).' : 'Server launch window: 19:00 UTC. Resets all maps and blueprints.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#14171e] border border-[#2a2f3b] p-3 sm:p-4">
              <span className="block text-2xl sm:text-4xl font-black text-white font-mono">{forceWipeTime.days}</span>
              <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">{lang === 'ru' ? 'Дней' : 'Days'}</span>
            </div>
            <div className="bg-[#14171e] border border-[#2a2f3b] p-3 sm:p-4">
              <span className="block text-2xl sm:text-4xl font-black text-amber-400 font-mono">{forceWipeTime.hours.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">{lang === 'ru' ? 'Часов' : 'Hours'}</span>
            </div>
            <div className="bg-[#14171e] border border-[#2a2f3b] p-3 sm:p-4">
              <span className="block text-2xl sm:text-4xl font-black text-amber-400 font-mono">{forceWipeTime.minutes.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">{lang === 'ru' ? 'Минут' : 'Minutes'}</span>
            </div>
            <div className="bg-[#14171e] border border-[#2a2f3b] p-3 sm:p-4">
              <span className="block text-2xl sm:text-4xl font-black text-[#cd412b] font-mono">{forceWipeTime.seconds.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">{lang === 'ru' ? 'Секунд' : 'Seconds'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Event Timers & CCTV Camera Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Event Timers */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#14171e] border border-[#2a2f3b] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-2">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Radio size={15} className="text-[#cd412b]" />
                <span>{lang === 'ru' ? 'Интерактивные Таймеры Ивентов:' : 'Interactive Event Timers:'}</span>
              </h3>
            </div>

            <div className="space-y-3">
              {timers.map(t => {
                const percent = Math.floor((t.remainingSeconds / t.durationSeconds) * 100);
                return (
                  <div key={t.id} className="bg-[#0c0d10] border border-[#2a2f3b] p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-white font-sans">{t.name}</p>
                      <span className="text-sm font-black font-mono text-amber-400">
                        {formatTime(t.remainingSeconds)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#1b1e26] h-2 rounded-none overflow-hidden border border-[#2a2f3b]">
                      <div
                        className={`h-full transition-all duration-300 ${t.remainingSeconds === 0 ? 'bg-red-500' : t.isRunning ? 'bg-[#cd412b]' : 'bg-gray-600'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTimer(t.id)}
                          className={`px-3 py-1 text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                            t.isRunning
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                              : 'bg-[#cd412b]/20 text-[#f57462] border border-[#cd412b]/40 hover:bg-[#cd412b]/30'
                          }`}
                        >
                          <Play size={12} className={t.isRunning ? 'animate-pulse' : ''} />
                          <span>{t.isRunning ? (lang === 'ru' ? 'Пауза' : 'Pause') : (lang === 'ru' ? 'Старт' : 'Start')}</span>
                        </button>

                        <button
                          onClick={() => resetTimer(t.id)}
                          className="px-2.5 py-1 bg-[#1b1e26] hover:bg-[#252a36] border border-[#2a2f3b] text-gray-400 hover:text-white text-xs font-mono rounded-sm flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <RotateCcw size={12} />
                          <span>{lang === 'ru' ? 'Сброс' : 'Reset'}</span>
                        </button>
                      </div>

                      {t.remainingSeconds === 0 && (
                        <span className="text-[10px] font-mono font-bold text-red-400 animate-pulse uppercase">
                          {lang === 'ru' ? 'ГОТОВО!' : 'EXPIRED!'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: CCTV Camera Directory */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#14171e] border border-[#2a2f3b] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-2">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Camera size={15} className="text-sky-400" />
                <span>{lang === 'ru' ? 'Коды CCTV Камер (Computer Station):' : 'CCTV Camera Codes (Computer Station):'}</span>
              </h3>
            </div>

            {/* CCTV Search */}
            <input
              type="text"
              value={cctvSearch}
              onChange={(e) => setCctvSearch(e.target.value)}
              placeholder={lang === 'ru' ? 'Фильтр по монументу...' : 'Filter by monument...'}
              className="w-full bg-[#0c0d10] border border-[#2a2f3b] px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#cd412b]"
            />

            {/* List of CCTV Codes */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {CCTV_CODES.filter(item =>
                item.monument.ru.toLowerCase().includes(cctvSearch.toLowerCase()) ||
                item.monument.en.toLowerCase().includes(cctvSearch.toLowerCase()) ||
                item.codes.some(c => c.toLowerCase().includes(cctvSearch.toLowerCase()))
              ).map((group, i) => (
                <div key={i} className="bg-[#0c0d10] border border-[#2a2f3b] p-3 space-y-2">
                  <p className="text-xs font-bold text-white font-sans">{group.monument[lang]}</p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                    {group.codes.map(code => (
                      <button
                        key={code}
                        onClick={() => handleCopyCode(code)}
                        className="px-2.5 py-1 bg-[#1b1e26] hover:bg-[#cd412b]/20 border border-[#2a2f3b] hover:border-[#cd412b]/50 text-sky-300 hover:text-white rounded-xs transition-all flex items-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        <span>{code}</span>
                        {copiedCode === code ? <Check size={11} className="text-green-400" /> : <Copy size={11} className="text-gray-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
