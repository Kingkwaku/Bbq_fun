import { useMemo, useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamBadge } from "@/components/TeamBadge";
import { GAME_BY_ID } from "@/lib/games";
import { totalPoints } from "@/lib/scoring";
import type { GameId, Player } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScoreEntryProps {
  players: Player[];
  selectedGameId: GameId;
  updateScore: (
    playerId: string,
    gameId: GameId,
    points: number,
    by: string,
  ) => Promise<void>;
  onGoToPlayers: () => void;
}

const ADMIN = "Derrick";

/** Score-entry list for the selected game: one big tappable row per player. */
export function ScoreEntry({
  players,
  selectedGameId,
  updateScore,
  onGoToPlayers,
}: ScoreEntryProps) {
  const game = GAME_BY_ID[selectedGameId];

  const sorted = useMemo(
    () => [...players].sort((a, b) => totalPoints(b) - totalPoints(a)),
    [players],
  );

  if (players.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Users className="h-7 w-7" />
        </div>
        <div>
          <p className="text-lg font-semibold">No players yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add players (or seed sample players) before you can log scores.
          </p>
        </div>
        <Button onClick={onGoToPlayers} className="tap-target">
          Go to Players
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="glass flex items-center gap-3 px-4 py-3">
        <span className="text-2xl" aria-hidden>
          {game.emoji}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{game.label}</p>
          <p className="truncate text-xs text-muted-foreground">{game.blurb}</p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-muted-foreground">
          max ~{game.suggestedMax}
        </span>
      </div>

      <ul className="space-y-2.5">
        {sorted.map((player) => (
          <ScoreRow
            key={player.id}
            player={player}
            gameId={selectedGameId}
            updateScore={updateScore}
          />
        ))}
      </ul>
    </div>
  );
}

interface ScoreRowProps {
  player: Player;
  gameId: GameId;
  updateScore: ScoreEntryProps["updateScore"];
}

function ScoreRow({ player, gameId, updateScore }: ScoreRowProps) {
  const current = player.scores[gameId] ?? 0;
  const [draft, setDraft] = useState<string>(String(current));
  const [busy, setBusy] = useState(false);

  // Keep the visible draft in sync if the score changes elsewhere (e.g. reset).
  const [lastCurrent, setLastCurrent] = useState(current);
  if (current !== lastCurrent && !busy) {
    setLastCurrent(current);
    setDraft(String(current));
  }

  async function commit(next: number) {
    const value = Math.max(0, Math.round(next));
    if (value === current) {
      setDraft(String(value));
      return;
    }
    setBusy(true);
    setDraft(String(value));
    try {
      await updateScore(player.id, gameId, value, ADMIN);
      toast.success(`${player.name}: ${value} pts`);
      setLastCurrent(value);
    } catch {
      toast.error("Could not save score — try again.");
      setDraft(String(current));
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="glass flex items-center gap-3 px-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold leading-tight">{player.name}</p>
        <div className="mt-1">
          <TeamBadge team={player.team} size="sm" />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={busy || current <= 0}
          onClick={() => commit(current - 1)}
          aria-label={`Decrease ${player.name}'s score`}
          className="tap-target h-12 w-12 rounded-xl border-white/15 bg-white/5"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <Input
          type="number"
          inputMode="numeric"
          min={0}
          value={draft}
          disabled={busy}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={() => commit(Number(draft) || 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          aria-label={`${player.name}'s score`}
          className={cn(
            "h-12 w-16 rounded-xl text-center text-lg font-bold",
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          )}
        />

        <Button
          type="button"
          size="icon"
          variant="default"
          disabled={busy}
          onClick={() => commit(current + 1)}
          aria-label={`Increase ${player.name}'s score`}
          className="tap-target h-12 w-12 rounded-xl"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </li>
  );
}

export default ScoreEntry;
