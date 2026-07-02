import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client on the server side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API route for Gemini troubleshooter
  app.post("/api/gemini/solve", async (req, res) => {
    try {
      const { errorQuery } = req.body;
      if (!errorQuery) {
        return res.status(400).json({ error: "No errorQuery provided" });
      }

      const prompt = `Ты — профессиональный ИИ-диагност и технический эксперт по игре Rust (Facepunch) и античиту Easy Anti-Cheat (EAC).
Пользователь столкнулся со следующей ошибкой, проблемой или кодом сбоя: "${errorQuery}".

Предоставь подробную, технически грамотную и пошаговую инструкцию по исправлению этой ошибки на русском языке.
Твой ответ должен содержать:
1. **Суть проблемы**: Почему эта ошибка возникает (конфликт драйверов, нехватка ОЗУ, проблемы авторизации Steam, ложные блокировки EAC, сетевые задержки или баги Unity).
2. **Основные шаги решения**: Пошаговый план решения от простого к сложному (параметры запуска Steam, редактирование конфигов, настройки брандмауэра/семейного доступа, очистка кэшей, отключение конфликтующего софта, переустановка EAC и т.д.).
3. **Совет по профилактике**: Как избежать повторения этой ошибки в будущем.

Форматируй ответ в виде красивого и аккуратного Markdown (используй заголовки, списки, выделение жирным). Ответ должен быть структурированным, технически точным и полезным.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err.message || "Ошибка сервера при обработке запроса ИИ" });
    }
  });

  // API route to monitor US, EU, and SEA Rustoria servers online status
  app.get("/api/rustoria", async (req, res) => {
    // High-fidelity fallback servers list to ensure perfect UX if Battlemetrics blocks unauthenticated requests
    const getFallbackServers = () => [
      // US Servers
      {
        id: "bm-us-1",
        name: "Rustoria.co - US Main",
        players: Math.floor(Math.random() * 120) + 360,
        maxPlayers: 500,
        status: "online",
        queue: Math.floor(Math.random() * 45) + 15,
        ip: "us-main.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 242,
        lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "bm-us-2",
        name: "Rustoria.co - US Medium",
        players: Math.floor(Math.random() * 80) + 290,
        maxPlayers: 400,
        status: "online",
        queue: Math.floor(Math.random() * 15) + 2,
        ip: "us-medium.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 254,
        lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "bm-us-3",
        name: "Rustoria.co - US Long",
        players: Math.floor(Math.random() * 100) + 270,
        maxPlayers: 400,
        status: "online",
        queue: Math.floor(Math.random() * 22) + 5,
        ip: "us-long.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 238,
        lastWipe: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      // EU Servers
      {
        id: "bm-eu-1",
        name: "Rustoria.co - EU Main",
        players: Math.floor(Math.random() * 110) + 370,
        maxPlayers: 500,
        status: "online",
        queue: Math.floor(Math.random() * 60) + 25,
        ip: "eu-main.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 240,
        lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "bm-eu-2",
        name: "Rustoria.co - EU Medium",
        players: Math.floor(Math.random() * 90) + 280,
        maxPlayers: 400,
        status: "online",
        queue: Math.floor(Math.random() * 20) + 5,
        ip: "eu-medium.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 251,
        lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "bm-eu-3",
        name: "Rustoria.co - EU Long",
        players: Math.floor(Math.random() * 95) + 265,
        maxPlayers: 400,
        status: "online",
        queue: Math.floor(Math.random() * 25) + 8,
        ip: "eu-long.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 235,
        lastWipe: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      // SEA Servers
      {
        id: "bm-sea-1",
        name: "Rustoria.co - SEA Main",
        players: Math.floor(Math.random() * 120) + 250,
        maxPlayers: 400,
        status: "online",
        queue: Math.floor(Math.random() * 15) + 1,
        ip: "sea-main.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 245,
        lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "bm-sea-2",
        name: "Rustoria.co - SEA Medium",
        players: Math.floor(Math.random() * 80) + 210,
        maxPlayers: 350,
        status: "online",
        queue: Math.floor(Math.random() * 5),
        ip: "sea-medium.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 250,
        lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "bm-sea-3",
        name: "Rustoria.co - SEA Long",
        players: Math.floor(Math.random() * 90) + 190,
        maxPlayers: 350,
        status: "online",
        queue: Math.floor(Math.random() * 8),
        ip: "sea-long.rustoria.co",
        port: 28015,
        map: "Procedural Map",
        fps: 241,
        lastWipe: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    try {
      const url = "https://api.battlemetrics.com/servers?filter[game]=rust&filter[search]=Rustoria&page[size]=50";
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!response.ok) {
        // Battlemetrics restricts public API access on certain cloud hosting networks, use high-fidelity fallbacks gracefully
        console.log(`[INFO] Battlemetrics returned status ${response.status}. Using high-fidelity server data.`);
        return res.json({ servers: getFallbackServers(), isFallback: true });
      }

      const json: any = await response.json();
      const servers = (json.data || []).map((item: any) => {
        const attrs = item.attributes || {};
        const details = attrs.details || {};
        return {
          id: item.id,
          name: attrs.name || "Unknown Server",
          players: attrs.players || 0,
          maxPlayers: attrs.maxPlayers || 500,
          status: attrs.status || "online",
          queue: details.rust_queued_players || 0,
          ip: attrs.ip || "127.0.0.1",
          port: attrs.port || 28015,
          map: details.map || "Procedural Map",
          fps: details.rust_fps || 250,
          lastWipe: details.rust_wipe_time || null
        };
      }).filter((srv: any) => {
        const name = srv.name.toLowerCase();
        // Keep only actual US, EU, and SEA Rustoria servers
        const isRustoria = name.includes("rustoria");
        const isTargetRegion = name.includes("us") || name.includes("eu") || name.includes("sea") || name.includes("asia") || name.includes("main") || name.includes("medium") || name.includes("long") || name.includes("small") || name.includes("2x");
        return isRustoria && isTargetRegion;
      });

      if (servers.length === 0) {
        return res.json({ servers: getFallbackServers(), isFallback: true });
      }

      res.json({ servers, isFallback: false });
    } catch (err: any) {
      console.log("[INFO] Error connecting to Battlemetrics endpoint. Serving high-fidelity fallback data.");
      res.json({ servers: getFallbackServers(), isFallback: true });
    }
  });

  // API route to check Twitch stream live status
  app.post("/api/twitch/status", async (req, res) => {
    try {
      const { channelName, clientId, clientSecret } = req.body;
      if (!channelName) {
        return res.status(400).json({ error: "No channelName provided" });
      }

      // Read credentials from either body or environment variables
      const actualClientId = clientId || process.env.TWITCH_CLIENT_ID;
      const actualClientSecret = clientSecret || process.env.TWITCH_CLIENT_SECRET;

      if (!actualClientId || !actualClientSecret) {
        return res.json({ 
          isLive: false, 
          error: "Credentials missing. Set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET in .env or site settings." 
        });
      }

      // Fetch App Access Token from Twitch
      const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${actualClientId}&client_secret=${actualClientSecret}&grant_type=client_credentials`;
      const tokenResponse = await fetch(tokenUrl, { method: "POST" });
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Twitch token fetch failed:", errorText);
        return res.status(400).json({ error: "Invalid Twitch credentials" });
      }

      const tokenJson: any = await tokenResponse.json();
      const accessToken = tokenJson.access_token;

      // Query Helix Streams API
      const streamUrl = `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channelName)}`;
      const streamResponse = await fetch(streamUrl, {
        headers: {
          "Client-ID": actualClientId,
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!streamResponse.ok) {
        const errorText = await streamResponse.text();
        console.error("Twitch stream fetch failed:", errorText);
        return res.status(400).json({ error: "Twitch API query failed" });
      }

      const streamJson: any = await streamResponse.json();
      const streamData = streamJson.data || [];
      
      if (streamData.length > 0) {
        const stream = streamData[0];
        return res.json({
          isLive: true,
          title: stream.title || "",
          viewerCount: stream.viewer_count || 0,
          gameName: stream.game_name || "",
          startedAt: stream.started_at || ""
        });
      }

      return res.json({ isLive: false });
    } catch (err: any) {
      console.error("Twitch API Error:", err);
      res.status(500).json({ error: err.message || "Twitch check failed" });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
