import { adminDb } from './src/lib/firebase-admin';
import fs from 'fs';

async function restore() {
  const users = [
    { displayName: 'RH WP', id: 'de07', role: 'user', isChatVip: true },
    { displayName: 'SiskiPiski', id: 'denchick228', role: 'user' },
    { displayName: 'albedo', id: 'devyd', role: 'user', isChatVip: true },
    { displayName: 'クリスティー', id: 'gvg', role: 'user', isChatVip: true },
    { displayName: 'Gvozdoder', id: 'gvozdoder', role: 'user', isChatVip: true },
    { displayName: 'HelicopterTime', id: 'helicoptertime', role: 'admin', isChatVip: true, isVip: true, vipUntil: '2053-11-18' },
    { displayName: 'Seokhn755', id: 'puthj', role: 'user', isChatVip: true, isVip: true, vipUntil: '2053-11-18' },
    { displayName: 'sssa', id: 'rewr', role: 'admin' },
    { displayName: 'SEO-RustyLub', id: 'serustqs', role: 'admin', isChatVip: true, isVip: true, vipUntil: '2053-11-19' },
    { displayName: 'w1nter', id: 'w1nter', role: 'user', isChatVip: true, isVip: true, vipUntil: '2053-11-18' }
  ];

  for (const user of users) {
    await adminDb.collection('chat_users').doc(user.id).set({
      displayName: user.displayName,
      email: `${user.id}@${user.id}`,
      role: user.role,
      isVip: user.isVip || false,
      isChatVip: user.isChatVip || false,
      vipUntil: user.vipUntil || ''
    }, { merge: true });
    console.log('Restored user:', user.displayName);
  }

  const newsList = JSON.parse(fs.readFileSync('./news_list.json', 'utf8'));
  for (const item of newsList) {
    await adminDb.collection('news').doc(item.id).set({
      title: item.title,
      date: new Date().toISOString()
    }, { merge: true });
    console.log('Restored news:', item.title.en);
  }

  process.exit(0);
}
restore();
