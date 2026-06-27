import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEAM_INFO } from "@/lib/teams";
import { TeamBadge } from "@/components/TeamBadge";
import type { RankedPlayer } from "@/lib/types";
import type { FunLabel } from "@/lib/scoring";

interface PodiumProps {
  top: RankedPlayer[];
  labels: Record<string, FunLabel>;
}

const PODIUM_META: Record<
  number,
  { height: string; ring: string; medal: string; icon: typeof Trophy; glow: string }
> = {
  1: {
    height: "h-28",
    ring: "ring-2 ring-primary/60",
    medal: "from-amber-300 to-yellow-500",
    icon: Crown,
    glow: "shadow-[0_0_40px_-8px_rgba(252,209,22,0.6)]",
  },
  2: {
    height: "h-20",
    ring: "ring-1 ring-white/30",
    medal: "from-slate-200 to-slate-400",
    icon: Medal,
    glow: "",
  },
  3: {
    height: "h-16",
    ring: "ring-1 ring-orange-400/30",
    medal: "from-orange-300 to-orange-600",
    icon: Medal,
    glow: "",
  },
};

/** Top-3 podium with the leader raised in the center. */
export function Podium({ top, labels }: PodiumProps) {
  if (top.length === 0) return null;

  // visual order: 2nd, 1st, 3rd
  const order = [top[1], top[0], top[2]].filter(Boolean) as RankedPlayer[];

  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-3">
      {order.map((p) => (
        <PodiumColumn key={p.id} player={p} label={labels[p.id]} />
      ))}
    </div>
  );
}

function PodiumColumn({ player, label }: { player: RankedPlayer; label?: FunLabel }) {
  const meta = PODIUM_META[player.rank] ?? PODIUM_META[3];
  const info = TEAM_INFO[player.team];
  const Icon = meta.icon;
  const isFirst = player.rank === 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="flex flex-col items-center"
    >
      {/* avatar + crown */}
      <div className={cn("relative mb-2", isFirst && "animate-float-slow")}>
        <Icon
          className={cn(
            "absolute -top-5 left-1/2 -translate-x-1/2",
            isFirst ? "h-6 w-6 text-primary" : "h-4 w-4 text-muted-foreground",
          )}
        />
        <div
          className={cn(
            "grid place-items-center rounded-2xl bg-gradient-to-br font-display font-bold text-black",
            meta.medal,
            meta.ring,
            meta.glow,
            isFirst ? "h-16 w-16 text-2xl" : "h-12 w-12 text-lg",
          )}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <p className="max-w-full truncate text-center text-sm font-bold">{player.name}</p>
      <TeamBadge team={player.team} size="sm" className="mt-0.5" />
      <p className="mt-1 font-display text-lg font-extrabold tabular-nums">
        {player.total}
        <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">pts</span>
      </p>

      {/* pedestal */}
      <div
        className={cn(
          "mt-2 flex w-full items-start justify-center rounded-t-xl border border-white/10 bg-white/[0.05] pt-1.5",
          meta.height,
        )}
        style={{ boxShadow: `inset 0 2px 0 0 ${info.accent}55` }}
      >
        <span className="font-display text-xl font-black text-white/40">{player.rank}</span>
      </div>

      {label && (
        <span className="mt-1 line-clamp-1 text-center text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label.text}
        </span>
      )}
    </motion.div>
  );
}
