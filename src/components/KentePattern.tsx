import { cn } from "@/lib/utils";

/** Thin kente-inspired stripe — used as a top accent on cards/headers. */
export function KenteStripe({ className }: { className?: string }) {
  return <div className={cn("kente-stripe h-1.5 w-full rounded-full", className)} aria-hidden />;
}

/**
 * Subtle ankara-inspired diamond pattern as a faint background accent.
 * Rendered as inline SVG so there are no external assets to ship.
 */
export function AnkaraBackdrop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="ankara" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="40" height="40" fill="none" />
          <path d="M20 4 L36 20 L20 36 L4 20 Z" fill="none" stroke="#FCD116" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="3" fill="#008751" />
          <circle cx="0" cy="0" r="2" fill="#CE1126" />
          <circle cx="40" cy="40" r="2" fill="#CE1126" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ankara)" />
    </svg>
  );
}
