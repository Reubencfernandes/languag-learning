import { Camera } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import type { Level } from "@/lib/languages";
import { CameraClient } from "./CameraClient";

export default async function CameraPage() {
  const session = (await getSession())!;
  return (
    <section className="space-y-6">
      <div className="duo-card bg-white p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#EDE9FE] text-[#7C3AED] shadow-[0_4px_0_#DDD6FE]">
            <Camera size={28} />
          </div>
          <div className="min-w-0">
            <div className="duo-eyebrow">Image practice</div>
            <h1 className="duo-page-title">Learn from a photo</h1>
            <p className="mt-1 text-sm font-bold text-[#777777]">
              Capture objects around you and turn them into vocabulary.
            </p>
          </div>
        </div>
      </div>
      <CameraClient defaultLevel={(session.level ?? "B1") as Level} />
    </section>
  );
}

