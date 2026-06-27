import {
  CircleDot,
  Crosshair,
  Goal,
  Layers,
  type LucideIcon,
  ShoppingBasket,
  Target,
} from "lucide-react";
import { GAMES } from "@/lib/games";
import type { GameId, Player } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  Layers,
  Target,
  Crosshair,
  ShoppingBasket,
  Goal,
  CircleDot,
};

/** Today's six mini-games, with the current leader for each. */
export function GamesStrip({ players }: { players: Player[] }) {
  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
      {GAMES.map((game) => {
        const Icon = ICONS[game.icon] ?? Target;
        const leader = topScorer(players, game.id);
        return (
          <div
            key={game.id}
            className="glass relative w-44 shrink-0 snap-start overflow-hidden p-3"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-lg" aria-hidden>
                {game.emoji}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 min-h-[2.5rem] font-display text-sm font-bold leading-tight">
              {game.label}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{game.blurb}</p>
            <div className="mt-2 border-t border-white/10 pt-2 text-[11px]">
              {leader ? (
                <span className="text-muted-foreground">
                  👑 <span className="font-semibold text-foreground">{leader.name}</span> · {leader.points}
                </span>
              ) : (
                <span className="text-muted-foreground/70">Up for grabs</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function topScorer(players: Player[], gameId: GameId): { name: string; points: number } | null {
  let best: { name: string; points: number } | null = null;
  for (const p of players) {
    const pts = p.scores[gameId];
    if (typeof pts === "number" && pts > 0 && (!best || pts > best.points)) {
      best = { name: p.name, points: pts };
    }
  }
  return best;
}
