import { useState } from "react";
import { Loader2, PartyPopper } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TEAM_INFO, TEAM_ORDER } from "@/lib/teams";
import type { Team } from "@/lib/types";
import { pop } from "@/lib/confetti";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (input: { name: string; team: Team }) => Promise<unknown>;
  defaultTeam?: Team;
}

/**
 * The guest "answer one question" registration flow: type your name, tap your
 * family, you're on the board. Kept to a single quick screen.
 */
export function RegistrationDialog({
  open,
  onOpenChange,
  onRegister,
  defaultTeam = "neutral",
}: RegistrationDialogProps) {
  const [name, setName] = useState("");
  const [team, setTeam] = useState<Team>(defaultTeam);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length >= 2 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onRegister({ name: name.trim(), team });
      pop(team === "ghana" || team === "nigeria" ? team : undefined);
      setName("");
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <PartyPopper className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Join the Challenge</DialogTitle>
          <DialogDescription className="text-center">
            One question and you're on the leaderboard. What's your name?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={24}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="h-14 text-center text-lg"
          />

          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Rep your family
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TEAM_ORDER.map((t) => {
                const info = TEAM_INFO[t];
                const active = team === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTeam(t)}
                    className={cn(
                      "tap-target flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition-all active:scale-95",
                      active
                        ? "border-primary bg-primary/15 ring-2 ring-primary/40"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                  >
                    <span className="text-2xl" aria-hidden>
                      {info.flag}
                    </span>
                    <span className="text-xs font-semibold">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Adding you…
              </>
            ) : (
              <>Let's go 🔥</>
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Derrick keeps the scores. You bring the jollof energy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
