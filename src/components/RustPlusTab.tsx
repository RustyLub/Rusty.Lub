import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Power,
  Wifi,
  WifiOff,
  ShieldAlert,
  Server,
  Zap,
  Volume2,
  VolumeX,
  Send,
  RefreshCw,
  Plus,
  Trash2,
  Terminal,
  Clock,
  User,
  Users,
  Box,
  MapPin,
  Bell,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Flame,
  Radio,
  Lock
} from 'lucide-react';
import { CustomUser, ToastType } from '../types';
import { auth } from '../firebase';

interface RustPlusTabProps {
  lang: 'ru' | 'en';
  currentUser: CustomUser | null;
  isAdmin: boolean;
  onToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function RustPlusTab({ lang, currentUser, isAdmin, onToast }: RustPlusTabProps) {
  const [subTab, setSubTab] = useState<'pairing' | 'switches' | 'storage' | 'chat' | 'map' | 'alarms' | 'logs'>('pairing');
  const [loading, setLoading] = useState(false);
  const [botStatus, setBotStatus] = useState<any>({ connected: false, connecting: false, error: null });
  const [logs, setLogs] = useState<any[]>([]);
  const [teamMessages, setTeamMessages] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [entityStates, setEntityStates] = useState<Record<string, any>>({});

  // Pairing Config Form
  const [serverHost, setServerHost] = useState('198.27.75.123');
  const [serverPort, setServerPort] = useState(28082);
  const [serverId, setServerId] = useState('');
  const [playerSteamId, setPlayerSteamId] = useState('76561198000000000');
  const [playerToken, setPlayerToken] = useState('12345678');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [jsonImport, setJsonImport] = useState('');
  const [jsonImportOpen, setJsonImportOpen] = useState(false);

  // Chat message input
  const [chatInput, setChatInput] = useState('');

  // Switches state
  const [switches, setSwitches] = useState<Array<{ id: string; name: string; entityId: string }>>([
    { id: '1', name: 'Авто-Турели Крыши', entityId: '1029384' },
    { id: '2', name: 'Система ПВО (SAM)', entityId: '2039485' },
    { id: '3', name: 'Освещение Базы', entityId: '3049586' }
  ]);
  const [newSwitchName, setNewSwitchName] = useState('');
  const [newSwitchEntity, setNewSwitchEntity] = useState('');

  // Alarms state
  const [alarms, setAlarms] = useState<Array<{ id: string; name: string; entityId: string }>>([
    { id: '1', name: 'Сигнализация Периметра (Дверь)', entityId: '8839201' }
  ]);
  const [newAlarmName, setNewAlarmName] = useState('');
  const [newAlarmEntity, setNewAlarmEntity] = useState('');

  // TC / Storage state
  const [tcEntityId, setTcEntityId] = useState('4492019');
  const [tcData, setTcData] = useState<any>(null);

  // Audio siren alert state
  const [sirenMuted, setSirenMuted] = useState(false);

  // Auto-responders config
  const [autoResponders, setAutoResponders] = useState({
    pop: true,
    time: true,
    upkeep: true,
    turrets: false
  });

  // Helper to build headers with custom user UID and optional ID Token
  const getAuthHeaders = async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-user-uid': currentUser?.uid || 'serustqs'
    };
    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        if (idToken) {
          headers['Authorization'] = `Bearer ${idToken}`;
        }
      }
    } catch (e) {
      // ignore token retrieval error
    }
    return headers;
  };

  // Fetch initial status from server
  const fetchStatus = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/rustplus/status', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBotStatus(data.status || {});
          setLogs(data.logs || []);
          setTeamMessages(data.teamMessages || []);
          setTeamMembers(data.teamMembers || []);
          setEntityStates(data.entityStates || {});
          if (data.config) {
            if (data.config.serverHost) setServerHost(data.config.serverHost);
            if (data.config.serverPort) setServerPort(data.config.serverPort);
            if (data.config.playerSteamId) setPlayerSteamId(data.config.playerSteamId);
            if (data.config.playerToken) setPlayerToken(data.config.playerToken);
            if (data.config.discordWebhookUrl) setDiscordWebhook(data.config.discordWebhookUrl);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch bot status:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  // Connect Bot action
  const handleConnect = async () => {
    if (!serverHost || !playerSteamId || !playerToken) {
      onToast(lang === 'ru' ? 'Заполните Server Host, Steam ID и Player Token!' : 'Please fill Host, Steam ID and Token!', 'error');
      return;
    }
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const payload = {
        serverHost: serverHost.trim(),
        serverPort: Number(serverPort) || 28082,
        serverId: serverId.trim(),
        playerSteamId: playerSteamId.trim(),
        playerToken: playerToken.trim(),
        discordWebhookUrl: discordWebhook.trim(),
        smartSwitches: switches,
        smartAlarms: alarms,
        autoResponders
      };

      const res = await fetch('/api/rustplus/connect', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.status?.connected) {
        onToast(lang === 'ru' ? 'Бот Rust+ успешно подключен к серверу!' : 'Rust+ Bot connected successfully!', 'success');
        fetchStatus();
      } else {
        onToast(data.status?.error || data.error || 'Connection failed', 'error');
      }
    } catch (err: any) {
      setLoading(false);
      onToast(err.message || 'Error connecting to Rust+', 'error');
    }
  };

  // Disconnect Bot action
  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      await fetch('/api/rustplus/disconnect', {
        method: 'POST',
        headers
      });
      setLoading(false);
      onToast(lang === 'ru' ? 'Бот отключен от Rust+ сервера.' : 'Bot disconnected.', 'info');
      fetchStatus();
    } catch (err: any) {
      setLoading(false);
      onToast(err.message || 'Error disconnecting', 'error');
    }
  };

  // Toggle Switch Action
  const handleToggleSwitch = async (entityId: string, currentState: boolean) => {
    try {
      const headers = await getAuthHeaders();
      const targetState = !currentState;
      const res = await fetch('/api/rustplus/switch', {
        method: 'POST',
        headers,
        body: JSON.stringify({ entityId, state: targetState })
      });

      const data = await res.json();
      if (data.success) {
        onToast(lang === 'ru' ? `Переключатель #${entityId} изменён (${targetState ? 'ВКЛ' : 'ВЫКЛ'})` : `Switch #${entityId} toggled`, 'success');
        fetchStatus();
      } else {
        onToast(data.error || 'Failed to toggle switch', 'error');
      }
    } catch (err: any) {
      onToast(err.message || 'Error toggling switch', 'error');
    }
  };

  // Send Team Chat Message
  const handleSendTeamMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const headers = await getAuthHeaders();
      const text = chatInput.trim();
      setChatInput('');

      const res = await fetch('/api/rustplus/team-message', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      if (data.success) {
        fetchStatus();
      } else {
        onToast(data.error || 'Failed to send message', 'error');
      }
    } catch (err: any) {
      onToast(err.message || 'Error sending chat', 'error');
    }
  };

  // Fetch TC Info
  const handleFetchTcInfo = async () => {
    if (!tcEntityId.trim()) return;
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/rustplus/entity-info', {
        method: 'POST',
        headers,
        body: JSON.stringify({ entityId: tcEntityId.trim() })
      });

      const data = await res.json();
      setLoading(false);
      if (data.success && data.info) {
        setTcData(data.info);
        onToast(lang === 'ru' ? 'Данные шкафа успешно загружены!' : 'Storage Info Fetched!', 'success');
      } else {
        onToast(data.error || 'Failed to fetch TC info', 'error');
      }
    } catch (err: any) {
      setLoading(false);
      onToast(err.message || 'Error fetching TC', 'error');
    }
  };

  // Test Discord Webhook
  const handleTestWebhook = async () => {
    if (!discordWebhook.trim()) {
      onToast(lang === 'ru' ? 'Введите URL Discord Webhook!' : 'Enter Discord Webhook URL!', 'error');
      return;
    }
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/rustplus/test-webhook', {
        method: 'POST',
        headers,
        body: JSON.stringify({ webhookUrl: discordWebhook.trim() })
      });

      const data = await res.json();
      if (data.success) {
        onToast(lang === 'ru' ? 'Тестовое сирена-уведомление отправлено в Discord!' : 'Test alert sent to Discord!', 'success');
      } else {
        onToast(data.error || 'Webhook test failed', 'error');
      }
    } catch (err: any) {
      onToast(err.message || 'Webhook error', 'error');
    }
  };

  // Handle FCM / JSON Import
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonImport);
      if (parsed.ip || parsed.serverHost) setServerHost(parsed.ip || parsed.serverHost);
      if (parsed.port || parsed.serverPort) setServerPort(Number(parsed.port || parsed.serverPort));
      if (parsed.serverId) setServerId(parsed.serverId);
      if (parsed.playerSteamId || parsed.steamId) setPlayerSteamId(parsed.playerSteamId || parsed.steamId);
      if (parsed.playerToken || parsed.token) setPlayerToken(parsed.playerToken || parsed.token);

      onToast(lang === 'ru' ? 'Данные пайринга успешно импортированы!' : 'Pairing JSON imported!', 'success');
      setJsonImportOpen(false);
      setJsonImport('');
    } catch (e) {
      onToast(lang === 'ru' ? 'Неверный формат JSON пайринга!' : 'Invalid JSON pairing format!', 'error');
    }
  };

  // Restricted Access Screen for Non-Admins
  if (!isAdmin) {
    return (
      <div className="cyber-panel p-8 text-center space-y-6 relative overflow-hidden my-8">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
          <Lock size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black font-teko uppercase tracking-wider text-white">
            {lang === 'ru' ? 'ДОСТУП ОГРАНИЧЕН ВЛАДЕЛЬЦЕМ (OWNER ONLY)' : 'RESTRICTED ACCESS (SYSTEM OWNER ONLY)'}
          </h2>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            {lang === 'ru'
              ? 'Управление компаньон-ботом Rust+ доступно исключительно владельцу и администраторам платформы Rusty.Lub.'
              : 'Rust+ Companion Bot Hub is strictly restricted to system owners and head administrators.'}
          </p>
        </div>

        <div className="p-4 bg-black/40 border border-zinc-800 rounded-sm font-mono text-[10px] text-zinc-500 max-w-sm mx-auto">
          AUTHENTICATION STATUS: <span className="text-red-400 font-bold">LIMITED USER</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER BANNER */}
      <div className="cyber-panel p-5 relative overflow-hidden bg-gradient-to-r from-zinc-950 via-[#1b1e26] to-zinc-950 border border-[#2a2f3b]">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/40 rounded-sm flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Cpu size={24} className={botStatus.connected ? 'animate-pulse' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black font-teko text-white uppercase tracking-wider">
                  RUST+ COMPANION BOT HUB
                </h1>
                <span className="px-2 py-0.5 text-[8px] font-mono font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-sm">
                  OWNER CONTROL
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                {lang === 'ru'
                  ? 'Прямое WebSocket подключение к игровому серверу Rust без симуляций'
                  : 'Direct WebSocket Rust Server Companion Client & Automation Engine'}
              </p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-zinc-800 rounded-sm font-mono text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${botStatus.connected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] animate-ping' : botStatus.connecting ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="font-bold text-white uppercase">
                {botStatus.connected ? 'ONLINE' : botStatus.connecting ? 'CONNECTING...' : 'OFFLINE'}
              </span>
            </div>

            {botStatus.connected ? (
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500 text-red-400 font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
              >
                <Power size={14} />
                <span>{lang === 'ru' ? 'Отключить' : 'Disconnect'}</span>
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Wifi size={14} />
                <span>{loading ? 'CONNECTING...' : (lang === 'ru' ? 'Подключить Бота' : 'Connect Bot')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Status Bar */}
        {botStatus.connected && (
          <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-zinc-500 uppercase text-[9px] block">Server Host:</span>
              <span className="text-white font-bold truncate block">{botStatus.serverHost}:{botStatus.serverPort}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[9px] block">Server Name:</span>
              <span className="text-amber-400 font-bold truncate block">{botStatus.serverName || 'Rust Server'}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[9px] block">Online Players:</span>
              <span className="text-emerald-400 font-bold block">{botStatus.onlinePlayers || 0} / {botStatus.maxPlayers || 0}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[9px] block">In-Game Time:</span>
              <span className="text-cyan-400 font-bold block flex items-center gap-1">
                <Clock size={12} />
                <span>{botStatus.gameTime || '12:00'}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-800/80 pb-2">
        {[
          { id: 'pairing', label: lang === 'ru' ? '🔌 Подключение & Сервер' : '🔌 Server Connection', icon: <Server size={14} /> },
          { id: 'switches', label: lang === 'ru' ? '🎛️ Умные Переключатели' : '🎛️ Smart Switches', icon: <Zap size={14} /> },
          { id: 'storage', label: lang === 'ru' ? '📦 Шкаф & Ресурсы' : '📦 Storage & TC', icon: <Box size={14} /> },
          { id: 'chat', label: lang === 'ru' ? '💬 Чат & Автоответчик' : '💬 Team Chat', icon: <Radio size={14} /> },
          { id: 'map', label: lang === 'ru' ? '🗺️ Карта & Команда' : '🗺️ Map & Team', icon: <MapPin size={14} /> },
          { id: 'alarms', label: lang === 'ru' ? '🔔 Сигнализация & Discord' : '🔔 Raid Alarms', icon: <Bell size={14} /> },
          { id: 'logs', label: lang === 'ru' ? '💻 Консоль Логов' : '💻 Terminal Logs', icon: <Terminal size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer rounded-sm ${
              subTab === tab.id
                ? 'bg-[#cd412b] text-white border border-[#ff2a4d] shadow-[0_0_10px_rgba(205,65,43,0.3)]'
                : 'bg-black/30 text-zinc-400 hover:text-white hover:bg-white/5 border border-zinc-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. PAIRING & SERVER CONFIG */}
      {subTab === 'pairing' && (
        <div className="space-y-6">
          <div className="cyber-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold font-mono text-white uppercase flex items-center gap-2">
                <Server size={18} className="text-amber-400" />
                <span>{lang === 'ru' ? 'Параметры Подключения к Rust Companion API' : 'Rust Companion Server Connection Settings'}</span>
              </h3>

              <button
                onClick={() => setJsonImportOpen(!jsonImportOpen)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-mono text-amber-400 font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileCode size={14} />
                <span>{lang === 'ru' ? 'Импорт FCM JSON / Pairing' : 'Import Pairing JSON'}</span>
              </button>
            </div>

            {/* FCM JSON Import Drawer */}
            <AnimatePresence>
              {jsonImportOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-black/60 border border-amber-500/30 rounded-sm space-y-3"
                >
                  <label className="text-xs font-mono text-amber-300 font-bold uppercase block">
                    {lang === 'ru' ? 'Вставьте JSON пайринга из Rust Companion App / Rust+ Bot:' : 'Paste FCM Pairing JSON Payload:'}
                  </label>
                  <textarea
                    rows={4}
                    value={jsonImport}
                    onChange={(e) => setJsonImport(e.target.value)}
                    placeholder='{"ip": "198.27.75.123", "port": "28082", "playerId": "76561198000000000", "playerToken": "12345678"}'
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs font-mono text-zinc-300 rounded-sm focus:border-amber-500 outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setJsonImportOpen(false)}
                      className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs font-mono uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportJson}
                      className="px-4 py-1 bg-amber-600 text-white font-mono text-xs font-bold uppercase hover:bg-amber-500"
                    >
                      Import & Fill
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold block mb-1">
                  Server Host IP / Domain *
                </label>
                <input
                  type="text"
                  value={serverHost}
                  onChange={(e) => setServerHost(e.target.value)}
                  placeholder="e.g. long.rustoria.us or 198.27.75.123"
                  className="w-full bg-black/50 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-red-500 outline-none"
                />
                <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                  Пример: для Rustoria укажите домен <code className="text-amber-400">long.rustoria.us</code> (без порта :28010)
                </span>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold block mb-1">
                  Companion Port (Порт Rust+) *
                </label>
                <input
                  type="number"
                  value={serverPort}
                  onChange={(e) => setServerPort(Number(e.target.value))}
                  placeholder="28082"
                  className="w-full bg-black/50 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-red-500 outline-none"
                />
                <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                  Порт приложений Rust+ обычно <code className="text-amber-400">28082</code> (не путать с игровыми портами 28010 / 28015)
                </span>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold block mb-1">
                  Player Steam ID 64 *
                </label>
                <input
                  type="text"
                  value={playerSteamId}
                  onChange={(e) => setPlayerSteamId(e.target.value)}
                  placeholder="76561198000000000"
                  className="w-full bg-black/50 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold block mb-1">
                  Player Token (Pairing Secret) *
                </label>
                <input
                  type="password"
                  value={playerToken}
                  onChange={(e) => setPlayerToken(e.target.value)}
                  placeholder="12345678"
                  className="w-full bg-black/50 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Wifi size={16} />
                <span>{botStatus.connected ? 'Переподключить' : 'Сохранить и Подключить'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SMART SWITCHES */}
      {subTab === 'switches' && (
        <div className="space-y-6">
          <div className="cyber-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold font-mono text-white uppercase flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                <span>{lang === 'ru' ? 'Управление Умными Переключателями (Smart Switches)' : 'Smart Switches Management'}</span>
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    for (const sw of switches) {
                      await handleToggleSwitch(sw.entityId, false);
                    }
                  }}
                  className="px-3 py-1 bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase hover:bg-red-600/40 cursor-pointer"
                >
                  🚨 Panic OFF All
                </button>
                <button
                  onClick={async () => {
                    for (const sw of switches) {
                      await handleToggleSwitch(sw.entityId, true);
                    }
                  }}
                  className="px-3 py-1 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase hover:bg-emerald-600/40 cursor-pointer"
                >
                  ⚡ ARM ALL ON
                </button>
              </div>
            </div>

            {/* List of Smart Switches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {switches.map((sw) => {
                const state = entityStates[sw.entityId]?.value;
                return (
                  <div key={sw.id} className="p-4 bg-black/40 border border-zinc-800 rounded-sm space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-xs font-mono">{sw.name}</div>
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-sm ${state ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-500'}`}>
                        {state ? 'ВКЛ' : 'ВЫКЛ'}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-zinc-500">
                      Entity ID: <span className="text-amber-400">#{sw.entityId}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                      <button
                        onClick={() => handleToggleSwitch(sw.entityId, !!state)}
                        disabled={!botStatus.connected}
                        className={`w-full py-2 font-mono text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                          state
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        <Power size={14} />
                        <span>{state ? 'ВКЛЮЧЕНО (ОТКЛЮЧИТЬ)' : 'ВЫКЛЮЧЕНО (ВКЛЮЧИТЬ)'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Switch Form */}
            <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Название устройства</label>
                <input
                  type="text"
                  value={newSwitchName}
                  onChange={(e) => setNewSwitchName(e.target.value)}
                  placeholder="e.g. Свет в доме"
                  className="w-full bg-black/50 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Entity ID (из Rust+ Pairing)</label>
                <input
                  type="text"
                  value={newSwitchEntity}
                  onChange={(e) => setNewSwitchEntity(e.target.value)}
                  placeholder="e.g. 1029384"
                  className="w-full bg-black/50 border border-zinc-800 p-2 text-xs font-mono text-white rounded-sm"
                />
              </div>
              <button
                onClick={() => {
                  if (newSwitchName && newSwitchEntity) {
                    setSwitches([...switches, { id: Date.now().toString(), name: newSwitchName, entityId: newSwitchEntity }]);
                    setNewSwitchName('');
                    setNewSwitchEntity('');
                    onToast('Устройство добавлено!', 'success');
                  }
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase cursor-pointer"
              >
                + Добавить Переключатель
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TC & STORAGE MONITORS */}
      {subTab === 'storage' && (
        <div className="space-y-6">
          <div className="cyber-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold font-mono text-white uppercase flex items-center gap-2">
                <Box size={18} className="text-amber-400" />
                <span>{lang === 'ru' ? 'Мониторинг Шкафа (Tool Cupboard) и Хранилищ' : 'TC & Storage Monitors'}</span>
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={tcEntityId}
                onChange={(e) => setTcEntityId(e.target.value)}
                placeholder="TC Storage Monitor Entity ID (e.g. 4492019)"
                className="flex-1 bg-black/50 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm"
              />
              <button
                onClick={handleFetchTcInfo}
                disabled={loading || !botStatus.connected}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>{lang === 'ru' ? 'Запросить данные' : 'Fetch Info'}</span>
              </button>
            </div>

            {/* TC Info Display */}
            {tcData && (
              <div className="p-4 bg-black/40 border border-zinc-800 rounded-sm space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="font-bold text-emerald-400 font-mono text-sm">TOOL CUPBOARD STATUS</div>
                  <div className="text-xs font-mono text-zinc-400">
                    Capacity: <span className="text-white">{tcData.payload?.capacity || 24} slots</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(tcData.payload?.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-zinc-900 border border-zinc-800 rounded-sm text-center">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">Item ID #{item.itemId}</div>
                      <div className="text-lg font-black font-mono text-white">{item.quantity?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TEAM CHAT & AUTO-RESPONDER */}
      {subTab === 'chat' && (
        <div className="space-y-6">
          <div className="cyber-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold font-mono text-white uppercase flex items-center gap-2">
                <Radio size={18} className="text-amber-400" />
                <span>{lang === 'ru' ? 'Внутриигровой Чат Команды Rust+' : 'Rust+ Team Chat Stream'}</span>
              </h3>
            </div>

            {/* Live Chat Box */}
            <div className="h-64 bg-black/60 border border-zinc-800 rounded-sm p-3 overflow-y-auto space-y-2 font-mono text-xs">
              {teamMessages.length === 0 ? (
                <div className="text-zinc-600 text-center py-12">
                  {lang === 'ru' ? 'Сообщений пока нет...' : 'No team chat messages yet...'}
                </div>
              ) : (
                teamMessages.map((msg, idx) => (
                  <div key={idx} className="flex items-start gap-2 border-b border-zinc-900/60 pb-1.5">
                    <span className="text-zinc-500 text-[10px]">{msg.time}</span>
                    <span className="text-amber-400 font-bold">{msg.name}:</span>
                    <span className="text-zinc-200">{msg.message}</span>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendTeamMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={lang === 'ru' ? 'Написать в командный чат Rust+...' : 'Type message to team chat...'}
                className="flex-1 bg-black/50 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm focus:border-red-500 outline-none"
              />
              <button
                type="submit"
                disabled={!botStatus.connected}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={14} />
                <span>Send</span>
              </button>
            </form>

            {/* Auto-Responders Toggles */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                {lang === 'ru' ? 'Автоответчик Команд Бота:' : 'Bot Auto-Responder Triggers:'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'pop', label: '!pop (Онлайн)', state: autoResponders.pop },
                  { key: 'time', label: '!time (Время в игре)', state: autoResponders.time },
                  { key: 'upkeep', label: '!upkeep (Ресурсы)', state: autoResponders.upkeep }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setAutoResponders({ ...autoResponders, [item.key]: !item.state })}
                    className={`p-2.5 text-xs font-mono font-bold uppercase border rounded-sm flex items-center justify-between cursor-pointer ${
                      item.state ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-black/30 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span>{item.state ? 'ВКЛ' : 'ВЫКЛ'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAP & TEAM MEMBERS */}
      {subTab === 'map' && (
        <div className="space-y-6">
          <div className="cyber-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold font-mono text-white uppercase flex items-center gap-2">
                <Users size={18} className="text-amber-400" />
                <span>{lang === 'ru' ? 'Состав Команды и Статус Игроков' : 'Team Members Status'}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamMembers.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs col-span-2">
                  {lang === 'ru' ? 'Подключите бота для отображения списка тиммейтов.' : 'Connect bot to fetch team list.'}
                </div>
              ) : (
                teamMembers.map((member, idx) => (
                  <div key={idx} className="p-3 bg-black/40 border border-zinc-800 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${member.isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-700'}`} />
                      <div>
                        <div className="font-bold text-white text-xs font-mono">{member.name || 'Teammate'}</div>
                        <div className="text-[10px] font-mono text-zinc-500">Steam ID: {member.steamId}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className={member.isAlive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {member.isAlive ? 'ALIVE' : 'DEAD'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. RAID ALARMS & DISCORD WEBHOOK */}
      {subTab === 'alarms' && (
        <div className="space-y-6">
          <div className="cyber-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold font-mono text-white uppercase flex items-center gap-2">
                <Bell size={18} className="text-red-400" />
                <span>{lang === 'ru' ? 'Настройка Сигнализации Рейда и Discord Уведомлений' : 'Raid Alarms & Discord Integration'}</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold block mb-1">
                  Discord Webhook URL (для мгновенных сирен в канал Discord):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="flex-1 bg-black/50 border border-zinc-800 p-2.5 text-xs font-mono text-white rounded-sm"
                  />
                  <button
                    onClick={handleTestWebhook}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase transition cursor-pointer"
                  >
                    Тест Webhook
                  </button>
                </div>
              </div>

              {/* Registered Alarms Grid */}
              <div className="pt-2 space-y-2">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Подключенные Smart Alarms (Сигнализации):
                </div>
                {alarms.map((al) => (
                  <div key={al.id} className="p-3 bg-black/40 border border-zinc-800 rounded-sm flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-white font-bold">{al.name}</span>
                      <span className="text-zinc-500 text-[10px] ml-2">ID #{al.entityId}</span>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 rounded-sm uppercase">
                      ACTIVE MONITORING
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TERMINAL LOGS */}
      {subTab === 'logs' && (
        <div className="space-y-4">
          <div className="cyber-panel p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Terminal size={14} />
                <span>Real-Time WebSocket Terminal Console</span>
              </span>
              <button
                onClick={fetchStatus}
                className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="h-96 bg-black p-3 font-mono text-[11px] overflow-y-auto space-y-1 text-zinc-300">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-zinc-600">[{log.time}]</span>
                  <span
                    className={
                      log.type === 'error'
                        ? 'text-red-400 font-bold'
                        : log.type === 'success'
                        ? 'text-emerald-400 font-bold'
                        : log.type === 'chat'
                        ? 'text-cyan-400'
                        : 'text-zinc-300'
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
