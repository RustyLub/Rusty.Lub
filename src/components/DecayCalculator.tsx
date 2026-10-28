import { useState, useEffect, useRef, useMemo } from 'react';
import { APP_VERSION, DecayTimer, CustomUser } from '../types';
import { 
  ShieldAlert, 
  Clock, 
  HelpCircle, 
  Flame, 
  AlertTriangle, 
  Info,
  ChevronRight,
  Heart,
  TrendingDown,
  Bell,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Plus,
  Volume2,
  CheckCircle2,
  Smartphone,
  Monitor,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  sendDecayNotification, 
  requestNotificationPermission, 
  isTauriApp,
  playRustAlarmSound
} from '../services/notificationService';
import { logUserActivity } from '../services/activityService';

// Custom SVGs for materials matching the tactical Rusty.Lub aesthetic
const WoodIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <rect x="10" y="15" width="80" height="70" rx="4" fill="#854d0e" stroke="#451a03" strokeWidth="3" />
    <line x1="10" y1="35" x2="90" y2="35" stroke="#451a03" strokeWidth="3" />
    <line x1="10" y1="55" x2="90" y2="55" stroke="#451a03" strokeWidth="3" />
    <line x1="10" y1="75" x2="90" y2="75" stroke="#451a03" strokeWidth="3" />
    <path d="M25,25 Q45,28 35,45" stroke="#a16207" strokeWidth="2" fill="none" />
    <path d="M70,45 Q50,48 60,65" stroke="#78350f" strokeWidth="2" fill="none" />
  </svg>
);

const StoneIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <rect x="10" y="10" width="80" height="80" rx="6" fill="#4b5563" stroke="#1f2937" strokeWidth="4" />
    <rect x="20" y="20" width="30" height="25" rx="2" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
    <rect x="55" y="20" width="25" height="25" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="2" />
    <rect x="20" y="55" width="25" height="25" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="2" />
    <rect x="50" y="55" width="30" height="25" rx="2" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
  </svg>
);

const MetalIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <rect x="10" y="10" width="80" height="80" fill="#334155" stroke="#0f172a" strokeWidth="4" />
    <line x1="26" y1="10" x2="26" y2="90" stroke="#1e293b" strokeWidth="2" />
    <line x1="42" y1="10" x2="42" y2="90" stroke="#1e293b" strokeWidth="2" />
    <line x1="58" y1="10" x2="58" y2="90" stroke="#1e293b" strokeWidth="2" />
    <line x1="74" y1="10" x2="74" y2="90" stroke="#1e293b" strokeWidth="2" />
    <path d="M15,20 L35,45" stroke="#92400e" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <path d="M50,60 L75,85" stroke="#b45309" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const ArmoredIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <rect x="10" y="10" width="80" height="80" rx="4" fill="#1e293b" stroke="#ca8a04" strokeWidth="4" />
    <rect x="22" y="22" width="56" height="56" fill="#0f172a" stroke="#ca8a04" strokeWidth="2" />
    <circle cx="22" cy="22" r="3.5" fill="#ca8a04" />
    <circle cx="78" cy="22" r="3.5" fill="#ca8a04" />
    <circle cx="22" cy="78" r="3.5" fill="#ca8a04" />
    <circle cx="78" cy="78" r="3.5" fill="#ca8a04" />
    <line x1="30" y1="35" x2="70" y2="35" stroke="#475569" strokeWidth="3" />
    <line x1="30" y1="50" x2="70" y2="50" stroke="#475569" strokeWidth="3" />
    <line x1="30" y1="65" x2="70" y2="65" stroke="#475569" strokeWidth="3" />
  </svg>
);

const TwigsIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <line x1="15" y1="20" x2="85" y2="80" stroke="#a16207" strokeWidth="5" strokeLinecap="round" />
    <line x1="85" y1="20" x2="15" y2="80" stroke="#a16207" strokeWidth="5" strokeLinecap="round" />
    <line x1="10" y1="50" x2="90" y2="50" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
    <line x1="50" y1="10" x2="50" y2="90" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export interface MaterialInfo {
  id: 'twigs' | 'wood' | 'stone' | 'metal' | 'armored' | 'high_wood' | 'high_stone';
  nameRU: string;
  nameEN: string;
  decayTime: number; // in hours
  maxHp: number;
  resourceNameRU: string;
  resourceNameEN: string;
  icon: React.ReactNode;
  upkeepInfo?: string;
}

export const materialsData: MaterialInfo[] = [
  {
    id: 'twigs',
    nameRU: 'Солома (Ветки)',
    nameEN: 'Twigs',
    decayTime: 1,
    maxHp: 10,
    resourceNameRU: 'Дерево',
    resourceNameEN: 'Wood',
    icon: <TwigsIcon size={24} />
  },
  {
    id: 'wood',
    nameRU: 'Дерево',
    nameEN: 'Wood',
    decayTime: 3,
    maxHp: 250,
    resourceNameRU: 'Дерево',
    resourceNameEN: 'Wood',
    icon: <WoodIcon size={24} />
  },
  {
    id: 'stone',
    nameRU: 'Камень',
    nameEN: 'Stone',
    decayTime: 4,
    maxHp: 500,
    resourceNameRU: 'Камень',
    resourceNameEN: 'Stone',
    icon: <StoneIcon size={24} />
  },
  {
    id: 'metal',
    nameRU: 'Листовой металл',
    nameEN: 'Sheet Metal',
    decayTime: 8,
    maxHp: 1000,
    resourceNameRU: 'Фрагменты металла',
    resourceNameEN: 'Metal Fragments',
    icon: <MetalIcon size={24} />
  },
  {
    id: 'armored',
    nameRU: 'Броня (МВК)',
    nameEN: 'Armored (HQM)',
    decayTime: 12,
    maxHp: 2000,
    resourceNameRU: 'МВК (HQM)',
    resourceNameEN: 'High Quality Metal',
    icon: <ArmoredIcon size={24} />
  },
  {
    id: 'high_wood',
    nameRU: 'Высок. Внешн. Дерево',
    nameEN: 'High Ext. Wood Wall',
    decayTime: 3,
    maxHp: 500,
    resourceNameRU: 'Дерево (Содержание в ТС)',
    resourceNameEN: 'Wood (TC Upkeep Required)',
    icon: <WoodIcon size={24} />,
    upkeepInfo: '⚡ [06.08 Patch]: Требует 100 дерева / 24ч в шкафу (TC). Без содержания гниет за 3 часа.'
  },
  {
    id: 'high_stone',
    nameRU: 'Высок. Внешн. Камень',
    nameEN: 'High Ext. Stone Wall',
    decayTime: 4,
    maxHp: 1000,
    resourceNameRU: 'Камень (Содержание в ТС)',
    resourceNameEN: 'Stone (TC Upkeep Required)',
    icon: <StoneIcon size={24} />,
    upkeepInfo: '⚡ [06.08 Patch]: Требует 150 камня / 24ч в шкафу (TC). Без содержания гниет за 4 часа.'
  }
];

const LOCAL_TIMERS_KEY = 'rust_decay_timers';

interface DecayCalculatorProps {
  lang: 'ru' | 'en';
  user?: CustomUser | null;
  onToast?: (msg: string, type: 'success' | 'warning' | 'error') => void;
  onOpenProfile?: () => void;
}

export default function DecayCalculator({ lang, user, onToast, onOpenProfile }: DecayCalculatorProps) {
  // Structure calculator states
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialInfo>(materialsData[2]); // Default to Stone
  const [currentHp, setCurrentHp] = useState<number>(materialsData[2].maxHp);

  // Timers list state
  const [timers, setTimers] = useState<DecayTimer[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_TIMERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal / Creator states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timerName, setTimerName] = useState('');
  const [timerMaterialId, setTimerMaterialId] = useState<MaterialInfo['id']>('stone');
  const [modalHp, setModalHp] = useState<number>(500);
  const [notifyTauri, setNotifyTauri] = useState(true);
  const [notifyBrowser, setNotifyBrowser] = useState(true);
  const [soundAlert, setSoundAlert] = useState(true);
  const [timerNotes, setTimerNotes] = useState('');
  const [isTestingAlert, setIsTestingAlert] = useState(false);

  // Derived calculations for structure HP & countdown duration inside modal
  const modalMaterial = useMemo(() => {
    return materialsData.find((m) => m.id === timerMaterialId) || materialsData[2];
  }, [timerMaterialId]);

  const modalPercent = modalMaterial.maxHp > 0 
    ? Math.round((modalHp / modalMaterial.maxHp) * 100) 
    : 0;

  const modalRemainingHours = modalMaterial.maxHp > 0 
    ? (modalHp / modalMaterial.maxHp) * modalMaterial.decayTime 
    : 0;

  const modalTotalSeconds = Math.max(0, Math.round(modalRemainingHours * 3600));

  const handleModalSliderChange = (percent: number) => {
    const hp = Math.round((percent / 100) * modalMaterial.maxHp);
    setModalHp(hp);
  };

  const handleModalHpChange = (val: number) => {
    const clamped = Math.max(0, Math.min(modalMaterial.maxHp, val || 0));
    setModalHp(clamped);
  };

  const handleModalPreset = (percent: number) => {
    const hp = Math.round((percent / 100) * modalMaterial.maxHp);
    setModalHp(hp);
  };

  // Sync current HP when material tier changes
  const handleMaterialChange = (material: MaterialInfo) => {
    setSelectedMaterial(material);
    setCurrentHp(material.maxHp);
  };

  const currentPercent = selectedMaterial.maxHp > 0 
    ? Math.round((currentHp / selectedMaterial.maxHp) * 100) 
    : 0;

  // Remaining time in hours
  const remainingHours = (currentHp / selectedMaterial.maxHp) * selectedMaterial.decayTime;

  // Rate calculations
  const hpLossPerHour = selectedMaterial.maxHp / selectedMaterial.decayTime;
  const hpLossPerMin = hpLossPerHour / 60;

  const formatHours = (h: number) => {
    if (h === 0) return lang === 'ru' ? 'Разрушено' : 'Destroyed';
    const totalMinutes = Math.round(h * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(lang === 'ru' ? `${hours} ч.` : `${hours} h.`);
    }
    if (minutes > 0 || hours === 0) {
      parts.push(lang === 'ru' ? `${minutes} м.` : `${minutes} m.`);
    }

    return parts.join(' ');
  };

  const formatSecondsToClock = (totalSec: number) => {
    if (totalSec <= 0) return '00:00:00';
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.floor(totalSec % 60);
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  };

  const handleSliderChange = (percent: number) => {
    const hp = Math.round((percent / 100) * selectedMaterial.maxHp);
    setCurrentHp(hp);
  };

  const handleHpInputChange = (val: number) => {
    const clamped = Math.max(0, Math.min(selectedMaterial.maxHp, val || 0));
    setCurrentHp(clamped);
  };

  const applyPreset = (percent: number) => {
    const hp = Math.round((percent / 100) * selectedMaterial.maxHp);
    setCurrentHp(hp);
  };

  // Persist timers to localStorage
  const saveTimersToStorage = (updatedList: DecayTimer[]) => {
    setTimers(updatedList);
    try {
      localStorage.setItem(LOCAL_TIMERS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save timers to localStorage:', e);
    }
  };

  // Timer Tick Engine: Runs every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        let changed = false;
        const now = Date.now();

        const updated = prevTimers.map((timer) => {
          if (timer.status !== 'running') return timer;

          const remaining = Math.max(0, Math.round((timer.targetTimestamp - now) / 1000));

          // Check for timer expiration
          if (remaining === 0 && timer.remainingSeconds > 0) {
            changed = true;

            // Trigger notification
            const title = lang === 'ru' 
              ? `⚠️ [ГНИЕНИЕ RUST] Время вышло!` 
              : `⚠️ [RUST DECAY] Timer expired!`;
            const body = lang === 'ru'
              ? `Постройка "${timer.name}" (${timer.materialName}) сгнила и разрушилась! Заполните шкаф ресурсами.`
              : `Structure "${timer.name}" (${timer.materialName}) has collapsed! Replenish Tool Cupboard upkeep.`;

            sendDecayNotification({
              title,
              body,
              sound: timer.soundAlert
            });

            if (onToast) {
              onToast(
                lang === 'ru' 
                  ? `Постройка "${timer.name}" полностью сгнила!` 
                  : `Structure "${timer.name}" has collapsed!`, 
                'error'
              );
            }

            // Log activity to user profile
            logUserActivity({
              userId: user?.uid,
              type: 'decay_timer_complete',
              title: lang === 'ru' ? `Таймер гниения завершен: ${timer.name}` : `Decay timer completed: ${timer.name}`,
              description: lang === 'ru' 
                ? `Постройка "${timer.name}" (${timer.materialName}) полностью разрушилась` 
                : `Structure "${timer.name}" (${timer.materialName}) collapsed`,
              category: 'decay',
              details: {
                structureName: timer.name,
                material: timer.materialName,
                durationSeconds: timer.totalDurationSeconds
              }
            });

            return {
              ...timer,
              remainingSeconds: 0,
              status: 'completed' as const
            };
          }

          if (timer.remainingSeconds !== remaining) {
            changed = true;
            return {
              ...timer,
              remainingSeconds: remaining
            };
          }

          return timer;
        });

        if (changed) {
          try {
            localStorage.setItem(LOCAL_TIMERS_KEY, JSON.stringify(updated));
          } catch (e) {
            console.warn(e);
          }
          return updated;
        }

        return prevTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lang, user?.uid, onToast]);

  // Open modal prefilled with current calculator values
  const handleOpenTimerFromCalc = () => {
    const defaultTitle = lang === 'ru' 
      ? `${selectedMaterial.nameRU} (${currentHp} HP)` 
      : `${selectedMaterial.nameEN} (${currentHp} HP)`;

    setTimerName(defaultTitle);
    setTimerMaterialId(selectedMaterial.id);
    setModalHp(currentHp);
    setTimerNotes(lang === 'ru' ? `Начальное здоровье: ${currentHp} HP` : `Starting health: ${currentHp} HP`);
    setIsModalOpen(true);
  };

  // Create new timer
  const handleCreateTimer = async (e: React.FormEvent) => {
    e.preventDefault();

    const mat = modalMaterial;
    const totalSeconds = modalTotalSeconds;
    if (modalHp <= 0 || totalSeconds <= 0) {
      if (onToast) onToast(
        lang === 'ru' 
          ? 'Укажите прочность конструкции больше 0 HP!' 
          : 'Durability health must be greater than 0 HP!', 
        'warning'
      );
      return;
    }

    // Request notification permission
    if (notifyBrowser || notifyTauri) {
      await requestNotificationPermission();
    }

    const finalName = timerName.trim() || (lang === 'ru' ? `База (${mat.nameRU})` : `Base (${mat.nameEN})`);
    const now = Date.now();

    const newTimer: DecayTimer = {
      id: `timer_${now}_${Math.random().toString(36).substring(2, 6)}`,
      name: finalName,
      materialId: mat.id,
      materialName: lang === 'ru' ? mat.nameRU : mat.nameEN,
      initialHp: modalHp,
      maxHp: mat.maxHp,
      totalDurationSeconds: totalSeconds,
      remainingSeconds: totalSeconds,
      targetTimestamp: now + (totalSeconds * 1000),
      createdAt: now,
      status: 'running',
      notifyTauri,
      notifyBrowser,
      soundAlert,
      notes: timerNotes.trim(),
      userId: user?.uid
    };

    const updated = [newTimer, ...timers];
    saveTimersToStorage(updated);
    setIsModalOpen(false);

    // Play tactile soft chime
    if (soundAlert) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (err) {}
    }

    // Toast
    if (onToast) {
      onToast(
        lang === 'ru' 
          ? `Таймер "${finalName}" запущен! Действие сохранено в историю профиля.` 
          : `Timer "${finalName}" started! Logged to profile history.`,
        'success'
      );
    }

    // Log action to User Profile Activity History
    await logUserActivity({
      userId: user?.uid,
      type: 'decay_timer_start',
      title: lang === 'ru' ? `Запуск таймера гниения: ${finalName}` : `Started decay timer: ${finalName}`,
      description: lang === 'ru'
        ? `Материал: ${mat.nameRU} | HP: ${modalHp}/${mat.maxHp} | Время: ${formatSecondsToClock(totalSeconds)} | Windows & Web оповещение`
        : `Material: ${mat.nameEN} | HP: ${modalHp}/${mat.maxHp} | Duration: ${formatSecondsToClock(totalSeconds)} | Windows & Web alert`,
      category: 'decay',
      details: {
        structureName: finalName,
        material: mat.nameRU,
        durationFormatted: formatSecondsToClock(totalSeconds),
        durationSeconds: totalSeconds,
        hp: modalHp,
        maxHp: mat.maxHp
      }
    });
  };

  // Pause / Resume timer
  const handleTogglePause = (timerId: string) => {
    const updated = timers.map((t) => {
      if (t.id !== timerId) return t;
      if (t.status === 'running') {
        return {
          ...t,
          status: 'paused' as const
        };
      } else if (t.status === 'paused') {
        return {
          ...t,
          status: 'running' as const,
          targetTimestamp: Date.now() + (t.remainingSeconds * 1000)
        };
      }
      return t;
    });
    saveTimersToStorage(updated);
  };

  // Reset timer to original duration
  const handleResetTimer = (timerId: string) => {
    const updated = timers.map((t) => {
      if (t.id !== timerId) return t;
      return {
        ...t,
        remainingSeconds: t.totalDurationSeconds,
        targetTimestamp: Date.now() + (t.totalDurationSeconds * 1000),
        status: 'running' as const
      };
    });
    saveTimersToStorage(updated);
    if (onToast) onToast(lang === 'ru' ? 'Таймер перезапущен' : 'Timer restarted', 'success');
  };

  // Delete timer
  const handleDeleteTimer = (timerId: string) => {
    const target = timers.find(t => t.id === timerId);
    const updated = timers.filter(t => t.id !== timerId);
    saveTimersToStorage(updated);

    if (target && target.status === 'running') {
      logUserActivity({
        userId: user?.uid,
        type: 'decay_timer_cancel',
        title: lang === 'ru' ? `Отменен таймер гниения: ${target.name}` : `Cancelled decay timer: ${target.name}`,
        description: lang === 'ru' ? `Таймер "${target.name}" остановлен пользователем` : `Timer "${target.name}" stopped by user`,
        category: 'decay',
        details: {
          structureName: target.name
        }
      });
    }

    if (onToast) onToast(lang === 'ru' ? 'Таймер удален' : 'Timer deleted', 'warning');
  };

  // Quick preset launch
  const handleLaunchPreset = async (hours: number, matId: MaterialInfo['id'], labelRu: string, labelEn: string) => {
    const mat = materialsData.find(m => m.id === matId) || selectedMaterial;
    const totalSec = hours * 3600;
    const now = Date.now();
    const finalName = lang === 'ru' ? labelRu : labelEn;

    await requestNotificationPermission();

    const newTimer: DecayTimer = {
      id: `timer_${now}_${Math.random().toString(36).substring(2, 6)}`,
      name: finalName,
      materialId: mat.id,
      materialName: lang === 'ru' ? mat.nameRU : mat.nameEN,
      initialHp: mat.maxHp,
      maxHp: mat.maxHp,
      totalDurationSeconds: totalSec,
      remainingSeconds: totalSec,
      targetTimestamp: now + (totalSec * 1000),
      createdAt: now,
      status: 'running',
      notifyTauri: true,
      notifyBrowser: true,
      soundAlert: true,
      userId: user?.uid
    };

    saveTimersToStorage([newTimer, ...timers]);

    if (onToast) {
      onToast(
        lang === 'ru' 
          ? `Быстрый таймер "${finalName}" (${hours} ч.) запущен!` 
          : `Preset timer "${finalName}" (${hours}h) started!`, 
        'success'
      );
    }

    logUserActivity({
      userId: user?.uid,
      type: 'decay_timer_start',
      title: lang === 'ru' ? `Быстрый таймер гниения: ${finalName}` : `Quick decay timer: ${finalName}`,
      description: lang === 'ru' ? `${mat.nameRU} — ${hours} ч.` : `${mat.nameEN} — ${hours}h`,
      category: 'decay',
      details: {
        structureName: finalName,
        material: mat.nameRU,
        durationFormatted: `${hours} ч.`,
        durationSeconds: totalSec
      }
    });
  };

  // Test notification button
  const handleTestNotification = async () => {
    setIsTestingAlert(true);
    await requestNotificationPermission();
    await sendDecayNotification({
      title: lang === 'ru' ? '🔔 [ТЕСТ ОПОВЕЩЕНИЯ RUST]' : '🔔 [RUST ALERT TEST]',
      body: lang === 'ru' 
        ? 'Оповещения в Windows Tauri и браузере настроены и работают корректно!' 
        : 'Windows Tauri desktop & browser notifications are working properly!',
      sound: true
    });
    if (onToast) {
      onToast(
        lang === 'ru' 
          ? 'Тестовое оповещение отправлено (Windows Tauri / Браузер / Звук)!' 
          : 'Test alert sent (Windows Tauri / Browser / Sound)!', 
        'success'
      );
    }
    setTimeout(() => setIsTestingAlert(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with tactical information */}
      <div className="bg-[#14171e]/90 p-4 sm:p-5 border border-[#2a2f3b] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl relative overflow-hidden">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-[#f97316]/10 border border-[#f97316]/30">
            <Clock size={20} className="text-[#f97316] animate-pulse" />
          </span>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span>{lang === 'ru' ? 'КАЛЬКУЛЯТОР И ТАЙМЕР ГНИЕНИЯ' : 'DECAY TIME & ALARM TIMERS'}</span>
              <span className="text-[9px] bg-red-600/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 font-mono">
                TAURI + BROWSER
              </span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">
              {lang === 'ru' 
                ? 'Расчет времени гниения и установка активных таймеров с системными звуковыми оповещениями' 
                : 'Calculate structural collapse time and configure active alarms with Windows & browser alerts'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={handleTestNotification}
            disabled={isTestingAlert}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1e26] hover:bg-[#252a36] text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            title={lang === 'ru' ? 'Проверить звук и всплывающее окно в Windows / Браузере' : 'Test sound & desktop popup'}
          >
            <Bell size={12} className={isTestingAlert ? 'animate-bounce text-amber-300' : ''} />
            <span>{lang === 'ru' ? 'Тест оповещения' : 'Test Alert'}</span>
          </button>

          <span className="bg-zinc-800/40 px-2 py-1 border border-zinc-800 text-[10px] text-zinc-400">
            RUST {APP_VERSION}
          </span>
        </div>
      </div>

      {/* Main Grid: Calculator Inputs & Diagnostic */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Input Panel */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-[#14171e]/90 p-5 border border-[#2a2f3b] space-y-6 relative overflow-hidden">
            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#f97316]" />

            {/* Material Selector Row */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block">
                {lang === 'ru' ? 'Выберите материал постройки:' : 'Select Structure Material:'}
              </label>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {materialsData.map((mat) => {
                  const isSelected = selectedMaterial.id === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => handleMaterialChange(mat)}
                      className={`p-3 border flex flex-col items-center justify-center gap-2 transition-all relative group cursor-pointer ${
                        isSelected
                          ? 'bg-[#f97316]/10 border-[#f97316] text-white shadow-[inset_0_0_15px_rgba(205,65,43,0.15)]'
                          : 'bg-[#1b1e26] border-[#2a2f3b] hover:border-zinc-500 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className={`p-1.5 border transition-all ${
                        isSelected ? 'bg-black/40 border-[#f97316]/50' : 'bg-black/20 border-zinc-800'
                      }`}>
                        {mat.icon}
                      </span>
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-center">
                        {lang === 'ru' ? mat.nameRU : mat.nameEN}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-500 mt-0.5 block">
                        {mat.maxHp} HP ({mat.decayTime} {lang === 'ru' ? 'ч.' : 'h.'})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Durability HP Input & Slider Row */}
            <div className="space-y-4 pt-2 border-t border-zinc-800/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block">
                    {lang === 'ru' ? 'Прочность конструкции (HP):' : 'Structure Durability (HP):'}
                  </label>
                  <p className="text-[9px] text-zinc-500 font-mono uppercase">
                    {lang === 'ru' ? 'Перетащите ползунок или укажите точное здоровье' : 'Drag slider or type exact numeric durability health'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    min="0"
                    max={selectedMaterial.maxHp}
                    value={currentHp}
                    onChange={(e) => handleHpInputChange(parseInt(e.target.value) || 0)}
                    className="w-24 bg-[#0c0d10] border border-[#2a2f3b] py-1.5 px-2.5 font-mono text-xs text-white outline-none focus:border-[#f97316]/50 text-center"
                  />
                  <span className="text-xs font-bold font-mono text-zinc-500 uppercase">
                    / {selectedMaterial.maxHp} HP
                  </span>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="bg-[#1b1e26] p-4 border border-[#2a2f3b] space-y-4">
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentPercent}
                    onChange={(e) => handleSliderChange(parseInt(e.target.value) || 0)}
                    className="w-full h-1.5 bg-[#0c0d10] border border-zinc-800 appearance-none cursor-pointer accent-[#f97316]"
                  />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase">
                  <span>0% ({lang === 'ru' ? 'Разрушено' : 'Collapsed'})</span>
                  <span className="text-zinc-300 font-bold">{currentPercent}% HP ({currentHp} HP)</span>
                  <span>100% ({lang === 'ru' ? 'Целое' : 'Pristine'})</span>
                </div>
              </div>

              {/* Quick Presets Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase self-center mr-1">
                  {lang === 'ru' ? 'Пресеты здоровья:' : 'Durability Presets:'}
                </span>
                {[100, 75, 50, 25, 10].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => applyPreset(percent)}
                    className="px-2.5 py-1 bg-[#1b1e26] hover:bg-zinc-800 border border-[#2a2f3b] hover:border-zinc-500 text-zinc-400 hover:text-white font-mono text-[10px] font-black cursor-pointer transition-all"
                  >
                    {percent}%
                  </button>
                ))}
              </div>

              {/* Upkeep info callout */}
              {selectedMaterial.upkeepInfo && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{selectedMaterial.upkeepInfo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Calculations Diagnostic & Quick Timer CTA */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#14171e]/90 p-5 border border-[#2a2f3b] relative overflow-hidden space-y-5 shadow-xl">
            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#f97316]" />

            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-[#2a2f3b] pb-2 flex items-center gap-1.5 font-mono">
              <ShieldAlert size={14} className="text-[#f97316] animate-pulse" />
              <span>{lang === 'ru' ? 'ДИАГНОСТИКА РАЗРУШЕНИЯ' : 'DECAY LIFETIME ESTIMATE'}</span>
            </h3>

            {/* Display Countdown Timer Estimate */}
            <div className="p-5 bg-zinc-900/90 border border-zinc-800 text-center relative overflow-hidden">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                {lang === 'ru' ? 'Конструкция полностью сгниет за:' : 'Structure collapses in:'}
              </div>
              <div className={`text-3xl font-black font-mono mt-2 tracking-tight ${
                currentHp === 0 
                  ? 'text-orange-500' 
                  : remainingHours <= (selectedMaterial.decayTime * 0.2)
                    ? 'text-orange-500 animate-pulse'
                    : remainingHours <= (selectedMaterial.decayTime * 0.5)
                      ? 'text-amber-500'
                      : 'text-emerald-400'
              }`}>
                {currentHp === 0 ? (
                  lang === 'ru' ? 'РАЗРУШЕНО' : 'COLLAPSED'
                ) : (
                  formatHours(remainingHours)
                )}
              </div>

              {/* Progress bar visual indicator */}
              <div className="mt-4 h-1.5 w-full bg-black border border-zinc-800 relative overflow-hidden">
                <motion.div
                  className={`h-full ${
                    currentPercent <= 20 
                      ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' 
                      : currentPercent <= 50 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPercent}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Quick Launch Timer Button */}
              {currentHp > 0 && (
                <button
                  onClick={handleOpenTimerFromCalc}
                  className="mt-4 w-full py-2.5 px-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-orange-500 hover:to-orange-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Bell size={14} className="animate-pulse" />
                  <span>{lang === 'ru' ? 'ПОСТАВИТЬ ТАЙМЕР ОПОВЕЩЕНИЯ' : 'SET DECAY ALARM TIMER'}</span>
                </button>
              )}
            </div>

            {/* Detailed Stats Block */}
            <div className="space-y-3.5 pt-1">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block border-b border-zinc-800/60 pb-1 flex items-center gap-1">
                <Info size={11} className="text-[#f97316]" />
                <span>{lang === 'ru' ? 'ХАРАКТЕРИСТИКИ ГНИЕНИЯ' : 'DECAY RATE PARAMETERS'}</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">{lang === 'ru' ? 'Базовое время (100%):' : 'Full Decay Time:'}</span>
                  <span className="text-zinc-300 font-bold">{selectedMaterial.decayTime} {lang === 'ru' ? 'ч.' : 'hrs'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">{lang === 'ru' ? 'Скорость в час:' : 'Loss per hour:'}</span>
                  <span className="text-amber-500 font-black">-{hpLossPerHour.toFixed(1)} HP</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">{lang === 'ru' ? 'Скорость в минуту:' : 'Loss per minute:'}</span>
                  <span className="text-amber-600 font-bold">-{hpLossPerMin.toFixed(2)} HP</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">{lang === 'ru' ? 'Ресурс защиты:' : 'Required Resource:'}</span>
                  <span className="text-zinc-300 font-bold uppercase">{lang === 'ru' ? selectedMaterial.resourceNameRU : selectedMaterial.resourceNameEN}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE DECAY TIMERS DASHBOARD (Windows Tauri & Browser Notification Engine) */}
      {/* ========================================================================= */}
      <div className="bg-[#14171e]/90 p-5 border border-[#2a2f3b] space-y-5 relative overflow-hidden shadow-2xl">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#2a2f3b] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#f97316]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                {lang === 'ru' ? 'АКТИВНЫЕ ТАЙМЕРЫ ГНИЕНИЯ' : 'ACTIVE DECAY TIMERS & ALARMS'}
              </h3>
              {timers.length > 0 && (
                <span className="bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40 text-[10px] px-2 py-0.5 font-mono font-bold">
                  {timers.length}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">
              {lang === 'ru' 
                ? 'Оповещения работают в фоновом режиме в Windows Tauri и веб-браузере со звуковым сигналом' 
                : 'Audible background alarms operate across Windows Tauri application and desktop browser'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setTimerName('');
                setTimerMaterialId('stone');
                setModalHp(500);
                setTimerNotes('');
                setIsModalOpen(true);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#f97316] hover:bg-[#e04832] text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-[#f97316]/25"
            >
              <Plus size={14} />
              <span>{lang === 'ru' ? 'Новый таймер' : 'New Timer'}</span>
            </button>

            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#1b1e26] hover:bg-[#252a36] text-zinc-300 border border-[#2a2f3b] font-mono text-xs font-semibold cursor-pointer transition-all"
                title={lang === 'ru' ? 'Открыть историю действий в профиле' : 'View action history in profile'}
              >
                <Clock size={13} className="text-orange-400" />
                <span className="hidden md:inline">{lang === 'ru' ? 'История в профиле' : 'Profile History'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Presets Row */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-black/40 border border-[#2a2f3b]">
          <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold mr-1">
            {lang === 'ru' ? '⚡ Быстрый запуск:' : '⚡ Quick Presets:'}
          </span>
          <button
            onClick={() => handleLaunchPreset(3, 'wood', 'Деревянная база', 'Wooden Base')}
            className="px-2.5 py-1 bg-[#1b1e26] hover:bg-[#2a2f3b] text-zinc-300 border border-[#854d0e]/40 font-mono text-[10px] font-semibold cursor-pointer transition-all flex items-center gap-1"
          >
            <WoodIcon size={12} />
            <span>{lang === 'ru' ? 'Дерево (3 ч.)' : 'Wood (3h)'}</span>
          </button>
          <button
            onClick={() => handleLaunchPreset(4, 'stone', 'Каменная база', 'Stone Base')}
            className="px-2.5 py-1 bg-[#1b1e26] hover:bg-[#2a2f3b] text-zinc-300 border border-[#4b5563]/40 font-mono text-[10px] font-semibold cursor-pointer transition-all flex items-center gap-1"
          >
            <StoneIcon size={12} />
            <span>{lang === 'ru' ? 'Камень (4 ч.)' : 'Stone (4h)'}</span>
          </button>
          <button
            onClick={() => handleLaunchPreset(8, 'metal', 'Металлическая база', 'Metal Base')}
            className="px-2.5 py-1 bg-[#1b1e26] hover:bg-[#2a2f3b] text-zinc-300 border border-[#334155]/60 font-mono text-[10px] font-semibold cursor-pointer transition-all flex items-center gap-1"
          >
            <MetalIcon size={12} />
            <span>{lang === 'ru' ? 'Металл (8 ч.)' : 'Sheet Metal (8h)'}</span>
          </button>
          <button
            onClick={() => handleLaunchPreset(12, 'armored', 'МВК Бункер', 'Armored HQM')}
            className="px-2.5 py-1 bg-[#1b1e26] hover:bg-[#2a2f3b] text-zinc-300 border border-[#ca8a04]/40 font-mono text-[10px] font-semibold cursor-pointer transition-all flex items-center gap-1"
          >
            <ArmoredIcon size={12} />
            <span>{lang === 'ru' ? 'МВК (12 ч.)' : 'HQM (12h)'}</span>
          </button>
        </div>

        {/* Timers Grid */}
        {timers.length === 0 ? (
          <div className="p-8 text-center bg-black/20 border border-zinc-800/80 space-y-3">
            <Clock size={32} className="mx-auto text-zinc-600" />
            <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {lang === 'ru' ? 'Нет активных таймеров гниения' : 'No active decay timers'}
            </div>
            <p className="text-[10px] text-zinc-600 font-mono max-w-md mx-auto">
              {lang === 'ru' 
                ? 'Нажмите "Новый таймер" или выберите быстрый пресет выше. При истечении таймера вы получите оповещение в Windows приложении Tauri и браузере с сигналом сирены.' 
                : 'Click "New Timer" or pick a quick preset above. When time expires, an audible notification will fire in the Windows Tauri app and desktop browser.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timers.map((timer) => {
              const percentRemaining = timer.totalDurationSeconds > 0
                ? Math.round((timer.remainingSeconds / timer.totalDurationSeconds) * 100)
                : 0;

              const isExpired = timer.status === 'completed' || timer.remainingSeconds === 0;
              const isPaused = timer.status === 'paused';
              const targetDate = new Date(timer.targetTimestamp);
              const targetTimeFormatted = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={timer.id}
                  className={`p-4 border relative overflow-hidden transition-all ${
                    isExpired
                      ? 'bg-red-950/20 border-red-800/60 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                      : isPaused
                        ? 'bg-zinc-900/60 border-zinc-700/60'
                        : percentRemaining <= 20
                          ? 'bg-red-950/10 border-red-700/50'
                          : 'bg-[#1b1e26] border-[#2a2f3b] hover:border-zinc-500'
                  }`}
                >
                  {/* Top Bar indicator */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isExpired 
                      ? 'bg-red-600 animate-pulse' 
                      : isPaused 
                        ? 'bg-zinc-600' 
                        : percentRemaining <= 20 
                          ? 'bg-red-500' 
                          : percentRemaining <= 50 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                  }`} />

                  {/* Header: Title and Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold font-mono text-white truncate uppercase tracking-wider flex items-center gap-1.5">
                        <span className="truncate">{timer.name}</span>
                      </div>
                      <div className="text-[9px] font-mono text-zinc-400 mt-0.5 flex items-center gap-1">
                        <span>{timer.materialName}</span>
                        {timer.notes && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500 truncate max-w-[120px]">{timer.notes}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <span className={`text-[8.5px] px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider shrink-0 ${
                      isExpired
                        ? 'bg-red-600 text-white font-black animate-pulse'
                        : isPaused
                          ? 'bg-zinc-800 text-zinc-400'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {isExpired 
                        ? (lang === 'ru' ? 'ОБРУШЕНИЕ!' : 'COLLAPSED!') 
                        : isPaused 
                          ? (lang === 'ru' ? 'ПАУЗА' : 'PAUSED') 
                          : (lang === 'ru' ? 'АКТИВЕН' : 'RUNNING')}
                    </span>
                  </div>

                  {/* Big Digital Clock */}
                  <div className="my-3 text-center py-2 bg-black/50 border border-zinc-800">
                    <div className={`font-mono text-2xl sm:text-3xl font-black tracking-widest ${
                      isExpired 
                        ? 'text-orange-500 animate-pulse' 
                        : isPaused 
                          ? 'text-zinc-500' 
                          : percentRemaining <= 20 
                            ? 'text-orange-400' 
                            : 'text-zinc-100'
                    }`}>
                      {formatSecondsToClock(timer.remainingSeconds)}
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                      {isExpired 
                        ? (lang === 'ru' ? 'Срок гниения истек' : 'Decay period elapsed') 
                        : (lang === 'ru' ? `Обрушение около ~${targetTimeFormatted}` : `Collapse at ~${targetTimeFormatted}`)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-black border border-zinc-800 relative overflow-hidden mb-3">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isExpired 
                          ? 'bg-red-600' 
                          : isPaused 
                            ? 'bg-zinc-600' 
                            : percentRemaining <= 20 
                              ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' 
                              : percentRemaining <= 50 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-400'
                      }`}
                      style={{ width: `${percentRemaining}%` }}
                    />
                  </div>

                  {/* Badges: Channels */}
                  <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-zinc-500 mb-3">
                    {timer.notifyTauri && (
                      <span className="flex items-center gap-0.5 px-1 bg-white/5 border border-white/10 rounded-xs text-zinc-400">
                        <Monitor size={9} />
                        <span>Windows</span>
                      </span>
                    )}
                    {timer.notifyBrowser && (
                      <span className="flex items-center gap-0.5 px-1 bg-white/5 border border-white/10 rounded-xs text-zinc-400">
                        <Bell size={9} />
                        <span>Web</span>
                      </span>
                    )}
                    {timer.soundAlert && (
                      <span className="flex items-center gap-0.5 px-1 bg-white/5 border border-white/10 rounded-xs text-zinc-400">
                        <Volume2 size={9} />
                        <span>Chime</span>
                      </span>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-zinc-800">
                    <div className="flex items-center gap-1">
                      {!isExpired && (
                        <button
                          onClick={() => handleTogglePause(timer.id)}
                          className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer transition-all"
                          title={isPaused ? (lang === 'ru' ? 'Возобновить' : 'Resume') : (lang === 'ru' ? 'Пауза' : 'Pause')}
                        >
                          {isPaused ? <Play size={12} className="text-emerald-400" /> : <Pause size={12} className="text-amber-400" />}
                        </button>
                      )}

                      <button
                        onClick={() => handleResetTimer(timer.id)}
                        className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer transition-all"
                        title={lang === 'ru' ? 'Сбросить и перезапустить' : 'Reset & Restart'}
                      >
                        <RotateCcw size={12} />
                      </button>

                      <button
                        onClick={() => playRustAlarmSound()}
                        className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 border border-zinc-700 cursor-pointer transition-all"
                        title={lang === 'ru' ? 'Проверить звук сирены' : 'Test sound chime'}
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteTimer(timer.id)}
                      className="p-1.5 bg-red-950/30 hover:bg-red-900/60 text-orange-400 border border-red-900/40 cursor-pointer transition-all"
                      title={lang === 'ru' ? 'Удалить таймер' : 'Delete timer'}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CREATE NEW TIMER MODAL DIALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-[#14171e] border border-[#2a2f3b] shadow-2xl relative overflow-hidden"
            >
              <div className="rust-bracket-tl" />
              <div className="rust-bracket-tr" />
              <div className="rust-bracket-bl" />
              <div className="rust-bracket-br" />

              <div className="absolute top-0 left-0 right-0 h-1 bg-[#f97316]" />

              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-[#2a2f3b] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#f97316]" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                    {lang === 'ru' ? 'УСТАНОВКА ТАЙМЕРА ГНИЕНИЯ' : 'SET DECAY ALARM TIMER'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 hover:text-white font-mono text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreateTimer} className="p-4 sm:p-5 space-y-4">
                {/* Structure Name */}
                <div>
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    {lang === 'ru' ? 'Название постройки / Базы:' : 'Structure or Base Name:'}
                  </label>
                  <input
                    type="text"
                    value={timerName}
                    onChange={(e) => setTimerName(e.target.value)}
                    placeholder={lang === 'ru' ? 'Например: Мейн база (2 этаж, шкаф)' : 'e.g. Main Base (2nd floor TC)'}
                    className="w-full bg-[#0c0d10] border border-[#2a2f3b] px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#f97316]/60"
                  />
                </div>

                {/* Material Selection */}
                <div>
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    {lang === 'ru' ? 'Материал постройки:' : 'Structure Material:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {materialsData.slice(0, 5).map((mat) => {
                      const isSelected = timerMaterialId === mat.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => {
                            setTimerMaterialId(mat.id);
                            setModalHp(mat.maxHp);
                          }}
                          className={`p-2 border text-left cursor-pointer transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#f97316]/15 border-[#f97316] text-white'
                              : 'bg-[#1b1e26] border-[#2a2f3b] text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span className="shrink-0">{mat.icon}</span>
                          <div className="min-w-0">
                            <div className="text-[9px] font-mono font-bold uppercase truncate">
                              {lang === 'ru' ? mat.nameRU : mat.nameEN}
                            </div>
                            <div className="text-[8px] font-mono text-zinc-500">
                              {mat.maxHp} HP ({mat.decayTime} {lang === 'ru' ? 'ч.' : 'hrs'})
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Structural Durability (HP) Input & Slider Section */}
                <div className="space-y-3 pt-2 border-t border-[#2a2f3b]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <label className="text-[10px] font-mono font-black text-zinc-300 uppercase tracking-widest block">
                        {lang === 'ru' ? 'Прочность конструкции (HP):' : 'Structure Durability (HP):'}
                      </label>
                      <p className="text-[9px] text-zinc-500 font-mono uppercase">
                        {lang === 'ru' ? 'Перетащите ползунок или укажите точное здоровье' : 'Drag slider or type exact numeric durability health'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="number"
                        min="0"
                        max={modalMaterial.maxHp}
                        value={modalHp}
                        onChange={(e) => handleModalHpChange(parseInt(e.target.value) || 0)}
                        className="w-24 bg-[#0c0d10] border border-[#2a2f3b] py-1.5 px-2.5 font-mono text-xs text-white outline-none focus:border-[#f97316]/60 text-center"
                      />
                      <span className="text-xs font-bold font-mono text-zinc-500 uppercase">
                        / {modalMaterial.maxHp} HP
                      </span>
                    </div>
                  </div>

                  {/* Slider Controller */}
                  <div className="bg-[#1b1e26] p-3.5 border border-[#2a2f3b] space-y-3">
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={modalPercent}
                        onChange={(e) => handleModalSliderChange(parseInt(e.target.value) || 0)}
                        className="w-full h-1.5 bg-[#0c0d10] border border-zinc-800 appearance-none cursor-pointer accent-[#f97316]"
                      />
                    </div>

                    <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase">
                      <span>0% ({lang === 'ru' ? 'Разрушено' : 'Collapsed'})</span>
                      <span className="text-zinc-200 font-bold">{modalPercent}% HP ({modalHp} / {modalMaterial.maxHp} HP)</span>
                      <span>100% ({lang === 'ru' ? 'Целое' : 'Pristine'})</span>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/80">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold mr-1">
                        {lang === 'ru' ? 'Быстрый выбор:' : 'Presets:'}
                      </span>
                      {[100, 75, 50, 25, 10].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleModalPreset(preset)}
                          className={`px-2 py-0.5 font-mono text-[9px] border transition-colors cursor-pointer ${
                            modalPercent === preset
                              ? 'bg-[#f97316]/20 border-[#f97316] text-white font-bold'
                              : 'bg-black/30 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {preset}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculated Countdown Time Display */}
                  <div className="p-3 bg-gradient-to-r from-black/60 to-[#1b1e26] border border-[#2a2f3b] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={11} className="text-[#f97316]" />
                        <span>{lang === 'ru' ? 'РАССЧИТАННОЕ ВРЕМЯ ДО ОБРУШЕНИЯ:' : 'CALCULATED DECAY COUNTDOWN:'}</span>
                      </div>
                      <div className="text-sm font-black font-mono text-emerald-400">
                        {modalHp === 0 
                          ? (lang === 'ru' ? '00:00:00 (РАЗРУШЕНО)' : '00:00:00 (COLLAPSED)') 
                          : `${formatHours(modalRemainingHours)} (${formatSecondsToClock(modalTotalSeconds)})`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8.5px] font-mono text-zinc-500 uppercase">
                        {lang === 'ru' ? 'Скорость распада' : 'Decay Rate'}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-amber-500">
                        -{(modalMaterial.maxHp / modalMaterial.decayTime).toFixed(1)} HP / {lang === 'ru' ? 'час' : 'hr'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications Channels Checkboxes */}
                <div className="p-3 bg-black/40 border border-[#2a2f3b] space-y-2">
                  <div className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    {lang === 'ru' ? 'Каналы оповещений при завершении:' : 'Notification Alert Channels:'}
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
                    <input
                      type="checkbox"
                      checked={notifyTauri}
                      onChange={(e) => setNotifyTauri(e.target.checked)}
                      className="accent-[#f97316]"
                    />
                    <span>{lang === 'ru' ? 'Приложение Windows (Tauri Desktop)' : 'Windows App (Tauri Desktop)'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
                    <input
                      type="checkbox"
                      checked={notifyBrowser}
                      onChange={(e) => setNotifyBrowser(e.target.checked)}
                      className="accent-[#f97316]"
                    />
                    <span>{lang === 'ru' ? 'Браузерное системное уведомление (Web Notification)' : 'Browser Desktop Notification'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
                    <input
                      type="checkbox"
                      checked={soundAlert}
                      onChange={(e) => setSoundAlert(e.target.checked)}
                      className="accent-[#f97316]"
                    />
                    <span>{lang === 'ru' ? 'Звуковая сирена тревоги Rust (Web Audio Chime)' : 'Rust Tactical Audio Alarm Siren'}</span>
                  </label>
                </div>

                {/* Notes (Optional) */}
                <div>
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    {lang === 'ru' ? 'Заметка / Напоминание (необязательно):' : 'Notes / Reminder (optional):'}
                  </label>
                  <input
                    type="text"
                    value={timerNotes}
                    onChange={(e) => setTimerNotes(e.target.value)}
                    placeholder={lang === 'ru' ? 'Например: закинуть 500 камня и 300 металла' : 'e.g. deposit 500 stone and 300 metal'}
                    className="w-full bg-[#0c0d10] border border-[#2a2f3b] px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-[#f97316]/60"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2a2f3b]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-[#1b1e26] hover:bg-[#252a36] text-zinc-400 font-mono text-xs uppercase cursor-pointer"
                  >
                    {lang === 'ru' ? 'Отмена' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#f97316] hover:bg-[#e04832] text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-[#f97316]/30 flex items-center gap-1.5"
                  >
                    <Bell size={13} />
                    <span>{lang === 'ru' ? 'Запустить таймер' : 'Start Timer'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
