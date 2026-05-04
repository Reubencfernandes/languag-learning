"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function logout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      onClick={logout}
      disabled={isPending}
      className="inline-flex items-center gap-2 h-11 rounded-full border px-6 text-sm transition-colors hover:border-primary/40 hover:text-[#E1E0CC] disabled:opacity-50"
      style={{ borderColor: "rgba(225,224,204,0.15)", color: "rgba(225,224,204,0.6)" }}
    >
      <LogOut size={14} />
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
