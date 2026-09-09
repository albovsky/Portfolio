import type { CSSProperties, ReactNode } from "react"
import type { Palette } from "./cat-sprite"

// Eight drawn poses: contact, weight-bearing, passing, lift, and recovery.
// Knees fold during recovery; planted paws travel back underneath the body.
const walk = [
  [5, 0, 5, 67], [2, 0, 3, 68], [-2, 0, 0, 68], [-5, 0, -2, 67],
  [-6, -2, -5, 65], [-2, -5, -4, 64], [3, -6, 0, 64], [6, -2, 4, 65],
]
const gallop = [
  [-8, -2, -3, 64], [-4, -7, 2, 61], [3, -9, 5, 60], [10, -5, 7, 62],
  [12, 0, 6, 66], [6, 0, 1, 68], [-2, 0, -5, 67], [-9, -1, -7, 65],
]
const tails = [
  "M16 50H10V45H6V34H8V30", "M16 50H10V44H5V33H7V29",
  "M16 50H9V43H4V34H5V29", "M16 50H9V44H3V36H4V31",
  "M16 50H9V45H3V38H2V34", "M16 50H10V46H4V40H2V36",
  "M16 50H10V46H5V39H3V34", "M16 50H10V45H6V36H5V31",
]
function BentLeg({ p, x, pose, far = false }: { p: Palette; x: number; pose: number[]; far?: boolean }) {
  const [offset, lift, knee, kneeY] = pose
  const foot = x + offset
  const d = `M${x} 57L${x + knee} ${kneeY}L${foot} ${72 + lift}h5`
  return <g>
    <path d={d} fill="none" stroke={p.outline} strokeWidth="8" strokeLinejoin="bevel" />
    <path d={d} fill="none" stroke={far ? p.shade : p.coat} strokeWidth="4" strokeLinejoin="bevel" />
    <path d={`M${foot - 2} ${73 + lift}h9v3h-9Z`} fill={far ? p.coat : p.light} />
    <path d={`M${foot + 2} ${75 + lift}h1m2 0h1`} stroke={p.shade} />
  </g>
}
export function CatGait({ p, sprint, head }: { p: Palette; sprint: boolean; head: ReactNode }) {
  const poses = sprint ? gallop : walk
  return <g className="cat-gait">
    {poses.map((_, frame) => {
      const lift = (sprint ? [0, -2, -4, -5, -3, 1, 2, 0] : [0, 0, -1, -1, 0, 0, -1, -1])[frame]
      const rear = poses[(frame + (sprint ? 3 : 4)) % 8]
      return <g key={frame} className="cat-gait-frame" style={{ "--frame": frame } as CSSProperties}>
        <g transform={`translate(0 ${lift})`}>
          <path d={sprint ? `M16 50L8 ${46 + frame % 3}H-2L-8 ${42 + frame % 3}` : tails[frame]} fill="none" stroke={p.outline} strokeWidth="7" strokeLinejoin="bevel" />
          <path d={sprint ? `M16 50L8 ${46 + frame % 3}H-2L-8 ${42 + frame % 3}` : tails[frame]} fill="none" stroke={p.coat} strokeWidth="3" strokeLinejoin="bevel" />
        </g>
        <BentLeg p={p} x={21} pose={poses[(frame + 1) % 8]} far />
        <BentLeg p={p} x={43} pose={poses[(frame + (sprint ? 4 : 5)) % 8]} far />
        <g transform={`translate(0 ${lift})`}>
          <path d="M17 39h26v4h8v19h-5v5H13v-6H9V49h4v-7h4Z" fill={p.outline} />
          <path d="M18 42h24v4h6v14h-5v4H15v-5h-3v-9h4v-6h2Z" fill={p.coat} />
          <path d="M19 44h5v3h-5m9-4h5v3h-5m9 0h5v3h-5" fill={p.light} />
          <path d="M19 47h4v8h-4m9-10h4v9h-4m9-7h4v8h-4" fill={p.stripe} />
          <path d="M17 59h27v4H17Z" fill={p.bib} />
        </g>
        <BentLeg p={p} x={17} pose={rear} />
        <BentLeg p={p} x={40} pose={poses[frame]} />
        <g transform={`translate(${sprint ? 28 : 27} ${25 + lift + (frame === 5 ? 1 : 0)})`}>{head}</g>
      </g>
    })}
  </g>
}

export function CatEffects({ activity }: { activity: string }) {
  return <g aria-hidden="true" className="cat-effects">
    {(activity === "play" || activity === "zoomies") && <g className="cat-impact">
      {[0, 1, 2, 3, 4].map(i => <g className="cat-puff" key={i} style={{ "--particle": i, "--dx": `${(i - 2) * 7}px`, "--dy": `${-4 - i % 3 * 3}px` } as CSSProperties}>
        <path d={`M${16 + i * 7} 71h5v-2h4v3h2v4h-3v2h-7v-2h-3v-3h2Z`} fill="#c3a482" />
        <path d={`M${17 + i * 7} 71h5v1h3v3h-7v-1h-2v-2h1Z`} fill="#f7e8c9" />
      </g>)}
    </g>}
    {activity === "zoomies" && <g className="cat-speed-effects">
      {/* Kept inside the sprite's facing group, so every trail stays behind the cat. */}
      <g className="cat-speed-lines" fill="#fff2d6">
        {[[-39, 32, 32], [-25, 43, 23], [-43, 55, 38], [-20, 65, 19]].map(([x, y, width], i) => <g key={i} className="cat-speed-line" style={{ "--trail": i } as CSSProperties}>
          <path d={`M${x} ${y}h${width}v2h-${width}Z`} />
          <rect x={x - 8} y={y} width="4" height="2" opacity=".65" />
        </g>)}
      </g>
      <g className="cat-wind-ribbons" fill="none" stroke="#fff4de" strokeWidth="1.5">
        <path className="cat-wind-ribbon" d="M-37 44h16v-3h12v-3H8v-3h12" />
        <path className="cat-wind-ribbon cat-wind-ribbon-low" d="M-31 58h12v3h13v3H9v2h9" />
      </g>
      <g className="cat-speed-grit" fill="#b29470">
        {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} className="cat-speed-grain" x="12" y="75" width={i % 2 ? 2 : 3} height="2" style={{ "--particle": i, "--drift": `${-5 - i % 3 * 4}px` } as CSSProperties} />)}
      </g>
      <g className="cat-launch-burst" fill="none" stroke="#f9e6bd" strokeWidth="2">
        <path d="M5 72H-6m14-4-7-5m12 2-2-7M8 77H-3" />
      </g>
    </g>}
    {(activity === "sleep" || activity === "belly") && <g className="cat-sleep-symbols" fill="none" stroke="#a38c70" strokeWidth="1.5">
      {[0, 1, 2].map(i => <path key={i} className="cat-sleep-symbol" style={{ "--particle": i } as CSSProperties} d={`M${38 + i * 7} ${38 - i * 7}h5l-5 5h5`} />)}
    </g>}
    {activity === "eat" && <g className="cat-meal-spark" fill="#d7a582"><path d="M48 26h2v2h2v2h-2v2h-2v-2h-2v-2h2Z" /><rect x="58" y="31" width="2" height="2" /></g>}
    {activity === "watch" && <path className="cat-chirp" d="M49 22l3-3m0 8h4" fill="none" stroke="#ab926f" strokeWidth="2" />}
    {activity === "scratch" && <g className="cat-rope-flakes" fill="#dbc5a0">
      {[0, 1, 2, 3, 4, 5].map(i => <path key={i} className="cat-rope-flake" style={{ "--particle": i } as CSSProperties} d={`M${65 + i % 2} ${39 + i % 3 * 2}h1v3h-1Z`} />)}
    </g>}
  </g>
}
