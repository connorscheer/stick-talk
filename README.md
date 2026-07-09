# Stick Talk — standalone web version

This is the same app from Claude, converted to run as a real website with no
Claude account required for anyone — you or your friends. The feed, likes,
comments, and stories are stored in a free Supabase database instead of
Claude's artifact storage.

Rounds/handicap history and your GHIN info stay local to your own device
(same as before) — only the social feed is shared.

Budget about 20 minutes for the one-time setup below. After that, posting
updates to the code is just: edit → `git push` → Vercel redeploys automatically.

---

## 1. Create a free Supabase project

1. Go to https://supabase.com and sign up (free tier, no credit card needed)
2. Click **New Project**, give it any name, pick a region close to you, set a
   database password (you won't need to remember it — it's not the anon key)
3. Wait ~2 minutes for it to finish provisioning

## 2. Create the shared data table

1. In your new project, open the **SQL Editor** (left sidebar)
2. Paste in the SQL below and click **Run**

```sql
create table if not exists public.sticktalk_kv (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.sticktalk_kv enable row level security;

create policy "Allow anonymous read" on public.sticktalk_kv
  for select using (true);

create policy "Allow anonymous insert" on public.sticktalk_kv
  for insert with check (true);

create policy "Allow anonymous update" on public.sticktalk_kv
  for update using (true);
```

**Heads up on security:** this makes the feed data readable and writable by
anyone who has your site's URL — fine for a small group of friends testing an
app, not something you'd want for an app handling sensitive data. Before a
real public launch, you'd want proper accounts and tighter row-level security
rules.

## 3. Get your API keys

1. In Supabase, go to **Settings → API**
2. Copy the **Project URL** and the **anon public** key (not the `service_role` one)

## 4. Configure the project

1. In this project folder, copy `.env.example` to a new file named `.env`
2. Paste in your Project URL and anon key:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 5. Run it locally to test

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Post something,
then open the same URL in a second browser tab — you should see it show up
there within a few seconds.

## 6. Deploy it for real (Vercel)

1. Push this folder to a new GitHub repository
2. Go to https://vercel.com, sign up free, click **Add New → Project**, and
   import that GitHub repo
3. Vercel auto-detects Vite — leave the build settings as default
4. Before deploying, add your two environment variables under **Environment
   Variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values
   as your `.env` file)
5. Click **Deploy**

You'll get a real URL like `stick-talk.vercel.app` — no Claude account, no
login, works on any phone browser. Add it to your home screen for the closest
thing to a native app icon before you're ready for the real App Store build.

## Notes for later

- **Live updates:** right now the app re-checks the shared feed every 5
  seconds (same as before). Supabase supports true real-time push
  (`supabase.channel(...)`) if you want instant updates instead — ask me and
  I can wire that in.
- **Photos:** images are still stored as compressed base64 inside the feed
  data (same approach as before). Fine for testing; if photos get large or
  numerous, moving them to Supabase Storage (actual file storage, not jsonb)
  would be the next upgrade — also something I can build when you're ready.
- **Custom domain:** Vercel lets you attach your own domain for free once you
  own one, instead of the `.vercel.app` subdomain.
