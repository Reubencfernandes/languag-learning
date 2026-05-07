"use client";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="duo-card mx-auto max-w-md space-y-4 p-8 text-center">
      <h1 className="text-2xl font-black text-[#3C3C3C]">Something went wrong</h1>
      <p className="text-sm font-bold text-[#777777]">{error.message || "Please try again."}</p>
      <button
        onClick={reset}
        className="btn-duo btn-duo-primary"
      >
        Try again
      </button>
    </section>
  );
}

