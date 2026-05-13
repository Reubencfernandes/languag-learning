import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function StoryLoader() {
  return (
    <div className="duo-card mx-auto max-w-md p-8 text-center">
      <p className="text-lg font-black text-[#3C3C3C]">Story no longer available</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#777777]">
        Generated stories are not stored or kept as a history in PraxaLing.
      </p>
      <Link href="/practice" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#3B82F6]">
        <ArrowLeft size={16} />
        Back to practice
      </Link>
    </div>
  );
}
