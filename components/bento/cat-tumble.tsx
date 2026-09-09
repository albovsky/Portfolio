import type { CSSProperties } from "react"
import { CatSprite, catPalettes } from "./cat-sprite"

export function CatTumble() {
  return <div className="cat-tumble" aria-hidden="true">
    <svg viewBox="0 0 140 105" shapeRendering="crispEdges" className="cat-tumble-scene">
      <path className="cat-tumble-shadow" d="M28 89h84v3h8v4H20v-4h8Z" fill="#866448" opacity=".2" />
      <g className="cat-tumble-scramble">
        <g className="cat-tumble-peek cat-tumble-peek-pusha"><svg x="30" y="2" width="47" height="60" overflow="visible"><CatSprite name="Pusha" /></svg></g>
        <g className="cat-tumble-peek cat-tumble-peek-bonita"><svg x="72" y="4" width="37" height="48" overflow="visible"><CatSprite name="Bonita" /></svg></g>
        <g className="cat-tumble-tail cat-tumble-tail-pusha"><path d="M35 64H20v-7H10V44h6v9h9v5h10" fill="none" stroke={catPalettes.Pusha.outline} strokeWidth="7" /><path d="M35 64H20v-7H10V44h6v9h9v5h10" fill="none" stroke={catPalettes.Pusha.coat} strokeWidth="3" /></g>
        <g className="cat-tumble-tail cat-tumble-tail-bonita"><path d="M104 64h12v-8h10V45h-6v7h-9v6h-7" fill="none" stroke={catPalettes.Bonita.outline} strokeWidth="7" /><path d="M104 64h12v-8h10V45h-6v7h-9v6h-7" fill="none" stroke={catPalettes.Bonita.coat} strokeWidth="3" /></g>
        <g className="cat-tumble-cloud">
          <path d="M39 32v-6h17v-5h20v5h17v7h13v9h9v11h8v17h-7v12h-13v8H85v5H56v-5H36v-6H24V72h-7V57h7V43h9V32Z" fill="#b29675" />
          <path d="M41 35v-6h16v-5h17v5h17v7h13v9h8v11h8v12h-7v12h-13v7H83v5H58v-5H38v-6H27V70h-7V59h7V46h9V35Z" fill="#f8edd7" />
          <path d="M27 64h7v9h12v7h19v5h24v-5h18v-8h9v-9h4v5h-7v12h-13v7H83v5H58v-5H38v-6H27V70h-7v-9h7Z" fill="#e2cfad" />
          <g className="cat-tumble-swirl" fill="none" stroke="#d0b994" strokeWidth="3"><path d="M33 57v-7h8v-4h13v4h5m23 7v-8h10v4h5v7m-47 9h7v5h16v-5h8" /></g>
          <path d="M42 37h14v-5h14m-42 25v-7h6m63 14h7v7" fill="none" stroke="#fffaf0" strokeWidth="3" />
        </g>
        {(["Pusha", "Bonita"] as const).map((name, i) => <g key={name} className={`cat-tumble-paw cat-tumble-paw-${i}`}>
          <path d={i ? "M97 57h11v-6h5v-7h-3v-3h-11v4h-4v7Z" : "M40 54H29v-6h-5v-7h3v-3h11v4h4v7Z"} fill={catPalettes[name].outline} />
          <path d={i ? "M99 52h6v-4h5v-4h-9v4h-3Z" : "M38 49h-6v-4h-5v-4h9v4h3Z"} fill={catPalettes[name].light} />
        </g>)}
      </g>
      <g className="cat-tumble-particles">
        {[0,1,2,3,4,5].map(i => <path key={i} className="cat-tumble-particle" style={{ "--particle": i, "--scatter-x": `${(i % 2 ? 1 : -1) * (12 + i * 3)}px`, "--scatter-y": `${-8 - (i % 3) * 7}px` } as CSSProperties} d={`M${i % 2 ? 111 : 21} ${43 + i * 6}h6v-2h5v5h-2v4h-7v-3h-2Z`} fill="#fff3dc" stroke="#cbb08a" strokeWidth="1" />)}
      </g>
      <g className="cat-tumble-hearts" fill="#ce8b83" stroke="#fff0db" strokeWidth="1" paintOrder="stroke">
        <path className="cat-tumble-heart cat-tumble-heart-one" d="M45 24v-5h5v3h3v-3h5v5h-3v3h-3v3h-2v-3h-3v-3Z" />
        <path className="cat-tumble-heart cat-tumble-heart-two" d="M87 19v-4h4v2h2v-2h4v4h-2v3h-3v2h-2v-2h-2v-3Z" />
      </g>
      <g className="cat-tumble-stars" fill="#e8ba68" stroke="#a37b48" strokeWidth="1"><path d="M14 29h3v5h5v3h-5v5h-3v-5H9v-3h5ZM122 24h2v4h4v2h-4v4h-2v-4h-4v-2h4Z" /></g>
    </svg>
  </div>
}
