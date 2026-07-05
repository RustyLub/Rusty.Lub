import { 
  db as clientDb, 
  collection as clientCollection, 
  getDocs as clientGetDocs, 
  getDoc as clientGetDoc,
  query as clientQuery, 
  where as clientWhere,
  addDoc as clientAddDoc,
  updateDoc as clientUpdateDoc,
  doc as clientDoc,
  serverTimestamp as clientServerTimestamp,
  increment as clientIncrement
} from '../lib/firebase-client-on-server';
import { Server as SocketServer } from 'socket.io';
import axios from 'axios';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';

const BM_API_BASE = 'https://api.battlemetrics.com';
const BM_TOKEN = process.env.BM_TOKEN;

// Кэш для лимитов API
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 запрос в секунду для безопасности (60/мин)

async function bmRequest(url: string) {
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestTime)));
  }
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${BM_TOKEN}`
      }
    });
    lastRequestTime = Date.now();
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.error('BattleMetrics API Rate Limit hit');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return bmRequest(url);
    }
    throw error;
  }
}

export class RadarService {
  private io: SocketServer | null = null;

  constructor(io: SocketServer) {
    this.io = io;
  }

  public start() {
    console.log('Radar Service started');
    this.updateTrackedPlayers();
    cron.schedule('* * * * *', () => {
      this.updateTrackedPlayers();
    });
  }

  private async updateTrackedPlayers() {
    const radarLogPath = path.join(process.cwd(), 'radar-log.txt');
    const logRadar = (msg: string) => {
      const line = `[${new Date().toISOString()}] ${msg}\n`;
      console.log(msg);
      try { fs.appendFileSync(radarLogPath, line); } catch (e) {}
    };

    try {
      logRadar('RadarService: Checking for active tracked players...');
      const q = clientQuery(clientCollection(clientDb, 'tracked_players'), clientWhere('isActive', '==', true));
      const playersSnapshot = await clientGetDocs(q);

      if (playersSnapshot.empty) {
        logRadar('RadarService: No active tracked players found.');
        return;
      }

      logRadar(`RadarService: Updating ${playersSnapshot.docs.length} tracked players`);

      for (const docSnapshot of playersSnapshot.docs) {
        const player = docSnapshot.data() as any;
        const playerId = docSnapshot.id;
        const playerDocRef = clientDoc(clientDb, 'tracked_players', playerId);

        try {
          // Получаем текущий статус из BattleMetrics
          const data = await bmRequest(`${BM_API_BASE}/players/${player.battlemetricsId}?include=server`);
          const bmPlayer = data.data;
          const included = data.included || [];
          
          const currentName = bmPlayer.attributes.name;
          const isOnline = bmPlayer.attributes.online;
          const serverInfo = included.find((i: any) => i.type === 'server');

          // 1. Проверка смены имени
          if (currentName !== player.currentName) {
            console.log(`Player ${player.steamId} changed name: ${player.currentName} -> ${currentName}`);
            
            await clientAddDoc(clientCollection(clientDb, 'name_history'), {
              trackedPlayerId: playerId,
              userId: player.userId,
              steamId: player.steamId,
              playerName: currentName,
              detectedAt: clientServerTimestamp()
            });

            await clientUpdateDoc(playerDocRef, { currentName });
            
            this.io?.emit('new_name', {
              steamId: player.steamId,
              newName: currentName,
              oldName: player.currentName
            });
          }

          // 2. Проверка статуса и сессий
          const statusChanged = (isOnline ? 'online' : 'offline') !== player.currentStatus;
          
          if (statusChanged) {
            console.log(`Player ${player.steamId} status changed to ${isOnline ? 'online' : 'offline'}`);
            
            if (isOnline) {
              // Создаем новую сессию
              await clientAddDoc(clientCollection(clientDb, 'sessions'), {
                trackedPlayerId: playerId,
                userId: player.userId,
                steamId: player.steamId,
                serverId: serverInfo?.id || 'unknown',
                serverName: serverInfo?.attributes.name || 'Unknown Server',
                sessionStart: clientServerTimestamp(),
                sessionEnd: null,
                durationSeconds: null,
                isActive: true
              });
              
              await clientUpdateDoc(playerDocRef, {
                currentStatus: 'online',
                currentServer: serverInfo ? {
                  id: serverInfo.id,
                  name: serverInfo.attributes.name,
                  ip: serverInfo.attributes.ip || '',
                  players: serverInfo.attributes.players,
                  maxPlayers: serverInfo.attributes.maxPlayers
                } : null,
                lastCheck: clientServerTimestamp()
              });
            } else {
              // Закрываем активную сессию
              const qSessions = clientQuery(
                clientCollection(clientDb, 'sessions'),
                clientWhere('trackedPlayerId', '==', playerId),
                clientWhere('isActive', '==', true)
              );
              const activeSessions = await clientGetDocs(qSessions);

              for (const sessionDoc of activeSessions.docs) {
                const sessionData = sessionDoc.data() as any;
                const start = sessionData.sessionStart.toDate();
                const end = new Date();
                const durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

                await clientUpdateDoc(clientDoc(clientDb, 'sessions', sessionDoc.id), {
                  sessionEnd: clientServerTimestamp(),
                  durationSeconds,
                  isActive: false
                });

                // Обновляем общую статистику игрока
                await clientUpdateDoc(playerDocRef, {
                  totalPlayTime: clientIncrement(Math.floor(durationSeconds / 60)),
                  totalSessions: clientIncrement(1)
                });
              }

              await clientUpdateDoc(playerDocRef, {
                currentStatus: 'offline',
                currentServer: null,
                lastCheck: clientServerTimestamp()
              });
            }

            this.io?.emit('player_status_update', {
              steamId: player.steamId,
              status: isOnline ? 'online' : 'offline',
              server: serverInfo ? { name: serverInfo.attributes.name, ip: serverInfo.attributes.ip } : null,
              currentName
            });
          } else {
            // Если статус не изменился, просто обновляем lastCheck
            await clientUpdateDoc(playerDocRef, {
              lastCheck: clientServerTimestamp()
            });
          }

        } catch (err) {
          console.error(`Error updating player ${player.steamId}:`, err);
        }
      }
    } catch (error: any) {
      const radarLogPath = path.join(process.cwd(), 'radar-log.txt');
      const msg = `[${new Date().toISOString()}] Radar Service update error: ${error.message}${error.code ? ' Code: ' + error.code : ''}${error.stack ? '\n' + error.stack.split('\n')[1] : ''}\n`;
      try { fs.appendFileSync(radarLogPath, msg); } catch (e) {}
      console.error('Radar Service update error:', error);
    }
  }
}
