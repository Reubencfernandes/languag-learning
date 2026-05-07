export default function Loading() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div className="duo-card p-6">
        <div className="h-8 w-2/3 animate-pulse rounded-xl bg-[#E5E5E5]" />
        <div className="mt-4 h-4 w-40 animate-pulse rounded-xl bg-[#E5E5E5]" />
      </div>
      <div className="duo-card space-y-3 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded-xl bg-[#E5E5E5]" />
        ))}
      </div>
    </article>
  );
}

