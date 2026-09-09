"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap"
import type { Draggable } from "gsap/all"
import { clamp, getStickerDimensions, type StickerTemplate, type PlacedSticker } from "@/lib/stickers"
import { stickerTemplates } from "@/lib/sticker-templates"

export function useStickers() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const folderButtonRef = useRef<HTMLButtonElement>(null)
  const templateNodesRef = useRef<Record<string, HTMLDivElement | null>>({})
  const placedNodesRef = useRef<Record<string, HTMLDivElement | null>>({})
  const templateDraggersRef = useRef<Map<string, Draggable>>(new Map())
  const placedDraggersRef = useRef<Map<string, Draggable>>(new Map())
  const [isTrayOpen, setIsTrayOpen] = useState(false)
  const [dragPlugin, setDragPlugin] = useState<typeof import("@/lib/gsap-draggable") | null>(null)
  useEffect(() => {
    if (!isTrayOpen || dragPlugin) return
    let active = true
    import("@/lib/gsap-draggable")
      .then(plugin => { if (active) setDragPlugin(plugin) })
      .catch(() => { if (active) console.warn("Sticker dragging is unavailable. Use the Add cat sticker button instead.") })
    return () => { active = false }
  }, [isTrayOpen, dragPlugin])
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
    if (!dragPlugin) return
    const { Draggable } = dragPlugin
    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      stickerTemplates.forEach((template) => {
        const node = templateNodesRef.current[template.id]
        if (!node || templateDraggersRef.current.has(template.id)) return

        const draggable = Draggable.create(node, {
          type: "x,y",
          zIndexBoost: false,
          onPress() {
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
  }, [isTrayOpen, dragPlugin])

  useLayoutEffect(() => {
    if (!dragPlugin) return
    const { Draggable } = dragPlugin
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
  }, [placedStickers, dragPlugin])

  return { overlayRef, drawerRef, folderButtonRef, templateNodesRef, placedNodesRef, isTrayOpen, setIsTrayOpen, placedStickers, setPlacedStickers, activeStickerId, createStickerFromTemplate }
}
