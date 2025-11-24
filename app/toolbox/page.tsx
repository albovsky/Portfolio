"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

// ----------------------------------------------------------------------
// DATA: APPLICATIONS
// ----------------------------------------------------------------------
const applications = [
  { name: "Raycast", icon: "🔴", image: "https://github.com/raycast.png", color: "bg-red-500" },
  { name: "VSCode", icon: "📝", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnoirCtiJhhN8Tvo0FJRRd4CInsOXkRX9EbA&s", color: "bg-blue-600" },
  { name: "Notion", icon: "N", image: "/logos/notion.png", color: "" },
  { name: "Apple Music", icon: "🎵", image: "/logos/apple-music.png", color: "bg-red-500" },
  { name: "Figma", icon: "🎨", image: "https://github.com/figma.png", color: "bg-purple-500" },
  { name: "Things 3", icon: "✅", image: "/logos/things-3.png", color: "bg-blue-400" },
]

// ----------------------------------------------------------------------
// DATA: HARDWARE
// ----------------------------------------------------------------------
const hardware = [
  {
    title: "MacBook Pro (16 inch), 2021",
    description: "10-core CPU, 16-core GPU, 16-core Neural Engine, 32GB unified memory, 2TB SSD storage",
    link: "#"
  },
  {
    title: "Zoom65 Mechanical Keyboard",
    description: "With a navy blue finish, this 65% custom mechanical keyboard has Oil King linear switches topped with GMK Hennessey keycaps",
    link: "#"
  },
  {
    title: "GIGABYTE M27Q-X 27 Monitor",
    description: "A 240Hz 1440P KVM monitor that I use for work and gaming.",
    link: "#"
  },
  {
    title: "Autonomous ErgoChair 2",
    description: "A fully adjustable, completely supportive, and super breathable desk chair in a black and white finish. Expensive, but an investment that has been worth it.",
    link: "#"
  },
  {
    title: "Autonomous SmartDesk DIY Standing Desk",
    description: "A standing desk frame in a white finish. Topped with the IKEA Karlby tabletop, the desk measures almost 9' wide, providing lots of space.",
    link: "#"
  },
  {
    title: "Wave DX Dynamic Microphone",
    description: "A dynamic mic that captures detail like a condenser without the noise, Wave DX is a remarkable feat of audio engineering.",
    link: "#"
  },
  {
    title: "Stream Deck +",
    description: "Iconic Stream Deck tech with customizable LCD keys, dials, and touch strip.",
    link: "#"
  },
  {
    title: "Key Light MK.2",
    description: "Ultra-bright and dimmable. Space-saving and built to last. App-controlled and destined to evolve with you.",
    link: "#"
  },
  {
    title: "HD60 X Capture Card",
    description: "HD60 X lets you capture PS5 or Xbox gameplay like a pro. Stream or record high resolution content for audiences on any platform.",
    link: "#"
  },
]

export default function ToolboxPage() {
  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { translate: 0 0px; }
          50% { translate: 0 -3px; }
        }
      `}</style>
      
      <div className="min-h-screen bg-background text-foreground pt-32 px-6 md:px-12 pb-24 overflow-x-hidden select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          Hardware && software
          <br />
          <span className="text-muted-foreground">I keep in my toolbox.</span>
        </h1>
      </motion.div>

      {/* Section: Applications */}
      <div className="mb-24 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-[1px] flex-1 bg-border" />
          <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Applications</span>
          <div className="h-[1px] flex-1 bg-border" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 select-none">
          {applications.map((app, index) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03, type: "spring", stiffness: 200, damping: 15 }}
              
              style={{
                rotate: `${(index % 2 === 0 ? -1 : 1) * (0.5 + (index % 5) * 0.2)}deg`,
                animation: `float ${3 + (index % 3) * 0.5}s ease-in-out ${index * 0.2}s infinite`,
              }}
              
              drag
              dragSnapToOrigin
              dragElastic={0.1}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
              whileHover={{ cursor: "grab", zIndex: 50 }}
              whileTap={{ cursor: "grabbing", zIndex: 50 }}
              
              className="group relative bg-white dark:bg-zinc-900 border-[3px] border-zinc-300/30 dark:border-zinc-700/30 rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow outline-none ring-0"
            >
              {/* Icon Container */}
              <div className={`w-10 h-10 rounded-full ${app.color} flex items-center justify-center text-lg text-white overflow-hidden shrink-0 pointer-events-none`}>
                {app.image ? (
                  <img 
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
              <span className="font-mono font-medium text-zinc-800 dark:text-zinc-100 text-base tracking-normal">
                {app.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section: Hardware */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[1px] flex-1 bg-border" />
          <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Hardware</span>
          <div className="h-[1px] flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hardware.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-secondary/30 border border-border/50 p-8 rounded-2xl flex flex-col justify-between gap-6 hover:bg-secondary/50 transition-colors duration-300"
            >
              <div>
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              <Link 
                href={item.link} 
                className="text-xs font-mono text-primary uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
              >
                Learn more <ArrowUpRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
