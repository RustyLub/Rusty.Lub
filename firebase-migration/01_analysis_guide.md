# Руководство по анализу структуры данных Firestore

Данный документ описывает структуру коллекций, подколлекций и полей в исходном Firebase-проекте `psychic-origin-5kpr3` (база данных `ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59`), составленную на основе конфигурации проекта и схемы `firebase-blueprint.json`.

## 1. Перечень основных коллекций

1. **`chat_users`**
   - **Описание:** Профили пользователей, роли, VIP-статусы и учетные данные чата.
   - **ID документа:** Имя пользователя (`username`).
   - **Поля:** `username`, `password` (в старой системе), `displayName`, `photoURL`, `avatarClass`, `role`, `isBlocked`, `isVip`, `isChatVip`, `vipUntil`, `createdAt`.

2. **`messages`**
   - **Описание:** Сообщения глобального чата.
   - **ID документа:** Автоматический ID Firestore.
   - **Поля:** `text`, `uid`, `displayName`, `photoURL`, `createdAt`.

3. **`presence`**
   - **Описание:** Статусы активности пользователей в реальном времени.
   - **ID документа:** ID пользователя / позывной.
   - **Поля:** `lastActive`, `displayName`.

4. **`site_settings`**
   - **Описание:** Глобальные настройки портала (анонсы, спойлеры, твич-стрим).
   - **Документы:** `announcement`, `jungle_fever_spoiler`, `twitch`.

5. **`news`**
   - **Описание:** Новости и девблоги Facepunch.
   - **ID документа:** ID новости.
   - **Поля:** `category`, `title`, `date`, `author`, `badge`, `isFeatured`, `coverImage`, `summary`, `content`.

6. **`payments`**
   - **Описание:** Информация о платежах и донатах (USDT TRC20).
   - **Поля:** `txId`, `userId`, `amount`, `plan`, `status`, `createdAt`.

7. **`clan_applications` / `clan_posts`**
   - **Описание:** Заявки в кланы и форумные посты поиска тиммейтов.

## 2. Безопасный анализ без массового чтения
Перед запуском экспорта рекомендуется использовать встроенный инструмент Firebase CLI для оценки количества документов:
```bash
firebase firestore:indexes --project psychic-origin-5kpr3
```
Это позволит увидеть структуру без выкачивания содержимого документов в память.
