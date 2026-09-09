type Action = "food" | "play" | "sleep" | "zoomies"

export function CatActionIcon({ type, awake = false }: { type: Action; awake?: boolean }) {
  return <svg viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden="true" fill="none" strokeLinejoin="bevel">
    {type === "food" ? <>
      <path d="M7 15v-4h5V8h6v3h6v4" fill="#d9914d" stroke="#3f392d" strokeWidth="2" />
      <path d="M10 11h3v3h-3m7-3h3v3h-3" fill="#ffe0a2" />
      <path d="M3 15h26v5h-3l-3 8H9l-3-8H3Z" fill="#4fbc9c" stroke="#3f392d" strokeWidth="2" />
      <path d="M7 20h18l-2 6H9Z" fill="#298774" />
      <path d="M5 16h22v3H5Z" fill="#a5eed0" />
      <path d="M13 23h6v2h-6" fill="#b8f3d9" />
      <path d="M9 4v3m12-4v3" stroke="#d5a663" strokeWidth="2" />
    </> : type === "play" ? <>
      <path d="M11 4h10v3h5v5h3v9h-3v5h-5v3H11v-3H6v-5H3v-9h3V7h5Z" fill="#ec647a" stroke="#3f392d" strokeWidth="2" />
      <path d="M8 10h3V7h9v3H9v5H6v-3h2Z" fill="#ffb0b5" />
      <path d="M24 12h3v9h-3v4h-6v2h-7v-3h9v-4h4Z" fill="#b43d62" />
      <path d="m9 10 13 13M6 16l10 10m0-20 10 10M9 25l16-14M5 19l15-13" stroke="#ffb0b5" strokeWidth="2" />
      <path d="M23 26h4v3h4" stroke="#3f392d" strokeWidth="3" />
      <path d="M23 26h4v3h4" stroke="#ec647a" strokeWidth="1" />
    </> : type === "zoomies" ? <>
      <path d="M14 2h13l-8 11h9L10 30l4-13H5Z" fill="#ffdb40" stroke="#3f392d" strokeWidth="2" />
      <path d="M15 4h8l-3 3h-6l-4 7H8Z" fill="#fff49b" />
      <path d="M17 15h7L13 26l4-9h-4Z" fill="#e9a82a" />
    </> : awake ? <>
      <path d="M12 8h8v3h3v10h-3v3h-8v-3H9V11h3Z" fill="#ffdb57" stroke="#3f392d" strokeWidth="2" />
      <path d="M12 12h4v-2h3v3h-5v5h-3v-4h1Z" fill="#fff4b0" />
      <path d="M15 2v3m0 22v3M2 16h4m20 0h4M5 5l3 3m16 16 3 3M5 27l3-3M24 8l3-3" stroke="#e7ae37" strokeWidth="2" />
    </> : <>
      <path d="M15 3h5v4h-5v5h-3v7h4v4h8v-3h5v5h-5v4H12v-3H7v-5H4V11h4V6h7Z" fill="#a5a0ed" stroke="#3f392d" strokeWidth="2" />
      <path d="M10 8h4v2h-3v5H8v7H6V12h4Z" fill="#e0d9ff" />
      <path d="M12 24h12v-2h3v2h-4v3H13Z" fill="#7266b7" />
      <path d="M24 5v3h-3v3h3v3h3v-3h3V8h-3V5Z" fill="#ffda56" stroke="#3f392d" strokeWidth="1" />
    </>}
  </svg>
}
