import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core"

export const testflightSignups = pgTable("testflight_signups", {
  email: text("email").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  consentVersion: text("consent_version").notNull().default("testflight-invite-v1"),
})

export const signupLimits = pgTable("signup_limits", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull().default(1),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
})
