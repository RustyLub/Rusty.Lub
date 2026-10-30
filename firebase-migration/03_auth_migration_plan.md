# План переноса пользователей (Firebase Auth + Firestore)

## 1. Особенности переноса Firebase Authentication
Перенос пользователей из старого проекта (`psychic-origin-5kpr3`) в новый (`rustylub`) через Firebase Admin SDK позволяет сохранить хэши паролей без необходимости сброса паролей для пользователей.

### Шаги переноса Auth:
1. **Экспорт пользователей из старого проекта:**
   С помощью Firebase CLI или Admin SDK выполняется экспорт пользователей:
   ```bash
   firebase auth:export users.json --project psychic-origin-5kpr3
   ```
   *⚠️ Файл `users.json` содержит хэши паролей и является строго конфиденциальным. Его нельзя загружать в GitHub или передавать третьим лицам.*

2. **Импорт пользователей в новый проект:**
   ```bash
   firebase auth:import users.json --project rustylub
   ```

## 2. Перенос пользовательских профилей (Firestore `chat_users`)
1. Экспортируйте коллекцию `chat_users` с помощью скрипта экспорта.
2. Проверьте данные на отсутствие битых ссылок и некорректных полей.
3. Импортируйте коллекцию `chat_users` в новый проект `rustylub` с тем же Database ID (`ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59`).
