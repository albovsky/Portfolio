"use client"

import { useLayoutEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "@/lib/gsap"

// ----------------------------------------------------------------------
// DATA: APPLICATIONS
// ----------------------------------------------------------------------
const applications = [
  { name: "Raycast", icon: "🔴", image: "https://github.com/raycast.png", color: "bg-red-500", description: "Makes my Mac feel like it has superpowers" },
  { name: "VSCode", icon: "📝", image: "/logos/vscode.png", color: "bg-blue-600", description: "Just a simple code editor that somehow does everything" },
  { name: "Notion", icon: "N", image: "/logos/notion.png", color: "", description: "I like to think I qualify as a Notion ninja" },
  { name: "Apple Music", icon: "🎵", image: "/logos/apple-music.png", color: "bg-red-500", description: "My main soundtrack provider" },
  { name: "Things 3", icon: "✅", image: "/logos/things-3.png", color: "bg-blue-400", description: "Hands down the best task manager I have used" },
  { name: "Spark", icon: "✉️", image: "/logos/spark.png", color: "bg-blue-500", description: "My fav email client. Team inbox zero 🫡" },
]

// ----------------------------------------------------------------------
// DATA: EDITORS
// ----------------------------------------------------------------------
const editors = [
  { name: "DaVinci Resolve", icon: "🎬", image: "/logos/davinci-resolve.jpg", color: "bg-zinc-800", description: "Moved over from Final Cut and still pretending Premiere does not exist" },
  { name: "After Effects", icon: "🎞️", image: "/logos/after-effects.png", color: "bg-purple-700", description: "The motion graphics industry standard" },
  { name: "Spine", icon: "💫", image: "/logos/spine.png", color: "white", description: "The go-to standard for 2D game animation" },
  { name: "Figma", icon: "🎨", image: "https://github.com/figma.png", color: "bg-purple-500", description: "My place for UI and UX tinkering. Still remember Adobe XD and Sketch" },
  { name: "Adobe Photoshop", icon: "🎨", image: "/logos/photoshop.png", color: "bg-blue-700", description: "Photo editing powerhouse I reach for on commercial work" },
  { name: "Affinity", icon: "🎨", image: "/logos/affinity.png", color: "bg-indigo-600", description: "Trying to move personal projects here because it is fast and very Mac native" },
  { name: "Lightroom", icon: "📷", image: "/logos/lightroom.png", color: "bg-blue-600", description: "Cool Instagram photos will not edit themselves, right?" },
  { name: "Photomator", icon: "📸", image: "/logos/photomator.png", color: "bg-orange-500", description: "Slowly cheating on Lightroom with Photomator" },
  { name: "Cinema4D", icon: "🎬", image: "/logos/cinema4d.jpg", color: "bg-blue-600", description: "The industry standard, but Maxon does everything to make me switch" },
  { name: "Blender", icon: "🎬", image: "/logos/blender.png", color: "bg-blue-600", description: "Slowly learning Blender since it is free and open source" },
]

// ----------------------------------------------------------------------
// DATA: AI TOOLS
// ----------------------------------------------------------------------
const aiTools = [
  { name: "ChatGPT Plus", icon: "🤖", color: "bg-orange-600", image: "/logos/chatgpt.png", description: "My daily AI co-pilot plus Sora experiments and image generation" },
  { name: "Claude Code", icon: "🤖", color: "bg-orange-600", image: "/logos/claude.jpg", description: "My favorite AI coding assistant" },
  { name: "Antigravity", icon: "🚀", color: "bg-purple-600", image: "/logos/antigravity.jpg", description: "A surprisingly great IDE that I usually pair with Gemini" },
  { name: "Gemini Pro", icon: "✨", color: "white", image: "/logos/gemini.png", description: "Gemini 3 is great at coding and Nano Banano is awesome for images" },
]

// ----------------------------------------------------------------------
// DATA: HARDWARE
// ----------------------------------------------------------------------
const hardware = [
  {
    title: "MacBook Pro 14 2021",
    description: "M1 Pro, 10-core CPU, 16-core GPU, 16-core Neural Engine, 32GB unified memory, 1TB SSD storage. I prefer 14 for mobility, and I use monitor when work from home.",
    link: "#",
    image: "/hardware/macbook-pro.png",
    color: "bg-blue-500"
  },
  {
    title: "Haworth Zody II",
    description: "Once you go high-end, you never go back. Fully adjustable, properly supportive, and insanely breathable. Pricey, but easily one of my best desk investments.",
    link: "#",
    image: "/hardware/chair.png",
    color: "bg-orange-500"
  },
  {
    title: "LG UltraWide 38WP85C-W",
    description: "Great 38 ultrawide that was my first dive into the format, and I love it for editing and multitasking. The only downsides are the clunky on-screen UI and the constant reminder that I should have gone 4K from the start.",
    link: "#",
    image: "/hardware/monitor.png",
    color: "bg-purple-500"
  },

  {
    title: "Autonomous SmartDesk DIY Standing Desk",
    description: "A standing desk frame in a white finish. Topped with the IKEA Karlby tabletop, the desk measures almost 9' wide, providing lots of space.",
    link: "#",
    color: "bg-zinc-400"
  },
  {
    title: "Wave DX Dynamic Microphone",
    description: "A dynamic mic that captures detail like a condenser without the noise, Wave DX is a remarkable feat of audio engineering.",
    link: "#",
    color: "bg-red-500"
  },
  {
    title: "Stream Deck +",
    description: "Iconic Stream Deck tech with customizable LCD keys, dials, and touch strip.",
    link: "#",
    color: "bg-purple-500"
  },
  {
    title: "Key Light MK.2",
    description: "Ultra-bright and dimmable. Space-saving and built to last. App-controlled and destined to evolve with you.",
    link: "#",
    color: "bg-amber-400"
  },
  {
    title: "HD60 X Capture Card",
    description: "HD60 X lets you capture PS5 or Xbox gameplay like a pro. Stream or record high resolution content for audiences on any platform.",
    link: "#",
    color: "bg-blue-600"
  },
]

export default function ToolboxPage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }
        )
      }

      if (pageRef.current) {
        const revealGroups = [
          { selector: "[data-tool-chip='applications']", stagger: 0.03 },
          { selector: "[data-tool-chip='editors']", stagger: 0.03 },
          { selector: "[data-tool-chip='ai']", stagger: 0.03 },
          { selector: "[data-hardware-card]", stagger: 0.08 },
        ]

        revealGroups.forEach(({ selector, stagger }) => {
          const elements = gsap.utils.toArray<HTMLElement>(selector, pageRef.current)
          if (elements.length === 0) return

          gsap.fromTo(
            elements,
            { autoAlpha: 0, y: 20, scale: 0.92 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger,
              ease: "power3.out",
              scrollTrigger: {
                trigger: elements[0],
                start: "top bottom-=120",
                once: true,
              },
            }
          )
        })
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { translate: 0 0px; }
          50% { translate: 0 -3px; }
        }
      `}</style>
      
      <div ref={pageRef} className="min-h-screen bg-background text-foreground pt-32 px-6 md:px-12 pb-24 overflow-x-hidden">
      {/* Header */}
      <div ref={headerRef} className="mb-24 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          Hardware && software
          <br />
          <span className="text-muted-foreground">I keep in my toolbox.</span>
        </h1>
      </div>

      {/* Section: Software */}
      <div className="mb-24 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-[1px] flex-1 bg-border" />
          <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Software</span>
          <div className="h-[1px] flex-1 bg-border" />
        </div>

        {/* Subsection: Everyday Tools */}
        <div className="mb-16">
          <h3 className="text-center text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8">Everyday Tools</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {applications.map((app, index) => (
              <div
                key={app.name}
                data-tool-chip="applications"
                style={{
                  rotate: `${(index % 2 === 0 ? -1 : 1) * (0.5 + (index % 5) * 0.2)}deg`,
                  animation: `float ${3 + (index % 3) * 0.5}s ease-in-out ${index * 0.2}s infinite`,
                }}
                className="group relative bg-card border-[3px] border-border/60 rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow outline-none ring-0"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs font-mono rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {app.description}
                </div>

                {/* Icon Container */}
                <div className={`w-10 h-10 rounded-full ${app.color} flex items-center justify-center text-lg text-white overflow-hidden shrink-0 pointer-events-none`}>
                  {app.image ? (
                    <Image width={40} height={40} sizes="40px"
                      src={app.image} 
                      alt={app.name} 
                      className="w-full h-full object-cover opacity-100 pointer-events-none select-none" 
                      style={{ transform: 'scale(1.02)' }}
                      draggable="false" 
                    />
                  ) : (
                    app.icon
                  )}
                </div>
                
                {/* Text */}
                <span className="font-mono font-medium text-foreground text-base tracking-normal">
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subsection: Editors */}
        <div className="mb-16">
          <h3 className="text-center text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8">Editors</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {editors.map((app, index) => (
              <div
                key={app.name}
                data-tool-chip="editors"
                style={{
                  rotate: `${(index % 2 === 0 ? -1 : 1) * (0.5 + (index % 5) * 0.2)}deg`,
                  animation: `float ${3 + (index % 3) * 0.5}s ease-in-out ${index * 0.2}s infinite`,
                }}
                className="group relative bg-card border-[3px] border-border/60 rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow outline-none ring-0"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs font-mono rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {app.description}
                </div>

                {/* Icon Container */}
                <div className={`w-10 h-10 rounded-full ${app.color} flex items-center justify-center text-lg text-white overflow-hidden shrink-0 pointer-events-none`}>
                  {app.image ? (
                    <Image width={40} height={40} sizes="40px"
                      src={app.image} 
                      alt={app.name} 
                      className="w-full h-full object-cover opacity-100 pointer-events-none select-none" 
                      style={{ transform: 'scale(1.02)' }}
                      draggable="false" 
                    />
                  ) : (
                    app.icon
                  )}
                </div>
                
                {/* Text */}
                <span className="font-mono font-medium text-foreground text-base tracking-normal">
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subsection: AI Tools */}
        <div>
          <h3 className="text-center text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8">AI Tools</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {aiTools.map((app, index) => (
              <div
                key={app.name}
                data-tool-chip="ai"
                style={{
                  rotate: `${(index % 2 === 0 ? -1 : 1) * (0.5 + (index % 5) * 0.2)}deg`,
                  animation: `float ${3 + (index % 3) * 0.5}s ease-in-out ${index * 0.2}s infinite`,
                }}
                className="group relative bg-card border-[3px] border-border/60 rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow outline-none ring-0"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs font-mono rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {app.description}
                </div>

                {/* Icon Container */}
                <div className={`w-10 h-10 rounded-full ${app.color} flex items-center justify-center text-lg text-white overflow-hidden shrink-0 pointer-events-none`}>
                  {app.image ? (
                    <Image width={40} height={40} sizes="40px"
                      src={app.image} 
                      alt={app.name} 
                      className="w-full h-full object-cover opacity-100 pointer-events-none select-none" 
                      style={{ transform: 'scale(1.02)' }}
                      draggable="false" 
                    />
                  ) : (
                    app.icon
                  )}
                </div>
                
                {/* Text */}
                <span className="font-mono font-medium text-foreground text-base tracking-normal">
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section: Hardware */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[1px] flex-1 bg-border" />
          <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Hardware</span>
          <div className="h-[1px] flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-20">
          {hardware.map((item) => (
            <div
              key={item.title}
              data-hardware-card
              className="group rounded-2xl flex flex-col justify-between gap-6 relative"
              style={{ paddingTop: item.image ? '10rem' : '2rem', paddingLeft: '2rem', paddingRight: '2rem', paddingBottom: '2rem' }}
            >
              {/* Background & Glow Container - Clipped */}
              <div className="absolute inset-0 rounded-2xl bg-secondary/30 border border-border/50 group-hover:bg-secondary/50 transition-colors duration-300 overflow-hidden z-0">
                {item.image && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[70%] h-48 -translate-y-1/2">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[60px] opacity-40 ${item.color}`} />
                  </div>
                )}
              </div>

              {/* Image - Unclipped */}
              {item.image && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[70%] -translate-y-1/2 z-10">
                  <Image width={480} height={288} sizes="(max-width: 767px) 70vw, 300px"
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-contain drop-shadow-2xl"
                  />
                </div>
              )}
              
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              <Link 
                href={item.link} 
                className="relative z-10 text-xs font-mono text-primary uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-[transform,opacity]"
              >
                Learn more <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
