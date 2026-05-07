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
    <div className="duo-card bg-[#F7F7F7] p-5 text-center">
      <p className="text-base font-black italic text-[#777777]">{text}</p>
      {current ? (
        <button onClick={onContinue} className="btn-duo btn-duo-secondary mt-4 text-sm">
          Continue
        </button>
      ) : null}
    </div>
  );
}
