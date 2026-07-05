import fs from 'fs';
let data = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));
for (const key in data.firestore) {
  if (data.firestore[key] && typeof data.firestore[key] === 'object') {
    data.firestore[key].security = { "read": "true", "write": "true" };
  }
}
fs.writeFileSync('firebase-blueprint.json', JSON.stringify(data, null, 2));
