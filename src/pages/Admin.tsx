import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Share2,
  Trophy,
  Users,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { GAMES } from "@/lib/games";
import type { GameId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KenteStripe, AnkaraBackdrop } from "@/components/KentePattern";
import { PasscodeGate, isUnlocked } from "@/components/admin/PasscodeGate";
import { GamePicker } from "@/components/admin/GamePicker";
import { ScoreEntry } from "@/components/admin/ScoreEntry";
import { PlayerManager } from "@/components/admin/PlayerManager";

/** Compact relative time, e.g. "just now", "3m ago", "2h ago". */
function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}

function Admin() {
  const [unlocked, setUnlocked] = useState<boolean>(isUnlocked);

  if (!unlocked) {
    return <PasscodeGate onUnlock={() => setUnlocked(true)} />;
  }

  return <Dashboard />;
}

function Dashboard() {
  const {
    loading,
    players,
    state,
    syncMode,
    updateScore,
    addPlayer,
    editPlayer,
    removePlayer,
    resetScores,
    seedSamplePlayers,
  } = useLeaderboard();

  const [selectedGameId, setSelectedGameId] = useState<GameId>(GAMES[0].id);
  const [tab, setTab] = useState<"scores" | "players">("scores");

  // Tick so the relative timestamp stays fresh.
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const cloud = syncMode === "cloud";

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden safe-top safe-bottom">
      <AnkaraBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pb-16 pt-5">
        {/* Header */}
        <header className="glass-strong overflow-hidden p-5">
          <KenteStripe className="mb-4" />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
                Admin · Derrick
              </p>
              <h1 className="text-3xl font-bold text-gradient-gold">Scoring HQ</h1>
              <p className="mt-1 text-sm text-muted-foreground">Logged in as Derrick</p>
            </div>

            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                cloud
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : "border-white/15 bg-white/5 text-muted-foreground",
              )}
            >
              {cloud ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              {cloud ? "Live sync" : "This device only"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="tap-target">
              <Link to="/">
                <Home className="mr-1 h-4 w-4" />
                Leaderboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="tap-target">
              <Link to="/share">
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Link>
            </Button>
          </div>

          {state.lastUpdatedBy && state.lastUpdatedAt && (
            <p className="mt-3 text-xs text-muted-foreground">
              Last updated by{" "}
              <span className="font-medium text-foreground">{state.lastUpdatedBy}</span> ·{" "}
              {relativeTime(state.lastUpdatedAt)}
            </p>
          )}
        </header>

        {loading ? (
          <div className="glass mt-4 flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading roster…
          </div>
        ) : (
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "scores" | "players")}
            className="mt-4"
          >
            <TabsList className="grid h-12 w-full grid-cols-2">
              <TabsTrigger value="scores" className="tap-target gap-1.5 text-sm">
                <Trophy className="h-4 w-4" />
                Score Entry
              </TabsTrigger>
              <TabsTrigger value="players" className="tap-target gap-1.5 text-sm">
                <Users className="h-4 w-4" />
                Players
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scores" className="mt-4 space-y-4 focus-visible:outline-none">
              <div className="glass p-4 sm:p-5">
                <GamePicker
                  selectedGameId={selectedGameId}
                  onSelect={setSelectedGameId}
                />
              </div>
              <ScoreEntry
                players={players}
                selectedGameId={selectedGameId}
                updateScore={updateScore}
                onGoToPlayers={() => setTab("players")}
              />
            </TabsContent>

            <TabsContent value="players" className="mt-4 focus-visible:outline-none">
              <PlayerManager
                players={players}
                addPlayer={addPlayer}
                editPlayer={editPlayer}
                removePlayer={removePlayer}
                resetScores={resetScores}
                seedSamplePlayers={seedSamplePlayers}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default Admin;
