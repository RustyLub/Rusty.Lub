import fs from 'fs';
let data = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));

// Delete all existing firestore rules to avoid duplicates
const newFirestore = {};
for (const key in data.firestore) {
  newFirestore[key] = data.firestore[key];
  newFirestore[key].security = { "read": "true", "write": "true" };
}
data.firestore = newFirestore;

fs.writeFileSync('firebase-blueprint.json', JSON.stringify(data, null, 2));
