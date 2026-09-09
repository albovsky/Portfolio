export type StickerVariant = "mono" | "serif" | "capsule" | "note" | "image"

export type StickerTemplate = {
  id: string
  label: string
  styleVariant: StickerVariant
  defaultPosition: { x: number; y: number }
}

export type PlacedSticker = StickerTemplate & {
  placedPosition: { x: number; y: number }
}

export function getStickerDimensions(variant: StickerVariant, isTemplate: boolean) {
  if (variant === "mono") return { width: isTemplate ? 168 : 196, height: 100 }
  if (variant === "serif") return { width: isTemplate ? 168 : 196, height: 114 }
  if (variant === "capsule") return { width: isTemplate ? 168 : 196, height: 100 }
  if (variant === "image") return { width: isTemplate ? 142 : 160, height: isTemplate ? 156 : 176 }
  return { width: isTemplate ? 126 : 132, height: 132 }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
