import type { GameMeta, GameId } from "./types";

/**
 * The six backyard mini-games. Order here is only the default display order —
 * the admin can score any game at any time (no fixed sequence).
 */
export const GAMES: GameMeta[] = [
  {
    id: "cup-pyramid-kickdown",
    label: "Cup Pyramid Kickdown",
    blurb: "Boot the ball, topple the tower.",
    icon: "Layers",
    emoji: "🥤",
    suggestedMax: 10,
  },
  {
    id: "top-corner-cup-shot",
    label: "Top Corner Cup Shot",
    blurb: "Find the postage stamp. Cups don't lie.",
    icon: "Target",
    emoji: "🎯",
    suggestedMax: 10,
  },
  {
    id: "cone-top-sniper",
    label: "Cone Top Sniper",
    blurb: "Knock the ball clean off the cone.",
    icon: "Crosshair",
    emoji: "🔺",
    suggestedMax: 10,
  },
  {
    id: "bucket-toss",
    label: "Bucket Toss",
    blurb: "Drain it in the bucket from distance.",
    icon: "ShoppingBasket",
    emoji: "🪣",
    suggestedMax: 10,
  },
  {
    id: "tiny-goal-shot",
    label: "Tiny Goal Shot",
    blurb: "Mini net, maximum bragging rights.",
    icon: "Goal",
    emoji: "🥅",
    suggestedMax: 10,
  },
  {
    id: "cup-bowling",
    label: "Cup Bowling",
    blurb: "Roll it. Strike. Repeat.",
    icon: "CircleDot",
    emoji: "🎳",
    suggestedMax: 10,
  },
];

export const GAME_IDS: GameId[] = GAMES.map((g) => g.id);

export const GAME_BY_ID: Record<GameId, GameMeta> = GAMES.reduce(
  (acc, g) => {
    acc[g.id] = g;
    return acc;
  },
  {} as Record<GameId, GameMeta>,
);
