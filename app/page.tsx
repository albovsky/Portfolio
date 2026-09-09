"use client"


import Link from "next/link"
import { AsciiPortrait } from "@/components/portraits/ascii-portrait"
import { Folder } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Draggable, gsap } from "@/lib/gsap"
import StickerPeel from "@/components/StickerPeel"
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

type StickerVariant = "mono" | "serif" | "capsule" | "note" | "image"

type StickerTemplate = {
  id: string
  label: string
  styleVariant: StickerVariant
  defaultPosition: { x: number; y: number }
}

type PlacedSticker = StickerTemplate & {
  placedPosition: { x: number; y: number }
}

const stickerTemplates: StickerTemplate[] = [
  {
    id: "cool-cat",
    label: "cool cat",
    styleVariant: "image",
    defaultPosition: { x: 720, y: 160 },
  },
]

const stickerImageSrc =
  "/stickers/vecteezy_i-m-cool-cat-meme-sticker-t-shirt-transparent-cute-illustration_65295005.png"
const stickerImageCrop = {
  widthScale: 172,
  heightScale: 160,
  left: -30,
  top: -29,
}

export default function Home() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const folderButtonRef = useRef<HTMLButtonElement>(null)
  const templateNodesRef = useRef<Record<string, HTMLDivElement | null>>({})
  const placedNodesRef = useRef<Record<string, HTMLDivElement | null>>({})
  const templateDraggersRef = useRef<Map<string, Draggable>>(new Map())
  const placedDraggersRef = useRef<Map<string, Draggable>>(new Map())
  const [isTrayOpen, setIsTrayOpen] = useState(false)
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null)

  const createStickerFromTemplate = (template: StickerTemplate, point?: { x: number; y: number }) => {
    const overlayRect = overlayRef.current?.getBoundingClientRect()
    const { width, height } = getStickerDimensions(template.styleVariant, false)
    const fallbackX = overlayRect ? Math.min(24, Math.max(0, overlayRect.width - width)) : template.defaultPosition.x
    const fallbackY = Math.max(24, window.scrollY + 96)

    const nextX =
      overlayRect && point
        ? clamp(point.x, 0, overlayRect.width - width)
        : fallbackX
    const nextY =
      overlayRect && point
        ? clamp(point.y, 0, overlayRect.height - height)
        : fallbackY

    setPlacedStickers((current) => [
      ...current,
      {
        ...template,
        id: `${template.id}-${crypto.randomUUID()}`,
        placedPosition: { x: nextX, y: nextY },
      },
    ])
  }

  const updateStickerPosition = (id: string, nextPosition: { x: number; y: number }) => {
    setPlacedStickers((current) =>
      current.map((sticker) => (sticker.id === id ? { ...sticker, placedPosition: nextPosition } : sticker))
    )
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          "[data-bento-card]",
          { autoAlpha: 0, y: 30, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: 0.06,
            duration: 0.65,
            ease: "power3.out",
          }
        )
      }

      if (folderButtonRef.current) {
        gsap.fromTo(
          folderButtonRef.current,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power3.out" }
        )
      }

      if (drawerRef.current) {
        gsap.set(drawerRef.current, {
          autoAlpha: 0,
          y: 12,
          scale: 0.98,
          pointerEvents: "none",
        })
      }
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!drawerRef.current) return

    gsap.to(drawerRef.current, {
      autoAlpha: isTrayOpen ? 1 : 0,
      y: isTrayOpen ? 0 : 12,
      scale: isTrayOpen ? 1 : 0.98,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : isTrayOpen ? 0.24 : 0.2,
      ease: "power3.out",
      overwrite: true,
      onStart: () => {
        if (drawerRef.current) {
          drawerRef.current.style.pointerEvents = isTrayOpen ? "auto" : "none"
        }
      },
    })
  }, [isTrayOpen])



  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      stickerTemplates.forEach((template) => {
        const node = templateNodesRef.current[template.id]
        if (!node || templateDraggersRef.current.has(template.id)) return

        const draggable = Draggable.create(node, {
          type: "x,y",
          zIndexBoost: false,
          onPress(e) {
            setActiveStickerId(template.id)
            const rect = this.target.getBoundingClientRect()
            this.target.dataset.offsetX = (this.pointerX - rect.left).toString()
            this.target.dataset.offsetY = (this.pointerY - rect.top).toString()
          },
          onRelease: () => setActiveStickerId(null),
          onDragEnd() {
            const overlay = overlayRef.current
            if (!overlay) {
              createStickerFromTemplate(template, { x: this.pointerX, y: this.pointerY })
              templateDraggersRef.current.get(template.id)?.kill()
              return
            }

            const overlayRect = overlay.getBoundingClientRect()
            const rawOffsetX = parseFloat(this.target.dataset.offsetX || "0")
            const rawOffsetY = parseFloat(this.target.dataset.offsetY || "0")

            // Scale the grab offset from template size → placed size so the
            // sticker lands with the cursor at the same relative position.
            const templateDims = getStickerDimensions(template.styleVariant, true)
            const placedDims = getStickerDimensions(template.styleVariant, false)
            const offsetX = rawOffsetX * (placedDims.width / templateDims.width)
            const offsetY = rawOffsetY * (placedDims.height / templateDims.height)

            const dropPos = {
              x: this.pointerX - overlayRect.left - offsetX,
              y: this.pointerY - overlayRect.top - offsetY,
            }

            createStickerFromTemplate(template, dropPos)
            // Disable the template in the drawer immediately
            templateDraggersRef.current.get(template.id)?.kill()
          },
        })[0]

        templateDraggersRef.current.set(template.id, draggable)
      })

      return () => {
        templateDraggersRef.current.forEach((draggable) => draggable.kill())
        templateDraggersRef.current.clear()
      }
    })

    return () => mm.revert()
  }, [])

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      const overlay = overlayRef.current
      if (!overlay) return

      placedStickers.forEach((sticker) => {
        const node = placedNodesRef.current[sticker.id]
        if (!node) return

        // Only initialize position + draggable once per sticker node
        if (!placedDraggersRef.current.has(sticker.id)) {
          gsap.set(node, {
            x: sticker.placedPosition.x,
            y: sticker.placedPosition.y,
          })

          const draggable = Draggable.create(node, {
            type: "x,y",
            bounds: overlay,
            inertia: false,
            zIndexBoost: false,
            onPress: () => setActiveStickerId(sticker.id),
            onRelease: () => setActiveStickerId(null),
            onDragEnd() {
              const { width, height } = getStickerDimensions(sticker.styleVariant, false)
              const overlayRect = overlay.getBoundingClientRect()
              updateStickerPosition(sticker.id, {
                x: clamp(this.x, 0, overlayRect.width - width),
                y: clamp(this.y, 0, overlayRect.height - height),
              })
            },
          })[0]

          placedDraggersRef.current.set(sticker.id, draggable)
        }
      })

      Array.from(placedDraggersRef.current.keys()).forEach((id) => {
        if (placedStickers.some((sticker) => sticker.id === id)) return
        placedDraggersRef.current.get(id)?.kill()
        placedDraggersRef.current.delete(id)
      })

      return () => {
        placedDraggersRef.current.forEach((draggable) => draggable.kill())
        placedDraggersRef.current.clear()
      }
    })

    return () => mm.revert()
  }, [placedStickers])

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
            {stickerTemplates.map((template) => {
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
      if (!reduce) gsap.to(flags, { y: index => index % 2 === 0 ? -5 : 5, rotate: index => index % 2 === 0 ? 3 : -3, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.12 })
      timelineRef.current = gsap.timeline({ paused: true, defaults: { ease: "power4.out", duration: reduce ? 0 : 0.24 } })
        .to(glowRef.current, { scale: 1.2, opacity: 0.95 }, 0)
        .to(frontLayerRef.current, { y: -78, scale: 0.93, opacity: 0.48 }, 0)
        .to(flags, { scale: 1.06, opacity: 0.72 }, 0)
        .to(latestRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: reduce ? 0 : 0.3, ease: "back.out(1.15)" }, 0)
        .to(latestLineRef.current, { scaleX: 1, duration: reduce ? 0 : 0.16, ease: "power2.out" }, reduce ? 0 : 0.12)
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

function StickerChip({
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
          <img
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

function getStickerDimensions(variant: StickerVariant, isTemplate: boolean) {
  if (variant === "mono") return { width: isTemplate ? 168 : 196, height: 100 }
  if (variant === "serif") return { width: isTemplate ? 168 : 196, height: 114 }
  if (variant === "capsule") return { width: isTemplate ? 168 : 196, height: 100 }
  if (variant === "image") return { width: isTemplate ? 142 : 160, height: isTemplate ? 156 : 176 }
  return { width: isTemplate ? 126 : 132, height: 132 }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
