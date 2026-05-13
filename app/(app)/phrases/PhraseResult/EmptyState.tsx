import { PenLine } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-2xl bg-white p-8 text-center sm:p-12 border-3 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFD21E] border-3 border-black text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-3">
        <PenLine size={32} strokeWidth={3} className="-rotate-3" />
      </div>
      <h2 className="mt-8 text-2xl sm:text-3xl font-black text-black tracking-tight uppercase leading-none">
        Enter a phrase to build a mini lesson
      </h2>
    </div>
  );
}
