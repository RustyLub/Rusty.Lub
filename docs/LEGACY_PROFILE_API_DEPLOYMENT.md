# Rusty.Lub auth API deployment

The website may be hosted as static files on REG.RU. In that setup, REG.RU does not execute Express routes and Firebase Hosting rewrites do not apply to requests served by REG.RU. The legacy-profile migration therefore calls the HTTPS Firebase Function directly.

## Function

- Export: `apiServer`
- Region: `us-central1`
- Health check: `https://us-central1-rustylub.cloudfunctions.net/apiServer/api/health`
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

The repository's CI builds and checks the function bundle. It does not deploy production automatically.

## Required cross-project access

The migration reads the old `chat_users/serustqs` record from the legacy Firebase project `psychic-origin-5kpr3` and writes the destination profile to project `rustylub`.

Find the runtime service account configured for the deployed Cloud Function and grant that service account the **Cloud Datastore User** role (`roles/datastore.user`) in the legacy project. Do not grant public access and do not put service-account JSON in the frontend or repository. The new project uses the function's Application Default Credentials.

## Validation after deployment

1. Open the health-check URL; expect HTTP 200 and JSON with `status: "ok"`.
2. In the site, sign in to the verified destination account.
3. Enter the old account password and submit once.
4. Confirm the POST returns HTTP 200 for a valid password or HTTP 401 for an invalid password. HTTP 404/405 indicates the function URL/deployment is not correctly configured.
5. Verify the destination `auth_users/{uid}` document contains only the allowed profile fields and migration marker. The legacy record and its password/hash must remain unchanged.

The endpoint verifies the new Firebase ID token, verified destination email, legacy password, and destination profile before writing. It does not migrate role, VIP, block/scam flags, or credentials.
