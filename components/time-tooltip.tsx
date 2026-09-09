import { Moon, Sun } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap"

export function TimeTooltip() {
  const [time, setTime] = useState<{ hours: number; minutes: number; label: string } | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef({ value: 0 })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime({ hours: now.getHours(), minutes: now.getMinutes(), label: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
    }
    const frame = requestAnimationFrame(updateTime)
    const timer = setInterval(updateTime, 60000)
    return () => { cancelAnimationFrame(frame); clearInterval(timer) }
  }, [])

  const hours = time?.hours ?? 12
  const minutes = time?.minutes ?? 0
  const isDay = hours >= 6 && hours < 18

  let targetProgress = 0
  if (isDay) {
    targetProgress = ((hours - 6) * 60 + minutes) / (12 * 60)
  } else {
    let adjustedHour = hours
    if (hours < 6) adjustedHour += 24
    targetProgress = ((adjustedHour - 18) * 60 + minutes) / (12 * 60)
  }

  useLayoutEffect(() => {
    if (!tooltipRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tooltipRef.current,
        { autoAlpha: 0, y: -10, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
      )
    }, tooltipRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!bodyRef.current) return

    const bodyElement = bodyRef.current

    const updatePosition = () => {
      const angle = Math.PI - progressRef.current.value * Math.PI
      const x = 80 + 60 * Math.cos(angle) - 12
      const y = 80 - 60 * Math.sin(angle) - 12
      gsap.set(bodyElement, { x, y })
    }

    updatePosition()

    const tween = gsap.to(progressRef.current, {
      value: targetProgress,
      duration: 1.1,
      ease: "power2.out",
      onUpdate: updatePosition,
    })

    return () => {
      tween.kill()
    }
  }, [targetProgress])

  return (
    <div
      ref={tooltipRef}
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 bg-white/95 backdrop-blur-sm border border-border/80 p-4 rounded-xl shadow-[0_20px_60px_rgba(15,23,42,0.14)] min-w-[180px]"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-40 h-24 overflow-hidden">
          <div
            className={`absolute inset-0 opacity-20 rounded-t-full ${
              isDay ? "bg-gradient-to-b from-sky-400 to-sky-100" : "bg-gradient-to-b from-indigo-900 to-slate-900"
            }`}
          />

          <svg width="160" height="90" className="absolute bottom-0">
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="text-foreground/20"
            />
          </svg>

          <div
            ref={bodyRef}
            className={`absolute top-0 left-0 w-6 h-6 rounded-full flex items-center justify-center ${
              isDay
                ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                : "text-slate-200 drop-shadow-[0_0_8px_rgba(226,232,240,0.5)]"
            }`}
          >
            {isDay ? <Sun size={20} fill="currentColor" /> : <Moon size={20} fill="currentColor" />}
          </div>

          <div className="absolute bottom-0 w-full h-[1px] bg-border" />
        </div>

        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-foreground">
            {time?.label ?? "—:—"}
          </div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            {time ? (isDay ? "Daytime" : "Nighttime") : "Local time"}
          </div>
        </div>
      </div>
    </div>
  )
}
