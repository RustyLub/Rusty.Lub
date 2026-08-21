import { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Play,
  Zap,
  Info
} from 'lucide-react';
import {
  NotificationSettings,
  getNotificationSettings,
  saveNotificationSettings,
  getNotificationPermission,
  requestNotificationPermission,
  sendWebNotification,
  isPushNotificationSupported,
  playNotificationSound
} from '../services/notificationManager';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function NotificationSettingsModal({
  isOpen,
  onClose,
  lang,
  onToast
}: NotificationSettingsModalProps) {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission());
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getNotificationSettings());
      setPermission(getNotificationPermission());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (perm === 'granted') {
      const updated = { ...settings, enabled: true };
      setSettings(updated);
      saveNotificationSettings(updated);
      onToast(
        lang === 'ru' ? '🔔 Веб-уведомления успешно включены!' : '🔔 Web notifications successfully enabled!',
        'success'
      );
      sendWebNotification(
        lang === 'ru' ? '🦀 Rusty.Lub: Уведомления активированы!' : '🦀 Rusty.Lub: Notifications Activated!',
        {
          body: lang === 'ru'
            ? 'Вы будете получать своевременные сигналы о вайпах, рейд-алармах и новостях.'
            : 'You will receive timely alerts for wipes, raid alarms, and updates.',
          soundType: 'wipe'
        }
      );
    } else if (perm === 'denied') {
      onToast(
        lang === 'ru'
          ? '⚠️ Разрешение заблокировано в браузере. Разрешите уведомления в настройках сайта.'
          : '⚠️ Permission blocked by browser. Please enable notifications in site settings.',
        'error'
      );
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleTestNotification = (type: 'wipe' | 'alarm' | 'news' | 'timer') => {
    let title = '';
    let body = '';
    let sound: 'wipe' | 'alarm' | 'chime' | 'timer' = 'chime';

    if (type === 'wipe') {
      title = lang === 'ru' ? '🚀 ВНИМАНИЕ: Force Wipe через 1 час!' : '🚀 ATTENTION: Force Wipe in 1 hour!';
      body = lang === 'ru' ? 'Официальный вайп серверов Facepunch начнется в 19:00 UTC / 22:00 МСК.' : 'Official Facepunch server wipe starts at 19:00 UTC.';
      sound = 'wipe';
    } else if (type === 'alarm') {
      title = lang === 'ru' ? '🚨 РЕЙД-ТРЕВОГА! Базу атакуют!' : '🚨 RAID ALARM! Your base is under attack!';
      body = lang === 'ru' ? 'Сработал Smart Alarm Rust+ на дверях главной цитадели.' : 'Rust+ Smart Alarm triggered on main citadel gates.';
      sound = 'alarm';
    } else if (type === 'news') {
      title = lang === 'ru' ? '⚡ Новое обновление Rust: «Power Trip»' : '⚡ New Rust Update: "Power Trip"';
      body = lang === 'ru' ? 'Добавлен Красный Утилизатор 100%, ЛЭП и спутник на Космодроме.' : 'Introduced 100% Red Recycler, Powerline grid & Satellite Crash.';
      sound = 'chime';
    } else {
      title = lang === 'ru' ? '⏰ Locked Crate взломан!' : '⏰ Locked Crate Hacked!';
      body = lang === 'ru' ? 'Таймер 15 минут завершен на монументе Large Oil Rig.' : '15-minute timer completed at Large Oil Rig.';
      sound = 'timer';
    }

    sendWebNotification(title, { body, soundType: sound });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
    onToast(lang === 'ru' ? 'Тестовое уведомление отправлено!' : 'Test notification sent!', 'info');
  };

  const isSupported = isPushNotificationSupported();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12151d] border-2 border-[#cd412b]/60 w-full max-w-lg shadow-[0_0_40px_rgba(205,65,43,0.3)] relative overflow-hidden">
        {/* Top Header Stripe */}
        <div className="bg-gradient-to-r from-[#cd412b] to-[#801b0d] p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black/30 rounded-sm">
              <BellRing size={20} className="text-white animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase font-mono tracking-wider">
                {lang === 'ru' ? 'Веб-Уведомления (Web Push)' : 'Web Push Notifications'}
              </h3>
              <p className="text-[11px] text-white/80 font-sans">
                {lang === 'ru' ? 'Оповещения в браузере о вайпах, рейд-алармах и новостях' : 'Instant desktop alerts for wipes, raids & patches'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-black/30 transition-all rounded-sm cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto font-sans text-gray-200">
          {/* Permission Status Banner */}
          <div className="bg-[#0c0d12] border border-[#2a2f3b] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 block">
                {lang === 'ru' ? 'СТАТУС РАЗРЕШЕНИЯ БРАУЗЕРА:' : 'BROWSER PERMISSION STATUS:'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {permission === 'granted' ? (
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30">
                    <CheckCircle2 size={13} />
                    {lang === 'ru' ? 'РАЗРЕШЕНО (ACTIVE)' : 'GRANTED (ACTIVE)'}
                  </span>
                ) : permission === 'denied' ? (
                  <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 bg-rose-500/10 px-2 py-0.5 border border-rose-500/30">
                    <AlertTriangle size={13} />
                    {lang === 'ru' ? 'ЗАБЛОКИРОВАНО (DENIED)' : 'BLOCKED (DENIED)'}
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">
                    <Info size={13} />
                    {lang === 'ru' ? 'ТРЕБУЕТСЯ ЗАПРОС (PROMPT)' : 'NEEDS PERMISSION'}
                  </span>
                )}
              </div>
            </div>

            {permission !== 'granted' && isSupported && (
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-[#cd412b] hover:bg-[#b03522] text-white font-mono font-bold text-xs uppercase transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Zap size={14} />
                <span>{lang === 'ru' ? 'Разрешить в браузере' : 'Enable in Browser'}</span>
              </button>
            )}
          </div>

          {/* Alert Channels Options */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#cd412b]" />
              <span>{lang === 'ru' ? 'Каналы Оповещений:' : 'Notification Channels:'}</span>
            </h4>

            {/* Force Wipe Alert */}
            <div
              onClick={() => handleToggle('forceWipe')}
              className="bg-[#171b26] hover:bg-[#1d2230] border border-[#2a2f3b] p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 mt-0.5">
                  <Flame size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase">
                    {lang === 'ru' ? '🚀 Глобальный Force Wipe' : '🚀 Global Force Wipe Alerts'}
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    {lang === 'ru'
                      ? 'Оповещения за 24 часа, за 1 час и в момент старта официального вайпа'
                      : 'Alerts at 24h, 1h before, and exactly at wipe release'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.forceWipe}
                onChange={() => {}}
                className="w-4 h-4 accent-[#cd412b] pointer-events-none"
              />
            </div>

            {/* Rust+ Raid Alarm */}
            <div
              onClick={() => handleToggle('rustPlusAlarms')}
              className="bg-[#171b26] hover:bg-[#1d2230] border border-[#2a2f3b] p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 mt-0.5">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase">
                    {lang === 'ru' ? '🚨 Рейд-Аларм Rust+ (Smart Alarm)' : '🚨 Rust+ Raid Alarm (Smart Alarm)'}
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    {lang === 'ru'
                      ? 'Мгновенное push-уведомление и сирена при срабатывании сигнализации на базе'
                      : 'Instant desktop push alert and loud siren on base intruder alarm'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.rustPlusAlarms}
                onChange={() => {}}
                className="w-4 h-4 accent-[#cd412b] pointer-events-none"
              />
            </div>

            {/* Game Updates */}
            <div
              onClick={() => handleToggle('gameUpdates')}
              className="bg-[#171b26] hover:bg-[#1d2230] border border-[#2a2f3b] p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 mt-0.5">
                  <Bell size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase">
                    {lang === 'ru' ? '📰 Свежие Патчи и Новости Rust' : '📰 Fresh Patches & Devblogs'}
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    {lang === 'ru'
                      ? 'Сводка новостей о выходе глобальных обновлений и ивентов Facepunch'
                      : 'Instant notification on Facepunch patch notes and meta changes'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.gameUpdates}
                onChange={() => {}}
                className="w-4 h-4 accent-[#cd412b] pointer-events-none"
              />
            </div>

            {/* Event Timers */}
            <div
              onClick={() => handleToggle('eventTimers')}
              className="bg-[#171b26] hover:bg-[#1d2230] border border-[#2a2f3b] p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase">
                    {lang === 'ru' ? '⏰ Игровые Таймеры (Locked Crate / Bradley)' : '⏰ Event Timers (Locked Crate / Bradley)'}
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    {lang === 'ru'
                      ? 'Оповещение по окончании 15-мин взлома ящика или респавна патрулей'
                      : 'Notify when 15m crate unlock finishes or Bradley respawns'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.eventTimers}
                onChange={() => {}}
                className="w-4 h-4 accent-[#cd412b] pointer-events-none"
              />
            </div>

            {/* Sound Alerts */}
            <div
              onClick={() => handleToggle('soundAlerts')}
              className="bg-[#171b26] hover:bg-[#1d2230] border border-[#2a2f3b] p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mt-0.5">
                  {settings.soundAlerts ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white font-mono uppercase">
                    {lang === 'ru' ? '🔊 Звуковые Сигналы & Сирена' : '🔊 Audio Synthesis & Siren Alerts'}
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    {lang === 'ru'
                      ? 'Синтез звукового сигнала через Web Audio API даже в фоновой вкладке'
                      : 'Play synthesized audio alert tones even in background tabs'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundAlerts}
                onChange={() => {}}
                className="w-4 h-4 accent-[#cd412b] pointer-events-none"
              />
            </div>
          </div>

          {/* Test Dispatchers */}
          <div className="border-t border-[#2a2f3b] pt-4 space-y-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
              {lang === 'ru' ? 'ПРОВЕРКА РАБОТЫ УВЕДОМЛЕНИЙ (ТЕСТ):' : 'TEST NOTIFICATION DELIVERY:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
              <button
                onClick={() => handleTestNotification('wipe')}
                className="p-2 bg-[#1b1e26] hover:bg-amber-500/20 border border-[#2a2f3b] hover:border-amber-500/50 text-amber-300 font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Flame size={12} />
                <span>Wipe Test</span>
              </button>
              <button
                onClick={() => handleTestNotification('alarm')}
                className="p-2 bg-[#1b1e26] hover:bg-rose-500/20 border border-[#2a2f3b] hover:border-rose-500/50 text-rose-300 font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShieldAlert size={12} />
                <span>Raid Siren</span>
              </button>
              <button
                onClick={() => handleTestNotification('news')}
                className="p-2 bg-[#1b1e26] hover:bg-sky-500/20 border border-[#2a2f3b] hover:border-sky-500/50 text-sky-300 font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Bell size={12} />
                <span>News Test</span>
              </button>
              <button
                onClick={() => handleTestNotification('timer')}
                className="p-2 bg-[#1b1e26] hover:bg-purple-500/20 border border-[#2a2f3b] hover:border-purple-500/50 text-purple-300 font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Clock size={12} />
                <span>Crate Test</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0c0d12] border-t border-[#2a2f3b] p-4 flex items-center justify-between">
          <div className="text-[10px] font-mono text-gray-500">
            {lang === 'ru' ? 'Работает в фоновом режиме браузера' : 'Runs in background browser session'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1b1e26] hover:bg-[#252a36] border border-[#2a2f3b] text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer"
          >
            {lang === 'ru' ? 'Закрыть' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
