import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/");

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);

  if (!profile) redirect("/onboarding");

  return (
    <div className="flex min-h-full flex-col bg-black">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/practice"
            className="text-sm font-medium tracking-tight text-primary"
          >
            Langlearn
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/practice"
              className="transition-colors hover:text-[#E1E0CC]"
              style={{ color: "rgba(225,224,204,0.8)" }}
            >
              Practice
            </Link>
            <Link
              href="/camera"
              className="transition-colors hover:text-[#E1E0CC]"
              style={{ color: "rgba(225,224,204,0.8)" }}
            >
              Camera
            </Link>
            <Link
              href="/profile"
              className="transition-colors hover:text-[#E1E0CC]"
              style={{ color: "rgba(225,224,204,0.8)" }}
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
