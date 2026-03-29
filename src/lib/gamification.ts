/* ------------------------------------------------------------------ */
/*  RunPayway™ — Gamification Engine                                   */
/*  Badges, milestones, streaks — persisted in localStorage            */
/* ------------------------------------------------------------------ */

const BADGES_KEY = "rp_badges";
const STREAKS_KEY = "rp_streaks";
const MILESTONES_KEY = "rp_milestones";

/* ── Badge definitions ── */

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  earnedAt: string | null;
}

const BADGE_DEFS: Omit<Badge, "earnedAt">[] = [
  { id: "first_report", label: "First Step", description: "Completed your first Income Stability Report", icon: "first_report" },
  { id: "simulator_explorer", label: "Stability Seeker", description: "Tested your first scenario in the Simulator", icon: "simulator_explorer" },
  { id: "pressuremap_viewer", label: "Risk Navigator", description: "Explored your PressureMap zones", icon: "pressuremap_viewer" },
  { id: "action_starter", label: "Action Taker", description: "Completed your first action item", icon: "action_starter" },
  { id: "action_half", label: "Halfway There", description: "Completed 50% of your action items", icon: "action_half" },
  { id: "action_complete", label: "Plan Complete", description: "Completed all action items", icon: "action_complete" },
  { id: "score_up_5", label: "Rising Score", description: "Improved your score by 5+ points", icon: "score_up_5" },
  { id: "score_up_10", label: "Momentum Builder", description: "Improved your score by 10+ points", icon: "score_up_10" },
  { id: "band_shift", label: "Band Breaker", description: "Moved to a higher stability band", icon: "band_shift" },
  { id: "streak_3", label: "Consistent", description: "Visited your dashboard 3 days in a row", icon: "streak_3" },
  { id: "streak_7", label: "Dedicated", description: "Visited your dashboard 7 days in a row", icon: "streak_7" },
  { id: "two_assessments", label: "Progress Tracker", description: "Completed 2 assessments to track progress", icon: "two_assessments" },
];

/* ── Read/write helpers ── */

function readBadges(): Badge[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return BADGE_DEFS.map(b => ({ ...b, earnedAt: null }));
}

function writeBadges(badges: Badge[]): void {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string | null;
  totalVisits: number;
}

function readStreaks(): StreakData {
  if (typeof window === "undefined") return { currentStreak: 0, longestStreak: 0, lastVisit: null, totalVisits: 0 };
  try {
    const raw = localStorage.getItem(STREAKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { currentStreak: 0, longestStreak: 0, lastVisit: null, totalVisits: 0 };
}

function writeStreaks(data: StreakData): void {
  localStorage.setItem(STREAKS_KEY, JSON.stringify(data));
}

export interface Milestone {
  id: string;
  label: string;
  achievedAt: string | null;
}

function readMilestones(): Milestone[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MILESTONES_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function writeMilestones(milestones: Milestone[]): void {
  localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
}

/* ── Public API ── */

/** Get all badges with earned status */
export function getBadges(): Badge[] {
  const stored = readBadges();
  // Ensure all defined badges exist (handles new badges added after user first visit)
  const ids = new Set(stored.map(b => b.id));
  for (const def of BADGE_DEFS) {
    if (!ids.has(def.id)) stored.push({ ...def, earnedAt: null });
  }
  return stored;
}

/** Award a badge by ID. Returns the badge if newly earned, null if already earned. */
export function earnBadge(badgeId: string): Badge | null {
  const badges = getBadges();
  const badge = badges.find(b => b.id === badgeId);
  if (!badge || badge.earnedAt) return null;
  badge.earnedAt = new Date().toISOString();
  writeBadges(badges);
  return badge;
}

/** Record a dashboard visit, update streak. Returns newly earned badges. */
export function recordVisit(): Badge[] {
  const streaks = readStreaks();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const earned: Badge[] = [];

  if (streaks.lastVisit === today) return earned; // Already counted today

  const lastDate = streaks.lastVisit ? new Date(streaks.lastVisit) : null;
  const isConsecutive = lastDate && (now.getTime() - lastDate.getTime()) < 2 * 24 * 60 * 60 * 1000;

  streaks.currentStreak = isConsecutive ? streaks.currentStreak + 1 : 1;
  streaks.longestStreak = Math.max(streaks.longestStreak, streaks.currentStreak);
  streaks.lastVisit = today;
  streaks.totalVisits += 1;
  writeStreaks(streaks);

  // Check streak badges
  if (streaks.currentStreak >= 3) {
    const b = earnBadge("streak_3");
    if (b) earned.push(b);
  }
  if (streaks.currentStreak >= 7) {
    const b = earnBadge("streak_7");
    if (b) earned.push(b);
  }

  return earned;
}

/** Get current streak data */
export function getStreaks(): StreakData {
  return readStreaks();
}

/** Check score improvement and award badges. Call with old score and new score. */
export function checkScoreImprovement(oldScore: number, newScore: number, oldBand: string, newBand: string): Badge[] {
  const earned: Badge[] = [];
  const improvement = newScore - oldScore;

  if (improvement >= 5) {
    const b = earnBadge("score_up_5");
    if (b) earned.push(b);
  }
  if (improvement >= 10) {
    const b = earnBadge("score_up_10");
    if (b) earned.push(b);
  }
  if (newBand !== oldBand && bandRank(newBand) > bandRank(oldBand)) {
    const b = earnBadge("band_shift");
    if (b) earned.push(b);
  }

  return earned;
}

function bandRank(band: string): number {
  if (band.includes("High")) return 4;
  if (band.includes("Established")) return 3;
  if (band.includes("Developing")) return 2;
  return 1;
}

/** Check action completion and award badges */
export function checkActionProgress(completed: number, total: number): Badge[] {
  const earned: Badge[] = [];
  if (completed >= 1) {
    const b = earnBadge("action_starter");
    if (b) earned.push(b);
  }
  if (total > 0 && completed >= Math.ceil(total / 2)) {
    const b = earnBadge("action_half");
    if (b) earned.push(b);
  }
  if (total > 0 && completed >= total) {
    const b = earnBadge("action_complete");
    if (b) earned.push(b);
  }
  return earned;
}

/** Record a milestone event */
export function recordMilestone(id: string, label: string): void {
  const milestones = readMilestones();
  if (milestones.some(m => m.id === id)) return;
  milestones.push({ id, label, achievedAt: new Date().toISOString() });
  writeMilestones(milestones);
}

/** Get all recorded milestones */
export function getMilestones(): Milestone[] {
  return readMilestones();
}

/** Get count of earned badges */
export function getEarnedCount(): { earned: number; total: number } {
  const badges = getBadges();
  return { earned: badges.filter(b => b.earnedAt).length, total: badges.length };
}
