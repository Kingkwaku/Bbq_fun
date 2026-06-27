import { Flame, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEAM_INFO } from "@/lib/teams";
import { TeamBadge } from "@/components/TeamBadge";
import { gamesPlayed } from "@/lib/scoring";
import { GAMES } from "@/lib/games";
import type { RankedPlayer } from "@/lib/types";
import type { FunLabel } from "@/lib/scoring";

interface PlayerCardProps {
  player: RankedPlayer;
  label?: FunLabel;
  isMe?: boolean;
}

const LABEL_STYLES: Record<FunLabel["tone"], { className: string; icon: typeof Star }> = {
  champion: { className: "bg-primary/20 text-primary border-primary/30", icon: Star },
  rising: { className: "bg-naija-green/25 text-emerald-200 border-emerald-400/30", icon: Sparkles },
  jollof: { className: "bg-jollof/20 text-orange-200 border-orange-400/30", icon: Flame },
};

/** A single leaderboard row: rank, name, family, fun label, progress, points. */
export function PlayerCard({ player, label, isMe }: PlayerCardProps) {
  const info = TEAM_INFO[player.team];
  const played = gamesPlayed(player);
  const pct = Math.round(player.progress * 100);

  return (
    <div
      className={cn(
        "glass relative flex items-center gap-3 overflow-hidden p-3 transition-colors",
        isMe && "ring-2 ring-primary/50",
      )}
    >
      {/* team accent edge */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: info.accent }}
        aria-hidden
      />

      {/* rank */}
      <div className="flex w-9 shrink-0 flex-col items-center">
        <span
          className={cn(
            "font-display text-xl font-bold leading-none",
            player.rank === 1 ? "text-gradient-gold" : "text-foreground",
          )}
        >
          {player.rank}
        </span>
        <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
          {ordinal(player.rank)}
        </span>
      </div>

      {/* avatar initial */}
      <div
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-bold text-white shadow-inner"
        style={{ backgroundColor: info.accent + "33", color: "#fff" }}
        aria-hidden
      >
        {player.name.charAt(0).toUpperCase()}
      </div>

      {/* main */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold leading-tight">
            {player.name}
            {isMe && <span className="ml-1 text-[10px] font-bold text-primary">YOU</span>}
          </p>
          <TeamBadge team={player.team} size="sm" />
        </div>

        <div className="mt-1 flex items-center gap-2">
          {label ? (
            <LabelChip label={label} />
          ) : (
            <span className="text-[11px] text-muted-foreground">
              {played}/{GAMES.length} games
            </span>
          )}
        </div>

        {/* progress bar vs leader */}
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", info.barClass)}
            style={{ width: `${Math.max(pct, player.total > 0 ? 8 : 0)}%` }}
          />
        </div>
      </div>

      {/* points */}
      <div className="flex shrink-0 flex-col items-end pl-1">
        <span className="font-display text-2xl font-extrabold leading-none tabular-nums">
          {player.total}
        </span>
        <span className="text-[9px] uppercase tracking-wide text-muted-foreground">pts</span>
      </div>
    </div>
  );
}

function LabelChip({ label }: { label: FunLabel }) {
  const style = LABEL_STYLES[label.tone];
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold",
        style.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label.text}
    </span>
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]).toUpperCase();
}
