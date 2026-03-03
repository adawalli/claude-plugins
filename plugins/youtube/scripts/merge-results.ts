// @ts-nocheck

interface RankedResult {
  id: string;
  score: number;
  title: string;
  channel: string;
  description: string;
  views: number;
  likes: number;
  age: string;
  daysOld: number;
}

interface QueryRun {
  query: string;
  total: number;
  results: RankedResult[];
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
const table = args.includes("--table");
const positional = args.filter((a) => !a.startsWith("--"));

const N = positional.length > 0 && /^\d+$/.test(positional[0]) ? parseInt(positional[0], 10) : 10;

const log = debug ? (...a: unknown[]) => console.error("[debug]", ...a) : () => {};

const input = await Bun.stdin.text();
let runs: QueryRun[];
try {
  runs = JSON.parse(input);
} catch {
  console.error("Failed to parse stdin as JSON");
  process.exit(1);
}

if (!Array.isArray(runs) || runs.length === 0) {
  console.error("Expected a non-empty JSON array on stdin");
  process.exit(1);
}

log(`received ${runs.length} query runs`);

const allResults = runs.flatMap((run) => run.results ?? []);

log(`total results before dedup: ${allResults.length}`);

const appearances = new Map<string, number>();
const best = new Map<string, RankedResult>();

for (const r of allResults) {
  appearances.set(r.id, (appearances.get(r.id) ?? 0) + 1);
  const existing = best.get(r.id);
  if (!existing || r.score > existing.score) {
    best.set(r.id, r);
  }
}

log(`unique videos: ${best.size}, duplicates removed: ${allResults.length - best.size}`);

const merged = [...best.values()].map((r) => {
  const count = appearances.get(r.id) ?? 1;
  const bonus = 0.03 * (count - 1);
  const adjustedScore = parseFloat((r.score + bonus).toFixed(3));
  log(
    `  ${r.id} appearances=${count} base=${r.score} bonus=${bonus.toFixed(3)} final=${adjustedScore}`,
  );
  return { ...r, score: adjustedScore };
});

merged.sort((a, b) => b.score - a.score);
const top = merged.slice(0, N);

if (table) {
  console.log("| # | Score | Title | Channel | Views | Age | Link |");
  console.log("|---|-------|-------|---------|-------|-----|------|");
  top.forEach((r, i) => {
    const url = `https://youtube.com/watch?v=${r.id}`;
    console.log(
      `| ${i + 1} | ${r.score.toFixed(3)} | ${truncate(r.title, 50)} | ${r.channel} | ${formatNumber(r.views)} | ${r.age} | [Watch](${url}) |`,
    );
  });
} else {
  console.log(JSON.stringify({ total: top.length, results: top }));
}
