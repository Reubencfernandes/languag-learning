CREATE TABLE IF NOT EXISTS "dialogues" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "target_lang" varchar(8) NOT NULL,
  "level" varchar(4) NOT NULL,
  "title" text NOT NULL,
  "scenario" text NOT NULL,
  "turns" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_by" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "dialogues_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null
);

CREATE INDEX IF NOT EXISTS "dialogues_lang_level_idx" ON "dialogues" ("target_lang", "level");
