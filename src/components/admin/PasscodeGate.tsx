import { useState, type FormEvent } from "react";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KenteStripe, AnkaraBackdrop } from "@/components/KentePattern";
import { cn } from "@/lib/utils";

const PASSCODE = "ghana9ja";
export const ADMIN_SESSION_KEY = "africup:admin:v1";

export function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "ok";
  } catch {
    return false;
  }
}

function persistUnlock() {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "ok");
  } catch {
    /* ignore */
  }
}

interface PasscodeGateProps {
  onUnlock: () => void;
}

/** Full-screen glass gate that protects the admin dashboard. */
export function PasscodeGate({ onUnlock }: PasscodeGateProps) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim() === PASSCODE) {
      persistUnlock();
      toast.success("Welcome back, Derrick 🔥");
      onUnlock();
      return;
    }
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
    toast.error("Wrong passcode — try again, chief.");
    setValue("");
  }

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden p-4 safe-top safe-bottom">
      <AnkaraBackdrop />
      <div
        className={cn("glass-strong relative z-10 w-full max-w-md overflow-hidden p-6 sm:p-8")}
        style={
          shake
            ? { animation: "africup-shake 0.45s cubic-bezier(.36,.07,.19,.97) both" }
            : undefined
        }
      >
        <KenteStripe className="mb-6" />

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
              Admin · Derrick
            </p>
            <h1 className="text-2xl font-bold text-gradient-gold">AfriCup Scoring HQ</h1>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Enter the passcode to manage players and log scores for the Backyard
          Challenge.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passcode" className="text-sm font-medium">
              Passcode
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="passcode"
                type="password"
                inputMode="text"
                autoComplete="off"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="••••••••"
                className="h-14 pl-11 text-lg tracking-widest"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="tap-target h-14 w-full text-base font-semibold">
            Unlock dashboard
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="underline-offset-4 hover:text-foreground hover:underline">
            ← Back to the leaderboard
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes africup-shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

export default PasscodeGate;
