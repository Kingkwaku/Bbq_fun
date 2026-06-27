import { isSupabaseConfigured } from "../supabaseClient";
import { localStore } from "./localStore";
import { supabaseStore } from "./supabaseStore";
import type { Store } from "./types";

/**
 * The active store. Uses Supabase (live multi-device sync) when env vars are
 * present, otherwise falls back to localStorage so the app runs with zero
 * config. Components never import a concrete store — only this.
 */
export const store: Store = isSupabaseConfigured ? supabaseStore : localStore;

export const SYNC_MODE = store.mode;

export type { Store, StoreSnapshot, NewPlayerInput } from "./types";
export { SAMPLE_PLAYERS } from "./seed";
