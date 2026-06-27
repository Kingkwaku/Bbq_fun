import { cn } from "@/lib/utils";
import { TEAM_INFO } from "@/lib/teams";
import type { Team } from "@/lib/types";

interface TeamBadgeProps {
  team: Team;
  /** show the family nickname instead of country name */
  family?: boolean;
  className?: string;
  size?: "sm" | "md";
}

/** Small flag + label chip used on player cards and headers. */
export function TeamBadge({ team, family = false, className, size = "md" }: TeamBadgeProps) {
  const info = TEAM_INFO[team];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold",
        info.chipClass,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        className,
      )}
    >
      <span aria-hidden>{info.flag}</span>
      <span>{family ? info.family : info.label}</span>
    </span>
  );
}
