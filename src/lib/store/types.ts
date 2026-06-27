import type { GameId, GameState, Player, Team } from "../types";

export interface StoreSnapshot {
  players: Player[];
  state: GameState;
}

export interface NewPlayerInput {
  name: string;
  team: Team;
}

/**
 * Single data-access contract. Two implementations back it:
 *  - localStore  (browser localStorage, single device, zero config)
 *  - supabaseStore (Supabase + realtime, live multi-device sync)
 * The active one is chosen at runtime in ./index.ts.
 */
export interface Store {
  readonly mode: "cloud" | "local";

  /** Fetch the current snapshot. */
  load(): Promise<StoreSnapshot>;

  addPlayer(input: NewPlayerInput): Promise<Player>;
  updateScore(
    playerId: string,
    gameId: GameId,
    points: number,
    by: string,
  ): Promise<void>;
  editPlayer(
    playerId: string,
    patch: Partial<Pick<Player, "name" | "team">>,
  ): Promise<void>;
  removePlayer(playerId: string): Promise<void>;
  /** Zero every player's scores (keeps the players). */
  resetScores(by: string): Promise<void>;
  /** Bulk insert (used by the "Add sample players" seed button). */
  addManyPlayers(inputs: NewPlayerInput[]): Promise<void>;

  /** Subscribe to snapshot changes. Returns an unsubscribe fn. */
  subscribe(cb: (snap: StoreSnapshot) => void): () => void;
}

export const EMPTY_STATE: GameState = { lastUpdatedBy: null, lastUpdatedAt: null };
