import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { HeroSection } from "./components/HeroSection";

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect("/practice");

  return <HeroSection />;
}
