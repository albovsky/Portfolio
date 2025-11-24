"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { TimeTooltip } from "@/components/time-tooltip"

export default function Home() {
  const [dayPart, setDayPart] = useState("day")
  const [roleIndex, setRoleIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isNameHovering, setIsNameHovering] = useState(false)
  const [isTimeHovering, setIsTimeHovering] = useState(false)
  const [displayedName, setDisplayedName] = useState("")
  const roles = ["📸 Photographer", "🎥 Videographer", "🎬 Motion Designer", "✨ Digital Creator", "🎨 Designer", "🛠️ Indie Hacker", "🚁 Drone Pilot", "📺 YouTuber"]
  const fullName = "Ukrainian: Альбовський Гліб Михайлович"

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setDayPart("morning")
    else if (hour < 18) setDayPart("afternoon")
    else setDayPart("evening")

    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isNameHovering) {
      setDisplayedName("")
      let currentIndex = 0
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullName.length) {
          setDisplayedName(fullName.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typeInterval)
        }
      }, 50)
      return () => clearInterval(typeInterval)
    } else {
      setDisplayedName("")
    }
  }, [isNameHovering])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight text-white">
            <span className="mix-blend-difference">Hi! </span>
            <span className="inline-block animate-wave origin-[70%_70%] mix-blend-difference">👋</span>
            <br />
            <span className="mix-blend-difference">Hope your </span>
            <motion.span
              className="relative inline-block cursor-pointer group mix-blend-difference"
              onMouseEnter={() => setIsTimeHovering(true)}
              onMouseLeave={() => setIsTimeHovering(false)}
            >
              <span className="text-primary">{dayPart}</span>
              <AnimatePresence>
                {isTimeHovering && <TimeTooltip />}
              </AnimatePresence>
            </motion.span>
            <span className="mix-blend-difference"> is going well.</span>
            <br />
            <span className="mix-blend-difference">My name is </span>
            <motion.span 
              className="relative inline-block cursor-pointer group mix-blend-difference"
              onMouseEnter={() => setIsNameHovering(true)}
              onMouseLeave={() => setIsNameHovering(false)}
            >
              Glib
              <svg 
                className="absolute w-full h-3 -bottom-1 left-0 text-primary pointer-events-none" 
                viewBox="0 0 100 10" 
                preserveAspectRatio="none"
              >
                <motion.path 
                  d="M0 5 Q 25 10 50 5 T 100 5"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />
              </svg>
              <AnimatePresence>
                {isNameHovering && (
                  <motion.div
                    layout="position"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ 
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                      layout: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 bg-zinc-900/95 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg shadow-2xl whitespace-nowrap text-left font-normal tracking-normal leading-normal text-base"
                  >
                    <span className="text-white/80 font-mono">{displayedName}<span className="animate-pulse">|</span></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.span>
            <span className="mix-blend-difference"> and I am</span>
            <br />
            <motion.span 
              layout
              transition={{ duration: 0.7, ease: [0.32, 0.725, 0.06, 0.965] }}
              className="inline-flex items-center text-primary relative cursor-pointer group h-[1.2em] align-middle"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={roles[roleIndex]}
                  layout="position"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, ease: [0.32, 0.725, 0.06, 0.965] }}
                  className="block mix-blend-difference whitespace-nowrap"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
              
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    layout="position"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                      layout: { duration: 0.7, ease: [0.32, 0.725, 0.06, 0.965] }
                    }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-8 z-50 bg-zinc-900/95 backdrop-blur-sm border border-white/10 p-4 rounded-xl shadow-2xl min-w-[320px] hidden lg:block text-left font-normal tracking-normal leading-normal"
                  >
                    <div className="flex flex-col gap-3">
                      {roles.map((role, index) => (
                        <motion.div 
                          key={role}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`text-lg font-mono transition-colors flex items-center gap-3 ${
                            index === roleIndex ? "text-primary font-bold" : "text-white/60 hover:text-white"
                          }`}
                        >
                          <span className="text-xl">{role.split(" ")[0]}</span>
                          <span className="tracking-tight">{role.split(" ").slice(1).join(" ")}</span>
                        </motion.div>
                      ))}
                      <div className="mt-2 pt-3 border-t border-white/10 text-xs font-mono text-white/40 italic font-normal tracking-normal">
                        (well, I guess I'm a jack of all trades)
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.span>
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 flex items-center gap-2 text-lg md:text-xl text-muted-foreground"
          >
            <span>Currently Technical Designer at</span>
            <span className="text-foreground font-bold flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center overflow-hidden">
                 <img src="/logos/MahiGaming_Logo-White.png" alt="MahiGaming" className="w-full h-full object-contain p-1" />
              </div>
              MahiGaming
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-6 md:left-12 max-w-md"
        >
          <div className="flex gap-4">
             <Link href="/photo" className="group flex items-center gap-2 text-primary hover:text-white transition-colors font-mono uppercase text-sm">
                View Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </motion.div>

        {/* Abstract Background Element */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 right-0 -translate-y-1/2 w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none"
        />
      </section>

      {/* Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 h-screen">
        {[
          { title: "Photography", href: "/photo", color: "hover:bg-pink-500/10" },
          { title: "Videography", href: "/video", color: "hover:bg-cyan-500/10" },
          { title: "Motion", href: "/motion", color: "hover:bg-yellow-500/10" },
        ].map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className={`group relative flex items-center justify-center border-t md:border-t-0 md:border-l border-white/10 transition-colors duration-500 ${item.color}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter z-10 group-hover:scale-110 transition-transform duration-500"
            >
              {item.title}
            </motion.h2>
            <span className="absolute bottom-8 left-8 font-mono text-xs text-gray-500 group-hover:text-white transition-colors">
              0{index + 1}
            </span>
            <ArrowRight className="absolute top-8 right-8 w-6 h-6 text-gray-500 group-hover:text-white group-hover:-rotate-45 transition-all duration-300" />
          </Link>
        ))}
      </section>
    </div>
  )
}
