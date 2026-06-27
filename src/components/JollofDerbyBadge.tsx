import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { JollofDerby } from "@/lib/scoring";

/**
 * Shown when the top Ghana & Nigeria players are neck-and-neck. The big
 * rivalry moment of the cookout.
 */
export function JollofDerbyBadge({ derby, className }: { derby: JollofDerby; className?: string }) {
  if (!derby.active || !derby.ghanaTop || !derby.nigeriaTop) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-orange-400/30 p-3",
        "bg-derby-gradient/10",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(206,17,38,0.18), rgba(252,209,22,0.14) 40%, rgba(0,135,81,0.18) 75%, rgba(0,135,81,0.2))",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-jollof/25 text-jollof">
            <Flame className="h-5 w-5 animate-pulse-glow" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-orange-100">Jollof Derby is ON 🔥</p>
            <p className="text-[11px] text-orange-100/70">
              {derby.margin === 0
                ? "Dead level — who cooks better AND plays better?"
                : `Just ${derby.margin} pt${derby.margin === 1 ? "" : "s"} between the families`}
            </p>
          </div>
        </div>
        <div className="text-right text-xs font-bold">
          <span className="text-ghana-gold">🇬🇭 {derby.ghanaTop.total}</span>
          <span className="mx-1 text-muted-foreground">v</span>
          <span className="text-emerald-300">{derby.nigeriaTop.total} 🇳🇬</span>
        </div>
      </div>
    </motion.div>
  );
}
