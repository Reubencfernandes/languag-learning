import { relations, sql } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  hfId: varchar("hf_id", { length: 64 }).notNull().unique(),
  hfUsername: varchar("hf_username", { length: 128 }).notNull(),
  email: varchar("email", { length: 256 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  nativeLang: varchar("native_lang", { length: 8 }).notNull(),
  targetLang: varchar("target_lang", { length: 8 }).notNull(),
  level: varchar("level", { length: 4 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  targetLang: varchar("target_lang", { length: 8 }).notNull(),
  level: varchar("level", { length: 4 }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  vocab: jsonb("vocab").$type<Array<{ word: string; gloss: string }>>().default(sql`'[]'::jsonb`),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const storyReads = pgTable(
  "story_reads",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.storyId] })],
);

export const visionJobs = pgTable("vision_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  objects: jsonb("objects").$type<
    Array<{ label: string; translation: string; box: [number, number, number, number]; score: number }>
  >(),
  sentences: jsonb("sentences").$type<Array<{ target: string; gloss: string }>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DialogueOption = {
  text: string;
  isCorrect: boolean;
  feedback: string;
};

export type DialogueTurn = {
  type: "narration" | "character" | "user_choice";
  text: string;
  translation?: string;
  speakerName?: string;
  options?: DialogueOption[];
};

export const dialogues = pgTable("dialogues", {
  id: uuid("id").primaryKey().defaultRandom(),
  targetLang: varchar("target_lang", { length: 8 }).notNull(),
  level: varchar("level", { length: 4 }).notNull(),
  title: text("title").notNull(),
  scenario: text("scenario").notNull(),
  turns: jsonb("turns").$type<DialogueTurn[]>().notNull().default(sql`'[]'::jsonb`),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  stories: many(stories),
  reads: many(storyReads),
  visionJobs: many(visionJobs),
  dialogues: many(dialogues),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const storiesRelations = relations(stories, ({ one, many }) => ({
  author: one(users, { fields: [stories.createdBy], references: [users.id] }),
  reads: many(storyReads),
}));

export const storyReadsRelations = relations(storyReads, ({ one }) => ({
  user: one(users, { fields: [storyReads.userId], references: [users.id] }),
  story: one(stories, { fields: [storyReads.storyId], references: [stories.id] }),
}));

export const dialoguesRelations = relations(dialogues, ({ one }) => ({
  author: one(users, { fields: [dialogues.createdBy], references: [users.id] }),
}));
