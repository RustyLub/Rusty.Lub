# Rusty.Lub auth API deployment

The website may be hosted as static files on REG.RU. In that setup, REG.RU does not execute Express routes and Firebase Hosting rewrites do not apply to requests served by REG.RU. The legacy-profile migration therefore calls the HTTPS Firebase Function directly.

## Function

- Export: `apiServer`
- Region: `us-central1`
- General health check: `https://us-central1-rustylub.cloudfunctions.net/apiServer/api/health`
- Auth backend readiness: `https://us-central1-rustylub.cloudfunctions.net/apiServer/api/rustylub-auth/health` (must return HTTP 200 and `configured: true`)
- Migration: `POST https://us-central1-rustylub.cloudfunctions.net/apiServer/api/rustylub-auth/migrate-legacy-profile`

The frontend uses this URL by default. To override it at build time, set `VITE_RUSTYLUB_AUTH_API_BASE` to the function base URL, without a trailing slash.

## Deploy

From the repository root, with Firebase CLI authenticated to the `rustylub` project:

```sh
bun install
bun run build:functions
firebase use rustylub
firebase deploy --only functions:apiServer
```

The repository's CI builds and checks the function bundle. It does not deploy production automatically. The secure email-registration flow checks the auth readiness endpoint before creating a Firebase account; do not bypass this check or manually create destination profiles if the endpoint is unavailable.

## Required cross-project access

The migration reads the old `chat_users/serustqs` record from the legacy Firebase project `psychic-origin-5kpr3` and writes the destination profile to project `rustylub`.

Find the runtime service account configured for the deployed Cloud Function and grant that service account the **Cloud Datastore User** role (`roles/datastore.user`) in the legacy project. Do not grant public access and do not put service-account JSON in the frontend or repository. Both Admin SDK app instances use the same runtime credential, but are pinned to different project IDs and database IDs.\n\nThe source connection is configured separately in `src/lib/firebase-admin.ts`:\n\n- `FIREBASE_LEGACY_PROJECT_ID` (default: `psychic-origin-5kpr3`)\n- `FIREBASE_LEGACY_DATABASE_ID` (default: `ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59`)\n- Destination project: `FIREBASE_PROJECT_ID` or `firebase-applet-config.json` (`rustylub`)\n- Destination database: `FIRESTORE_DATABASE_ID` or `firebase-applet-config.json`\n\nThe Cloud Function's deployment region is `us-central1`. This is **not** proof of the Firestore database's physical location. The database location must be checked in Firebase Console for each project; it cannot be reliably inferred from this repository. Record the database location and assess applicable data-localisation requirements before treating the hosting/localisation review as closed.

## Validation after deployment

1. Open the general health-check URL; expect HTTP 200 and JSON with `status: "ok"`.
2. Open the auth readiness URL; expect HTTP 200 and `configured: true`. HTTP 404 means the function is not deployed; HTTP 503 means the Admin SDK cannot reach/configure Firebase.
3. In the site, create/sign in to the verified destination owner account using the reserved username `serustqs` and the verified email `cheater.cooperation@inbox.ru`.
4. Enter the old `serustqs` password and submit once.
5. Confirm the POST returns HTTP 200 for a valid password or HTTP 401 for an invalid password.
6. Verify the destination `auth_users/{uid}` document contains the allowed profile fields, the migration marker and the server-assigned owner role. No password or password hash is copied to the destination project.

The endpoint verifies the new Firebase ID token, verified destination email, legacy password, and destination profile before writing. Only the fixed owner account regains the `admin` role after both identity checks succeed. VIP flags, block/scam state and credentials are not migrated. If the legacy source record still contains a plaintext password, the successful migration converts it to PBKDF2-SHA256 and deletes the plaintext field; an existing password hash is not copied to the destination.

## Server-side sign-in for remaining legacy accounts

The repository now contains `POST /api/rustylub-auth/login-legacy`. It reads the old `chat_users/{username}` record through the Admin SDK, verifies PBKDF2-SHA256, legacy scrypt, or (once) a plaintext legacy password, then removes a plaintext password after successful verification. It creates a deterministic, least-privilege account in the destination Firebase project and issues a Firebase custom token. Legacy role, admin, VIP, and block flags are not copied as privileges; blocked legacy accounts are rejected.

The old login form uses this route only when the build-time variable `VITE_LEGACY_AUTH_API_ENABLED=true` is set. It deliberately remains on the compatibility path while the endpoint and old-project permissions have not been deployed and verified. **Do not enable this variable yet.** Enabling it before deployment will make legacy sign-in fail.

Before enabling it in production:

1. Deploy the Firebase API to project `rustylub` and verify `/api/rustylub-auth/health`.
2. Confirm the deployed API includes `/api/rustylub-auth/login-legacy`.
3. Grant the Cloud Functions runtime service account read/update access to the legacy `chat_users` collection in project `psychic-origin-5kpr3`; grant only the required legacy-project access.
4. Review the currently deployed Firestore Rules in `psychic-origin-5kpr3`. Do not replace them with the destination project's rules: other legacy app features may depend on existing collections. After inventorying every client use, deny client access to `chat_users` while preserving only the rules needed by other features.
5. Test existing accounts in a staging copy, including PBKDF2, scrypt, plaintext migration, blocked users, duplicate usernames, and the reserved owner account.
6. Set `VITE_LEGACY_AUTH_API_ENABLED=true` in the production build and verify sign-in, sign-out, restored sessions, account data, and privilege checks.
7. Only after successful production verification, remove the temporary direct-client compatibility path and deploy the restrictive legacy Firestore Rules.

Additional audit finding: `chat_users` is not an authentication-only collection. The existing application still uses it for profile editing, chat membership, friend requests, moderation, VIP status, voice presence, and admin screens. Therefore, a blanket client deny on `chat_users` would break existing features. Those functions need to be moved to authenticated server endpoints or redesigned around a separate public profile collection before tightening the legacy project's Rules.

The chat module previously contained a hard-coded owner credential and could create/recreate the owner account from client code. That automatic account creation and the chat-local plaintext-password registration/login handler have now been removed; the chat opens the shared site authentication modal instead. The old owner credential must be treated as compromised because it existed in public source history and must be rotated. Admin/VIP controls in the chat and account/profile modals now receive privilege state from the App's Firebase-verified profile instead of trusting a UID/email string or local profile role.

Other legacy components still perform direct client reads/writes to `chat_users`, including profile and administration workflows. The old Firestore Rules for `psychic-origin-5kpr3` have not been retrieved or verified, and client-side admin writes have not yet all been converted to server-authorized operations. This is a separate remaining security task, not something the new login route alone resolves.

The route is code in the repository, not proof that the production Firebase Function or legacy Firestore Rules have been deployed. Until the steps above are complete, point 6 remains **partially implemented, not production-complete**.
