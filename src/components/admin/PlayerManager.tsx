import { useState, type FormEvent } from "react";
import { UserPlus, Sparkles, Pencil, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { TeamBadge } from "@/components/TeamBadge";
import { TEAM_INFO, TEAM_ORDER } from "@/lib/teams";
import { gamesPlayed, totalPoints } from "@/lib/scoring";
import type { Player, Team } from "@/lib/types";
import { cn } from "@/lib/utils";

const ADMIN = "Derrick";

interface PlayerManagerProps {
  players: Player[];
  addPlayer: (input: { name: string; team: Team }) => Promise<Player>;
  editPlayer: (
    playerId: string,
    patch: Partial<Pick<Player, "name" | "team">>,
  ) => Promise<void>;
  removePlayer: (id: string) => Promise<void>;
  resetScores: (by: string) => Promise<void>;
  seedSamplePlayers: () => Promise<void>;
}

function TeamSelector({
  value,
  onChange,
}: {
  value: Team;
  onChange: (t: Team) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TEAM_ORDER.map((team) => {
        const info = TEAM_INFO[team];
        const active = team === value;
        return (
          <button
            key={team}
            type="button"
            onClick={() => onChange(team)}
            aria-pressed={active}
            className={cn(
              "tap-target flex flex-col items-center justify-center gap-1 rounded-xl border py-3 text-sm font-semibold transition-all",
              active
                ? "border-primary/70 bg-primary/15 text-foreground ring-1 ring-primary/40"
                : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-white/25 hover:text-foreground",
            )}
          >
            <span className="text-2xl" aria-hidden>
              {info.flag}
            </span>
            <span>{info.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function PlayerManager({
  players,
  addPlayer,
  editPlayer,
  removePlayer,
  resetScores,
  seedSamplePlayers,
}: PlayerManagerProps) {
  const [name, setName] = useState("");
  const [team, setTeam] = useState<Team>("ghana");
  const [adding, setAdding] = useState(false);
  const [seeding, setSeeding] = useState(false);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Give the player a name first.");
      return;
    }
    setAdding(true);
    try {
      await addPlayer({ name: trimmed, team });
      toast.success(`${trimmed} added to the ${TEAM_INFO[team].label} squad 🎉`);
      setName("");
      setTeam("ghana");
    } catch {
      toast.error("Could not add player — try again.");
    } finally {
      setAdding(false);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedSamplePlayers();
      toast.success("Sample players added 🍢");
    } catch {
      toast.error("Could not add sample players.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Add player */}
      <section className="glass p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Add a player</h2>
        </div>

        <form onSubmit={handleAdd} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="player-name">Name</Label>
            <Input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kwame"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label>Team</Label>
            <TeamSelector value={team} onChange={setTeam} />
          </div>

          <Button type="submit" disabled={adding} className="tap-target h-12 w-full font-semibold">
            <UserPlus className="mr-1 h-5 w-5" />
            {adding ? "Adding…" : "Add player"}
          </Button>
        </form>

        <div className="mt-3 border-t border-white/10 pt-3">
          <Button
            type="button"
            variant="secondary"
            disabled={seeding}
            onClick={handleSeed}
            className="tap-target h-11 w-full"
          >
            <Sparkles className="mr-1 h-4 w-4" />
            {seeding ? "Adding…" : "Add sample players"}
          </Button>
        </div>
      </section>

      {/* Roster */}
      <section className="glass p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Roster{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({players.length})
            </span>
          </h2>
          {players.length > 0 && (
            <ResetScoresDialog resetScores={resetScores} />
          )}
        </div>

        {players.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No players yet. Add one above or seed the sample squad.
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold leading-tight">
                    {player.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <TeamBadge team={player.team} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {totalPoints(player)} pts · {gamesPlayed(player)} played
                    </span>
                  </div>
                </div>

                <EditPlayerDialog player={player} editPlayer={editPlayer} />
                <RemovePlayerDialog player={player} removePlayer={removePlayer} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EditPlayerDialog({
  player,
  editPlayer,
}: {
  player: Player;
  editPlayer: PlayerManagerProps["editPlayer"];
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(player.name);
  const [team, setTeam] = useState<Team>(player.team);
  const [saving, setSaving] = useState(false);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setName(player.name);
      setTeam(player.team);
    }
  }

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Name can't be empty.");
      return;
    }
    setSaving(true);
    try {
      await editPlayer(player.id, { name: trimmed, team });
      toast.success("Player updated.");
      setOpen(false);
    } catch {
      toast.error("Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => onOpenChange(true)}
        aria-label={`Edit ${player.name}`}
        className="tap-target h-10 w-10 shrink-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit player</DialogTitle>
          <DialogDescription>Update the name or team. Scores stay intact.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor={`edit-name-${player.id}`}>Name</Label>
            <Input
              id={`edit-name-${player.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label>Team</Label>
            <TeamSelector value={team} onChange={setTeam} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="tap-target">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving} className="tap-target">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RemovePlayerDialog({
  player,
  removePlayer,
}: {
  player: Player;
  removePlayer: PlayerManagerProps["removePlayer"];
}) {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      await removePlayer(player.id);
      toast.success(`${player.name} removed.`);
      setOpen(false);
    } catch {
      toast.error("Could not remove player.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => setOpen(true)}
        aria-label={`Remove ${player.name}`}
        className="tap-target h-10 w-10 shrink-0 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {player.name}?</DialogTitle>
          <DialogDescription>
            This deletes the player and all of their scores. This can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="tap-target">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={removing}
            className="tap-target"
          >
            {removing ? "Removing…" : "Remove player"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResetScoresDialog({
  resetScores,
}: {
  resetScores: PlayerManagerProps["resetScores"];
}) {
  const [open, setOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await resetScores(ADMIN);
      toast.success("All scores reset to zero.");
      setOpen(false);
    } catch {
      toast.error("Could not reset scores.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="tap-target border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <RotateCcw className="mr-1 h-4 w-4" />
        Reset scores
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset all scores?</DialogTitle>
          <DialogDescription>
            This zeroes every player's points across all games. Players stay on
            the roster. This can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="tap-target">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={resetting}
            className="tap-target"
          >
            {resetting ? "Resetting…" : "Reset all scores"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerManager;
