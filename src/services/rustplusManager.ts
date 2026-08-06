import RustPlus from '@liamcottle/rustplus.js';
import axios from 'axios';

export interface RustPlusConfig {
  serverHost: string;
  serverPort: number;
  serverId: string;
  playerSteamId: string;
  playerToken: string;
  discordWebhookUrl?: string;
  smartSwitches?: Array<{ id: string; name: string; entityId: string }>;
  smartAlarms?: Array<{ id: string; name: string; entityId: string }>;
  storageMonitors?: Array<{ id: string; name: string; entityId: string }>;
  autoResponders?: {
    pop: boolean;
    time: boolean;
    upkeep: boolean;
    turrets: boolean;
  };
}

export interface BotStatus {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  serverHost: string;
  serverPort: number;
  serverName?: string;
  gameTime?: string;
  timeScale?: number;
  teamSize?: number;
  onlinePlayers?: number;
  maxPlayers?: number;
  lastSync: string | null;
}

class RustPlusManager {
  private instance: any = null;
  private config: RustPlusConfig | null = null;
  private status: BotStatus = {
    connected: false,
    connecting: false,
    error: null,
    serverHost: '',
    serverPort: 28082,
    lastSync: null
  };
  private teamMessages: Array<{ name: string; steamId: string; message: string; time: string }> = [];
  private entityStates: Record<string, { value: boolean; items?: any[]; capacity?: number }> = {};
  private teamMembers: any[] = [];
  private mapMarkers: any[] = [];
  private logTerminal: Array<{ time: string; type: 'info' | 'error' | 'success' | 'chat'; text: string }> = [];

  constructor() {
    this.addLog('info', 'Rust+ Bot Manager initialized. Ready to pair.');
  }

  private addLog(type: 'info' | 'error' | 'success' | 'chat', text: string) {
    const time = new Date().toLocaleTimeString();
    this.logTerminal.unshift({ time, type, text });
    if (this.logTerminal.length > 100) {
      this.logTerminal.pop();
    }
  }

  public getLogs() {
    return this.logTerminal;
  }

  public getStatus(): BotStatus {
    return { ...this.status };
  }

  public getConfig(): RustPlusConfig | null {
    return this.config;
  }

  public getTeamMessages() {
    return this.teamMessages;
  }

  public getTeamMembers() {
    return this.teamMembers;
  }

  public getEntityStates() {
    return this.entityStates;
  }

  public setConfig(config: RustPlusConfig) {
    this.config = config;
  }

  public async connect(config: RustPlusConfig): Promise<BotStatus> {
    this.config = config;
    this.status.connecting = true;
    this.status.error = null;
    this.status.serverHost = config.serverHost;
    this.status.serverPort = config.serverPort || 28082;
    this.addLog('info', `Attempting WebSocket connection to ${config.serverHost}:${config.serverPort}...`);

    if (this.instance) {
      try {
        this.instance.disconnect();
      } catch (e) {}
      this.instance = null;
    }

    return new Promise((resolve) => {
      try {
        const rustplus = new RustPlus(
          config.serverHost,
          config.serverPort || 28082,
          config.playerSteamId,
          parseInt(config.playerToken, 10) || config.playerToken
        );

        rustplus.on('connecting', () => {
          this.status.connecting = true;
          this.addLog('info', 'Connecting to Rust+ server socket...');
        });

        rustplus.on('connected', () => {
          this.status.connected = true;
          this.status.connecting = false;
          this.status.error = null;
          this.status.lastSync = new Date().toISOString();
          this.addLog('success', `Successfully connected to Rust+ Server (${config.serverHost})!`);

          // Fetch initial server info
          this.fetchServerInfo();
          this.fetchTeamInfo();

          resolve(this.getStatus());
        });

        rustplus.on('error', (err: any) => {
          const errMsg = typeof err === 'string' ? err : err?.message || JSON.stringify(err);
          this.status.connected = false;
          this.status.connecting = false;
          this.status.error = errMsg;
          this.addLog('error', `Rust+ Connection Error: ${errMsg}`);
          resolve(this.getStatus());
        });

        rustplus.on('disconnected', () => {
          this.status.connected = false;
          this.status.connecting = false;
          this.addLog('info', 'Disconnected from Rust+ Server socket.');
        });

        rustplus.on('message', (message: any) => {
          this.handleIncomingMessage(message);
        });

        rustplus.connect();
        this.instance = rustplus;

        // Timeout fallback
        setTimeout(() => {
          if (this.status.connecting) {
            this.status.connecting = false;
            this.status.error = 'Connection timed out after 10 seconds. Check IP, Port and Player Token.';
            this.addLog('error', this.status.error);
            resolve(this.getStatus());
          }
        }, 10000);

      } catch (err: any) {
        this.status.connected = false;
        this.status.connecting = false;
        this.status.error = err?.message || 'Failed to instantiate RustPlus client.';
        this.addLog('error', `Exception during connect: ${this.status.error}`);
        resolve(this.getStatus());
      }
    });
  }

  public disconnect() {
    if (this.instance) {
      try {
        this.instance.disconnect();
      } catch (e) {}
      this.instance = null;
    }
    this.status.connected = false;
    this.status.connecting = false;
    this.addLog('info', 'Bot manually disconnected.');
  }

  private handleIncomingMessage(message: any) {
    if (!message) return;

    // Check for broadcast team chat message
    if (message.broadcast && message.broadcast.teamMessage) {
      const chat = message.broadcast.teamMessage.message;
      if (chat) {
        const senderName = chat.name || 'Teammate';
        const senderSteamId = chat.steamId || '';
        const msgText = chat.message || '';
        const time = new Date().toLocaleTimeString();

        this.teamMessages.unshift({ name: senderName, steamId: senderSteamId, message: msgText, time });
        if (this.teamMessages.length > 100) this.teamMessages.pop();

        this.addLog('chat', `[Team Chat] ${senderName}: ${msgText}`);

        // Handle Auto-Responders
        this.handleAutoResponder(senderName, msgText);
      }
    }

    // Check for entity changed broadcast (Smart Switches, Smart Alarms)
    if (message.broadcast && message.broadcast.entityChanged) {
      const entity = message.broadcast.entityChanged;
      const entityId = entity.entityId;
      const payload = entity.payload;

      if (entityId && payload) {
        const val = !!payload.value;
        this.entityStates[entityId] = { ...this.entityStates[entityId], value: val };
        this.addLog('info', `Entity #${entityId} changed state to: ${val ? 'ON' : 'OFF'}`);

        // Check if this entity is a Smart Alarm trigger!
        this.checkSmartAlarmTrigger(entityId, val);
      }
    }
  }

  private async checkSmartAlarmTrigger(entityId: string | number, value: boolean) {
    if (!value || !this.config) return;

    const matchedAlarm = this.config.smartAlarms?.find(a => String(a.entityId) === String(entityId));
    if (matchedAlarm) {
      const alertText = `🚨 RAID ALARM TRIGGERED! Smart Alarm "${matchedAlarm.name}" (ID #${entityId}) was activated!`;
      this.addLog('error', alertText);

      // Send Discord Webhook notification if configured!
      if (this.config.discordWebhookUrl) {
        this.sendDiscordAlert(matchedAlarm.name, String(entityId));
      }
    }
  }

  private async sendDiscordAlert(alarmName: string, entityId: string) {
    if (!this.config?.discordWebhookUrl) return;

    try {
      await axios.post(this.config.discordWebhookUrl, {
        username: "Rusty.Lub Rust+ RAID ALARM",
        avatar_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop",
        embeds: [
          {
            title: "🚨 RUST+ BASE RAID ALARM SIREN!",
            description: `**Smart Alarm Activated:** ${alarmName}\n**Entity ID:** \`#${entityId}\`\n**Server:** ${this.status.serverHost}:${this.status.serverPort}`,
            color: 15158332, // Red
            fields: [
              {
                name: "⚠️ IMMEDIATE ACTION REQUIRED",
                value: "Your base smart alarm circuit has been triggered! Log into Rust immediately or check base cameras."
              }
            ],
            footer: {
              text: "Rusty.Lub Companion Bot Protection System",
              icon_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=100&auto=format&fit=crop"
            },
            timestamp: new Date().toISOString()
          }
        ]
      });
      this.addLog('success', 'Discord raid alarm notification dispatched successfully!');
    } catch (err: any) {
      this.addLog('error', `Failed to send Discord webhook alert: ${err?.message}`);
    }
  }

  private handleAutoResponder(senderName: string, msgText: string) {
    if (!this.config?.autoResponders || !this.status.connected) return;
    const lower = msgText.trim().toLowerCase();

    if (this.config.autoResponders.pop && lower === '!pop') {
      const reply = `[Rusty.Lub Bot] Online Players: ${this.status.onlinePlayers || 'N/A'}/${this.status.maxPlayers || 'N/A'}`;
      this.sendTeamMessage(reply);
    } else if (this.config.autoResponders.time && lower === '!time') {
      const reply = `[Rusty.Lub Bot] In-Game Server Time: ${this.status.gameTime || 'N/A'}`;
      this.sendTeamMessage(reply);
    } else if (this.config.autoResponders.upkeep && lower === '!upkeep') {
      this.sendTeamMessage(`[Rusty.Lub Bot] Checking TC upkeep status...`);
    }
  }

  public async turnSmartSwitch(entityId: string | number, state: boolean): Promise<boolean> {
    if (!this.instance || !this.status.connected) {
      throw new Error('Rust+ Bot is not connected to a server.');
    }

    return new Promise((resolve, reject) => {
      const callback = (res: any) => {
        if (res && res.response && res.response.error) {
          this.addLog('error', `Switch #${entityId} error: ${res.response.error.error}`);
          reject(new Error(res.response.error.error));
        } else {
          this.entityStates[entityId] = { ...this.entityStates[entityId], value: state };
          this.addLog('success', `Smart Switch #${entityId} turned ${state ? 'ON' : 'OFF'}`);
          resolve(true);
        }
      };

      if (state) {
        this.instance.turnSmartSwitchOn(parseInt(String(entityId), 10), callback);
      } else {
        this.instance.turnSmartSwitchOff(parseInt(String(entityId), 10), callback);
      }
    });
  }

  public async getEntityInfo(entityId: string | number): Promise<any> {
    if (!this.instance || !this.status.connected) {
      throw new Error('Rust+ Bot is not connected.');
    }

    return new Promise((resolve, reject) => {
      this.instance.getEntityInfo(parseInt(String(entityId), 10), (res: any) => {
        if (res && res.response && res.response.entityInfo) {
          const info = res.response.entityInfo;
          const val = !!info.payload?.value;
          const items = info.payload?.items || [];
          const capacity = info.payload?.capacity || 0;

          this.entityStates[entityId] = { value: val, items, capacity };
          resolve(info);
        } else if (res && res.response && res.response.error) {
          reject(new Error(res.response.error.error));
        } else {
          resolve(res);
        }
      });
    });
  }

  public async sendTeamMessage(text: string): Promise<boolean> {
    if (!this.instance || !this.status.connected) {
      throw new Error('Rust+ Bot is not connected.');
    }

    return new Promise((resolve, reject) => {
      this.instance.sendTeamMessage(text, (res: any) => {
        if (res && res.response && res.response.error) {
          reject(new Error(res.response.error.error));
        } else {
          this.addLog('chat', `[Bot Sent] ${text}`);
          resolve(true);
        }
      });
    });
  }

  public async fetchServerInfo(): Promise<any> {
    if (!this.instance || !this.status.connected) return null;

    return new Promise((resolve) => {
      this.instance.getInfo((res: any) => {
        if (res && res.response && res.response.info) {
          const info = res.response.info;
          this.status.serverName = info.name;
          this.status.onlinePlayers = info.players;
          this.status.maxPlayers = info.maxPlayers;

          this.addLog('info', `Server: ${info.name} (${info.players}/${info.maxPlayers} players)`);
          resolve(info);
        } else {
          resolve(null);
        }
      });
    });
  }

  public async fetchTime(): Promise<any> {
    if (!this.instance || !this.status.connected) return null;

    return new Promise((resolve) => {
      this.instance.getTime((res: any) => {
        if (res && res.response && res.response.time) {
          const time = res.response.time;
          const hour = Math.floor(time.time);
          const min = Math.floor((time.time - hour) * 60);
          const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

          this.status.gameTime = timeStr;
          this.status.timeScale = time.timeScale;
          resolve(time);
        } else {
          resolve(null);
        }
      });
    });
  }

  public async fetchTeamInfo(): Promise<any> {
    if (!this.instance || !this.status.connected) return null;

    return new Promise((resolve) => {
      this.instance.getTeamInfo((res: any) => {
        if (res && res.response && res.response.teamInfo) {
          const team = res.response.teamInfo;
          this.teamMembers = team.members || [];
          this.status.teamSize = this.teamMembers.length;
          resolve(team);
        } else {
          resolve(null);
        }
      });
    });
  }

  public async getMap(): Promise<any> {
    if (!this.instance || !this.status.connected) return null;

    return new Promise((resolve, reject) => {
      this.instance.getMap((res: any) => {
        if (res && res.response && res.response.map) {
          resolve(res.response.map);
        } else if (res && res.response && res.response.error) {
          reject(new Error(res.response.error.error));
        } else {
          resolve(null);
        }
      });
    });
  }

  public async getMapMarkers(): Promise<any> {
    if (!this.instance || !this.status.connected) return null;

    return new Promise((resolve) => {
      this.instance.getMapMarkers((res: any) => {
        if (res && res.response && res.response.mapMarkers) {
          this.mapMarkers = res.response.mapMarkers.markers || [];
          resolve(this.mapMarkers);
        } else {
          resolve([]);
        }
      });
    });
  }
}

export const rustPlusManager = new RustPlusManager();
