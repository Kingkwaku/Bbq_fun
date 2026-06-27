import type { Player, RankedPlayer, Team } from "./types";

/** Sum of a player's points across all games. */
export function totalPoints(player: Player): number {
  return Object.values(player.scores).reduce(
    (sum, v) => sum + (Number(v) || 0),
    0,
  );
}

/** Count of games the player has a recorded score for. */
export function gamesPlayed(player: Player): number {
  return Object.values(player.scores).filter((v) => typeof v === "number").length;
}

/**
 * Sort players by total (desc), tie-break by games played then earliest join.
 * Returns players decorated with total, rank (1-based, dense for ties) and
 * progress (fraction of the leader's total, for progress bars).
 */
export function rankPlayers(players: Player[]): RankedPlayer[] {
  const withTotals = players.map((p) => ({ ...p, total: totalPoints(p) }));

  withTotals.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    const gp = gamesPlayed(b) - gamesPlayed(a);
    if (gp !== 0) return gp;
    return a.createdAt - b.createdAt;
  });

  const leaderTotal = withTotals[0]?.total ?? 0;

  let lastTotal: number | null = null;
  let lastRank = 0;
  return withTotals.map((p, i) => {
    const rank = p.total === lastTotal ? lastRank : i + 1;
    lastTotal = p.total;
    lastRank = rank;
    return {
      ...p,
      rank,
      progress: leaderTotal > 0 ? p.total / leaderTotal : 0,
    };
  });
}

export interface FunLabel {
  text: string;
  tone: "champion" | "rising" | "jollof";
}

/**
 * Fun labels keyed by player id:
 *  - Current Champion  -> rank 1 (needs > 0 points)
 *  - Rising Star       -> rank 2 (needs > 0 points)
 *  - Needs Jollof Energy -> last place when there's a real spread
 */
export function funLabels(ranked: RankedPlayer[]): Record<string, FunLabel> {
  const labels: Record<string, FunLabel> = {};
  if (ranked.length === 0) return labels;

  const champ = ranked.find((p) => p.rank === 1 && p.total > 0);
  if (champ) labels[champ.id] = { text: "Current Champion", tone: "champion" };

  const rising = ranked.find((p) => p.rank === 2 && p.total > 0);
  if (rising) labels[rising.id] = { text: "Rising Star", tone: "rising" };

  // Last place only worth calling out once a few points are on the board.
  const last = ranked[ranked.length - 1];
  const maxTotal = ranked[0]?.total ?? 0;
  if (last && ranked.length >= 3 && maxTotal >= 5 && last.total < maxTotal && !labels[last.id]) {
    labels[last.id] = { text: "Needs Jollof Energy", tone: "jollof" };
  }

  return labels;
}

/** Best total for a given team. */
function topForTeam(ranked: RankedPlayer[], team: Team): RankedPlayer | undefined {
  return ranked.find((p) => p.team === team);
}

export interface JollofDerby {
  active: boolean;
  ghanaTop?: RankedPlayer;
  nigeriaTop?: RankedPlayer;
  margin: number;
}

/**
 * "Jollof Derby" fires when the top Ghana and top Nigeria players are neck and
 * neck — within DERBY_MARGIN points and both actually on the board.
 */
export const DERBY_MARGIN = 5;

export function jollofDerby(ranked: RankedPlayer[]): JollofDerby {
  const ghanaTop = topForTeam(ranked, "ghana");
  const nigeriaTop = topForTeam(ranked, "nigeria");
  if (!ghanaTop || !nigeriaTop || (ghanaTop.total === 0 && nigeriaTop.total === 0)) {
    return { active: false, ghanaTop, nigeriaTop, margin: Infinity };
  }
  const margin = Math.abs(ghanaTop.total - nigeriaTop.total);
  return { active: margin <= DERBY_MARGIN, ghanaTop, nigeriaTop, margin };
}

/** Aggregate points per family — used for the team tug-of-war bar. */
export function teamTotals(players: Player[]): Record<Team, number> {
  return players.reduce(
    (acc, p) => {
      acc[p.team] += totalPoints(p);
      return acc;
    },
    { ghana: 0, nigeria: 0, neutral: 0 } as Record<Team, number>,
  );
}
