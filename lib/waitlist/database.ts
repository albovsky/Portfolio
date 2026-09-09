import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { attachDatabasePool } from "@vercel/functions"

let pool: Pool | undefined
export function getSignupDb() {
  if (!process.env.DATABASE_URL) throw new Error("Signup database is not configured")
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 5000, connectionTimeoutMillis: 8000, statement_timeout: 8000 })
    pool.on("error", () => console.error("Signup database connection failed"))
    if (process.env.VERCEL) attachDatabasePool(pool)
  }
  return drizzle(pool)
}
