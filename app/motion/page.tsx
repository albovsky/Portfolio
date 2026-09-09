"use client"

import { useLayoutEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

const projects = [
  { id: 1, title: "Kinetic Type", client: "Personal" },
  { id: 2, title: "Brand Reveal", client: "TechCorp" },
  { id: 3, title: "UI Interactions", client: "AppStudio" },
  { id: 4, title: "3D Abstract", client: "ArtGallery" },
  { id: 5, title: "Logo Animation", client: "StartupX" },
]

export default function MotionPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 50 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }
        )
      }

      if (gridRef.current) {
        gsap.fromTo(
          "[data-motion-card]",
          { autoAlpha: 0, scale: 0.95 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
        MOTION
      </h1>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
        {projects.map((project) => (
          <div
            key={project.id}
            data-motion-card
            className="aspect-video bg-card relative group overflow-hidden rounded-none border border-border hover:border-primary/40 transition-colors shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:scale-150 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-foreground border-b-[6px] border-b-transparent ml-1 group-hover:border-l-primary-foreground transition-colors" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
              <p className="font-mono text-xs text-muted-foreground">{project.client}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
