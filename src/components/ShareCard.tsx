import { Crown, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEAM_INFO } from "@/lib/teams";
import { teamTotals, type JollofDerby } from "@/lib/scoring";
import type { GameState, Player, RankedPlayer } from "@/lib/types";
import { TeamBadge } from "@/components/TeamBadge";
import { KenteStripe, AnkaraBackdrop } from "@/components/KentePattern";
import { Badge } from "@/components/ui/badge";

interface ShareCardProps {
  ranked: RankedPlayer[];
  derby: JollofDerby;
  state: GameState;
  className?: string;
}

const MEDAL_TONES = [
  { ring: "ring-ghana-gold/60", glow: "shadow-ghana-gold/30", text: "text-ghana-gold" },
  { ring: "ring-slate-300/50", glow: "shadow-slate-300/20", text: "text-slate-200" },
  { ring: "ring-amber-600/50", glow: "shadow-amber-700/20", text: "text-amber-500" },
] as const;

const MEDAL_EMOJI = ["🥇", "🥈", "🥉"] as const;

/**
 * Self-contained, screenshot-optimized leaderboard poster. Phone-aspect,
 * premium glassmorphism, Ghana × Nigeria colors. No external libraries.
 */
export function ShareCard({ ranked, derby, state, className }: ShareCardProps) {
  // Derive team tug-of-war from the ranked snapshot (RankedPlayer extends Player).
  const teams = teamTotals(ranked as Player[]);
  const ghana = teams.ghana;
  const nigeria = teams.nigeria;
  const tugTotal = ghana + nigeria;
  const ghanaPct = tugTotal > 0 ? Math.round((ghana / tugTotal) * 100) : 50;
  const nigeriaPct = 100 - ghanaPct;

  const hasPlayers = ranked.length > 0;
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const updatedBy = state.lastUpdatedBy ?? "Derrick";

  return (
    <div
      className={cn(
        "glass-strong relative w-full max-w-[420px] overflow-hidden rounded-3xl",
        className,
      )}
    >
      <AnkaraBackdrop />

      {/* Brand header */}
      <div className="relative z-10">
        <KenteStripe className="rounded-none" />
        <div className="px-5 pt-5 pb-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-2xl">
            <span aria-hidden>🇬🇭</span>
            <Trophy className="h-6 w-6 text-ghana-gold" aria-hidden />
            <span aria-hidden>⚽</span>
            <span aria-hidden>🇳🇬</span>
          </div>
          <h1 className="font-display text-2xl font-bold leading-tight">
            <span className="text-gradient-gold">AfriCup</span>{" "}
            <span className="text-foreground">Backyard Challenge</span>
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Ghana × Nigeria BBQ Games
          </p>

          {derby.active && (
            <div className="mt-3 flex justify-center">
              <Badge variant="jollof" className="animate-pulse-glow text-sm">
                Jollof Derby 🔥
                {Number.isFinite(derby.margin) && (
                  <span className="ml-1 opacity-80">
                    {derby.margin === 0 ? "dead level!" : `${derby.margin} pts apart`}
                  </span>
                )}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 px-5 pb-5">
        {!hasPlayers ? (
          <div className="glass flex flex-col items-center gap-2 rounded-2xl px-4 py-10 text-center">
            <span className="text-4xl" aria-hidden>
              🏆
            </span>
            <p className="font-display text-lg font-semibold">Be the first on the board</p>
            <p className="text-sm text-muted-foreground">
              No scores yet — fire up the grill and start the games!
            </p>
          </div>
        ) : (
          <>
            {/* Top-3 podium */}
            <div className="mb-4 space-y-2">
              {top3.map((p, i) => {
                const tone = MEDAL_TONES[i];
                const info = TEAM_INFO[p.team];
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "glass flex items-center gap-3 rounded-2xl px-3 py-2.5 ring-1 shadow-lg",
                      tone.ring,
                      tone.glow,
                      i === 0 && "bg-gradient-to-r from-ghana-gold/10 to-transparent",
                    )}
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                      {i === 0 ? (
                        <Crown className={cn("h-7 w-7", tone.text)} aria-hidden />
                      ) : (
                        <Medal className={cn("h-6 w-6", tone.text)} aria-hidden />
                      )}
                      <span className="absolute -bottom-1 text-base" aria-hidden>
                        {MEDAL_EMOJI[i]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-display text-base font-bold">
                          {p.name}
                        </span>
                        <span aria-hidden>{info.flag}</span>
                      </div>
                      <TeamBadge team={p.team} family size="sm" className="mt-0.5" />
                    </div>
                    <div className="shrink-0 text-right">
                      <div className={cn("font-display text-xl font-extrabold leading-none", tone.text)}>
                        {p.total}
                      </div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        pts
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Remaining ranks */}
            {rest.length > 0 && (
              <ul className="glass mb-4 divide-y divide-white/5 rounded-2xl px-1 py-1">
                {rest.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 px-3 py-2">
                    <span className="w-6 shrink-0 text-center font-display text-sm font-bold text-muted-foreground">
                      {p.rank}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {p.name}
                    </span>
                    <TeamBadge team={p.team} size="sm" />
                    <span className="w-10 shrink-0 text-right font-display text-sm font-bold">
                      {p.total}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Team tug-of-war */}
            <div className="mb-1">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="text-ghana-gold">
                  🇬🇭 Ghana <span className="opacity-80">{ghana}</span>
                </span>
                <span className="text-emerald-200">
                  <span className="opacity-80">{nigeria}</span> Nigeria 🇳🇬
                </span>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green transition-all"
                  style={{ width: `${ghanaPct}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-naija-green via-emerald-400 to-naija-green transition-all"
                  style={{ width: `${nigeriaPct}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 px-5 py-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            Updated by <span className="font-semibold text-foreground">{updatedBy}</span>
          </span>
          <span className="font-display font-semibold tracking-wide text-ghana-gold/90">
            africup.challenge
          </span>
        </div>
      </div>
    </div>
  );
}

export default ShareCard;
