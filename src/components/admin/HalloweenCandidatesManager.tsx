"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HalloweenCandidateRow {
  id: string;
  display_name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HalloweenCandidatesManagerProps {
  initialCandidates: HalloweenCandidateRow[];
}

export default function HalloweenCandidatesManager({ initialCandidates }: HalloweenCandidatesManagerProps) {
  const [candidates, setCandidates] = useState<HalloweenCandidateRow[]>(initialCandidates);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateSortOrder, setNewCandidateSortOrder] = useState(String(initialCandidates.length + 1));
  const [message, setMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setCandidates(initialCandidates);
    setNewCandidateSortOrder(String(initialCandidates.length + 1));
  }, [initialCandidates]);

  const activeCount = useMemo(() => candidates.filter((candidate) => candidate.is_active).length, [candidates]);

  async function handleSave(candidate: HalloweenCandidateRow) {
    setLoadingId(candidate.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/halloween/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: candidate.display_name,
          sortOrder: candidate.sort_order,
          isActive: candidate.is_active,
        }),
      });

      const body = (await response.json()) as { error?: string; candidate?: HalloweenCandidateRow };
      if (!response.ok) {
        throw new Error(body.error ?? "Unable to save candidate");
      }

      if (body.candidate) {
        setCandidates((current) => current.map((entry) => (entry.id === body.candidate?.id ? body.candidate! : entry)));
      }
      setMessage(`Saved ${candidate.display_name}.`);
    } catch (error) {
      console.error(error);
      setMessage("Unable to save candidate right now.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/halloween/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: newCandidateName,
          sortOrder: Number(newCandidateSortOrder) || candidates.length + 1,
          isActive: true,
        }),
      });

      const body = (await response.json()) as { error?: string; candidate?: HalloweenCandidateRow };
      if (!response.ok) {
        throw new Error(body.error ?? "Unable to create candidate");
      }

      if (body.candidate) {
        setCandidates((current) => [...current, body.candidate!].sort((a, b) => a.sort_order - b.sort_order));
      }

      setNewCandidateName("");
      setNewCandidateSortOrder(String(candidates.length + 2));
      setMessage("Candidate created.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to create candidate right now.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDisable(candidate: HalloweenCandidateRow) {
    setLoadingId(candidate.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/halloween/candidates/${candidate.id}`, {
        method: "DELETE",
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Unable to disable candidate");
      }

      setCandidates((current) => current.map((entry) => (entry.id === candidate.id ? { ...entry, is_active: false } : entry)));
      setMessage(`Disabled ${candidate.display_name}.`);
    } catch (error) {
      console.error(error);
      setMessage("Unable to disable candidate right now.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-outfit text-xs uppercase tracking-[0.24em] text-muted-foreground">Contestant manager</p>
          <h2 className="mt-2 font-playfair text-2xl font-bold text-foreground">Edit Halloween finalists</h2>
          <p className="mt-2 font-outfit text-sm text-muted-foreground">Active finalists: {activeCount} of {candidates.length}</p>
        </div>
        {message ? <p className="font-outfit text-sm text-muted-foreground">{message}</p> : null}
      </div>

      <form className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_160px_auto]" onSubmit={handleCreate}>
        <input
          value={newCandidateName}
          onChange={(event) => setNewCandidateName(event.target.value)}
          placeholder="New finalist name"
          className="rounded-xl border border-white/10 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-cinema-gold/40"
        />
        <input
          value={newCandidateSortOrder}
          onChange={(event) => setNewCandidateSortOrder(event.target.value)}
          inputMode="numeric"
          placeholder="Order"
          className="rounded-xl border border-white/10 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-cinema-gold/40"
        />
        <Button
          type="submit"
          disabled={isCreating || !newCandidateName.trim()}
          className="velvet-glow font-outfit text-xs uppercase tracking-[0.24em]"
        >
          {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add finalist
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        {candidates.map((candidate) => (
          <div key={candidate.id} className={cn("rounded-2xl border p-4 transition", candidate.is_active ? "border-white/10 bg-black/20" : "border-white/5 bg-black/10 opacity-70")}>
            <div className="grid gap-3 md:grid-cols-[1fr_110px_110px_auto] md:items-center">
              <input
                value={candidate.display_name}
                onChange={(event) => setCandidates((current) => current.map((entry) => entry.id === candidate.id ? { ...entry, display_name: event.target.value } : entry))}
                className="rounded-xl border border-white/10 bg-background/70 px-3 py-2 font-playfair text-lg text-foreground outline-none transition focus:border-cinema-gold/40"
              />
              <input
                type="number"
                value={candidate.sort_order}
                onChange={(event) => setCandidates((current) => current.map((entry) => entry.id === candidate.id ? { ...entry, sort_order: Number(event.target.value) } : entry))}
                className="rounded-xl border border-white/10 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-cinema-gold/40"
              />
              <label className="flex items-center gap-2 font-outfit text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={candidate.is_active}
                  onChange={(event) => setCandidates((current) => current.map((entry) => entry.id === candidate.id ? { ...entry, is_active: event.target.checked } : entry))}
                  className="h-4 w-4 rounded border-border bg-background"
                />
                Active
              </label>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  onClick={() => void handleSave(candidate)}
                  disabled={loadingId === candidate.id}
                  className="font-outfit text-xs uppercase tracking-[0.22em]"
                >
                  {loadingId === candidate.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleDisable(candidate)}
                  disabled={loadingId === candidate.id || !candidate.is_active}
                  className="font-outfit text-xs uppercase tracking-[0.22em]"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Disable
                </Button>
              </div>
            </div>
            <p className="mt-3 font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Slug: {candidate.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}