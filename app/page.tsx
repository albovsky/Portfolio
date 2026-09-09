"use client"


import dynamic from "next/dynamic"
import { AsciiPortrait } from "@/components/portraits/ascii-portrait"
import { Folder } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap"
import { useStickers } from "@/hooks/use-stickers"
import { stickerTemplates } from "@/lib/sticker-templates"
const StickerChip = dynamic(() => import("@/components/sticker-chip").then(module => module.StickerChip), { ssr: false })
import { BentoGrid, BentoCard } from "@/components/bento/grid"
import { TriathlonCard } from "@/components/bento/triathlon"
import { PettFeaturedCard } from "@/components/bento/pett"
import { CatRoom } from "@/components/bento/cat-room"
const bentoItems = [
  { id: "manifesto", size: "wide", label: "Introduction" },
  { id: "pett", size: "wide", label: "Building Pett" },
  { id: "countries", size: "small", label: "Countries visited" },
  { id: "cats", size: "wide", label: "Pusha and Bonita’s little home" },
  { id: "triathlon", size: "small", label: "My first T100 Sprint triathlon" },
] as const

export default function Home() {
  const { overlayRef, drawerRef, folderButtonRef, templateNodesRef, placedNodesRef, isTrayOpen, setIsTrayOpen, placedStickers, setPlacedStickers, activeStickerId, createStickerFromTemplate } = useStickers()
  const gridRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          "[data-bento-card]",
          { y: 12 },
          {
            y: 0,
            stagger: 0.06,
            duration: 0.3,
            ease: "power3.out",
          }
        )
      }

    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="bento-home relative min-h-screen bg-background">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-32 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute right-[10%] top-40 h-80 w-80 rounded-full bg-stone-200/80 blur-3xl" />
        <div className="absolute bottom-8 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-stone-300/40 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      </div>

      <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-50">
        {placedStickers.map((sticker) => (
          <div
            key={sticker.id}
            ref={(node) => {
              placedNodesRef.current[sticker.id] = node
            }}
            style={{ transform: `translate(${sticker.placedPosition.x}px, ${sticker.placedPosition.y}px)` }}
            className="pointer-events-auto absolute left-0 top-0"
          >
            <StickerChip sticker={sticker} isActive={activeStickerId === sticker.id} />
          </div>
        ))}
      </div>

      <section className="bento-section" aria-label="A little about me and my work">
        <BentoGrid gridRef={gridRef}>
          {bentoItems.map((item) => <BentoCard key={item.id} id={item.id} size={item.size} label={item.label}>
            {item.id === "manifesto" && <ManifestoCard />}
            {item.id === "pett" && <PettFeaturedCard />}
            {item.id === "countries" && <CountriesVisitedCard />}
            {item.id === "cats" && <CatRoom />}
            {item.id === "triathlon" && <TriathlonCard />}
          </BentoCard>)}
        </BentoGrid>
      </section>

      <div className="pointer-events-none fixed bottom-4 left-4 z-[60]">
        <div
          ref={drawerRef}
          id="sticker-tray"
          inert={!isTrayOpen}
          className="pointer-events-auto absolute bottom-24 left-0 w-[260px] rounded-[1.8rem] border border-white/70 bg-white/55 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-2xl"
        >
          <div className="mb-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.26em] text-foreground/35">
              Drag a sticker or tap Add
            </div>
          </div>

          <button className="bento-action" onClick={() => { createStickerFromTemplate(stickerTemplates[0]); setIsTrayOpen(false) }}>Add cat sticker</button>
          <button className="bento-action mt-2" onClick={() => setPlacedStickers([])}>Clear stickers</button>
          <div className="hidden md:flex items-center justify-center py-1">
            {isTrayOpen && stickerTemplates.map((template) => {
              const isPlaced = placedStickers.some((s) => s.id.startsWith(template.id))
              return (
                <div key={template.id} className="relative">
                  <div className="pointer-events-none absolute inset-0">
                    <StickerChip sticker={template} isPlaceholder isTemplate />
                  </div>
                  <div
                    ref={(node) => {
                      templateNodesRef.current[template.id] = node
                    }}
                    className={`pointer-events-auto relative z-10 transition-opacity duration-200 ${isPlaced ? "opacity-0 invisible" : "opacity-100 visible"}`}
                  >
                    <StickerChip sticker={template} isActive={activeStickerId === template.id} isTemplate />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          ref={folderButtonRef}
          aria-expanded={isTrayOpen}
          aria-controls="sticker-tray"
          type="button"
          onClick={() => setIsTrayOpen((current) => !current)}
          className="pointer-events-auto flex items-center gap-3 rounded-[1.6rem] border border-white/75 bg-white/60 px-4 py-3 shadow-[0_22px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="relative flex size-11 items-center justify-center rounded-[1rem] border border-amber-200/70 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
            <Folder className="size-5 text-amber-900/70" />
            <div className="absolute -right-1 -top-1 rounded-full border border-white/70 bg-white/80 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.18em] text-foreground/45">
              fun
            </div>
          </div>

          <div className="text-left">
            <div className="text-sm font-medium tracking-[-0.02em] text-foreground/80">Stickers</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.26em] text-foreground/35">
              {isTrayOpen ? "Close drawer" : "Open drawer"}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

function CountriesVisitedCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const frontLayerRef = useRef<HTMLDivElement>(null)
  const latestRef = useRef<HTMLDivElement>(null)
  const latestLineRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null)
  const returnTimelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, context => {
      const reduce = context.conditions?.reduce
      const flags = cardRef.current?.querySelectorAll("[data-country-flag]") ?? []
      gsap.set(latestRef.current, { autoAlpha: 0, y: 76, scale: 0.94 })
      gsap.set(latestLineRef.current, { scaleX: 0, transformOrigin: "left center" })
      gsap.set(frontLayerRef.current, { y: 0, scale: 1, opacity: 1 })
      gsap.set(flags, { transformOrigin: "center" })
      const floating = reduce ? null : gsap.to(flags, { y: index => index % 2 === 0 ? -5 : 5, rotate: index => index % 2 === 0 ? 3 : -3, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.12, paused: true })
      let visible = false
      const updateMotion = () => { floating?.paused(!visible || document.hidden) }
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateMotion() })
      if (cardRef.current) visibility.observe(cardRef.current)
      document.addEventListener("visibilitychange", updateMotion)
      timelineRef.current = gsap.timeline({ paused: true, defaults: { ease: "power4.out", duration: reduce ? 0 : 0.24 } })
        .to(glowRef.current, { scale: 1.2, opacity: 0.95 }, 0)
        .to(frontLayerRef.current, { y: -78, scale: 0.93, opacity: 0.48 }, 0)
        .to(flags, { scale: 1.06, opacity: 0.72 }, 0)
        .to(latestRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: reduce ? 0 : 0.3, ease: "back.out(1.15)" }, 0)
        .to(latestLineRef.current, { scaleX: 1, duration: reduce ? 0 : 0.16, ease: "power2.out" }, reduce ? 0 : 0.12)
      return () => { visibility.disconnect(); document.removeEventListener("visibilitychange", updateMotion) }
    }, cardRef)
    return () => { returnTimelineRef.current?.kill(); mm.revert() }
  }, [])
  const reveal = () => {
    returnTimelineRef.current?.kill()
    timelineRef.current?.invalidate().restart()
    setIsRevealed(true)
  }
  const hide = () => {
    timelineRef.current?.pause()
    returnTimelineRef.current?.kill()
    const flags = cardRef.current?.querySelectorAll("[data-country-flag]") ?? []
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    returnTimelineRef.current = gsap.timeline({ defaults: { duration: reduce ? 0 : 0.38, ease: "sine.inOut" } })
      .to(glowRef.current, { scale: 1, opacity: 0.7 }, 0)
      .to(frontLayerRef.current, { y: 0, scale: 1, opacity: 1 }, 0)
      .to(flags, { scale: 1, opacity: 1 }, 0)
      .to(latestRef.current, { autoAlpha: 0, y: 76, scale: 0.94 }, 0)
      .to(latestLineRef.current, { scaleX: 0 }, 0)
    setIsRevealed(false)
  }
  return <div ref={cardRef} role="button" tabIndex={0} aria-expanded={isRevealed} aria-label="Visited 27 countries. Show latest visit: Vietnam, fall 2025." onPointerEnter={event => { if (event.pointerType === "mouse") reveal() }} onPointerLeave={event => { if (event.pointerType === "mouse") hide() }} onFocus={event => { if (event.currentTarget.matches(":focus-visible")) reveal() }} onBlur={hide} onClick={() => isRevealed ? hide() : reveal()} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (isRevealed) hide(); else reveal() } if (event.key === "Escape") hide() }} className="original-countries relative z-10 h-full overflow-hidden p-6 text-foreground">
    <div ref={glowRef} className="pointer-events-none absolute right-8 top-8 h-36 w-48 bg-[radial-gradient(circle,rgba(255,255,255,0.72),rgba(226,232,240,0.24)_48%,transparent_72%)] opacity-70 blur-2xl" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_82%,rgba(191,219,254,0.28),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(245,245,244,0.42),transparent_34%)]" />
    <div ref={latestRef} data-latest-country className="absolute inset-x-5 bottom-5 z-[1] flex items-center gap-3 rounded-[1.25rem] border border-white/75 bg-white/78 p-2.5 shadow-[0_18px_38px_rgba(15,23,42,0.09),inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-2xl">
      <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/70 shadow-[0_10px_22px_rgba(15,23,42,0.08)]"><VietnamFlagIcon className="size-8" title="Vietnam flag" /></div>
      <div className="min-w-0 flex-1"><div className="font-mono text-[9px] uppercase text-foreground/38">Latest country</div><div className="mt-0.5 flex items-end justify-between gap-3"><div className="country-display-name">Vietnam</div><div className="shrink-0 text-[11px] font-medium leading-none text-foreground/45">Fall 2025</div></div><div ref={latestLineRef} className="mt-2 h-px w-full bg-gradient-to-r from-emerald-700/24 to-transparent" /></div>
    </div>
    <div ref={frontLayerRef} className="pointer-events-none absolute inset-0 z-[2]">
      <div className="absolute inset-0">
        <FlagBadge className="left-5 top-7 rotate-[-11deg]" label="Vietnam" styleVariant="vietnam" />
        <FlagBadge className="right-8 top-9 rotate-[9deg]" label="Poland" styleVariant="poland" />
        <FlagBadge className="bottom-8 left-7 rotate-[8deg]" label="France" styleVariant="france" />
        <FlagBadge className="bottom-10 right-7 rotate-[-8deg]" label="Italy" styleVariant="italy" />
        <FlagBadge className="left-[38%] top-4 rotate-[5deg]" label="Germany" styleVariant="germany" isSmall />
        <FlagBadge className="right-[34%] bottom-5 rotate-[-4deg]" label="Greece" styleVariant="greece" isSmall />
      </div>
      <div className="flex h-full items-center justify-center"><div className="flex flex-col items-center text-center"><div className="mb-2 font-mono text-[10px] uppercase text-foreground/46">Countries visited</div><div className="country-display-number">27</div></div></div>
    </div>
  </div>
}

function FlagBadge({
  className,
  label,
  styleVariant,
  isSmall = false,
}: {
  className: string
  label: string
  styleVariant: "vietnam" | "poland" | "france" | "italy" | "germany" | "greece"
  isSmall?: boolean
}) {
  const flagClassName = {
    poland: "bg-[linear-gradient(to_bottom,#f8fafc_0_50%,#dc3b46_50%)]",
    france: "bg-[linear-gradient(to_right,#1f4ea8_0_33%,#f8fafc_33%_66%,#d94b51_66%)]",
    italy: "bg-[linear-gradient(to_right,#38935a_0_33%,#f8fafc_33%_66%,#c83d44_66%)]",
    germany: "bg-[linear-gradient(to_bottom,#222222_0_33%,#d9473f_33%_66%,#f2c84b_66%)]",
  }[styleVariant as "poland" | "france" | "italy" | "germany"]

  return (
    <div
      data-country-flag
      aria-hidden="true"
      className={[
        "absolute rounded-full border border-white/80 bg-white/68 p-1.5 shadow-[0_16px_34px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-xl will-change-transform",
        isSmall ? "size-11" : "size-14",
        className,
      ].join(" ")}
    >
      {styleVariant === "vietnam" ? (
        <VietnamFlagIcon className="h-full w-full" title={label} />
      ) : styleVariant === "greece" ? (
        <GreeceFlagIcon className="h-full w-full" title={label} />
      ) : (
        <div className={`relative h-full w-full overflow-hidden rounded-full ${flagClassName}`} title={label} />
      )}
    </div>
  )
}

function VietnamFlagIcon({
  className,
  title,
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={`overflow-hidden rounded-full ${className ?? ""}`}
    >
      <circle cx="50" cy="50" r="50" fill="#d75145" />
      <polygon
        points="50,25 57.1,42.8 76.2,44.1 61.5,56.4 66.2,75 50,64.8 33.8,75 38.5,56.4 23.8,44.1 42.9,42.8"
        fill="#f7d969"
      />
    </svg>
  )
}

function GreeceFlagIcon({
  className,
  title,
}: {
  className?: string
  title?: string
}) {
  const blue = "#3d7fc7"
  const white = "#f8fafc"
  const stripeHeight = 100 / 9
  const cantonSize = stripeHeight * 5

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={`overflow-hidden rounded-full ${className ?? ""}`}
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <rect
          key={index}
          x="0"
          y={index * stripeHeight}
          width="100"
          height={stripeHeight + 0.2}
          fill={index % 2 === 0 ? blue : white}
        />
      ))}
      <rect x="0" y="0" width={cantonSize} height={cantonSize} fill={blue} />
      <rect x={stripeHeight * 2} y="0" width={stripeHeight} height={cantonSize} fill={white} />
      <rect x="0" y={stripeHeight * 2} width={cantonSize} height={stripeHeight} fill={white} />
    </svg>
  )
}

function ManifestoCard() {
  return <div className="manifesto-minimal">
    <div className="manifesto-minimal-copy">
      <h1>Hey, my name is Glib.</h1>
      <p className="manifesto-intro">I work as a tech designer by day and build products at night. Feel free to explore the website to learn more.</p>
    </div>
    <div className="manifesto-ascii">
      <AsciiPortrait />
    </div>
  </div>
}
