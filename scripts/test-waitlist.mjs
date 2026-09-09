import assert from 'node:assert/strict'
import { randomUUID, createHmac } from 'node:crypto'
import nextEnv from '@next/env'
import pg from 'pg'
nextEnv.loadEnvConfig(process.cwd())
if (process.env.WAITLIST_TEST_DATABASE !== "true") throw new Error("Run only against an isolated test database with WAITLIST_TEST_DATABASE=true")
const db = new pg.Pool({connectionString:process.env.DATABASE_URL})
const origin = process.env.TEST_ORIGIN || 'http://localhost:3010'
const email = `pett-test-${randomUUID()}@example.com`
const post = (body, extra = {}) => fetch(`${origin}/api/testflight`, {method:'POST', headers:{origin, 'content-type':'application/json', ...extra}, body:JSON.stringify(body)})
const key=createHmac("sha256",process.env.SIGNUP_RATE_LIMIT_SECRET).update(`${Math.floor(Date.now()/3600000)}:local`).digest("hex")
try {
  await db.query("delete from signup_limits where key=$1",[key])
  assert.equal((await post({email:'wrong'})).status,400)
  assert.equal((await post({email},{origin:'https://elsewhere.example'})).status,403)
  assert.equal((await post({email,website:'bot.example'})).status,200)
  assert.equal((await post({email:'x'.repeat(5000)})).status,413)
  assert.equal((await post({email:`  ${email.toUpperCase()}  `})).status,200)
  assert.equal((await post({email})).status,200)
  const rows=await db.query('select email, created_at, consent_version from testflight_signups where email=$1',[email])
  assert.equal(rows.rowCount,1)
  assert.equal(rows.rows[0].consent_version,'testflight-invite-v1')
  assert.ok(rows.rows[0].created_at)
  for(let i=0;i<8;i++) await post({email})
  assert.equal((await post({email})).status,429)
  console.log('PASS: validation, cross-origin rejection, bot trap, size limit, database persistence, duplicates, and rate limiting')
} finally {
  await db.query('delete from testflight_signups where email=$1',[email])
  // This script is for the isolated development branch, never production.
  await db.query("delete from signup_limits where key=$1",[key])
  await db.end()
}
