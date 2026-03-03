// @ts-nocheck

interface RawVideo {
  id: string;
  title: string;
  channel: string;
  view_count: number | null;
  like_count: number | null;
  upload_date: string | null; // "YYYYMMDD"
  channel_follower_count: number | null;
  duration: number | null;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const WORST_RECENCY_DAYS = 365;

function daysSinceUpload(s: string | null): number {
  if (!s || s.length !== 8) return WORST_RECENCY_DAYS;
  const year = parseInt(s.slice(0, 4));
  const month = parseInt(s.slice(4, 6)) - 1;
  const day = parseInt(s.slice(6, 8));
  const uploaded = new Date(year, month, day);
  if (isNaN(uploaded.getTime())) return WORST_RECENCY_DAYS;
  return Math.max(0, (Date.now() - uploaded.getTime()) / MS_PER_DAY);
}

function logNorm(x: number, max: number): number {
  if (max <= 0) return 0;
  return Math.log(1 + x) / Math.log(1 + max);
}

function formatAge(days: number): string {
  if (days < 1) return "today";
  if (days < 2) return "1 day";
  if (days < 7) return `${Math.floor(days)} days`;
  if (days < 14) return "1 week";
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  if (days < 60) return "1 month";
  if (days < 365) return `${Math.floor(days / 30)} months`;
  if (days < 730) return "1 year";
  return `${Math.floor(days / 365)} years`;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "...";
}

const args = process.argv.slice(2);
const debug = args.includes("--debug");
const positional = args.filter((a) => a !== "--debug");

// Last arg is N if it's a number, otherwise it's part of the query
const lastArg = positional[positional.length - 1];
const lastIsNumber = lastArg && /^\d+$/.test(lastArg);
const N = lastIsNumber ? parseInt(lastArg, 10) : 10;
const query = (lastIsNumber ? positional.slice(0, -1) : positional).join(" ");

const log = debug ? (...a: unknown[]) => console.error("[debug]", ...a) : () => {};

if (!query) {
  console.error("Usage: rank-videos.ts <query> [N=10] [--debug]");
  process.exit(1);
}

const ytCmd = ["yt-dlp", `ytsearch25:${query}`, "-j", "--no-warnings"];
log("command:", ytCmd.join(" "));

const proc = Bun.spawnSync(ytCmd, {
  stdout: "pipe",
  stderr: "pipe",
});

const stdout = proc.stdout.toString();

if (proc.exitCode !== 0 && !stdout.trim()) {
  console.error(`yt-dlp failed: ${proc.stderr.toString().trim()}`);
  process.exit(1);
}

function tryParseJSON(line: string): RawVideo | null {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

const videos: RawVideo[] = stdout
  .split("\n")
  .filter((line) => line.trim())
  .map(tryParseJSON)
  .filter((v): v is RawVideo => v !== null);

if (videos.length === 0) {
  console.log(`No videos found for "${query}"`);
  process.exit(0);
}

log(`fetched ${videos.length} videos`);

const maxViews = Math.max(...videos.map((v) => v.view_count ?? 0));
const maxFollowers = Math.max(...videos.map((v) => v.channel_follower_count ?? 0));

log(`normalization: maxViews=${formatNumber(maxViews)}, maxFollowers=${formatNumber(maxFollowers)}`);

// Weights: views 30%, likes 25%, recency 25%, channel followers 20%
const scored = videos.map((v, originalIndex) => {
  const views = v.view_count ?? 0;
  const likes = v.like_count ?? 0;
  const followers = v.channel_follower_count ?? 0;
  const daysOld = daysSinceUpload(v.upload_date);

  const viewScore = logNorm(views, maxViews);
  const likeRatio = likes / (likes + 1); // asymptotic 0-1 scale, rewards any likes
  const recency = Math.max(0, 1 - daysOld / WORST_RECENCY_DAYS);
  const followerScore = logNorm(followers, maxFollowers);

  const score = 0.3 * viewScore + 0.25 * likeRatio + 0.25 * recency + 0.2 * followerScore;

  log(
    `  [${originalIndex}] ${truncate(v.title ?? "?", 40)} => ${score.toFixed(3)}`,
    `(view=${viewScore.toFixed(2)} like=${likeRatio.toFixed(2)} rec=${recency.toFixed(2)} fol=${followerScore.toFixed(2)})`,
  );

  return { ...v, score, daysOld, originalIndex };
});

scored.sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

const results = scored.slice(0, N);

console.log("| # | Score | Title | Channel | Views | Likes | Age | Link |");
console.log("|---|-------|-------|---------|-------|-------|-----|------|");

results.forEach((v, i) => {
  const row = [
    i + 1,
    v.score.toFixed(3),
    v.title ?? "Untitled",
    v.channel ?? "Unknown",
    formatNumber(v.view_count ?? 0),
    formatNumber(v.like_count ?? 0),
    formatAge(v.daysOld),
    `https://youtube.com/watch?v=${v.id}`,
  ];
  console.log(`| ${row.join(" | ")} |`);
});

if (videos.length < N) {
  console.log(`\n_Note: only ${videos.length} results found (requested ${N})._`);
}
