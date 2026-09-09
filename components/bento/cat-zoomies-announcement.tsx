import type { CSSProperties } from "react"

const letters: Record<string, string[]> = {
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  O: ["01110", "11011", "10001", "10001", "10001", "11011", "01110"],
  M: ["10001", "11011", "11111", "10101", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
}
function PixelWord({ word, y, size }: { word: string; y: number; size: number }) {
  const width = (word.length * 6 - 1) * size
  return <g transform={`translate(${(160 - width) / 2} ${y}) scale(${size})`}>
    {[...word].map((letter, index) => <g key={index} transform={`translate(${index * 6} 0)`}>
      <g className="cat-zoomies-letter" style={{ "--letter": index } as CSSProperties}>
        <path d={letters[letter].flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "1" ? [`M${x} ${y}h1v1h-1Z`] : [])).join("")} stroke="#75472d" strokeWidth=".65" strokeLinejoin="round" paintOrder="stroke" />
      </g>
    </g>)}
  </g>
}

export function CatZoomiesAnnouncement() {
  return <div className="cat-zoomies-announcement" aria-hidden="true">
    <div className="cat-zoomies-pop"><svg viewBox="0 0 160 68" className="cat-zoomies-shake" shapeRendering="crispEdges">
      <g className="cat-zoomies-confetti" fill="#f9e5b0" stroke="#a87a4d" strokeWidth=".75">
        <path d="M9 18h3v4h4v3h-4v4H9v-4H5v-3h4Z" />
        <path d="M147 40h3v4h4v3h-4v4h-3v-4h-4v-3h4Z" />
        <path d="m140 8 3 1-2 7-3-1Zm-124 42 3 2-4 6-3-2Z" />
      </g>
      <path className="cat-zoomies-flash" d="M23 10h10l-3 4h100l-3-4h10l-5 10 9 13-9 8 5 7h-18l-4 9H44l-5-9H20l5-9-7-8 9-10Z" fill="#e6b473" opacity=".7" />
      <g className="cat-zoomies-title" fill="#fff3cf"><PixelWord word="ZOOMIES" y={17} size={2.65} /></g>
      <g className="cat-zoomies-subtitle" fill="#ffcc7b"><PixelWord word="TIME!" y={43} size={1.8} /></g>
      <path d="M48 60h64v2H48" fill="#98613b" opacity=".65" />
    </svg></div>
  </div>
}
