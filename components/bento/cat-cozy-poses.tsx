import type { ReactNode } from "react"
import type { Palette } from "./cat-sprite"

function RestingFeet({ p, kneading = false }: { p: Palette; kneading?: boolean }) {
  return <g>
    <g className={kneading ? "cat-receive-paw cat-receive-paw-left" : undefined}>
      <path d="M16 64h12v12H14v-6h2Z" fill={p.outline} /><path d="M18 65h8v8H16v-2h2Z" fill={p.light} /><path d="M19 72v2m4-2v2" stroke={p.shade} />
    </g>
    <g className={kneading ? "cat-receive-paw cat-receive-paw-right" : undefined}>
      <path d="M36 64h10v6h3v6H35Z" fill={p.outline} /><path d="M38 65h6v7h3v1H37Z" fill={p.light} /><path d="M39 72v2m4-2v2" stroke={p.shade} />
    </g>
  </g>
}
function CozyTail({ p }: { p: Palette }) {
  return <g className="cat-cozy-tail"><path d="M43 66h8v6h7v-4" fill="none" stroke={p.outline} strokeWidth="7" strokeLinejoin="bevel" /><path d="M43 66h8v6h7v-4" fill="none" stroke={p.coat} strokeWidth="3" strokeLinejoin="bevel" /><path d="M56 68h3v3h-3Z" fill={p.light} /></g>
}
function BellyPaw({ p, x, y, className, hind = false }: { p: Palette; x: number; y: number; className: string; hind?: boolean }) {
  return <g transform={`translate(${x} ${y})`}><g className={className}>
    {hind ? <>
      <path d="M0 12V5h3V0h6v3h2v5H7v6Z" fill={p.outline} />
      <path d="M2 11V6h3V2h2v3h2v1H5v6Z" fill={p.coat} />
      <path d="M5 2h2v3H5Z" fill={p.light} />
      <path d="M5 3h2v2H5Z" fill={p.ear} />
    </> : <>
      <path d="M1 13V6H0V2h3V0h6v6H6v7Z" fill={p.outline} />
      <path d="M3 11V5H2V3h2V2h3v2H4v7Z" fill={p.coat} />
      <path d="M2 3h5v2H2Z" fill={p.light} />
      <path d="M4 2v2" stroke={p.shade} />
    </>}
  </g></g>
}
function BellyPose({ p, head, awake = false }: { p: Palette; head: ReactNode; awake?: boolean }) {
  return <g className="cat-belly-roll" data-belly-awake={awake}>
    <g className="cat-belly-tail">
      <path d="M53 69h7v5H45" fill="none" stroke={p.outline} strokeWidth="5" strokeLinejoin="bevel" />
      <path d="M53 69h7v5H45" fill="none" stroke={p.coat} strokeWidth="2" />
    </g>
    <BellyPaw p={p} x={33} y={47} className="cat-belly-paw cat-belly-paw-far" />
    <BellyPaw p={p} x={47} y={49} hind className="cat-belly-paw cat-belly-paw-far cat-belly-paw-rear" />
    <g className="cat-belly-breath">
      <path d="M23 57h7v-5h17v3h7v6h4v10h-4v5H24v-3h-6V62h5Z" fill={p.outline} />
      <path d="M24 59h8v-4h13v3h7v5h3v6h-3v4H25v-3h-4v-6h3Z" fill={p.coat} />
      <path d="M29 60h6v-3h10v4h5v8H27v-5h2Z" fill={p.bib} />
      <path d="M32 60h5v2h-5m8 3h5v2h-5" fill={p.light} />
      <path d="M49 59h3v4m-2 6h3m-26 3h-3" fill="none" stroke={p.stripe} strokeWidth="2" />
    </g>
    {/* The profile is turned onto the back: the nose points up, the skull rests on the floor. */}
    <g transform="translate(2 76) rotate(-90)"><g className="cat-belly-head">{head}
      {awake && <path className="cat-silly-blep" d="M33 28h4v2h-4Z" fill={p.ear} />}
    </g></g>
    <BellyPaw p={p} x={34} y={55} className="cat-belly-paw cat-belly-paw-near" />
    <BellyPaw p={p} x={49} y={58} hind className="cat-belly-paw cat-belly-paw-hind" />
  </g>
}
function Hearts() {
  return <g className="cat-affection-hearts" fill="#d79391">
    <path className="cat-affection-heart" d="M46 16h3v2h2v-2h3v5h-2v2h-3v-2h-3Z" />
    <path className="cat-affection-heart cat-affection-heart-second" d="M35 9h2v1h2V9h2v3h-1v2h-3v-2h-2Z" />
  </g>
}
export function CatCozyPose({ p, name, activity, head, closedHead, sideHead, body }: { p: Palette; name: string; activity: string; head: ReactNode; closedHead: ReactNode; sideHead: ReactNode; body: ReactNode }) {
  if (activity === "belly") return <BellyPose p={p} head={sideHead} />
  if (activity === "snuggle") return name === "Pusha" ? <>
    <CozyTail p={p} />{body}<RestingFeet p={p} />
    <g transform="translate(24 16)"><g className="cat-affection-head">{sideHead}
      <path className="cat-affection-tongue" d="M33 27h6v-2h3v4h-3v2h-6Z" fill={p.ear} />
      <path className="cat-affection-tongue" d="M35 29h4" stroke={p.nose} />
    </g></g>
    <Hearts />
  </> : <>
    <CozyTail p={p} /><g className="cat-receive-body">{body}<RestingFeet p={p} kneading /></g>
    <g transform="translate(9 27)"><g className="cat-receive-head">{closedHead}</g></g>
    <path className="cat-purr" d="M4 39l-3-2m3 8H0m57-10 3-2m-2 10h4" fill="none" stroke={p.light} strokeWidth="2" />
  </>
  if (activity === "silly") return <>
    <g className="cat-silly-upright"><CozyTail p={p} />{body}<RestingFeet p={p} />
      <g transform="translate(11 21)"><g className="cat-silly-look">{head}</g></g>
    </g>
    <g className="cat-silly-flop"><BellyPose p={p} head={sideHead} awake /></g>
    <path className="cat-silly-surprise" d="M54 23v7m0 3v2m5-8 3-3" fill="none" stroke="#e7bd78" strokeWidth="2" />
    <g className="cat-silly-dust" fill="#eed1aa"><path d="M9 72h4v3H9m45-1h4v3h-4m-48 0h3v2H6" /></g>
  </>
  return <>
    <CozyTail p={p} /><g className="cat-groom-body">{body}<RestingFeet p={p} /></g>
    <g transform="translate(11 21)"><g className="cat-groom-head">{closedHead}</g></g>
    <g className="cat-groom-arm">
      <path d="M23 64v-8h3V45h9v5h-3v11h-3v6Z" fill={p.outline} />
      <path d="M25 62v-5h3V47h5v2h-3v11h-3v5Z" fill={p.coat} />
      <path d="M27 45h7v6h-7Z" fill={p.light} /><path d="M28 47v2m3-2v2" stroke={p.shade} />
    </g>
    <path className="cat-groom-tongue" d="M30 49h4v4h-3v-1h-1Z" fill={p.ear} />
    <path className="cat-groom-sparkle" d="M6 31v6m-3-3h6M52 40v4m-2-2h4" fill="none" stroke={p.light} strokeWidth="2" />
  </>
}
