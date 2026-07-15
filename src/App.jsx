import { useState, useMemo, useRef, useEffect } from "react";
import { Flag, TrendingUp, TrendingDown, Minus, Users, User, MessageCircle, Plus, MapPin, X, SlidersHorizontal, Award, ChevronRight, ChevronLeft, Landmark, Navigation, Check, Image as ImageIcon, Camera, Send, MoreHorizontal, Trash2, Search, Bell, Share2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "./supabaseClient";

// Layered radial-gradient texture: fine grain plus larger soft blotches,
// mimicking the patchy, mottled look of a grass photo but in gray tones.
const BG_TEXTURE = {
  backgroundImage:
    "radial-gradient(circle at 15% 25%, rgba(255,255,255,0.06) 0%, transparent 42%), " +
    "radial-gradient(circle at 70% 15%, rgba(0,0,0,0.09) 0%, transparent 38%), " +
    "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.05) 0%, transparent 40%), " +
    "radial-gradient(circle at 85% 65%, rgba(0,0,0,0.07) 0%, transparent 45%), " +
    "radial-gradient(circle at 10% 85%, rgba(0,0,0,0.06) 0%, transparent 36%), " +
    "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), " +
    "radial-gradient(rgba(0,0,0,0.13) 1px, transparent 1.4px)",
  backgroundSize: "190px 190px, 230px 230px, 170px 170px, 210px 210px, 160px 160px, 7px 7px, 9px 9px",
  backgroundPosition: "0 0, 55px 30px, 110px 90px, 20px 130px, 150px 20px, 0 0, 4px 5px",
};

// Putting-green grass texture photo, resized/compressed for use as a tiled background.
const GRASS_TEXTURE = "data:image/jpeg;base64,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";

// ---------- Handicap math (simplified, not official USGA) ----------
function differential(score, rating = 72.0, slope = 113) {
  return ((score - rating) * 113) / slope;
}
function handicapFromDiffs(diffs) {
  if (diffs.length === 0) return null;
  const sorted = [...diffs].sort((a, b) => a - b);
  const n = sorted.length;
  let take = 1;
  if (n >= 11) take = Math.min(8, n);
  else if (n >= 9) take = 4;
  else if (n >= 7) take = 3;
  else if (n >= 5) take = 2;
  const best = sorted.slice(0, take);
  const avg = best.reduce((a, b) => a + b, 0) / best.length;
  return Math.round(avg * 0.96 * 10) / 10;
}

// ---------- Mock seed data ----------
const initialRounds = [];

// Demo "nearby golfers" for the Find Golfers panel. These are separate from
// real people using the shared feed (who are identified by myName) — this
// is a mocked discovery pool since there's no real location/matchmaking
// backend behind this yet.
const initialGolfers = [
  { id: "g1", name: "Marcus Reyes", distance: 3.2, handicap: 11.4 },
  { id: "g2", name: "Priya Anand", distance: 5.8, handicap: 14.9 },
  { id: "g3", name: "Deshawn Cole", distance: 7.1, handicap: 9.2 },
  { id: "g4", name: "Katie Fenwick", distance: 1.4, handicap: 17.6 },
  { id: "g5", name: "Owen Marsh", distance: 12.9, handicap: 6.8 },
  { id: "g6", name: "Lena Cho", distance: 9.4, handicap: 22.3 },
];

const seedInbox = [
  {
    id: "req1",
    golferId: "g4",
    note: "Saw you're around the same handicap — want to play Cedar Ridge Saturday morning?",
    status: "pending",
  },
];

const seedPosts = [
  {
    id: "welcome-post",
    kind: "note",
    author: "Stick Talk",
    initials: "ST",
    text: "Welcome to the clubhouse ⛳ Post a round, plan a match, or just talk stick.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likedBy: [],
    images: [],
    comments: [],
  },
];


// Cheap deep-equality check for plain JSON-shaped data (posts/profiles/
// matches) — used to skip a state update (and the re-render it triggers)
// when a poll comes back with data identical to what's already showing.
function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function initialsOf(name) {
  return (
    (name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

// Shared golf-clap emoji style (feed card + fullscreen viewer both use this
// same liked/unliked look) — filter tints it mint-green when liked, and the
// scale pop is the tap feedback.
function golfClapIconStyle(liked) {
  return {
    filter: liked ? "grayscale(1) sepia(1) hue-rotate(110deg) saturate(2.2) brightness(1.05)" : "grayscale(1) opacity(0.55)",
    transform: liked ? "scale(1.08)" : "scale(1)",
    transition: "transform 120ms cubic-bezier(0.23, 1, 0.32, 1)",
  };
}

// Deterministic placeholder avatar color per name, so a stack of avatars
// reads as distinct people rather than identical gray circles.
const AVATAR_COLORS = ["#74C69D", "#F4A261", "#E76F51", "#4CC9F0", "#B5838D", "#FFD166", "#6A994E", "#9B5DE5"];
function colorForName(name) {
  const str = name || "?";
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Renders a real profile photo when one is set, otherwise falls back to the
// colored-initials circle used everywhere else in the app.
function Avatar({ photo, name, style }) {
  if (photo) {
    return <img src={photo} alt={name} style={{ ...style, objectFit: "cover" }} />;
  }
  return (
    <div style={{ ...style, background: colorForName(name), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000000" }}>
      {initialsOf(name)}
    </div>
  );
}

// ---------- Shared storage helpers ----------
// Everyone who opens this website reads/writes the same rows in the Supabase
// `sticktalk_kv` table, which is what makes the feed a real multi-person feed
// instead of a private per-viewer demo. Reading/writing these rows doesn't
// require being signed in — see README.md for the one-time Supabase setup
// (table + policies). Signed-in accounts (Supabase Auth) are a separate
// layer on top, used to carry a person's identity across devices.
const STORAGE_KEYS = { posts: "sticktalk:posts", name: "sticktalk:my-name", profiles: "sticktalk:profiles", matches: "sticktalk:matches", follows: "sticktalk:follows", groups: "sticktalk:groups" };

async function loadShared(key, seed) {
  try {
    const { data, error } = await supabase.from("sticktalk_kv").select("value").eq("key", key).maybeSingle();
    if (error) throw error;
    if (data && data.value != null) return data.value;
  } catch (e) {
    // row doesn't exist yet, or Supabase isn't configured — fall back to seed
    console.warn("loadShared failed for", key, e);
  }
  return seed;
}

async function saveShared(key, value) {
  try {
    const { error } = await supabase.from("sticktalk_kv").upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  } catch (e) {
    // Supabase not configured yet, or the write failed — fail silently so the
    // UI still works locally for the current session
    console.warn("saveShared failed for", key, e);
  }
}

// Personal data (your name, your home course) lives only on this device —
// no account needed, so it's just plain localStorage.
function loadPersonal(key, seed) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw != null) return JSON.parse(raw);
  } catch (e) {
    // ignore — fall back to seed
  }
  return seed;
}

function savePersonal(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore — private browsing / storage disabled, etc.
  }
}

function clearPersonal(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
}

// Downscales + compresses an uploaded photo into a data URL small enough to
// store and sync through shared storage (object URLs from URL.createObjectURL
// only work on the device that created them, so we can't use those here).
function fileToSharedImage(file, maxDim = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round(height * (maxDim / width));
            width = maxDim;
          } else {
            width = Math.round(width * (maxDim / height));
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Profile photos only ever render inside a circular avatar (always a square
// crop), so — like Instagram, Twitter, etc. — crop to a centered square
// before upload instead of keeping the full rectangle. Avoids wasting bytes
// on parts of the photo nobody will ever see, and keeps every avatar the
// same shape regardless of what the original photo looked like.
function fileToSquareImage(file, size = 480, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// NOTE: Florida has 1,000+ golf courses; this is a representative set of real
// public/resort courses (not an exhaustive official database). Rating/slope
// values are placeholders for demo purposes, not verified official figures —
// a production app should pull these from a live course-data source (USGA
// Course Rating Database via GHIN, or a golf course API).
const COURSE_DB = [
  { name: "Pinehurst Municipal", city: "Fort Myers", rating: 71.2, slope: 122 },
  { name: "Cedar Ridge GC", city: "Orlando", rating: 70.5, slope: 118 },
  { name: "Oakview Links", city: "Tampa", rating: 72.0, slope: 128 },
  { name: "Briar Hollow", city: "Jacksonville", rating: 70.8, slope: 119 },
  { name: "Streamsong Black", city: "Streamsong", rating: 73.8, slope: 138 },
  { name: "Streamsong Red", city: "Streamsong", rating: 73.2, slope: 133 },
  { name: "Streamsong Blue", city: "Streamsong", rating: 73.0, slope: 132 },
  { name: "Cabot Citrus Farms – Karoo", city: "Brooksville", rating: 72.9, slope: 130 },
  { name: "Cabot Citrus Farms – The Roost", city: "Brooksville", rating: 72.6, slope: 128 },
  { name: "TPC Sawgrass – Stadium Course", city: "Ponte Vedra Beach", rating: 74.1, slope: 141 },
  { name: "Trump National Doral – Blue Monster", city: "Doral", rating: 74.0, slope: 139 },
  { name: "Southern Dunes Golf & Country Club", city: "Haines City", rating: 73.4, slope: 134 },
  { name: "Waldorf Astoria Golf Club", city: "Orlando", rating: 73.0, slope: 131 },
  { name: "Ritz-Carlton Golf Club – Grande Lakes", city: "Orlando", rating: 72.7, slope: 129 },
  { name: "Bay Hill Club & Lodge", city: "Orlando", rating: 73.6, slope: 135 },
  { name: "LPGA International – Hills Course", city: "Daytona Beach", rating: 72.9, slope: 130 },
  { name: "LPGA International – Champions Course", city: "Daytona Beach", rating: 72.4, slope: 127 },
  { name: "Reunion Resort – Palmer Course", city: "Kissimmee", rating: 73.1, slope: 132 },
  { name: "Grand Cypress Resort – New Course", city: "Orlando", rating: 72.3, slope: 126 },
  { name: "Champions Club at Summerfield", city: "Lake Mary", rating: 71.9, slope: 124 },
  { name: "Celebration Golf Club", city: "Celebration", rating: 72.1, slope: 125 },
  { name: "New Smyrna Golf Club", city: "New Smyrna Beach", rating: 70.9, slope: 120 },
  { name: "Fox Hollow Golf Club", city: "Trinity", rating: 71.4, slope: 122 },
  { name: "Old Corkscrew Golf Club", city: "Estero", rating: 73.0, slope: 131 },
  { name: "Webb's Reserve", city: "Punta Gorda", rating: 72.5, slope: 128 },
  { name: "Eaglebrooke Golf Club", city: "Lakeland", rating: 71.7, slope: 123 },
  { name: "Sandridge Golf Club – Dunes Course", city: "Vero Beach", rating: 71.0, slope: 120 },
  { name: "Eagle Creek Golf Club", city: "Orlando", rating: 71.3, slope: 122 },
  { name: "Abacoa Golf Club", city: "Jupiter", rating: 71.6, slope: 123 },
  { name: "Boca Raton Golf & Racquet Club", city: "Boca Raton", rating: 70.7, slope: 118 },
  { name: "Kelly Plantation Golf Club", city: "Destin", rating: 72.8, slope: 130 },
  { name: "Southwood Golf Club", city: "Tallahassee", rating: 71.8, slope: 124 },
  { name: "St. Johns Golf Club", city: "Elkton", rating: 71.1, slope: 121 },
  { name: "Royal St. Cloud Golf Links", city: "St. Cloud", rating: 71.5, slope: 122 },
  { name: "North Palm Beach Country Club", city: "North Palm Beach", rating: 70.6, slope: 117 },
  { name: "Tiburón Golf Club", city: "Naples", rating: 73.3, slope: 133 },
  { name: "Naples Grande Golf Club", city: "Naples", rating: 72.6, slope: 128 },
  { name: "PGA National Resort – Fazio Course", city: "Palm Beach Gardens", rating: 73.5, slope: 136 },
  { name: "The Park West Palm", city: "West Palm Beach", rating: 70.4, slope: 116 },
  { name: "Deer Island Country Club", city: "Tavares", rating: 71.2, slope: 121 },
  { name: "Ocala Golf Club", city: "Ocala", rating: 69.8, slope: 114 },
  { name: "Baytree National Golf Links", city: "Melbourne", rating: 72.0, slope: 125 },
  { name: "Legends at Orange Lake Resort", city: "Kissimmee", rating: 71.9, slope: 124 },
  { name: "Lely Resort – Flamingo Island Club", city: "Naples", rating: 72.4, slope: 127 },
  { name: "Regatta Bay Golf & Country Club", city: "Destin", rating: 71.7, slope: 123 },
  { name: "Omni Amelia Island – Ocean Links", city: "Amelia Island", rating: 70.9, slope: 119 },
  { name: "Omni Amelia Island – Oak Marsh", city: "Amelia Island", rating: 71.3, slope: 121 },
  { name: "Hombre Golf Club", city: "Panama City Beach", rating: 71.0, slope: 120 },
  { name: "Gateway Golf & Country Club", city: "Fort Myers", rating: 71.6, slope: 123 },
  { name: "Bay Point Golf Club – Nicklaus Course", city: "Panama City Beach", rating: 72.2, slope: 126 },
];

// Per-course tee data (color, yardage, rating/slope for that tee) isn't in
// the course database yet — this is a placeholder set with typical yardages
// for each tee color, shown for every course until real tee-by-tee data is
// loaded in. Once a course object has its own `tees` array (each with a
// name + yardage), that will be used instead of this fallback.
const DEFAULT_TEES = [
  { name: "Black", yardage: 7100 },
  { name: "Blue", yardage: 6650 },
  { name: "White", yardage: 6200 },
  { name: "Gold", yardage: 5700 },
  { name: "Red", yardage: 5100 },
];

// Older posted rounds (from before yardage tracking existed) only have a
// tee name saved, no yardage. This fills in a reasonable placeholder by
// matching the tee name against the default tee set, so every scorecard
// shows a number instead of just the tee color.
function estimateYardage(teeName) {
  if (!teeName) return null;
  const match = DEFAULT_TEES.find((t) => t.name.toLowerCase() === String(teeName).toLowerCase());
  return match ? match.yardage : 6200;
}

function fmtDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Placeholder "photos" for seed content — real posts/stories a person creates
// use actual uploaded images (object URLs), these are just stand-ins so the
// demo feed doesn't look empty.
const PHOTO_PLACEHOLDERS = {
  "photo:sunrise": { gradient: "linear-gradient(135deg, #F4A261 0%, #E76F51 45%, #2A9D8F 100%)" },
  "photo:fairway": { gradient: "linear-gradient(135deg, #74C69D 0%, #4A4844 60%, #1C1B1A 100%)" },
  "photo:green": { gradient: "linear-gradient(135deg, #95D5B2 0%, #52B788 55%, #1B4332 100%)" },
  "photo:clubhouse": { gradient: "linear-gradient(135deg, #D4B483 0%, #A67C52 55%, #3E2723 100%)" },
};

function PhotoTile({ src, style, alt = "Shared golf photo" }) {
  // src is either a real image (object URL / data URL) or a "photo:xxx" placeholder key
  if (src && !src.startsWith("photo:")) {
    return <img src={src} alt={alt} style={{ objectFit: "cover", ...style }} />;
  }
  const p = PHOTO_PLACEHOLDERS[src] || PHOTO_PLACEHOLDERS["photo:fairway"];
  return (
    <div style={{ ...style, background: p.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Flag size={style?.height > 100 ? 30 : 18} color="rgba(255,255,255,0.55)" strokeWidth={2} />
    </div>
  );
}

// Recreation of the Stick Talk brand mark — a bold "ST" monogram with
// three fanning strokes suggesting sound/talk, matching the new logo sheet.
function BrandMark({ size = 24, poleColor = "#000000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="2" y="70" fontFamily="'Baloo 2', sans-serif" fontWeight="800" fontSize="58" letterSpacing="-2" fill={poleColor}>ST</text>
      <g stroke={poleColor} strokeWidth="9" strokeLinecap="round">
        <line x1="70" y1="34" x2="87" y2="19" />
        <line x1="74" y1="54" x2="95" y2="40" />
        <line x1="70" y1="74" x2="87" y2="89" />
      </g>
    </svg>
  );
}

function StickTalkWordmark() {
  return <img src="/stick-talk-wordmark.png" alt="Stick Talk" style={styles.stickTalkBadge} />;
}

function TeeIcon({ size = 16, color = "#FFFFFF" }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0 H16 L10 7 V17 L8 20 L6 17 V7 Z" fill={color} />
    </svg>
  );
}

// Small standalone birdie/bogey-style mark for the onboarding scorecard mockup.
// Intentionally not the real ScoreMark/Scorecard code (that sizing pipeline is
// locked, see stick-talk-ui skill) — this is a static sample for marketing only.
function MockScoreMark({ score, diff }) {
  const isCircle = diff <= -1;
  const isSquare = diff >= 1;
  const shape = isCircle ? "50%" : isSquare ? 4 : 0;
  if (!isCircle && !isSquare) {
    return <span style={{ fontSize: 13, fontWeight: 700, color: "#232220" }}>{score}</span>;
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 21,
        height: 21,
        border: "1.5px solid #232220",
        borderRadius: shape,
        fontSize: 11.5,
        fontWeight: 700,
        color: "#232220",
      }}
    >
      {score}
    </span>
  );
}

function OnboardFeedMock() {
  return (
    <div style={styles.mockFeedWrap}>
      <div style={styles.mockFeedTopRow}>
        <Avatar name="Jordan Pace" style={styles.mockAvatar} />
        <div>
          <div style={styles.mockName}>Jordan Pace</div>
          <div style={styles.mockTime}>Today at 2:14 PM</div>
        </div>
      </div>
      <p style={styles.mockCaption}>Carded a 78 at Colorow — new personal best 🔥</p>
      <div style={styles.mockMediaBox}>
        <Flag size={30} color="#F5EFDD" style={{ opacity: 0.85 }} />
      </div>
      <div style={styles.mockLikedByRow}>Jordan Pace and 11 others gave a golf clap</div>
      <div style={styles.mockActionsRow}>
        <span style={styles.mockActionItem}>
          <span style={{ fontSize: 15 }}>👏</span> 12
        </span>
        <span style={styles.mockActionItem}>
          <MessageCircle size={14} /> 4
        </span>
        <span style={styles.mockActionItem}>
          <Share2 size={14} />
        </span>
      </div>
    </div>
  );
}

function OnboardScorecardMock() {
  const holes = [
    { num: 1, par: 4, score: 4 },
    { num: 2, par: 3, score: 2 },
    { num: 3, par: 5, score: 7 },
    { num: 4, par: 4, score: 5 },
    { num: 5, par: 3, score: 3 },
    { num: 6, par: 5, score: 5 },
  ];
  return (
    <div style={styles.mockScoreWrap}>
      <div style={styles.mockScoreTitle}>Colorow Mountain Park</div>
      <div style={styles.mockStatsRow}>
        <span>18 holes</span>
        <span>Par 72</span>
        <span>Shot 76</span>
      </div>
      <div style={styles.mockHoleRow}>
        {holes.map((h) => (
          <div key={h.num} style={styles.mockHoleCell}>
            <span style={styles.mockHoleNum}>{h.num}</span>
            <span style={styles.mockHolePar}>{h.par}</span>
            <MockScoreMark score={h.score} diff={h.score - h.par} />
          </div>
        ))}
      </div>
      <div style={styles.mockFooterRow}>
        <span>Diff 4.2</span>
        <span>Rating 71.4</span>
        <span>Slope 128</span>
      </div>
      <div style={styles.mockHandicapRow}>
        <TrendingDown size={13} color="#74C69D" />
        <span>Handicap trending down — 9.4 this month</span>
      </div>
      <div style={styles.mockRecentLabel}>Last 4 rounds</div>
      <div style={styles.mockRecentRow}>
        {["+4", "+2", "E", "+6"].map((v, i) => (
          <div key={i} style={styles.mockRecentChip}>
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}

function OnboardGroupsMock() {
  return (
    <div style={styles.mockGroupWrap}>
      <div style={styles.mockGroupHeaderRow}>
        <div style={styles.mockGroupAvatarStack}>
          <Avatar name="Emilio Soria" style={{ ...styles.mockGroupAvatarSm, zIndex: 3 }} />
          <Avatar name="Priya Nair" style={{ ...styles.mockGroupAvatarSm, zIndex: 2, marginLeft: -10 }} />
          <Avatar name="Dev Patel" style={{ ...styles.mockGroupAvatarSm, zIndex: 1, marginLeft: -10 }} />
        </div>
        <div>
          <div style={styles.mockGroupHeader}>Sunday Skins 🏌️</div>
          <div style={styles.mockGroupSub}>6 members</div>
        </div>
      </div>
      <div style={styles.mockChatCol}>
        <span style={styles.mockBubbleTheirs}>Tee time moved to 8:40, everyone good?</span>
        <span style={styles.mockBubbleMine}>Works for me 👍</span>
        <span style={styles.mockBubbleTheirs}>See you all there</span>
        <span style={styles.mockBubbleTheirs}>I'll bring the extra balls, lost half of mine last week</span>
        <span style={styles.mockBubbleMine}>😂 same</span>
      </div>
      <div style={styles.mockInputBar}>
        <span style={styles.mockInputPill}>Message…</span>
        <span style={styles.mockSendDot}>
          <Send size={13} color="#000000" />
        </span>
      </div>
    </div>
  );
}

function OnboardNotifsMock() {
  const rows = [
    { name: "Emilio Soria", text: "gave your round a golf clap 👏", time: "2m" },
    { name: "Priya Nair", text: "started following you", time: "18m" },
    { name: "Dev Patel", text: "requested to join Sunday Skins", time: "1h" },
    { name: "Adriana Marcos", text: "commented: \"Let's go!!!\"", time: "3h" },
    { name: "Jordan Pace", text: "gave your round a golf clap 👏", time: "5h" },
  ];
  return (
    <div style={styles.mockNotifWrap}>
      <div style={styles.mockNotifTitle}>Notifications</div>
      <div style={{ ...styles.mockGroupSub, marginBottom: 8 }}>This week</div>
      {rows.map((r, i) => (
        <div key={r.name + i} style={styles.mockNotifRow}>
          <Avatar name={r.name} style={{ ...styles.mockAvatar, width: 30, height: 30, fontSize: 11 }} />
          <div>
            <div style={styles.mockNotifText}>
              <b>{r.name}</b> {r.text}
            </div>
            <div style={styles.mockNotifTime}>{r.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const ONBOARDING_SLIDES = [
  { key: "feed", headline: "Get golf claps from your crew.", Mock: OnboardFeedMock },
  { key: "rounds", headline: "Track every round you play.", Mock: OnboardScorecardMock },
  { key: "groups", headline: "Chat privately with your group.", Mock: OnboardGroupsMock },
  { key: "notifs", headline: "Never miss what's happening.", Mock: OnboardNotifsMock },
];

function AuthGate() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [showForm, setShowForm] = useState(false);
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const touchStartX = useRef(null);

  function openForm(nextMode) {
    setMode(nextMode);
    setError("");
    setInfo("");
    setShowForm(true);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    setSlide((s) => (delta < 0 ? Math.min(s + 1, ONBOARDING_SLIDES.length - 1) : Math.max(s - 1, 0)));
  }

  async function handleSubmit() {
    setError("");
    setInfo("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Enter an email and password.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
        if (signInError) throw signInError;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({ email: trimmedEmail, password });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setInfo("Check your email to confirm your account, then sign in.");
        }
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const globalStyleTag = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
      * { box-sizing: border-box; }
      button { font-family: inherit; cursor: pointer; }
      input { font-family: inherit; }
      button:not(:disabled):active {
        transform: scale(0.97);
        transition: transform 140ms cubic-bezier(0.23, 1, 0.32, 1);
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );

  if (!showForm) {
    const activeSlide = ONBOARDING_SLIDES[slide];
    const ActiveMock = activeSlide.Mock;
    return (
      <div style={styles.onboardWrap}>
        {globalStyleTag}
        <div style={styles.onboardGlow} />
        <img src="/stick-talk-wordmark-signin.png" alt="Stick Talk" style={styles.onboardWordmarkImg} />
        <div style={styles.onboardCardFrame} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <ActiveMock />
        </div>
        <p style={styles.onboardHeadline}>{activeSlide.headline}</p>
        <div style={styles.onboardDots}>
          {ONBOARDING_SLIDES.map((s, i) => (
            <button
              key={s.key}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              style={{ ...styles.onboardDot, ...(i === slide ? styles.onboardDotActive : {}) }}
            />
          ))}
        </div>
        <div style={styles.onboardActions}>
          <button style={styles.logBtn} onClick={() => openForm("signup")}>
            Join for free
          </button>
          <button style={styles.onboardLoginLink} onClick={() => openForm("signin")}>
            Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.nameGateWrap}>
      {globalStyleTag}
      <button style={styles.onboardBackBtn} onClick={() => setShowForm(false)} aria-label="Back">
        <ChevronLeft size={20} />
      </button>
      <img src="/stick-talk-wordmark-signin.png" alt="Stick Talk" style={styles.nameGateWordmarkImg} />
      <p style={styles.nameGateCopy}>{mode === "signin" ? "Sign in to your account" : "Create an account"}</p>
      <input
        style={styles.nameGateInput}
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      <input
        style={{ ...styles.nameGateInput, marginTop: 10 }}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      {error && <p style={{ ...styles.nameGateFoot, color: "#E27D6E", marginTop: 0 }}>{error}</p>}
      {info && <p style={{ ...styles.nameGateFoot, color: "#74C69D", marginTop: 0 }}>{info}</p>}
      <button style={{ ...styles.logBtn, opacity: busy ? 0.6 : 1, marginTop: 4 }} disabled={busy} onClick={handleSubmit}>
        {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
      </button>
      <p style={styles.nameGateFoot}>
        {mode === "signin" ? "New here? " : "Already have an account? "}
        <span
          style={{ color: "#74C69D", fontWeight: 700 }}
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
            setInfo("");
          }}
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </span>
      </p>
    </div>
  );
}

function NameGate({ onSubmit }) {
  const [name, setName] = useState("");
  return (
    <div style={styles.nameGateWrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        input { font-family: inherit; }
        button:not(:disabled):active {
          transform: scale(0.97);
          transition: transform 140ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <img src="/stick-talk-wordmark-signin.png" alt="Stick Talk" style={styles.nameGateWordmarkImg} />
      <p style={styles.nameGateCopy}>What should the group see your posts as?</p>
      <input
        style={styles.nameGateInput}
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit(name)}
        autoFocus
      />
      <button style={{ ...styles.logBtn, opacity: name.trim() ? 1 : 0.5, marginTop: 4 }} disabled={!name.trim()} onClick={() => onSubmit(name)}>
        Join the clubhouse
      </button>
      <p style={styles.nameGateFoot}>This is a shared test feed — everyone with the link sees the same posts.</p>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = still checking, null = signed out
  const [tab, setTab] = useState("home");
  const [rounds, setRounds] = useState(initialRounds);
  const [golfers, setGolfers] = useState(initialGolfers);
  const [posts, setPosts] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [myName, setMyName] = useState(null); // null until loaded from personal storage or entered
  const [nameLoaded, setNameLoaded] = useState(false);
  const [roundsLoaded, setRoundsLoaded] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showGhinModal, setShowGhinModal] = useState(false);
  const [ghinStatus, setGhinStatus] = useState("disconnected"); // disconnected | connected
  const [ghinNumber, setGhinNumber] = useState("");
  const [ghinHandicap, setGhinHandicap] = useState("");
  const [maxDistance, setMaxDistance] = useState(10);
  const [handSpread, setHandSpread] = useState(6);
  const [requested, setRequested] = useState({});
  const [inbox, setInbox] = useState(seedInbox);
  const [showInbox, setShowInbox] = useState(false);
  const [seenActivityIds, setSeenActivityIds] = useState(() => loadPersonal("sticktalk:seen-notifications", []));
  const [showComposer, setShowComposer] = useState(false);
  const [commentsFor, setCommentsFor] = useState(null); // postId
  const [likersFor, setLikersFor] = useState(null); // postId
  const [viewingPost, setViewingPost] = useState(null); // postId
  const [homeCourse, setHomeCourse] = useState("");
  const [myPhoto, setMyPhoto] = useState(null);
  const [myTees, setMyTees] = useState(2000); // Tees currency balance — display-only for now, no earn/spend wired up yet
  const [profiles, setProfiles] = useState({}); // { [name]: {initials, homeCourse, handicap, avgScore, bestRound, roundsCount, photo} }
  const [follows, setFollows] = useState({}); // { [followerName]: { [followedName]: isoTimeFollowed } }
  const [viewingProfile, setViewingProfile] = useState(null); // name of the profile being viewed, or null
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [showMatchComposer, setShowMatchComposer] = useState(false);
  const [matchSubTab, setMatchSubTab] = useState("matches"); // "matches" | "groups"
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [viewingGroup, setViewingGroup] = useState(null); // group id

  const myInitials = initialsOf(myName);

  // Track the Supabase Auth session. getSession() picks up a session already
  // persisted (in this browser's localStorage by the Supabase SDK) so return
  // visits on the same device stay signed in; a new device has no persisted
  // session, so onAuthStateChange only fires once the user signs in there.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Once signed in, load this account's identity (name/home course/photo)
  // from shared storage keyed by user id, so it follows the account to any
  // device instead of staying stuck on the device it was entered on. Falls
  // back to this device's localStorage for anyone who set up their profile
  // before accounts existed.
  useEffect(() => {
    if (!session) return;
    (async () => {
      const account = await loadShared(`sticktalk:account:${session.user.id}`, null);
      if (account) {
        if (account.name) setMyName(account.name);
        setHomeCourse(account.homeCourse || "Pinehurst Municipal");
        if (account.photo) setMyPhoto(account.photo);
        if (account.rounds) setRounds(account.rounds);
      } else {
        const savedName = loadPersonal(STORAGE_KEYS.name, null);
        if (savedName) setMyName(savedName);
        const savedCourse = loadPersonal("sticktalk:my-home-course", null);
        setHomeCourse(savedCourse || "Pinehurst Municipal");
        const savedPhoto = loadPersonal("sticktalk:my-photo", null);
        if (savedPhoto) setMyPhoto(savedPhoto);
        const savedRounds = loadPersonal("sticktalk:my-rounds", null);
        if (savedRounds) setRounds(savedRounds);
      }
      const savedTees = loadPersonal("sticktalk:my-tees", null);
      if (savedTees != null) setMyTees(savedTees);
      setNameLoaded(true);
      setRoundsLoaded(true);
    })();
  }, [session]);

  // Load the shared feed once on mount — it isn't gated behind auth.
  useEffect(() => {
    (async () => {
      const loadedPosts = await loadShared(STORAGE_KEYS.posts, null);
      if (loadedPosts) {
        setPosts(loadedPosts);
      } else {
        setPosts(seedPosts);
        saveShared(STORAGE_KEYS.posts, seedPosts);
      }

      const loadedProfiles = await loadShared(STORAGE_KEYS.profiles, null);
      if (loadedProfiles) setProfiles(loadedProfiles);

      const loadedMatches = await loadShared(STORAGE_KEYS.matches, null);
      if (loadedMatches) setMatches(loadedMatches);

      const loadedFollows = await loadShared(STORAGE_KEYS.follows, null);
      if (loadedFollows) setFollows(loadedFollows);

      const loadedGroups = await loadShared(STORAGE_KEYS.groups, null);
      if (loadedGroups) setGroups(loadedGroups);

      setDataLoaded(true);
    })();
  }, []);

  // Poll the shared feed every few seconds so everyone testing this on their
  // own phone sees new posts/likes/comments show up without a manual
  // refresh. This isn't instant push — just a short-interval re-fetch — but
  // it's enough to feel "live" for a small group testing together.
  //
  // Important: we merge the fetched data with local state rather than
  // overwriting outright. Saving to shared storage is fire-and-forget, so
  // there's a window right after you post where the local state has your
  // new post but the shared copy doesn't have it yet. A blind overwrite
  // during that window would wipe the post back out of your own feed a
  // couple seconds after you created it. Merging keeps anything local that
  // the fetch doesn't know about yet, while still picking up everyone
  // else's changes.
  useEffect(() => {
    if (!dataLoaded) return;
    const interval = setInterval(async () => {
      const freshPosts = await loadShared(STORAGE_KEYS.posts, null);
      if (freshPosts) {
        setPosts((prev) => {
          const freshMap = new Map(freshPosts.map((x) => [x.id, x]));
          const localIds = new Set(prev.map((x) => x.id));
          // Keep the local copy for anything edited in the last few seconds
          // (a like, comment, or delete you just made) — otherwise this poll
          // can catch a not-yet-updated snapshot and undo your own action.
          const reconciled = prev.map((p) => (isRecentEdit("posts", p.id) ? p : freshMap.get(p.id) || p));
          const newFromOthers = freshPosts.filter((x) => !localIds.has(x.id));
          const next = [...newFromOthers, ...reconciled];
          // Bail out to the *same* array reference when nothing actually
          // changed — otherwise every 5-second tick forces a fresh array
          // (and a full re-render of the whole feed) even when the poll
          // came back identical, which is what was causing the flicker.
          return sameJson(next, prev) ? prev : next;
        });
      }
      const freshProfiles = await loadShared(STORAGE_KEYS.profiles, null);
      if (freshProfiles) setProfiles((prev) => (sameJson(freshProfiles, prev) ? prev : freshProfiles));
      const freshMatches = await loadShared(STORAGE_KEYS.matches, null);
      if (freshMatches) {
        setMatches((prev) => {
          const freshMap = new Map(freshMatches.map((x) => [x.id, x]));
          const localIds = new Set(prev.map((x) => x.id));
          const reconciled = prev.map((m) => (isRecentEdit("matches", m.id) ? m : freshMap.get(m.id) || m));
          const newFromOthers = freshMatches.filter((x) => !localIds.has(x.id));
          const next = [...newFromOthers, ...reconciled];
          return sameJson(next, prev) ? prev : next;
        });
      }
      const freshFollows = await loadShared(STORAGE_KEYS.follows, null);
      if (freshFollows) setFollows((prev) => (sameJson(freshFollows, prev) ? prev : freshFollows));
      const freshGroups = await loadShared(STORAGE_KEYS.groups, null);
      if (freshGroups) {
        setGroups((prev) => {
          const freshMap = new Map(freshGroups.map((x) => [x.id, x]));
          const localIds = new Set(prev.map((x) => x.id));
          const reconciled = prev.map((g) => (isRecentEdit("groups", g.id) ? g : freshMap.get(g.id) || g));
          const newFromOthers = freshGroups.filter((x) => !localIds.has(x.id));
          const next = [...newFromOthers, ...reconciled];
          return sameJson(next, prev) ? prev : next;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [dataLoaded]);

  // Publish a snapshot of your own stats to shared storage whenever they
  // change, so other people can look up your profile. Only your own device
  // knows your real rounds/handicap — this is what makes that visible to others.
  useEffect(() => {
    if (!dataLoaded || !myName || !homeCourse) return;
    const diffs = rounds.map((r) => differential(r.score, r.rating, r.slope));
    const snapshot = {
      initials: myInitials,
      homeCourse,
      handicap: handicapFromDiffs(diffs),
      avgScore: rounds.length ? Math.round(rounds.reduce((a, r) => a + r.score, 0) / rounds.length) : null,
      bestRound: rounds.length ? Math.min(...rounds.map((r) => r.score)) : null,
      roundsCount: rounds.length,
      photo: myPhoto,
    };
    setProfiles((prev) => {
      const next = { ...prev, [myName]: snapshot };
      saveShared(STORAGE_KEYS.profiles, next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded, myName, myInitials, homeCourse, rounds, myPhoto]);

  // Persist your actual round history (the "Monthly Snapshot" numbers are
  // derived from this) both locally and to the shared per-account record,
  // so it survives a refresh and follows you to a new device instead of
  // resetting to empty. Guarded on roundsLoaded so this can't fire with the
  // still-empty initial state and stomp real rounds before the load finishes.
  useEffect(() => {
    if (!roundsLoaded || !myName) return;
    savePersonal("sticktalk:my-rounds", rounds);
    saveAccountField("rounds", rounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundsLoaded, myName, rounds]);

  // Merges one field into this account's shared identity record so it's
  // there waiting the next time this person signs in on any device.
  async function saveAccountField(field, value) {
    if (!session) return;
    const key = `sticktalk:account:${session.user.id}`;
    const existing = (await loadShared(key, {})) || {};
    await saveShared(key, { ...existing, [field]: value });
  }

  function saveMyPhoto(dataUrl) {
    setMyPhoto(dataUrl);
    savePersonal("sticktalk:my-photo", dataUrl);
    saveAccountField("photo", dataUrl);
  }

  function saveMyHomeCourse(course) {
    setHomeCourse(course);
    savePersonal("sticktalk:my-home-course", course);
    saveAccountField("homeCourse", course);
  }

  function openProfile(name) {
    setViewingProfile(name);
  }

  function saveMyName(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMyName(trimmed);
    savePersonal(STORAGE_KEYS.name, trimmed);
    saveAccountField("name", trimmed);
  }

  async function logOut() {
    await supabase.auth.signOut();
    setMyName(null);
    clearPersonal(STORAGE_KEYS.name);
  }

  function updatePosts(updater) {
    setPosts((prev) => {
      const next = updater(prev);
      saveShared(STORAGE_KEYS.posts, next);
      return next;
    });
  }

  function updateMatches(updater) {
    setMatches((prev) => {
      const next = updater(prev);
      saveShared(STORAGE_KEYS.matches, next);
      return next;
    });
  }

  function updateGroups(updater) {
    setGroups((prev) => {
      const next = updater(prev);
      saveShared(STORAGE_KEYS.groups, next);
      return next;
    });
  }

  function createGroup(name, photo) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = "group-" + Date.now();
    updateGroups((prev) => [{ id, name: trimmed, photo: photo || null, members: [myName], createdBy: myName, createdAt: new Date().toISOString(), messages: [] }, ...prev]);
    setShowCreateGroup(false);
  }

  function sendGroupMessage(id, text) {
    if (!text.trim()) return;
    markRecentEdit("groups", id);
    updateGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, messages: [...(g.messages || []), { id: "gm-" + Date.now(), author: myName, text: text.trim(), time: new Date().toISOString() }] }
          : g
      )
    );
  }

  // Joining a group now needs the owner's approval — request adds you to
  // pendingRequests (a name->timestamp map, like follows/likedAt, so it can
  // also drive a notification), and the owner accepts/declines from there.
  function requestToJoinGroup(id) {
    markRecentEdit("groups", id);
    updateGroups((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const members = g.members || [];
        const pending = g.pendingRequests || {};
        if (members.includes(myName) || pending[myName]) return g;
        return { ...g, pendingRequests: { ...pending, [myName]: new Date().toISOString() } };
      })
    );
  }

  function cancelJoinRequest(id) {
    markRecentEdit("groups", id);
    updateGroups((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const pending = { ...(g.pendingRequests || {}) };
        delete pending[myName];
        return { ...g, pendingRequests: pending };
      })
    );
  }

  function respondToGroupRequest(id, name, accept) {
    markRecentEdit("groups", id);
    updateGroups((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const pending = { ...(g.pendingRequests || {}) };
        delete pending[name];
        const members = accept ? [...(g.members || []), name] : g.members || [];
        return { ...g, members, pendingRequests: pending };
      })
    );
  }

  function leaveGroup(id) {
    markRecentEdit("groups", id);
    updateGroups((prev) => prev.map((g) => (g.id === id ? { ...g, members: (g.members || []).filter((n) => n !== myName) } : g)));
  }

  function deleteGroup(id) {
    markRecentEdit("groups", id);
    updateGroups((prev) => prev.filter((g) => g.id !== id));
    setViewingGroup(null);
  }

  function postMatch(course, when, spots, note) {
    const match = {
      id: "match-" + Date.now(),
      author: myName,
      authorInitials: myInitials,
      course,
      when,
      spots: Number(spots) || 1,
      note: note || "",
      time: new Date().toISOString(),
      joinedBy: [],
    };
    updateMatches((prev) => [match, ...prev]);
    setShowMatchComposer(false);
  }

  function toggleJoinMatch(id) {
    markRecentEdit("matches", id);
    updateMatches((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const joinedBy = m.joinedBy || [];
        const already = joinedBy.includes(myName);
        return { ...m, joinedBy: already ? joinedBy.filter((n) => n !== myName) : [...joinedBy, myName] };
      })
    );
  }

  function deleteMatch(id) {
    markRecentEdit("matches", id);
    updateMatches((prev) => prev.filter((m) => m.id !== id));
  }

  const sortedRounds = useMemo(
    () => [...rounds].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [rounds]
  );

  const diffs = sortedRounds.map((r) => differential(r.score, r.rating, r.slope));
  const currentHandicap = handicapFromDiffs(diffs);
  const avgScore = rounds.length ? Math.round(rounds.reduce((a, r) => a + r.score, 0) / rounds.length) : null;
  const bestRound = rounds.length ? Math.min(...rounds.map((r) => r.score)) : null;

  const trendData = sortedRounds.map((r, i) => {
    const upTo = diffs.slice(0, i + 1);
    return { date: fmtDate(r.date), hcp: handicapFromDiffs(upTo) };
  });

  function logRound(course, score, rating, slope, meta) {
    const id = Date.now();
    const playedDate = meta?.datePlayed || new Date().toISOString().slice(0, 10);
    const r = {
      id,
      date: playedDate,
      course,
      score: Number(score),
      rating: Number(rating),
      slope: Number(slope),
      method: meta?.method,
      holes: meta?.holes,
      tee: meta?.tee || null,
      yardage: meta?.yardage || null,
      startHole: meta?.startHole || 1,
    };
    setRounds((prev) => [...prev, r]);
    if (meta?.shareToFeed) {
      // Backdated rounds should show up at the right spot in the feed (and
      // read as "3d" instead of "0h"), so anchor the post's timestamp to the
      // played date rather than always using right-now — but only when the
      // round was actually played on an earlier day. Forcing today's rounds
      // to noon regardless of when they're actually posted would sort them
      // below any post made later in the same day, even though this one is
      // the newest.
      const isToday = !meta?.datePlayed || meta.datePlayed === new Date().toISOString().slice(0, 10);
      const postTime = isToday ? new Date().toISOString() : new Date(meta.datePlayed + "T12:00:00").toISOString();
      updatePosts((prev) => [
        {
          id: "round-" + id,
          kind: "round",
          author: myName,
          initials: myInitials,
          round: r,
          time: postTime,
          likedBy: [],
          images: meta?.images || [],
          text: meta?.caption || "",
          comments: [],
        },
        ...prev,
      ]);
    }
    setShowLogForm(false);
  }

  function addPost(kind, text, images) {
    const id = "post-" + Date.now();
    updatePosts((prev) => [
      { id, kind, author: myName, initials: myInitials, text, time: new Date().toISOString(), likedBy: [], images: images || [], comments: [] },
      ...prev,
    ]);
    setShowComposer(false);
  }

  const recentEditsRef = useRef({});
  function markRecentEdit(kind, id) {
    recentEditsRef.current[`${kind}:${id}`] = Date.now();
  }
  function isRecentEdit(kind, id) {
    const t = recentEditsRef.current[`${kind}:${id}`];
    return t != null && Date.now() - t < 8000;
  }

  function toggleLike(id) {
    markRecentEdit("posts", id);
    updatePosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const likedBy = p.likedBy || [];
        const alreadyLiked = likedBy.includes(myName);
        const likedAt = p.likedAt || {};
        return {
          ...p,
          likedBy: alreadyLiked ? likedBy.filter((n) => n !== myName) : [...likedBy, myName],
          // Kept separate from likedBy (rather than switching it to an array of
          // {name, time} objects) so every existing likedBy.includes/.filter/.map
          // call site — used all over the feed/likers UI — didn't need touching.
          likedAt: alreadyLiked ? likedAt : { ...likedAt, [myName]: new Date().toISOString() },
        };
      })
    );
  }

  function deletePost(id) {
    markRecentEdit("posts", id);
    updatePosts((prev) => prev.filter((p) => p.id !== id));
  }

  function addComment(postId, text) {
    if (!text.trim()) return;
    markRecentEdit("posts", postId);
    updatePosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { id: "c-" + Date.now(), author: myName, text: text.trim(), time: new Date().toISOString() }] }
          : p
      )
    );
  }

  function toggleRequest(id) {
    setRequested((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleFollow(targetName) {
    setFollows((prev) => {
      const mine = { ...(prev[myName] || {}) };
      if (mine[targetName]) {
        delete mine[targetName];
      } else {
        mine[targetName] = new Date().toISOString();
      }
      const next = { ...prev, [myName]: mine };
      saveShared(STORAGE_KEYS.follows, next);
      return next;
    });
  }

  function respondToInbox(reqId, accept) {
    setInbox((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: accept ? "accepted" : "declined" } : r)));
    if (accept) {
      const req = inbox.find((r) => r.id === reqId);
      const g = golfers.find((g) => g.id === req?.golferId);
      if (g) {
        updatePosts((prev) => [
          {
            id: "match-" + reqId,
            kind: "match",
            author: myName,
            initials: myInitials,
            text: `Match confirmed with ${g.name}. See you on the course!`,
            time: new Date().toISOString(),
            likedBy: [],
            images: [],
            comments: [],
          },
          ...prev,
        ]);
      }
    }
  }

  function connectGhin(number, handicap) {
    setGhinNumber(number.trim());
    setGhinHandicap(handicap.trim());
    setGhinStatus("connected");
    setShowGhinModal(false);
  }

  const filteredGolfers = golfers.filter((g) => {
    const withinDistance = g.distance <= maxDistance;
    const withinHandicap = currentHandicap == null || Math.abs(g.handicap - currentHandicap) <= handSpread;
    return withinDistance && withinHandicap;
  });

  const feedPosts = [...posts].sort((a, b) => new Date(b.time) - new Date(a.time));

  // Search finds people, not feed/match content — every account publishes a
  // `profiles` entry as soon as they sign in (see the effect that saves
  // your own snapshot), so this doubles as a full user directory. Group
  // search lives separately, inside the Social tab's Groups sub-tab.
  const q = searchQuery.trim().toLowerCase();
  const userSearchResults = !q ? [] : Object.keys(profiles).filter((n) => n !== myName && n.toLowerCase().includes(q));

  const pendingCount = inbox.filter((r) => r.status === "pending").length;

  const myFollowing = Object.keys(follows[myName] || {});
  const myFollowers = Object.keys(follows).filter((n) => n !== myName && follows[n]?.[myName]);

  // Golf-clap, comment, and follow notifications, derived from the feed +
  // follows data rather than a separate stored notifications table —
  // anyone who claps/comments on one of my posts, or starts following me,
  // shows up here, sorted by when it actually happened. Likes/comments made
  // before timestamps were added fall back to the post's own time so old
  // data doesn't crash.
  const activityNotifications = useMemo(() => {
    if (!myName) return [];
    const items = [];
    for (const p of feedPosts) {
      if (p.author !== myName) continue;
      for (const liker of p.likedBy || []) {
        if (liker === myName) continue;
        items.push({ id: `like:${p.id}:${liker}`, type: "like", postId: p.id, actor: liker, time: p.likedAt?.[liker] || p.time });
      }
      for (const c of p.comments || []) {
        if (c.author === myName) continue;
        items.push({ id: `comment:${p.id}:${c.id}`, type: "comment", postId: p.id, actor: c.author, text: c.text, time: c.time || p.time });
      }
    }
    for (const [follower, followingMap] of Object.entries(follows)) {
      if (follower === myName) continue;
      const followedAt = followingMap?.[myName];
      if (followedAt) items.push({ id: `follow:${follower}`, type: "follow", actor: follower, time: followedAt });
    }
    for (const g of groups) {
      if (g.createdBy !== myName) continue;
      for (const [requester, requestedAt] of Object.entries(g.pendingRequests || {})) {
        items.push({ id: `grouprequest:${g.id}:${requester}`, type: "group_request", groupId: g.id, groupName: g.name, actor: requester, time: requestedAt });
      }
    }
    items.sort((a, b) => new Date(b.time) - new Date(a.time));
    return items;
  }, [feedPosts, follows, groups, myName]);
  const unseenActivityCount = activityNotifications.filter((n) => !seenActivityIds.includes(n.id)).length;

  function openInbox() {
    setShowInbox(true);
  }

  // Only the notification actually tapped is marked read — opening the
  // inbox to glance at it no longer silently clears the whole badge.
  function markActivitySeen(id) {
    setSeenActivityIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      savePersonal("sticktalk:seen-notifications", next);
      return next;
    });
  }

  if (session === undefined || (session && (!dataLoaded || !nameLoaded))) {
    return (
      <div style={{ ...styles.app, alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.loadingSpinner} />
      </div>
    );
  }

  if (!session) {
    return <AuthGate />;
  }

  if (!myName) {
    return <NameGate onSubmit={saveMyName} />;
  }

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        input { font-family: inherit; }
        ::-webkit-scrollbar { display: none; }
        button:focus-visible, input:focus-visible, textarea:focus-visible, a:focus-visible, select:focus-visible {
          outline: 2px solid #74C69D;
          outline-offset: 2px;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes menuIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        button:not(:disabled):active {
          transform: scale(0.97);
          transition: transform 140ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <header style={styles.header}>
        <div style={styles.headerTexture} />
        {showSearch ? (
          <div style={styles.headerSearchRow}>
            <button style={styles.headerIconBtn} onClick={() => { setShowSearch(false); setSearchQuery(""); }} aria-label="Close search">
              <ChevronLeft size={20} color="#FFFFFF" />
            </button>
            <input
              style={styles.headerSearchInput}
              placeholder="Search people…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        ) : (
          <div style={styles.headerRow}>
            <div style={styles.headerSide}>
              <button style={styles.headerAvatarBtn} onClick={() => openProfile(myName)} aria-label="View your profile">
                <Avatar photo={myPhoto} name={myName} style={styles.avatarSm} />
              </button>
              <div style={styles.teesBadge}>
                <TeeIcon size={11} />
                <span style={styles.teesBadgeText}>{myTees.toLocaleString()}</span>
              </div>
            </div>
            <span style={styles.headerTitle}>
              {tab === "home" && <StickTalkWordmark />}
              {tab === "match" && (matchSubTab === "groups" ? "Groups" : "Matches")}
              {tab === "gps" && "GPS"}
              {tab === "profile" && "Profile"}
            </span>
            <div style={{ ...styles.headerSide, justifyContent: "flex-end" }}>
              {(tab === "home" || tab === "match") && (
                <button style={styles.headerIconBtn} onClick={() => setShowSearch(true)} aria-label="Search">
                  <Search size={19} color="#FFFFFF" />
                </button>
              )}
              <button style={styles.headerIconBtn} onClick={openInbox} aria-label="Notifications">
                <Bell size={19} color="#FFFFFF" />
                {pendingCount + unseenActivityCount > 0 && <span style={styles.inboxBadge}>{pendingCount + unseenActivityCount}</span>}
              </button>
            </div>
          </div>
        )}
      </header>

      <main style={styles.main}>
        {showSearch && searchQuery.trim() ? (
          <UserSearchResults
            results={userSearchResults}
            profiles={profiles}
            myName={myName}
            myFollowing={follows[myName] || {}}
            onToggleFollow={toggleFollow}
            onOpenProfile={(name) => {
              setShowSearch(false);
              setSearchQuery("");
              openProfile(name);
            }}
          />
        ) : (
          <>
        {tab === "home" && (
          <HomeTab
            posts={feedPosts}
            onLike={toggleLike}
            onDelete={deletePost}
            myName={myName}
            myInitials={myInitials}
            onOpenComposer={() => setShowComposer(true)}
            onOpenComments={(postId) => setCommentsFor(postId)}
            onOpenLikers={(postId) => setLikersFor(postId)}
            onOpenPost={(postId) => setViewingPost(postId)}
            onOpenProfile={openProfile}
            rounds={rounds}
            onPostScore={() => setShowLogForm(true)}
            profiles={profiles}
            myPhoto={myPhoto}
          />
        )}
        {tab === "match" && (
          <div style={{ padding: "18px 16px 0" }}>
            <div style={{ ...styles.toggleRow, marginBottom: 0 }}>
              <button
                style={{ ...styles.toggleChip, ...(matchSubTab === "matches" ? styles.toggleChipActive : {}) }}
                onClick={() => setMatchSubTab("matches")}
              >
                Matches
              </button>
              <button
                style={{ ...styles.toggleChip, ...(matchSubTab === "groups" ? styles.toggleChipActive : {}) }}
                onClick={() => setMatchSubTab("groups")}
              >
                Groups
              </button>
            </div>
          </div>
        )}
        {tab === "match" && matchSubTab === "matches" && (
          <MatchTab
            matches={matches}
            myName={myName}
            onOpenComposer={() => setShowMatchComposer(true)}
            onToggleJoin={toggleJoinMatch}
            onDelete={deleteMatch}
            onOpenProfile={openProfile}
            filteredGolfers={filteredGolfers}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
            handSpread={handSpread}
            setHandSpread={setHandSpread}
            requested={requested}
            onToggleRequest={toggleRequest}
          />
        )}
        {tab === "match" && matchSubTab === "groups" && (
          <GroupsTab
            groups={groups}
            myName={myName}
            profiles={profiles}
            onCreateGroup={() => setShowCreateGroup(true)}
            onOpenGroup={(id) => setViewingGroup(id)}
          />
        )}
        {tab === "gps" && <GpsTab />}
        {tab === "profile" && (
          <ProfileTab
            myName={myName}
            myInitials={myInitials}
            currentHandicap={currentHandicap}
            avgScore={avgScore}
            bestRound={bestRound}
            roundsCount={rounds.length}
            ghinStatus={ghinStatus}
            ghinNumber={ghinNumber}
            ghinHandicap={ghinHandicap}
            onConnectGhin={() => setShowGhinModal(true)}
            homeCourse={homeCourse}
            onSaveHomeCourse={saveMyHomeCourse}
            trendData={trendData}
            onLogOut={logOut}
            myPhoto={myPhoto}
            onSavePhoto={saveMyPhoto}
            followers={myFollowers}
            following={myFollowing}
            profiles={profiles}
            myFollowingMap={follows[myName] || {}}
            onToggleFollow={toggleFollow}
            onOpenProfile={openProfile}
          />
        )}
          </>
        )}
      </main>

      <nav style={styles.nav}>
        <NavBtn icon={Landmark} label="Clubhouse" active={tab === "home"} onClick={() => setTab("home")} />
        <NavBtn icon={Users} label="Social" active={tab === "match"} onClick={() => setTab("match")} />
        <CenterNavBtn onClick={() => setShowLogForm(true)} />
        <NavBtn icon={Navigation} label="GPS" active={tab === "gps"} onClick={() => setTab("gps")} />
        <NavBtn icon={User} label="Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
      </nav>

      {showLogForm && (
        <LogRoundModal onClose={() => setShowLogForm(false)} onSubmit={logRound} />
      )}

      {showGhinModal && (
        <GhinModal
          initialNumber={ghinNumber}
          initialHandicap={ghinHandicap}
          onClose={() => setShowGhinModal(false)}
          onSave={connectGhin}
        />
      )}

      {showInbox && (
        <InboxModal
          inbox={inbox}
          activity={activityNotifications}
          seenActivityIds={seenActivityIds}
          golfers={golfers}
          myFollowing={follows[myName] || {}}
          onClose={() => setShowInbox(false)}
          onRespond={respondToInbox}
          onFollowBack={(name) => toggleFollow(name)}
          onOpenPost={(postId, notificationId) => {
            markActivitySeen(notificationId);
            setShowInbox(false);
            setViewingPost(postId);
          }}
          onOpenProfile={(name, notificationId) => {
            markActivitySeen(notificationId);
            setShowInbox(false);
            openProfile(name);
          }}
          onRespondGroupRequest={(groupId, name, accept, notificationId) => {
            markActivitySeen(notificationId);
            respondToGroupRequest(groupId, name, accept);
          }}
        />
      )}

      {showComposer && <ComposerModal onClose={() => setShowComposer(false)} onSubmit={addPost} />}

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} onSubmit={createGroup} />}

      {viewingGroup && (groups.find((g) => g.id === viewingGroup)?.members || []).includes(myName) && (
        <GroupChatModal
          group={groups.find((g) => g.id === viewingGroup)}
          myName={myName}
          profiles={profiles}
          onClose={() => setViewingGroup(null)}
          onSend={(text) => sendGroupMessage(viewingGroup, text)}
          onLeave={() => leaveGroup(viewingGroup)}
          onDelete={() => deleteGroup(viewingGroup)}
          onRespondRequest={respondToGroupRequest}
          onOpenProfile={(name) => {
            setViewingGroup(null);
            openProfile(name);
          }}
        />
      )}

      {viewingGroup && !(groups.find((g) => g.id === viewingGroup)?.members || []).includes(myName) && (
        <GroupDetailModal
          group={groups.find((g) => g.id === viewingGroup)}
          myName={myName}
          profiles={profiles}
          onClose={() => setViewingGroup(null)}
          onRequestJoin={requestToJoinGroup}
          onCancelRequest={cancelJoinRequest}
          onLeave={leaveGroup}
          onRespondRequest={respondToGroupRequest}
          onDelete={deleteGroup}
          onOpenProfile={(name) => {
            setViewingGroup(null);
            openProfile(name);
          }}
        />
      )}

      {commentsFor && (
        <CommentsModal
          post={posts.find((p) => p.id === commentsFor)}
          onClose={() => setCommentsFor(null)}
          onAddComment={(text) => addComment(commentsFor, text)}
          onOpenProfile={openProfile}
        />
      )}

      {likersFor && (
        <LikersModal
          post={posts.find((p) => p.id === likersFor)}
          onClose={() => setLikersFor(null)}
          onOpenProfile={(name) => {
            setLikersFor(null);
            openProfile(name);
          }}
        />
      )}

      {viewingPost && (
        <PostViewerModal
          post={posts.find((p) => p.id === viewingPost)}
          onClose={() => setViewingPost(null)}
          onLike={toggleLike}
          onOpenComments={(postId) => {
            setViewingPost(null);
            setCommentsFor(postId);
          }}
          onOpenLikers={(postId) => {
            setViewingPost(null);
            setLikersFor(postId);
          }}
          onOpenProfile={(name) => {
            setViewingPost(null);
            openProfile(name);
          }}
          onDelete={deletePost}
          myName={myName}
          profiles={profiles}
        />
      )}

      {viewingProfile && (
        <ProfileViewModal
          name={viewingProfile}
          profile={profiles[viewingProfile]}
          isMine={viewingProfile === myName}
          isFollowing={!!(follows[myName] || {})[viewingProfile]}
          onToggleFollow={() => toggleFollow(viewingProfile)}
          followers={Object.keys(follows).filter((n) => n !== viewingProfile && follows[n]?.[viewingProfile])}
          following={Object.keys(follows[viewingProfile] || {})}
          profiles={profiles}
          myFollowingMap={follows[myName] || {}}
          myName={myName}
          onToggleFollowInList={toggleFollow}
          onOpenProfile={openProfile}
          onClose={() => setViewingProfile(null)}
        />
      )}

      {showMatchComposer && <MatchComposerModal onClose={() => setShowMatchComposer(false)} onSubmit={postMatch} />}
    </div>
  );
}

function CenterNavBtn({ onClick }) {
  return (
    <div style={styles.centerNavWrap}>
      <button onClick={onClick} style={styles.centerNavBtn} aria-label="Post score">
        <Flag size={22} color="#74C69D" strokeWidth={2.6} />
      </button>
      <span style={styles.centerNavLabel}>Post score</span>
    </div>
  );
}

function NavBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.navBtn, opacity: active ? 1 : 0.55 }}>
      <Icon size={20} color="#FFFFFF" strokeWidth={active ? 2.6 : 2} />
      <span style={{ ...styles.navLabel, fontWeight: active ? 700 : 500 }}>{label}</span>
      {active && <span style={styles.navDot} />}
    </button>
  );
}

function HomeTab({
  posts,
  onLike,
  onDelete,
  myName,
  myInitials,
  onOpenComposer,
  onOpenComments,
  onOpenLikers,
  onOpenProfile,
  onOpenPost,
  rounds,
  onPostScore,
  profiles,
  myPhoto,
}) {
  return (
    <div style={styles.tabPad}>
      <MonthlySnapshot rounds={rounds} onPostScore={onPostScore} />

      <div style={styles.sectionBreak} />

      <button style={styles.composerTrigger} onClick={onOpenComposer}>
        <Avatar photo={myPhoto} name={myName} style={styles.avatarSm} />
        <span style={styles.composerPlaceholder}>Talk some Stick.</span>
        <ImageIcon size={17} color="#74C69D" />
      </button>

      <div style={{ ...styles.sectionLabel, color: "#FFFFFF", fontSize: 14, marginLeft: 14 }}>Clubhouse feed</div>

      {posts.length === 0 && (
        <div style={{ ...styles.empty, color: "rgba(255,255,255,0.75)" }}>
          <p style={{ ...styles.emptyTitle, color: "#FFFFFF" }}>No posts yet</p>
          <p style={styles.emptyBody}>Tap Post score below, or share an update above.</p>
        </div>
      )}

      {posts.map((p) =>
        p.kind === "match" ? (
          <MatchConfirmedTile key={p.id} post={p} />
        ) : (
          <PostCard key={p.id} post={p} onLike={onLike} onOpenComments={onOpenComments} onOpenLikers={onOpenLikers} onDelete={onDelete} myName={myName} onOpenProfile={onOpenProfile} authorPhoto={profiles?.[p.author]?.photo} profiles={profiles} onOpenPost={onOpenPost} />
        )
      )}
    </div>
  );
}

// Handicap as of just before this calendar month started, vs. right now —
// the difference is this month's handicap movement. Returns null if there
// isn't enough round history from before this month to compare against.
function computeMonthHandicapChange(rounds) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const sorted = [...rounds].sort((a, b) => new Date(a.date) - new Date(b.date));
  const beforeMonth = sorted.filter((r) => new Date(r.date + "T00:00:00") < monthStart);

  if (!beforeMonth.length || !sorted.length) return null;

  const startHandicap = handicapFromDiffs(beforeMonth.map((r) => differential(r.score, r.rating, r.slope)));
  const currentHandicap = handicapFromDiffs(sorted.map((r) => differential(r.score, r.rating, r.slope)));
  if (startHandicap == null || currentHandicap == null) return null;
  return currentHandicap - startHandicap;
}

function MonthlySnapshot({ rounds, onPostScore }) {
  const now = new Date();
  const monthRounds = rounds.filter((r) => {
    const d = new Date(r.date + "T00:00:00");
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const monthBest = monthRounds.length ? Math.min(...monthRounds.map((r) => r.score)) : null;
  const hcpChange = computeMonthHandicapChange(rounds);

  // Only treat a move bigger than 1.0 as a real change — anything smaller
  // reads as "holding steady" rather than a meaningful swing either way.
  let hcpDisplay;
  if (hcpChange == null) {
    hcpDisplay = { icon: Minus, color: "#9C9990", text: "" };
  } else if (Math.abs(hcpChange) <= 1.0) {
    hcpDisplay = { icon: Minus, color: "#74C69D", text: "" };
  } else if (hcpChange < 0) {
    hcpDisplay = { icon: TrendingUp, color: "#74C69D", text: Math.abs(hcpChange).toFixed(1) };
  } else {
    hcpDisplay = { icon: TrendingDown, color: "#C1443A", text: Math.abs(hcpChange).toFixed(1) };
  }

  return (
    <div style={styles.snapshotCard}>
      <div style={styles.snapshotHeadRow}>
        <span style={styles.snapshotEyebrow}>Your monthly snapshot</span>
      </div>
      <div style={styles.snapshotRow}>
        <div style={styles.snapshotCol}>
          <div style={styles.snapshotLabel}>Rounds Played</div>
          <div style={styles.snapshotValue}>{monthRounds.length}</div>
        </div>
        <div style={styles.snapshotCol}>
          <div style={styles.snapshotLabel}>Best Score</div>
          <div style={{ ...styles.snapshotValue, display: "flex", alignItems: "center" }}>
            {monthBest != null ? monthBest : <Minus size={16} color="#9C9990" strokeWidth={3} />}
          </div>
        </div>
        <div style={styles.snapshotCol}>
          <div style={styles.snapshotLabel}>Handicap Change</div>
          <div style={{ ...styles.snapshotValue, color: hcpDisplay.color, display: "flex", alignItems: "center", gap: 4 }}>
            <hcpDisplay.icon size={16} color={hcpDisplay.color} strokeWidth={3} />
            {hcpDisplay.text}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchConfirmedTile({ post }) {
  return (
    <div style={styles.matchConfirmedTile}>
      <div style={styles.matchConfirmedIconWrap}>
        <Check size={14} color="#000000" strokeWidth={3} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={styles.matchConfirmedText}>{post.text}</div>
        <div style={styles.matchConfirmedMeta}>{timeAgo(post.time)}</div>
      </div>
    </div>
  );
}

// A round's scorecard plus any photos, as one swipeable strip when there's
// more than one item — dot indicators replace the native scrollbar, and
// scrolling is locked to horizontal so a vertical swipe on mobile scrolls the
// feed instead of fighting with the carousel.
// Fullscreen post viewer: media gets a bounded height instead of stretching
// to fill the whole screen, so author/actions/reply sit below it in normal
// document flow (Twitter-style) rather than floating on top of the image.
const MEDIA_LARGE_HEIGHT = "64vh";

// Fixed box height (px) shared by every scorecard and photo in the feed.
// A measured replica of the scorecard's markup comes out to ~424px tall —
// 440 gives a modest ~16px of headroom without leaving visible dead space
// at the bottom of the card. Re-measure if the scorecard's internal
// spacing changes again. Deliberately a hardcoded constant, not a live
// measurement — it should never shift based on content.
const MEDIA_BOX_HEIGHT = 440;

function PostMedia({ post: p, large, onOpen }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const scrollRef = useRef(null);
  const pinchRef = useRef(null); // { startDist, startZoom } while 2 fingers are down
  const dragRef = useRef(null); // { startX, startY, startPanX, startPanY } while panning a zoomed image
  const images = p.images || [];
  const hasScorecard = p.kind === "round";
  const itemCount = (hasScorecard ? 1 : 0) + images.length;
  const photoAlt = p.kind === "round" ? `${p.author}'s round at ${p.round.course}` : `Photo shared by ${p.author}`;

  // Zoom is local to whichever item is currently on screen — reset it
  // whenever the user swipes to a different photo/scorecard.
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [active]);

  if (itemCount === 0) return null;

  function pinchDistance(touches) {
    const [a, b] = touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function resetZoom() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  // Real two-finger pinch-to-zoom on the media itself, with single-finger
  // pan once zoomed in. touchAction "none" + preventDefault keep the
  // gesture entirely local to this box — it never bubbles up to the
  // browser's native page pinch-zoom (which would otherwise scale the
  // whole screen, comments/actions included) or to any scrollable ancestor.
  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      pinchRef.current = { startDist: pinchDistance(e.touches), startZoom: zoom };
    } else if (e.touches.length === 1 && zoom > 1) {
      dragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, startPanX: pan.x, startPanY: pan.y };
    }
  }
  function handleTouchMove(e) {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const scale = pinchRef.current.startZoom * (pinchDistance(e.touches) / pinchRef.current.startDist);
      setZoom(Math.max(1, Math.min(4, scale)));
    } else if (e.touches.length === 1 && dragRef.current) {
      e.preventDefault();
      setPan({
        x: dragRef.current.startPanX + (e.touches[0].clientX - dragRef.current.startX),
        y: dragRef.current.startPanY + (e.touches[0].clientY - dragRef.current.startY),
      });
    }
  }
  function handleTouchEnd(e) {
    if (e.touches.length < 2) pinchRef.current = null;
    if (e.touches.length < 1) dragRef.current = null;
    setZoom((z) => (z < 1.05 ? (setPan({ x: 0, y: 0 }), 1) : z));
  }

  const boxStyle = large
    ? { width: "100%", height: "100%", overflow: "hidden", touchAction: "none" }
    : { width: "100%", height: MEDIA_BOX_HEIGHT, overflow: "hidden" };
  // In the fullscreen viewer the media gets a bounded height (not the whole
  // screen) so the author/actions/reply bar below it sit in normal document
  // flow instead of floating on top of the image.
  const wrapStyle = large ? { width: "100%", height: MEDIA_LARGE_HEIGHT, display: "flex", flexDirection: "column", margin: 0, flexShrink: 0 } : undefined;
  const isGesturing = pinchRef.current || dragRef.current;

  function Item({ children }) {
    if (!large) {
      return (
        <div style={boxStyle} onClick={onOpen}>
          {children}
        </div>
      );
    }
    return (
      <div
        style={boxStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => zoom > 1 && resetZoom()}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isGesturing ? "none" : "transform 0.2s cubic-bezier(0.77, 0, 0.175, 1)",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  if (itemCount === 1) {
    if (hasScorecard) {
      if (!large) {
        // Feed card: fixed-height box, tapping opens the fullscreen viewer.
        return (
          <div style={styles.postScorecardWrap}>
            <Item>
              <Scorecard round={p.round} />
            </Item>
          </div>
        );
      }
      // Fullscreen viewer: scorecards aren't zoomable and don't need the
      // fixed-height box — they render at their natural height so nothing
      // is ever clipped; the body content below just scrolls independently
      // if it runs long.
      return (
        <div style={styles.postScorecardWrapLarge}>
          <Scorecard round={p.round} large />
        </div>
      );
    }
    return (
      <div style={{ ...styles.postImageWrap, ...wrapStyle }}>
        <Item>
          <PhotoTile src={images[0]} style={{ width: "100%", height: large ? "100%" : MEDIA_BOX_HEIGHT, objectFit: large ? "contain" : "cover", borderRadius: large ? 0 : 18, border: large ? "none" : "1.5px solid #74C69D" }} alt={photoAlt} />
        </Item>
      </div>
    );
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(itemCount - 1, i)));
  }

  return (
    <div style={wrapStyle}>
      <div ref={scrollRef} style={{ ...styles.postMediaScroll, ...(large ? { height: MEDIA_LARGE_HEIGHT } : { height: MEDIA_BOX_HEIGHT }) }} onScroll={handleScroll}>
        {hasScorecard && (
          <div style={{ ...styles.postMediaScrollItem, height: large ? "100%" : MEDIA_BOX_HEIGHT }}>
            <Item>
              <Scorecard round={p.round} large={large} />
            </Item>
          </div>
        )}
        {images.map((src, i) => (
          <div key={i} style={{ ...styles.postMediaScrollItem, height: large ? "100%" : MEDIA_BOX_HEIGHT }}>
            <Item>
              <PhotoTile src={src} style={{ width: "100%", height: large ? "100%" : MEDIA_BOX_HEIGHT, objectFit: large ? "contain" : "cover", borderRadius: large ? 0 : 18, border: large ? "none" : "1.5px solid #74C69D" }} alt={`${photoAlt} (${i + 1}/${images.length})`} />
            </Item>
          </div>
        ))}
      </div>
      <div style={styles.postMediaDots}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <span key={i} style={{ ...styles.postMediaDot, background: i === active ? "#74C69D" : "#4A4844" }} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post: p, onLike, onOpenComments, onOpenLikers, onDelete, myName, onOpenProfile, authorPhoto, profiles, onOpenPost }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const previewComments = p.comments.slice(-2);
  const isMine = p.author === myName;
  const likedBy = p.likedBy || [];
  const iLiked = likedBy.includes(myName);

  function handleShare() {
    const summary =
      p.kind === "round"
        ? `${p.author} shot ${p.round.score} at ${p.round.course} on Stick Talk`
        : `${p.author} on Stick Talk: ${p.text}`;
    if (navigator.share) {
      navigator.share({ text: summary }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(summary).catch(() => {});
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardTopRow}>
        <button style={styles.postAuthorBtn} onClick={() => onOpenProfile(p.author)}>
          <Avatar photo={authorPhoto} name={p.author} style={styles.postAvatar} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={styles.cardName}>{p.author}</div>
            <div style={styles.cardMeta}>
              {p.kind === "round" ? (
                <>
                  <MapPin size={12} color="#9C9990" /> {p.round.course} · {timeAgo(p.time)}
                </>
              ) : (
                <>{timeAgo(p.time)}</>
              )}
            </div>
          </div>
        </button>
        {isMine && (
          <div style={{ position: "relative" }}>
            <button style={styles.kebabBtn} onClick={() => setMenuOpen((o) => !o)} aria-label="Post options">
              <MoreHorizontal size={20} color="#6B6963" />
            </button>
            {menuOpen && (
              <>
                <button style={styles.menuBackdrop} onClick={() => setMenuOpen(false)} aria-label="Close menu" />
                <div style={styles.postMenu}>
                  <button
                    style={styles.postMenuDeleteItem}
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(p.id);
                    }}
                  >
                    <Trash2 size={14} color="#C1443A" /> Delete post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {!isMine && <MoreHorizontal size={20} color="#6B6963" />}
      </div>

      {p.text && <div style={styles.noteText}>{p.text}</div>}

      <PostMedia post={p} onOpen={() => onOpenPost(p.id)} />

      {likedBy.length === 0 ? (
        <div style={styles.socialLine}>Be the first to give a golf clap!</div>
      ) : (
        <button style={styles.likersRow} onClick={() => onOpenLikers(p.id)}>
          <div style={styles.likersStack}>
            {likedBy.slice(0, 4).map((name, i) => (
              <Avatar
                key={name}
                photo={profiles?.[name]?.photo}
                name={name}
                style={{ ...styles.likersAvatar, marginLeft: i === 0 ? 0 : -8, zIndex: 4 - i }}
              />
            ))}
          </div>
          <span style={styles.likersCountText}>
            {likedBy.length} gave {likedBy.length === 1 ? "a golf clap" : "golf claps"}
          </span>
        </button>
      )}

      <div style={styles.cardActions}>
        <button style={styles.actionBtnFull} onClick={() => onLike(p.id)} aria-label="Golf clap">
          <span
            style={{ fontSize: 21, lineHeight: 1, ...golfClapIconStyle(iLiked) }}
          >
            👏
          </span>
        </button>
        <button style={styles.actionBtnFull} onClick={() => onOpenComments(p.id)} aria-label="Comment">
          <MessageCircle size={21} color="#9C9990" />
        </button>
        <button style={styles.actionBtnFull} onClick={handleShare} aria-label="Share">
          <Share2 size={20} color="#9C9990" />
        </button>
      </div>

      {previewComments.length > 0 && (
        <div style={styles.commentPreviewWrap}>
          {previewComments.map((c) => (
            <div key={c.id} style={styles.commentPreviewLine}>
              <span style={styles.commentPreviewAuthor}>{c.author}</span> {c.text}
            </div>
          ))}
          {p.comments.length > 2 && (
            <button style={styles.viewAllComments} onClick={() => onOpenComments(p.id)}>
              View all {p.comments.length} comments
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Full-screen "zoomed in" view of a single post, laid out like X/Twitter's
// tweet detail screen: a plain top bar, the media at a bounded height (not
// full-bleed), then author/caption/actions/reply stacked below it in normal
// document flow — so zooming the media only scales the media, nothing below
// it shifts, and the whole thing scrolls together if content runs long.
function PostViewerModal({ post: p, onClose, onLike, onOpenComments, onOpenLikers, onOpenProfile, onDelete, myName, profiles }) {
  const [menuOpen, setMenuOpen] = useState(false);
  if (!p) return null;
  const likedBy = p.likedBy || [];
  const iLiked = likedBy.includes(myName);
  const isMine = p.author === myName;
  const authorPhoto = profiles?.[p.author]?.photo;

  function handleShare() {
    const summary =
      p.kind === "round"
        ? `${p.author} shot ${p.round.score} at ${p.round.course} on Stick Talk`
        : `${p.author} on Stick Talk: ${p.text}`;
    if (navigator.share) {
      navigator.share({ text: summary }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(summary).catch(() => {});
    }
  }

  return (
    <div style={styles.postViewerOverlay}>
      <div style={styles.postViewerTop}>
        <button style={styles.postViewerIconBtn} onClick={onClose} aria-label="Back">
          <ChevronLeft size={22} color="#FFFFFF" />
        </button>
        {isMine ? (
          <div style={{ position: "relative" }}>
            <button style={styles.postViewerIconBtn} onClick={() => setMenuOpen((o) => !o)} aria-label="Post options">
              <MoreHorizontal size={20} color="#FFFFFF" />
            </button>
            {menuOpen && (
              <>
                <button style={styles.menuBackdrop} onClick={() => setMenuOpen(false)} aria-label="Close menu" />
                <div style={styles.postMenu}>
                  <button
                    style={styles.postMenuDeleteItem}
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(p.id);
                      onClose();
                    }}
                  >
                    <Trash2 size={14} color="#C1443A" /> Delete post
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <span />
        )}
      </div>

      <div style={styles.postViewerMediaWrap}>
        <PostMedia post={p} large />
      </div>

      <div style={styles.postViewerBody}>
          <button style={styles.postViewerAuthorRow} onClick={() => onOpenProfile(p.author)}>
            <Avatar photo={authorPhoto} name={p.author} style={{ ...styles.postAvatar, width: 40, height: 40 }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ ...styles.cardName, color: "#FFFFFF" }}>{p.author}</div>
              <div style={styles.cardMeta}>
                {p.kind === "round" ? (
                  <>
                    <MapPin size={12} color="#9C9990" /> {p.round.course} · {timeAgo(p.time)}
                  </>
                ) : (
                  <>{timeAgo(p.time)}</>
                )}
              </div>
            </div>
          </button>

          {p.text && <div style={{ ...styles.noteText, color: "#FFFFFF", padding: "0 16px", marginTop: 10 }}>{p.text}</div>}

          <div style={styles.postViewerDivider} />

          <div style={styles.postViewerActionRow}>
            <button style={styles.postViewerAction} onClick={() => onLike(p.id)} aria-label="Golf clap">
              <span style={{ fontSize: 19, lineHeight: 1, ...golfClapIconStyle(iLiked) }}>👏</span>
              {likedBy.length > 0 && <span>{likedBy.length}</span>}
            </button>
            <button style={styles.postViewerAction} onClick={() => onOpenComments(p.id)} aria-label="Comment">
              <MessageCircle size={19} color="#9C9990" />
              {p.comments.length > 0 && <span>{p.comments.length}</span>}
            </button>
            <button style={styles.postViewerAction} onClick={handleShare} aria-label="Share">
              <Share2 size={17} color="#9C9990" />
            </button>
            {likedBy.length > 0 && (
              <button style={{ ...styles.postViewerAction, marginLeft: "auto" }} onClick={() => onOpenLikers(p.id)} aria-label="See who gave a golf clap">
                <div style={styles.likersStack}>
                  {likedBy.slice(0, 3).map((name, i) => (
                    <Avatar
                      key={name}
                      photo={profiles?.[name]?.photo}
                      name={name}
                      style={{ ...styles.likersAvatar, width: 18, height: 18, fontSize: 7.5, marginLeft: i === 0 ? 0 : -6, zIndex: 3 - i }}
                    />
                  ))}
                </div>
              </button>
            )}
          </div>

          <div style={styles.postViewerDivider} />

          <button style={styles.postViewerReplyBar} onClick={() => onOpenComments(p.id)}>
            Add a comment…
          </button>
      </div>
    </div>
  );
}

function ComposerModal({ onClose, onSubmit }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      setImage(await fileToSharedImage(file));
    } catch (err) {
      // ignore — upload failed, user can retry
    }
    setUploading(false);
  }

  const canPost = text.trim().length > 0 || image;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>Share an update</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        <textarea
          style={styles.composerTextarea}
          placeholder="Talk some Stick."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />

        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

        {image ? (
          <div style={styles.composerImageWrap}>
            <PhotoTile src={image} style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 12 }} alt="Photo preview" />
            <button style={styles.composerImageRemove} onClick={() => setImage(null)} aria-label="Remove photo">
              <Trash2 size={14} color="#FFFFFF" />
            </button>
          </div>
        ) : (
          <button style={styles.addPhotoBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Camera size={16} color="#74C69D" /> {uploading ? "Uploading…" : "Add a photo"}
          </button>
        )}

        <button
          style={{ ...styles.logBtn, marginBottom: 0, opacity: canPost ? 1 : 0.5 }}
          disabled={!canPost}
          onClick={() => onSubmit("note", text, image ? [image] : [])}
        >
          Post
        </button>
      </div>
    </div>
  );
}

function CommentsModal({ post, onClose, onAddComment, onOpenProfile }) {
  const [text, setText] = useState("");
  if (!post) return null;

  function submit() {
    if (!text.trim()) return;
    onAddComment(text);
    setText("");
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxHeight: "78vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>Comments</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, marginBottom: 12 }}>
          {post.comments.length === 0 && (
            <div style={styles.empty}>
              <p style={styles.emptyTitle}>No comments yet</p>
              <p style={styles.emptyBody}>Be the first to say something.</p>
            </div>
          )}
          {post.comments.map((c) => (
            <button key={c.id} style={styles.commentRowBtn} onClick={() => onOpenProfile(c.author)}>
              <div style={styles.avatarSm}>{c.author.slice(0, 2).toUpperCase()}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.cardName}>{c.author}</div>
                <div style={styles.noteText}>{c.text}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={styles.commentInputRow}>
          <input
            style={{ ...styles.input, flex: 1, marginTop: 0 }}
            placeholder="Add a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button style={styles.commentSendBtn} onClick={submit} disabled={!text.trim()} aria-label="Send comment">
            <Send size={16} color="#000000" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LikersModal({ post, onClose, onOpenProfile }) {
  if (!post) return null;
  const likedBy = post.likedBy || [];

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxHeight: "78vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>Golf claps</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {likedBy.length === 0 && (
            <div style={styles.empty}>
              <p style={styles.emptyTitle}>No golf claps yet</p>
              <p style={styles.emptyBody}>Be the first to give one.</p>
            </div>
          )}
          {likedBy.map((name) => (
            <button key={name} style={styles.commentRowBtn} onClick={() => onOpenProfile(name)}>
              <div style={{ ...styles.avatarSm, background: colorForName(name) }}>{initialsOf(name)}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.cardName}>{name}</div>
              </div>
              <span style={{ fontSize: 18 }}>👏</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FollowListModal({ title, names, profiles, myFollowingMap, myName, onToggleFollow, onOpenProfile, onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxHeight: "78vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>{title}</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        {names.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyTitle}>{title === "Followers" ? "No followers yet" : "Not following anyone yet"}</p>
            <p style={styles.emptyBody}>
              {title === "Followers" ? "When someone follows you, they'll show up here." : "Search for people to follow them."}
            </p>
          </div>
        )}

        {names.map((name) => {
          const profile = profiles[name];
          const isFollowing = !!myFollowingMap[name];
          return (
            <div key={name} style={styles.followListRow}>
              <button style={styles.postAuthorBtn} onClick={() => onOpenProfile(name)}>
                <Avatar photo={profile?.photo} name={name} style={styles.postAvatar} />
                <div style={{ textAlign: "left" }}>
                  <div style={styles.cardName}>{name}</div>
                  {profile?.homeCourse && (
                    <div style={styles.cardMeta}>
                      <MapPin size={12} color="#9C9990" /> {profile.homeCourse}
                    </div>
                  )}
                </div>
              </button>
              {name !== myName && (
                <button
                  style={{ ...styles.followBackBtn, ...(isFollowing ? styles.followBackBtnDone : {}) }}
                  onClick={() => onToggleFollow(name)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UserSearchResults({ results, profiles, myFollowing, onToggleFollow, onOpenProfile }) {
  if (results.length === 0) {
    return (
      <div style={{ ...styles.empty, color: "rgba(255,255,255,0.75)" }}>
        <p style={{ ...styles.emptyTitle, color: "#FFFFFF" }}>No one found</p>
        <p style={styles.emptyBody}>Try a different name.</p>
      </div>
    );
  }
  return (
    <div style={styles.tabPad}>
      {results.map((name) => {
        const profile = profiles[name];
        const isFollowing = !!myFollowing[name];
        return (
          <div key={name} style={styles.rowCard}>
            <button style={styles.postAuthorBtn} onClick={() => onOpenProfile(name)}>
              <Avatar photo={profile?.photo} name={name} style={styles.postAvatar} />
              <div style={{ textAlign: "left" }}>
                <div style={styles.cardName}>{name}</div>
                {profile?.homeCourse && (
                  <div style={styles.cardMeta}>
                    <MapPin size={12} color="#9C9990" /> {profile.homeCourse}
                  </div>
                )}
              </div>
            </button>
            <button
              style={{ ...styles.followBackBtn, ...(isFollowing ? styles.followBackBtnDone : {}) }}
              onClick={() => onToggleFollow(name)}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ProfileViewModal({
  name,
  profile,
  isMine,
  isFollowing,
  onToggleFollow,
  followers = [],
  following = [],
  profiles = {},
  myFollowingMap = {},
  myName,
  onToggleFollowInList,
  onOpenProfile,
  onClose,
}) {
  const [followListView, setFollowListView] = useState(null); // "followers" | "following" | null
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>Profile</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        <div style={styles.profileViewHead}>
          <div style={styles.avatarRingSm}>
            <Avatar photo={profile?.photo} name={name} style={styles.avatarLg} />
          </div>
          <div style={styles.profileViewName}>
            {name} {isMine && <span style={styles.profileViewYouTag}>(you)</span>}
          </div>
          {profile?.homeCourse && (
            <div style={styles.profileViewCourse}>
              <MapPin size={12} color="#9C9990" /> {profile.homeCourse}
            </div>
          )}
          <div style={styles.followCountsRow}>
            <button style={styles.followCountsBtn} onClick={() => setFollowListView("followers")}>
              <span style={styles.followCountsNum}>{followers.length}</span> Followers
            </button>
            <button style={styles.followCountsBtn} onClick={() => setFollowListView("following")}>
              <span style={styles.followCountsNum}>{following.length}</span> Following
            </button>
          </div>
          {!isMine && (
            <button
              style={{ ...styles.followBtn, ...(isFollowing ? styles.followBtnDone : {}) }}
              onClick={onToggleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {followListView && (
          <FollowListModal
            title={followListView === "followers" ? "Followers" : "Following"}
            names={followListView === "followers" ? followers : following}
            profiles={profiles}
            myFollowingMap={myFollowingMap}
            myName={myName}
            onToggleFollow={onToggleFollowInList}
            onOpenProfile={(n) => {
              setFollowListView(null);
              onOpenProfile(n);
            }}
            onClose={() => setFollowListView(null)}
          />
        )}

        {profile ? (
          <>
            <div style={styles.profileViewStamp}>
              <Award size={14} color="#FFFFFF" />
              <div style={styles.profileViewStampLabel}>HANDICAP INDEX</div>
              <div style={styles.profileViewStampValue}>{profile.handicap != null ? profile.handicap.toFixed(1) : "—"}</div>
            </div>
            <div style={styles.statRow}>
              <Stat label="Rounds" value={profile.roundsCount ?? "—"} />
              <Stat label="Avg score" value={profile.avgScore ?? "—"} />
              <Stat label="Best round" value={profile.bestRound ?? "—"} accent />
            </div>
          </>
        ) : (
          <div style={styles.empty}>
            <p style={styles.emptyTitle}>No stats yet</p>
            <p style={styles.emptyBody}>{name} hasn't logged any rounds since joining.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GpsTab() {
  return (
    <div style={{ ...styles.tabPad, textAlign: "center", paddingTop: 50 }}>
      <div style={styles.gpsIconWrap}>
        <Navigation size={26} color="#000000" />
      </div>
      <p style={{ ...styles.emptyTitle, color: "#FFFFFF" }}>On-course GPS is coming soon</p>
      <p style={{ ...styles.emptyBody, color: "rgba(255,255,255,0.75)" }}>
        Live distances to front, center, and back of every green — pulled up automatically as you move around the course.
      </p>
      <div style={styles.gpsPreview}>
        <div style={styles.gpsPreviewRow}>
          <span>Front</span>
          <span style={styles.gpsPreviewNum}>142</span>
        </div>
        <div style={{ ...styles.gpsPreviewRow, borderTop: "1px solid rgba(255,255,255,0.10)", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          <span>Center</span>
          <span style={styles.gpsPreviewNum}>158</span>
        </div>
        <div style={styles.gpsPreviewRow}>
          <span>Back</span>
          <span style={styles.gpsPreviewNum}>171</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{ ...styles.statBox, borderColor: accent ? "#74C69D" : "#4A4844" }}>
      <div style={{ ...styles.statValue, color: accent ? "#74C69D" : "#FFFFFF" }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function MatchTab({
  matches,
  myName,
  onOpenComposer,
  onToggleJoin,
  onDelete,
  onOpenProfile,
  filteredGolfers,
  maxDistance,
  setMaxDistance,
  handSpread,
  setHandSpread,
  requested,
  onToggleRequest,
}) {
  const [view, setView] = useState("matches"); // "matches" | "golfers"
  const sorted = [...matches].sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div style={styles.tabPad}>
      <button style={styles.composerTrigger} onClick={onOpenComposer}>
        <div style={styles.avatarSm}>{initialsOf(myName)}</div>
        <span style={styles.composerPlaceholder}>Post a match — who's in?</span>
        <Plus size={17} color="#74C69D" />
      </button>

      <div style={styles.toggleRow}>
        <button
          style={{ ...styles.toggleChip, ...(view === "matches" ? styles.toggleChipActive : {}) }}
          onClick={() => setView("matches")}
        >
          Open matches
        </button>
        <button
          style={{ ...styles.toggleChip, ...(view === "golfers" ? styles.toggleChipActive : {}) }}
          onClick={() => setView("golfers")}
        >
          Find golfers
        </button>
      </div>

      {view === "matches" && (
        <>
          <div style={{ ...styles.sectionLabel, color: "#FFFFFF" }}>Open matches</div>

          {sorted.length === 0 && (
            <div style={{ ...styles.empty, color: "rgba(255,255,255,0.75)" }}>
              <p style={{ ...styles.emptyTitle, color: "#FFFFFF" }}>No open matches yet</p>
              <p style={styles.emptyBody}>Post one above — course, when, and how many spots you need.</p>
            </div>
          )}

          {sorted.map((m) => {
            const joinedBy = m.joinedBy || [];
            const isMine = m.author === myName;
            const iJoined = joinedBy.includes(myName);
            const full = joinedBy.length >= m.spots && !iJoined;
            return (
              <div key={m.id} style={styles.matchCard}>
                <button style={{ ...styles.postAuthorBtn, alignItems: "flex-start" }} onClick={() => onOpenProfile(m.author)}>
                  <div style={styles.avatarSm}>{m.authorInitials || initialsOf(m.author)}</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={styles.cardName}>{m.author}</div>
                    <div style={styles.cardMeta}>
                      <MapPin size={12} color="#9C9990" /> {m.course}
                    </div>
                    <div style={styles.availText}>{m.when}</div>
                    {m.note && <div style={{ ...styles.noteText, marginTop: 6 }}>{m.note}</div>}
                  </div>
                </button>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 8 }}>
                  <div style={styles.hcpChip}>{joinedBy.length}/{m.spots} in</div>
                  {isMine ? (
                    <button style={{ ...styles.reqBtn, background: "transparent", color: "#C1443A", borderColor: "#C1443A" }} onClick={() => onDelete(m.id)}>
                      Remove
                    </button>
                  ) : (
                    <button
                      style={{
                        ...styles.reqBtn,
                        background: iJoined ? "transparent" : full ? "transparent" : "#74C69D",
                        color: iJoined ? "#74C69D" : full ? "#6B6963" : "#1C1B1A",
                        borderColor: iJoined ? "#74C69D" : "#4A4844",
                        opacity: full ? 0.6 : 1,
                      }}
                      onClick={() => !full && onToggleJoin(m.id)}
                      disabled={full}
                    >
                      {iJoined ? "Joined ✓" : full ? "Full" : "I'm in"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {view === "golfers" && (
        <>
          <div style={styles.filterCard}>
            <div style={styles.filterHead}>
              <SlidersHorizontal size={14} color="#74C69D" /> Find golfers near you
            </div>
            <label style={styles.filterLabel}>
              Max distance: {maxDistance} mi
              <input
                style={styles.slider}
                type="range"
                min={1}
                max={25}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
              />
            </label>
            <label style={{ ...styles.filterLabel, marginBottom: 0 }}>
              Handicap range: ±{handSpread}
              <input
                style={styles.slider}
                type="range"
                min={1}
                max={15}
                value={handSpread}
                onChange={(e) => setHandSpread(Number(e.target.value))}
              />
            </label>
          </div>

          <div style={{ ...styles.sectionLabel, color: "#FFFFFF" }}>
            {filteredGolfers.length} golfer{filteredGolfers.length === 1 ? "" : "s"} nearby
          </div>

          {filteredGolfers.length === 0 && (
            <div style={{ ...styles.empty, color: "rgba(255,255,255,0.75)" }}>
              <p style={{ ...styles.emptyTitle, color: "#FFFFFF" }}>No golfers match your filters</p>
              <p style={styles.emptyBody}>Try widening your distance or handicap range above.</p>
            </div>
          )}

          {filteredGolfers.map((g) => (
            <div key={g.id} style={styles.rowCard}>
              <button style={{ ...styles.postAuthorBtn, flex: 1 }} onClick={() => onOpenProfile(g.name)}>
                <div style={styles.avatarSm}>{initialsOf(g.name)}</div>
                <div style={{ textAlign: "left" }}>
                  <div style={styles.cardName}>{g.name}</div>
                  <div style={styles.cardMeta}>
                    <MapPin size={12} color="#9C9990" /> {g.distance} mi · HCP {g.handicap.toFixed(1)}
                  </div>
                </div>
              </button>
              <button
                style={{
                  ...styles.reqBtn,
                  background: requested[g.id] ? "transparent" : "#74C69D",
                  color: requested[g.id] ? "#74C69D" : "#1C1B1A",
                  borderColor: "#74C69D",
                }}
                onClick={() => onToggleRequest(g.id)}
              >
                {requested[g.id] ? "Requested ✓" : "Request to play"}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function GroupsTab({ groups, myName, profiles, onCreateGroup, onOpenGroup }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = !q ? groups : groups.filter((g) => g.name.toLowerCase().includes(q));
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={styles.tabPad}>
      <button style={styles.composerTrigger} onClick={onCreateGroup}>
        <div style={styles.avatarSm}>{initialsOf(myName)}</div>
        <span style={styles.composerPlaceholder}>Create a group with your friends</span>
        <Plus size={17} color="#74C69D" />
      </button>

      <div style={styles.groupSearchWrap}>
        <Search size={15} color="#9C9990" />
        <input
          style={styles.groupSearchInput}
          placeholder="Search groups…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={{ ...styles.sectionLabel, color: "#FFFFFF" }}>{q ? "Results" : "Your groups"}</div>

      {sorted.length === 0 && (
        <div style={{ ...styles.empty, color: "rgba(255,255,255,0.75)" }}>
          <p style={{ ...styles.emptyTitle, color: "#FFFFFF" }}>{q ? "No groups found" : "No groups yet"}</p>
          <p style={styles.emptyBody}>{q ? "Try a different name." : "Start one above — round-trip buddies, weekend league, whoever."}</p>
        </div>
      )}

      {sorted.map((g) => {
        const members = g.members || [];
        const iJoined = members.includes(myName);
        const iRequested = !!(g.pendingRequests || {})[myName];
        return (
          <button key={g.id} style={styles.groupCard} onClick={() => onOpenGroup(g.id)}>
            <Avatar photo={g.photo} name={g.name} style={styles.postAvatar} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={styles.cardName}>{g.name}</div>
              <div style={styles.cardMeta}>
                <Users size={12} color="#9C9990" /> {members.length} {members.length === 1 ? "member" : "members"}
                {iJoined && <span style={styles.groupJoinedTag}>Joined</span>}
                {!iJoined && iRequested && <span style={{ ...styles.groupJoinedTag, color: "#9C9990" }}>Requested</span>}
              </div>
            </div>
            <ChevronRight size={16} color="#9C9990" />
          </button>
        );
      })}
    </div>
  );
}

function CreateGroupModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      setPhoto(await fileToSquareImage(file));
    } catch (err) {
      // upload failed — leave whatever photo state was there
    }
    setUploading(false);
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>Create a group</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        <button style={{ ...styles.avatarEditBtn, margin: "0 auto 14px", display: "flex" }} onClick={() => fileRef.current?.click()}>
          <div style={styles.avatarRingSm}>
            <Avatar photo={photo} name={name || "?"} style={styles.avatarLg} />
          </div>
          <div style={styles.avatarEditBadge}>
            {uploading ? <span style={styles.avatarEditSpinner} /> : <Camera size={13} color="#000000" />}
          </div>
        </button>

        <input
          style={styles.input}
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onSubmit(name, photo)}
          autoFocus
        />

        <button style={{ ...styles.logBtn, marginTop: 12, opacity: name.trim() ? 1 : 0.5 }} disabled={!name.trim()} onClick={() => onSubmit(name, photo)}>
          Create group
        </button>
      </div>
    </div>
  );
}

// Group chat — only rendered once you're already a member (see the
// membership check where this is invoked); non-members see GroupDetailModal
// (the join/request screen) instead, so the conversation itself stays
// private to people the owner has actually accepted.
function GroupChatModal({ group, myName, profiles, onClose, onSend, onLeave, onDelete, onRespondRequest, onOpenProfile }) {
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const scrollRef = useRef(null);
  const isMine = group?.createdBy === myName;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [group?.messages?.length, showMembers]);

  if (!group) return null;
  const members = group.members || [];
  const messages = group.messages || [];
  const pendingNames = Object.keys(group.pendingRequests || {});

  function submit() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div style={styles.postViewerOverlay} onClick={(e) => e.stopPropagation()}>
      <div style={styles.postViewerTop}>
        <button style={styles.postViewerIconBtn} onClick={onClose} aria-label="Back">
          <ChevronLeft size={22} color="#FFFFFF" />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ ...styles.cardName, color: "#FFFFFF" }}>{group.name}</div>
          <div style={{ ...styles.activityTime, marginTop: 0 }}>{members.length} {members.length === 1 ? "member" : "members"}</div>
        </div>
        <div style={{ position: "relative", display: "flex", gap: 4 }}>
          <button style={styles.postViewerIconBtn} onClick={() => setShowMembers((v) => !v)} aria-label="Members">
            <Users size={19} color="#FFFFFF" />
            {isMine && pendingNames.length > 0 && <span style={styles.inboxBadge}>{pendingNames.length}</span>}
          </button>
          <button style={styles.postViewerIconBtn} onClick={() => setMenuOpen((o) => !o)} aria-label="Group options">
            <MoreHorizontal size={20} color="#FFFFFF" />
          </button>
          {menuOpen && (
            <>
              <button style={styles.menuBackdrop} onClick={() => setMenuOpen(false)} aria-label="Close menu" />
              <div style={styles.postMenu}>
                <button style={styles.postMenuDeleteItem} onClick={() => { setMenuOpen(false); onLeave(); onClose(); }}>
                  Leave group
                </button>
                {isMine && (
                  <button style={styles.postMenuDeleteItem} onClick={() => { setMenuOpen(false); onDelete(); }}>
                    <Trash2 size={14} color="#C1443A" /> Delete group
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showMembers ? (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 16px" }}>
          {isMine && pendingNames.length > 0 && (
            <>
              <div style={styles.sectionLabel}>Requests to join</div>
              {pendingNames.map((name) => (
                <div key={name} style={styles.inboxCard}>
                  <button style={{ ...styles.postAuthorBtn, width: "100%" }} onClick={() => onOpenProfile(name)}>
                    <Avatar photo={profiles?.[name]?.photo} name={name} style={styles.postAvatar} />
                    <div style={{ textAlign: "left" }}>
                      <div style={styles.cardName}>{name}</div>
                    </div>
                  </button>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button style={styles.declineBtn} onClick={() => onRespondRequest(group.id, name, false)}>
                      Decline
                    </button>
                    <button style={styles.acceptBtn} onClick={() => onRespondRequest(group.id, name, true)}>
                      <Check size={14} color="#000000" strokeWidth={3} /> Accept
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          <div style={styles.sectionLabel}>Members</div>
          {members.map((name) => (
            <button key={name} style={styles.followListRow} onClick={() => onOpenProfile(name)}>
              <Avatar photo={profiles?.[name]?.photo} name={name} style={styles.postAvatar} />
              <div style={{ textAlign: "left" }}>
                <div style={styles.cardName}>
                  {name} {name === group.createdBy && <span style={styles.profileViewYouTag}>creator</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div ref={scrollRef} style={styles.groupChatScroll}>
            {messages.length === 0 && (
              <div style={{ ...styles.empty, color: "rgba(255,255,255,0.75)" }}>
                <p style={{ ...styles.emptyTitle, color: "#FFFFFF" }}>No messages yet</p>
                <p style={styles.emptyBody}>Say hey to the group.</p>
              </div>
            )}
            {messages.map((m) => {
              const mine = m.author === myName;
              return (
                <div key={m.id} style={{ ...styles.groupChatRow, flexDirection: mine ? "row-reverse" : "row", alignSelf: mine ? "flex-end" : "flex-start" }}>
                  <Avatar photo={profiles?.[m.author]?.photo} name={m.author} style={{ ...styles.postAvatar, width: 28, height: 28 }} />
                  <div style={{ ...styles.groupChatBubble, ...(mine ? styles.groupChatBubbleMine : {}) }}>
                    {!mine && <div style={styles.groupChatAuthor}>{m.author}</div>}
                    <div style={{ color: mine ? "#000000" : "#FFFFFF" }}>{m.text}</div>
                    <div style={{ ...styles.activityTime, color: mine ? "rgba(0,0,0,0.55)" : "#6B6963" }}>{timeAgo(m.time)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={styles.groupChatInputRow}>
            <input
              style={styles.groupChatInput}
              placeholder="Message the group…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <button style={styles.groupChatSendBtn} onClick={submit} disabled={!text.trim()} aria-label="Send">
              <Send size={16} color="#000000" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function GroupDetailModal({ group, myName, profiles, onClose, onRequestJoin, onCancelRequest, onLeave, onRespondRequest, onDelete, onOpenProfile }) {
  if (!group) return null;
  const members = group.members || [];
  const pending = group.pendingRequests || {};
  const pendingNames = Object.keys(pending);
  const iJoined = members.includes(myName);
  const iRequested = !!pending[myName];
  const isMine = group.createdBy === myName;

  let joinBtnLabel = "Request to join";
  let joinBtnAction = () => onRequestJoin(group.id);
  let joinBtnDone = false;
  if (iJoined) {
    joinBtnLabel = "Joined";
    joinBtnAction = () => onLeave(group.id);
    joinBtnDone = true;
  } else if (iRequested) {
    joinBtnLabel = "Requested";
    joinBtnAction = () => onCancelRequest(group.id);
    joinBtnDone = true;
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxHeight: "82vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>{group.name}</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        <div style={styles.profileViewHead}>
          <div style={styles.avatarRingSm}>
            <Avatar photo={group.photo} name={group.name} style={styles.avatarLg} />
          </div>
          <div style={styles.profileViewName}>{group.name}</div>
          <div style={styles.profileViewCourse}>
            <Users size={12} color="#9C9990" /> {members.length} {members.length === 1 ? "member" : "members"}
          </div>
          {!isMine && (
            <button style={{ ...styles.followBtn, ...(joinBtnDone ? styles.followBtnDone : {}) }} onClick={joinBtnAction}>
              {joinBtnLabel}
            </button>
          )}
        </div>

        {isMine && pendingNames.length > 0 && (
          <>
            <div style={styles.sectionLabel}>Requests to join</div>
            {pendingNames.map((name) => (
              <div key={name} style={styles.inboxCard}>
                <button style={{ ...styles.postAuthorBtn, width: "100%" }} onClick={() => onOpenProfile(name)}>
                  <Avatar photo={profiles?.[name]?.photo} name={name} style={styles.postAvatar} />
                  <div style={{ textAlign: "left" }}>
                    <div style={styles.cardName}>{name}</div>
                  </div>
                </button>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button style={styles.declineBtn} onClick={() => onRespondRequest(group.id, name, false)}>
                    Decline
                  </button>
                  <button style={styles.acceptBtn} onClick={() => onRespondRequest(group.id, name, true)}>
                    <Check size={14} color="#000000" strokeWidth={3} /> Accept
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={styles.sectionLabel}>Members</div>
        {members.map((name) => (
          <button key={name} style={styles.followListRow} onClick={() => onOpenProfile(name)}>
            <Avatar photo={profiles?.[name]?.photo} name={name} style={styles.postAvatar} />
            <div style={{ textAlign: "left" }}>
              <div style={styles.cardName}>
                {name} {name === group.createdBy && <span style={styles.profileViewYouTag}>creator</span>}
              </div>
            </div>
          </button>
        ))}

        {isMine && (
          <button style={{ ...styles.declineBtn, width: "100%", marginTop: 14 }} onClick={() => onDelete(group.id)}>
            Delete group
          </button>
        )}
      </div>
    </div>
  );
}

function MatchComposerModal({ onClose, onSubmit }) {
  const [course, setCourse] = useState("");
  const [when, setWhen] = useState("");
  const [spots, setSpots] = useState(3);
  const [note, setNote] = useState("");

  const canPost = course.trim() && when.trim();

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>Post a match</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        <label style={styles.formLabel}>
          Course
          <input style={styles.input} value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. Cedar Ridge GC" />
        </label>

        <label style={styles.formLabel}>
          When
          <input style={styles.input} value={when} onChange={(e) => setWhen(e.target.value)} placeholder="e.g. Saturday 8am" />
        </label>

        <label style={styles.formLabel}>
          Spots needed (not counting you)
          <div style={styles.spotsRow}>
            <button style={styles.spotsBtn} onClick={() => setSpots((s) => Math.max(1, s - 1))} aria-label="Decrease spots needed">
              −
            </button>
            <span style={styles.spotsValue}>{spots}</span>
            <button style={styles.spotsBtn} onClick={() => setSpots((s) => Math.min(3, s + 1))} aria-label="Increase spots needed">
              +
            </button>
          </div>
        </label>

        <textarea
          style={{ ...styles.composerTextarea, marginBottom: 14 }}
          placeholder="Anything else? (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />

        <button
          style={{ ...styles.logBtn, marginBottom: 0, opacity: canPost ? 1 : 0.5 }}
          disabled={!canPost}
          onClick={() => onSubmit(course, when, spots, note)}
        >
          Post match
        </button>
      </div>
    </div>
  );
}

function InboxModal({ inbox, activity = [], seenActivityIds = [], golfers, myFollowing = {}, onClose, onRespond, onOpenPost, onOpenProfile, onFollowBack, onRespondGroupRequest }) {
  const pending = inbox.filter((r) => r.status === "pending");
  const resolved = inbox.filter((r) => r.status !== "pending");

  function golferFor(id) {
    return golfers.find((g) => g.id === id);
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxHeight: "82vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>Notifications</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        {pending.length === 0 && resolved.length === 0 && activity.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyTitle}>No notifications yet</p>
            <p style={styles.emptyBody}>Golf claps, comments, new followers, group join requests, and match requests will show up here.</p>
          </div>
        )}

        {activity.length > 0 && <div style={styles.sectionLabel}>Activity</div>}
        {activity.map((n) => {
          const unread = !seenActivityIds.includes(n.id);
          if (n.type === "follow") {
            const alreadyFollowing = !!myFollowing[n.actor];
            return (
              <div key={n.id} style={styles.activityRow}>
                {unread && <span style={styles.activityUnreadDot} aria-hidden="true" />}
                <button style={styles.activityRowClickable} onClick={() => onOpenProfile(n.actor, n.id)}>
                  <div style={styles.avatarSm}>{initialsOf(n.actor)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.cardMeta}>
                      <span style={{ color: "#FFFFFF", fontWeight: 700 }}>{n.actor}</span> started following you
                    </div>
                    <div style={styles.activityTime}>{timeAgo(n.time)}</div>
                  </div>
                </button>
                <button
                  style={{ ...styles.followBackBtn, ...(alreadyFollowing ? styles.followBackBtnDone : {}) }}
                  onClick={() => onFollowBack(n.actor)}
                >
                  {alreadyFollowing ? "Following" : "Follow back"}
                </button>
              </div>
            );
          }
          if (n.type === "group_request") {
            return (
              <div key={n.id} style={styles.activityRow}>
                {unread && <span style={styles.activityUnreadDot} aria-hidden="true" />}
                <button style={styles.activityRowClickable} onClick={() => onOpenProfile(n.actor, n.id)}>
                  <div style={styles.avatarSm}>{initialsOf(n.actor)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.cardMeta}>
                      <span style={{ color: "#FFFFFF", fontWeight: 700 }}>{n.actor}</span> wants to join <span style={{ color: "#FFFFFF", fontWeight: 700 }}>{n.groupName}</span>
                    </div>
                    <div style={styles.activityTime}>{timeAgo(n.time)}</div>
                  </div>
                </button>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button style={styles.declineBtnSm} onClick={() => onRespondGroupRequest(n.groupId, n.actor, false, n.id)} aria-label="Decline">
                    <X size={13} color="#C1443A" />
                  </button>
                  <button style={styles.followBackBtn} onClick={() => onRespondGroupRequest(n.groupId, n.actor, true, n.id)}>
                    Accept
                  </button>
                </div>
              </div>
            );
          }
          return (
            <button key={n.id} style={styles.activityRow} onClick={() => onOpenPost(n.postId, n.id)}>
              {unread && <span style={styles.activityUnreadDot} aria-hidden="true" />}
              <div style={styles.avatarSm}>{initialsOf(n.actor)}</div>
              <div style={{ flex: 1 }}>
                {n.type === "like" ? (
                  <div style={styles.cardMeta}>
                    <span style={{ color: "#FFFFFF", fontWeight: 700 }}>{n.actor}</span> gave you a golf clap 👏
                  </div>
                ) : (
                  <div style={styles.cardMeta}>
                    <span style={{ color: "#FFFFFF", fontWeight: 700 }}>{n.actor}</span> commented: "{n.text}"
                  </div>
                )}
                <div style={styles.activityTime}>{timeAgo(n.time)}</div>
              </div>
              <ChevronRight size={16} color="#9C9990" />
            </button>
          );
        })}

        {pending.length > 0 && <div style={styles.sectionLabel}>Pending</div>}
        {pending.map((r) => {
          const g = golferFor(r.golferId);
          if (!g) return null;
          return (
            <div key={r.id} style={styles.inboxCard}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={styles.avatarSm}>
                  {g.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.cardName}>{g.name}</div>
                  <div style={styles.cardMeta}>
                    <MapPin size={12} color="#9C9990" /> {g.distance} mi · HCP {g.handicap.toFixed(1)}
                  </div>
                  <div style={styles.inboxNote}>"{r.note}"</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={styles.declineBtn} onClick={() => onRespond(r.id, false)}>
                  Decline
                </button>
                <button style={styles.acceptBtn} onClick={() => onRespond(r.id, true)}>
                  <Check size={14} color="#000000" strokeWidth={3} /> Accept
                </button>
              </div>
            </div>
          );
        })}

        {resolved.length > 0 && <div style={styles.sectionLabel}>Past requests</div>}
        {resolved.map((r) => {
          const g = golferFor(r.golferId);
          if (!g) return null;
          return (
            <div key={r.id} style={styles.rowCard}>
              <div>
                <div style={styles.cardName}>{g.name}</div>
                <div style={styles.cardMeta}>{r.note}</div>
              </div>
              <span style={r.status === "accepted" ? styles.connectedChip : styles.declinedChip}>
                {r.status === "accepted" ? "Accepted" : "Declined"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileTab({
  myName,
  myInitials,
  currentHandicap,
  avgScore,
  bestRound,
  roundsCount,
  ghinStatus,
  ghinNumber,
  ghinHandicap,
  onConnectGhin,
  homeCourse,
  onSaveHomeCourse,
  trendData,
  onLogOut,
  myPhoto,
  onSavePhoto,
  followers,
  following,
  profiles,
  myFollowingMap,
  onToggleFollow,
  onOpenProfile,
}) {
  const [editingCourse, setEditingCourse] = useState(false);
  const [courseDraft, setCourseDraft] = useState(homeCourse || "");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [followListView, setFollowListView] = useState(null); // "followers" | "following" | null
  const photoInputRef = useRef(null);

  function saveCourse() {
    const trimmed = courseDraft.trim();
    if (trimmed) onSaveHomeCourse(trimmed);
    setEditingCourse(false);
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoUploading(true);
    try {
      onSavePhoto(await fileToSquareImage(file));
    } catch (err) {
      // upload failed — leave the existing photo (or lack of one) in place
    }
    setPhotoUploading(false);
  }

  return (
    <div style={styles.tabPad}>
      <div style={styles.profileHead}>
        <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
        <button style={styles.avatarEditBtn} onClick={() => photoInputRef.current?.click()} aria-label="Change profile photo">
          <div style={styles.avatarRing}>
            <Avatar photo={myPhoto} name={myName} style={styles.avatarLg} />
          </div>
          <div style={styles.avatarEditBadge}>
            {photoUploading ? <span style={styles.avatarEditSpinner} /> : <Camera size={13} color="#000000" />}
          </div>
        </button>
        <div style={{ ...styles.profileName, color: "#FFFFFF" }}>{myName}</div>
        {editingCourse ? (
          <div style={styles.homeCourseEditRow}>
            <input
              style={styles.homeCourseInput}
              value={courseDraft}
              onChange={(e) => setCourseDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveCourse()}
              autoFocus
            />
            <button style={styles.homeCourseSaveBtn} onClick={saveCourse} aria-label="Save home course">
              <Check size={14} color="#000000" />
            </button>
          </div>
        ) : (
          <button
            style={styles.homeCourseDisplayBtn}
            onClick={() => {
              setCourseDraft(homeCourse || "");
              setEditingCourse(true);
            }}
          >
            <MapPin size={12} color="rgba(255,255,255,0.78)" /> {homeCourse || "Add your home course"}
          </button>
        )}

        <div style={styles.followCountsRow}>
          <button style={styles.followCountsBtn} onClick={() => setFollowListView("followers")}>
            <span style={styles.followCountsNum}>{followers.length}</span> Followers
          </button>
          <button style={styles.followCountsBtn} onClick={() => setFollowListView("following")}>
            <span style={styles.followCountsNum}>{following.length}</span> Following
          </button>
        </div>
      </div>

      {followListView && (
        <FollowListModal
          title={followListView === "followers" ? "Followers" : "Following"}
          names={followListView === "followers" ? followers : following}
          profiles={profiles}
          myFollowingMap={myFollowingMap}
          myName={myName}
          onToggleFollow={onToggleFollow}
          onOpenProfile={(name) => {
            setFollowListView(null);
            onOpenProfile(name);
          }}
          onClose={() => setFollowListView(null)}
        />
      )}

      <div style={styles.stampWrap}>
        <div style={styles.stamp}>
          <div style={styles.stampInnerRing}>
            <Award size={15} color="#000000" style={{ marginBottom: 1 }} />
            <div style={styles.stampEyebrow}>HANDICAP INDEX</div>
            <div style={styles.stampValue}>{currentHandicap != null ? currentHandicap.toFixed(1) : "—"}</div>
          </div>
        </div>
      </div>

      <div style={styles.statRow}>
        <Stat label="Rounds" value={roundsCount} />
        <Stat label="Avg score" value={avgScore ?? "—"} />
        <Stat label="Best round" value={bestRound ?? "—"} accent />
      </div>

      {trendData && trendData.length > 1 && (
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Handicap trend</div>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={trendData} margin={{ top: 6, right: 10, bottom: 0, left: 10 }}>
              <XAxis dataKey="date" hide />
              <YAxis hide reversed domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                contentStyle={{ background: "#3A3936", border: "1.5px solid #74C69D", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#9C9990" }}
                itemStyle={{ color: "#74C69D" }}
                formatter={(v) => [typeof v === "number" ? v.toFixed(1) : v, "Handicap"]}
              />
              <Line type="monotone" dataKey="hcp" stroke="#74C69D" strokeWidth={2.5} dot={{ r: 3, fill: "#74C69D", strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={styles.ghinCard}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.ghinIconWrap}>
            <Flag size={16} color="#000000" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.cardName}>GHIN</div>
            <div style={styles.cardMeta}>
              {ghinStatus === "connected" ? `#${ghinNumber} · Index ${ghinHandicap} (self-reported)` : "Add your GHIN number & official index"}
            </div>
          </div>
          {ghinStatus === "connected" ? (
            <button style={styles.connectedChip} onClick={onConnectGhin}>
              Edit
            </button>
          ) : (
            <button style={styles.connectBtn} onClick={onConnectGhin}>
              Add
            </button>
          )}
        </div>
      </div>

      <button style={styles.settingsRow}>
        Edit home course <ChevronRight size={16} color="#9C9990" />
      </button>
      <button style={styles.settingsRow}>
        Notification preferences <ChevronRight size={16} color="#9C9990" />
      </button>
      <button style={{ ...styles.settingsRow, color: "#C1443A" }} onClick={onLogOut}>
        Log out <ChevronRight size={16} color="#C1443A" />
      </button>
    </div>
  );
}

function GhinModal({ initialNumber, initialHandicap, onClose, onSave }) {
  const [num, setNum] = useState(initialNumber || "");
  const [hcp, setHcp] = useState(initialHandicap || "");
  const canSave = num.trim() && hcp.trim() && !isNaN(Number(hcp));

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>Add your GHIN info</span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        <p style={styles.ghinModalCopy}>
          GHIN doesn't offer automatic sync for apps like this one yet, so this just saves your official number and
          index for your profile — it won't change the handicap Stick Talk calculates from your logged rounds.
        </p>

        <label style={styles.formLabel}>
          GHIN number
          <input style={styles.input} value={num} onChange={(e) => setNum(e.target.value)} placeholder="e.g. 3315181" />
        </label>
        <label style={styles.formLabel}>
          Current Handicap Index
          <input style={styles.input} value={hcp} onChange={(e) => setHcp(e.target.value)} placeholder="e.g. 14.2" inputMode="decimal" />
        </label>

        <button style={{ ...styles.logBtn, opacity: canSave ? 1 : 0.5 }} disabled={!canSave} onClick={() => onSave(num, hcp)}>
          Save
        </button>
      </div>
    </div>
  );
}

const HOLES = Array.from({ length: 18 }, (_, i) => i + 1);

// Generic par-72 hole layout (4 par-3s, 10 par-4s, 4 par-5s per side) used
// purely to color-code the virtual scorecard — actual course-specific hole
// pars aren't tracked, so this is a representative pattern, not the real card.
const PAR_LAYOUT = [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 5, 4];

// For the OUT/IN/TOTAL/TO PAR summary row: a simpler 3-tier rule than the
// per-hole scoreColor below (which distinguishes eagles/birdies/bogeys/doubles).
function relToParColor(diff) {
  if (diff < 0) return "#C1443A"; // under par
  if (diff === 0) return "#74C69D"; // even par
  return "#000000"; // over par
}

function scoreColor(diff) {
  if (diff <= -2) return "#F4C430"; // eagle or better
  if (diff === -1) return "#74C69D"; // birdie
  if (diff === 0) return "#000000"; // par
  if (diff === 1) return "#F4A261"; // bogey
  return "#C1443A"; // double or worse
}

function Scorecard({ round, large }) {
  const hasHoles = Array.isArray(round.holes) && round.holes.length === 18;
  const diff = differential(round.score, round.rating, round.slope);
  const toPar = round.score - 72;
  const toParLabel = toPar === 0 ? "E" : toPar > 0 ? `+${toPar}` : `${toPar}`;
  const displayYardage = round.yardage || estimateYardage(round.tee);

  if (!hasHoles) {
    return (
      <div style={styles.scorecardTicket}>
        <div style={styles.scorecardTicketTop}>
          <div>
            <div style={styles.scorecardTicketCourse}>{round.course}</div>
            {(round.tee || displayYardage) && (
              <div style={styles.scorecardTeeLine}>
                {round.tee ? `${round.tee} tees` : ""}
                {round.tee && displayYardage ? " · " : ""}
                {displayYardage ? `${Number(displayYardage).toLocaleString()} yds` : ""}
              </div>
            )}
          </div>
          <span style={styles.scorecardTicketDate}>{fmtDate(round.date)}</span>
        </div>
        <div style={styles.scorecardTicketMain}>
          <span style={styles.scorecardTicketScore}>{round.score}</span>
          <span style={{ ...styles.scorecardTicketToPar, color: scoreColor(toPar <= 0 ? -1 : toPar >= 2 ? 2 : toPar) }}>
            {toParLabel}
          </span>
        </div>
        <div style={styles.scorecardTicketFoot}>Differential {diff.toFixed(1)} · Rating {round.rating} / Slope {round.slope}</div>
      </div>
    );
  }

  const front = round.holes.slice(0, 9);
  const back = round.holes.slice(9, 18);
  const out = front.reduce((s, h) => s + h.strokes, 0);
  const inn = back.reduce((s, h) => s + h.strokes, 0);
  const frontPar = PAR_LAYOUT.slice(0, 9).reduce((s, p) => s + p, 0);
  const backPar = PAR_LAYOUT.slice(9, 18).reduce((s, p) => s + p, 0);

  // Traditional scorecard notation: birdie gets a circle, eagle-or-better
  // gets a double circle, bogey gets a square, double-bogey-or-worse gets
  // a double square, par gets no shape at all. Everything renders in white
  // rather than color-coding by score.
  function ScoreMark({ score, diff }) {
    const isCircle = diff <= -1;
    const isSquare = diff >= 1;
    const isDouble = diff <= -2 || diff >= 2;
    const shape = isCircle ? "50%" : isSquare ? 5 : 0;
    const textStyle = { ...styles.scorecardCellScore, color: "#000000", marginTop: 0 };

    if (!isCircle && !isSquare) {
      return <span style={textStyle}>{score}</span>;
    }
    if (!isDouble) {
      return (
        <span style={{ ...styles.scoreMarkRing, borderRadius: shape }}>
          <span style={textStyle}>{score}</span>
        </span>
      );
    }
    return (
      <span style={{ ...styles.scoreMarkRing, ...styles.scoreMarkOuterRing, borderRadius: shape }}>
        <span style={{ ...styles.scoreMarkRing, borderRadius: shape, marginTop: 0 }}>
          <span style={textStyle}>{score}</span>
        </span>
      </span>
    );
  }

  function HoleRow({ holes, startAt }) {
    return (
      <div style={styles.scorecardHoleRow}>
        {holes.map((h, i) => {
          const par = PAR_LAYOUT[startAt + i];
          const d = h.strokes - par;
          return (
            <div key={h.hole} style={styles.scorecardCell}>
              <span style={styles.scorecardCellNumBadge}>{h.hole}</span>
              <div style={styles.scorecardCellMain}>
                <span style={styles.scorecardCellPar}>{par}</span>
                <div style={styles.scorecardCellDivider} />
                <div style={styles.scoreMarkSlot}>
                  <ScoreMark score={h.strokes} diff={d} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ ...styles.scorecardWrap, ...(large ? { height: "auto" } : {}) }}>
      <div style={styles.scorecardTop}>
        <div>
          <div style={styles.scorecardTitle}>{round.course}</div>
          {(round.tee || displayYardage) && (
            <div style={styles.scorecardTeeLine}>
              {round.tee ? `${round.tee} tees` : ""}
              {round.tee && displayYardage ? " · " : ""}
              {displayYardage ? `${Number(displayYardage).toLocaleString()} yds` : ""}
            </div>
          )}
        </div>
        <span style={styles.scorecardTicketDate}>{fmtDate(round.date)}</span>
      </div>
      <HoleRow holes={front} startAt={0} />
      <div style={styles.scorecardDivider} />
      <HoleRow holes={back} startAt={9} />
      <div style={styles.scorecardSummaryRow}>
        <div style={styles.scorecardSummaryItem}>
          <span style={styles.scorecardSummaryLabel}>OUT</span>
          <span style={{ ...styles.scorecardSummaryValue, color: relToParColor(out - frontPar) }}>{out}</span>
        </div>
        <div style={styles.scorecardSummaryItem}>
          <span style={styles.scorecardSummaryLabel}>IN</span>
          <span style={{ ...styles.scorecardSummaryValue, color: relToParColor(inn - backPar) }}>{inn}</span>
        </div>
        <div style={styles.scorecardSummaryItem}>
          <span style={styles.scorecardSummaryLabel}>TOTAL</span>
          <span style={{ ...styles.scorecardSummaryValue, color: relToParColor(toPar) }}>{round.score}</span>
        </div>
        <div style={styles.scorecardSummaryItem}>
          <span style={styles.scorecardSummaryLabel}>TO PAR</span>
          <span style={{ ...styles.scorecardSummaryValue, color: relToParColor(toPar) }}>
            {toParLabel}
          </span>
        </div>
      </div>
      <div style={styles.scorecardFoot}>Differential {diff.toFixed(1)} · Rating {round.rating} / Slope {round.slope}{round.startHole && round.startHole !== 1 ? ` · Started hole ${round.startHole}` : ""}</div>
    </div>
  );
}

const METHODS = [
  { id: "holebyhole", title: "Hole-by-hole", desc: "Rapidly enter your hole-by-hole scores" },
  { id: "holebyholeStats", title: "Hole-by-hole with stats", desc: "Track putts, fairways hit, and greens in regulation" },
  { id: "total", title: "Total score", desc: "Post a total score, or split front-9 and back-9" },
];

function LogRoundModal({ onClose, onSubmit }) {
  const [step, setStep] = useState("method");
  const scoreInputRefs = useRef({});
  const [method, setMethod] = useState(null);

  const [course, setCourse] = useState("");
  const [rating, setRating] = useState("72.0");
  const [slope, setSlope] = useState("113");
  const [courseKnown, setCourseKnown] = useState(false);
  const [showCourseList, setShowCourseList] = useState(false);
  const [tees, setTees] = useState(DEFAULT_TEES);
  const [tee, setTee] = useState("");
  const [teeYardage, setTeeYardage] = useState(null);
  const [startHole, setStartHole] = useState(1);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [datePlayed, setDatePlayed] = useState(todayStr);

  const courseMatches =
    course.trim().length > 0
      ? COURSE_DB.filter((c) => {
          const q = course.trim().toLowerCase();
          return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
        }).slice(0, 6)
      : [];

  function selectCourse(c) {
    setCourse(c.name);
    setRating(String(c.rating));
    setSlope(String(c.slope));
    setCourseKnown(true);
    setTees(c.tees && c.tees.length ? c.tees : DEFAULT_TEES);
    setTee("");
    setTeeYardage(null);
    setShowCourseList(false);
  }

  const [totalMode, setTotalMode] = useState("single"); // single | split
  const [totalScore, setTotalScore] = useState("");
  const [front9, setFront9] = useState("");
  const [back9, setBack9] = useState("");

  const [holeScores, setHoleScores] = useState(Array(18).fill(""));
  const [holePutts, setHolePutts] = useState(Array(18).fill(""));
  const [holeFairway, setHoleFairway] = useState(Array(18).fill(false));
  const [holeGIR, setHoleGIR] = useState(Array(18).fill(false));

  const [shareToFeed, setShareToFeed] = useState(true);
  const [caption, setCaption] = useState("");
  const [roundPhoto, setRoundPhoto] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoRef = useRef(null);
  async function handleRoundPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoUploading(true);
    try {
      setRoundPhoto(await fileToSharedImage(file));
    } catch (err) {
      // ignore — upload failed, user can retry
    }
    setPhotoUploading(false);
  }
  const roundExtrasBlock = (
    <>
      <label style={styles.formLabel}>
        Date played
        <input
          style={styles.input}
          type="date"
          value={datePlayed}
          max={todayStr}
          onChange={(e) => setDatePlayed(e.target.value || todayStr)}
        />
      </label>

      <div style={styles.shareRow}>
        <div>
          <div style={styles.shareRowTitle}>Post to feed</div>
          <div style={styles.shareRowSub}>{shareToFeed ? "Friends will see this round" : "Just for your handicap history"}</div>
        </div>
        <button
          style={{ ...styles.switchTrack, ...(shareToFeed ? styles.switchTrackOn : {}) }}
          onClick={() => setShareToFeed((s) => !s)}
          aria-label="Toggle post to feed"
        >
          <div style={{ ...styles.switchThumb, transform: shareToFeed ? "translateX(18px)" : "translateX(0)" }} />
        </button>
      </div>

      {shareToFeed && (
        <>
          <textarea
            style={{ ...styles.composerTextarea, marginBottom: 10 }}
            placeholder="Say something about the round… (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
          />
          <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleRoundPhoto} />
          {roundPhoto ? (
            <div style={styles.composerImageWrap}>
              <PhotoTile src={roundPhoto} style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 12 }} alt="Round photo preview" />
              <button style={styles.composerImageRemove} onClick={() => setRoundPhoto(null)} aria-label="Remove photo">
                <Trash2 size={14} color="#FFFFFF" />
              </button>
            </div>
          ) : (
            <button style={styles.addPhotoBtn} onClick={() => photoRef.current?.click()} disabled={photoUploading}>
              <Camera size={16} color="#74C69D" /> {photoUploading ? "Uploading…" : "Add a photo from the round"}
            </button>
          )}
        </>
      )}
    </>
  );

  function chooseMethod(id) {
    setMethod(id);
    setStep("form");
  }

  function updateHole(arr, setArr, i, value) {
    const next = [...arr];
    next[i] = value;
    setArr(next);
  }

  const holeTotal = holeScores.reduce((sum, s) => sum + (Number(s) || 0), 0);
  const splitTotal = (Number(front9) || 0) + (Number(back9) || 0);
  const holeOrder = Array.from({ length: 18 }, (_, k) => ((startHole - 1 + k) % 18) + 1);

  // Only auto-advance for 2-9 — those are complete, unambiguous scores the
  // moment you type them. Anything starting with "1" (a hole-in-one, or the
  // first digit of 10-19) is ambiguous, so leave it to a manual tap instead
  // of guessing whether more digits are coming.
  function handleScoreChange(h, value) {
    updateHole(holeScores, setHoleScores, h - 1, value);
    const num = Number(value);
    if (value !== "" && num >= 2 && num <= 9) {
      const nextHole = holeOrder[holeOrder.indexOf(h) + 1];
      const nextInput = nextHole && scoreInputRefs.current[nextHole];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  }

  const finalScore =
    method === "total" ? (totalMode === "single" ? Number(totalScore) : splitTotal) : holeTotal;

  const canSubmitDetails = course.trim().length > 0;
  const canSubmitScore =
    method === "total"
      ? totalMode === "single"
        ? totalScore !== ""
        : front9 !== "" && back9 !== ""
      : holeScores.every((s) => s !== "");

  function handleSubmit() {
    const meta =
      method === "total"
        ? { method: "total" }
        : {
            method,
            holes: holeScores.map((s, i) => ({
              hole: i + 1,
              strokes: Number(s),
              putts: method === "holebyholeStats" ? Number(holePutts[i]) || 0 : undefined,
              fairway: method === "holebyholeStats" ? holeFairway[i] : undefined,
              gir: method === "holebyholeStats" ? holeGIR[i] : undefined,
            })),
          };
    meta.images = shareToFeed && roundPhoto ? [roundPhoto] : [];
    meta.caption = shareToFeed ? caption : "";
    meta.shareToFeed = shareToFeed;
    meta.tee = tee || null;
    meta.yardage = tee ? teeYardage : null;
    meta.startHole = method === "total" ? 1 : startHole;
    meta.datePlayed = datePlayed;
    onSubmit(course, finalScore, rating, slope, meta);
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxHeight: "82vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>
            {step === "method" ? "Post score" : course || "New round"}
          </span>
          <button style={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        {step === "method" && (
          <>
            <label style={styles.formLabel}>
              Course
              <div style={{ position: "relative" }}>
                <input
                  style={styles.input}
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    setShowCourseList(true);
                    setCourseKnown(false);
                  }}
                  onFocus={() => setShowCourseList(true)}
                  onBlur={() => setTimeout(() => setShowCourseList(false), 120)}
                  placeholder="Start typing a course name…"
                  autoComplete="off"
                />
                {showCourseList && courseMatches.length > 0 && (
                  <div style={styles.suggestList}>
                    {courseMatches.map((c) => (
                      <button
                        key={c.name}
                        style={styles.suggestItem}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectCourse(c)}
                      >
                        <Flag size={13} color="#74C69D" />
                        <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <span>{c.name}</span>
                          <span style={{ fontSize: 11, color: "#9C9990" }}>{c.city}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </label>
            {course.trim().length > 0 && (
              <div style={styles.ratingSlopeRow}>
                <Award size={13} color="#9C9990" />
                {courseKnown ? (
                  <span>Rating {rating} · Slope {slope} — auto-filled</span>
                ) : (
                  <span>Using default rating {rating} / slope {slope} — pick this course from the list to auto-fill its real numbers</span>
                )}
              </div>
            )}

            <div style={styles.formLabel}>
              Tees played
              <div style={styles.teeChipRow}>
                {tees.map((t) => (
                  <button
                    key={t.name}
                    style={{ ...styles.teeChip, ...(tee === t.name ? styles.teeChipActive : {}) }}
                    onClick={() => {
                      setTee(t.name);
                      setTeeYardage(t.yardage || null);
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.sectionLabel}>How do you want to post?</div>
            {METHODS.map((m) => (
              <button
                key={m.id}
                style={{ ...styles.methodBtn, opacity: canSubmitDetails ? 1 : 0.5 }}
                disabled={!canSubmitDetails}
                onClick={() => chooseMethod(m.id)}
              >
                <span style={styles.methodTitle}>{m.title.toUpperCase()}</span>
                <span style={styles.methodDesc}>{m.desc}</span>
              </button>
            ))}
          </>
        )}

        {step === "form" && method === "total" && (
          <>
            <div style={styles.toggleRow}>
              <button
                style={{ ...styles.toggleChip, ...(totalMode === "single" ? styles.toggleChipActive : {}) }}
                onClick={() => setTotalMode("single")}
              >
                Total only
              </button>
              <button
                style={{ ...styles.toggleChip, ...(totalMode === "split" ? styles.toggleChipActive : {}) }}
                onClick={() => setTotalMode("split")}
              >
                Front-9 / Back-9
              </button>
            </div>

            {totalMode === "single" ? (
              <label style={styles.formLabel}>
                Total score
                <input style={styles.input} type="number" value={totalScore} onChange={(e) => setTotalScore(e.target.value)} placeholder="e.g. 87" />
              </label>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ ...styles.formLabel, flex: 1 }}>
                  Front-9
                  <input style={styles.input} type="number" value={front9} onChange={(e) => setFront9(e.target.value)} />
                </label>
                <label style={{ ...styles.formLabel, flex: 1 }}>
                  Back-9
                  <input style={styles.input} type="number" value={back9} onChange={(e) => setBack9(e.target.value)} />
                </label>
              </div>
            )}

            {roundExtrasBlock}
            <BackAndSubmit onBack={() => setStep("method")} onSubmit={handleSubmit} disabled={!canSubmitScore} label={shareToFeed ? "Post round" : "Save round"} />
          </>
        )}

        {step === "form" && method === "holebyhole" && (
          <>
            <label style={styles.formLabel}>
              Starting hole
              <select style={styles.input} value={startHole} onChange={(e) => setStartHole(Number(e.target.value))}>
                {HOLES.map((h) => (
                  <option key={h} value={h}>
                    {h === 1 ? "Hole 1 (normal start)" : `Hole ${h}`}
                  </option>
                ))}
              </select>
            </label>

            <div style={styles.holeGridSectionLabel}>Front 9</div>
            <div style={styles.holeGridRow}>
              {holeOrder.slice(0, 9).map((h) => {
                const i = h - 1;
                return (
                  <div key={h} style={styles.holeGridCell}>
                    <span style={styles.holeGridNum}>{h}</span>
                    <span style={styles.holeGridPar}>Par {PAR_LAYOUT[i]}</span>
                    <input
                      ref={(el) => (scoreInputRefs.current[h] = el)}
                      style={styles.holeGridInput}
                      type="number"
                      value={holeScores[i]}
                      onChange={(e) => handleScoreChange(h, e.target.value)}
                      aria-label={`Hole ${h} score`}
                    />
                  </div>
                );
              })}
            </div>

            <div style={styles.holeGridSectionLabel}>Back 9</div>
            <div style={styles.holeGridRow}>
              {holeOrder.slice(9, 18).map((h) => {
                const i = h - 1;
                return (
                  <div key={h} style={styles.holeGridCell}>
                    <span style={styles.holeGridNum}>{h}</span>
                    <span style={styles.holeGridPar}>Par {PAR_LAYOUT[i]}</span>
                    <input
                      ref={(el) => (scoreInputRefs.current[h] = el)}
                      style={styles.holeGridInput}
                      type="number"
                      value={holeScores[i]}
                      onChange={(e) => handleScoreChange(h, e.target.value)}
                      aria-label={`Hole ${h} score`}
                    />
                  </div>
                );
              })}
            </div>

            <div style={styles.scorecardSummaryRow}>
              {(() => {
                const outScore = holeOrder.slice(0, 9).reduce((sum, h) => sum + (Number(holeScores[h - 1]) || 0), 0);
                const inScore = holeOrder.slice(9, 18).reduce((sum, h) => sum + (Number(holeScores[h - 1]) || 0), 0);
                const frontPar = holeOrder.slice(0, 9).reduce((sum, h) => sum + PAR_LAYOUT[h - 1], 0);
                const backPar = holeOrder.slice(9, 18).reduce((sum, h) => sum + PAR_LAYOUT[h - 1], 0);
                return (
                  <>
                    <div style={styles.scorecardSummaryItem}>
                      <span style={styles.scorecardSummaryLabel}>OUT</span>
                      <span style={{ ...styles.scorecardSummaryValue, color: outScore ? relToParColor(outScore - frontPar) : undefined }}>{outScore || "—"}</span>
                    </div>
                    <div style={styles.scorecardSummaryItem}>
                      <span style={styles.scorecardSummaryLabel}>IN</span>
                      <span style={{ ...styles.scorecardSummaryValue, color: inScore ? relToParColor(inScore - backPar) : undefined }}>{inScore || "—"}</span>
                    </div>
                    <div style={styles.scorecardSummaryItem}>
                      <span style={styles.scorecardSummaryLabel}>TOTAL</span>
                      <span style={{ ...styles.scorecardSummaryValue, color: holeTotal ? relToParColor(holeTotal - 72) : undefined }}>{holeTotal || "—"}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            {roundExtrasBlock}
            <BackAndSubmit onBack={() => setStep("method")} onSubmit={handleSubmit} disabled={!canSubmitScore} label={shareToFeed ? "Post round" : "Save round"} />
          </>
        )}

        {step === "form" && method === "holebyholeStats" && (
          <>
            <label style={styles.formLabel}>
              Starting hole
              <select style={styles.input} value={startHole} onChange={(e) => setStartHole(Number(e.target.value))}>
                {HOLES.map((h) => (
                  <option key={h} value={h}>
                    {h === 1 ? "Hole 1 (normal start)" : `Hole ${h}`}
                  </option>
                ))}
              </select>
            </label>

            <div style={styles.holeHeaderRow}>
              <span style={{ width: 26 }}>#</span>
              <span style={{ width: 50 }}>Score</span>
              <span style={{ width: 46 }}>Putts</span>
              <span style={{ flex: 1, textAlign: "center" }}>FW</span>
              <span style={{ flex: 1, textAlign: "center" }}>GIR</span>
            </div>
            {holeOrder.map((h) => {
              const i = h - 1;
              return (
              <div key={h} style={styles.holeRow}>
                <span style={styles.holeNum}>{h}</span>
                <input
                  ref={(el) => (scoreInputRefs.current[h] = el)}
                  style={styles.holeInput}
                  type="number"
                  value={holeScores[i]}
                  onChange={(e) => handleScoreChange(h, e.target.value)}
                />
                <input
                  style={{ ...styles.holeInput, width: 40 }}
                  type="number"
                  value={holePutts[i]}
                  onChange={(e) => updateHole(holePutts, setHolePutts, i, e.target.value)}
                />
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <button
                    style={{ ...styles.dotToggle, ...(holeFairway[i] ? styles.dotToggleActive : {}) }}
                    onClick={() => updateHole(holeFairway, setHoleFairway, i, !holeFairway[i])}
                    aria-label={`Hole ${h} fairway hit`}
                    aria-pressed={holeFairway[i]}
                  />
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <button
                    style={{ ...styles.dotToggle, ...(holeGIR[i] ? styles.dotToggleActive : {}) }}
                    onClick={() => updateHole(holeGIR, setHoleGIR, i, !holeGIR[i])}
                    aria-label={`Hole ${h} green in regulation`}
                    aria-pressed={holeGIR[i]}
                  />
                </div>
              </div>
              );
            })}
            <div style={styles.holeTotalRow}>
              Total: <span style={{ color: "#74C69D", fontWeight: 700 }}>{holeTotal || "—"}</span>
            </div>
            {roundExtrasBlock}
            <BackAndSubmit onBack={() => setStep("method")} onSubmit={handleSubmit} disabled={!canSubmitScore} label={shareToFeed ? "Post round" : "Save round"} />
          </>
        )}
      </div>
    </div>
  );
}

function BackAndSubmit({ onBack, onSubmit, disabled, label = "Save round" }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
      <button style={styles.backBtn} onClick={onBack}>
        Back
      </button>
      <button style={{ ...styles.logBtn, marginBottom: 0, opacity: disabled ? 0.5 : 1 }} disabled={disabled} onClick={onSubmit}>
        {label}
      </button>
    </div>
  );
}

// ---------- Styles ----------
const styles = {
  loadingSpinner: { width: 34, height: 34, borderRadius: "50%", border: "3px solid #E4E1D8", borderTopColor: "#74C69D", animation: "spin 0.8s linear infinite" },
  nameGateWrap: { minHeight: "100vh", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", backgroundColor: "#000000", textAlign: "center", fontFamily: "'Baloo 2', sans-serif" },
  nameGateFlag: { width: 52, height: 52, borderRadius: 16, background: "#000000", border: "1.5px solid #74C69D", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  nameGateIcon: { width: 48, height: 48, display: "block", marginBottom: 14 },
  nameGateWordmark: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: 0, color: "#FFFFFF", marginBottom: 6 },
  nameGateWordmarkImg: { height: 64, width: "auto", display: "block", marginBottom: 6 },
  nameGateCopy: { fontSize: 14, color: "rgba(255,255,255,0.72)", marginBottom: 18 },
  nameGateInput: { width: "100%", background: "#F4F5F1", border: "1px solid #D8DCD3", borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#000000", marginBottom: 14, textAlign: "center" },
  nameGateFoot: { fontSize: 11.5, color: "rgba(255,255,255,0.6)", marginTop: 18, lineHeight: 1.5 },

  // ---- Onboarding carousel (pre-login screen) ----
  onboardWrap: { minHeight: "100vh", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#000000", textAlign: "center", fontFamily: "'Baloo 2', sans-serif", padding: "36px 22px 28px", position: "relative", overflow: "hidden" },
  onboardGlow: { position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(116,198,157,0.25) 0%, rgba(116,198,157,0) 70%)", pointerEvents: "none" },
  onboardWordmarkImg: { height: 44, width: "auto", display: "block", marginBottom: 26, position: "relative" },
  onboardCardFrame: { width: "100%", maxWidth: 320, height: 410, background: "#FFFFFF", borderRadius: 26, boxShadow: "0 20px 46px rgba(0,0,0,0.4)", overflow: "hidden", position: "relative", touchAction: "pan-y" },
  onboardHeadline: { fontSize: 21, fontWeight: 700, color: "#FFFFFF", margin: "24px 0 16px", lineHeight: 1.28, position: "relative" },
  onboardDots: { display: "flex", gap: 6, position: "relative" },
  onboardDot: { width: 6, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.28)", transition: "all 220ms cubic-bezier(0.23, 1, 0.32, 1)", border: "none", padding: 0 },
  onboardDotActive: { width: 18, background: "#74C69D" },
  onboardActions: { width: "100%", marginTop: "auto", paddingTop: 28, position: "relative" },
  onboardLoginLink: { color: "#74C69D", fontWeight: 700, fontSize: 14.5, background: "none", border: "none", padding: "10px", marginTop: 2 },
  onboardBackBtn: { position: "absolute", top: 20, left: 20, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", zIndex: 2 },

  // Onboarding feature mockups (static sample data, not live app state)
  mockAvatar: { width: 34, height: 34, borderRadius: "50%", fontSize: 13, flexShrink: 0 },
  mockFeedWrap: { padding: "18px 15px", textAlign: "left", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" },
  mockFeedTopRow: { display: "flex", alignItems: "center", gap: 9, marginBottom: 11 },
  mockName: { fontWeight: 700, fontSize: 13.5, color: "#000000" },
  mockTime: { fontSize: 11, color: "#8A8880" },
  mockCaption: { fontSize: 13.5, color: "#232220", marginBottom: 13, lineHeight: 1.4 },
  mockActionsRow: { display: "flex", gap: 18, borderTop: "1px solid #ECE9E0", paddingTop: 11 },
  mockActionItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#6B6960" },
  mockMediaBox: { width: "100%", height: 150, borderRadius: 12, marginBottom: 10, background: "linear-gradient(135deg, #74C69D, #232220)", display: "flex", alignItems: "center", justifyContent: "center" },
  mockLikedByRow: { fontSize: 11.5, color: "#6B6960", marginBottom: 9 },
  mockScoreWrap: { background: "#F5EFDD", padding: "20px 15px", textAlign: "left", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" },
  mockScoreTitle: { fontWeight: 700, fontSize: 13.5, color: "#232220", marginBottom: 10 },
  mockStatsRow: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5C5A52", fontWeight: 600, marginBottom: 14 },
  mockHoleRow: { display: "flex", gap: 6, marginBottom: 14 },
  mockHoleCell: { flex: 1, background: "#EDE4CC", borderRadius: 8, padding: "7px 3px 9px", textAlign: "center" },
  mockHoleNum: { fontSize: 9, color: "#8A8878", display: "block", marginBottom: 4 },
  mockHolePar: { fontSize: 10, color: "#5C5A52", fontWeight: 600, display: "block", marginBottom: 4 },
  mockFooterRow: { display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#7A7868", borderTop: "1px solid #E3DAC0", paddingTop: 9, marginBottom: 12 },
  mockHandicapRow: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#232220", fontWeight: 600, background: "#EDE4CC", borderRadius: 8, padding: "8px 10px" },
  mockRecentLabel: { fontSize: 10.5, color: "#8A8878", fontWeight: 600, marginTop: 14, marginBottom: 6 },
  mockRecentRow: { display: "flex", gap: 6 },
  mockRecentChip: { flex: 1, background: "#EDE4CC", borderRadius: 6, padding: "7px 2px", textAlign: "center", fontSize: 10.5, color: "#5C5A52", fontWeight: 700 },
  mockGroupWrap: { padding: "16px 15px 18px", textAlign: "left", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" },
  mockGroupHeaderRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 11, borderBottom: "1px solid #ECE9E0" },
  mockGroupAvatarStack: { display: "flex", alignItems: "center" },
  mockGroupAvatarSm: { width: 26, height: 26, borderRadius: "50%", fontSize: 10, border: "2px solid #FFFFFF", flexShrink: 0 },
  mockGroupHeader: { fontWeight: 700, fontSize: 13.5, color: "#000000" },
  mockGroupSub: { fontSize: 11, color: "#8A8880", marginTop: 1 },
  mockChatCol: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 },
  mockBubbleTheirs: { background: "#F1EFE7", color: "#232220", borderRadius: "14px 14px 14px 4px", padding: "8px 11px", fontSize: 12.5, alignSelf: "flex-start", maxWidth: "80%" },
  mockBubbleMine: { background: "#74C69D", color: "#000000", borderRadius: "14px 14px 4px 14px", padding: "8px 11px", fontSize: 12.5, alignSelf: "flex-end", maxWidth: "80%", fontWeight: 600 },
  mockInputBar: { display: "flex", alignItems: "center", gap: 8, background: "#F4F5F1", borderRadius: 20, padding: "8px 8px 8px 14px" },
  mockInputPill: { flex: 1, fontSize: 12, color: "#9C9A90" },
  mockSendDot: { width: 26, height: 26, borderRadius: "50%", background: "#74C69D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  mockNotifWrap: { padding: "16px 15px 18px", textAlign: "left", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" },
  mockNotifTitle: { fontWeight: 700, fontSize: 13.5, color: "#000000", marginBottom: 2 },
  mockNotifRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F1EFE7" },
  mockNotifText: { fontSize: 12, color: "#232220", lineHeight: 1.35 },
  mockNotifTime: { fontSize: 10.5, color: "#9C9A90", marginTop: 2 },

  app: {
    fontFamily: "'Baloo 2', sans-serif",
    backgroundColor: "#000000",
    minHeight: "100vh",
    maxWidth: 420,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    color: "#FFFFFF",
    position: "relative",
    boxShadow: "0 0 60px rgba(0,0,0,0.15)",
  },
  header: {
    background: "linear-gradient(135deg, #3A3936 0%, #232220 70%)",
    padding: "16px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    position: "relative",
    overflow: "hidden",
  },
  headerTexture: {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(237,230,214,0.035) 1.5px, transparent 1.5px)",
    backgroundSize: "16px 16px",
    pointerEvents: "none",
  },
  headerRow: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 9, position: "relative" },
  headerSearchRow: { display: "flex", alignItems: "center", gap: 9, position: "relative" },
  headerSide: { display: "flex", alignItems: "center", gap: 9 },
  headerAvatarBtn: { background: "none", border: "none", padding: 0, display: "flex", flexShrink: 0 },
  headerIconBtn: { position: "relative", background: "none", border: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  teesBadge: { height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "0 4px", flexShrink: 0 },
  teesBadgeText: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 12, color: "#FFFFFF" },
  headerTitle: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: 0, color: "#FFFFFF", justifySelf: "center", whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.25)" },
  headerSearchInput: { flex: 1, background: "rgba(237,230,214,0.08)", border: "none", borderRadius: 9, padding: "9px 12px", color: "#FFFFFF", fontSize: 14 },
  inboxBadge: { position: "absolute", top: -4, right: -4, background: "#C1443A", color: "#FFFFFF", fontSize: 10, fontWeight: 700, borderRadius: 9, minWidth: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" },
  inboxCard: { background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: 13, marginBottom: 10 },
  activityRow: { display: "flex", alignItems: "center", gap: 10, width: "100%", background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: 13, marginBottom: 10, textAlign: "left" },
  activityRowClickable: { display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, background: "none", border: "none", padding: 0, textAlign: "left" },
  activityUnreadDot: { width: 8, height: 8, borderRadius: "50%", background: "#74C69D", flexShrink: 0 },
  activityTime: { fontSize: 11, color: "#6B6963", marginTop: 3 },
  followBackBtn: { flexShrink: 0, background: "#74C69D", border: "none", borderRadius: 999, padding: "7px 12px", color: "#000000", fontSize: 12, fontWeight: 700 },
  followBackBtnDone: { background: "none", border: "1.5px solid #4A4844", color: "#9C9990" },
  inboxNote: { fontSize: 12.5, color: "#A3A199", marginTop: 5, fontStyle: "italic" },
  declineBtn: { flex: 1, background: "transparent", border: "1.5px solid #74C69D", color: "#A3A199", borderRadius: 8, fontSize: 12.5, fontWeight: 700, padding: "8px 0" },
  declineBtnSm: { background: "transparent", border: "1.5px solid #4A4844", borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" },
  acceptBtn: { flex: 1, background: "#74C69D", border: "none", color: "#000000", borderRadius: 8, fontSize: 12.5, fontWeight: 700, padding: "8px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 },
  declinedChip: { background: "rgba(193,68,58,0.12)", color: "#C1443A", fontSize: 11, fontWeight: 700, borderRadius: 7, padding: "5px 10px", border: "1px solid #C1443A" },
  main: { flex: 1, overflowY: "auto", paddingBottom: 90 },
  tabPad: { padding: "18px 16px 10px" },
  nav: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    maxWidth: 420,
    display: "flex",
    background: "#232220",
    borderTop: "1px solid rgba(45,106,79,0.35)",
    borderRadius: "20px 20px 0 0",
    boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
    padding: "10px 6px 14px",
  },
  navBtn: { flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" },
  navLabel: { fontSize: 11, color: "#FFFFFF" },
  navDot: { position: "absolute", bottom: -8, width: 4, height: 4, borderRadius: 4, background: "#74C69D" },
  centerNavWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" },
  centerNavBtn: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: "#232220",
    border: "3px solid #74C69D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
    boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
  },
  centerNavLabel: { fontSize: 10.5, color: "#FFFFFF", fontWeight: 600 },
  gpsIconWrap: { width: 56, height: 56, borderRadius: "50%", background: "#74C69D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  gpsPreview: { background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, marginTop: 22, overflow: "hidden" },
  gpsPreviewRow: { display: "flex", justifyContent: "space-between", padding: "12px 18px", fontSize: 13, color: "#A3A199" },
  gpsPreviewNum: { fontFamily: "'Baloo 2', sans-serif", color: "#74C69D", fontWeight: 700, fontSize: 15 },
  logBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #8ED9AE, #74C69D)",
    color: "#000000",
    border: "none",
    borderRadius: 12,
    padding: "13px 14px",
    fontWeight: 700,
    fontSize: 14.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 14,
    boxShadow: "0 6px 18px rgba(116,198,157,0.22)",
  },
  card: { borderBottom: "1.5px solid #74C69D", padding: "16px 2px" },
  rowCard: { background: "#232220", border: "1.5px solid #74C69D", borderRadius: 12, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTopRow: { display: "flex", alignItems: "center", gap: 12 },
  postAuthorBtn: { display: "flex", alignItems: "center", gap: 12, flex: 1, background: "none", border: "none", padding: 0, textAlign: "left" },
  homeCourseDisplayBtn: { display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 auto" },
  followCountsRow: { display: "flex", justifyContent: "center", gap: 22, marginTop: 12 },
  followCountsBtn: { background: "none", border: "none", padding: 0, fontSize: 13.5, color: "rgba(255,255,255,0.75)", fontWeight: 600 },
  followCountsNum: { color: "#FFFFFF", fontWeight: 800 },
  followListRow: { display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", padding: "10px 0" },
  homeCourseEditRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 2 },
  homeCourseInput: { background: "#F4F5F1", border: "1px solid #D8DCD3", borderRadius: 8, padding: "6px 10px", fontSize: 13, color: "#000000", textAlign: "center" },
  homeCourseSaveBtn: { width: 26, height: 26, borderRadius: "50%", background: "#74C69D", border: "none", display: "flex", alignItems: "center", justifyContent: "center" },
  cardName: { fontWeight: 700, fontSize: 16.5, color: "#FFFFFF" },
  cardMeta: { fontSize: 13, color: "#9C9990", display: "flex", alignItems: "center", gap: 4, marginTop: 3 },
  noteText: { fontSize: 17, color: "#FFFFFF", marginTop: 8, lineHeight: 1.45, fontWeight: 500 },
  avatarSm: { width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #74C69D", background: "#4A4844", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, flexShrink: 0, boxSizing: "border-box" },
  postAvatar: { width: 46, height: 46, borderRadius: "50%", border: "1.5px solid #74C69D", overflow: "hidden", background: "#4A4844", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 },
  avatarLg: { width: "100%", height: "100%", borderRadius: "50%", background: "#4A4844", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 },
  cardActions: { display: "flex", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.10)" },
  actionBtnFull: { flex: 1, background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", padding: "9px 0" },
  socialLine: { fontSize: 13, color: "#9C9990", marginTop: 14 },
  likersRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 14, background: "none", border: "none", padding: 0 },
  likersStack: { display: "flex", alignItems: "center" },
  likersAvatar: { width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #74C69D", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 700, color: "#000000" },
  likersCountText: { fontSize: 13, color: "#9C9990" },
  kebabBtn: { background: "none", border: "none", padding: 4, display: "flex" },
  menuBackdrop: { position: "fixed", inset: 0, background: "transparent", border: "none", zIndex: 5 },
  postMenu: { position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#3A3936", border: "1.5px solid #74C69D", borderRadius: 10, overflow: "hidden", zIndex: 6, boxShadow: "0 8px 20px rgba(0,0,0,0.35)", minWidth: 150, transformOrigin: "top right", animation: "menuIn 180ms cubic-bezier(0.23, 1, 0.32, 1) both" },
  postMenuDeleteItem: { width: "100%", background: "transparent", border: "none", padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, color: "#C1443A", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" },
  statRow: { display: "flex", gap: 10, marginBottom: 14 },
  statBox: { flex: 1, background: "#232220", border: "1px solid", borderRadius: 12, padding: "10px 6px", textAlign: "center" },
  statValue: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 24 },
  statLabel: { fontSize: 11, color: "#9C9990", marginTop: 2 },
  chartCard: { background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: "12px 8px", marginBottom: 14 },
  chartTitle: { fontSize: 12.5, color: "#9C9990", marginBottom: 4, paddingLeft: 8 },
  sectionLabel: { fontSize: 12.5, color: "#9C9990", fontWeight: 600, margin: "4px 0 8px", textTransform: "uppercase", letterSpacing: 0.6 },
  stickTalkBadge: { height: 46, width: "auto", display: "block" },
  filterCard: { background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: 14, marginBottom: 14 },
  filterHead: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#74C69D", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.6 },
  filterLabel: { display: "block", fontSize: 12.5, color: "#FFFFFF", marginBottom: 10 },
  slider: { width: "100%", marginTop: 6, accentColor: "#74C69D" },
  matchCard: { background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: 12, marginBottom: 10, display: "flex", gap: 10, alignItems: "flex-start" },
  groupCard: { display: "flex", alignItems: "center", gap: 10, width: "100%", background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: 12, marginBottom: 10, textAlign: "left" },
  groupSearchWrap: { display: "flex", alignItems: "center", gap: 8, background: "#171513", border: "1.5px solid #4A4844", borderRadius: 10, padding: "9px 12px", marginTop: 12, marginBottom: 14 },
  groupSearchInput: { flex: 1, background: "none", border: "none", color: "#FFFFFF", fontSize: 14 },
  groupChatScroll: { flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 },
  groupChatRow: { display: "flex", gap: 8, alignItems: "flex-end", maxWidth: "82%" },
  groupChatBubble: { background: "#232220", border: "1.5px solid #4A4844", borderRadius: 14, padding: "8px 12px", fontSize: 14 },
  groupChatBubbleMine: { background: "#74C69D", border: "1.5px solid #74C69D", marginLeft: "auto", alignSelf: "flex-end" },
  groupChatAuthor: { fontSize: 11, color: "#74C69D", fontWeight: 700, marginBottom: 2 },
  groupChatInputRow: { flexShrink: 0, display: "flex", gap: 8, alignItems: "center", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.1)" },
  groupChatInput: { flex: 1, background: "#171513", border: "1.5px solid #4A4844", borderRadius: 999, padding: "10px 16px", color: "#FFFFFF", fontSize: 14 },
  groupChatSendBtn: { flexShrink: 0, background: "#74C69D", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" },
  groupJoinedTag: { marginLeft: 8, fontSize: 10.5, color: "#74C69D", fontWeight: 700 },
  availText: { fontSize: 11.5, color: "#74C69D", marginTop: 3 },
  hcpChip: { fontFamily: "'Baloo 2', sans-serif", fontSize: 11, background: "#171513", border: "1.5px solid #74C69D", borderRadius: 6, padding: "2px 7px" },
  reqBtn: { border: "1px solid", borderRadius: 8, fontSize: 11.5, fontWeight: 700, padding: "6px 10px", whiteSpace: "nowrap" },
  empty: { textAlign: "center", padding: "30px 10px", color: "#9C9990" },
  emptyTitle: { fontWeight: 700, color: "#FFFFFF", marginBottom: 4 },
  emptyBody: { fontSize: 13, lineHeight: 1.5 },
  profileHead: { textAlign: "center", marginBottom: 20 },
  profileName: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 23, marginTop: 10 },
  avatarRing: { width: 76, height: 76, borderRadius: "50%", border: "3px solid #74C69D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: 0, overflow: "hidden" },
  avatarEditBtn: { position: "relative", background: "none", border: "none", padding: 0, display: "block", margin: "0 auto" },
  avatarEditBadge: { position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#74C69D", border: "2px solid #232220", display: "flex", alignItems: "center", justifyContent: "center" },
  avatarEditSpinner: { width: 11, height: 11, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000000", animation: "spin 0.8s linear infinite" },
  avatarRingSm: { width: 62, height: 62, borderRadius: "50%", border: "3px solid #74C69D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: 0, overflow: "hidden" },
  profileViewHead: { textAlign: "center", marginBottom: 16 },
  profileViewName: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 20, color: "#FFFFFF", marginTop: 8 },
  profileViewYouTag: { fontSize: 13, color: "#74C69D", fontWeight: 500 },
  profileViewCourse: { fontSize: 12.5, color: "#9C9990", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 },
  followBtn: { marginTop: 12, background: "#74C69D", border: "none", borderRadius: 999, padding: "9px 22px", color: "#000000", fontSize: 13.5, fontWeight: 700 },
  followBtnDone: { background: "none", border: "1.5px solid #4A4844", color: "#9C9990" },
  profileViewStamp: { background: "#171513", border: "1.5px solid #74C69D", borderRadius: 12, padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 14 },
  profileViewStampLabel: { fontSize: 10, color: "#9C9990", fontWeight: 700, letterSpacing: 0.5, marginTop: 4 },
  profileViewStampValue: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 30, color: "#74C69D", marginTop: 2 },
  stampWrap: { display: "flex", justifyContent: "center", marginBottom: 18 },
  stamp: {
    background: "repeating-conic-gradient(#74C69D 0deg 8deg, #6BBF94 8deg 16deg)",
    borderRadius: "50%",
    width: 136,
    height: 136,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 20px rgba(116,198,157,0.2)",
    transform: "rotate(-3deg)",
  },
  stampInnerRing: {
    width: 112,
    height: 112,
    borderRadius: "50%",
    background: "#EDE6D6",
    border: "2px dashed #1C1B1A",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  stampEyebrow: { fontSize: 9, fontWeight: 700, color: "#000000", letterSpacing: 1 },
  stampValue: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 32, color: "#000000", lineHeight: 1.15 },
  ghinCard: { background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: 13, marginBottom: 14 },
  ghinIconWrap: { width: 34, height: 34, borderRadius: 8, background: "#74C69D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  connectBtn: { background: "transparent", border: "1.5px solid #74C69D", color: "#74C69D", borderRadius: 7, fontSize: 12, fontWeight: 700, padding: "6px 12px" },
  connectedChip: { background: "rgba(116,198,157,0.15)", color: "#74C69D", fontSize: 11, fontWeight: 700, borderRadius: 7, padding: "5px 10px", border: "1.5px solid #74C69D" },
  ghinModalCopy: { fontSize: 13, color: "#A3A199", lineHeight: 1.5, marginBottom: 14 },
  settingsRow: { width: "100%", background: "#232220", border: "1.5px solid #74C69D", borderRadius: 10, padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF", fontSize: 13.5, marginBottom: 8 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", zIndex: 10, animation: "overlayIn 200ms cubic-bezier(0.23, 1, 0.32, 1) both" },
  postViewerOverlay: { position: "fixed", inset: 0, background: "#000000", zIndex: 20, display: "flex", flexDirection: "column", overflowY: "auto", fontFamily: "'Baloo 2', sans-serif" },
  postViewerMediaWrap: { display: "flex", flexDirection: "column", flexShrink: 0 },
  postViewerTop: { flexShrink: 0, background: "#000000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px" },
  postViewerIconBtn: { background: "none", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" },
  postViewerBody: { flex: 1, minHeight: 0, overflowY: "auto", touchAction: "pan-y", padding: "12px 0 18px" },
  postViewerAuthorRow: { display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: "0 16px", textAlign: "left" },
  postViewerDivider: { height: 1, background: "rgba(255,255,255,0.12)", margin: "14px 0" },
  postViewerActionRow: { display: "flex", alignItems: "center", gap: 22, padding: "0 16px" },
  postViewerAction: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, color: "#9C9990", fontSize: 14, fontWeight: 600 },
  postViewerReplyBar: { display: "block", width: "calc(100% - 32px)", margin: "0 16px", textAlign: "left", background: "#1C1B19", border: "none", borderRadius: 999, padding: "12px 16px", color: "#9C9990", fontSize: 14 },
  modal: { background: "#232220", width: "100%", maxWidth: 420, margin: "0 auto", borderRadius: "18px 18px 0 0", padding: 20, border: "1.5px solid #74C69D", borderBottom: "none", animation: "sheetIn 250ms cubic-bezier(0.32, 0.72, 0, 1) both" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 19 },
  iconBtn: { background: "none", border: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: -12 },
  formLabel: { display: "block", fontSize: 12.5, color: "#9C9990", marginBottom: 12 },
  spotsRow: { display: "flex", alignItems: "center", gap: 14, marginTop: 8 },
  spotsBtn: { width: 32, height: 32, borderRadius: "50%", background: "#171513", border: "1.5px solid #74C69D", color: "#74C69D", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  spotsValue: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 22, color: "#FFFFFF", minWidth: 20, textAlign: "center" },
  input: { width: "100%", background: "#171513", border: "1.5px solid #74C69D", borderRadius: 8, padding: "9px 10px", color: "#FFFFFF", fontSize: 14, marginTop: 5 },
  suggestList: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    background: "#3A3936",
    border: "1.5px solid #74C69D",
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
  },
  suggestItem: {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    padding: "9px 10px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#FFFFFF",
    fontSize: 13.5,
    textAlign: "left",
  },
  methodBtn: {
    width: "100%",
    background: "#3A3936",
    border: "1.5px solid #74C69D",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
    textAlign: "center",
  },
  methodTitle: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: 1.2, color: "#FFFFFF" },
  methodDesc: { fontSize: 12, color: "#A3A199" },
  toggleRow: { display: "flex", gap: 8, marginBottom: 14 },
  toggleChip: { flex: 1, background: "#171513", border: "1.5px solid #74C69D", borderRadius: 8, padding: "9px 6px", fontSize: 12.5, color: "#A3A199", fontWeight: 600 },
  toggleChipActive: { background: "#74C69D", color: "#000000", border: "1.5px solid #74C69D" },
  ratingSlopeRow: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9C9990", marginBottom: 12, lineHeight: 1.4 },
  teeChipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 },
  teeChip: { background: "#171513", border: "1.5px solid #74C69D", borderRadius: 8, padding: "7px 12px", fontSize: 12.5, color: "#A3A199", fontWeight: 600 },
  teeChipActive: { background: "#74C69D", color: "#000000", border: "1.5px solid #74C69D" },
  backBtn: { flex: "0 0 84px", background: "transparent", border: "1.5px solid #74C69D", borderRadius: 10, color: "#A3A199", fontWeight: 700, fontSize: 13.5 },
  holeHeaderRow: { display: "flex", alignItems: "center", gap: 8, padding: "0 4px 6px", fontSize: 11, color: "#9C9990", fontWeight: 700, letterSpacing: 0.4 },
  holeRow: { display: "flex", alignItems: "center", gap: 8, padding: "5px 4px", borderBottom: "1px solid rgba(255,255,255,0.10)" },
  holeNum: { width: 26, fontSize: 12.5, color: "#A3A199", fontWeight: 600 },
  holeInput: { width: 50, background: "#171513", border: "1.5px solid #74C69D", borderRadius: 7, padding: "6px 4px", color: "#FFFFFF", fontSize: 13, textAlign: "center" },
  dotToggle: { width: 22, height: 22, borderRadius: "50%", border: "1.5px solid #4A4844", background: "transparent" },
  dotToggleActive: { background: "#74C69D", borderColor: "#74C69D" },
  holeTotalRow: { textAlign: "right", fontSize: 13.5, color: "#FFFFFF", padding: "10px 4px 0", fontWeight: 600 },
  holeGridSectionLabel: { fontSize: 11, color: "#9C9990", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "10px 2px 6px" },
  holeGridRow: { display: "flex", gap: 4, marginBottom: 4 },
  holeGridCell: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", background: "#171513", borderRadius: 8, padding: "6px 2px 8px" },
  holeGridNum: { fontSize: 10, color: "#9C9990", fontWeight: 700, marginBottom: 2 },
  // Placeholder par until real per-course par data is wired in — currently
  // just the generic PAR_LAYOUT used everywhere else as a default.
  holeGridPar: { fontSize: 8.5, color: "#74C69D", fontWeight: 600, marginBottom: 4 },
  holeGridInput: { width: "100%", background: "#232220", border: "1.5px solid #74C69D", borderRadius: 6, padding: "5px 0", color: "#FFFFFF", fontSize: 14, fontWeight: 700, textAlign: "center" },

  // ---- Composer / feed extras ----
  composerTrigger: { width: "100%", background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 18, textAlign: "left", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
  composerPlaceholder: { flex: 1, fontSize: 13, color: "#9C9990" },
  sectionBreak: { height: 1, background: "rgba(255,255,255,0.18)", margin: "0 0 16px" },
  snapshotCard: {
    background: "#232220",
    border: "1.5px solid #74C69D",
    borderRadius: 16,
    padding: "10px 14px 12px",
    marginBottom: 14,
  },
  snapshotHeadRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  snapshotEyebrow: { fontSize: 11.5, color: "#9C9990", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" },
  snapshotPostBtn: { background: "none", border: "none", color: "#74C69D", fontSize: 12.5, fontWeight: 700 },
  snapshotRow: { display: "flex" },
  snapshotCol: { flex: 1 },
  snapshotLabel: { fontSize: 11, color: "#9C9990" },
  snapshotValue: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 21, color: "#FFFFFF", marginTop: 2, lineHeight: 1 },
  matchConfirmedTile: { display: "flex", alignItems: "center", gap: 10, background: "#232220", border: "1.5px solid #74C69D", borderRadius: 14, padding: "10px 14px", marginBottom: 14 },
  matchConfirmedIconWrap: { width: 28, height: 28, borderRadius: "50%", background: "#74C69D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  matchConfirmedText: { fontSize: 13.5, color: "#FFFFFF", fontWeight: 600, lineHeight: 1.35 },
  matchConfirmedMeta: { fontSize: 11, color: "#9C9990", marginTop: 2 },
  composerTextarea: { width: "100%", background: "#171513", border: "1.5px solid #74C69D", borderRadius: 10, padding: 12, color: "#FFFFFF", fontSize: 14, resize: "none", marginBottom: 12, fontFamily: "inherit" },
  composerImageWrap: { position: "relative", marginBottom: 14 },
  composerImageRemove: { position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 8, background: "rgba(11,31,25,0.7)", border: "none", display: "flex", alignItems: "center", justifyContent: "center" },
  addPhotoBtn: { width: "100%", background: "#171513", border: "1px dashed #4A4844", borderRadius: 10, padding: "11px 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, color: "#74C69D", fontSize: 13, fontWeight: 600, marginBottom: 14 },
  shareRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#171513", border: "1.5px solid #74C69D", borderRadius: 10, padding: "11px 13px", marginBottom: 14 },
  shareRowTitle: { fontSize: 13.5, fontWeight: 600, color: "#FFFFFF" },
  shareRowSub: { fontSize: 11.5, color: "#9C9990", marginTop: 2 },
  switchTrack: { width: 40, height: 22, borderRadius: 11, background: "#4A4844", border: "none", padding: 2, display: "flex", alignItems: "center", flexShrink: 0, transition: "background 150ms cubic-bezier(0.23, 1, 0.32, 1)" },
  switchTrackOn: { background: "#74C69D" },
  switchThumb: { width: 18, height: 18, borderRadius: "50%", background: "#EDE6D6", transition: "transform 0.15s ease" },
  postImageWrap: { marginTop: 10 },
  postScorecardWrap: { marginTop: 10 },
  postScorecardWrapLarge: { width: "100%", padding: "0 12px", boxSizing: "border-box", flexShrink: 0 },
  // touchAction "pan-x" alone blocks vertical panning entirely for any touch
  // that starts on the carousel, which froze the whole page's scroll while a
  // thumb was resting on a photo/scorecard. "pan-x pan-y" lets the browser's
  // normal gesture-direction detection decide: a mostly-horizontal drag
  // scrolls the carousel, a mostly-vertical drag scrolls the page.
  // No overscrollBehaviorY here — with overflowY hidden it blocked desktop
  // mouse-wheel scroll from chaining up to the page (touch was unaffected
  // since touchAction already governs that).
  postMediaScroll: { display: "flex", alignItems: "flex-start", gap: 10, overflowX: "auto", overflowY: "hidden", touchAction: "pan-x pan-y", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none", marginTop: 10 },
  postMediaScrollItem: { flex: "0 0 100%", scrollSnapAlign: "start" },
  postMediaDots: { display: "flex", justifyContent: "center", gap: 6, marginTop: 8 },
  postMediaDot: { width: 6, height: 6, borderRadius: "50%" },
  // height:"100%" is the actual fix for the scorecard-vs-photo size
  // mismatch: without it, this card's own cream background/border only grew
  // as tall as its content (~350-380px) and sat top-aligned inside the
  // taller fixed-height box used everywhere in the feed, leaving a gap of
  // plain background below it — so it visibly looked shorter than a photo
  // in the same slot, even though the invisible bounding box was identical.
  // No marginTop here — this card now always fills a fixed-height,
  // overflow:hidden box (see PostMedia). A margin here would push the card
  // down while its own height stayed the same, clipping the same number of
  // pixels off the bottom — same box, but visibly sunk. Any spacing above
  // the card belongs on the wrapper (postScorecardWrap / postMediaScroll),
  // not here.
  scorecardWrap: { background: "#F5EFDD", border: "1.5px solid #74C69D", borderRadius: 18, padding: "13px 12px", height: "100%", display: "flex", flexDirection: "column" },
  scorecardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, padding: "0 2px" },
  scorecardTitle: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 16, color: "#000000" },
  scorecardTeeLine: { fontSize: 12, color: "#6B6963", marginTop: 2 },
  scorecardHoleRow: { display: "flex", gap: 6 },
  scorecardCell: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  scorecardCellNumBadge: { width: "100%", textAlign: "center", fontSize: 12, color: "#9C9990", fontWeight: 700, background: "#EDE4CC", borderRadius: 8, padding: "4px 0", boxSizing: "border-box" },
  scorecardCellMain: { width: "100%", background: "#EDE4CC", borderRadius: 12, padding: "6px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" },
  // Same placeholder-par idea as the score-entry grid — real per-course par
  // data will replace PAR_LAYOUT here later. The card's box size is locked
  // (see HANDOFF.md) — this just uses the space that used to sit empty at
  // the bottom, it doesn't grow the card.
  scorecardCellPar: { fontFamily: "'Baloo 2', sans-serif", fontSize: 15, color: "#000000", fontWeight: 800 },
  scorecardCellDivider: { width: "82%", height: 1, background: "#9C9990", margin: "5px 0 4px" },
  scorecardCellScore: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 16, marginTop: 2 },
  scoreMarkRing: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, border: "1.5px solid #000000", boxSizing: "border-box" },
  scoreMarkOuterRing: { minWidth: 30, height: 30, padding: 2 },
  scoreMarkSlot: { height: 30, display: "flex", alignItems: "center", justifyContent: "center" },
  scorecardDivider: { width: "100%", height: 1, background: "#C9C2AC", margin: "10px 0", flexShrink: 0 },
  scorecardSummaryRow: { display: "flex", marginTop: 10, paddingTop: 10 },
  scorecardSummaryItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center" },
  scorecardSummaryLabel: { fontSize: 10.5, color: "#6B6963", fontWeight: 700, letterSpacing: 0.5 },
  scorecardSummaryValue: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 24, color: "#000000", marginTop: 3 },
  scorecardFoot: { fontFamily: "'Baloo 2', sans-serif", fontSize: 12, color: "#6B6963", marginTop: 8, textAlign: "center" },
  scorecardTicket: { background: "#F5EFDD", border: "1.5px solid #74C69D", borderRadius: 18, padding: 18, marginTop: 12 },
  scorecardTicketTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  scorecardTicketCourse: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 16, color: "#000000" },
  scorecardTicketDate: { fontSize: 11.5, color: "#6B6963" },
  scorecardTicketMain: { display: "flex", alignItems: "baseline", gap: 10, justifyContent: "center", marginBottom: 8 },
  scorecardTicketScore: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 44, color: "#000000", lineHeight: 1 },
  scorecardTicketToPar: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 20 },
  scorecardTicketFoot: { fontFamily: "'Baloo 2', sans-serif", fontSize: 12, color: "#6B6963", textAlign: "center" },
  commentPreviewWrap: { marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.10)" },
  commentPreviewLine: { fontSize: 13.5, color: "#D6D4CC", marginBottom: 4, lineHeight: 1.45 },
  commentPreviewAuthor: { fontWeight: 700, color: "#FFFFFF" },
  viewAllComments: { background: "none", border: "none", color: "#9C9990", fontSize: 12, marginTop: 2 },
  commentRowBtn: { display: "flex", gap: 10, marginBottom: 14, width: "100%", background: "none", border: "none", padding: 0, textAlign: "left" },
  commentInputRow: { display: "flex", gap: 8, alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.10)" },
  commentSendBtn: { width: 36, height: 36, borderRadius: "50%", background: "#74C69D", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
};
