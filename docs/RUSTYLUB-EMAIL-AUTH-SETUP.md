# Rusty.Lub email authentication (isolated rollout)

This implementation targets the separate Firebase project `rustylub` and does not change the legacy Firebase client, legacy auth routes, `.firebaserc`, or the old project's Firestore rules.

## Firebase Console

1. In project `rustylub`, keep Email/Password enabled in Authentication.
2. Configure the authorized domains for the production site and local development in Authentication settings.
3. Configure the email verification and password reset templates, sender name, and action URLs.
4. Keep the new Firestore rules deny-all until the server-side role/profile model is reviewed. The API uses Firebase Admin and does not rely on client Firestore writes.

## REG.RU Node.js environment

Set `RUSTYLUB_FIREBASE_SERVICE_ACCOUNT` to the full service-account JSON as a protected environment variable on the server. Do not commit it, put it in Vite variables, or send it in chat. The service account must belong to project `rustylub` and have access to the specified Firestore database and Firebase Authentication.

The server also accepts Application Default Credentials through `GOOGLE_APPLICATION_CREDENTIALS` where supported. Do not use the old project's service account.

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

Do not deploy or switch production traffic until the service-account environment variable is configured on REG.RU, the new API health check reports configured=true, email verification and password reset have been tested, and the owner bootstrap has been implemented and reviewed separately.
