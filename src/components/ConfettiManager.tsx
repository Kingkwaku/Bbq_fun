import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { celebrate } from "@/lib/confetti";
import type { RankedPlayer } from "@/lib/types";

/**
 * Fires a celebration when the #1 spot changes hands (not on first load).
 * Mounted invisibly on the homepage.
 */
export function ConfettiManager({ ranked }: { ranked: RankedPlayer[] }) {
  const prevLeader = useRef<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const leader = ranked.find((p) => p.rank === 1 && p.total > 0);
    const leaderId = leader?.id ?? null;

    if (!initialized.current) {
      initialized.current = true;
      prevLeader.current = leaderId;
      return;
    }

    // Only celebrate an actual change of hands during play — not the initial
    // null -> first-leader transition when the board first loads.
    if (leaderId && prevLeader.current && leaderId !== prevLeader.current) {
      celebrate();
      if (leader) {
        toast.success(`👑 ${leader.name} takes the lead!`, {
          description: "New Current Champion on the board.",
        });
      }
    }
    prevLeader.current = leaderId;
  }, [ranked]);

  return null;
}
