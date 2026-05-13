"use client";

import { useEffect } from "react";

export function StreakUpdater() {
  useEffect(() => {
    fetch("/api/me/streak", { method: "POST" });
  }, []);
  return null;
}
