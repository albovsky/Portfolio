"use client"

import { useState, type CSSProperties } from "react"
import { Doto } from "next/font/google"
import "./triathlon.css"
import { WorkoutIcon } from "./workout-icon"

const raceNumerals = Doto({ subsets: ["latin"], axes: ["ROND"], display: "swap" })

const stages = [
  { name: "Swim", time: "39:48", seconds: 2388, barColor: "var(--tri-swim)" },
  { name: "T1", time: "8:37", seconds: 517, barColor: "var(--tri-ink)" },
  { name: "Bike", time: "56:42", seconds: 3402, barColor: "var(--tri-bike)" },
  { name: "T2", time: "2:18", seconds: 138, barColor: "var(--tri-ink)" },
  { name: "Run", time: "28:51", seconds: 1731, barColor: "var(--tri-run)" },
] as const
const total = stages.reduce((sum, stage) => sum + stage.seconds, 0)
const finishTime = `${Math.floor(total / 3600)}:${String(Math.floor(total / 60) % 60).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
const ends = stages.map((_, index) => stages.slice(0,index+1).reduce((sum,stage)=>sum+stage.seconds,0))
const ticks = Array.from({ length: 48 }, (_, i) => {
  const stage = ends.findIndex(end => (i + .5) / 48 * total < end)
  return { x: i * 5 + 1, stage: Math.max(0, stage) }
})

export function TriathlonCard() {
  const [preview, setPreview] = useState<number | null>(null)
  const active = preview
  const stage = active === null ? null : stages[active]
  const displayedTime = stage?.time ?? finishTime
  return <div className="tri-card" style={{ "--tri-active": stage?.barColor ?? "var(--tri-ink)" } as CSSProperties}>
    <header className="tri-header">
      <div><h2>T100 Sprint</h2><p>My first triathlon</p></div>
      <WorkoutIcon sport={active === null ? null : active === 0 ? "swim" : active <= 2 ? "bike" : "run"} />
    </header>
    <div className="tri-result" aria-live="polite" aria-atomic="true">
      <span className="tri-result-label">{stage ? `${stage.name} split` : "Finish time"}</span>
      <strong className={`tri-time ${raceNumerals.className}`}>{displayedTime}</strong>
    </div>
    <div className="tri-timeline">
      <svg viewBox="0 0 240 42" preserveAspectRatio="none" aria-hidden="true">
        {ticks.map((tick, i) => <rect key={i} x={tick.x} y="8" width="3" height="30" rx="1.5" fill={stages[tick.stage].barColor} className="tri-tick" opacity={active === null || active === tick.stage ? 1 : .2} />)}
      </svg>

    </div>
    <div className="tri-splits" aria-label="Explore race splits">{stages.map((item,index) => <div key={item.name} role="group" tabIndex={0} aria-label={`${item.name} split, ${item.time}`} className="tri-split" data-active={active === index} onPointerEnter={event => { if (event.pointerType === "mouse") setPreview(index) }} onPointerLeave={() => setPreview(null)} onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setPreview(index) }} onBlur={() => setPreview(current => current === index ? null : current)}>
      <span>{item.name}</span><strong>{item.time}</strong>
    </div>)}</div>
  </div>
}
