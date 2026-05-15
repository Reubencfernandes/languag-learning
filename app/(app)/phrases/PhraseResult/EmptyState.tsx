import { PenLine } from "lucide-react";

export function EmptyState({ isPending = false }: { isPending?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center sm:p-12 border-3 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFD21E] border-3 border-black text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-3">
        <PenLine size={32} strokeWidth={3} className="-rotate-3" />
      </div>
      {isPending ? (
        <div className="mt-8 space-y-4">
          <div className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase leading-none">
            Building your mini lesson...
          </div>
          <div className="mx-auto h-6 w-full max-w-md overflow-hidden rounded-full border-3 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="phrases-progress-bar h-full bg-[#0EA5A4]" />
          </div>
        </div>
      ) : (
        <h2 className="mt-8 text-2xl sm:text-3xl font-black text-black tracking-tight uppercase leading-none">
          Enter a phrase to build a mini lesson
        </h2>
      )}
      <style>{`
        @keyframes phrases-progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .phrases-progress-bar {
          width: 33%;
          animation: phrases-progress-slide 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
