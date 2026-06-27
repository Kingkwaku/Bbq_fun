import { ArrowLeft, Camera, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { ShareCard } from "@/components/ShareCard";
import { Button } from "@/components/ui/button";

/**
 * The screen guests screenshot and share. A branded, centered poster
 * (ShareCard) with a back link and a native-share / copy-link action above.
 */
export default function Share() {
  const { loading, ranked, derby, state } = useLeaderboard();

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: "AfriCup Backyard Challenge",
      text: "Live leaderboard — Ghana × Nigeria BBQ Games 🇬🇭⚽🇳🇬",
      url,
    };

    // Prefer the native share sheet when available.
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled the share sheet — don't show an error, just bail.
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Otherwise fall through to clipboard.
      }
    }

    // Fallback: copy the link to the clipboard.
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — paste it in the group chat!");
    } catch {
      toast.error("Couldn't copy the link. Long-press the address bar to share.");
    }
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-6 safe-top safe-bottom">
      {/* Top bar — kept outside the ideal "screenshot frame". */}
      <div className="mb-5 flex w-full max-w-[420px] items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/" aria-label="Back to leaderboard">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <Button variant="default" size="sm" onClick={handleShare}>
          <Share2 />
          Share / Save
        </Button>
      </div>

      {/* The poster. */}
      {loading ? (
        <div className="glass-strong h-[520px] w-full max-w-[420px] animate-pulse rounded-3xl" />
      ) : (
        <ShareCard ranked={ranked} derby={derby} state={state} />
      )}

      {/* Helper text — also outside the frame. */}
      <p className="mt-5 flex max-w-[420px] items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Camera className="h-3.5 w-3.5" aria-hidden />
        Screenshot this card to share the standings, or tap Share to send the live link.
      </p>
    </main>
  );
}

export { Share };
