import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera, Home, Languages, User } from "lucide-react";
import { getSession } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/");
  if (!session.targetLang || !session.level) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#4B4B4B]">
      <main className="duo-safe-bottom mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:pb-28">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#E5E5E5] bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-2">
          <BottomNavLink href="/phrases" icon={<Languages size={21} />} label="Phrases" />
          <BottomNavLink href="/camera" icon={<Camera size={21} />} label="Camera" />
          <BottomNavLink href="/practice" icon={<Home size={21} />} label="Practice" />
          <BottomNavLink href="/profile" icon={<User size={21} />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function BottomNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-black text-[#777777] transition hover:bg-[#F7F7F7] hover:text-[#3C3C3C] active:bg-[#F7F7F7] sm:flex-row sm:gap-2 sm:text-sm"
    >
      {icon}
      {label}
    </Link>
  );
}
