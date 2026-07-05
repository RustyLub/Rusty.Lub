import fs from 'fs';
let data = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));
data.firestore["/presence/{userId}"].security = { "read": "true", "write": "true" };
fs.writeFileSync('firebase-blueprint.json', JSON.stringify(data, null, 2));
