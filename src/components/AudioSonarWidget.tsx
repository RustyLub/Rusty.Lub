import React, { useState, useEffect } from 'react';
import { Radio, Volume2, VolumeX, ShieldAlert, Activity, Play, Pause, Zap } from 'lucide-react';
import { playNotificationAudio } from '../services/tauriNotifications';

interface AudioSonarWidgetProps {
  lang: 'ru' | 'en';
  nearestDistanceMeters?: number;
  appTheme?: 'light' | 'dark';
}

export const AudioSonarWidget: React.FC<AudioSonarWidgetProps> = ({
  lang,
  nearestDistanceMeters = 150,
  appTheme = 'dark'
}) => {
  const isLight = appTheme === 'light';
  const [sonarActive, setSonarActive] = useState(false);
  const [muteAudio, setMuteAudio] = useState(false);

  // Pulse sonar sound periodically based on nearest player distance
  useEffect(() => {
    if (!sonarActive || muteAudio) return;

    // Fast pulse if closer than 100m, slow pulse if > 300m
    const intervalMs = Math.max(500, Math.min(3000, nearestDistanceMeters * 8));

    const interval = setInterval(() => {
      playNotificationAudio('radar');
    }, intervalMs);

    return () => clearInterval(interval);
  }, [sonarActive, muteAudio, nearestDistanceMeters]);

  return (
    <div className={`p-4 rounded-xl border font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
      isLight
        ? 'bg-neutral-50 border-neutral-200 text-neutral-800'
        : 'bg-[#10141e] border-[#1e2638] text-[#eef2f7]'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${
          sonarActive
            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 animate-pulse'
            : 'bg-neutral-800 text-neutral-500'
        }`}>
          <Radio size={20} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm uppercase font-teko tracking-wide">
              {lang === 'ru' ? 'ЗВУКОВОЙ СОНАР ПРИБЛИЖЕНИЯ ВРАГОВ' : 'AUDIO PROXIMITY SONAR RADAR'}
            </span>
            {sonarActive && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-ping">
                SONAR ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400">
            {lang === 'ru' 
              ? `Ближайший игрок: ${nearestDistanceMeters}м. Звуковой импульс ускоряется при приближении.`
              : `Nearest enemy: ${nearestDistanceMeters}m. Sonar pulse speeds up as targets close in.`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setMuteAudio(!muteAudio)}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            muteAudio 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
              : 'bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700'
          }`}
          title={muteAudio ? 'Muted' : 'Sound Enabled'}
        >
          {muteAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          onClick={() => setSonarActive(!sonarActive)}
          className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
            sonarActive
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {sonarActive ? <Pause size={14} /> : <Play size={14} />}
          <span>{sonarActive ? (lang === 'ru' ? 'Выключить Сонар' : 'Stop Sonar') : (lang === 'ru' ? 'Включить Сонар' : 'Start Sonar')}</span>
        </button>
      </div>
    </div>
  );
};

export default AudioSonarWidget;
