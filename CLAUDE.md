# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MythoPlay (branded "Natkhat Gannu", domain natkhatgannu.com) — a kid-safe platform where children aged 5–14 learn Indian mythology through interactive quizzes, leaderboards, weekly stories, and a members-only community. Monorepo with two independently-deployed apps: `frontend/` (Next.js) and `backend/` (Express + PostgreSQL).

## Commands

Run from the respective subdirectory (`backend/` or `frontend/`):

```bash
# Backend (port 4000)
cd backend && npm install && npm run dev   # nodemon hot-reload
npm start                                   # production (node src/index.js)
npm run db:init                             # apply schema.sql + seed.sql, create default admin

# Frontend (port 3000)
cd frontend && npm install && npm run dev
npm run build && npm start
npm run lint                                # next lint / eslint
```

Full stack with Docker (Postgres + backend + frontend, hot-reload):

```bash
docker compose -f docker-compose.dev.yml up   # or docker-compose.yml for prod-style build
```

There is **no test suite** in this repo.

## Architecture

### Backend (`backend/src/`)
Plain Express, CommonJS (`require`). Entry is `index.js`, which mounts route modules under `/api/*` and exports the `app`.

- **Dual deploy target.** The same `index.js` runs as a long-lived server (local/Railway/Docker — calls `app.listen`) OR as a Vercel serverless function (`api/index.js` re-exports the app; `index.js` skips `listen()` when `process.env.VERCEL` is set). When changing startup/listen logic, preserve both paths. `database.js` likewise shrinks the PG pool to 1 connection on serverless to avoid exhausting free-tier Postgres limits.
- **Routes** (`routes/`): `auth`, `quiz`, `leaderboard`, `user`, `admin`, `adminUsers`. Both `admin*` modules mount at `/api/admin`.
- **Auth** (`middleware/auth.js`): JWT bearer tokens. Two principal types distinguished by the `role` claim — `user` (Google OAuth, 7d expiry) and `admin` (email+password, 24h). Use the exported guards: `authenticateToken`, then `requireAdmin` / `requireUser`. Members-only content is gated by `requireNatkhatGannuMember` (checks the `isNatkhatGannuMember` JWT claim). Generate tokens only via `generateUserToken` / `generateAdminToken` so claims stay consistent.
- **DB access** (`config/database.js`): import `query(text, params)` and use parameterized queries — there is no ORM. SSL is off unless `DATABASE_SSL=true` (needed for Neon/Supabase/Railway managed Postgres).
- **CORS**: allow-list in `index.js`. New frontend origins (preview deploys, custom domains) must be added there.

### Frontend (`frontend/src/`)
Next.js 14 **Pages Router** (not App Router), TypeScript, Tailwind. Import alias `@/*` → `src/*`.

- **API layer** (`lib/api.ts`): a single axios instance with `baseURL = NEXT_PUBLIC_API_URL + '/api'`. A request interceptor attaches the JWT from `localStorage`; a response interceptor clears auth and redirects to `/login` on 401/403. Add new endpoints to the grouped exports (`authAPI`, `quizAPI`, `leaderboardAPI`, `userAPI`, `adminAPI`) rather than calling axios directly from pages.
- **State** (`lib/store.ts`): two Zustand stores. `useAuthStore` is `persist`ed to localStorage (`mythoplay-auth`) and holds either a `user` or an `admin` (mutually exclusive); `useQuizStore` holds in-progress quiz answers (not persisted). The token lives in both the store and a raw `localStorage.token` key (read by the api interceptor) — `setUser`/`setAdmin`/`logout` keep them in sync.
- **Routing/access**: admin pages under `pages/admin/`, public/user pages at the top level. Pages gate themselves client-side off `useAuthStore`.

### Database (`backend/database/`)
PostgreSQL. `schema.sql` is the source of truth: tables `users`, `admins`, `quizzes`, `quiz_questions`, `quiz_scores`, plus `leaderboard_weekly` / `leaderboard_monthly` views and `updated_at` triggers. Enum-like constraints are enforced via `CHECK`:
- `age_group`: `'5-7'`, `'8-10'`, `'11-14'`
- quiz `category`: `'ramayana'`, `'mahabharata'`, `'krishna_leela'`, `'ganesha_stories'`, `'indian_festivals'`
- quiz `quiz_type`: `'multiple_choice'`, `'image_based'`, `'timed'`

When adding a category/age-group/quiz-type, update the CHECK constraint **and** any matching validation in routes and frontend filters.

## Conventions

- Backend is CommonJS; frontend is ESM/TypeScript. Don't mix.
- Member-exclusive content flows through the `is_natkhat_gannu_member` DB column → JWT claim → `requireNatkhatGannuMember` guard / `isNatkhatGannuMember` in the store. Keep these names aligned end-to-end.
- Env vars: copy `.env.example` → `.env`. Key ones: `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID` (and `NEXT_PUBLIC_*` mirrors for the frontend). Google OAuth client ID must match between frontend and backend.
- Default seeded admin: `admin@mythoplay.com` / `admin123` — change in production.
