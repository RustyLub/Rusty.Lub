import { db, collection, doc, setDoc } from './src/lib/firebase-client-on-server';
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
    await setDoc(doc(db, 'chat_users', user.id), {
      displayName: user.displayName,
      email: `${user.id}@${user.id}`,
      role: user.role,
      isVip: user.isVip || false,
      isChatVip: user.isChatVip || false,
      vipUntil: user.vipUntil || ''
    }, { merge: true });
    console.log('Restored user:', user.displayName);
  }

  const newsItems = [
    {
      id: "ZdC5aha1ZEvGgpTWNELQ",
      title: { en: "Earn VacCoins by watching streams!", ru: "Получай VacCoins за просмотр стримов!" },
      badge: { en: "EVENT", ru: "СОБЫТИЕ" },
      category: "events",
      author: "ADMIN",
      date: "2026-07-04T12:00:00Z",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      summary: { en: "Now you can get channel points (VacCoins) for watching streams.", ru: "Теперь вы можете получать очки канала (VacCoins) за просмотр стримов." },
      content: {
        ru: [{ sectionTitle: "КАК ПОЛУЧИТЬ VACCOINS?", text: "Смотрите стримы и зарабатывайте VacCoins для обмена на скины.", highlights: ["https://www.twitch.tv/"] }],
        en: [{ sectionTitle: "HOW TO GET VACCOINS?", text: "Watch streams and earn VacCoins to exchange for skins.", highlights: ["https://www.twitch.tv/"] }]
      }
    },
    {
      id: "wYCzM84rt9b5Btff9KPS",
      title: { en: "New Jungle Fever videos!", ru: "Новые видео Jungle Fever!" },
      badge: { en: "VIDEO", ru: "ВИДЕО" },
      category: "blogs",
      author: "ADMIN",
      date: "2026-07-04T12:00:00Z",
      coverImage: "https://i.ytimg.com/vi/RxS0ISoktOY/maxresdefault.jpg",
      summary: { en: "My friend Helicopter Time released new Rust videos!", ru: "Мой друг Helicopter Time выпустил новые видео по Rust!" },
      content: {
        ru: [{ sectionTitle: "JUNGLE FEVER", text: "Смотрите часть 1 и часть 2!", highlights: ["BUTTON:Смотреть часть 1:ZdC5aha1ZEvGgpTWNELQ", "https://youtu.be/RxS0ISoktOY"] }],
        en: [{ sectionTitle: "JUNGLE FEVER", text: "Watch part 1 and part 2!", highlights: ["BUTTON:Watch part 1:ZdC5aha1ZEvGgpTWNELQ", "https://youtu.be/RxS0ISoktOY"] }]
      }
    },
    {
      id: "vip_update_1",
      title: { en: "NEW VIP UPDATE: PRIVATE CHANNEL, MESSAGE HIGHLIGHTING & GRADIENTS!", ru: "НОВОЕ VIP ОБНОВЛЕНИЕ: ПРИВАТНЫЙ КАНАЛ, ПОДСВЕТКА СООБЩЕНИЙ И ГРАДИЕНТЫ!" },
      badge: { en: "UPDATE", ru: "ОБНОВЛЕНИЕ" },
      category: "updates",
      author: "ADMIN",
      date: "2026-07-04T12:00:00Z",
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      summary: { en: "We are thrilled to launch a massive upgrade to our VIP system.", ru: "Мы рады представить масштабное обновление нашей VIP-системы." },
      content: {
        ru: [{ sectionTitle: "ЭКСКЛЮЗИВНЫЙ VIP КАНАЛ", text: "Обсуждайте стратегию и планируйте в абсолютном комфорте!", highlights: ["Изолированный безопасный доступ", "Эксклюзивно для активных VIP-подписчиков и админов"]}],
        en: [{ sectionTitle: "EXCLUSIVE VIP CHANNEL", text: "Talk strategy and plan in absolute comfort!", highlights: ["Isolated secure access", "Exclusively for active VIP Subscribers and admins"] }]
      }
    }
  ];
  
  for (const item of newsItems) {
    await setDoc(doc(db, 'news', item.id), item, { merge: true });
    console.log('Restored news:', item.title.en);
  }

  process.exit(0);
}
restore();
