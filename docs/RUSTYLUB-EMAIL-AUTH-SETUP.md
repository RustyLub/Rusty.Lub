# Rusty.Lub email authentication (isolated rollout)

This implementation targets the separate Firebase project `rustylub` and does not change the legacy Firebase client, legacy auth routes, `.firebaserc`, or the old project's Firestore rules.

## Current hosting architecture

The production website is built as a static Vite site and published through GitHub Pages. GitHub Pages can serve frontend files, but it cannot execute `server.ts` or provide the `/api/rustylub-auth/*` Express endpoints.

REG.RU is used for domains/DNS only in the current setup. **Do not configure a service account on REG.RU and do not deploy a Node.js server there.**

The repository's `firebase.json` contains a Hosting rewrite for `/api/**` to a Firebase Function named `apiServer`, but the current GitHub Actions website workflow only builds and uploads a static-site artifact. It does not deploy Firebase Hosting or Functions. The new Express routes are therefore not live.

## Required backend decision

To use the current Express/Admin SDK profile API without introducing another hosting provider, the intended route is to deploy it as a Firebase HTTPS/Hosting function named `apiServer`. Firebase Cloud Functions deployment requires the Firebase project to be on the Blaze (pay-as-you-go) plan. Review expected costs and configure budget alerts before enabling billing.

An alternative is a separately hosted Node.js service. That is not currently part of the Rusty.Lub deployment and must not be assumed to exist.

Until a backend is deliberately selected and deployed, the new email registration UI must remain test-only and must not be presented as production-ready.

## Firebase Console

1. In project `rustylub`, keep Email/Password enabled in Authentication.
2. Configure authorized domains for production and local development in Authentication settings.
3. Configure email verification and password reset templates, sender name, and action URLs.
4. Keep new Firestore rules deny-all until the server-side role/profile model is reviewed. The API uses Firebase Admin and does not rely on client Firestore writes.

## Server credentials

The deployed backend needs a service account belonging to project `rustylub`, with access to the specified Firestore database and Firebase Authentication. Store credentials only in the hosting platform's protected secret/environment-variable facility. Never commit the JSON key, put it in Vite variables, or send it in chat. Do not use the old project's service account.

## Behavior

- New registrations use Firebase Authentication email/password.
- A verification email is sent immediately.
- Profile creation is allowed only after Firebase reports `email_verified=true`.
- Usernames are reserved transactionally in `auth_usernames`; profiles live in `auth_users`.
- Public registration cannot claim `serustqs`.
- Public profile data never accepts a role, VIP status, or owner flag from the browser.
- Password reset uses Firebase's built-in email action.
- The existing legacy login remains available until the new owner profile is provisioned, tested, and explicitly switched over.

## Important rollout boundary

Do not merge this implementation into production or switch authentication until:
1. The backend deployment target is selected and actually deployed.
2. The health endpoint verifies real Admin SDK connectivity, not merely the presence of an environment variable.
3. Email verification, profile creation, login, and password reset are tested end to end.
4. A one-time, server-only owner bootstrap is implemented and reviewed.
5. Website build and deployment workflows pass.

The current implementation is an isolated draft, not a production-ready authentication migration.
