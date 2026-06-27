import { motion } from "framer-motion";
import type { Team } from "@/lib/types";

/** Ghana vs Nigeria aggregate-points bar — the family tug-of-war. */
export function TeamTugOfWar({ teams }: { teams: Record<Team, number> }) {
  const ghana = teams.ghana;
  const naija = teams.nigeria;
  const sum = ghana + naija;
  const ghanaPct = sum > 0 ? (ghana / sum) * 100 : 50;

  return (
    <div className="glass p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold">
        <span className="text-ghana-gold">🇬🇭 Ghana · {ghana}</span>
        <span className="text-muted-foreground">Family Cup</span>
        <span className="text-emerald-300">{naija} · Nigeria 🇳🇬</span>
      </div>
      <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green"
          animate={{ width: `${ghanaPct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <div className="h-full flex-1 bg-gradient-to-r from-naija-green to-emerald-400" />
        <span
          className="absolute top-1/2 z-10 h-4 w-1 -translate-y-1/2 rounded-full bg-white shadow"
          style={{ left: `calc(${ghanaPct}% - 2px)` }}
          aria-hidden
        />
      </div>
      {sum === 0 && (
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          No points yet — first family to get cooking takes the lead.
        </p>
      )}
    </div>
  );
}
