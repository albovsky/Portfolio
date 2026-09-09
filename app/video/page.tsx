"use client"

import { useLayoutEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

const videos = [
  { id: 1, title: "The Awakening", duration: "02:14" },
  { id: 2, title: "Urban Rhythm", duration: "01:30" },
  { id: 3, title: "Lost in Time", duration: "03:45" },
  { id: 4, title: "Digital Dreams", duration: "01:15" },
]

export default function VideoPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 50 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }
        )
      }

      if (listRef.current) {
        gsap.fromTo(
          "[data-video-row]",
          { autoAlpha: 0, x: -50 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top bottom-=120",
              once: true,
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12">
      <h1
        ref={titleRef}
        className="text-6xl md:text-9xl font-bold tracking-tighter mb-12 text-transparent stroke-text hover:text-primary transition-colors duration-500 cursor-default"
        style={{ WebkitTextStroke: "1px var(--foreground)" }}
      >
        VIDEO
      </h1>

      <div ref={listRef} className="flex flex-col gap-0 pb-24">
        {videos.map((video) => (
          <div
            key={video.id}
            data-video-row
            className="group border-t border-border py-12 flex justify-between items-center cursor-pointer hover:bg-card transition-colors px-4"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter group-hover:translate-x-4 transition-transform duration-300">
              {video.title}
            </h2>
            <span className="font-mono text-sm text-muted-foreground group-hover:text-primary transition-colors">
              {video.duration}
            </span>
          </div>
        ))}
        <div className="border-t border-border" />
      </div>
    </div>
  )
}
