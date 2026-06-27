import { Link } from "react-router-dom";
import { Camera, Trophy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KenteStripe, AnkaraBackdrop } from "@/components/KentePattern";

interface HeroProps {
  onJoin: () => void;
  playerCount: number;
  registered: boolean;
}

/** The big fan-zone hero with title, subtitle and primary actions. */
export function Hero({ onJoin, playerCount, registered }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl glass-strong p-5 pt-4 sm:p-7">
      <AnkaraBackdrop />
      <KenteStripe className="mb-4" />

      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Trophy className="h-3.5 w-3.5 text-primary" />
          Backyard Fan-Zone · Live
        </div>

        <h1 className="font-display text-4xl font-black leading-[1.05] sm:text-5xl">
          <span className="text-gradient-gold">AfriCup</span>
          <br />
          Backyard Challenge
        </h1>
        <p className="mt-2 text-base font-medium text-foreground/80">
          🇬🇭 Ghana <span className="text-muted-foreground">×</span> Nigeria 🇳🇬 BBQ Games
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          One cookout. Two families. Six games. Endless bragging rights.
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" onClick={onJoin}>
            <UserPlus className="h-5 w-5" />
            {registered ? "Add another player" : "Join the Challenge"}
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link to="/share">
              <Camera className="h-5 w-5" />
              Share board
            </Link>
          </Button>
        </div>

        {playerCount > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{playerCount}</span> challenger
            {playerCount === 1 ? "" : "s"} on the board so far
          </p>
        )}
      </div>
    </section>
  );
}
