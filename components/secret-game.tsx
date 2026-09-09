"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import confetti from "canvas-confetti"
import { gsap } from "@/lib/gsap"

const prizes = [
  "3 likes on Instagram",
  "A high five",
  "My student debt",
  "Folder of my fav memes",
  "A compliment",
  "Mystery box",
  "Photo of my cat (signed)",
  "Lifetime supply of air",
  "Free project",
  "Introduction to my parents",
  "Nothing",
  "Firm handshake",
  "10000$",
  "Moral support",
]

const colors = ["#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#073B4C", "#9D4EDD", "#FF9F1C"]
const SLICE_ANGLE = 360 / prizes.length

export function SecretGame({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [hasSpun, setHasSpun] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const wheelElement = wheelRef.current
    const frame = window.requestAnimationFrame(() => {
      setIsSpinning(false)
      setHasSpun(false)
      setResult(null)
    })

    if (wheelElement) {
      gsap.killTweensOf(wheelElement)
      gsap.set(wheelElement, { rotate: 0 })
      gsap.to(wheelElement, {
        rotate: 360,
        duration: 60,
        ease: "none",
        repeat: -1,
      })
    }

    return () => {
      window.cancelAnimationFrame(frame)
      if (wheelElement) {
        gsap.killTweensOf(wheelElement)
      }
    }
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen || !overlayRef.current || !modalRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
      gsap.fromTo(
        modalRef.current,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power3.out" }
      )
    })

    return () => ctx.revert()
  }, [isOpen])

  const spinWheel = () => {
    if (isSpinning || hasSpun || !wheelRef.current) return

    setIsSpinning(true)
    setResult(null)
    setHasSpun(true)
    gsap.killTweensOf(wheelRef.current)

    const targetIndex = prizes.indexOf("Nothing")
    const sliceCenterAngle = targetIndex * SLICE_ANGLE + SLICE_ANGLE / 2
    const fullSpins = 360 * (5 + Math.floor(Math.random() * 5))
    const randomOffset = (Math.random() - 0.5) * (SLICE_ANGLE * 0.8)
    const alignmentRotation = 90 - sliceCenterAngle + randomOffset
    const finalRotation = 3600 + fullSpins + alignmentRotation

    gsap.to(wheelRef.current, {
      rotate: finalRotation,
      duration: 5,
      ease: "power3.inOut",
      onComplete: () => {
        setIsSpinning(false)
        setResult("Nothing")

        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval = window.setInterval(() => {
          const timeLeft = animationEnd - Date.now()
          if (timeLeft <= 0) {
            window.clearInterval(interval)
            return
          }

          const particleCount = 50 * (timeLeft / duration)
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        }, 250)
      },
    })
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
      <div
        ref={modalRef}
        onClick={(event) => event.stopPropagation()}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-12 max-w-4xl w-full relative shadow-2xl overflow-hidden flex flex-col items-center"
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-50 bg-zinc-900/50 p-2 rounded-full"
        >
          <X />
        </button>

        <div className="text-center mb-12 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-sm tracking-tighter">
            SECRET UNLOCKED!
          </h2>
          <p className="text-zinc-400 text-lg font-medium">
            You weren&apos;t supposed to find this. <br />
            <span className="text-zinc-500 text-sm uppercase tracking-widest mt-2 block">
              Spin at your own risk
            </span>
          </p>
        </div>

        <div className="relative w-full h-[400px] mb-12 overflow-hidden flex items-center justify-start py-4">
          <div className="absolute top-1/2 left-[535px] -translate-y-1/2 z-40 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25L40 0V50L0 25Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2" />
              <path d="M5 25L35 5V45L5 25Z" fill="#DC2626" />
            </svg>
          </div>

          <div className="relative w-[800px] h-[800px] -ml-[250px] shrink-0">
            <div className="absolute inset-[-20px] rounded-full border-[20px] border-zinc-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-0" />

            <div
              ref={wheelRef}
              className="w-full h-full rounded-full border-8 border-zinc-900 relative overflow-hidden bg-zinc-900 shadow-2xl"
            >
              {prizes.map((_, index) => (
                <div
                  key={`bg-real-${index}`}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    transform: `rotate(${index * SLICE_ANGLE}deg)`,
                    background: `conic-gradient(${colors[index % colors.length]} 0deg, ${colors[index % colors.length]} ${SLICE_ANGLE}deg, transparent ${SLICE_ANGLE}deg)`,
                  }}
                />
              ))}

              {prizes.map((_, index) => (
                <div
                  key={`line-${index}`}
                  className="absolute top-0 left-1/2 h-1/2 w-[2px] bg-black/20 origin-bottom z-10"
                  style={{ transform: `translateX(-50%) rotate(${index * SLICE_ANGLE}deg)` }}
                />
              ))}

              {prizes.map((prize, index) => (
                <div
                  key={`text-${index}`}
                  className="absolute top-0 left-1/2 w-16 -ml-8 h-1/2 origin-bottom flex justify-center pt-8 pb-12 z-20"
                  style={{ transform: `rotate(${index * SLICE_ANGLE + SLICE_ANGLE / 2}deg)` }}
                >
                  <span
                    className="text-lg font-black uppercase font-mono tracking-wider text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] max-h-full leading-tight"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
                  >
                    {prize}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-zinc-900 rounded-full z-30 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-zinc-800 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center">
                <span className="text-2xl">🎲</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-6 relative z-10 w-full max-w-sm flex flex-col items-center">
          <button
            onClick={spinWheel}
            disabled={isSpinning || hasSpun}
            className="group relative w-64 h-24 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5),0_0_20px_rgba(234,179,8,0.5)] border-4 border-yellow-600">
              <svg className="absolute inset-0 w-full h-full rounded-full overflow-visible" viewBox="0 0 256 96">
                <rect
                  x="4"
                  y="4"
                  width="248"
                  height="88"
                  rx="44"
                  fill="none"
                  stroke="#FEF08A"
                  strokeWidth="6"
                  strokeDasharray="0 24"
                  strokeLinecap="round"
                  className="animate-[dash_1s_linear_infinite]"
                />
                <rect
                  x="4"
                  y="4"
                  width="248"
                  height="88"
                  rx="44"
                  fill="none"
                  stroke="#FEF08A"
                  strokeWidth="6"
                  strokeDasharray="0 24"
                  strokeLinecap="round"
                  className="animate-[dash_1s_linear_infinite] blur-[2px] opacity-75"
                />
              </svg>
            </div>

            <div className="absolute inset-3 bg-gradient-to-b from-red-900 to-red-950 rounded-full shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)] flex items-center justify-center border-2 border-red-800">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-widest uppercase">
                {isSpinning ? "SPINNING" : hasSpun ? "DONE" : "SPIN"}
              </span>
            </div>

            <div className="absolute inset-x-8 top-4 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none" />
          </button>

          <style jsx>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -24;
              }
            }
          `}</style>
        </div>

        {result ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
            <div className="text-center p-8 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl transform rotate-[-2deg]">
              <div className="text-sm text-yellow-500 font-bold uppercase tracking-widest mb-2 drop-shadow-md">
                You Won
              </div>
              <div className="text-5xl font-black text-white mb-4 drop-shadow-lg tracking-tighter">
                {result}
              </div>
              <div className="text-sm text-zinc-400 font-medium">(Better luck next time!)</div>

              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-sm font-bold transition-colors border border-zinc-600"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
