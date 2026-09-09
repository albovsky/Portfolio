"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import Image from "next/image"
import { Pixelify_Sans } from "next/font/google"
import * as Dialog from "@radix-ui/react-dialog"
import { CatSprite } from "./cat-sprite"
import { CatRoomArt, CatRoomYarn } from "./cat-room-art"
import { CatZoomiesAnnouncement } from "./cat-zoomies-announcement"
import { CatTumble } from "./cat-tumble"
import { CatActionIcon } from "./cat-action-icon"
import { getPushaAge, subscribeToAgeChange, getServerAge, pushaStats, bonitaStats } from "./cat-profile-data"
import { gsap } from "@/lib/gsap"
import "./cat-room.css"
import "./cat-cozy-poses.css"

import { initial, getActivityLabel, locations, sendTo, advanceResidents, type Name } from "./cat-life"

const activityFont = Pixelify_Sans({ subsets: ["latin"], weight: "600", variable: "--font-cat-pixel", display: "swap" })

export function CatRoom() {
  const root = useRef<HTMLDivElement>(null)
  const pushaAge = useSyncExternalStore<number | null>(subscribeToAgeChange, getPushaAge, getServerAge)
  const [cats, setCats] = useState(initial)
  const [selected, setSelected] = useState<Name | null>(null)
  const [night, setNight] = useState(false)
  const [announcement, setAnnouncement] = useState("Two cats. One very happy home.")
  const zoomTimeline = useRef<ReturnType<typeof gsap.timeline> | null>(null)
  const zooming = useRef(false)
  const affectionCooldown = useRef(24)
  const zoomCooldown = useRef(45)
  const startZoomiesRef = useRef<() => void>(() => {})
  const isZooming = cats.some(cat => cat.activity === "zoomies" || cat.activity === "tumble")
  const isTumbling = cats.some(cat => cat.activity === "tumble")
  const isAffectionate = cats.some(cat => cat.activity === "snuggle" || (cat.activity === "walk" && cat.destination === "snuggle"))
  useEffect(() => { if (isAffectionate) affectionCooldown.current = 85 }, [isAffectionate])

  const updateDrawOrder = useCallback(() => {
    const residents = Array.from(root.current?.querySelectorAll<HTMLButtonElement>(".cat-resident") ?? [])
    // Sort by the current floor position, not the destination or sprite height.
    const depths = residents.map(element => ({ element, y: parseFloat(getComputedStyle(element).top) }))
    depths.sort((a,b) => a.y - b.y).forEach(({ element }, index) => {
      const order = String(3 + index)
      if (element.style.zIndex !== order) element.style.zIndex = order
    })
  }, [])
  useLayoutEffect(() => { updateDrawOrder() }, [cats, updateDrawOrder])
  useEffect(() => {
    const node = root.current
    if (!node) return
    const moving = new Set<EventTarget>()
    let frame: number | undefined
    const tick = () => {
      updateDrawOrder()
      frame = moving.size ? requestAnimationFrame(tick) : undefined
    }
    const track = (event: TransitionEvent) => {
      if (event.propertyName !== "top" || !(event.target instanceof HTMLElement) || !event.target.matches(".cat-resident")) return
      if (event.type === "transitionrun") {
        moving.add(event.target)
        if (frame === undefined) tick()
      } else {
        moving.delete(event.target)
        updateDrawOrder()
      }
    }
    node.addEventListener("transitionrun", track)
    node.addEventListener("transitionend", track)
    node.addEventListener("transitioncancel", track)
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame)
      node.removeEventListener("transitionrun", track)
      node.removeEventListener("transitionend", track)
      node.removeEventListener("transitioncancel", track)
    }
  }, [updateDrawOrder])

  const stopZoomies = useCallback(() => {
    if (!zooming.current || !root.current) return
    const node = root.current
    zoomTimeline.current?.kill()
    zoomTimeline.current = null
    zooming.current = false
    const positions = new Map(Array.from(node.querySelectorAll<HTMLButtonElement>(".cat-resident"), element => {
      const style = getComputedStyle(element)
      return [element.dataset.name, { x: Math.max(60, Math.min(580, parseFloat(style.left) / node.clientWidth * 640)), y: parseFloat(style.top) / node.clientHeight * 360 }]
    }))
    gsap.set(node.querySelectorAll(".cat-resident"), { clearProps: "transition" })
    setCats(current => current.map(cat => ({ ...cat, ...positions.get(cat.name), activity: "play", remaining: 8 })))
  }, [])

  const startZoomies = useCallback(() => {
    const node = root.current
    if (!node || zooming.current) return
    zoomCooldown.current = 65
    setNight(false)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCats(current => current.map(cat => sendTo(cat, "play")))
      setAnnouncement("A little burst of playful energy.")
      return
    }
    zooming.current = true
    const runners = Array.from(node.querySelectorAll<HTMLButtonElement>(".cat-resident"))
    // Capture in-progress walking positions before switching to the fast chase.
    const starts = new Map(runners.map(element => {
      const style = getComputedStyle(element)
      return [element.dataset.name, { x: parseFloat(style.left) / node.clientWidth * 640, y: parseFloat(style.top) / node.clientHeight * 360 }]
    }))
    runners.forEach(element => {
      const start = starts.get(element.dataset.name)!
      gsap.set(element, { transition: "none", left: `${start.x / 640 * 100}%`, top: `${start.y / 360 * 100}%` })
    })
    setCats(current => current.map(cat => ({ ...cat, ...starts.get(cat.name), activity: "zoomies", facing: 1 })))
    setAnnouncement("Zoomies time! Bonita takes the lead, Pusha gives chase.")
    const timeline = gsap.timeline({ onUpdate: updateDrawOrder, onComplete: () => {
      zooming.current = false
      zoomTimeline.current = null
      gsap.set(runners, { clearProps: "transition" })
      setCats(current => current.map(cat => {
        const [x,y] = locations.play[cat.name === "Pusha" ? 0 : 1]
        return { ...cat, x, y, activity: "play", remaining: 8, joy: Math.min(100,cat.joy + 12), rest: Math.max(20,cat.rest - 6) }
      }))
      setAnnouncement("A little tumble, a few happy paws. Still the best of friends.")
    } })
    zoomTimeline.current = timeline
    runners.forEach(element => {
      const name = element.dataset.name as Name
      const delay = name === "Bonita" ? 0 : .18
      const lane = name === "Bonita" ? 0 : -3
      const turn = (facing: 1 | -1) => setCats(current => current.map(cat => cat.name === name ? { ...cat, facing } : cat))
      const meetX = name === "Pusha" ? 320 : 340
      // Each offscreen turn lasts only a fraction of a second. No teleporting.
      timeline.to(element, { left: "112%", top: `${79 + lane}%`, duration: .9, ease: "power1.in" }, delay)
        .call(() => turn(-1), [], delay + .96)
        .to(element, { left: "-12%", top: `${83 + lane}%`, duration: 1.35, ease: "none" }, delay + .96)
        .call(() => turn(1), [], delay + 2.37)
        .to(element, { left: "112%", top: `${76 + lane}%`, duration: 1.2, ease: "none" }, delay + 2.37)
        .call(() => turn(-1), [], delay + 3.63)
        .to(element, { left: "-12%", top: `${80 + lane}%`, duration: 1.15, ease: "none" }, delay + 3.63)
        .call(() => turn(1), [], delay + 4.84)
        .to(element, { left: `${meetX / 640 * 100}%`, top: `${299 / 360 * 100}%`, duration: .8, ease: "power2.out" }, delay + 4.84)
    })
    // Both cats meet on the rug, play-wrestle, then emerge on their own sides.
    timeline.call(() => {
      setCats(current => current.map(cat => ({ ...cat, activity: "tumble", x: cat.name === "Pusha" ? 320 : 340, y: 299 })))
      setAnnouncement("Pusha and Bonita tumble together in a fluffy cloud. Just playing!")
    }, [], 5.84)
    runners.forEach(element => {
      const [x,y] = locations.play[element.dataset.name === "Pusha" ? 0 : 1]
      timeline.to(element, { left: `${x / 640 * 100}%`, top: `${y / 360 * 100}%`, duration: .5, ease: "power2.out" }, 8.24)
    })
  }, [updateDrawOrder])
  useEffect(() => { startZoomiesRef.current = startZoomies }, [startZoomies])
  useEffect(() => () => { zoomTimeline.current?.kill() }, [])
  useEffect(() => {
    const node = root.current
    if (!node) return
    let visible = false
    let timer: ReturnType<typeof setInterval> | undefined
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      const paused = !visible || document.hidden
      node.dataset.paused = String(paused || reduced.matches)
      if (reduced.matches) stopZoomies()
      else zoomTimeline.current?.paused(paused)
      clearInterval(timer)
      if (!paused) timer = setInterval(() => {
        if (zooming.current) return
        zoomCooldown.current--
        affectionCooldown.current--
        if (zoomCooldown.current <= 0 && !night && !selected && !isAffectionate && !reduced.matches) startZoomiesRef.current()
        else {
          const socialDue = affectionCooldown.current <= 0 && !selected
          setCats(current => advanceResidents(current, socialDue, night))
        }
      }, 1000)
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(node)
    document.addEventListener("visibilitychange", update)
    reduced.addEventListener("change", update)
    return () => { clearInterval(timer); observer.disconnect(); document.removeEventListener("visibilitychange", update); reduced.removeEventListener("change", update) }
  }, [night, selected, isAffectionate, stopZoomies])
  const interact = (action: "food" | "play" | "sleep") => {
    stopZoomies()
    zoomCooldown.current = 45
    affectionCooldown.current = 24
    if (action === "sleep" && night) {
      setNight(false)
      setCats(current => current.map(cat => sendTo(cat, "watch")))
      setAnnouncement("Good morning, little ones. A new view from the window.")
      return
    }
    const destination = action === "food" ? "eat" : action
    setNight(action === "sleep")
    setCats(current => current.map(cat => sendTo(cat, destination)))
    setAnnouncement(action === "food" ? "Fish for Pusha. Chicken for Bonita." : action === "play" ? "A little yarn, a lot of excitement." : "Lights low. Time for a cozy nap.")
  }
  return <div className="cat-room" ref={root} data-night={night} data-paused="true" aria-label="Pusha and Bonita’s interactive pixel home">
    <CatRoomArt />
    <CatRoomYarn />
    {isZooming && <CatZoomiesAnnouncement />}
    {isTumbling && <CatTumble />}
    <div className="cat-room-evening" aria-hidden="true" />
    <header className="cat-room-header" aria-hidden={selected !== null}><h2><Image src="/cats/meet-my-cats.png" alt="Meet my cats" width={1536} height={1024} sizes="(max-width: 699px) 32vw, 240px" className="cat-room-title-art" /></h2></header>
    {cats.map(cat => <Dialog.Root key={cat.name} modal={false} open={selected === cat.name} onOpenChange={open => { if (open) stopZoomies(); setSelected(open ? cat.name : null) }}>
      <Dialog.Trigger asChild>
        <button className="cat-resident" disabled={selected !== null} aria-hidden={selected !== null} data-name={cat.name} data-activity={cat.activity} aria-label={`Meet ${cat.name} — ${getActivityLabel(cat).toLowerCase()}`} style={{ left: `${cat.x / 640 * 100}%`, top: `${cat.y / 360 * 100}%`, "--cat-step": cat.name === "Pusha" ? "0s" : "-.2s" } as CSSProperties}>
          <span className="cat-resident-art"><CatSprite name={cat.name} activity={cat.activity} facing={cat.facing} /></span>
          <span className="cat-name-tag">{cat.name}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Content className={`cat-profile ${activityFont.variable}`} data-name={cat.name}>
        <div className="cat-profile-portrait" data-name={cat.name}>
          <div className="cat-profile-sprite"><CatSprite name={cat.name} activity={cat.activity} facing={cat.facing} /></div>
          <span>{getActivityLabel(cat)}</span>
        </div>
        <div className="cat-profile-details">
          <Dialog.Close className="cat-profile-close" aria-label="Close cat profile">
            <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges"><path d="M3 3h2v2h2v2h2V5h2V3h2v2h-2v2H9v2h2v2h2v2h-2v-2H9V9H7v2H5v2H3v-2h2V9h2V7H5V5H3Z" fill="currentColor" /></svg>
          </Dialog.Close>
          <div className="cat-profile-heading">
            <span className="cat-profile-breed">EXOTIC SHORTHAIR</span>
            <Dialog.Title>{cat.name}</Dialog.Title>
          </div>
          <Dialog.Description>{cat.name === "Pusha" ? `${pushaAge === null ? "Born January 23, 2022." : `Pusha is ${pushaAge} ${pushaAge === 1 ? "year" : "years"} old.`} Built for comfort, naps and silently judging everyone in the room.` : "The smaller, orange one. Round cheeks, tiny ears."}</Dialog.Description>
          <div className="cat-personality" data-name={cat.name} aria-label={`${cat.name}’s personality stats`}>
            {(cat.name === "Pusha" ? pushaStats : bonitaStats).map(({label,value,rating}) => <div className="cat-personality-row" key={label}>
              <span>{label}</span>
              <span className="cat-personality-bar" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={10} aria-valuenow={value} aria-valuetext={rating === "MAX" ? "Maximum" : `${value} out of 10`}>
                {Array.from({length:10},(_,index)=><i key={index} data-filled={index < value} />)}
              </span>
              <strong aria-hidden="true">{rating}</strong>
            </div>)}
            <p className="cat-passive-ability"><strong>Passive ability:</strong> {cat.name === "Pusha" ? "+20% sleep efficiency on soft surfaces." : "Small size grants +20% chaos and +40% escape chance."}</p>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>)}
    <footer className="cat-room-footer" inert={selected !== null}><div className="cat-room-controls">
      <button onClick={() => interact("food")} aria-label="Feed both cats" title="Feed"><CatActionIcon type="food" /></button>
      <button onClick={() => interact("play")} aria-label="Play with both cats" title="Play"><CatActionIcon type="play" /></button>
      <button onClick={startZoomies} disabled={isZooming} aria-label="Start cat zoomies" title="Zoomies"><CatActionIcon type="zoomies" /></button>
      <button onClick={() => interact("sleep")} aria-label={night ? "Wake both cats" : "Settle both cats for a nap"} aria-pressed={night} title={night ? "Wake" : "Nap"}><CatActionIcon type="sleep" awake={night} /></button>
    </div></footer>
    <span className="sr-only" role="status">{announcement}</span>
  </div>
}
