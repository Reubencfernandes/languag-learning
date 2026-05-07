import { getSession } from "@/lib/auth/session";
import type { Level } from "@/lib/languages";
import { DialoguePracticeClient } from "./DialoguePracticeClient";

export default async function PracticePage() {
  const session = (await getSession())!;
  return <DialoguePracticeClient defaultLevel={(session.level ?? "B1") as Level} />;
}
