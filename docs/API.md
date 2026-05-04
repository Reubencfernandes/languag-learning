# API contract

All routes are served by the Next.js app. Auth is either:
- `Cookie: ll_session=<jwt>` (web) — set by the OAuth callback.
- `Authorization: Bearer <jwt>` (mobile) — JWT delivered via the `langlearn://auth/callback?token=…` redirect.

The JWT is signed HS256 with `AUTH_SECRET` and contains `{ userId, hfUsername }`. TTL is 7 days.

## Auth

### `GET /api/auth/login`
Starts the HuggingFace OAuth dance.

Query params:
- `client=mobile` — if set, the callback will 302 to `langlearn://auth/callback?token=…` instead of setting a cookie. Otherwise, cookie + 302 to `/practice`.

### `GET /api/auth/callback/huggingface`
Handles HF's redirect back. Validates state + verifier cookies, exchanges code, upserts user, mints JWT. Never call directly.

### `POST /api/auth/logout`
Clears the session cookie. For mobile, the client just drops the stored JWT.

## Profile

### `GET /api/me`
```json
{
  "user": { "id": "uuid", "hfUsername": "alice", "email": "a@x.y", "avatarUrl": "…" },
  "profile": { "nativeLang": "en", "targetLang": "es", "level": "A2" } | null
}
```

### `PUT /api/me/profile`
Body:
```json
{ "nativeLang": "en", "targetLang": "es", "level": "A2" }
```
Responses: 200 with `{ profile }`, 400 on validation errors.

## Stories

### `GET /api/stories`
Lists stories matching the user's profile (targetLang + level). Response:
```json
{ "stories": [{ "id", "title", "targetLang", "level", "createdAt" }], "profile": {...} }
```

### `POST /api/stories`
Generates a new story for the user's profile.
Body (optional): `{ "topic": "a walk in the park" }`.
Response: `{ "story": { id, title, content, vocab, ... } }`.

### `GET /api/stories/:id`
`{ "story": { ... full story ... } }`

### `POST /api/stories/:id/read`
Marks the story as read by the current user.

## Translate

### `POST /api/translate`
```json
{ "text": "perro", "from": "es", "to": "en" }
```
Response: `{ "translation": "dog", "cached": true? }`.

## Vision

### `POST /api/vision/analyze`
Multipart form with field `image` (≤ 8 MB). Response:
```json
{
  "id": "uuid",
  "caption": "a cat sitting on a couch",
  "objects": [
    { "label": "cat", "translation": "gato", "box": [x1,y1,x2,y2], "score": 0.92 }
  ],
  "sentences": [
    { "target": "El gato está sobre el sofá.", "gloss": "The cat is on the sofa." }
  ],
  "imageUrl": "https://…"  // empty if blob storage isn't configured
}
```

## Error shape

All failures return `{ "error": "code", "message"?: "…" }` with an appropriate HTTP status.
Common codes: `unauthenticated` (401), `invalid_input` (400), `no_profile` (400), `inference_failed` (502), `image_too_large` (413).
