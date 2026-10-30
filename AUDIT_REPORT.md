# Rusty.Lub — System Audit Report

**Date:** 2026-10-30  
**Repository:** RustyLub/Rusty.Lub  
**Audited ref:** main @ 38b103fd1e639b73739462d6bec1819894dc6db5  
**Audit branch:** audit/full-system-audit-2026-10-30  
**Mode:** Read-only static review. No application code, dependencies, production settings, or deployment workflows were changed.

## Executive summary

The source review has identified **two CRITICAL security findings** that should block a Production Ready declaration:

1. Firestore rules grant broad read/write access to almost all document paths.
2. Legacy API authentication trusts caller-controlled UID headers and can construct an authenticated/admin identity without a valid Firebase ID token. The affected middleware protects administrative, VIP, payment, and AI routes.

Additional HIGH/MEDIUM findings affect payment verification, password migration, API abuse controls, realtime access policy, and data integrity of some displayed statistics.

This is a **static source audit, not a completed penetration test or end-to-end production audit**. No authenticated Firebase/REG.RU/TronScan/Discord/BattleMetrics environment or secret values were available. Findings below are source-confirmed; runtime exploitability and deployed configuration still require controlled verification.

## Findings

### AUD-001 — Broad Firestore read/write access
- **Category:** Firebase / Broken Access Control (OWASP A01)
- **Severity:** CRITICAL
- **Location:** `firestore.rules:13-17`
- **Status:** Confirmed in source; not remediated.
- **Cause:** Recursive catch-all rule grants `read, write` to every document except two path patterns. This exposes application collections to direct client SDK operations, independently of UI restrictions.
- **Impact:** Unauthorized reads, writes, deletion, tampering with user/profile/activity/chat/admin-related documents, depending on collection contents and client SDK access.
- **Reproduction:** From an unauthorised Firebase client, attempt direct Firestore reads and writes against representative application collections (do not run against production without approval).
- **Recommendation:** Replace catch-all with explicit collection-level rules. Require `request.auth != null`; enforce UID ownership for user-owned records; restrict privileged collections to server/Admin SDK or verified custom claims/role records; validate fields and immutable fields. Add Emulator Suite rules tests for anonymous, ordinary user, owner and admin.
- **Evidence:** Lines 13-17.

### AUD-002 — Caller-supplied UID can bypass API authentication
- **Category:** Authentication / Broken Access Control / Privilege Escalation (OWASP A01, A07)
- **Severity:** CRITICAL
- **Location:** `server.ts:51-103`; consumers at `server.ts:415, 874, 899, 923, 938, 948, 963, 978, 993, 1014, 1024, 1051, 1193, 1360, 1403, 1441, 1462, 1485, 1509`
- **Status:** Confirmed in source; not remediated.
- **Cause:** `verifyToken` reads `x-user-uid` / `x-user-id`. It can populate `req.user` from the supplied value, including hard-coded admin identifiers, and falls back to the supplied UID when the bearer token is missing, invalid, or rejected. `verifyAdmin` trusts the resulting role/admin identity; `verifyVIP` also uses this middleware.
- **Impact:** An attacker may impersonate another UID and potentially access admin-only Discord/Rust+ actions, VIP endpoints, payment verification, and authenticated AI routes. Actual reachability depends on deployed route configuration and downstream behavior; the source-level authentication bypass is confirmed.
- **Reproduction:** In an isolated test environment, call a protected route with a forged UID header and no valid Firebase token; verify that the request is rejected. Never test by invoking state-changing production endpoints.
- **Recommendation:** Remove caller UID headers as an authentication source. Require a valid Firebase ID token for every protected route; verify revocation where appropriate; derive UID/email only from decoded token; load roles from trusted server-side records/custom claims. Split authentication and authorization middleware and test every route.
- **Evidence:** `server.ts:51-103`, `106-135`, `137-185`.

### AUD-003 — Payment verification has no replay/idempotency protection
- **Category:** Payments / Business Logic / API Security
- **Severity:** HIGH
- **Location:** `server.ts:1051-1188`
- **Status:** Confirmed in source; not remediated.
- **Cause:** Transaction hash is checked for format and transfer details, but the shown handler does not persist/lock a successfully consumed transaction hash or bind it to a single account/plan. The handler also accepts caller-provided `amount`, `plan`, and `userId`; amount validation is based on caller input rather than a server-side price catalogue. The sandbox branch accepts a `demo_` hash without a separate admin authorization check.
- **Impact:** Potential transaction replay, plan/amount manipulation, and abuse of demo-mode success responses if the caller's identity is accepted by the legacy middleware.
- **Reproduction:** In staging, submit the same confirmed transaction twice and vary the requested amount/plan; verify that only one server-priced entitlement can be granted.
- **Recommendation:** Define plans and prices server-side; bind a transaction to exact recipient, token contract, amount and account; require confirmation/finality; atomically record tx hash with a unique constraint/transaction before granting entitlement; restrict sandbox mode to an isolated environment and explicit staff claim.
- **Evidence:** `server.ts:1051-1120`.

### AUD-004 — Legacy plaintext password fallback
- **Category:** Authentication / Credential Storage
- **Severity:** HIGH
- **Location:** `src/server/emailAuth.ts:111-125`
- **Status:** Confirmed in source; not remediated.
- **Cause:** Login accepts `data.password === password` if `passwordHash` is absent. It migrates that account to scrypt only after a successful login.
- **Impact:** Any legacy plaintext password remaining in Firestore is exposed in readable form to anyone who can read that collection (AUD-001), and remains stored until the account logs in.
- **Reproduction:** Inspect test fixtures/legacy account records for a `password` field; confirm the login fallback.
- **Recommendation:** Remove plaintext password support after a controlled migration. Force password reset for legacy accounts; never store plaintext passwords. Use a vetted password hashing configuration and add login throttling.
- **Evidence:** `src/server/emailAuth.ts:120-125`.

### AUD-005 — Missing global API rate limiting and abuse controls
- **Category:** API Security / Availability
- **Severity:** MEDIUM
- **Location:** `server.ts:193`; public routes include `server.ts:450, 756, 827`; email routes `src/server/emailAuth.ts:20, 48, 73, 111`
- **Status:** No global limiter found in reviewed server entry point; not runtime-tested.
- **Cause:** Express JSON middleware and routes are registered without a visible shared IP/user rate limiter. Email code routes have per-email counters, but no IP/device/global protection.
- **Impact:** Brute-force attempts, email bombing across many addresses, resource exhaustion, API quota abuse and elevated third-party API costs.
- **Recommendation:** Add layered rate limits by IP, account, email and endpoint; add CAPTCHA/abuse detection to email-code issuance; enforce provider quotas and request timeouts; return 429 consistently. Configure trusted proxy handling only for the known hosting proxy.
- **Evidence:** `server.ts:193`; `src/server/emailAuth.ts:20-40`.

### AUD-006 — Socket.IO CORS allows every origin
- **Category:** Realtime API / Security Configuration
- **Severity:** MEDIUM
- **Location:** `server.ts:38-43`
- **Status:** Confirmed in source; connection authorization not fully assessed.
- **Cause:** Socket.IO is configured with `origin: "*"` and GET/POST methods. The connection/authentication and event-level authorization model needs separate review.
- **Impact:** Any website can attempt cross-origin socket connections. If sensitive events are not independently authenticated/authorized, data exposure or unauthorized actions may result.
- **Recommendation:** Restrict allowed origins to the actual production domains and development origins; authenticate socket handshakes with verified tokens; authorize every event and room subscription; add payload validation and connection limits.
- **Evidence:** `server.ts:38-43`.

### AUD-007 — BattleMetrics fallback returns fabricated player statistics
- **Category:** Data Integrity / Functional Correctness
- **Severity:** MEDIUM
- **Location:** `server.ts:1193-1340` (fallback logic begins after upstream lookup)
- **Status:** Confirmed in source.
- **Cause:** When BattleMetrics lookup fails or returns no result, the API fabricates names, servers, playtime and session history from the SteamID. Even a successful lookup supplements missing history with synthetic records.
- **Impact:** Users can mistake generated values for real BattleMetrics records; decisions based on player history become unreliable.
- **Recommendation:** Return an explicit unavailable/not-found state. If demo data is needed, label it as synthetic in the API schema and UI; never present it as a real player profile.
- **Evidence:** Fallback code in `server.ts` around lines 1250-1340.

### AUD-008 — CI production build does not enforce the TypeScript lint script
- **Category:** CI / Quality Gates
- **Severity:** MEDIUM
- **Location:** `package.json:6-15`; `.github/workflows/deploy-pages.yml`; `.github/workflows/deploy-reg-ru.yml`
- **Status:** Confirmed in workflow definitions.
- **Cause:** `lint` is defined as `tsc --noEmit`, but the reviewed deployment workflows install dependencies and run `bun run build`; they do not run `bun run lint` or a test suite.
- **Impact:** Type errors and some source-level defects may reach deployment because Vite transpilation is not a substitute for a full TypeScript type-check.
- **Recommendation:** Add separate CI gates for typecheck, unit/integration tests, dependency audit and build. Make deploy jobs depend on all required checks.
- **Evidence:** package scripts and workflow files.

### AUD-009 — TypeScript strictness is not enabled
- **Category:** Code Quality / Reliability
- **Severity:** LOW to MEDIUM
- **Location:** `tsconfig.json:1-28`
- **Status:** Confirmed in configuration.
- **Cause:** No `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`, or `noFallthroughCasesInSwitch` settings are present.
- **Impact:** Potential null/undefined and type-safety defects can pass type checking.
- **Recommendation:** Enable strictness incrementally, resolve reported issues module by module, and enforce typecheck in CI.
- **Evidence:** `tsconfig.json`.

### AUD-010 — Production player-count endpoints return randomized data
- **Category:** Data Integrity / Functional Correctness
- **Severity:** MEDIUM
- **Location:** `server.ts:450-695`
- **Status:** Confirmed in source.
- **Cause:** The Rustoria endpoint response contains many `Math.random()`-based player and queue counts.
- **Impact:** The UI can display invented server population and queue data as if it were live.
- **Recommendation:** Use the upstream server API and show a timestamped unavailable state when the upstream source fails; label any demo fixtures clearly.
- **Evidence:** `server.ts:462-695`.

## Configuration and architecture observations

- `firebase.json` routes `/api/**` to the `apiServer` function and all other paths to `index.html`. The Functions source is the repository root.
- `functions/index.js` wraps `./index.cjs` in a Firebase Functions v2 HTTPS handler in `europe-west2`.
- `server.ts` starts a standalone HTTP server and also exports the Express app. This dual development/Functions lifecycle needs a deployment integration test, especially for long-running Radar/Socket.IO initialization inside a serverless runtime.
- `express.json()` is configured without explicit project-level size/strict settings; Express has a default body-size limit, but explicit limits and content-type validation are recommended.
- `vite.config.ts` uses aggressive Terser unsafe optimizations (`unsafe_methods`, `unsafe_math`, `unsafe_proto`, etc.). These should be justified with regression tests; do not assume they are harmless.
- `package.json` contains a large combined web/server/Capacitor/Tauri dependency surface. Dependency compatibility and CVE status were not established by static manifest inspection.
- Both `package-lock.json` and `bun.lock` exist. CI uses Bun with `--frozen-lockfile`; lockfile consistency with npm is not verified.
- `firebase-applet-config.json` and `src/firebase.ts` contain Firebase web configuration. Firebase web API keys are identifiers, not server secrets, but access must be secured with Firebase Rules, App Check where suitable, and API restrictions. No private service-account key was found in the reviewed Admin SDK initialization source; it uses Application Default Credentials.
- The REG.RU workflow deploys `dist/` over FTPS when secrets are configured and does not use destructive clean-slate. A successful workflow run proves the workflow completed, not that both public domains, DNS, SSL and all routes were externally verified.
- The Pages and REG.RU workflows include static file existence checks for selected HTML/SEO assets; they do not cover all application interactions.

## CI status observed

For commit `38b103fd1e639b73739462d6bec1819894dc6db5` on 2026-10-30:
- GitHub Pages deployment: **success**
- Build and verify website: **success**
- REG.RU deployment workflow: **success**

These statuses confirm the configured workflows completed for that commit. They do **not** constitute a TypeScript strict check, security scan, full functional test, or external verification of both domains.

## Audit coverage and limitations

Repository tree contained 608 entries at the audited ref. The review inspected the root configuration, Firebase rules/configuration, server entry point, Functions wrapper, auth implementation, CMS API/client, activity logging, deployment workflows, SEO files and the repository tree.

The following have **not** been executed or independently verified in this environment:
- `npm audit` / OSV / Dependabot CVE comparison against the lockfile.
- Fresh dependency install and lockfile integrity test.
- `tsc --noEmit`, full production build from a clean checkout, unit/integration tests.
- Firestore Emulator Suite rule tests.
- Authenticated route-by-route API penetration tests.
- CMS persistence/role matrix against a live Firebase project.
- Browser automation for every page, form, modal, search and widget.
- Lighthouse / Core Web Vitals and real-device mobile tests.
- Live DNS, SSL certificate chain, headers, redirects and asset checks for both `rusty-lub.ru` and `rusty-lub.online`.
- Secrets scanning of repository history and GitHub Actions secrets.
- Serverless cold start, timeout, concurrency and Socket.IO behavior in deployed Cloud Functions.

## Production readiness

**Status: NOT PRODUCTION READY based on the source-confirmed CRITICAL findings.**

Recommended remediation order:
1. AUD-001 Firestore Rules.
2. AUD-002 API authentication/authorization.
3. AUD-003 Payment replay and server-side pricing.
4. AUD-004 legacy plaintext password removal.
5. AUD-005 rate limiting and abuse controls.
6. AUD-006 Socket.IO origin/auth/event controls.
7. AUD-007 remove misleading synthetic production data.
8. AUD-008/009 enforce typecheck and stronger CI quality gates.
9. Complete the unexecuted runtime, dependency, browser, hosting and domain tests.

**No remediation has been applied as part of this audit.**
