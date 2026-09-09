import { CatEffects, CatGait } from "./cat-motion"
import { CatCozyPose } from "./cat-cozy-poses"
import { CatScratchPose } from "./cat-scratch-pose"

import { catPalettes, type Palette } from "./cat-palette"

// All views use a 34px head height, 4px ears, and the same cheek/jaw level.
// Front and rear share the exact silhouette; the profile is narrower in perspective.
const roundHeadOutline = "M5 8V2h9v4h14V2h9v6h3v6h2v12h-3v5h-6v3H9v-3H3v-5H0V14h2V8Z"
const roundHeadCoat = "M7 9V4h5v5h18V4h5v6h3v6h2v9h-3v4h-6v3H11v-3H5v-4H2v-9h2v-6Z"
function RoundHeadBase({ p }: { p: Palette }) {
  return <><path d={roundHeadOutline} fill={p.outline} /><path d={roundHeadCoat} fill={p.coat} /></>
}
function FrontHead({ p, sleeping = false }: { p: Palette; sleeping?: boolean }) {
  return <g data-anatomy="head" data-angle="front">
    <RoundHeadBase p={p} />
    <g className="cat-ear-twitch"><path d="M7 5h5v4H7m23-4h5v4h-5" fill={p.ear} /><path d="M7 4h5v1H7m23-1h5v1h-5" fill={p.shade} /></g>
    <path d="M7 13h9v3H5v-2h2m21-1h7v1h2v2H26v-3ZM4 23h8v6H7v-3H4m26-3h8v3h-3v3h-5" fill={p.light} />
    <path d="M12 24h18v6H12m4-8h10v5H16" fill={p.bib} />
    <path d="M10 8h4v5h-3v-2h-1m8-4h4v6h-4m10-5h4v3h-1v2h-3M2 18h5v3H2m33-3h5v3h-5" fill={p.stripe} />
    <path d="M8 21h8v2H8m18-2h8v2h-8" fill={p.outline} />
    {!sleeping && <g className="cat-face-eyes">
      <path d="M9 16h7v2h2v6H7v-6h2m17-2h7v2h2v6H24v-6h2" fill={p.light} />
      <g className="cat-pupils"><path d="M11 18h6v6h-6m14-6h6v6h-6" fill={p.eye} /><path d="M13 18h3v6h-3m13-6h3v6h-3" fill="#49392d" /><path d="M11 18h2v2h-2m14-2h2v2h-2" fill="#fff0d5" /></g>
      <path d="M8 16h9v2H8m17-2h9v2h-9" fill={p.shade} />
    </g>}
    <path d="M18 22h6v3h-2v2h-2v-2h-2" fill={p.nose} /><path d="M18 22h6v1h-6" fill={p.ear} />
    <g className="cat-jaw"><path d="M20 27h2v2h-2m-4 0h4v2h-4m6-2h4v2h-4" fill={p.outline} /></g>
    <path d="M-2 24h9v1h-9m2 4h7v1H0m35-6h9v1h-9m0 3h7v1h-7" fill={p.shade} />
    <path d="M14 31h14v1H14" fill={p.shade} />
  </g>
}
function BackHead({ p }: { p: Palette }) {
  return <g data-anatomy="head" data-angle="back">
    <RoundHeadBase p={p} />
    <g className="cat-ear-twitch"><path d="M7 4h5v4H7m23-4h5v4h-5" fill={p.shade} /><path d="M8 5h3v1H8m23-1h3v1h-3" fill={p.light} /></g>
    <path d="M10 8h4v5h-3v-2h-1m8-4h4v6h-4m10-5h4v3h-1v2h-3M3 18h6v3H3m30-3h6v3h-6" fill={p.stripe} />
    <path d="M6 24h5v5H8v-2H6m25-3h5v3h-2v2h-3" fill={p.light} />
    <path d="M14 28h14v3H14m3-7h8v3h-8" fill={p.shade} />
    <g className="cat-window-glance"><path d="M36 17h4v6h-4" fill={p.eye} /><path d="M38 18h2v4h-2" fill={p.outline} /></g>
  </g>
}
function SideHead({ p }: { p: Palette }) {
  return <g data-anatomy="head" data-angle="side">
    <path d="M5 8V2h9v4h10V3h7v7h3v6h2v11h-4v4h-6v3H10v-3H4v-5H1V15H0v-3h2V8Z" fill={p.outline} />
    <path d="M7 9V4h5v5h14V5h3v7h3v6h2v8h-4v3h-6v3H12v-3H6v-4H3V15H2v-1h2V10Z" fill={p.coat} />
    <g className="cat-ear-twitch"><path d="M7 5h5v4H7m19-3h3v4h-3" fill={p.ear} /></g>
    <path d="M10 9h4v5h-3v-2h-1m8-3h4v5h-4M3 18h6v3H3" fill={p.stripe} />
    <path d="M7 24h8v6h-4v-2H7m11-14h12v3H18" fill={p.light} />
    <path d="M21 24h13v4h-4v3H20v-5h1" fill={p.bib} />
    <path d="M21 21h10v2H21" fill={p.outline} />
    <g className="cat-face-eyes"><path d="M22 16h8v2h2v6H20v-6h2" fill={p.light} /><rect x="25" y="18" width="6" height="6" fill={p.eye} /><rect x="28" y="18" width="3" height="6" fill="#49392d" /><rect x="25" y="18" width="2" height="2" fill="#fff0d5" /><path d="M21 16h10v2H21" fill={p.shade} /></g>
    <path d="M32 23h4v3h-4" fill={p.nose} /><path d="M32 23h4v1h-4" fill={p.ear} />
    <g className="cat-jaw"><path d="M28 28h6v2h-6" fill={p.outline} /><rect className="cat-tongue" x="31" y="29" width="3" height="3" fill={p.ear} /></g>
    <path d="M29 25h10v1H29m0 3h8v1h-8" fill={p.shade} />
  </g>
}
function Paw({ p, x, className = "" }: { p: Palette; x: number; className?: string }) {
  return <g className={className}>
    <path d={`M${x} 57h8v14h3v5H${x-1}v-5h1Z`} fill={p.outline} />
    <path d={`M${x+2} 57h4v15h3v2h-8v-3h1Z`} fill={p.coat} />
    <path d={`M${x+1} 71h8v3h-8Z`} fill={p.light} /><path d={`M${x+4} 73v2m3-2v2`} stroke={p.shade} />
  </g>
}
function StandingBody({ p, back = false }: { p: Palette; back?: boolean }) {
  return <g className="cat-torso">
    <path d="M20 38h24v7h6v22h-4v6H15v-6h-4V48h5v-7h4Z" fill={p.outline} />
    <path d="M21 41h20v6h6v19h-4v5H17v-5h-3V50h5v-6h2Z" fill={p.coat} />
    {!back && <path d="M24 46h13v22H24Z" fill={p.bib} />}<path d="M16 52h5v13h-5m23-13h5v13h-5" fill={p.shade} />
    <path d="M18 44h7v3h-7m17-3h8v3h-8" fill={p.stripe} />
  </g>
}
export function CatSprite({ name, activity = "idle", facing = 1 }: { name: "Pusha" | "Bonita"; activity?: string; facing?: 1 | -1 }) {
  const p = catPalettes[name]
  const moving = activity === "walk" || activity === "zoomies"
  return <svg viewBox="0 0 64 82" role="img" aria-label={`${name}, ${activity === "idle" ? "exotic shorthair" : activity}`} shapeRendering="crispEdges" className="cat-pixel-sprite" data-pose={activity} data-cat={name}>
    <path className="cat-ground-shadow" d="M13 74h39v2h5v2H9v-2h4Z" fill="#70563c" opacity=".14" />
    <g transform={((moving && facing === -1) || (activity === "play" && name === "Pusha")) ? "translate(64 0) scale(-1 1)" : undefined}>
      <g className="cat-pose-motion">
      <CatPose p={p} name={name} activity={activity} />
      </g>
      <CatEffects activity={activity} />
    </g>
  </svg>
}


type CatPoseProps = { p: Palette; name: "Pusha" | "Bonita"; activity: string }

function CatPose({ p, name, activity }: CatPoseProps) {
  if (["groom", "belly", "silly", "snuggle"].includes(activity)) {
    return <CatCozyPose p={p} name={name} activity={activity} head={<FrontHead p={p} />} closedHead={<FrontHead p={p} sleeping />} sideHead={<SideHead p={p} />} body={<StandingBody p={p} />} />
  }
  switch (activity) {
    case "sleep": return <SleepingCat p={p} name={name} />
    case "watch": return <WatchingCat p={p} />
    case "walk":
    case "zoomies": return <CatGait p={p} sprint={activity === "zoomies"} head={<SideHead p={p} />} />
    case "eat": return <EatingCat p={p} />
    case "scratch": return <CatScratchPose p={p} head={<SideHead p={p} />} />
    default: return <RestingCat p={p} />
  }
}

function SleepingCat({ p, name }: Pick<CatPoseProps, "p" | "name">) {
  return <>
        <g className="cat-sleep-belly"><path d="M24 46h22v4h8v7h5v14h-5v4H12v-4H7V60h6v-8h11Z" fill={p.outline} /><path d="M25 49h19v4h8v6h4v10h-5v4H13v-4h-3v-7h6v-8h9Z" fill={p.coat} /><path d="M29 52h4v8h-4m10-7h4v9h-4m9-3h4v7h-4" fill={p.stripe} /><path d="M22 67h26v5H22" fill={p.light} /></g>
        <g transform="translate(4 39)"><g className="cat-sleep-head"><g transform={name === "Pusha" ? "translate(3 0) scale(.86 1)" : undefined}><FrontHead p={p} sleeping /></g></g></g>
        <path className="cat-dream-paw" d="M18 69h9v5H16v-3h2Z" fill={p.light} />
        <g className="cat-curled-tail"><path d="M52 60h7v10h-5v5H25v-4h-6v-7h8v5h24v-4h1Z" fill={p.outline} /><path d="M54 61h3v7h-5v5H27v-4h-6v-3h4v5h25v-4h4Z" fill={p.shade} /><path d="M27 69h10v3H27Z" fill={p.light} /></g>

  </>
}

function WatchingCat({ p }: Pick<CatPoseProps, "p">) {
  return <>
        <StandingBody p={p} back />
        <path d="M18 70h10v6H16v-3h2m18-3h10v3h2v3H36Z" fill={p.light} />
        <path d="M28 44h5v8h-5m-8 3h6v4h-6m13-4h6v4h-6m-11 6h5v5h-5" fill={p.stripe} />
        {/* Seen from behind, the short tail grows from the center of the rump. */}
        <g className="cat-window-tail" fill="none" strokeLinejoin="bevel">
          <path d="M32 65v4h4v3h13v-2h3" stroke={p.outline} strokeWidth="7" />
          <path d="M32 65v4h4v3h13v-2h3" stroke={p.coat} strokeWidth="4" />
          <path d="M40 70v4m6-4v4" stroke={p.stripe} strokeWidth="2" />
          <g className="cat-window-tail-tip">
            <path d="M51 70h4v-4" stroke={p.outline} strokeWidth="7" />
            <path d="M51 70h4v-4" stroke={p.coat} strokeWidth="4" />
            <path d="M55 68v-2" stroke={p.light} strokeWidth="4" />
          </g>
          <path d="M30 62h4v5h-4Z" fill={p.coat} />
        </g>
        <g transform="translate(11 21)"><g className="cat-window-head"><BackHead p={p} /></g></g>

  </>
}

function EatingCat({ p }: Pick<CatPoseProps, "p">) {
  return <>
        <g className="cat-side-tail"><path d="M15 51H8v-7H4V29h6v13h4v3h5Z" fill={p.outline} /><path d="M13 49H9v-7H6V31h2v13h4v3h3Z" fill={p.shade} /><rect x="6" y="31" width="2" height="5" fill={p.light} /></g>
        <Paw p={p} x={18} className="cat-leg cat-leg-back-far" /><Paw p={p} x={42} className="cat-leg cat-leg-front-far" />
        <g className="cat-side-body"><path d="M17 39h26v4h8v19h-5v5H13v-6H9V49h4v-7h4Z" fill={p.outline} /><path d="M18 42h24v4h6v14h-5v4H15v-5h-3v-9h4v-6h2Z" fill={p.coat} /><path d="M19 45h4v9h-4m9-11h4v10h-4m9-8h4v9h-4" fill={p.stripe} /><path d="M19 59h23v4H19Z" fill={p.bib} /></g>
        <Paw p={p} x={14} className="cat-leg cat-leg-back" /><Paw p={p} x={38} className="cat-leg cat-leg-front" />
        <g transform="translate(27 25)"><g className="cat-side-head"><SideHead p={p} /></g></g>
        <g className="cat-food-crumbs" fill={p.light}><rect x="56" y="66" width="2" height="2" /><rect x="60" y="69" width="2" height="2" /><rect x="54" y="71" width="2" height="2" /></g>

  </>
}

function RestingCat({ p }: Pick<CatPoseProps, "p">) {
  return <>
        <g className="cat-happy-tail"><path d="M45 55h8v12h6v7H44v-5h1Z" fill={p.outline} /><path d="M47 57h4v12h6v3H46v-3h1Z" fill={p.shade} /><rect x="51" y="69" width="6" height="3" fill={p.light} /></g>
        <StandingBody p={p} />
        <g className="cat-play-paw cat-play-paw-left"><path d="M18 59h9v17H15v-7h3Z" fill={p.outline} /><path d="M20 59h5v13h-8v-2h3Z" fill={p.light} /><path d="M20 72v2m3-2v2" stroke={p.shade} /></g>
        <g className="cat-play-paw cat-play-paw-right"><path d="M36 59h9v10h3v7H36Z" fill={p.outline} /><path d="M38 59h5v11h3v2h-8Z" fill={p.light} /><path d="M40 72v2m3-2v2" stroke={p.shade} /></g>
        <g transform="translate(11 21)"><g className="cat-front-head"><FrontHead p={p} /></g></g>

  </>
}
