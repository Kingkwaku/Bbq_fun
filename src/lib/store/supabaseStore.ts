import type { GameId, GameState, Player } from "../types";
import { getSupabase } from "../supabaseClient";
import {
  EMPTY_STATE,
  type NewPlayerInput,
  type Store,
  type StoreSnapshot,
} from "./types";

/** Fixed single-row id for the shared game_state row. */
const STATE_ROW_ID = 1;

interface PlayerRow {
  id: string;
  name: string;
  team: string;
  scores: Record<string, number> | null;
  created_at: string;
}

function rowToPlayer(r: PlayerRow): Player {
  return {
    id: r.id,
    name: r.name,
    team: (r.team as Player["team"]) ?? "neutral",
    scores: (r.scores ?? {}) as Player["scores"],
    createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
  };
}

async function fetchSnapshot(): Promise<StoreSnapshot> {
  const sb = getSupabase();
  if (!sb) return { players: [], state: { ...EMPTY_STATE } };

  const [{ data: playerRows }, { data: stateRow }] = await Promise.all([
    sb.from("players").select("*").order("created_at", { ascending: true }),
    sb.from("game_state").select("*").eq("id", STATE_ROW_ID).maybeSingle(),
  ]);

  const players = (playerRows ?? []).map((r) => rowToPlayer(r as PlayerRow));
  const state: GameState = stateRow
    ? {
        lastUpdatedBy: (stateRow as { last_updated_by: string | null }).last_updated_by,
        lastUpdatedAt: (stateRow as { last_updated_at: string | null }).last_updated_at
          ? Date.parse((stateRow as { last_updated_at: string }).last_updated_at)
          : null,
      }
    : { ...EMPTY_STATE };

  return { players, state };
}

async function stamp(by: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("game_state").upsert({
    id: STATE_ROW_ID,
    last_updated_by: by,
    last_updated_at: new Date().toISOString(),
  });
}

/**
 * Supabase-backed store with realtime sync. Every mutation hits Postgres and
 * all connected devices receive the change via the realtime subscription.
 */
export const supabaseStore: Store = {
  mode: "cloud",

  load: fetchSnapshot,

  async addPlayer({ name, team }: NewPlayerInput): Promise<Player> {
    const sb = getSupabase();
    if (!sb) throw new Error("Supabase not configured");
    const { data, error } = await sb
      .from("players")
      .insert({ name: name.trim(), team, scores: {} })
      .select("*")
      .single();
    if (error) throw error;
    return rowToPlayer(data as PlayerRow);
  },

  async addManyPlayers(inputs: NewPlayerInput[]): Promise<void> {
    const sb = getSupabase();
    if (!sb) throw new Error("Supabase not configured");
    const { error } = await sb
      .from("players")
      .insert(inputs.map((i) => ({ name: i.name.trim(), team: i.team, scores: {} })));
    if (error) throw error;
  },

  async updateScore(
    playerId: string,
    gameId: GameId,
    points: number,
    by: string,
  ): Promise<void> {
    const sb = getSupabase();
    if (!sb) throw new Error("Supabase not configured");
    const { data: row } = await sb
      .from("players")
      .select("scores")
      .eq("id", playerId)
      .single();
    const scores = { ...(((row as { scores: Record<string, number> } | null)?.scores) ?? {}) };
    scores[gameId] = Math.max(0, Math.round(points));
    const { error } = await sb.from("players").update({ scores }).eq("id", playerId);
    if (error) throw error;
    await stamp(by);
  },

  async editPlayer(playerId, patch): Promise<void> {
    const sb = getSupabase();
    if (!sb) throw new Error("Supabase not configured");
    const update: Record<string, unknown> = {};
    if (patch.name !== undefined) update.name = patch.name.trim();
    if (patch.team !== undefined) update.team = patch.team;
    const { error } = await sb.from("players").update(update).eq("id", playerId);
    if (error) throw error;
  },

  async removePlayer(playerId: string): Promise<void> {
    const sb = getSupabase();
    if (!sb) throw new Error("Supabase not configured");
    const { error } = await sb.from("players").delete().eq("id", playerId);
    if (error) throw error;
  },

  async resetScores(by: string): Promise<void> {
    const sb = getSupabase();
    if (!sb) throw new Error("Supabase not configured");
    // Reset everyone to an empty scores object.
    const { error } = await sb
      .from("players")
      .update({ scores: {} })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
    await stamp(by);
  },

  subscribe(cb: (snap: StoreSnapshot) => void): () => void {
    const sb = getSupabase();
    if (!sb) return () => {};
    const push = () => {
      fetchSnapshot().then(cb).catch(() => {});
    };
    const channel = sb
      .channel("africup-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, push)
      .on("postgres_changes", { event: "*", schema: "public", table: "game_state" }, push)
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  },
};
