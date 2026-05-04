"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export function GenerateStoryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() || undefined }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || j.error || "Failed to generate.");
        return;
      }
      const j = await res.json();
      setOpen(false);
      setTopic("");
      router.push(`/practice/${j.story.id}`);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-10 rounded-full bg-primary px-5 text-sm font-medium text-black transition hover:opacity-90"
      >
        <Sparkles size={14} />
        New story
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Topic (optional)"
        className="h-10 w-52 rounded-full border border-white/10 bg-card px-4 text-sm text-[#E1E0CC] placeholder:text-white/30 focus:outline-none focus:border-primary/50"
      />
      <button
        onClick={submit}
        disabled={isPending}
        className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Generating…" : "Generate"}
      </button>
      <button
        onClick={() => { setOpen(false); setError(null); }}
        className="text-xs"
        style={{ color: "rgba(225,224,204,0.6)" }}
      >
        Cancel
      </button>
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}
