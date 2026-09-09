"use client"

import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, ArrowUpRight } from "lucide-react"

export type CardSize = "small" | "wide" | "tall" | "feature"
export function BentoGrid({ children, gridRef }: { children: ReactNode; gridRef: RefObject<HTMLDivElement | null> }) {
  const [debug, setDebug] = useState(false)
  return <>
    {process.env.NODE_ENV === "development" && <button className="bento-action grid-toggle" aria-pressed={debug} onClick={() => setDebug(!debug)}>Grid guides {debug ? "on" : "off"}</button>}
    <div ref={gridRef} className="bento-grid" data-guides={debug}>{children}</div>
  </>
}
export function BentoCard({ children, id, size, label }: { children: ReactNode; id: string; size: CardSize; label: string }) {
  const ref = useRef<HTMLElement>(null)
  const [overflow, setOverflow] = useState(false)
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || !ref.current) return
    const node = ref.current
    const check = () => setOverflow(node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1)
    const observer = new ResizeObserver(check)
    observer.observe(node)
    for (const child of node.children) observer.observe(child)
    const mutations = new MutationObserver(check)
    mutations.observe(node, { childList: true, subtree: true, characterData: true })
    return () => { observer.disconnect(); mutations.disconnect() }
  }, [])
  return <article ref={ref} id={id} aria-label={label} data-bento-card data-size={size} data-overflow={overflow} className="bento-card group">
    {children}<span className="bento-guide-label" aria-hidden="true">{id} · {size}{overflow ? " · OVERFLOW" : ""}</span>
  </article>
}
export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bento-content ${className}`}>{children}</div>
}
export function CardLabel({ children }: { children: ReactNode }) { return <p className="bento-label">{children}</p> }
export function CardDetails({ title, description, trigger, children }: { title: string; description: string; trigger: string; children: ReactNode }) {
  return <Dialog.Root>
    <Dialog.Trigger className="bento-action">{trigger}<ArrowUpRight size={16} aria-hidden="true" /></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bento-dialog-overlay" />
      <Dialog.Content className="bento-dialog">
        <Dialog.Title className="bento-title">{title}</Dialog.Title>
        <Dialog.Description className="bento-copy">{description}</Dialog.Description>
        <div className="bento-detail-body">{children}</div>
        <Dialog.Close className="bento-action dialog-close" aria-label="Close details"><X size={20} /></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
