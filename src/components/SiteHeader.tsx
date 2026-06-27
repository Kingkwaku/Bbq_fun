import { Link } from "react-router-dom";
import { Radio, ShieldCheck, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  syncMode: "cloud" | "local";
  /** show the admin shortcut (hidden on the admin page itself) */
  showAdmin?: boolean;
}

/** Sticky top bar: wordmark + live-sync status + admin shortcut. */
export function SiteHeader({ syncMode, showAdmin = true }: SiteHeaderProps) {
  return (
    <header className="safe-top sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            ⚽
          </span>
          <span className="font-display text-sm font-bold leading-tight">
            <span className="text-gradient-gold">AfriCup</span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Backyard Challenge
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <SyncBadge syncMode={syncMode} />
          {showAdmin && (
            <Link
              to="/admin"
              className="tap-target inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-white/10"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SyncBadge({ syncMode }: { syncMode: "cloud" | "local" }) {
  const live = syncMode === "cloud";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
        live
          ? "border-emerald-400/30 bg-naija-green/20 text-emerald-200"
          : "border-white/15 bg-white/5 text-muted-foreground",
      )}
      title={
        live
          ? "Live sync on — everyone sees the same board"
          : "Single-device mode — add Supabase keys for live multi-phone sync"
      }
    >
      {live ? (
        <>
          <Radio className="h-3 w-3 animate-pulse-glow" />
          Live
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          This device
        </>
      )}
    </span>
  );
}
