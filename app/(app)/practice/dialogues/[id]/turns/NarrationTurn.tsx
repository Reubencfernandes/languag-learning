"use client";

export function NarrationTurn({
  text,
  current,
  onContinue,
}: {
  text: string;
  current: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="rounded-2xl bg-[#FFF7D6] border-3 border-black p-5 text-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <p className="text-base font-black italic text-black leading-relaxed tracking-wide">{text}</p>
      {current ? (
        <button onClick={onContinue} className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#0EA5A4] text-white px-6 py-2.5 text-xs font-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wider">
          Continue
        </button>
      ) : null}
    </div>
  );
}
