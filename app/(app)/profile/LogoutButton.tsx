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
    <button onClick={logout} disabled={isPending} className="btn-duo btn-duo-white gap-2 text-xs">
      <LogOut size={16} />
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}

