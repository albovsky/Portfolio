"use client"

import { useEffect, useId, useRef } from "react"

type Sport = "swim" | "bike" | "run"
type Point = [number, number]
const limb = (root: Point, joint: Point, end: Point) => `M${root.join(" ")}L${joint.join(" ")}L${end.join(" ")}`
function loop(poses: string[], offset = 0) {
  const shifted = poses.map((_, i) => poses[(i + offset) % poses.length])
  return [...shifted, shifted[0]]
}
function MovingLimb({ frames, duration, width = 5.5 }: { frames: string[]; duration: number; width?: number }) {
  return <path d={frames[0]} strokeWidth={width}>
    <animate attributeName="d" values={frames.join(";")} dur={`${duration}s`} repeatCount="indefinite" calcMode="linear" />
  </path>
}
// The foot travels forward, lands, pushes back, then folds up for recovery.
const runLegs = loop([
  limb([29,36],[39,42],[45,54]), limb([29,36],[34,47],[35,59]),
  limb([29,36],[25,47],[20,57]), limb([29,36],[19,43],[9,48]),
  limb([29,36],[19,41],[18,32]), limb([29,36],[26,43],[19,36]),
  limb([29,36],[36,37],[28,44]), limb([29,36],[41,38],[43,47]),
])
const runArms = loop([
  limb([35,19],[42,27],[50,20]), limb([35,19],[38,30],[46,27]),
  limb([35,19],[31,30],[39,32]), limb([35,19],[25,27],[24,36]),
  limb([35,19],[23,21],[19,30]), limb([35,19],[26,21],[21,29]),
  limb([35,19],[34,27],[39,23]), limb([35,19],[40,26],[47,18]),
])
const swimArms = loop([
  limb([29,35],[43,17],[52,24]), limb([29,35],[39,15],[47,20]),
  limb([29,35],[33,17],[38,14]), limb([29,35],[28,21],[24,15]),
  limb([29,35],[23,26],[15,22]), limb([29,35],[19,31],[10,31]),
  limb([29,35],[20,40],[11,42]), limb([29,35],[27,45],[23,50]),
  limb([29,35],[37,44],[40,50]), limb([29,35],[46,37],[53,42]),
  limb([29,35],[48,28],[55,34]), limb([29,35],[46,21],[55,28]),
])
const swimDuration = "1.4s"
// The surface and submerged dots travel in one direction through a full wave.
const waveY = (x: number, phase: number) => 41 + Math.sin((x - 6) / 28 * Math.PI * 2 + phase) * 2.2
const waterFrames = loop(Array.from({ length: 24 }, (_, frame) => {
  const phase = frame / 24 * Math.PI * 2
  let path = `M6 ${waveY(6, phase)}`
  for (let x = 6; x < 58; x += 4) {
    const slope = (at: number) => Math.cos((at - 6) / 28 * Math.PI * 2 + phase) * 2.2 * Math.PI * 2 / 28
    path += `C${x + 4 / 3} ${waveY(x, phase) + slope(x) * 4 / 3} ${x + 8 / 3} ${waveY(x + 4, phase) - slope(x + 4) * 4 / 3} ${x + 4} ${waveY(x + 4, phase)}`
  }
  return path
}))
// Both feet follow the crank through 360 degrees; knees follow a two-bone linkage.
const pedalPoses = Array.from({ length: 24 }, (_, i) => {
  const angle = i / 24 * Math.PI * 2
  const foot: Point = [34 + Math.cos(angle) * 6, 44 + Math.sin(angle) * 6]
  const hip: Point = [24,27]
  const dx = foot[0] - hip[0], dy = foot[1] - hip[1]
  const distance = Math.hypot(dx,dy)
  const along = (14 * 14 - 15 * 15 + distance * distance) / (2 * distance)
  const bend = Math.sqrt(Math.max(0,14 * 14 - along * along))
  const knee: Point = [hip[0] + along * dx / distance + bend * dy / distance, hip[1] + along * dy / distance - bend * dx / distance]
  return limb(hip,knee,foot)
})

/** Native SVG cycles interpolate precomputed poses; React never runs per frame. */
export function WorkoutIcon({ sport }: { sport: Sport | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const waterClipId = useId()
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false
    const update = () => {
      const paused = !visible || document.hidden || reduced.matches
      node.dataset.paused = String(paused)
      node.querySelectorAll("svg").forEach(svg => {
        if (reduced.matches) svg.setCurrentTime(0)
        if (paused) svg.pauseAnimations()
        else svg.unpauseAnimations()
      })
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(node)
    document.addEventListener("visibilitychange", update)
    reduced.addEventListener("change", update)
    update()
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); reduced.removeEventListener("change", update) }
  }, [])
  return <div ref={ref} className="tri-athlete" data-mode={sport ?? "cycle"} data-paused="true" aria-hidden="true">
    <svg className="tri-athlete-swim" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(64 0) scale(-1 1)">
      <defs><clipPath id={waterClipId}><path d={`${waterFrames[0]}L58 0H6Z`} transform="translate(0 -5)">
        <animate attributeName="d" values={waterFrames.map(path => `${path}L58 0H6Z`).join(";")} dur={swimDuration} repeatCount="indefinite" />
      </path></clipPath></defs>
      <g clipPath={`url(#${waterClipId})`}>
        <circle cx="19" cy="26" r="5" fill="currentColor" stroke="none">
          <animate attributeName="cy" values="26;28;34;36;34;29;26" keyTimes="0;.16;.33;.5;.67;.84;1" dur={swimDuration} repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1" />
        </circle>
        <path d="M24 37Q27 30 31 30C35 30 39 35 44 36Q49 38 54 40H24Z" fill="currentColor" stroke="none" />
        <MovingLimb frames={swimArms} duration={1.4} width={7} />
      </g>
      <path d={waterFrames[0]} strokeWidth="3">
        <animate attributeName="d" values={waterFrames.join(";")} dur={swimDuration} repeatCount="indefinite" />
      </path>
      <g fill="currentColor" stroke="none">{Array.from({ length: 13 }, (_, i) => {
        const x = 7 + i * 4
        const positions = loop(Array.from({ length: 24 }, (_, frame) => String(waveY(x, frame / 24 * Math.PI * 2) + 7)))
        return <circle key={i} cx={x} cy={positions[0]} r="1.35">
          <animate attributeName="cy" values={positions.join(";")} dur={swimDuration} repeatCount="indefinite" />
        </circle>
      })}</g>
      </g>
    </svg>
    <svg className="tri-athlete-bike" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <g strokeWidth="2.5"><circle cx="14" cy="46" r="11" /><circle cx="50" cy="46" r="11" /><path d="m14 46 10-19 10 19H14m20 0 11-21 5 21M40 24h7M20 26h8" /></g>
      <MovingLimb frames={loop(pedalPoses,12)} duration={.9} width={4.5} />
      <circle cx="39" cy="10" r="4.5" fill="currentColor" />
      <path d="m31 18-7 9m7-9 9 8h8" strokeWidth="5" />
      <MovingLimb frames={loop(pedalPoses)} duration={.9} width={5} />
    </svg>
    <svg className="tri-athlete-run" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
      <MovingLimb frames={loop(runArms.slice(0,-1),4)} duration={.9} /><MovingLimb frames={loop(runLegs.slice(0,-1),4)} duration={.9} />
      <circle cx="39" cy="9" r="5" fill="currentColor" stroke="none" />
      <path d="m35 19-6 17" strokeWidth="8" />
      <MovingLimb frames={runArms} duration={.9} />
      <MovingLimb frames={runLegs} duration={.9} />
    </svg>
  </div>
}
