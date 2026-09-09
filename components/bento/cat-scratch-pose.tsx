import type { CSSProperties, ReactNode } from "react"
import type { Palette } from "./cat-palette"

// Shoulder stays attached; the elbow bends while the paw lifts away from the
// rope, reaches up, plants, and pulls down. The other paw takes the next stroke.
type ArmPose = [handX: number, handY: number, elbowX: number, elbowY: number]
const strokes: { near: ArmPose; far: ArmPose; lean: number; head: number; scrape?: "near" | "far" }[] = [
  { near:[61,41,50,49], far:[62,38,51,45], lean:0, head:0 },
  { near:[60,29,48,39], far:[64,41,54,47], lean:0, head:-1 },
  { near:[64,30,52,38], far:[62,45,53,49], lean:1, head:-1 },
  { near:[64,38,53,44], far:[59,35,48,42], lean:1, head:0, scrape:"near" },
  { near:[64,45,53,49], far:[64,29,53,37], lean:0, head:1, scrape:"near" },
  { near:[58,36,46,43], far:[64,39,54,45], lean:0, head:0, scrape:"far" },
  { near:[64,29,52,37], far:[63,45,53,49], lean:1, head:-1, scrape:"far" },
  { near:[64,38,54,44], far:[58,35,47,41], lean:1, head:0, scrape:"near" },
  { near:[63,45,53,49], far:[64,30,52,38], lean:0, head:1, scrape:"near" },
  { near:[60,40,49,48], far:[64,41,54,46], lean:0, head:0, scrape:"far" },
  { near:[64,29,52,36], far:[64,32,53,39], lean:1, head:-2 },
  { near:[61,40,50,48], far:[62,37,51,44], lean:0, head:0 },
]
function ScratchArm({ p, pose, far = false }: { p: Palette; pose: ArmPose; far?: boolean }) {
  const [x,y,elbowX,elbowY] = pose
  const d = `M${far ? 43 : 39} ${far ? 45 : 48}L${elbowX} ${elbowY}L${x - 1} ${y + 2}`
  return <g>
    <path d={d} stroke={p.outline} strokeWidth={far ? 6 : 7} strokeLinejoin="bevel" fill="none" />
    <path d={d} stroke={far ? p.shade : p.coat} strokeWidth={far ? 3 : 4} strokeLinejoin="bevel" fill="none" />
    <path d={`M${x-4} ${y-2}h5v2h2v5h-7Z`} fill={p.outline} />
    <path d={`M${x-3} ${y-1}h3v2h2v2h-5Z`} fill={far ? p.coat : p.light} />
    <path d={`M${x} ${y}h2m-2 2h2`} stroke={p.shade} strokeWidth="1" />
  </g>
}
export function CatScratchPose({ p, head }: { p: Palette; head: ReactNode }) {
  return <>
    <g className="cat-scratch-tail" fill="none" strokeLinejoin="bevel">
      <path d="M28 66H17v-4h-5v-5" stroke={p.outline} strokeWidth="6" />
      <path d="M28 66H17v-4h-5v-5" stroke={p.coat} strokeWidth="3" />
      <path d="M12 57v3" stroke={p.light} strokeWidth="3" />
    </g>
    {strokes.map(({near,far,lean,head:headY,scrape},frame) => {
      const contact = scrape === "far" ? far : near
      return <g key={frame} className="cat-scratch-frame" style={{"--scratch-frame":frame} as CSSProperties}>
        <ScratchArm p={p} pose={far} far />
        <g transform={`translate(${lean} 0)`}>
          <path d="M27 32h18v7h4v24h-4v10H25V62h-4V41h6Z" fill={p.outline} />
          <path d="M29 35h14v7h3v19h-4v10H28V59h-4V44h5Z" fill={p.coat} />
          <path d="M29 42h5v17h-5m7-16h7v4h-7m0 5h7v4h-7" fill={p.stripe} />
          <path d="M42 55h3v11h-5v5h-3V60h5Z" fill={p.bib} />
        </g>
        <g transform={`translate(${16+lean} ${17+headY})`}>{head}</g>
        <ScratchArm p={p} pose={near} />
        {scrape && <g fill="none" stroke="#f3dfb8" strokeWidth="1">
          <path d={`M65 ${contact[1]+1}v5m2-6v4`} />
        </g>}
      </g>
    })}
    {/* Weight stays on these hind paws while the shoulders and arms work. */}
    <path d="M26 71h10v5H23v-3h3m14-2h10v5H37v-3h3" fill={p.light} />
    <path d="M27 73v2m4-2v2m10-2v2m4-2v2" stroke={p.shade} />
  </>
}
