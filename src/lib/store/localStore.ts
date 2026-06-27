import type { GameId, GameState, Player } from "../types";
import {
  EMPTY_STATE,
  type NewPlayerInput,
  type Store,
  type StoreSnapshot,
} from "./types";

const PLAYERS_KEY = "africup:players:v1";
const STATE_KEY = "africup:state:v1";
const EVENT = "africup:changed";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Player[]) : [];
  } catch {
    return [];
  }
}

function readState(): GameState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as GameState) : { ...EMPTY_STATE };
  } catch {
    return { ...EMPTY_STATE };
  }
}

function writePlayers(players: Player[]) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

function writeState(state: GameState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function stamp(by: string): GameState {
  const state: GameState = { lastUpdatedBy: by, lastUpdatedAt: Date.now() };
  writeState(state);
  return state;
}

function emit() {
  window.dispatchEvent(new CustomEvent(EVENT));
}

/**
 * localStorage-backed store. Stays in sync across tabs of the same browser via
 * the native `storage` event, and within a tab via a custom event.
 */
export const localStore: Store = {
  mode: "local",

  async load(): Promise<StoreSnapshot> {
    return { players: readPlayers(), state: readState() };
  },

  async addPlayer({ name, team }: NewPlayerInput): Promise<Player> {
    const players = readPlayers();
    const player: Player = {
      id: uid(),
      name: name.trim(),
      team,
      scores: {},
      createdAt: Date.now(),
    };
    players.push(player);
    writePlayers(players);
    emit();
    return player;
  },

  async addManyPlayers(inputs: NewPlayerInput[]): Promise<void> {
    const players = readPlayers();
    const base = Date.now();
    inputs.forEach((input, i) => {
      players.push({
        id: uid(),
        name: input.name.trim(),
        team: input.team,
        scores: {},
        createdAt: base + i,
      });
    });
    writePlayers(players);
    emit();
  },

  async updateScore(
    playerId: string,
    gameId: GameId,
    points: number,
    by: string,
  ): Promise<void> {
    const players = readPlayers();
    const p = players.find((x) => x.id === playerId);
    if (!p) return;
    p.scores = { ...p.scores, [gameId]: Math.max(0, Math.round(points)) };
    writePlayers(players);
    stamp(by);
    emit();
  },

  async editPlayer(playerId, patch): Promise<void> {
    const players = readPlayers();
    const p = players.find((x) => x.id === playerId);
    if (!p) return;
    if (patch.name !== undefined) p.name = patch.name.trim();
    if (patch.team !== undefined) p.team = patch.team;
    writePlayers(players);
    emit();
  },

  async removePlayer(playerId: string): Promise<void> {
    writePlayers(readPlayers().filter((x) => x.id !== playerId));
    emit();
  },

  async resetScores(by: string): Promise<void> {
    const players = readPlayers().map((p) => ({ ...p, scores: {} }));
    writePlayers(players);
    stamp(by);
    emit();
  },

  subscribe(cb: (snap: StoreSnapshot) => void): () => void {
    const handler = () => {
      cb({ players: readPlayers(), state: readState() });
    };
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};
