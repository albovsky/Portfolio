"use client"

import Image from "next/image"
import { useLayoutEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { getStickerDimensions, type StickerTemplate, type PlacedSticker } from "@/lib/stickers"
import StickerPeel from "@/components/StickerPeel"

const stickerImageSrc = "/stickers/vecteezy_i-m-cool-cat-meme-sticker-t-shirt-transparent-cute-illustration_65295005.png"

export function StickerChip({
  sticker,
  isActive = false,
  isTemplate = false,
  isPlaceholder = false,
}: {
  sticker: StickerTemplate | PlacedSticker
  isActive?: boolean
  isTemplate?: boolean
  isPlaceholder?: boolean
}) {
  if (isPlaceholder) {
    const { width, height } = getStickerDimensions(sticker.styleVariant, isTemplate)
    if (sticker.styleVariant === "image") {
      return (
        <div style={{ width, height }} className="relative flex items-center justify-center">
          <Image
            width={512} height={512}
            src={stickerImageSrc}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-[0.05] saturate-0 brightness-0"
          />
          <svg
            viewBox="0 0 3000 3000"
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="cat-trace-clip">
                <path d="M1299.0,2711.5 L1316.5,2707.0 L1327.5,2701.0 L1353.5,2706.0 L1370.5,2706.0 L1396.5,2699.0 L1412.5,2690.0 L1431.5,2673.0 L1454.5,2670.0 L1475.5,2662.0 L1488.0,2651.5 L1494.0,2641.5 L1498.0,2625.5 L1497.0,2608.5 L1492.0,2593.5 L1480.0,2573.5 L1467.0,2557.5 L1363.0,2455.5 L1344.0,2432.5 L1336.0,2420.5 L1335.0,2414.5 L1464.0,2239.5 L1509.5,2171.0 L1531.0,2204.5 L1551.5,2224.0 L1585.5,2247.0 L1622.5,2266.0 L1665.5,2284.0 L1714.5,2301.0 L1762.5,2314.0 L1823.5,2326.0 L1895.5,2334.0 L1932.5,2334.0 L1948.5,2332.0 L1968.5,2326.0 L1984.5,2316.0 L2003.5,2292.0 L2017.5,2284.0 L2027.0,2274.5 L2040.0,2252.5 L2046.0,2230.5 L2045.0,2205.5 L2040.0,2193.5 L2033.0,2184.5 L2032.0,2168.5 L2027.0,2156.5 L2010.5,2140.0 L1982.5,2126.0 L1944.5,2115.0 L1903.5,2108.0 L1822.0,2101.5 L1839.0,2040.5 L1858.0,1941.5 L1866.0,1857.5 L1865.0,1745.5 L1874.0,1692.5 L1890.0,1638.5 L1908.0,1600.5 L1941.0,1550.5 L1969.0,1517.5 L2029.0,1456.5 L2059.0,1418.5 L2089.0,1364.5 L2111.5,1304.0 L2170.5,1326.0 L2211.5,1336.0 L2265.5,1342.0 L2312.5,1339.0 L2347.5,1328.0 L2366.5,1318.0 L2384.5,1305.0 L2400.0,1289.5 L2415.0,1268.5 L2423.0,1249.5 L2426.0,1229.5 L2426.0,1197.5 L2419.0,1156.5 L2402.0,1091.5 L2381.0,1035.5 L2346.0,969.5 L2309.0,915.5 L2265.0,862.5 L2262.0,855.5 L2264.0,835.5 L2258.0,781.5 L2243.0,729.5 L2232.0,706.5 L2246.0,664.5 L2255.0,628.5 L2259.0,597.5 L2258.0,551.5 L2255.0,533.5 L2243.0,505.5 L2230.5,491.0 L2214.5,482.0 L2202.5,479.0 L2186.5,479.0 L2149.5,491.0 L2111.5,510.0 L2028.5,561.0 L1996.5,551.0 L1967.5,545.0 L1904.5,540.0 L1822.5,545.0 L1759.5,557.0 L1686.5,521.0 L1606.5,494.0 L1566.5,486.0 L1545.5,486.0 L1529.5,491.0 L1519.5,497.0 L1507.0,509.5 L1500.0,522.5 L1496.0,543.5 L1496.0,564.5 L1502.0,605.5 L1526.0,677.5 L1526.0,683.5 L1519.0,698.5 L1507.0,739.5 L1493.0,824.5 L1488.5,829.0 L1438.5,853.0 L1384.5,884.0 L1293.5,946.0 L1259.5,974.0 L1226.0,1011.5 L1209.0,1037.5 L1195.0,1064.5 L1124.0,1219.5 L1036.0,1423.5 L972.0,1557.5 L961.5,1563.0 L882.5,1572.0 L790.5,1592.0 L734.5,1613.0 L679.5,1645.0 L642.0,1678.5 L625.0,1699.5 L612.0,1720.5 L593.0,1765.5 L575.0,1834.5 L563.0,1862.5 L548.0,1884.5 L527.5,1905.0 L506.5,1920.0 L449.5,1947.0 L412.5,1969.0 L394.0,1985.5 L380.0,2009.5 L374.0,2037.5 L375.0,2060.5 L379.0,2076.5 L386.0,2093.5 L396.0,2109.5 L418.5,2132.0 L446.5,2145.0 L477.5,2151.0 L527.5,2151.0 L560.5,2145.0 L586.5,2137.0 L628.5,2118.0 L678.5,2084.0 L716.0,2046.5 L783.0,1960.5 L815.5,1928.0 L829.5,1917.0 L849.5,1904.0 L876.5,1891.0 L919.5,1878.0 L922.0,1904.5 L934.0,1954.5 L948.0,1992.5 L967.0,2031.5 L1001.0,2080.5 L1058.0,2134.5 L1062.0,2139.5 L1066.0,2152.5 L1069.0,2177.5 L1066.0,2225.5 L1059.0,2258.5 L1038.0,2329.5 L1031.0,2372.5 L1032.0,2427.5 L1038.0,2453.5 L1053.0,2492.5 L1080.0,2541.5 L1111.0,2584.5 L1141.0,2618.5 L1179.5,2655.0 L1210.5,2681.0 L1239.5,2700.0 L1276.5,2712.0 L1299.0,2711.5 Z" />
              </clipPath>
            </defs>
            <path
              d="M1299.0,2711.5 L1316.5,2707.0 L1327.5,2701.0 L1353.5,2706.0 L1370.5,2706.0 L1396.5,2699.0 L1412.5,2690.0 L1431.5,2673.0 L1454.5,2670.0 L1475.5,2662.0 L1488.0,2651.5 L1494.0,2641.5 L1498.0,2625.5 L1497.0,2608.5 L1492.0,2593.5 L1480.0,2573.5 L1467.0,2557.5 L1363.0,2455.5 L1344.0,2432.5 L1336.0,2420.5 L1335.0,2414.5 L1464.0,2239.5 L1509.5,2171.0 L1531.0,2204.5 L1551.5,2224.0 L1585.5,2247.0 L1622.5,2266.0 L1665.5,2284.0 L1714.5,2301.0 L1762.5,2314.0 L1823.5,2326.0 L1895.5,2334.0 L1932.5,2334.0 L1948.5,2332.0 L1968.5,2326.0 L1984.5,2316.0 L2003.5,2292.0 L2017.5,2284.0 L2027.0,2274.5 L2040.0,2252.5 L2046.0,2230.5 L2045.0,2205.5 L2040.0,2193.5 L2033.0,2184.5 L2032.0,2168.5 L2027.0,2156.5 L2010.5,2140.0 L1982.5,2126.0 L1944.5,2115.0 L1903.5,2108.0 L1822.0,2101.5 L1839.0,2040.5 L1858.0,1941.5 L1866.0,1857.5 L1865.0,1745.5 L1874.0,1692.5 L1890.0,1638.5 L1908.0,1600.5 L1941.0,1550.5 L1969.0,1517.5 L2029.0,1456.5 L2059.0,1418.5 L2089.0,1364.5 L2111.5,1304.0 L2170.5,1326.0 L2211.5,1336.0 L2265.5,1342.0 L2312.5,1339.0 L2347.5,1328.0 L2366.5,1318.0 L2384.5,1305.0 L2400.0,1289.5 L2415.0,1268.5 L2423.0,1249.5 L2426.0,1229.5 L2426.0,1197.5 L2419.0,1156.5 L2402.0,1091.5 L2381.0,1035.5 L2346.0,969.5 L2309.0,915.5 L2265.0,862.5 L2262.0,855.5 L2264.0,835.5 L2258.0,781.5 L2243.0,729.5 L2232.0,706.5 L2246.0,664.5 L2255.0,628.5 L2259.0,597.5 L2258.0,551.5 L2255.0,533.5 L2243.0,505.5 L2230.5,491.0 L2214.5,482.0 L2202.5,479.0 L2186.5,479.0 L2149.5,491.0 L2111.5,510.0 L2028.5,561.0 L1996.5,551.0 L1967.5,545.0 L1904.5,540.0 L1822.5,545.0 L1759.5,557.0 L1686.5,521.0 L1606.5,494.0 L1566.5,486.0 L1545.5,486.0 L1529.5,491.0 L1519.5,497.0 L1507.0,509.5 L1500.0,522.5 L1496.0,543.5 L1496.0,564.5 L1502.0,605.5 L1526.0,677.5 L1526.0,683.5 L1519.0,698.5 L1507.0,739.5 L1493.0,824.5 L1488.5,829.0 L1438.5,853.0 L1384.5,884.0 L1293.5,946.0 L1259.5,974.0 L1226.0,1011.5 L1209.0,1037.5 L1195.0,1064.5 L1124.0,1219.5 L1036.0,1423.5 L972.0,1557.5 L961.5,1563.0 L882.5,1572.0 L790.5,1592.0 L734.5,1613.0 L679.5,1645.0 L642.0,1678.5 L625.0,1699.5 L612.0,1720.5 L593.0,1765.5 L575.0,1834.5 L563.0,1862.5 L548.0,1884.5 L527.5,1905.0 L506.5,1920.0 L449.5,1947.0 L412.5,1969.0 L394.0,1985.5 L380.0,2009.5 L374.0,2037.5 L375.0,2060.5 L379.0,2076.5 L386.0,2093.5 L396.0,2109.5 L418.5,2132.0 L446.5,2145.0 L477.5,2151.0 L527.5,2151.0 L560.5,2145.0 L586.5,2137.0 L628.5,2118.0 L678.5,2084.0 L716.0,2046.5 L783.0,1960.5 L815.5,1928.0 L829.5,1917.0 L849.5,1904.0 L876.5,1891.0 L919.5,1878.0 L922.0,1904.5 L934.0,1954.5 L948.0,1992.5 L967.0,2031.5 L1001.0,2080.5 L1058.0,2134.5 L1062.0,2139.5 L1066.0,2152.5 L1069.0,2177.5 L1066.0,2225.5 L1059.0,2258.5 L1038.0,2329.5 L1031.0,2372.5 L1032.0,2427.5 L1038.0,2453.5 L1053.0,2492.5 L1080.0,2541.5 L1111.0,2584.5 L1141.0,2618.5 L1179.5,2655.0 L1210.5,2681.0 L1239.5,2700.0 L1276.5,2712.0 L1299.0,2711.5 Z"
              fill="none"
              stroke="rgba(15, 23, 42, 0.3)"
              strokeWidth="56"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="50 80"
              clipPath="url(#cat-trace-clip)"
            />
          </svg>
        </div>
      )
    }

    const roundedClass = sticker.styleVariant === "capsule" ? "rounded-[0.85rem]" : "rounded-[999px]"
    return (
      <div
        style={{ width, height }}
        className={`flex items-center justify-center border-2 border-dashed border-foreground/15 bg-black/[0.03] ${roundedClass}`}
      />
    )
  }

  const interactionClassName = isActive ? "cursor-grabbing" : "cursor-grab"
  const activeClassName = isActive
    ? "shadow-[0_22px_38px_rgba(15,23,42,0.2)]"
    : "shadow-[0_10px_18px_rgba(15,23,42,0.1)]"

  if (sticker.styleVariant === "mono") {
    return (
      <StickerSurface
        width={isTemplate ? 168 : 196}
        height={100}
        activeClassName={activeClassName}
        interactionClassName={interactionClassName}
        className="rounded-[999px] bg-[#0d0d10] text-[#f4f4ef]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="absolute inset-[3px] rounded-[999px] border border-white/10" />
        <span className="relative max-w-[10ch] font-display text-[1.05rem] font-black uppercase leading-[0.88] tracking-[-0.05em] [text-shadow:0_1px_0_rgba(255,255,255,0.12)]">
          {sticker.label}
        </span>
      </StickerSurface>
    )
  }

  if (sticker.styleVariant === "serif") {
    return (
      <StickerSurface
        width={isTemplate ? 168 : 196}
        height={114}
        activeClassName={activeClassName}
        interactionClassName={interactionClassName}
        className="bg-transparent"
      >
        <div className="absolute left-[3%] top-[32%] h-[40%] w-[24%] rounded-full bg-[linear-gradient(135deg,#d8ff7a_0%,#f7d3ff_18%,#9be2ff_36%,#fff6a3_54%,#c0f8d4_72%,#b6a7ff_88%,#ffd4e6_100%)] p-[6px]">
          <div className="h-full w-full rounded-full bg-[#101219]" />
        </div>
        <div className="absolute left-[18%] top-[10%] h-[52%] w-[28%] rounded-full bg-[linear-gradient(135deg,#d8ff7a_0%,#f7d3ff_18%,#9be2ff_36%,#fff6a3_54%,#c0f8d4_72%,#b6a7ff_88%,#ffd4e6_100%)] p-[6px]">
          <div className="h-full w-full rounded-full bg-[#101219]" />
        </div>
        <div className="absolute left-[34%] top-[2%] h-[60%] w-[30%] rounded-full bg-[linear-gradient(135deg,#d8ff7a_0%,#f7d3ff_18%,#9be2ff_36%,#fff6a3_54%,#c0f8d4_72%,#b6a7ff_88%,#ffd4e6_100%)] p-[6px]">
          <div className="h-full w-full rounded-full bg-[#101219]" />
        </div>
        <div className="absolute right-[20%] top-[10%] h-[52%] w-[28%] rounded-full bg-[linear-gradient(135deg,#d8ff7a_0%,#f7d3ff_18%,#9be2ff_36%,#fff6a3_54%,#c0f8d4_72%,#b6a7ff_88%,#ffd4e6_100%)] p-[6px]">
          <div className="h-full w-full rounded-full bg-[#101219]" />
        </div>
        <div className="absolute right-[4%] top-[32%] h-[40%] w-[24%] rounded-full bg-[linear-gradient(135deg,#d8ff7a_0%,#f7d3ff_18%,#9be2ff_36%,#fff6a3_54%,#c0f8d4_72%,#b6a7ff_88%,#ffd4e6_100%)] p-[6px]">
          <div className="h-full w-full rounded-full bg-[#101219]" />
        </div>
        <div className="absolute left-[22%] top-[32%] h-[42%] w-[56%] rounded-[999px] bg-[linear-gradient(135deg,#d8ff7a_0%,#f7d3ff_18%,#9be2ff_36%,#fff6a3_54%,#c0f8d4_72%,#b6a7ff_88%,#ffd4e6_100%)] p-[6px]">
          <div className="h-full w-full rounded-[999px] bg-[#101219]" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center px-5 text-[#f5f4ff]">
          <span className="max-w-[7ch] font-serif text-[0.92rem] font-semibold leading-[0.93] tracking-[-0.04em]">
            {sticker.label}
          </span>
          <div className="absolute bottom-[20%] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/70 blur-[1px]" />
        </div>
      </StickerSurface>
    )
  }

  if (sticker.styleVariant === "capsule") {
    return (
      <PeelableCapsuleSticker
        width={isTemplate ? 168 : 196}
        height={100}
        activeClassName={activeClassName}
        interactionClassName={interactionClassName}
        label={sticker.label}
      />
    )
  }

  if (sticker.styleVariant === "image") {
    return (
      <ImageSticker
        width={isTemplate ? 142 : 160}
        height={isTemplate ? 156 : 176}
        interactionClassName={interactionClassName}
        isActive={isActive}
        src={stickerImageSrc}
        alt={sticker.label}
      />
    )
  }

  return (
    <StickerSurface
      width={isTemplate ? 126 : 132}
      height={132}
      activeClassName={activeClassName}
      interactionClassName={interactionClassName}
      wrapperExtraClassName={isTemplate ? "mx-auto" : ""}
      className="rounded-full bg-[#0f1118] text-[#eef0ff]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(171,130,255,0.16),transparent_34%)]" />
      <div className="absolute inset-[5px] rounded-full border border-white/10" />
      <div className="relative mx-auto flex max-w-[5.2ch] flex-col items-center gap-1">
        <div className="text-[0.76rem] font-display font-black uppercase leading-[0.84] tracking-[-0.04em]">
          {sticker.label}
        </div>
        <div className="h-2.5 w-2.5 rounded-full border border-white/30 bg-white/12" />
      </div>
    </StickerSurface>
  )
}

function StickerSurface({
  width,
  height,
  activeClassName,
  interactionClassName,
  className,
  wrapperExtraClassName = "",
  outerClassName = "",
  children,
}: {
  width: number
  height: number
  activeClassName: string
  interactionClassName: string
  className: string
  wrapperExtraClassName?: string
  outerClassName?: string
  children: React.ReactNode
}) {
  return (
    <div className={`${interactionClassName} group ${activeClassName} ${wrapperExtraClassName}`} style={{ width, height }}>
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-[0.995] ${outerClassName} ${className}`}
        style={{ transformOrigin: "top right", touchAction: "none" }}
      >
        {children}
      </div>
    </div>
  )
}

function PeelableCapsuleSticker({
  width,
  height,
  activeClassName,
  interactionClassName,
  label,
}: {
  width: number
  height: number
  activeClassName: string
  interactionClassName: string
  label: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const flapRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current || !labelRef.current || !flapRef.current || !shadowRef.current) return

    const ctx = gsap.context(() => {
      timelineRef.current = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power1.inOut",
          duration: 0.45,
        },
      })

      timelineRef.current
        .to(rootRef.current, { rotate: -2.5, y: -1.5 }, 0)
        .to(labelRef.current, { x: -6, y: 1 }, 0)
        .fromTo(
          shadowRef.current,
          { autoAlpha: 0, scale: 0.2, x: 0, y: 0, rotate: 0 },
          { autoAlpha: 1, scale: 1, x: 5, y: 4, rotate: -10 },
          0
        )
        .fromTo(
          flapRef.current,
          { autoAlpha: 0, scale: 0.25, x: 0, y: 0, rotate: 0 },
          { autoAlpha: 1, scale: 1, x: 4, y: -2, rotate: -12, duration: 0.5 },
          0.02
        )
    }, rootRef)

    return () => {
      timelineRef.current?.kill()
      ctx.revert()
    }
  }, [])

  return (
    <StickerSurface
      width={width}
      height={height}
      activeClassName={activeClassName}
      interactionClassName={interactionClassName}
      outerClassName="overflow-visible"
      className="text-[#11130d]"
    >
      <div
        ref={rootRef}
        onPointerEnter={() => timelineRef.current?.play()}
        onPointerLeave={() => timelineRef.current?.reverse()}
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[0.85rem] bg-[#cfff4f]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.4),transparent_45%),repeating-linear-gradient(90deg,rgba(17,19,13,0.08)_0_3px,transparent_3px_8px)]" />
        <div
          ref={shadowRef}
          className="pointer-events-none absolute right-[10px] top-[8px] h-10 w-10 origin-top-right opacity-0 [clip-path:polygon(100%_0,0_0,100%_100%)] bg-[linear-gradient(135deg,rgba(0,0,0,0.22),rgba(0,0,0,0.08)_58%,transparent)]"
        />
        <div
          ref={flapRef}
          className="pointer-events-none absolute right-[6px] top-[4px] h-10 w-10 origin-top-right opacity-0"
        >
          <div className="absolute inset-0 [clip-path:polygon(100%_0,10%_0,100%_90%)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(240,240,240,0.88)_42%,rgba(210,210,210,0.45)_100%)] shadow-[-2px_2px_8px_rgba(0,0,0,0.14)]" />
          <div className="absolute inset-0 [clip-path:polygon(100%_0,10%_0,100%_90%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.35),transparent_70%)]" />
        </div>
        <span
          ref={labelRef}
          className="relative max-w-[8ch] font-display text-[0.95rem] font-black uppercase leading-[0.88] tracking-[-0.05em]"
        >
          {label}
        </span>
      </div>
    </StickerSurface>
  )
}

function ImageSticker({
  width,
  height,
  interactionClassName,
  isActive,
  src,
  alt,
}: {
  width: number
  height: number
  interactionClassName: string
  isActive: boolean
  src: string
  alt: string
}) {
  return (
    <div
      className={`${interactionClassName} group relative`}
      style={{
        width,
        height,
        touchAction: "none",
        transformOrigin: "center",
        transform: isActive ? "scale(1.12)" : "scale(1)",
        filter: isActive
          ? "drop-shadow(2px 6px 3px rgba(15,23,42,0.52))"
          : "drop-shadow(2px 0px 0px rgba(15,23,42,0))",
        transition: "transform 300ms ease-out, filter 350ms ease-out",
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <StickerPeel
          imageSrc={src}
          alt={alt}
          width={width}
          peelBackHoverPct={20}
          peelBackActivePct={20}
          shadowIntensity={0}
          lightingIntensity={0.02}
          rotate={0}
          peelDirection={30}
          draggable={false}
          className="absolute max-w-none origin-center"
        />
      </div>
    </div>
  )
}
