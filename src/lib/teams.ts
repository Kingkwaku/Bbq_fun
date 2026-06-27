import type { Team } from "./types";

export interface TeamInfo {
  id: Team;
  label: string;
  /** family / fan-zone flavor label */
  family: string;
  flag: string;
  /** tailwind-friendly accent for badges, rings, bars */
  accent: string;
  ring: string;
  barClass: string;
  chipClass: string;
}

export const TEAM_INFO: Record<Team, TeamInfo> = {
  ghana: {
    id: "ghana",
    label: "Ghana",
    family: "Black Stars",
    flag: "🇬🇭",
    accent: "#CE1126",
    ring: "ring-ghana-red/50",
    barClass: "bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green",
    chipClass: "bg-ghana-red/20 text-ghana-gold border-ghana-gold/30",
  },
  nigeria: {
    id: "nigeria",
    label: "Nigeria",
    family: "Super Eagles",
    flag: "🇳🇬",
    accent: "#008751",
    ring: "ring-naija-green/50",
    barClass: "bg-gradient-to-r from-naija-green via-emerald-400 to-naija-green",
    chipClass: "bg-naija-green/25 text-emerald-200 border-emerald-400/30",
  },
  neutral: {
    id: "neutral",
    label: "Neutral",
    family: "Free Agent",
    flag: "⚽",
    accent: "#FCD116",
    ring: "ring-primary/40",
    barClass: "bg-gradient-to-r from-amber-300 to-primary",
    chipClass: "bg-white/10 text-foreground border-white/20",
  },
};

export const TEAM_ORDER: Team[] = ["ghana", "nigeria", "neutral"];
