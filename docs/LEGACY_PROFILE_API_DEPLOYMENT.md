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
