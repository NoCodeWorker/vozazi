import { pgTable, uuid, varchar, timestamp, text, integer, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const UserRole = pgEnum("user_role", ["admin", "user", "premium"])
export const AudioStatus = pgEnum("audio_status", ["pending", "processing", "completed", "failed"])
export const SubscriptionPlan = pgEnum("subscription_plan", ["free", "pro", "enterprise"])

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  role: UserRole("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Audio files table
export const audioFiles = pgTable("audio_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  duration: integer("duration"), // in seconds
  status: AudioStatus("status").default("pending").notNull(),
  storageKey: text("storage_key").notNull(),
  publicUrl: text("public_url"),
  metadata: jsonb("metadata"),
  transcript: text("transcript"),
  analysis: jsonb("analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique(),
  plan: SubscriptionPlan("plan").default("free").notNull(),
  status: varchar("status", { length: 50 }).default("active"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Usage tracking table
export const usage = pgTable("usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  audioMinutes: integer("audio_minutes").default(0).notNull(),
  transcriptions: integer("transcriptions").default(0).notNull(),
  analyses: integer("analyses").default(0).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  audioFiles: many(audioFiles),
  subscriptions: many(subscriptions),
  usage: many(usage)
}))

export const audioFilesRelations = relations(audioFiles, ({ one }) => ({
  user: one(users, {
    fields: [audioFiles.userId],
    references: [users.id]
  })
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  })
}))

export const usageRelations = relations(usage, ({ one }) => ({
  user: one(users, {
    fields: [usage.userId],
    references: [users.id]
  })
}))

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type AudioFile = typeof audioFiles.$inferSelect
export type NewAudioFile = typeof audioFiles.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
export type Usage = typeof usage.$inferSelect
export type NewUsage = typeof usage.$inferInsert
