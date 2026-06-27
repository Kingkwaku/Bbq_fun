import {
  Layers,
  Target,
  Crosshair,
  ShoppingBasket,
  Goal,
  CircleDot,
  Shuffle,
  type LucideIcon,
} from "lucide-react";
import { GAMES } from "@/lib/games";
import type { GameId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Map lucide icon names (from GameMeta.icon) to actual components. */
const ICONS: Record<string, LucideIcon> = {
  Layers,
  Target,
  Crosshair,
  ShoppingBasket,
  Goal,
  CircleDot,
};

interface GamePickerProps {
  selectedGameId: GameId;
  onSelect: (id: GameId) => void;
}

/** Horizontally-scrollable / grid set of game chips. Pick any game, any order. */
export function GamePicker({ selectedGameId, onSelect }: GamePickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shuffle className="h-4 w-4 text-primary" />
        <span>Pick any game to score — no fixed order.</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {GAMES.map((game) => {
          const Icon = ICONS[game.icon] ?? CircleDot;
          const active = game.id === selectedGameId;
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => onSelect(game.id)}
              aria-pressed={active}
              className={cn(
                "tap-target group flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition-all",
                active
                  ? "border-primary/70 bg-primary/15 text-foreground shadow-[0_0_0_1px_rgba(252,209,22,0.35),0_12px_30px_-12px_rgba(252,209,22,0.5)] ring-1 ring-primary/40"
                  : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-white/25 hover:bg-white/[0.07] hover:text-foreground",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                    active ? "bg-primary/25 text-primary" : "bg-white/5 text-foreground/70",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-lg" aria-hidden>
                  {game.emoji}
                </span>
              </div>
              <span className="text-sm font-semibold leading-tight">{game.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GamePicker;
