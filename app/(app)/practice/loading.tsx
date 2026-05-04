export default function Loading() {
  return (
    <section className="space-y-8">
      <div className="h-6 w-40 animate-pulse rounded-md bg-[--color-border]" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-[--color-border] bg-[--color-card]" />
        ))}
      </div>
    </section>
  );
}
