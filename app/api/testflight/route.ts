import { normalizeEmail } from "@/lib/waitlist/validation"
import { saveSignup } from "@/lib/waitlist/save"

export const runtime = "nodejs"
export const maxDuration = 30
const json = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } })

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin || origin !== new URL(request.url).origin) return json({ error: "Please sign up from this website." }, 403)
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Invalid request." }, 415)
  let body: unknown
  try {
    const reader = request.body?.getReader()
    if (!reader) return json({ error: "Please enter your email." }, 400)
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 4096) { await reader.cancel(); return json({ error: "Request too large." }, 413) }
      chunks.push(value)
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } catch { return json({ error: "Invalid request." }, 400) }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Please enter a valid email." }, 400)
  const input = body as Record<string, unknown>
  if (input.website) return json({ ok: true })
  const email = normalizeEmail(input.email)
  if (!email) return json({ error: "Please enter a valid email address." }, 400)
  try {
    // Vercel overwrites this header at its edge; arbitrary forwarded headers are not trusted.
    const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : "local"
    if (!ip) return json({ error: "Please try again in a moment." }, 503)
    if (!await saveSignup(email, ip)) return Response.json({ error: "Too many attempts. Please try again in an hour." }, { status: 429, headers: { "Retry-After": "3600", "Cache-Control": "no-store" } })
    return json({ ok: true })
  } catch {
    console.error("TestFlight signup could not be saved")
    return json({ error: "We couldn’t save your email. Please try again." }, 503)
  }
}
