---
title: PraxaLing
emoji: 🦜
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
hf_oauth: true
hf_oauth_scopes:
  - email
  - inference-api
---

# PraxaLing

Learn languages through short stories and the world around you, powered by HuggingFace for identity and inference.

Two clients, one backend:
- **Web** — Next.js 16 App Router (also acts as the shared API).
- **Mobile** — Flutter (latest stable), calls the same HTTP endpoints.

Three flows:
1. **Sign in with HuggingFace** (OAuth).
2. **Practice** — read short stories matched to your CEFR level and target language; tap any word for a translation. Generate new stories on demand.
3. **Camera** — take or upload a photo; the backend runs BLIP captioning, DETR detection, NLLB translation, and Mistral-generated example sentences.

## Stack

| Concern | Tech |
|---|---|
| Web | Next.js 16.2 · React 19 · Tailwind v4 · Turbopack |
| Mobile | Flutter 3.41 · Riverpod · go_router · dio |
| Auth | HuggingFace OAuth (`arctic`) · JWT (`jose`) |
| DB | Postgres · Drizzle ORM |
| Storage | Vercel Blob (optional) |
| Inference | `@huggingface/inference` · Mistral-7B-Instruct · BLIP · DETR · NLLB-200 |

## Getting started (web)

```bash
# 1. Install deps
npm install

# 2. Bring up Postgres
docker compose up -d

# 3. Configure env — copy and fill in
cp .env.example .env.local

# 4. Apply schema
npm run db:push

# 5. (Optional) seed stories
npm run db:seed

# 6. Run dev server
npm run dev
```

Required env:
- `AUTH_SECRET` — any 32+ char random string (`openssl rand -base64 32`)
- `HF_OAUTH_CLIENT_ID` / `HF_OAUTH_CLIENT_SECRET` — from https://huggingface.co/settings/applications/new, or use the Space metadata `hf_oauth: true` and the app will read Hugging Face's injected `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET`
- `HF_TOKEN` — read token from https://huggingface.co/settings/tokens
- Optional: `BLOB_READ_WRITE_TOKEN` for Vercel Blob

Redirect URIs to register on the HF OAuth app:
- `http://localhost:3000/api/auth/callback/huggingface`
- `http://localhost:3000/api/auth/callback/huggingface?client=mobile`
- `https://<SPACE_HOST>/api/auth/callback/huggingface`
- `https://<SPACE_HOST>/api/auth/callback/huggingface?client=mobile`

For the hosted Space, use the direct `*.hf.space` host, not the `huggingface.co/spaces/...` page, for redirect URIs and mobile `API_BASE_URL`.

## Getting started (mobile)

```bash
cd mobile
flutter pub get

# iOS simulator — host loopback is 127.0.0.1 by default
flutter run --dart-define=API_BASE_URL=http://127.0.0.1:3000

# Android emulator — host loopback is 10.0.2.2 (default)
flutter run

# Hosted backend / physical device
flutter run --dart-define=API_BASE_URL=https://<SPACE_HOST>
```

See `docs/API.md` for the endpoints the app consumes.

## Architecture notes

- **Auth**: both clients exchange an HF OAuth code for our own short-lived JWT. Web stores it in an httpOnly cookie; mobile in `flutter_secure_storage`. `lib/auth/session.ts#getSession()` handles both.
- **Next.js 16 specifics**: `middleware.ts` is now `proxy.ts`; dynamic APIs (`cookies`, `headers`, `params`) are async; Turbopack is default. See `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.
- **Data flow for camera**: multipart → BLIP + DETR in parallel → dedupe labels → translate each to target lang → Mistral generates 3 sentences keyed on caption + objects → persisted in `vision_jobs`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run db:push` | Apply schema to Postgres |
| `npm run db:generate` | Generate migration from schema |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Insert hand-curated stories |
| `npm run db:studio` | Drizzle Studio UI |
