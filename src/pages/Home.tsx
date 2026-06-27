import { useState } from "react";
import { ListOrdered, Sparkles, Trophy, UserPlus } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { GamesStrip } from "@/components/GamesStrip";
import { JollofDerbyBadge } from "@/components/JollofDerbyBadge";
import { TeamTugOfWar } from "@/components/TeamTugOfWar";
import { Podium } from "@/components/Podium";
import { LeaderboardList } from "@/components/LeaderboardList";
import { ConfettiManager } from "@/components/ConfettiManager";
import { RegistrationDialog } from "@/components/RegistrationDialog";
import { Button } from "@/components/ui/button";
import { relativeTime } from "@/lib/time";

export default function Home() {
  const {
    loading,
    players,
    ranked,
    labels,
    derby,
    teams,
    state,
    myId,
    me,
    syncMode,
    register,
  } = useLeaderboard();

  const [joinOpen, setJoinOpen] = useState(false);
  const top3 = ranked.slice(0, 3);
  const hasPlayers = ranked.length > 0;

  return (
    <div className="min-h-[100dvh] pb-28">
      <SiteHeader syncMode={syncMode} />
      <ConfettiManager ranked={ranked} />

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <Hero
          onJoin={() => setJoinOpen(true)}
          playerCount={players.length}
          registered={Boolean(me)}
        />

        {/* Today's mini-games */}
        <section>
          <SectionHeading icon={Sparkles} title="Today's Mini-Games" hint="Play in any order" />
          <GamesStrip players={players} />
        </section>

        {/* Rivalry + derby */}
        {hasPlayers && (
          <section className="space-y-3">
            <JollofDerbyBadge derby={derby} />
            <TeamTugOfWar teams={teams} />
          </section>
        )}

        {/* Podium */}
        {hasPlayers && (
          <section>
            <SectionHeading icon={Trophy} title="Podium" hint="Top 3 families' finest" />
            <div className="glass-strong p-4">
              <Podium top={top3} labels={labels} />
            </div>
          </section>
        )}

        {/* Full leaderboard */}
        <section>
          <SectionHeading
            icon={ListOrdered}
            title="Live Leaderboard"
            hint={hasPlayers ? `${ranked.length} players` : undefined}
          />
          {loading ? (
            <LoadingState />
          ) : hasPlayers ? (
            <LeaderboardList ranked={ranked} labels={labels} myId={myId} />
          ) : (
            <EmptyState onJoin={() => setJoinOpen(true)} />
          )}
        </section>

        {/* Last updated */}
        {state.lastUpdatedBy && state.lastUpdatedAt && (
          <p className="pt-1 text-center text-[11px] text-muted-foreground">
            Last updated by{" "}
            <span className="font-semibold text-foreground">{state.lastUpdatedBy}</span> ·{" "}
            {relativeTime(state.lastUpdatedAt)}
          </p>
        )}
      </main>

      {/* Sticky mobile join CTA */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/80 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl">
          <Button size="lg" className="w-full" onClick={() => setJoinOpen(true)}>
            <UserPlus className="h-5 w-5" />
            {me ? `You're in, ${me.name.split(" ")[0]}! Add another` : "Join the Challenge"}
          </Button>
        </div>
      </div>

      <RegistrationDialog open={joinOpen} onOpenChange={setJoinOpen} onRegister={register} />
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof Trophy;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h2>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="glass h-[72px] animate-pulse opacity-60" />
      ))}
    </div>
  );
}

function EmptyState({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="glass-strong flex flex-col items-center gap-3 p-8 text-center">
      <span className="text-4xl" aria-hidden>
        🏆
      </span>
      <div>
        <p className="font-display text-lg font-bold">The board is wide open</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Be the first challenger. Drop your name, pick your family, and bring the jollof energy.
        </p>
      </div>
      <Button size="lg" onClick={onJoin}>
        <UserPlus className="h-5 w-5" />
        Join the Challenge
      </Button>
    </div>
  );
}
