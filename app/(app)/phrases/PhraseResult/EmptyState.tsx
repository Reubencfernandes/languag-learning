import { PenLine } from "lucide-react";

export function EmptyState() {
  return (
    <div className="duo-card p-8 text-center sm:p-10">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EDE9FE] text-[#7C3AED] shadow-[0_4px_0_#DDD6FE]">
        <PenLine size={26} />
      </div>
      <h2 className="mt-5 text-xl font-black text-[#3C3C3C]">Enter a phrase to build a mini lesson</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-6 text-[#777777]">
        You will get a translation, grammar breakdown, example sentences, tips, and verb information when relevant.
      </p>
    </div>
  );
}
