import { AnimatePresence, motion } from "framer-motion";
import { PlayerCard } from "@/components/PlayerCard";
import type { RankedPlayer } from "@/lib/types";
import type { FunLabel } from "@/lib/scoring";

interface LeaderboardListProps {
  ranked: RankedPlayer[];
  labels: Record<string, FunLabel>;
  myId: string | null;
}

/** Animated leaderboard — rows smoothly slide as ranks change. */
export function LeaderboardList({ ranked, labels, myId }: LeaderboardListProps) {
  return (
    <motion.div layout className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {ranked.map((player) => (
          <motion.div
            key={player.id}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.6 }}
          >
            <PlayerCard player={player} label={labels[player.id]} isMe={player.id === myId} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
