import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { dialogues } from "@/lib/db/schema";
import { DialogueClient } from "./DialogueClient";

export default async function DialoguePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/");

  const { id } = await params;
  const [dialogue] = await db.select().from(dialogues).where(eq(dialogues.id, id)).limit(1);
  if (!dialogue) notFound();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(225,224,204,0.5)" }}>
          {dialogue.targetLang.toUpperCase()} · {dialogue.level}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#E1E0CC]">{dialogue.title}</h1>
      </div>
      <DialogueClient dialogue={dialogue} />
    </div>
  );
}
