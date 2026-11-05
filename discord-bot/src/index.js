import 'dotenv/config';
import {
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder,
  EmbedBuilder, MessageFlags
} from 'discord.js';
import WebSocket from 'ws';

const env = process.env;
const required = ['DISCORD_BOT_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID', 'RUST_RCON_HOST', 'RUST_RCON_PORT', 'RUST_RCON_PASSWORD'];
const missing = required.filter((key) => !String(env[key] || '').trim());
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const ids = (value = '') => value.split(',').map((v) => v.trim()).filter(Boolean);
const adminUsers = new Set(ids(env.ADMIN_USER_IDS));
const adminRole = String(env.ADMIN_ROLE_ID || '').trim();
const logChannelId = String(env.DISCORD_LOG_CHANNEL_ID || '').trim();
const alertChannelId = String(env.DISCORD_ALERT_CHANNEL_ID || '').trim();
const auditChannelId = String(env.DISCORD_AUDIT_CHANNEL_ID || '').trim();
const serverName = env.RUST_SERVER_NAME || 'Rusty.Lub Vanilla Fun Server';
const gameHost = env.RUST_GAME_HOST || env.RUST_RCON_HOST;
const gamePort = env.RUST_GAME_PORT || '26952';
const pollMs = Math.max(60, Number(env.STATUS_INTERVAL_SECONDS) || 300) * 1000;
const timeoutMs = Math.max(3000, Number(env.RCON_COMMAND_TIMEOUT_MS) || 10000);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = [
  new SlashCommandBuilder().setName('status').setDescription('Показать состояние Rust-сервера'),
  new SlashCommandBuilder().setName('players').setDescription('Показать игроков онлайн'),
  new SlashCommandBuilder().setName('say').setDescription('Отправить сообщение игрокам')
    .addStringOption(o => o.setName('message').setDescription('Текст объявления').setRequired(true).setMaxLength(400)),
  new SlashCommandBuilder().setName('kick').setDescription('Отключить игрока')
    .addStringOption(o => o.setName('player').setDescription('SteamID или имя').setRequired(true).setMaxLength(100))
    .addStringOption(o => o.setName('reason').setDescription('Причина').setRequired(false).setMaxLength(200)),
  new SlashCommandBuilder().setName('rcon').setDescription('Выполнить команду консоли Rust')
    .addStringOption(o => o.setName('command').setDescription('Команда сервера').setRequired(true).setMaxLength(400)),
  new SlashCommandBuilder().setName('restart').setDescription('Перезапустить сервер с подтверждением')
    .addStringOption(o => o.setName('confirmation').setDescription('Введи RESTART').setRequired(true).setMaxLength(20))
].map(c => c.toJSON());

async function textChannel(id) {
  if (!id) return null;
  try {
    const ch = await client.channels.fetch(id);
    return ch?.isTextBased() ? ch : null;
  } catch (e) {
    console.warn('Discord channel unavailable:', e.message);
    return null;
  }
}
async function alert(message) {
  const ch = await textChannel(alertChannelId || logChannelId);
  if (ch) await ch.send({ content: message }).catch(e => console.warn('Alert failed:', e.message));
}
async function audit(interaction, action, details) {
  const ch = await textChannel(auditChannelId);
  if (!ch) return;
  const embed = new EmbedBuilder().setColor(0xd97736)
    .setTitle('Rusty.Lub · журнал администратора')
    .addFields(
      { name: 'Кто', value: `${interaction.user.tag} (${interaction.user.id})` },
      { name: 'Действие', value: action },
      { name: 'Параметры', value: String(details || '—').slice(0, 900) }
    ).setTimestamp();
  await ch.send({ embeds: [embed] }).catch(e => console.warn('Audit failed:', e.message));
}
function isAdmin(i) {
  if (adminUsers.has(i.user.id)) return true;
  return Boolean(adminRole && i.member?.roles?.cache?.has(adminRole));
}
function output(value, max = 1700) {
  const s = String(value ?? '').replace(/\u0000/g, '').trim();
  return s ? (s.length > max ? s.slice(0, max) + '…' : s) : 'Сервер не вернул текстовый ответ.';
}
function parseMessage(value) {
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value.trim()); } catch { return value.trim(); }
}

class WebRcon {
  socket = null;
  nextId = 100;
  pending = new Map();
  reconnectTimer = null;
  connected = false;
  stopped = false;
  lastStatus = null;

  connect() {
    if (this.stopped || this.socket) return;
    const url = `ws://${env.RUST_RCON_HOST}:${env.RUST_RCON_PORT}/${encodeURIComponent(env.RUST_RCON_PASSWORD)}`;
    console.log(`Connecting to WebRCON ${env.RUST_RCON_HOST}:${env.RUST_RCON_PORT}`);
    const ws = new WebSocket(url, { handshakeTimeout: 12000 });
    this.socket = ws;
    ws.on('open', async () => {
      this.connected = true;
      console.log('WebRCON connected');
      await alert('🟢 WebRCON подключён к Rusty.Lub Vanilla.');
      for (const cmd of ['serverinfo', 'playerlist']) {
        try { await this.command(cmd); } catch (e) { console.warn('Initial query failed:', e.message); }
      }
    });
    ws.on('message', data => this.onMessage(data));
    ws.on('error', e => console.warn('WebRCON error:', e.message));
    ws.on('close', () => {
      this.connected = false;
      this.socket = null;
      for (const p of this.pending.values()) { clearTimeout(p.timer); p.reject(new Error('WebRCON connection closed')); }
      this.pending.clear();
      if (!this.stopped) {
        void alert('🟠 Соединение WebRCON потеряно. Повторное подключение через 5 секунд.');
        this.reconnectTimer = setTimeout(() => this.connect(), 5000);
      }
    });
  }

  onMessage(data) {
    let packet;
    try { packet = JSON.parse(data.toString()); } catch { return; }
    const id = Number(packet.Identifier);
    const pending = this.pending.get(id);
    if (pending) {
      clearTimeout(pending.timer);
      this.pending.delete(id);
      pending.resolve(packet);
      return;
    }
    const line = String(packet.Message || '').trim();
    if (line) void this.relay(line, packet);
  }

  command(message) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return Promise.reject(new Error('WebRCON не подключён.'));
    const Identifier = ++this.nextId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(Identifier);
        reject(new Error('Истекло время ожидания ответа RCON.'));
      }, timeoutMs);
      this.pending.set(Identifier, { resolve, reject, timer });
      try {
        this.socket.send(JSON.stringify({ Identifier, Message: message, Name: 'RustyLubDiscord' }));
      } catch (e) {
        clearTimeout(timer);
        this.pending.delete(Identifier);
        reject(e);
      }
    });
  }

  async relay(line, packet) {
    const ch = await textChannel(logChannelId);
    if (!ch) return;
    const clean = output(line, 1700).replace(/```/g, "'''");
    const embed = new EmbedBuilder().setColor(0x7c8795)
      .setDescription(```text\n${clean}\n```)
      .setFooter({ text: `Rust WebRCON · Type ${Number(packet.Type) || 0}` })
      .setTimestamp();
    await ch.send({ embeds: [embed] }).catch(e => console.warn('Log relay failed:', e.message));
  }

  close() {
    this.stopped = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
  }
}

const rcon = new WebRcon();
async function serverInfo() {
  const p = await rcon.command('serverinfo');
  const data = parseMessage(p.Message);
  return data && typeof data === 'object' ? data : { raw: String(p.Message || '') };
}
async function playerList() {
  const p = await rcon.command('playerlist');
  const data = parseMessage(p.Message);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.Players)) return data.Players;
  if (Array.isArray(data?.players)) return data.players;
  return [];
}
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(env.DISCORD_BOT_TOKEN);
  await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), { body: commands });
  console.log('Guild slash commands registered');
}

client.once('ready', async () => {
  console.log(`Discord bot ready: ${client.user.tag}`);
  try { await registerCommands(); } catch (e) { console.error('Command registration failed:', e); }
  rcon.connect();
  setInterval(async () => {
    if (!rcon.connected) return;
    try {
      const info = await serverInfo();
      const online = Number(info.Players ?? info.players ?? 0);
      const max = Number(info.MaxPlayers ?? info.maxPlayers ?? 0);
      const signature = `${online}/${max}`;
      if (signature !== rcon.lastStatus) {
        rcon.lastStatus = signature;
        await alert(`🟢 **${serverName}** — онлайн: **${online}/${max || '?'}**`);
      }
    } catch (e) { console.warn('Status poll failed:', e.message); }
  }, pollMs);
});

client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;
  const name = i.commandName;
  const protectedCommands = new Set(['say', 'kick', 'rcon', 'restart']);
  if (protectedCommands.has(name) && !isAdmin(i)) {
    await i.reply({ content: '⛔ Команда доступна только администраторам Rusty.Lub.', flags: MessageFlags.Ephemeral });
    return;
  }
  await i.deferReply({ flags: protectedCommands.has(name) ? MessageFlags.Ephemeral : undefined }).catch(() => {});
  try {
    if (name === 'status') {
      const info = await serverInfo();
      const online = Number(info.Players ?? info.players ?? 0);
      const max = Number(info.MaxPlayers ?? info.maxPlayers ?? 0);
      const map = info.Map ?? info.map ?? 'не указана';
      const embed = new EmbedBuilder().setColor(0xd97736).setTitle(serverName)
        .setDescription('Vanilla · без Carbon / Oxide')
        .addFields(
          { name: 'Статус', value: '🟢 Онлайн', inline: true },
          { name: 'Игроки', value: `${online}/${max || '?'}`, inline: true },
          { name: 'Карта', value: String(map).slice(0, 100), inline: true },
          { name: 'Адрес', value: `${gameHost}:${gamePort}` }
        ).setTimestamp();
      await i.editReply({ embeds: [embed] });
      return;
    }
    if (name === 'players') {
      const list = await playerList();
      const rows = list.slice(0, 50).map(p => {
        const n = p.DisplayName ?? p.displayName ?? p.Name ?? p.name ?? 'Unknown';
        const id = p.SteamID ?? p.SteamId ?? p.steamid ?? p.Id ?? p.id ?? '';
        return `• ${String(n).slice(0, 60)} ${id ? `— ${id}` : ''}`;
      });
      await i.editReply({ content: rows.length ? `**Игроки онлайн (${list.length}):**\n${rows.join('\n')}` : 'Нет игроков онлайн или сервер не вернул список.' });
      return;
    }
    if (name === 'say') {
      const message = i.options.getString('message', true).replace(/[\r\n]/g, ' ').trim();
      const result = await rcon.command(`say ${message}`);
      await audit(i, '/say', message);
      await i.editReply({ content: `Объявление отправлено.\n${output(result.Message, 1000)}` });
      return;
    }
    if (name === 'kick') {
      const player = i.options.getString('player', true).replace(/[\r\n"]/g, '').trim();
      const reason = (i.options.getString('reason') || 'Kicked by Rusty.Lub staff').replace(/[\r\n"]/g, ' ').trim();
      if (!player) throw new Error('Не указан игрок.');
      const result = await rcon.command(`kick "${player}" "${reason}"`);
      await audit(i, '/kick', `${player} · ${reason}`);
      await i.editReply({ content: output(result.Message) });
      return;
    }
    if (name === 'rcon') {
      const command = i.options.getString('command', true).replace(/[\r\n]/g, ' ').trim();
      if (!command || command.length > 400) throw new Error('Пустая или слишком длинная команда.');
      const result = await rcon.command(command);
      await audit(i, '/rcon', command);
      await i.editReply({ content: `Команда: ${command}\n${output(result.Message, 1300)}` });
      return;
    }
    if (name === 'restart') {
      const confirmation = i.options.getString('confirmation', true);
      if (confirmation !== 'RESTART') throw new Error('Отменено. Для подтверждения введи строго RESTART.');
      await audit(i, '/restart', 'Confirmed restart');
      await i.editReply({ content: 'Запрос на перезапуск отправлен. Сервер временно отключится.' });
      await rcon.command('restart').catch(e => console.warn('Restart response may be lost:', e.message));
    }
  } catch (e) {
    const message = output(e?.message || e, 1400);
    await i.editReply({ content: `⚠️ ${message}` }).catch(() => {});
    if (protectedCommands.has(name)) await audit(i, `/${name} · ERROR`, message);
  }
});

client.on('error', e => console.error('Discord client error:', e));
function shutdown() {
  console.log('Stopping Rusty.Lub Discord bot');
  rcon.close();
  client.destroy();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
client.login(env.DISCORD_BOT_TOKEN);
