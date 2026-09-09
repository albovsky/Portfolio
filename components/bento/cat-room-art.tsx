export function CatRoomArt() {
  return <svg viewBox="0 0 640 360" preserveAspectRatio="none" className="cat-room-art" shapeRendering="crispEdges" aria-hidden="true">
    <defs>
      <pattern id="cat-wallpaper" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#f4e6d0" /><path d="M12 8v8M8 12h8" stroke="#e7d7be" strokeWidth="1" /></pattern>
      <pattern id="cat-floorboards" width="128" height="30" patternUnits="userSpaceOnUse"><rect width="128" height="30" fill="#c99b73" /><path d="M0 29h128M0 0v30M64 0v1" stroke="#b48561" strokeWidth="2" /><path d="M10 8h32m12 12h52M88 7h20" stroke="#d8ae83" strokeWidth="2" /></pattern>
      <pattern id="cat-rope" width="8" height="7" patternUnits="userSpaceOnUse"><rect width="8" height="7" fill="#c4a273" /><path d="M0 6h8" stroke="#a58459" strokeWidth="2" /></pattern>
    </defs>
    <rect width="640" height="244" fill="url(#cat-wallpaper)" />
    <rect y="190" width="640" height="54" fill="#d9d8bc" />
    {Array.from({length:17},(_,i)=><path key={i} d={`M${i*40} 196v44`} stroke="#c3c8a7" strokeWidth="2" />)}
    <path d="M0 191h640M0 239h640" stroke="#aeb68e" strokeWidth="4" />
    <path d="M0 195h640" stroke="#eef0d6" strokeWidth="2" />
    <rect y="244" width="640" height="116" fill="url(#cat-floorboards)" />
    <path d="M0 244h640" stroke="#987359" strokeWidth="5" />
    <path d="M269 206h160l118 95H177Z" fill="#fff2b7" opacity=".22" />
    {/* Deep wooden window, sky and a quiet little garden. */}
    <rect x="250" y="71" width="199" height="141" fill="#d4b58b" />
    <rect x="255" y="68" width="190" height="137" fill="#94694e" />
    <rect x="262" y="75" width="176" height="122" fill="#fbf0d7" />
    <rect x="267" y="80" width="166" height="112" fill="#a9c9c4" />
    <rect className="cat-sun" x="392" y="94" width="20" height="20" fill="#fff0b1" />
    <g className="cat-clouds" fill="#e4ebe0"><path d="M279 101h17v-5h21v6h14v7h-52ZM363 127h12v-6h18v5h16v7h-46Z" /></g>
    <path d="M267 157h18v-10h17v-9h22v9h17v17h20v-15h24v-8h23v10h25v41H267Z" fill="#8da992" />
    <path d="M267 180h24v-12h28v9h20v-7h26v11h22v-15h26v11h20v15H267Z" fill="#698c74" />
    <rect x="347" y="77" width="7" height="119" fill="#fbf0d7" /><rect x="263" y="132" width="172" height="6" fill="#fbf0d7" />
    <rect x="248" y="201" width="204" height="8" fill="#9d7454" /><rect x="247" y="201" width="206" height="3" fill="#f9e6be" />
    <path d="M243 68h14v86h-5v35h-19v-12h5V92h5ZM440 68h14v24h5v85h5v12h-19v-35h-5Z" fill="#b98068" />
    <path d="M248 76v70m-8 5v25m207-100v70m8 5v25" stroke="#d7a38a" strokeWidth="3" />
    <rect x="236" y="64" width="224" height="4" fill="#785c46" /><rect x="232" y="63" width="5" height="6" fill="#785c46" /><rect x="460" y="63" width="5" height="6" fill="#785c46" />
    {/* Shelf: books, a tiny portrait and a trailing plant. */}
    <rect x="57" y="141" width="122" height="7" fill="#aa805c" /><rect x="62" y="148" width="5" height="12" fill="#805c48" /><rect x="169" y="148" width="5" height="12" fill="#805c48" />
    <rect x="66" y="118" width="8" height="23" fill="#8d9c7d" /><rect x="75" y="114" width="9" height="27" fill="#c58d66" /><rect x="85" y="121" width="7" height="20" fill="#d1b97e" /><path d="M68 124h4m5-4h5m5 8h3" stroke="#f7e8c9" strokeWidth="2" />
    <rect x="103" y="107" width="30" height="34" fill="#926b4e" /><rect x="107" y="111" width="22" height="26" fill="#ead6aa" /><path d="M112 129v-10h4v4h5v-4h4v10Z" fill="#b8845d" /><rect x="116" y="125" width="2" height="2" fill="#584b3e" /><rect x="121" y="125" width="2" height="2" fill="#584b3e" />
    <path d="M145 128h21v13h-18Z" fill="#b98068" /><path d="M153 128v-19m0 11h-9v-6h9m2 0h10v-6h-10m0 22h15v22h8v10" stroke="#768c5d" strokeWidth="5" fill="none" /><rect x="172" y="157" width="9" height="6" fill="#8f9e70" />
    {/* A linen cat bed and two cushions. */}
    <rect x="48" y="265" width="140" height="16" fill="#a5795e" opacity=".35" /><path d="M48 245h9v-10h122v10h9v27H48Z" fill="#9c7660" /><rect x="54" y="238" width="128" height="30" fill="#ca9f86" /><rect x="62" y="242" width="112" height="19" fill="#eed9ba" /><path d="M64 251h108" stroke="#dfbea0" strokeWidth="2" /><rect x="58" y="235" width="31" height="22" fill="#a4ad82" /><rect x="148" y="236" width="28" height="20" fill="#d7b388" />
    {/* Woven rug. */}
    <path d="M207 268h217v56H207Z" fill="#a87960" opacity=".4" /><rect x="210" y="264" width="208" height="57" fill="#aa6f58" /><rect x="216" y="270" width="196" height="45" fill="#e8c79b" /><rect x="223" y="276" width="182" height="33" fill="#bd8064" /><path d="M232 292h163" stroke="#d79f78" strokeWidth="2" />
    {Array.from({length:9},(_,i)=><g key={i} fill="#efd2a4"><path d={`M${238+i*18} 289h4v-4h4v4h4v5h-4v4h-4v-4h-4Z`} /><path d={`M${219+i*23} 262v-4m0 65v4`} stroke="#ead0a7" strokeWidth="2" /></g>)}
    {/* Scratching post, rope and dangling pom-pom. */}
    <rect x="552" y="272" width="49" height="9" fill="#92745d" /><rect x="558" y="266" width="39" height="9" fill="#b7a17d" /><rect x="574" y="207" width="12" height="60" fill="url(#cat-rope)" /><rect x="561" y="199" width="39" height="9" fill="#a9af83" /><rect x="563" y="197" width="35" height="4" fill="#d0d3a6" /><path d="M564 208v23" stroke="#b39269" strokeWidth="2" /><rect className="cat-post-toy" x="560" y="230" width="9" height="9" fill="#bd8064" />
    {/* A leafy floor plant and food bowls. */}
    <path d="M500 230v-44m1 24h-12v-9h11m1-1h14v-10h-14m-1-4h-10v-10h10" stroke="#768963" strokeWidth="6" fill="none" /><path d="M486 227h28l-4 23h-19Z" fill="#b67e5f" /><rect x="485" y="227" width="30" height="5" fill="#ce9a76" />
    <g><rect x="431" y="295" width="121" height="14" fill="#e0be92" /><path d="M437 290h26l-3 12h-20Z" fill="#7d9b91" /><rect x="440" y="289" width="20" height="4" fill="#556e63" /><path d="M520 290h26l-3 12h-20Z" fill="#b77b66" /><rect x="523" y="289" width="20" height="4" fill="#875b46" /><path d="M444 290h4m5 0h3m72 0h4m5 0h3" stroke="#d9b16b" strokeWidth="2" /></g>
    <g className="cat-dust" fill="#fff3d1"><rect x="290" y="162" width="2" height="2" /><rect x="386" y="224" width="2" height="2" /><rect x="315" y="240" width="2" height="2" /></g>
  </svg>
}

export function CatRoomYarn() {
  return <svg viewBox="0 0 640 360" preserveAspectRatio="none" className="cat-room-yarn" shapeRendering="crispEdges" aria-hidden="true">
    {/* A wound ball of yarn: the thread stays loose while the ball spins inside it. */}
    <g transform="translate(330 298)">
      <g className="cat-yarn-travel">
        <path className="cat-yarn-shadow" d="M-10 11h20v3h-20Z" fill="#775448" opacity=".22" />
        <g className="cat-yarn-hop">
          <g className="cat-yarn-thread" fill="none" strokeWidth="2">
            <path d="M7 7h8v4h7v-4h8v4h8v-3h5" stroke="#93586c" />
            <path d="M16 10h5m10 0h6" stroke="#efb6bf" />
          </g>
          <g className="cat-yarn-ball">
            <path d="M-5-12H5v2h4v3h3V5H9v4H5v3H-5V10H-9V6h-3V-5h3v-4h4Z" fill="#794e61" />
            <path d="M-5-10H5v2h3v3h2V4H7v4H4v2H-4V8H-7V4h-3V-4h3V-7h2Z" fill="#cd8096" />
            <path d="M-9 1h3v4h4v2h7V5h4v2H6v3H-4V8H-7V4h-2Z" fill="#ad647f" />
            {/* Separate diagonal wraps and an opposing curved band read as wound fibers. */}
            <path d="M-7-6h3v3h3v3h3v3h3v3M-3-9v3h3v3h3v3h3v3h3M-9-1h3v3h3v3h3v3" fill="none" stroke="#f5c0c8" strokeWidth="2" />
            <path d="M5-9H2v3H-1v3H-4v3H-7v4" fill="none" stroke="#98566e" strokeWidth="3" />
            <path d="M6-9H3v3H0v3H-3v3H-6v4" fill="none" stroke="#eaa3b4" strokeWidth="2" />
            <path d="M-5-8h3v2h-3Z" fill="#ffe0dc" />
          </g>
        </g>
        <g className="cat-yarn-impact" fill="#fbe4b9">
          <path d="M-16 6h3v2h-3ZM14 6h3v2h-3ZM-12 13h3v2h-3ZM11 13h3v2h-3Z" />
        </g>
      </g>
    </g>
  </svg>
}
