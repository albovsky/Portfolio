import { createHmac } from "node:crypto"
import { lt, sql } from "drizzle-orm"
import { getSignupDb } from "./database"
import { signupLimits, testflightSignups } from "./schema"

export async function saveSignup(email: string, ip: string) {
  const secret = process.env.SIGNUP_RATE_LIMIT_SECRET
  if (!secret) throw new Error("Signup rate limit is not configured")
  const hour = Math.floor(Date.now() / 3600000)
  const key = createHmac("sha256", secret).update(`${hour}:${ip}`).digest("hex")
  return getSignupDb().transaction(async tx => {
    await tx.delete(signupLimits).where(lt(signupLimits.expiresAt, new Date()))
    const [limit] = await tx.insert(signupLimits).values({ key, expiresAt: new Date((hour + 1) * 3600000) })
      .onConflictDoUpdate({ target: signupLimits.key, set: { attempts: sql`${signupLimits.attempts} + 1` } }).returning()
    if (limit.attempts > 10) return false
    await tx.insert(testflightSignups).values({ email }).onConflictDoNothing()
    return true
  })
}
