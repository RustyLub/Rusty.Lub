# Rusty.Lub Discord ↔ Rust WebRCON (Vanilla)

Standalone Node.js 22 Discord bot for the Rusty.Lub Vanilla server. It uses Rust's native WebRCON over WebSockets. No Carbon, Oxide/uMod, or gameplay plugins are installed on the game server.

## Features

- Persistent WebRCON connection with automatic reconnect.
- Relays unsolicited Rust console output to a private Discord log channel.
- Slash commands: /status, /players, /say, /kick, /rcon, /restart.
- All server-control commands require an allowlisted Discord user ID or configured administrator role.
- Admin actions are written to a private audit channel.
- Status changes and connection loss are sent to the alert channel.

The exact events available depend on what the Vanilla server emits through WebRCON. This is not a plugin-based kill-feed: detailed plugin-only raid/entity attribution is not promised.

## Shockbyte setup

1. In the Shockbyte panel, open Rust server settings and copy the RCON password.
2. Open the Ports tab and copy the RCON port assigned to this server. Shockbyte's current guide says Rust RCON does not use the generic default port and may use the server port. Use the value shown in your panel, not a guessed port.
3. Confirm WebRCON is enabled (Rust setting +rcon.web 1). If the panel does not expose it, ask Shockbyte support to confirm WebRCON and the reachable TCP port.
4. If available, restrict the RCON TCP port to the bot host's IP.
5. Do not change game/query ports to make RCON work.

## Discord setup

1. Create an application and Bot in the Discord Developer Portal.
2. Invite it using bot and applications.commands scopes. Give only View Channels, Send Messages, and Embed Links in the log, alert, and audit channels.
3. Copy the application ID, guild ID, your Discord user ID, and channel IDs into environment variables.
4. Store the bot token and RCON password as encrypted secrets at the bot host. Never commit a real .env file or paste secrets into GitHub/chat.

## Required environment

See .env.example. At minimum set DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, ADMIN_USER_IDS, RUST_RCON_HOST, RUST_RCON_PORT, RUST_RCON_PASSWORD, and DISCORD_LOG_CHANNEL_ID.

If both ADMIN_USER_IDS and ADMIN_ROLE_ID are empty, no Discord member can execute control commands.

## Run locally

    cd discord-bot
    cp .env.example .env
    npm install
    npm start

Fill .env locally and never commit it.

## Deployment

This must run as a persistent Node.js process/container because it maintains WebSocket connections to Rust and Discord. It is not deployed as static website files to REG.RU and should not be placed in a request-only Firebase HTTPS function.

Deploy the discord-bot directory as a Docker service or always-on Node.js worker. Configure environment variables as host secrets and keep one replica to avoid duplicate log relays and command registration races.

## Commands

- /status — query server status through RCON.
- /players — list connected players.
- /say message — broadcast a message to players.
- /kick player reason — kick a player by SteamID/name accepted by Rust.
- /rcon command — run an arbitrary Rust console command (administrator only).
- /restart confirmation:RESTART — request a restart after exact confirmation.

Raw /rcon is powerful. Only allow trusted Discord IDs, and keep the audit channel private.

## Vanilla limitations

Native WebRCON provides console output, command responses, status, and player information without server mods. It cannot create plugin-only events or a plugin-powered live map. If Shockbyte does not expose the WebRCON TCP port or the server does not emit a particular event, the bot cannot recover that event by itself.
