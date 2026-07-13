# Handoff

## Active Focus

Stick Talk is a working, deployed app (stick-talk.vercel.app, auto-deploys from `main`). Recent work has been focused entirely on UI polish of the feed/scorecard/profile experience — the app is functionally stable, not in a broken or mid-migration state.

Current visual direction (as of the last session):
- Solid black app background, Twitter/X-style feed — posts are divided by a single mint (`#74C69D`) line rather than boxed cards.
- Scorecard uses a cream/paper look (`#F5EFDD` background, `#EDE4CC` hole cells, dark ink text, pen-style circle/square score marks).
- OUT/IN/TOTAL/TO PAR are color-coded relative to their own par (red under, mint green even, black over).
- Avatars (post author, golf-clap likers, profile edit/view) all get a clean solid mint border — no gradients/drop shadows, per explicit user preference for "clean and simple."
- Posts with a scorecard + multiple photos render as a horizontal swipeable carousel with dot indicators (not a vertical stack, not a native scrollbar).
- Post media sizing (settled after a few iterations — see log): the scorecard renders at its normal, unscaled size in a **fixed 420px-tall box**; photos are cropped with `object-fit: cover` to match that same box. Don't scale/stretch the scorecard to match a photo's aspect ratio — earlier attempts at that (uniform "contain" scaling, then non-uniform "fill" scaling) made the scorecard look wrong or distorted. The scorecard is the reference size; photos conform to it.
- Fullscreen post viewer (`PostViewerModal`, opened by tapping any post media): full-bleed edge-to-edge media (no border/rounded corners on photos there) with all chrome (back arrow, "...", author chip, caption chip, action pills, reply bar) floating as separate translucent dark pills directly on top of the media — not in a solid bottom bar. Tapping the media cycles zoom (1x/1.8x/2.6x) via CSS transform + pan-by-scroll; this only affects the media layer, not the floating UI, matching how X/Twitter's image viewer behaves.

Known-good conventions to keep following:
- All shared feed data (posts/profiles/matches) goes through Supabase via `loadShared`/`saveShared` — never `window.storage` (that's a Claude-artifact-only API, silently broken in the real deployed app). Personal-only data (name, home course, rounds, handicap) stays in `localStorage` via `loadPersonal`/`savePersonal`.
- Styling lives in the single `styles = {...}` object near the bottom of `src/App.jsx` — edit the relevant key there, don't add ad-hoc inline styles at call sites.
- Workflow: after any change, `npm install && npm run build` in the repo to verify, then commit + push to `main` directly (Vercel auto-deploys) — the user has asked not to be gated behind a confirmation question for routine pushes.
- There's a `stick-talk-ui` Claude Code skill (local to the user's machine, not in this repo) that captures this design system in more detail.

Just landed (this session): the post-media sizing/fullscreen-viewer feature went through several rounds of user feedback before landing — see "Post media sizing" and "Fullscreen post viewer" bullets above for the settled design. Also fixed a same-day feed-ordering bug (round posts were stamped at a hardcoded noon, sorting them below later same-day posts), an unguarded `.toLowerCase()` crash in the search filter, dead `kindMeta`/`meta` code in `PostCard`, and re-tinted the golf-clap emoji from its natural yellow to a mint-green CSS filter approximation when liked.

No open bugs or in-progress features are currently tracked. Next session should ask the user what's next rather than assume — this file will be kept current going forward.

## Session Log

- **2026-07-13**: Post media sizing, take 3: reverted to the scorecard's normal unscaled size (fixed 420px box) with photos cropped to match, after two earlier scaling approaches (uniform "contain" shrink, then non-uniform "fill" stretch) both got user pushback for changing how the scorecard looked.
- **2026-07-13**: Fullscreen post viewer redesign, take 2: media is now edge-to-edge full-bleed with all UI (back/menu/author/caption/actions/reply) as separate floating translucent pills on top, so tap-to-zoom only affects the media layer — matches how X/Twitter's own image viewer behaves. (Take 1 had media in a separate flex section pushed by the UI chrome, which wasn't what the user wanted.)
- **2026-07-13**: Fixed feed order bug (same-day round posts sorted below later posts due to a hardcoded noon timestamp) and re-tinted the golf-clap emoji mint-green when liked (CSS filter approximation, not a pixel-exact match).
- **2026-07-13**: Added fullscreen `PostViewerModal` (click any post media to zoom in — media fills the screen, actions pinned to the bottom) and made scorecard/photo sizing consistent within a post's media (both boxed to the same dimensions).
- **2026-07-13**: Fixed search-filter crash guard (missing author/course fields), removed dead `kindMeta` code in `PostCard`. Set up this handoff workflow (`HANDOFF.md` + `CLAUDE.md`).
- **2026-07-13**: Media carousel: replaced scrollbar with dot indicators, locked carousel scroll to horizontal-only (was catching vertical swipes on mobile).
- **2026-07-13**: Switched app background to solid black; feed posts changed from boxed cards to Twitter/X-style rows divided by a mint line.
- **2026-07-13**: Iterated background a few times — gray → white → black — landed on solid black; added then removed a dot-grain texture experiment along the way.
- **2026-07-13**: Post media: fixed a bug where multi-photo posts only ever showed the first photo; combined scorecard+photos into one swipeable carousel instead of stacking vertically.
- **2026-07-13**: Avatar polish: added mint border to post-author and golf-clap-liker avatars; golf-clap stack now shows real profile photos instead of always showing initials; simplified the profile-photo ring (removed spinning conic-gradient + drop shadow, then removed the gap so the photo fills the ring edge-to-edge).
- **2026-07-13**: Color-coded OUT/IN/TOTAL/TO PAR by relative-to-par (red under, green even, black over).
- **2026-07-12**: Scorecard redesign to cream/paper look with dark ink text and pen-style score marks (merged in from a separate Claude.ai conversation, re-wiring the Supabase backend that version was missing).
