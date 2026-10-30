/**
 * Шаблон безопасного скрипта экспорта Firestore в JSON (Node.js + Firebase Admin SDK)
 * 
 * ВНИМАНИЕ: Скрипт требует сервисного аккаунта (serviceAccountKey.json), который НЕ должен
 * помещаться в репозиторий Git и выгружаться в публичный доступ.
 * 
 * Использование (после получения разрешения и настройки ключей):
 * node 02_export_script_template.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Укажите путь к скачанному файлу ключа старого проекта (НЕ добавлять в git!)
const serviceAccount = require('./serviceAccountKey-old.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Указываем исходный databaseId
  databaseId: 'ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59'
});

const db = admin.firestore();

const COLLECTIONS_TO_EXPORT = [
  'chat_users',
  'messages',
  'presence',
  'site_settings',
  'news',
  'payments',
  'clan_applications',
  'clan_posts'
];

async function exportAllCollections() {
  const exportDir = path.join(__dirname, 'exported_data');
  if (!fs.existsSync(exportDir)) {
    fs.existsSync(exportDir) || fs.mkdirSync(exportDir, { recursive: true });
  }

  for (const colName of COLLECTIONS_TO_EXPORT) {
    console.log(`[Export] Reading collection: ${colName}...`);
    const snapshot = await db.collection(colName).get();
    const data = {};

    snapshot.forEach(doc => {
      data[doc.id] = doc.data();
    });

    const filePath = path.join(exportDir, `${colName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[Export] Saved ${snapshot.size} documents to ${filePath}`);
  }

  console.log('[Export] Complete successfully!');
}

// Запуск только по явному разрешению пользователя
// exportAllCollections().catch(console.error);
console.log('Template loaded. Uncomment exportAllCollections() to run.');
