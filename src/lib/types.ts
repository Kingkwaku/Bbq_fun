export type Team = "ghana" | "nigeria" | "neutral";

export type GameId =
  | "cup-pyramid-kickdown"
  | "top-corner-cup-shot"
  | "cone-top-sniper"
  | "bucket-toss"
  | "tiny-goal-shot"
  | "cup-bowling";

export interface Player {
  id: string;
  name: string;
  team: Team;
  /** points keyed by GameId; missing key === not played yet */
  scores: Partial<Record<GameId, number>>;
  createdAt: number;
}

/** Player decorated with derived leaderboard fields. */
export interface RankedPlayer extends Player {
  total: number;
  rank: number;
  /** fraction 0..1 of the current leader's total (for progress bars) */
  progress: number;
}

export interface GameState {
  lastUpdatedBy: string | null;
  lastUpdatedAt: number | null;
}

export interface GameMeta {
  id: GameId;
  label: string;
  /** short, fun one-liner */
  blurb: string;
  /** lucide-react icon name */
  icon: string;
  emoji: string;
  /** suggested max points for the quick-entry stepper */
  suggestedMax: number;
}
