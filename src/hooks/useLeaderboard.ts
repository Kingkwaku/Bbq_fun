import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { store, SAMPLE_PLAYERS, type NewPlayerInput } from "@/lib/store";
import { funLabels, jollofDerby, rankPlayers, teamTotals } from "@/lib/scoring";
import type { GameId, GameState, Player } from "@/lib/types";
import { EMPTY_STATE } from "@/lib/store/types";

const MY_PLAYER_KEY = "africup:myPlayerId:v1";

export function getMyPlayerId(): string | null {
  try {
    return localStorage.getItem(MY_PLAYER_KEY);
  } catch {
    return null;
  }
}

function setMyPlayerId(id: string) {
  try {
    localStorage.setItem(MY_PLAYER_KEY, id);
  } catch {
    /* ignore */
  }
}

/**
 * Single source of truth for the leaderboard. Loads + subscribes to the active
 * store and derives ranked players, fun labels and the Jollof Derby state.
 */
export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [state, setState] = useState<GameState>(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(getMyPlayerId());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    store
      .load()
      .then((snap) => {
        if (!mounted.current) return;
        setPlayers(snap.players);
        setState(snap.state);
      })
      .finally(() => mounted.current && setLoading(false));

    const unsub = store.subscribe((snap) => {
      if (!mounted.current) return;
      setPlayers(snap.players);
      setState(snap.state);
    });

    return () => {
      mounted.current = false;
      unsub();
    };
  }, []);

  const ranked = useMemo(() => rankPlayers(players), [players]);
  const labels = useMemo(() => funLabels(ranked), [ranked]);
  const derby = useMemo(() => jollofDerby(ranked), [ranked]);
  const teams = useMemo(() => teamTotals(players), [players]);

  const me = useMemo(
    () => (myId ? ranked.find((p) => p.id === myId) ?? null : null),
    [ranked, myId],
  );

  const register = useCallback(async (input: NewPlayerInput) => {
    const player = await store.addPlayer(input);
    setMyPlayerId(player.id);
    setMyId(player.id);
    return player;
  }, []);

  const addPlayer = useCallback(
    (input: NewPlayerInput) => store.addPlayer(input),
    [],
  );
  const updateScore = useCallback(
    (playerId: string, gameId: GameId, points: number, by: string) =>
      store.updateScore(playerId, gameId, points, by),
    [],
  );
  const editPlayer = useCallback(
    (playerId: string, patch: Partial<Pick<Player, "name" | "team">>) =>
      store.editPlayer(playerId, patch),
    [],
  );
  const removePlayer = useCallback((id: string) => store.removePlayer(id), []);
  const resetScores = useCallback((by: string) => store.resetScores(by), []);
  const seedSamplePlayers = useCallback(
    () => store.addManyPlayers(SAMPLE_PLAYERS),
    [],
  );

  return {
    loading,
    players,
    ranked,
    labels,
    derby,
    teams,
    state,
    me,
    myId,
    syncMode: store.mode,
    register,
    addPlayer,
    updateScore,
    editPlayer,
    removePlayer,
    resetScores,
    seedSamplePlayers,
  };
}

export type UseLeaderboard = ReturnType<typeof useLeaderboard>;
