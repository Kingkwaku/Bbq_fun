/** Compact relative time like "just now", "3m ago", "2h ago", "yesterday". */
export function relativeTime(ts: number | null | undefined): string {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.round(hr / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}
