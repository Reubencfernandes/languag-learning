export default function Loading() {
  return (
    <article className="space-y-6">
      <div className="h-8 w-2/3 animate-pulse rounded-md bg-[--color-border]" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded-md bg-[--color-border]" />
        ))}
      </div>
    </article>
  );
}
