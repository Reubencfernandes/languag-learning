"use client";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="space-y-4 py-10 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong.</h1>
      <p className="text-sm text-[--color-muted]">{error.message || "Please try again."}</p>
      <button
        onClick={reset}
        className="h-11 rounded-full bg-[--color-accent] px-6 text-sm font-medium text-[--color-accent-foreground]"
      >
        Try again
      </button>
    </section>
  );
}
