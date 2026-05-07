export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="duo-card p-6">
        <div className="h-7 w-56 animate-pulse rounded-xl bg-[#E5E5E5]" />
        <div className="mt-4 h-4 w-80 max-w-full animate-pulse rounded-xl bg-[#E5E5E5]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="duo-card h-36 animate-pulse bg-white" />
        ))}
      </div>
    </section>
  );
}

