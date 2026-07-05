import fs from 'fs';
let data = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));

const allowAll = { "read": "true", "write": "true" };

data.firestore["/tracked_players/{playerId}"].security = allowAll;
data.firestore["/name_history/{historyId}"].security = allowAll;
data.firestore["/sessions/{sessionId}"].security = allowAll;
data.firestore["/chat_users/{userId}"].security = allowAll;
data.firestore["/users/{userId}"].security = allowAll;

fs.writeFileSync('firebase-blueprint.json', JSON.stringify(data, null, 2));
