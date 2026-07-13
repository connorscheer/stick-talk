# Stick Talk

A golf social app: real email+password accounts (Supabase Auth), a shared feed (posts, likes/"golf claps", comments), a follow graph with notifications, Groups with join-by-request private chat, plus personal round/handicap tracking. Deployed at stick-talk.vercel.app, auto-deploys from `main`.

## Tech stack

- React (single-file app — nearly everything lives in `src/App.jsx`)
- Vite (build tool — `npm run build`)
- Supabase (backend for the shared feed only — see below)
- Deployed on Vercel, auto-deploy on push to `main`

## Key conventions

- **Shared vs. personal data**: shared data (posts/profiles/matches/follows/groups, plus each signed-in account's own identity record) is read/written through `loadShared`/`saveShared`, backed by a single generic key-value table (`sticktalk_kv`) in Supabase. GHIN data stays local via `loadPersonal`/`savePersonal` (plain `localStorage`, not account-synced). Never use `window.storage.*` — that's a Claude-artifact-only API that doesn't exist in a real deployed site; if a UI/feature snippet was prototyped as a Claude artifact, re-wire any shared-state pieces through `loadShared`/`saveShared` instead.
- **Auth**: real accounts via Supabase Auth (`AuthGate`) — see the "Accounts" section in `README.md` for setup. Anything that should follow a person across devices (name, photo, home course, rounds) needs to go through `saveAccountField` into the shared per-account record, not just `localStorage` — `rounds` was silently never persisted anywhere for a while (fixed 2026-07-13); check new personal-feeling fields aren't repeating that mistake.
- **Styling**: nearly all styling is inline via a single `styles = {...}` object near the bottom of `src/App.jsx`, referenced as `style={styles.someKey}`. Edit the relevant key rather than adding one-off inline styles at the call site.
- **Verify before pushing**: after any change, run `npm install && npm run build` in this folder to confirm it builds cleanly before committing — Vercel deploys whatever lands on `main`, so a broken build there is a broken production site.

## Session workflow

- **At the start of every session**, read `HANDOFF.md` first, before doing anything else — it has the current focus and a dated log of recent work.
- **At the end of every session**, update `HANDOFF.md`: refresh "Active Focus" and append a new dated bullet to "Session Log" (newest on top). Do this with a targeted edit, never a full-file rewrite — the log is a running history, not a document to regenerate.
