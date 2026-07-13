# Stick Talk

A no-login golf social app: a shared feed (posts, likes/"golf claps", comments) plus personal round/handicap tracking. Deployed at stick-talk.vercel.app, auto-deploys from `main`.

## Tech stack

- React (single-file app — nearly everything lives in `src/App.jsx`)
- Vite (build tool — `npm run build`)
- Supabase (backend for the shared feed only — see below)
- Deployed on Vercel, auto-deploy on push to `main`

## Key conventions

- **Shared vs. personal data**: shared feed data (posts/profiles/matches) is read/written through `loadShared`/`saveShared`, backed by a single generic key-value table (`sticktalk_kv`) in Supabase — this is what makes the feed actually shared across visitors with no login. Personal data (your name, home course, rounds history, handicap) stays local via `loadPersonal`/`savePersonal` (plain `localStorage`). Never use `window.storage.*` — that's a Claude-artifact-only API that doesn't exist in a real deployed site; if a UI/feature snippet was prototyped as a Claude artifact, re-wire any shared-state pieces through `loadShared`/`saveShared` instead.
- **Styling**: nearly all styling is inline via a single `styles = {...}` object near the bottom of `src/App.jsx`, referenced as `style={styles.someKey}`. Edit the relevant key rather than adding one-off inline styles at the call site.
- **Verify before pushing**: after any change, run `npm install && npm run build` in this folder to confirm it builds cleanly before committing — Vercel deploys whatever lands on `main`, so a broken build there is a broken production site.

## Session workflow

- **At the start of every session**, read `HANDOFF.md` first, before doing anything else — it has the current focus and a dated log of recent work.
- **At the end of every session**, update `HANDOFF.md`: refresh "Active Focus" and append a new dated bullet to "Session Log" (newest on top). Do this with a targeted edit, never a full-file rewrite — the log is a running history, not a document to regenerate.
