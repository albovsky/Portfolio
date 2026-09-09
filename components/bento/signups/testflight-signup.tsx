"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowRight, ArrowUpRight, Check, LoaderCircle } from "lucide-react"
import "./testflight-signup.css"

export function TestflightSignup() {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle")
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const busy = useRef(false)
  useEffect(() => { if (expanded) input.current?.focus() }, [expanded])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy.current) return
    busy.current = true
    setStatus("saving")
    setError("")
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch("/api/testflight", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, website: form.get("website") }), signal: AbortSignal.timeout(25000) })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.error || "Please try again.")
      setStatus("success")
      setEmail("")
    } catch (failure) {
      setStatus("idle")
      setError(failure instanceof Error && failure.name !== "TimeoutError" ? failure.message : "Connection timed out. Please try again.")
      input.current?.focus()
    } finally { busy.current = false }
  }

  return <div className="pett-signup" data-expanded={expanded}>
    <div className="pett-signup-shell" data-success={status === "success"}>
      {!expanded ? <button type="button" className="pett-signup-open" onClick={() => setExpanded(true)} aria-expanded={false}>Join the TestFlight <ArrowUpRight aria-hidden="true" /></button>
        : status === "success" ? <div className="pett-signup-success" role="status"><Check aria-hidden="true" />You’re on the list!</div>
          : <form onSubmit={submit} className="pett-signup-form" aria-label="Join the Pett TestFlight waitlist" aria-busy={status === "saving"}>
            <label className="sr-only" htmlFor="pett-signup-email">Email address</label>
            <input ref={input} id="pett-signup-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} placeholder="Your email address" value={email} onChange={e => { setEmail(e.target.value); setError("") }} readOnly={status === "saving"} aria-invalid={!!error} aria-describedby="pett-signup-note" />
            <div className="pett-signup-honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <button type="submit" disabled={status === "saving"} aria-label={status === "saving" ? "Saving your email" : "Sign up for TestFlight"}>{status === "saving" ? <LoaderCircle className="pett-signup-spinner" /> : <ArrowRight />}</button>
          </form>}
    </div>
    {expanded && <p id="pett-signup-note" className="pett-signup-note" role={error ? "alert" : undefined}>{error || (status === "success" ? "We’ll email when testing opens." : "Only an email when testing opens.")}</p>}
  </div>
}
