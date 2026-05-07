import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DialogueLoader() {
  return (
    <div className="duo-card mx-auto max-w-md p-8 text-center">
      <p className="text-lg font-black text-[#3C3C3C]">Dialogue no longer available</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#777777]">
        Generated dialogues are temporary and are not stored after you leave the practice page.
      </p>
      <Link href="/practice" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#7C3AED]">
        <ArrowLeft size={16} />
        Back to practice
      </Link>
    </div>
  );
}
